import { useState } from 'react';
import { Button } from '../../app/components/ui/button';
import { Input } from '../../app/components/ui/input';
import { Card, CardContent } from '../../app/components/ui/card';
import { Search, Package, CheckCircle2, Truck, Home } from 'lucide-react';

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [trackingResult, setTrackingResult] = useState<null | 'found' | 'not-found'>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    // Mock tracking logic
    if (orderId.length > 5) {
      setTrackingResult('found');
    } else {
      setTrackingResult('not-found');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Track Your Order</h1>
          <p className="text-gray-600">Enter your order ID below to check the current status of your shipment.</p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleTrack} className="flex gap-4">
              <Input 
                placeholder="Enter Order ID (e.g., ORD-12345)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">
                <Search className="w-4 h-4 mr-2" />
                Track
              </Button>
            </form>
          </CardContent>
        </Card>

        {trackingResult === 'not-found' && (
          <div className="text-center p-8 bg-white rounded-xl border">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Order Not Found</h3>
            <p className="text-gray-600">We couldn't find an order with that ID. Please check and try again.</p>
          </div>
        )}

        {trackingResult === 'found' && (
          <Card>
            <CardContent className="p-8">
              <h3 className="font-bold text-xl mb-6 border-b pb-4">Order Status: <span className="text-blue-600">Shipped</span></h3>
              
              <div className="relative">
                {/* Tracking Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div className="space-y-8">
                  {/* Step 1: Placed */}
                  <div className="relative flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center z-10 shrink-0">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold">Order Placed</h4>
                      <p className="text-sm text-gray-500">October 12, 2024 - 10:30 AM</p>
                      <p className="text-gray-600 mt-1">Your order has been received and confirmed.</p>
                    </div>
                  </div>

                  {/* Step 2: Shipped */}
                  <div className="relative flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center z-10 shrink-0 shadow-md shadow-blue-200">
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-600">Order Shipped</h4>
                      <p className="text-sm text-gray-500">October 13, 2024 - 02:15 PM</p>
                      <p className="text-gray-600 mt-1">Your package has been handed over to the delivery partner.</p>
                    </div>
                  </div>

                  {/* Step 3: Delivered (Pending) */}
                  <div className="relative flex items-center gap-6 opacity-50">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center z-10 shrink-0 border-2 border-white">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-500">Delivered</h4>
                      <p className="text-sm text-gray-400">Estimated: October 15, 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
