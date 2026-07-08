import { useState, useEffect } from 'react';
import { useAuth } from '../../app/context/AuthContext';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../app/components/ui/card';
import { Badge } from '../../app/components/ui/badge';
import { Button } from '../../app/components/ui/button';
import { Users, Mail, Phone, CalendarDays } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  totalOrders: number;
  status: 'active' | 'inactive';
}

const mockCustomers: Customer[] = [
  { id: 'C101', name: 'Raj Kumar', email: 'raj@example.com', phone: '+91 9876543210', joinDate: '2024-01-15', totalOrders: 5, status: 'active' },
  { id: 'C102', name: 'Priya Singh', email: 'priya@example.com', phone: '+91 8765432109', joinDate: '2024-02-10', totalOrders: 2, status: 'active' },
  { id: 'C103', name: 'Arun Raj', email: 'arun@example.com', phone: '+91 7654321098', joinDate: '2024-02-20', totalOrders: 1, status: 'active' },
  { id: 'C104', name: 'Neha Sharma', email: 'neha@example.com', phone: '+91 6543210987', joinDate: '2023-11-05', totalOrders: 0, status: 'inactive' },
];

export default function CustomerManagementPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;

  const toggleCustomerStatus = (id: string) => {
    setCustomers(customers.map(c => 
      c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">Customer Management</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Customers</CardTitle>
              <Users className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalCustomers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Customers</CardTitle>
              <Users className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{activeCustomers}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customer Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Customer ID</th>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Contact</th>
                    <th className="text-left p-3">Join Date</th>
                    <th className="text-left p-3">Orders</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-600">#{customer.id}</td>
                      <td className="p-3 font-semibold">{customer.name}</td>
                      <td className="p-3 space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-3 h-3 mr-1" /> {customer.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-3 h-3 mr-1" /> {customer.phone}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center text-gray-600 text-sm">
                          <CalendarDays className="w-4 h-4 mr-1" />
                          {customer.joinDate}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="font-semibold">
                          {customer.totalOrders}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                          {customer.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleCustomerStatus(customer.id)}
                        >
                          {customer.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {customers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No customers found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
