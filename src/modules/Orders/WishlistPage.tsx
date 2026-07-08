import { Link } from 'react-router';
import { useProducts } from '../../app/context/ProductContext';
import { useCart } from '../../app/context/CartContext';
import { Button } from '../../app/components/ui/button';
import { Card, CardContent } from '../../app/components/ui/card';
import { Badge } from '../../app/components/ui/badge';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function WishlistPage() {
  const { products } = useProducts();
  const { addToCart } = useCart();
  // Mock wishlist state
  const [wishlistItems, setWishlistItems] = useState(products.slice(0, 3));

  const handleRemove = (id: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast.success('Added to cart');
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-pink-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Save your favorite phones here and buy them later.
          </p>
          <Button size="lg" asChild>
            <Link to="/products">Explore Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
          <h1 className="text-3xl font-bold">My Wishlist</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <Card key={product.id} className="group relative overflow-hidden">
              <button 
                onClick={() => handleRemove(product.id)}
                className="absolute top-2 right-2 z-10 p-2 bg-white/80 rounded-full text-gray-500 hover:text-red-500 hover:bg-white transition-colors"
                title="Remove from wishlist"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              
              <CardContent className="p-4 flex flex-col h-full">
                <Link to={`/products/${product.id}`} className="block flex-1">
                  <div className="relative mb-4 overflow-hidden rounded-lg bg-gray-100 p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-contain group-hover:scale-105 transition-transform"
                    />
                    {product.originalPrice && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">{product.brand}</p>
                    <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold">₹{product.price.toLocaleString('en-IN')}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
                
                <Button 
                  className="w-full mt-auto" 
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
