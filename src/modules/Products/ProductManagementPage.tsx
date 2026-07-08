import { useState, useEffect } from 'react';
import { useAuth } from '../../app/context/AuthContext';
import { useProducts } from '../../app/context/ProductContext';
import { useNavigate, Link } from 'react-router';
import { Card, CardContent } from '../../app/components/ui/card';
import { Badge } from '../../app/components/ui/badge';
import { Button } from '../../app/components/ui/button';
import { Package, Plus, Search, AlertTriangle, Edit2, Trash2, Star } from 'lucide-react';

export default function ProductManagementPage() {
  const { user } = useAuth();
  const { products } = useProducts();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || (user.role !== 'admin' && user.role !== 'staff')) return null;

  // Since stock isn't fully managed in current context, let's derive a mock stock for UI demonstration
  // In a real app, product.stock would be used. If inStock is true, we'll assign random stock based on id for demo,
  // or default to 15. If it's the specific products in the screenshot (One Plus Nord 5, etc.), we can mock the values.
  const getMockStock = (id: string, inStock: boolean) => {
    if (!inStock) return 0;
    // Just a deterministic way to get a stock number for the UI, including a low stock one
    const num = id.length % 20; 
    return num === 0 ? 1 : num; 
  };

  const enhancedProducts = products.map(p => {
    const stock = (p as any).stock !== undefined ? (p as any).stock : getMockStock(p.id, p.inStock);
    return { ...p, stock, condition: (p as any).condition || 'Good' };
  });

  const filteredProducts = enhancedProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockProducts = enhancedProducts.filter(p => p.stock > 0 && p.stock <= 5);
  const outOfStockProducts = enhancedProducts.filter(p => p.stock === 0);
  const totalLowStock = lowStockProducts.length + outOfStockProducts.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-[1400px]">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
              <p className="text-sm text-gray-500 font-medium">
                {products.length} products 
                {totalLowStock > 0 && (
                  <span className="text-red-500 ml-1">· {totalLowStock} low stock</span>
                )}
              </p>
            </div>
          </div>
          <Button className="bg-[#4F46E5] hover:bg-[#4338ca] text-white rounded-md px-4 py-2 flex items-center gap-2" asChild>
            <Link to="/admin/products/add">
              <Plus className="w-4 h-4" />
              Add Product
            </Link>
          </Button>
        </div>

        {/* Low Stock Alert */}
        {totalLowStock > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6 flex items-center gap-3 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <p className="font-medium text-sm">
              {totalLowStock} product{totalLowStock > 1 ? 's are' : ' is'} running low on stock
            </p>
          </div>
        )}

        {/* Products Table Card */}
        <Card className="border-none shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-0">
            {/* Table Toolbar */}
            <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Products ({filteredProducts.length})</h2>
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Brand</th>
                    <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Condition</th>
                    <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center p-2 overflow-hidden flex-shrink-0 border border-gray-100">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain mix-blend-multiply"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{product.brand}</td>
                      <td className="p-4">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none rounded-md px-2.5 py-0.5 font-medium">
                          {product.condition}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm font-bold text-gray-900">
                        ₹{product.price.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-amber-600">{product.rating}</span>
                          <span className="text-gray-400">({product.reviews})</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${product.stock <= 5 ? 'text-red-600' : 'text-gray-900'}`}>
                            {product.stock}
                          </span>
                          {product.stock <= 5 && (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <button className="text-blue-500 hover:text-blue-700 transition-colors" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="text-red-500 hover:text-red-700 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500">
                        No products found matching "{searchTerm}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
