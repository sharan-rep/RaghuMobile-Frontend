import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../app/context/AuthContext';

import { useNavigate, Link } from 'react-router';
import { Card, CardContent } from '../../app/components/ui/card';
import { Badge } from '../../app/components/ui/badge';
import { Button } from '../../app/components/ui/button';
import { Package, Plus, Search, Edit2, Trash2, Star, Download, UploadCloud, FileSpreadsheet, X } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductManagementPage() {
  const { user } = useAuth();

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [backendProducts, setBackendProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10); // Items per page

  const fetchProducts = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const { listProducts } = await import('./Service/ProductApi');
      const response = await listProducts(page, limit);
      if (response && response.data && Array.isArray(response.data.items)) {
        setBackendProducts(response.data.items);
        const total = response.data.total || 0;
        setTotalItems(total);
        setTotalPages(Math.ceil(total / limit) || 1);
      } else if (response && response.data && Array.isArray(response.data)) {
        setBackendProducts(response.data);
      } else if (Array.isArray(response)) {
        setBackendProducts(response);
      } else if (response && response.data && typeof response.data === 'string') {
        try {
          const parsed = JSON.parse(response.data);
          setBackendProducts(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          setBackendProducts([]);
        }
      } else {
        setBackendProducts([]);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [fetchProducts, currentPage]);

  const handleDownloadSample = async () => {
    setIsDownloading(true);
    try {
      const { downloadSampleExcel } = await import('./Service/ProductApi');
      await downloadSampleExcel();
      toast.success('Sample Excel downloaded successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to download sample');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      const { bulkUploadExcel } = await import('./Service/ProductApi');
      await bulkUploadExcel(selectedFile);
      toast.success('File uploaded successfully!');
      setIsBulkUploadModalOpen(false);
      setSelectedFile(null);
      setCurrentPage(1); // Reset to first page
      await fetchProducts(1); // Refresh the list
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload excel file');
    } finally {
      setIsUploading(false);
    }
  };

  const confirmDelete = (id: string) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      const { deleteProduct } = await import('./Service/ProductApi');
      await deleteProduct(productToDelete);
      setBackendProducts(prev => prev.filter(p => p.id !== productToDelete));
      toast.success('Product deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product');
    } finally {
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || (user.role !== 'admin' && user.role !== 'staff')) return null;

  const filteredProducts = (Array.isArray(backendProducts) ? backendProducts : []).filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                {backendProducts.length} products
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md px-4 py-2 flex items-center gap-2"
              onClick={handleDownloadSample}
              disabled={isDownloading}
            >
              <Download className="w-4 h-4" />
              {isDownloading ? 'Downloading...' : 'Download Sample'}
            </Button>
            <Button
              className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md px-4 py-2 flex items-center gap-2"
              onClick={() => setIsBulkUploadModalOpen(true)}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Bulk Excel Upload
            </Button>
            <Button className="bg-[#4F46E5] hover:bg-[#4338ca] text-white rounded-md px-4 py-2 flex items-center gap-2" asChild>
              <Link to="/admin/products/add">
                <Plus className="w-4 h-4" />
                Add Product
              </Link>
            </Button>
          </div>
        </div>


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
                              src={product.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'}
                              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'; }}
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
                        <div className="flex items-center gap-3">
                          <Link to={`/admin/products/add?edit=${product.id}`} className="text-blue-500 hover:text-blue-700 transition-colors" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button onClick={() => confirmDelete(product.id)} className="text-red-500 hover:text-red-700 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        {isLoading ? 'Loading products...' : `No products found matching "${searchTerm}"`}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
                <div className="text-gray-500">
                  Showing <span className="font-medium text-gray-900">{Math.min((currentPage - 1) * limit + 1, totalItems)}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * limit, totalItems)}</span> of <span className="font-medium text-gray-900">{totalItems}</span> results
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || isLoading}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || isLoading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Product</h3>
            <p className="text-gray-500 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setProductToDelete(null);
                }}
                className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {isBulkUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Excel Upload</h3>

            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
              onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
              onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  setSelectedFile(e.dataTransfer.files[0]);
                }
              }}
            >
              <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-1">
                Drag and drop your Excel file here, or
              </p>
              <label className="text-blue-600 hover:text-blue-700 cursor-pointer text-sm font-medium">
                browse files
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>

            {selectedFile && (
              <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileSpreadsheet className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate">{selectedFile.name}</span>
                </div>
                <button onClick={() => setSelectedFile(null)} className="text-gray-400 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsBulkUploadModalOpen(false);
                  setSelectedFile(null);
                }}
                className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                disabled={!selectedFile || isUploading}
                onClick={handleBulkUpload}
                className="bg-[#4F46E5] hover:bg-[#4338ca] text-white"
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
