import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { products } from '../../app/data/products';
import { Button } from '../../app/components/ui/button';
import { Badge } from '../../app/components/ui/badge';
import { Card, CardContent } from '../../app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../app/components/ui/tabs';
import { Separator } from '../../app/components/ui/separator';
import {
  Star,
  Truck,
  RotateCcw,
  Shield,
  Check,
  Phone,
  CalendarDays,
  ChevronRight,
  ShoppingCart,
  Heart,
} from 'lucide-react';
import { useCart } from '../../app/context/CartContext';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [selectedStorage, setSelectedStorage] = useState(product?.storage?.[0] || '');
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        color: selectedColor,
        storage: selectedStorage
      });
      toast.success('Added to cart');
    }
  };

  const handleAddToWishlist = () => {
    toast.success('Added to wishlist');
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/')}>Home</span>
          <span className="mx-2">/</span>
          <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/products')}>Products</span>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="bg-white rounded-xl p-8">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto max-h-[500px] object-contain"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge>{product.category}</Badge>
                {product.condition && (
                  <Badge variant="outline" className="text-gray-700 bg-gray-50">
                    Condition: {product.condition}
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 mb-2">{product.brand}</p>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{product.rating}</span>
                </div>
                <span className="text-gray-600">({product.reviews} reviews)</span>
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold">₹{product.price.toLocaleString('en-IN')}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              {product.originalPrice && (
                <p className="text-green-600 font-medium">
                  You save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}{' '}
                  ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off)
                </p>
              )}
            </div>

            <Separator />

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Color: {selectedColor}</h3>
                <div className="flex gap-2">
                  {product.colors.map(color => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Storage Selection */}
            {product.storage && product.storage.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Storage: {selectedStorage}</h3>
                <div className="flex gap-2">
                  {product.storage.map(storage => (
                    <Button
                      key={storage}
                      variant={selectedStorage === storage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedStorage(storage)}
                    >
                      {storage}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button size="lg" className="w-full" onClick={handleAddToCart}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button size="lg" variant="secondary" onClick={handleAddToWishlist}>
                  <Heart className="w-5 h-5 mr-2" />
                  Wishlist
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="tel:+919698237458">
                    <Phone className="w-5 h-5 mr-2" />
                    Call Us
                  </a>
                </Button>
              </div>
            </div>

            <Badge variant={product.inStock ? 'default' : 'secondary'} className="text-base py-2 px-4">
              {product.inStock ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  In Stock
                </>
              ) : (
                'Out of Stock'
              )}
            </Badge>

            {/* Features */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Free Delivery</p>
                    <p className="text-sm text-gray-600">On orders above ₹5,000</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">7 Days Replacement</p>
                    <p className="text-sm text-gray-600">Easy returns policy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Official Warranty</p>
                    <p className="text-sm text-gray-600">Brand warranty included</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <Tabs defaultValue="description">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-6">
                <h3 className="font-semibold text-lg mb-4">Product Description</h3>
                <p className="text-gray-700">{product.description}</p>
              </TabsContent>
              <TabsContent value="specifications" className="mt-6">
                <h3 className="font-semibold text-lg mb-4">Technical Specifications</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b pb-2">
                      <span className="text-gray-600 capitalize">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-lg">Customer Reviews</h3>
                  <Button variant="outline" size="sm">Write a Review</Button>
                </div>
                <div className="space-y-6">
                  {/* Mock Review 1 */}
                  <div className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                          JD
                        </div>
                        <span className="font-medium">John Doe</span>
                      </div>
                      <span className="text-sm text-gray-500">2 days ago</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700">Great product! The condition was exactly as described. Very happy with my purchase.</p>
                  </div>
                  {/* Mock Review 2 */}
                  <div className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-sm">
                          SA
                        </div>
                        <span className="font-medium">Sarah Adams</span>
                      </div>
                      <span className="text-sm text-gray-500">1 week ago</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <Star className="w-4 h-4 text-gray-300" />
                    </div>
                    <p className="text-gray-700">Good value for the money. Fast delivery and excellent customer service.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Related Products */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Related Products</h2>
            <Button variant="outline" asChild>
              <Link to="/products">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products
              .filter(p => p.brand === product.brand && p.id !== product.id)
              .slice(0, 4)
              .map(relatedProduct => (
                <Card
                  key={relatedProduct.id}
                  className="group hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => navigate(`/products/${relatedProduct.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="relative mb-4 overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h3 className="font-semibold line-clamp-2 mb-2">{relatedProduct.name}</h3>
                    <p className="text-xl font-bold">₹{relatedProduct.price.toLocaleString('en-IN')}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
