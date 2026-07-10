import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useProducts } from '../../app/context/ProductContext';
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
  ArrowLeft,
} from 'lucide-react';
import { useCart } from '../../app/context/CartContext';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, isLoading } = useProducts();
  const product = products.find(p => p.id === id);
  
  const productColors = product ? (Array.isArray(product.colors) ? product.colors : (product.color ? [product.color] : [])) : [];
  const productStorageOptions = product ? (Array.isArray(product.storage) ? product.storage : (typeof product.storage === 'string' ? [product.storage] : (product.specifications?.storage ? [product.specifications.storage] : []))) : [];

  const allMedia = product ? [
    ...(product.image ? [{ type: 'image', url: product.image }] : []),
    ...(Array.isArray(product.images) ? product.images.map((url: string) => ({ type: 'image', url })) : []),
    ...(product.video ? [{ type: 'video', url: product.video }] : [])
  ] : [];

  const [selectedColor, setSelectedColor] = useState(productColors[0] || '');
  const [selectedStorage, setSelectedStorage] = useState(productStorageOptions[0] || '');
  const [activeMedia, setActiveMedia] = useState(allMedia[0]);

  useEffect(() => {
    if (product) {
      if (!selectedColor && productColors.length > 0) setSelectedColor(productColors[0]);
      if (!selectedStorage && productStorageOptions.length > 0) setSelectedStorage(productStorageOptions[0]);
      if (!activeMedia && allMedia.length > 0) setActiveMedia(allMedia[0]);
    }
  }, [product, selectedColor, selectedStorage, activeMedia]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Loading product...</h2>
        </div>
      </div>
    );
  }

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
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Breadcrumb and Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="shrink-0 bg-white shadow-sm border-gray-200 hover:bg-gray-50">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back
          </Button>
          <div className="text-sm text-gray-600 font-medium flex flex-wrap items-center">
            <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate('/')}>Home</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate('/products')}>Products</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Media Gallery */}
          <div className="bg-white rounded-xl p-6 flex flex-col gap-4">
            {/* Main Media Display */}
            <div className="w-full h-[400px] sm:h-[500px] flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden relative">
              {activeMedia?.type === 'video' ? (
                <video
                  src={activeMedia.url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={activeMedia?.url || product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Media Thumbnails */}
            {allMedia.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar mt-4">
                {allMedia.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveMedia(media)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                      activeMedia?.url === media.url ? 'border-indigo-600 opacity-100' : 'border-transparent opacity-60 hover:opacity-100 bg-gray-100'
                    }`}
                  >
                    {media.type === 'video' ? (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center relative">
                        <video src={media.url} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center pl-0.5">
                            <svg className="w-3 h-3 text-gray-900" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img src={media.url} alt={`${product.name} thumbnail ${index}`} className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
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
            {productColors && productColors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Color: {selectedColor}</h3>
                <div className="flex gap-2">
                  {productColors.map(color => (
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
            {productStorageOptions && productStorageOptions.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Storage: {selectedStorage}</h3>
                <div className="flex gap-2">
                  {productStorageOptions.map(storage => (
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
              <div className="flex gap-3">
                <Button className="flex-1" variant="outline" onClick={handleAddToCart}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button className="flex-1 bg-slate-900 hover:bg-blue-600 text-white" onClick={() => {
                  handleAddToCart();
                  navigate('/cart');
                }}>
                  Buy Now
                </Button>
              </div>
              <div className="flex gap-3">
                <Button className="flex-1" variant="secondary" onClick={handleAddToWishlist}>
                  <Heart className="w-4 h-4 mr-2" />
                  Wishlist
                </Button>
                <Button className="flex-1" variant="outline" asChild>
                  <a href="tel:+919698237458">
                    <Phone className="w-4 h-4 mr-2" />
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
                  className="group border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full rounded-xl bg-white cursor-pointer"
                  onClick={() => navigate(`/products/${relatedProduct.id}`)}
                >
                  <CardContent className="p-0 flex flex-col h-full relative">
                    <div className="block relative bg-white p-6 pb-2">
                      <div className="relative h-48 w-full flex items-center justify-center">
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-300"
                        />
                      </div>
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {relatedProduct.originalPrice ? (
                          <span className="bg-[#7b1717] text-white text-xs font-semibold px-2.5 py-1 rounded-sm shadow-sm">Sale</span>
                        ) : (relatedProduct.condition === 'New' || relatedProduct.condition === 'Like New') ? (
                          <span className="bg-[#1f874c] text-white text-xs font-semibold px-2.5 py-1 rounded-sm shadow-sm">New</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 mb-2.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${relatedProduct.inStock ? 'bg-indigo-600' : 'bg-red-500'}`}></div>
                        <span className="text-xs font-medium text-indigo-700">
                          {relatedProduct.inStock ? `In stock ${relatedProduct.stock || 0} Items` : 'Out of Stock'}
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-900 line-clamp-2 text-base leading-snug mb-2 flex-grow">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[17px] font-bold text-gray-900">₹{relatedProduct.price.toLocaleString('en-IN')}</span>
                        {relatedProduct.originalPrice && (
                          <span className="text-sm text-gray-400 line-through font-medium">
                            ₹{relatedProduct.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mb-5 mt-auto">
                        <div className="flex gap-0.5 text-indigo-900">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3.5 h-3.5 ${i < Math.round(relatedProduct.rating || 0) ? 'fill-indigo-900 text-indigo-900' : 'fill-gray-200 text-gray-200'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1 font-medium">({relatedProduct.reviews || 0})</span>
                      </div>
                      <Button
                        className="w-full bg-[#1e1b4b] hover:bg-[#312e81] text-white rounded-md py-5 font-medium transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart({
                            id: relatedProduct.id,
                            name: relatedProduct.name,
                            price: relatedProduct.price,
                            image: relatedProduct.image,
                          });
                          toast.success('Added to cart');
                        }}
                      >
                        Order Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
