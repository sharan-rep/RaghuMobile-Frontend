import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as CartApi from '../../modules/Orders/Service/CartApi';
import { useProducts } from './ProductContext';

export interface CartItem {
  id: string; // Maps to product_id
  item_id?: string; // Cart item ID from API
  name: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
  storage?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity' | 'item_id'>) => void;
  removeFromCart: (id: string, itemId?: string) => void;
  updateQuantity: (id: string, quantity: number, itemId?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { products, isLoading: productsLoading } = useProducts();

  const fetchCart = async () => {
    try {
      const response = await CartApi.getCart();
      if (response && response.data && response.data.items) {
        const apiItems = response.data.items;
        
        const mappedItems: CartItem[] = apiItems.map((apiItem: any) => {
          const product = products.find(p => p.id === apiItem.product_id);
          return {
            id: apiItem.product_id,
            item_id: apiItem.item_id,
            name: product?.name || 'Unknown Product',
            price: product?.price || 0,
            image: product?.image || '',
            quantity: apiItem.quantity,
            color: apiItem.color,
            storage: apiItem.storage
          };
        });
        setItems(mappedItems);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  useEffect(() => {
    if (!productsLoading) {
      fetchCart();
    }
  }, [products, productsLoading]);

  const addToCart = async (item: Omit<CartItem, 'quantity' | 'item_id'>) => {
    try {
      const existingItem = items.find(i => i.id === item.id);
      
      if (existingItem && existingItem.item_id) {
        const newQuantity = existingItem.quantity + 1;
        await CartApi.updateCartItem(existingItem.item_id, { quantity: newQuantity });
        
        setItems(prevItems =>
          prevItems.map(i =>
            i.id === item.id ? { ...i, quantity: newQuantity } : i
          )
        );
      } else {
        const payload = {
          product_id: item.id,
          quantity: 1,
          color: item.color,
          storage: item.storage
        };
        
        const response = await CartApi.addCartItem(payload);
        if (response.status === 'success') {
           await fetchCart();
        }
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const removeFromCart = async (id: string, itemId?: string) => {
    try {
      const targetItem = items.find(i => i.id === id);
      const targetItemId = itemId || targetItem?.item_id;
      
      if (targetItemId) {
        await CartApi.removeCartItem(targetItemId);
      }
      
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  const updateQuantity = async (id: string, quantity: number, itemId?: string) => {
    if (quantity <= 0) {
      await removeFromCart(id, itemId);
      return;
    }
    
    try {
      const targetItem = items.find(i => i.id === id);
      const targetItemId = itemId || targetItem?.item_id;
      
      if (targetItemId) {
        await CartApi.updateCartItem(targetItemId, { quantity });
      }
      
      setItems(prevItems =>
        prevItems.map(item => (item.id === id ? { ...item, quantity } : item))
      );
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const clearCart = async () => {
    try {
      await CartApi.clearCart();
      setItems([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
