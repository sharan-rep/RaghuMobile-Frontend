import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router';
import { useProducts } from '../../app/context/ProductContext';
import { useCustomerAuth } from '../../app/context/CustomerAuthContext';
import { useCart } from '../../app/context/CartContext';
import { Button } from '../../app/components/ui/button';
import { Card, CardContent } from '../../app/components/ui/card';
import { Badge } from '../../app/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../app/components/ui/select';
import { Star, SlidersHorizontal } from 'lucide-react';

export default function ProductsPage() {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const brandFilter = searchParams.get('brand');
  const [sortBy, setSortBy] = useState('featured');
  const { isAuthenticated } = useCustomerAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const brands = Array.from(new Set(products.map(p => p.brand)));

  let filteredProducts = [...products];

  // Filter by category and brand
  if (categoryFilter) {
    filteredProducts = filteredProducts.filter(
      p => p.category.toLowerCase() === categoryFilter.toLowerCase()
    );
  }
  if (brandFilter) {
    filteredProducts = filteredProducts.filter(
      p => p.brand.toLowerCase() === brandFilter.toLowerCase()
    );
  }

  // Sort products
  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {categoryFilter ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Phones` : 'All Products'}
          </h1>
          <p className="text-gray-600">{filteredProducts.length} products found</p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
            {categoryFilter && (
              <Badge variant="secondary" className="text-sm">
                {categoryFilter}
                <Link to="/products" className="ml-2">×</Link>
              </Badge>
            )}
            {brandFilter && (
              <Badge variant="secondary" className="text-sm">
                {brandFilter}
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.delete('brand');
                    setSearchParams(params);
                  }}
                  className="ml-2"
                >×</button>
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Select value={brandFilter || 'all'} onValueChange={(val) => {
              const params = new URLSearchParams(searchParams);
              if (val === 'all') params.delete('brand');
              else params.set('brand', val);
              setSearchParams(params);
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-shadow">
              <CardContent className="p-4">
                <Link to={`/products/${product.id}`}>
                  <div className="relative mb-4 overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform"
                    />
                    {product.originalPrice && (
                      <Badge className="absolute top-2 right-2 bg-red-500">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                    {product.condition && (
                      <Badge variant="secondary" className="absolute top-2 left-2 bg-white text-black hover:bg-gray-100 shadow-sm border-none">
                        {product.condition}
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">{product.brand}</p>
                    <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-sm text-gray-600">({product.reviews})</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">₹{product.price.toLocaleString('en-IN')}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <Badge variant={product.inStock ? 'default' : 'secondary'}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>
                </Link>
                <div className="mt-4 flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isAuthenticated) {
                        navigate('/login');
                      } else {
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.image,
                        });
                      }
                    }}
                  >
                    Add Cart
                  </Button>
                  <Button
                    className="flex-1"
                    variant="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isAuthenticated) {
                        navigate('/login');
                      } else {
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.image,
                        });
                        navigate('/cart');
                      }
                    }}
                  >
                    Buy Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found</p>
            <Button className="mt-4" asChild>
              <Link to="/products">View All Products</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}