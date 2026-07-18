import React, { useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../app/components/ui/card';
import { Button } from '../../app/components/ui/button';
import { Badge } from '../../app/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '../../app/components/ui/radio-group';
import { Separator } from '../../app/components/ui/separator';
import { useCart } from '../../app/context/CartContext';
import {
  ArrowLeft,
  Home,
  Briefcase,
  Pencil,
  Trash2,
  Plus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Wallet,
  HeadphonesIcon,
  CheckCircle,
  XCircle,
  CreditCard
} from 'lucide-react';

interface Address {
  id: string;
  type: string;
  name: string;
  isDefault: boolean;
  phone: string;
  addressLine1: string;
  addressLine2: string;
}

const initialAddresses: Address[] = [
  {
    id: '1',
    type: 'Home',
    name: 'Sharan',
    isDefault: true,
    phone: '+91 9876543210',
    addressLine1: '123, Perundurai Road, Near Bus Stand,',
    addressLine2: 'Erode - 638001, Tamil Nadu, India'
  },
  {
    id: '2',
    type: 'Work',
    name: 'Sharan Office',
    isDefault: false,
    phone: '+91 9123456780',
    addressLine1: 'No.45, Karur Road, Bharathi Nagar,',
    addressLine2: 'Erode - 638002, Tamil Nadu, India'
  }
];

export default function CheckoutPage() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [selectedAddress, setSelectedAddress] = useState<string>('1');
  const [step, setStep] = useState<number>(1);
  const [showRazorpay, setShowRazorpay] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const { items, totalPrice } = useCart();

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'Home',
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    isDefault: false
  });

  const handleOpenAddressForm = (address?: Address) => {
    if (address) {
      setEditingAddressId(address.id);
      setFormData({
        type: address.type,
        name: address.name,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        isDefault: address.isDefault
      });
    } else {
      setEditingAddressId(null);
      setFormData({
        type: 'Home',
        name: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        isDefault: false
      });
    }
    setShowAddressForm(true);
  };

  const handleSaveAddress = () => {
    if (editingAddressId) {
      setAddresses(prev => prev.map(a => a.id === editingAddressId ? { ...formData, id: editingAddressId } : a));
    } else {
      const newAddress = { ...formData, id: Date.now().toString() };
      setAddresses(prev => [...prev, newAddress]);
      setSelectedAddress(newAddress.id);
    }
    setShowAddressForm(false);
  };

  const handleRemoveAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    if (selectedAddress === id) {
      setSelectedAddress(addresses.find(a => a.id !== id)?.id || '');
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentStatus('success');
    setShowRazorpay(false);
  };

  const handlePaymentFailure = () => {
    setPaymentStatus('failed');
    setShowRazorpay(false);
    setStep(2); // Go back to review on failure
  };

  const renderStepIndicator = (stepNumber: number, label: string) => {
    const isActive = step === stepNumber;
    const isCompleted = step > stepNumber;
    return (
      <div className={`flex items-center ${isActive || isCompleted ? '' : 'opacity-50'}`}>
        <div className={`w-8 h-8 rounded-full ${isActive || isCompleted ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'} flex items-center justify-center font-bold text-sm z-10 transition-colors`}>
          {isCompleted ? <CheckCircle className="w-5 h-5" /> : stepNumber}
        </div>
        <span className={`ml-2 font-${isActive ? 'bold text-blue-600' : 'medium text-gray-500'} text-sm`}>{label}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-6xl pt-28 pb-8">
        
        {/* Back Link & Title */}
        <div className="mb-6">
          {step === 1 ? (
            <Link to="/cart" className="inline-flex items-center text-gray-600 hover:text-black mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Back to Cart</span>
            </Link>
          ) : (
            <button onClick={() => setStep(step - 1)} className="inline-flex items-center text-gray-600 hover:text-black mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Back to Previous Step</span>
            </button>
          )}
          <h1 className="text-3xl font-extrabold text-gray-900">Checkout</h1>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-10 max-w-2xl mx-auto">
          {renderStepIndicator(1, "Delivery Address")}
          <div className={`flex-1 h-px mx-4 ${step > 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          {renderStepIndicator(2, "Review Order")}
          <div className={`flex-1 h-px mx-4 ${step > 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          {renderStepIndicator(3, "Payment")}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Dynamic Content based on Step */}
          <div className={`${step === 1 ? 'lg:col-span-3 lg:max-w-3xl lg:mx-auto w-full' : 'lg:col-span-2'} space-y-6`}>
            
            {/* STEP 1: Delivery Address */}
            {step === 1 && (
              <>
                <Card className="border-0 shadow-none bg-[#fafafa] rounded-xl p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
                    <p className="text-sm text-gray-500 mt-1">Select or add a new delivery address</p>
                  </div>

                  <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress} className="space-y-4">
                    {addresses.map((addr) => {
                      const isSelected = selectedAddress === addr.id;
                      return (
                        <div 
                          key={addr.id}
                          className={`relative flex items-start p-5 rounded-xl border-2 transition-all cursor-pointer ${
                            isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedAddress(addr.id)}
                        >
                          <div className="mt-1 flex items-center h-5">
                            <RadioGroupItem value={addr.id} id={addr.id} className={isSelected ? 'text-blue-600 border-blue-600' : ''} />
                          </div>
                          
                          <div className="ml-4 flex-1 flex flex-col sm:flex-row gap-4">
                            <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                              {addr.type === 'Home' ? <Home className="w-6 h-6 mb-1" /> : <Briefcase className="w-6 h-6 mb-1" />}
                              <span className="text-[10px] font-semibold uppercase">{addr.type}</span>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-gray-900">{addr.name}</span>
                                {addr.isDefault && (
                                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none font-semibold text-xs px-2 py-0">Default</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-1">{addr.phone}</p>
                              <p className="text-sm text-gray-600">{addr.addressLine1}</p>
                              <p className="text-sm text-gray-600">{addr.addressLine2}</p>
                            </div>
                            
                            <div className="flex sm:flex-col justify-end gap-3 sm:gap-2 mt-2 sm:mt-0">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleOpenAddressForm(addr); }}
                                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 z-10 relative"
                              >
                                <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleRemoveAddress(addr.id); }}
                                className="flex items-center text-sm font-medium text-red-500 hover:text-red-600 z-10 relative"
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </RadioGroup>

                  <button 
                    onClick={() => handleOpenAddressForm()}
                    className="w-full mt-6 py-4 border-2 border-dashed border-gray-300 rounded-xl text-blue-600 font-semibold flex items-center justify-center hover:bg-blue-50/50 hover:border-blue-300 transition-colors bg-white"
                  >
                    <Plus className="w-5 h-5 mr-2" /> Add New Address
                  </button>
                </Card>

                <Button 
                  onClick={() => setStep(2)}
                  className="w-full h-14 bg-[#0a0a0a] hover:bg-black text-white rounded-xl text-lg font-semibold flex items-center justify-center"
                >
                  Continue to Review Order <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </>
            )}

            {/* STEP 2: Review Order */}
            {step === 2 && (
              <>
                <Card className="border-0 shadow-none bg-[#fafafa] rounded-xl p-6 mb-6">
                  <div className="mb-4 flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
                      <p className="text-sm text-gray-500 mt-1">Your order will be shipped here</p>
                    </div>
                    <button onClick={() => setStep(1)} className="text-sm font-medium text-blue-600 hover:text-blue-700">Change</button>
                  </div>
                  {(() => {
                    const addr = addresses.find(a => a.id === selectedAddress);
                    if (!addr) return null;
                    return (
                      <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-start gap-4">
                        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex-shrink-0">
                          {addr.type === 'Home' ? <Home className="w-5 h-5 mb-0.5" /> : <Briefcase className="w-5 h-5 mb-0.5" />}
                          <span className="text-[9px] font-bold uppercase">{addr.type}</span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 mb-0.5">{addr.name} <span className="text-sm font-normal text-gray-500 ml-2">{addr.phone}</span></p>
                          <p className="text-sm text-gray-600">{addr.addressLine1}, {addr.addressLine2}</p>
                        </div>
                      </div>
                    );
                  })()}
                </Card>

                <Card className="border-0 shadow-none bg-[#fafafa] rounded-xl p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Review Items</h2>
                    <p className="text-sm text-gray-500 mt-1">Please check your items before making payment</p>
                  </div>
                  
                  <div className="space-y-4">
                    {items.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">Your cart is empty.</div>
                    ) : (
                      items.map((item) => (
                        <div key={`${item.id}-${item.color}`} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <div className="text-xs text-gray-500 mt-1 space-x-2">
                              {item.color && <span>Color: {item.color}</span>}
                              {item.storage && <span>Storage: {item.storage}</span>}
                            </div>
                            <p className="text-sm font-medium text-blue-600 mt-1">Qty: {item.quantity}</p>
                          </div>
                          <div className="font-bold text-gray-900 text-lg">
                            ₹{item.price.toLocaleString('en-IN')}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>

                <Button 
                  onClick={() => {
                    setStep(3);
                    setShowRazorpay(true);
                  }}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-semibold flex items-center justify-center shadow-lg"
                  disabled={items.length === 0}
                >
                  Proceed to Payment <CreditCard className="w-5 h-5 ml-2" />
                </Button>
              </>
            )}

            {/* STEP 3: Payment */}
            {step === 3 && (
              <Card className="border-0 shadow-none bg-[#fafafa] rounded-xl p-8 text-center">
                {paymentStatus === 'idle' && (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <h2 className="text-2xl font-bold text-gray-900">Awaiting Payment...</h2>
                    <p className="text-gray-500 mt-2">Please complete the payment in the secure window.</p>
                  </div>
                )}
                
                {paymentStatus === 'success' && (
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                      <CheckCircle className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
                    <p className="text-gray-600 mb-8 max-w-md">
                      Thank you for your purchase. Your order has been successfully placed and will be delivered to the selected address soon.
                    </p>
                    <Button asChild size="lg" className="rounded-xl px-8">
                      <Link to="/">Back to Home</Link>
                    </Button>
                  </div>
                )}
              </Card>
            )}

          </div>

          {/* Right Column: Order Summary */}
          {step !== 1 && (
            <div className="lg:col-span-1">
            <Card className="border-gray-200 shadow-sm rounded-xl overflow-hidden sticky top-32">
              <CardHeader className="pb-4 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-bold">Order Summary</CardTitle>
                  <span className="text-sm text-gray-500 font-medium">
                    {items.reduce((acc, item) => acc + item.quantity, 0)} Item(s)
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                
                {items.length === 0 ? (
                   <p className="text-sm text-gray-500 text-center py-4">No items in cart</p>
                ) : (
                  items.map(item => (
                    <div key={`${item.id}-summary`} className="flex items-start gap-4 mb-4 pb-4 border-b border-gray-50 last:border-0 last:mb-6 last:pb-0">
                      <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-bold text-gray-900 text-sm">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))
                )}

                <Separator className="my-4" />

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium text-gray-900">Included</span>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>

                {/* Secure Checkout Banner */}
                <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-lg p-3 flex items-start gap-3 mb-6">
                  <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-green-800">Secure Checkout</p>
                    <p className="text-[10px] text-green-700 mt-0.5">Your data is protected with 256-bit SSL encryption</p>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="flex flex-col items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-blue-600 mb-1" />
                    <span className="text-[10px] font-medium text-gray-600 leading-tight">Original<br/>Products</span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <Truck className="w-5 h-5 text-blue-600 mb-1" />
                    <span className="text-[10px] font-medium text-gray-600 leading-tight">Fast & Safe<br/>Delivery</span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <RotateCcw className="w-5 h-5 text-blue-600 mb-1" />
                    <span className="text-[10px] font-medium text-gray-600 leading-tight">7 Days Easy<br/>Returns</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          )}
        </div>
      </div>

      {/* Mock Razorpay Modal Overlay */}
      {showRazorpay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="bg-[#0b1b36] p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                {/* Razorpay Logo Mock */}
                <div className="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center">
                  <span className="font-bold text-xs">₹</span>
                </div>
                <span className="font-semibold text-sm">Razorpay Checkout</span>
              </div>
              <button onClick={() => { setShowRazorpay(false); setStep(2); }} className="text-gray-300 hover:text-white transition-colors">
                <XCircle className="w-5 h-5"/>
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Raghu Mobile Wholesale</h3>
                <div className="text-3xl font-extrabold text-[#0b1b36]">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </div>
                <p className="text-sm text-gray-500 mt-2">Test Transaction (Mock)</p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base shadow-md"
                  onClick={handlePaymentSuccess}
                >
                  <CheckCircle className="w-5 h-5 mr-2" /> Simulate Success
                </Button>
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-base shadow-md"
                  onClick={handlePaymentFailure}
                >
                  <XCircle className="w-5 h-5 mr-2" /> Simulate Failure
                </Button>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center text-xs text-gray-400 gap-1">
                <ShieldCheck className="w-4 h-4" /> Secured by Razorpay
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Address Form Modal Overlay */}
      {showAddressForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-[#0b1b36] p-4 text-white flex justify-between items-center">
              <h3 className="font-semibold">{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>
              <button onClick={() => setShowAddressForm(false)} className="text-gray-300 hover:text-white transition-colors">
                <XCircle className="w-5 h-5"/>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-4 mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="type" value="Home" checked={formData.type === 'Home'} onChange={(e) => setFormData({...formData, type: e.target.value})} className="accent-blue-600" />
                  <span className="text-sm font-medium">Home</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="type" value="Work" checked={formData.type === 'Work'} onChange={(e) => setFormData({...formData, type: e.target.value})} className="accent-blue-600" />
                  <span className="text-sm font-medium">Work</span>
                </label>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Enter your name" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="+91 9876543210" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Address Line 1</label>
                <input type="text" value={formData.addressLine1} onChange={e => setFormData({...formData, addressLine1: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Flat, House no., Building, Company, Apartment" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Address Line 2</label>
                <input type="text" value={formData.addressLine2} onChange={e => setFormData({...formData, addressLine2: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Area, Street, Sector, Village" />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="isDefault" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                <label htmlFor="isDefault" className="text-sm font-medium text-gray-700 cursor-pointer">Make this my default address</label>
              </div>
              <div className="pt-4 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowAddressForm(false)}>Cancel</Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleSaveAddress}>Save Address</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Trust Features */}
      <div className="border-t border-gray-200 bg-white mt-12 py-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-gray-400 flex-shrink-0" />
              <div>
                <h5 className="font-bold text-sm text-gray-900">100% Original Products</h5>
                <p className="text-xs text-gray-500 mt-0.5">Sourced directly from brands</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Wallet className="w-6 h-6 text-gray-400 flex-shrink-0" />
              <div>
                <h5 className="font-bold text-sm text-gray-900">Secure Payments</h5>
                <p className="text-xs text-gray-500 mt-0.5">Multiple safe payment options</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <RotateCcw className="w-6 h-6 text-gray-400 flex-shrink-0" />
              <div>
                <h5 className="font-bold text-sm text-gray-900">Easy Returns</h5>
                <p className="text-xs text-gray-500 mt-0.5">Hassle-free return policy</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HeadphonesIcon className="w-6 h-6 text-gray-400 flex-shrink-0" />
              <div>
                <h5 className="font-bold text-sm text-gray-900">Customer Support</h5>
                <p className="text-xs text-gray-500 mt-0.5">We're here to help you</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
