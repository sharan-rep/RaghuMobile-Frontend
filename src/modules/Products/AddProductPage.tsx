import { useState, useEffect } from 'react';
import { useAuth } from '../../app/context/AuthContext';
import { useProducts } from '../../app/context/ProductContext';
import { useNavigate, useSearchParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../app/components/ui/card';
import { Button } from '../../app/components/ui/button';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { createProduct, getProduct, updateProduct } from './Service/ProductApi';

export default function AddProductPage() {
  const { user } = useAuth();
  const { addProduct } = useProducts();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (editId) {
      const fetchProduct = async () => {
        try {
          const res = await getProduct(editId);
          const data = res.data || res;
          setFormData({
            name: data.name || '',
            brand: data.brand || '',
            price: data.price?.toString() || '',
            originalPrice: data.originalPrice?.toString() || '',
            imei: data.imei || '',
            category: data.category || 'Smart Phone',
            stock: data.stock?.toString() || '',
            color: data.color || '',
            condition: data.condition || '',
            description: data.description || '',
            display: data.specifications?.display || '',
            processor: data.specifications?.processor || '',
            ram: data.specifications?.ram || '',
            storage: data.specifications?.storage || '',
            camera: data.specifications?.camera || '',
            battery: data.specifications?.battery || '',
            accessoryType: data.specifications?.type || '',
            compatibility: data.specifications?.compatibility || '',
            connectivity: data.specifications?.connectivity || '',
            material: data.specifications?.material || '',
            powerOutput: data.specifications?.powerOutput || '',
            cableLength: data.specifications?.cableLength || '',
            batteryLife: data.specifications?.batteryLife || '',
            noiseCancellation: data.specifications?.noiseCancellation || '',
          });
          
          if (data.images && data.images.length > 0) {
            setExistingImages(data.images);
          } else if (data.image) {
            setExistingImages([data.image]);
          } else {
            setExistingImages([]);
          }
          
          if (data.video) {
            setExistingVideo(data.video);
          } else {
            setExistingVideo('');
          }
        } catch (error) {
          toast.error('Failed to load product details');
        }
      };
      fetchProduct();
    }
  }, [editId]);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    originalPrice: '',
    imei: '',
    category: 'Smart Phone',
    stock: '',
    color: '',
    condition: '',
    description: '',
    display: '',
    processor: '',
    ram: '',
    storage: '',
    camera: '',
    battery: '',
    accessoryType: '',
    compatibility: '',
    connectivity: '',
    material: '',
    powerOutput: '',
    cableLength: '',
    batteryLife: '',
    noiseCancellation: '',
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  
  // Track if user wants to keep existing images/video or replace them
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingVideo, setExistingVideo] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(files);
      setImagePreviews(files.map(file => URL.createObjectURL(file)));
      setExistingImages([]); // Clear existing if new selected
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setExistingVideo(''); // Clear existing if new selected
    }
  };

  const removeImage = (index: number) => {
    if (imagePreviews.length > 0 && imageFiles.length > 0) {
      setImageFiles(prev => prev.filter((_, i) => i !== index));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    } else if (existingImages.length > 0) {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview('');
    setExistingVideo('');
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
      };

      let imageStr = existingImages.length > 0 ? existingImages[0] : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400';
      let imagesArr = [...existingImages];
      let videoStr = existingVideo;

      if (imageFiles.length > 0) {
        imageStr = await fileToBase64(imageFiles[0]);
        imagesArr = [];
        for (const file of imageFiles) {
          imagesArr.push(await fileToBase64(file));
        }
      }

      if (videoFile) {
        videoStr = await fileToBase64(videoFile);
      }

      const productPayload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : 0,
        imei: formData.imei,
        image: imageStr,
        images: imagesArr,
        video: videoStr,
        brand: formData.brand,
        category: formData.category,
        stock: Number(formData.stock),
        inStock: true,
        condition: formData.condition,
        storage: formData.storage,
        color: formData.color,
        specifications: {
          ram: formData.ram || undefined,
          storage: formData.storage || undefined,
        },
      };

      let response;
      if (editId) {
        response = await updateProduct(editId, productPayload);
      } else {
        response = await createProduct(productPayload);
      }

      if (response.data) {
        addProduct(response.data);
      } else {
        addProduct({ ...productPayload, id: Date.now().toString(), rating: 0, reviews: 0 } as any);
      }

      toast.success(`Product ${editId ? 'updated' : 'added'} successfully!`);
      navigate('/admin/products');

      // Reset form
      setFormData({
        name: '',
        brand: '',
        price: '',
        originalPrice: '',
        imei: '',
        category: 'Smart Phone',
        stock: '',
        color: '',
        condition: '',
        description: '',
        display: '',
        processor: '',
        ram: '',
        storage: '',
        camera: '',
        battery: '',
        accessoryType: '',
        compatibility: '',
        connectivity: '',
        material: '',
        powerOutput: '',
        cableLength: '',
        batteryLife: '',
        noiseCancellation: '',
      });
      setImageFiles([]);
      setVideoFile(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">{editId ? 'Update Product' : 'Add New Product'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Brand *</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Original Price (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">IMEI *</label>
                  <input
                    type="text"
                    required
                    value={formData.imei}
                    onChange={(e) => setFormData({ ...formData, imei: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Stock *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Color</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">New / Not Applicable</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Image Upload</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer text-gray-500"
                  />
                  {imagePreviews.length > 0 ? (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {imagePreviews.map((src, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                          <img
                            src={src}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                          >
                            <X className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : existingImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {existingImages.map((src, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                          <img
                            src={src}
                            alt={`Existing ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                          >
                            <X className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Video Upload</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer text-gray-500"
                  />
                  {videoPreview ? (
                    <div className="mt-4 relative rounded-lg overflow-hidden border bg-gray-50">
                      <video
                        src={videoPreview}
                        controls
                        className="w-full max-h-60"
                      />
                      <button
                        type="button"
                        onClick={removeVideo}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 z-10"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  ) : existingVideo && (
                    <div className="mt-4 relative rounded-lg overflow-hidden border bg-gray-50">
                      <video
                        src={existingVideo}
                        controls
                        className="w-full max-h-60"
                      />
                      <button
                        type="button"
                        onClick={removeVideo}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 z-10"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Smart Phone">Smart Phone</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>



                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Description *</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Specifications */}
                <div className="md:col-span-2">
                  <h3 className="font-medium mb-4">Specifications</h3>
                  {formData.category === 'Smart Phone' ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm">RAM</label>
                        <input
                          type="text"
                          value={formData.ram}
                          onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="8GB"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm">Storage</label>
                        <input
                          type="text"
                          value={formData.storage}
                          onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="256GB"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm">Accessory Type</label>
                          <select
                            value={formData.accessoryType}
                            onChange={(e) => setFormData({ ...formData, accessoryType: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Type</option>
                            <option value="Charger">Charger</option>
                            <option value="Case">Back Cases & Covers</option>
                            <option value="Headphone">Headphones & Earbuds</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm">Compatibility</label>
                          <input
                            type="text"
                            value={formData.compatibility}
                            onChange={(e) => setFormData({ ...formData, compatibility: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. iPhone 15, Universal"
                          />
                        </div>
                      </div>

                      {formData.accessoryType === 'Charger' && (
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm">Power Output</label>
                            <input
                              type="text"
                              value={formData.powerOutput}
                              onChange={(e) => setFormData({ ...formData, powerOutput: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g. 20W, 65W"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm">Cable Length</label>
                            <input
                              type="text"
                              value={formData.cableLength}
                              onChange={(e) => setFormData({ ...formData, cableLength: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g. 1m, 2m"
                            />
                          </div>
                        </div>
                      )}

                      {formData.accessoryType === 'Case' && (
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm">Material</label>
                            <input
                              type="text"
                              value={formData.material}
                              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g. Silicone, Leather"
                            />
                          </div>
                        </div>
                      )}

                      {formData.accessoryType === 'Headphone' && (
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm">Connectivity</label>
                            <input
                              type="text"
                              value={formData.connectivity}
                              onChange={(e) => setFormData({ ...formData, connectivity: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g. Bluetooth 5.3, Wired"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm">Battery Life</label>
                            <input
                              type="text"
                              value={formData.batteryLife}
                              onChange={(e) => setFormData({ ...formData, batteryLife: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g. 30 hours"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm">Noise Cancellation</label>
                            <select
                              value={formData.noiseCancellation}
                              onChange={(e) => setFormData({ ...formData, noiseCancellation: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (editId ? 'Updating...' : 'Adding...') : (editId ? 'Update Product' : 'Add Product')}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="lg" 
                  onClick={() => navigate(`/${user?.role === 'staff' ? 'staff' : 'admin'}/products`)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
