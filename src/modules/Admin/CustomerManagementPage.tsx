import { useState, useEffect } from 'react';
import { useAuth } from '../../app/context/AuthContext';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../app/components/ui/card';
import { Badge } from '../../app/components/ui/badge';
import { Button } from '../../app/components/ui/button';
import { Users, Mail, Phone, CalendarDays } from 'lucide-react';

import { listCustomers, updateCustomerStatus } from './Service/CustomerManagementApi';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  full_address: string;
  is_active: boolean;
  role: number;
  orders_count: number;
  created_at: string;
}

export default function CustomerManagementPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [activeCustomers, setActiveCustomers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await listCustomers({ page: 1, limit: 100 });
      if (response.status === 'success') {
        setCustomers(response.data.items);
        setTotalCustomers(response.data.total);
        setActiveCustomers(response.data.active_count);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load customers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    } else {
      fetchCustomers();
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  const toggleCustomerStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateCustomerStatus(id, !currentStatus);
      fetchCustomers();
    } catch (err: any) {
      alert(err.message || 'Failed to update customer status');
    }
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
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">
                        Loading customers...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-red-500">
                        {error}
                      </td>
                    </tr>
                  ) : customers.map((customer) => (
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
                          {new Date(customer.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="font-semibold">
                          {customer.orders_count}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant={customer.is_active ? 'default' : 'secondary'}>
                          {customer.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleCustomerStatus(customer.id, customer.is_active)}
                        >
                          {customer.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!isLoading && !error && customers.length === 0 && (
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
