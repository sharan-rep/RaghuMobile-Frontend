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
      <div className="container mx-auto px-4 pt-24 pb-8">
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
            <Card key={product.id} className="group border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full rounded-xl bg-white">
              <CardContent className="p-0 flex flex-col h-full relative">
                {/* Image Section */}
                <Link to={`/products/${product.id}`} className="block relative bg-white p-6 pb-2">
                  <div className="relative h-56 w-full flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  </div>
                  {/* Badges - Top left */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.originalPrice ? (
                      <span className="bg-[#7b1717] text-white text-xs font-semibold px-2.5 py-1 rounded-sm shadow-sm">Sale</span>
                    ) : (product.condition === 'Like New') ? (
                      <span className="bg-[#1f874c] text-white text-xs font-semibold px-2.5 py-1 rounded-sm shadow-sm">New</span>
                    ) : null}
                  </div>
                </Link>

                {/* Info Section */}
                <div className="p-4 flex flex-col flex-grow">
                  <Link to={`/products/${product.id}`} className="flex flex-col flex-grow">
                    {/* Stock indicator */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-indigo-600' : 'bg-red-500'}`}></div>
                      <span className="text-xs font-medium text-indigo-700">
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-medium text-gray-900 line-clamp-2 text-base leading-snug mb-2 flex-grow">
                      {product.name}
                    </h3>
                    
                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[17px] font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through font-medium">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex gap-0.5 text-indigo-900">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${i < Math.round(product.rating || 0) ? 'fill-indigo-900 text-indigo-900' : 'fill-gray-200 text-gray-200'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1 font-medium">({product.reviews || 0})</span>
                    </div>
                  </Link>
                  
                  {/* Action Button */}
                  <Button
                    className="w-full bg-[#1e1b4b] hover:bg-[#312e81] text-white rounded-md h-10 font-medium transition-colors mt-2"
                    onClick={(e) => {
                      e.preventDefault();
                      if (isAuthenticated) {
                        navigate(`/products/${product.id}`);
                      } else {
                        navigate('/login');
                      }
                    }}
                  >
                    Order Now
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