import { useEffect } from 'react';
import { useAuth } from '../../app/context/AuthContext';
import { useStaff } from '../../app/context/StaffContext';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../app/components/ui/card';
import { Badge } from '../../app/components/ui/badge';
import { CreditCard, IndianRupee, CheckCircle2 } from 'lucide-react';

export default function PaymentReportsPage() {
  const { user } = useAuth();
  const { orders } = useStaff();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  // Derive payment data from orders for the report
  const payments = orders.map(order => ({
    id: `PAY-${order.id}`,
    orderId: order.id,
    customerName: order.customerName,
    amount: order.price,
    date: order.date,
    method: 'Credit Card / UPI',
    status: order.status === 'cancelled' ? 'Refunded' : 'Completed'
  }));

  const totalPayments = payments.length;
  const completedAmount = payments
    .filter(p => p.status === 'Completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="w-full h-full bg-gray-50 py-8">
      <div className="container mx-auto max-w-7xl px-4">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Reports</h1>
          </div>
          <p className="text-gray-500">View and manage customer payments and transactions.</p>
        </div>

        {/* Top Summary Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-none shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Collected</CardTitle>
              <IndianRupee className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                ₹{completedAmount.toLocaleString('en-IN')}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Transactions</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {totalPayments}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card className="border-none shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50/50">
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Transaction ID</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Order ID</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Customer</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Method</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Date</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Amount</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map(payment => (
                    <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 text-sm font-medium text-gray-900">{payment.id}</td>
                      <td className="p-4 text-sm text-gray-600">#{payment.orderId}</td>
                      <td className="p-4 text-sm text-gray-900">{payment.customerName}</td>
                      <td className="p-4 text-sm text-gray-600">{payment.method}</td>
                      <td className="p-4 text-sm text-gray-600">{payment.date}</td>
                      <td className="p-4 text-sm font-bold text-gray-900">₹{payment.amount.toLocaleString('en-IN')}</td>
                      <td className="p-4">
                        <Badge variant="secondary" className={payment.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {payment.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500">
                        No transactions found.
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
