import { useStaff } from '../../app/context/StaffContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../app/components/ui/card';
import { Badge } from '../../app/components/ui/badge';
import { IndianRupee, Clock, CheckCircle2, Package } from 'lucide-react';
import { Button } from '../../app/components/ui/button';
import { useNavigate, Link } from 'react-router';
import { CreditCard, TrendingUp } from 'lucide-react';

export default function StaffDashboard() {
  const { orders } = useStaff();
  const navigate = useNavigate();

  // Basic analytics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalSales = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.price, 0);

  // Recent Orders (All)
  const recentOrders = [...orders].reverse().slice(0, 5);
  
  // Recent Sales (Delivered only)
  const recentSales = [...orders]
    .filter(o => o.status === 'delivered')
    .reverse()
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Staff Dashboard</h1>
            <p className="text-gray-500">Overview of your recent orders and sales</p>
          </div>
          <Button asChild className="bg-green-600 hover:bg-green-700 text-white shadow-sm">
            <Link to="/staff/pos">
              <CreditCard className="w-4 h-4 mr-2" />
              POS Terminal
            </Link>
          </Button>
        </div>

        {/* Analytics Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-none shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Sales Revenue</CardTitle>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <IndianRupee className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ₹{totalSales.toLocaleString('en-IN')}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Orders</CardTitle>
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <Clock className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{pendingOrders}</div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Orders Processed</CardTitle>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Package className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalOrders}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Orders List */}
          <Card className="border-none shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Recent Orders
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/orders')} className="text-blue-600">
                View All
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{order.product}</p>
                      <p className="text-sm text-gray-500">{order.customerName} · {order.date}</p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : ''}
                        ${order.status === 'pending' ? 'bg-orange-100 text-orange-700' : ''}
                        ${order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : ''}
                        ${order.status === 'cancelled' ? 'bg-red-100 text-red-700' : ''}
                        border-none
                      `}
                    >
                      {order.status}
                    </Badge>
                  </div>
                ))}
                {recentOrders.length === 0 && (
                  <div className="p-6 text-center text-gray-500">No recent orders.</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Sales Report List */}
          <Card className="border-none shadow-sm rounded-xl">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Recent Sales Report
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{sale.product}</p>
                      <p className="text-sm text-gray-500">#{sale.id} · {sale.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{sale.price.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-green-600 font-medium">Completed</p>
                    </div>
                  </div>
                ))}
                {recentSales.length === 0 && (
                  <div className="p-6 text-center text-gray-500">No recent sales.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
