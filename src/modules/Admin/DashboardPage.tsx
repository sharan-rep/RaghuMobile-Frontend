import { useAuth } from '../../app/context/AuthContext';
import { useEnquiry, Enquiry } from '../../app/context/EnquiryContext';
import { useNavigate, Link } from 'react-router';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../app/components/ui/card';
import { Badge } from '../../app/components/ui/badge';
import { Button } from '../../app/components/ui/button';
import {
  Clock,
  MessageSquare,
  Phone,
  Mail,
  CalendarDays,
  IndianRupee,
  Package,
  TrendingUp,
  Users,
  CreditCard,
  BarChart3,
} from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { useStaff } from '../../app/context/StaffContext';
import StaffDashboard from '../Staff/StaffDashboard';

export default function DashboardPage() {
  const { user } = useAuth();
  const { enquiries, updateStatus } = useEnquiry();
  const { orders } = useStaff();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
    return null;
  }

  if (user.role === 'staff') {
    return <StaffDashboard />;
  }

  const enquiryStatusColor = (status: Enquiry['status']) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700';
      case 'Contacted': return 'bg-yellow-100 text-yellow-700';
      case 'Resolved': return 'bg-green-100 text-green-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.name}!</p>
          </div>
          {user.role === 'admin' && (
            <div className="flex gap-3">
              <Button asChild className="bg-green-600 hover:bg-green-700 text-white shadow-sm">
                <Link to="/admin/pos">
                  <CreditCard className="w-4 h-4 mr-2" />
                  POS Terminal
                </Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                <Link to="/admin/staff">
                  <Users className="w-4 h-4 mr-2" />
                  Staff Management
                </Link>
              </Button>
            </div>
          )}
        </div>
        
        {/* Analytics Summaries */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Sales Revenue</CardTitle>
              <IndianRupee className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ₹{orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.price, 0).toLocaleString('en-IN')}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Orders Pending</CardTitle>
              <Package className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {orders.filter(o => o.status === 'pending').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Payments</CardTitle>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                ₹{orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.price, 0).toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-gray-500 mt-1">Including pending orders</p>
            </CardContent>
          </Card>
        </div>

        {/* Enquiries Section */}
        {user.role === 'admin' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Customer Enquiries & Appointments
                {enquiries.filter(e => e.status === 'New').length > 0 && (
                  <Badge className="ml-2 bg-blue-600 text-white text-xs px-1.5 py-0.5">
                    {enquiries.filter(e => e.status === 'New').length} New
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {enquiries.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No enquiries yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {enquiries.map(enq => (
                    <div key={enq.id} className="border rounded-xl p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{enq.name}</h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${enquiryStatusColor(enq.status)}`}>
                              {enq.status}
                            </span>
                            <Badge variant="outline" className="text-xs">{enq.serviceType}</Badge>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <a href={`tel:${enq.phone}`} className="hover:text-blue-600">{enq.phone}</a>
                            </div>
                            {enq.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                <a href={`mailto:${enq.email}`} className="hover:text-blue-600">{enq.email}</a>
                              </div>
                            )}
                            {enq.preferredDate && (
                              <div className="flex items-center gap-1">
                                <CalendarDays className="w-3 h-3" />
                                <span>Preferred: {enq.preferredDate}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(enq.submittedAt).toLocaleDateString('en-IN')}</span>
                            </div>
                          </div>
                          {enq.message && (
                            <p className="text-sm text-gray-700 bg-gray-100 rounded p-2 mt-2">
                              "{enq.message}"
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          {enq.status !== 'Contacted' && (
                            <Button size="sm" variant="outline" onClick={() => updateStatus(enq.id, 'Contacted')}>
                              Mark Contacted
                            </Button>
                          )}
                          {enq.status !== 'Resolved' && (
                            <Button size="sm" variant="outline" onClick={() => updateStatus(enq.id, 'Resolved')}>
                              Mark Resolved
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}