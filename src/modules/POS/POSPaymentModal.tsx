import { useState, useEffect } from 'react';
import { Button } from '../../app/components/ui/button';
import { Input } from '../../app/components/ui/input';
import { IndianRupee, CreditCard, Smartphone, Split, Wallet, X } from 'lucide-react';

export interface PaymentDetails {
  method: 'Cash' | 'Card' | 'UPI' | 'Split';
  amountPaid: number;
  splitDetails?: {
    cash: number;
    card: number;
    upi: number;
  };
  upiProvider?: string;
  referenceNumber?: string;
  screenshot?: File | null;
}

interface POSPaymentModalProps {
  totalAmount: number;
  onClose: () => void;
  onComplete: (details: PaymentDetails) => void;
}

export default function POSPaymentModal({ totalAmount, onClose, onComplete }: POSPaymentModalProps) {
  const [method, setMethod] = useState<'Cash' | 'Card' | 'UPI' | 'Split'>('Cash');
  const [amountPaid, setAmountPaid] = useState<string>(totalAmount.toString());

  const [upiProvider, setUpiProvider] = useState<string>('Gpay');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [screenshot, setScreenshot] = useState<File | null>(null);

  // Split Payment states
  const [splitCash, setSplitCash] = useState<string>('');
  const [splitCard, setSplitCard] = useState<string>('');
  const [splitUpi, setSplitUpi] = useState<string>('');

  const splitTotal = (Number(splitCash) || 0) + (Number(splitCard) || 0) + (Number(splitUpi) || 0);

  // Reset amounts when method changes
  useEffect(() => {
    if (method !== 'Split') {
      setAmountPaid(totalAmount.toString());
    }
  }, [method, totalAmount]);

  const handleComplete = () => {
    if (method === 'Split') {
      if (splitTotal < totalAmount) {
        alert('Split amount is less than total due!');
        return;
      }
      onComplete({
        method: 'Split',
        amountPaid: splitTotal,
        splitDetails: {
          cash: Number(splitCash) || 0,
          card: Number(splitCard) || 0,
          upi: Number(splitUpi) || 0,
        },
        screenshot
      });
    } else {
      onComplete({
        method,
        amountPaid: Number(amountPaid) || totalAmount,
        upiProvider: method === 'UPI' ? upiProvider : undefined,
        referenceNumber,
        screenshot
      });
    }
  };

  const isCompleteDisabled = () => {
    if (method === 'Split') {
      if (splitTotal < totalAmount) return true;
      if ((Number(splitCard) > 0 || Number(splitUpi) > 0) && !screenshot) return true;
      return false;
    }
    if (method === 'UPI' && !screenshot) return true;
    if (method === 'Card' && !screenshot) return true;
    return false;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h2 className="text-lg font-bold">Process Payment</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 mb-1">Total Amount Due</p>
            <h3 className="text-3xl font-bold text-gray-800">₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Payment Method</label>
              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant={method === 'Cash' ? 'default' : 'outline'}
                  className="flex flex-col items-center h-auto py-3 gap-1 px-1"
                  onClick={() => setMethod('Cash')}
                >
                  <IndianRupee className="w-5 h-5" />
                  <span className="text-xs">Cash</span>
                </Button>
                <Button
                  variant={method === 'UPI' ? 'default' : 'outline'}
                  className="flex flex-col items-center h-auto py-3 gap-1 px-1"
                  onClick={() => setMethod('UPI')}
                >
                  <Smartphone className="w-5 h-5" />
                  <span className="text-xs">UPI</span>
                </Button>
                <Button
                  variant={method === 'Card' ? 'default' : 'outline'}
                  className="flex flex-col items-center h-auto py-3 gap-1 px-1"
                  onClick={() => setMethod('Card')}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs">Card</span>
                </Button>
                <Button
                  variant={method === 'Split' ? 'default' : 'outline'}
                  className="flex flex-col items-center h-auto py-3 gap-1 px-1"
                  onClick={() => setMethod('Split')}
                >
                  <Split className="w-5 h-5" />
                  <span className="text-xs">Split</span>
                </Button>
              </div>
            </div>

            {method === 'Cash' && (
              <div className="bg-gray-50 p-4 rounded-lg border">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Amount Received (₹)</label>
                <Input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="text-xl font-bold bg-white"
                />
                {Number(amountPaid) > totalAmount && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded-md flex justify-between items-center">
                    <span className="text-sm text-green-800">Change to return:</span>
                    <span className="text-lg font-bold text-green-700">₹{(Number(amountPaid) - totalAmount).toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
            )}

            {method === 'Split' && (
              <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Split Payment Details</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Cash Amount</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={splitCash}
                      onChange={(e) => setSplitCash(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">UPI Amount</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={splitUpi}
                      onChange={(e) => setSplitUpi(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Card Amount</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={splitCard}
                      onChange={(e) => setSplitCard(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                </div>
                
                <div className={`mt-3 p-3 rounded-md flex justify-between items-center font-medium ${splitTotal === totalAmount ? 'bg-green-50 text-green-700 border-green-200' : splitTotal > totalAmount ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-red-50 text-red-700 border-red-200'} border`}>
                  <span>Total Split Amount:</span>
                  <span>₹{splitTotal.toLocaleString('en-IN')}</span>
                </div>
                
                {splitTotal < totalAmount && (
                  <p className="text-xs text-red-600 text-right">Remaining: ₹{(totalAmount - splitTotal).toLocaleString('en-IN')}</p>
                )}
                {splitTotal > totalAmount && (
                  <p className="text-xs text-blue-600 text-right">Change: ₹{(splitTotal - totalAmount).toLocaleString('en-IN')}</p>
                )}

                {(Number(splitCard) > 0 || Number(splitUpi) > 0) && (
                  <div className="pt-2 border-t mt-3">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Payment Screenshot * (For UPI/Card)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                )}
              </div>
            )}
            
            {method === 'UPI' && (
              <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">UPI Provider</label>
                  <select 
                    value={upiProvider} 
                    onChange={(e) => setUpiProvider(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                  >
                    <option value="Gpay">Gpay</option>
                    <option value="PhonePe">PhonePe</option>
                    <option value="Paytm">Paytm</option>
                    <option value="Amazon Pay">Amazon Pay</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Reference Number (Optional)</label>
                  <Input
                    placeholder="Enter Ref/Transaction ID"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Payment Screenshot *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
            )}

            {method === 'Card' && (
              <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Reference Number (Optional)</label>
                  <Input
                    placeholder="Enter Approval Code / Ref No"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Payment Screenshot *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button 
            className="flex-1" 
            onClick={handleComplete}
            disabled={isCompleteDisabled()}
          >
            Complete Payment
          </Button>
        </div>
      </div>
    </div>
  );
}
