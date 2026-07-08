import { useState, useEffect } from 'react';
import { useAuth } from '../../app/context/AuthContext';
import { useNavigate } from 'react-router';
import { Card, CardContent } from '../../app/components/ui/card';
import { BarChart3, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function SalesReportsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || (user.role !== 'admin' && user.role !== 'staff')) return null;

  // Mock Data as per the design
  const revenueData = [
    { name: 'Month 1', revenue: 280000 },
    { name: 'Month 2', revenue: 320000 },
    { name: 'Month 3', revenue: 410000 },
    { name: 'Month 4', revenue: 380000 },
    { name: 'Month 5', revenue: 450000 },
    { name: 'Month 6', revenue: 530000 },
  ];

  const ordersData = [
    { name: 'Month 1', orders: 18 },
    { name: 'Month 2', orders: 22 },
    { name: 'Month 3', orders: 31 },
    { name: 'Month 4', orders: 27 },
    { name: 'Month 5', orders: 35 },
    { name: 'Month 6', orders: 42 },
  ];

  // Custom formatter for Y Axis
  const formatYAxisRevenue = (tickItem: number) => {
    if (tickItem === 0) return '0';
    return `₹${tickItem / 1000}k`;
  };

  return (
    <div className="w-full h-full bg-white md:bg-transparent">
      <div className="container mx-auto max-w-7xl px-4 py-8">

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Sales Analytics</h1>
          </div>
          <p className="text-gray-500 text-lg">Overview of sales performance and trends</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1 */}
          <Card className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="text-[32px] font-bold text-gray-900 mb-2 leading-none">₹23.6L</div>
              <div className="text-[13px] text-gray-500 font-medium">Total Revenue (6M)</div>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="text-[32px] font-bold text-gray-900 mb-2 leading-none">174</div>
              <div className="text-[13px] text-gray-500 font-medium">Total Orders (6M)</div>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="text-[32px] font-bold text-gray-900 mb-2 leading-none">₹13,592</div>
              <div className="text-[13px] text-gray-500 font-medium">Avg. Order Value</div>
            </CardContent>
          </Card>

          {/* Card 4 */}
          <Card className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="text-[32px] font-bold text-gray-900 mb-2 leading-none">2</div>
              <div className="text-[13px] text-gray-500 font-medium">Products Listed</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Revenue Trend Chart */}
          <Card className="rounded-2xl border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-8">
                <TrendingUp className="w-5 h-5 text-gray-700" />
                <h2 className="text-[17px] font-semibold text-gray-800">Monthly Revenue Trend</h2>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={false}
                    />
                    <YAxis
                      tickFormatter={formatYAxisRevenue}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#888', fontSize: 13 }}
                      dx={-10}
                      domain={[150000, 600000]}
                      ticks={[150000, 300000, 450000, 600000]}
                      width={65}
                    />
                    <Tooltip
                      formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #eee', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ r: 5, strokeWidth: 2, fill: '#fff', stroke: '#3b82f6' }}
                      activeDot={{ r: 7, strokeWidth: 0, fill: '#3b82f6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Orders per Month Chart */}
          <Card className="rounded-2xl border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-8">
                <h2 className="text-[17px] font-semibold text-gray-800 ml-1">Orders per Month</h2>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ordersData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }} barSize={45}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={false}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#888', fontSize: 13 }}
                      dx={-10}
                      domain={[0, 60]}
                      ticks={[15, 30, 45, 60]}
                      width={40}
                    />
                    <Tooltip
                      cursor={{ fill: '#f9fafb' }}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #eee', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar
                      dataKey="orders"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
