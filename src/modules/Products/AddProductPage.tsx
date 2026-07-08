import { useState, useEffect } from 'react';
import { useAuth } from '../../app/context/AuthContext';
import { useProducts } from '../../app/context/ProductContext';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../app/components/ui/card';
import { Button } from '../../app/components/ui/button';
import { X } from 'lucide-react';
import { toast } from 'sonner';

export default function AddProductPage() {
  const { user } = useAuth();
  const { addProduct } = useProducts();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      navigate('/');
    }
  }, [user, navigate]);

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
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setVideoFile(e.target.files[0]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setVideoFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const imageStr = imageFiles.length > 0 ? URL.createObjectURL(imageFiles[0]) : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400';
    const imagesArr = imageFiles.map(file => URL.createObjectURL(file));
    const videoStr = videoFile ? URL.createObjectURL(videoFile) : '';

    const newProduct = {
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
        display: formData.display || undefined,
        processor: formData.processor || undefined,
        ram: formData.ram || undefined,
        storage: formData.storage || undefined,
        camera: formData.camera || undefined,
        battery: formData.battery || undefined,
        type: formData.accessoryType || undefined,
        compatibility: formData.compatibility || undefined,
        connectivity: formData.connectivity || undefined,
        material: formData.material || undefined,
        powerOutput: formData.powerOutput || undefined,
        cableLength: formData.cableLength || undefined,
        batteryLife: formData.batteryLife || undefined,
        noiseCancellation: formData.noiseCancellation || undefined,
      },
    };

    addProduct(newProduct);
    toast.success('Product added successfully!');

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
  };

  if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Add New Product</CardTitle>
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
                  <label className="text-sm font-medium">IMEI</label>
                  <input
                    type="text"
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
                  {imageFiles.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {imageFiles.map((file, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                          <img 
                            src={URL.createObjectURL(file)} 
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
                  {videoFile && (
                    <div className="mt-4 relative rounded-lg overflow-hidden border bg-gray-50">
                      <video 
                        src={URL.createObjectURL(videoFile)} 
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
                        <label className="text-sm">Display</label>
                        <input
                          type="text"
                          value={formData.display}
                          onChange={(e) => setFormData({ ...formData, display: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder='6.7" AMOLED'
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm">Processor</label>
                        <input
                          type="text"
                          value={formData.processor}
                          onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Snapdragon 8 Gen 2"
                        />
                      </div>

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

                      <div className="space-y-2">
                        <label className="text-sm">Camera</label>
                        <input
                          type="text"
                          value={formData.camera}
                          onChange={(e) => setFormData({ ...formData, camera: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="48MP + 12MP"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm">Battery</label>
                        <input
                          type="text"
                          value={formData.battery}
                          onChange={(e) => setFormData({ ...formData, battery: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="5000 mAh"
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
                <Button type="submit" size="lg">
                  Add Product
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={() => navigate('/dashboard')}>
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
