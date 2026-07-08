import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useCart } from '../../app/context/CartContext';
import { Button } from '../../app/components/ui/button';
import { Input } from '../../app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../app/components/ui/card';
import { toast } from 'sonner';
import { CreditCard, Wallet, Truck } from 'lucide-react';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/track-order');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Checkout</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name</label>
                      <Input placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name</label>
                      <Input placeholder="Doe" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Address</label>
                    <Input placeholder="123 Main St, Apartment 4B" required />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">City</label>
                      <Input placeholder="Mumbai" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">State</label>
                      <Input placeholder="Maharashtra" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">PIN Code</label>
                      <Input placeholder="400001" required />
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-blue-600" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className={`border rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'card' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="font-medium text-sm">Credit/Debit Card</span>
                  </div>
                  <div
                    className={`border rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'upi' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <Wallet className="w-6 h-6" />
                    <span className="font-medium text-sm">UPI</span>
                  </div>
                  <div
                    className={`border rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <Truck className="w-6 h-6" />
                    <span className="font-medium text-sm">Cash on Delivery</span>
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Card Number</label>
                      <Input placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Expiry Date</label>
                        <Input placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">CVV</label>
                        <Input placeholder="123" type="password" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">UPI ID</label>
                      <Input placeholder="username@upi" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {items.map(item => (
                    <div key={item.id + item.color} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.name} (x{item.quantity})</span>
                      <span className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <Button 
                  className="w-full h-12 text-lg" 
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : `Pay ₹${totalPrice.toLocaleString('en-IN')}`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
