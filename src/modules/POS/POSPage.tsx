import { useState, useMemo, useEffect } from 'react';
import { useProducts } from '../../app/context/ProductContext';
import { Product } from '../../app/data/products';
import { Input } from '../../app/components/ui/input';
import { Button } from '../../app/components/ui/button';
import { Card, CardContent } from '../../app/components/ui/card';
import { ScrollArea } from '../../app/components/ui/scroll-area';
import { Search, Plus, Minus, Trash2, LayoutGrid, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../app/context/AuthContext';
import POSPaymentModal, { PaymentDetails } from './POSPaymentModal';
import ThermalInvoice from './ThermalInvoice';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export interface CartItem {
  cartId: string;
  product: Product;
  quantity: number;
  imei: string;
  discount: number;
  unitPrice: number;
}

export default function POSPage() {
  const { products } = useProducts();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  const [gstRate, setGstRate] = useState<number>(18);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      navigate('/');
    }
  }, [user, navigate]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const lower = searchTerm.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(lower) ||
      p.brand.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower) ||
      (p.imei && p.imei.toLowerCase().includes(lower))
    );
  }, [products, searchTerm]);

  const addToCart = (product: Product, scannedImei?: string) => {
    const existing = cart.find(item => item.product.id === product.id && item.imei === (scannedImei || ''));

    if (existing) {
      setCart(cart.map(item =>
        item.cartId === existing.cartId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        cartId: Math.random().toString(36).substring(7),
        product,
        quantity: 1,
        imei: scannedImei || '',
        discount: 0,
        unitPrice: product.price
      }]);
    }
  };

  useEffect(() => {
    if (searchTerm && products.length > 0) {
      const exactMatch = products.find(p => p.imei && p.imei.toLowerCase() === searchTerm.toLowerCase());
      if (exactMatch) {
        addToCart(exactMatch, exactMatch.imei);
        setSearchTerm('');
      }
    }
  }, [searchTerm, products]);

  const updateCartItem = (cartId: string, updates: Partial<CartItem>) => {
    setCart(cart.map(item => item.cartId === cartId ? { ...item, ...updates } : item));
  };

  const removeFromCart = (cartId: string) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const totalDiscount = cart.reduce((sum, item) => sum + item.discount, 0);
  const taxableAmount = subtotal - totalDiscount;
  const tax = taxableAmount * (gstRate / 100);
  const grandTotal = taxableAmount + tax;

  const handlePaymentComplete = (paymentDetails: PaymentDetails) => {
    const data = {
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleString(),
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || 'N/A',
      items: cart,
      subtotal,
      discount: totalDiscount,
      tax,
      gstRate,
      total: grandTotal,
      paymentMethod: paymentDetails.method,
      amountPaid: paymentDetails.amountPaid,
      splitDetails: paymentDetails.splitDetails,
      cashier: user?.name || 'Staff'
    };
    
    setInvoiceData(data);
    setIsPaymentModalOpen(false);

    setTimeout(() => {
      window.print();
      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
      setInvoiceData(null);
    }, 500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f3f4f6] font-sans">
      <div className="print:hidden flex flex-col min-h-screen">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between bg-white px-4 py-3 border-b shadow-sm z-50 shrink-0">
          <div className="flex items-center gap-4 w-1/4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-[#111827] flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-gray-500" /> POS Terminal
            </h1>
          </div>
          <div className="flex-1 max-w-2xl px-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search products by name, brand, or category..."
                className="pl-10 h-10 bg-gray-50 border-gray-200 rounded-full w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <div className="w-1/4 flex justify-end">
            <span className="text-gray-600 font-medium">
              Cashier: {user?.name} ({isAdmin ? 'Admin' : 'Staff'})
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 items-stretch">
          {/* Left Panel: Products */}
          <div className="w-2/3 flex flex-col">
            <div className="flex-1 p-4 bg-gray-50">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
                {filteredProducts.map(product => (
                  <Card
                    key={product.id}
                    className="cursor-pointer hover:border-blue-400 transition-all shadow-sm bg-white overflow-hidden"
                    onClick={() => addToCart(product)}
                  >
                    <div className="aspect-square relative p-4 flex items-center justify-center bg-white border-b border-gray-50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <CardContent className="p-3">
                      <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                      <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 mb-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mt-auto mb-1">
                        <span className="font-bold text-blue-600">₹{product.price.toLocaleString('en-IN')}</span>
                        <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                      </div>
                      {product.imei && (
                        <p className="text-xs text-gray-500 font-medium text-left">IMEI: {product.imei}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Cart */}
          <div className="w-1/3 flex flex-col bg-white shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-20">
            
            {/* Customer Info */}
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wider">Customer Details</h2>
              <div className="space-y-3">
                <Input
                  placeholder="Customer Phone (Optional)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="bg-white rounded-lg border-gray-200"
                />
                <Input
                  placeholder="Customer Name (Walk-in if empty)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="bg-white rounded-lg border-indigo-300 ring-2 ring-indigo-50"
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4 py-20 px-8 text-center">
                  <Search className="w-10 h-10 opacity-30" />
                  <p className="text-sm">Cart is empty. Add products to start billing.</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {cart.map((item, idx) => (
                    <div key={item.cartId} className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 pr-2">
                          <h4 className="font-semibold text-sm text-gray-800 line-clamp-1">{item.product.name}</h4>
                          <p className="text-xs text-gray-500">{item.product.brand}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-red-600 -mt-1 -mr-1" onClick={() => removeFromCart(item.cartId)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <Input
                          placeholder="IMEI/Serial No."
                          className="h-8 text-xs bg-gray-50"
                          value={item.imei}
                          onChange={(e) => updateCartItem(item.cartId, { imei: e.target.value })}
                        />
                        {isAdmin ? (
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">₹</span>
                            <Input
                              type="number"
                              className="h-8 text-xs pl-5 bg-yellow-50 border-yellow-200"
                              value={item.unitPrice}
                              onChange={(e) => updateCartItem(item.cartId, { unitPrice: Number(e.target.value) })}
                              title="Admin Price Override"
                            />
                          </div>
                        ) : (
                          <div className="h-8 text-xs flex items-center justify-end font-medium px-2 bg-gray-50 rounded border border-gray-100 text-gray-600">
                            ₹{item.unitPrice.toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-100 pt-2 mt-2">
                        <div className="flex items-center gap-1 bg-gray-100 rounded-md p-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded bg-white shadow-sm"
                            onClick={() => updateCartItem(item.cartId, { quantity: Math.max(1, item.quantity - 1) })}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded bg-white shadow-sm"
                            onClick={() => updateCartItem(item.cartId, { quantity: item.quantity + 1 })}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          {isAdmin && (
                            <Input
                              placeholder="Discount"
                              type="number"
                              className="h-7 w-20 text-xs border-dashed border-gray-300"
                              value={item.discount || ''}
                              onChange={(e) => updateCartItem(item.cartId, { discount: Number(e.target.value) })}
                            />
                          )}
                          <span className="font-bold text-sm text-gray-800">
                            ₹{((item.unitPrice * item.quantity) - item.discount).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Totals & Actions */}
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-red-500">
                  <span>Discount</span>
                  <span>- ₹{totalDiscount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600 items-center">
                  <span>Tax ({gstRate}% GST)</span>
                  <span>₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 mt-2 flex justify-between font-bold text-lg text-gray-900 border-t border-gray-100">
                  <span>Grand Total</span>
                  <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50 rounded-lg h-10"
                  onClick={() => setCart([])}
                  disabled={cart.length === 0}
                >
                  Clear
                </Button>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-10 shadow-sm"
                  onClick={() => {
                    if (!customerName.trim() && !customerPhone.trim()) {
                      // Optionally enforce customer name here if needed
                    }
                    setIsPaymentModalOpen(true);
                  }}
                  disabled={cart.length === 0}
                >
                  Pay ₹{grandTotal.toLocaleString('en-IN')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <POSPaymentModal
          totalAmount={grandTotal}
          onClose={() => setIsPaymentModalOpen(false)}
          onComplete={handlePaymentComplete}
        />
      )}

      {/* Hidden Print Invoice */}
      <div className="hidden print:block">
        {invoiceData && <ThermalInvoice data={invoiceData} />}
      </div>
    </div>
  );
}
