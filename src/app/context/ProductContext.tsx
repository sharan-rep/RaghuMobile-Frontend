import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { products as initialProducts, Product } from '../data/products';
import { listProducts } from '../../modules/Products/Service/ProductApi';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  isLoading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await listProducts();
        if (response && response.data && Array.isArray(response.data.items)) {
          setProducts(response.data.items);
        } else if (response && response.data && Array.isArray(response.data)) {
          setProducts(response.data);
        } else if (Array.isArray(response)) {
          setProducts(response);
        } else if (response && response.data && typeof response.data === 'string') {
          try {
            const parsed = JSON.parse(response.data);
            setProducts(Array.isArray(parsed) ? parsed : []);
          } catch (e) {
            setProducts([]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch products from backend, using initial products fallback:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, isLoading }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
}
