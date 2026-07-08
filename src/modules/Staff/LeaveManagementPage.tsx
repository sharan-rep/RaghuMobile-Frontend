import { useState, useEffect } from 'react';
import { useAuth } from '../../app/context/AuthContext';
import { useStaff } from '../../app/context/StaffContext';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../app/components/ui/card';
import { Button } from '../../app/components/ui/button';
import { Badge } from '../../app/components/ui/badge';
import { toast } from 'sonner';

export default function LeaveManagementPage() {
  const { user } = useAuth();
  const { leaveRequests, addLeaveRequest } = useStaff();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || (user.role !== 'admin' && user.role !== 'staff')) return null;

  const myLeaves = leaveRequests.filter(req => req.staffId === user.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLeaveRequest({
      id: Date.now().toString(),
      staffId: user.id,
      staffName: user.name,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
    });
    toast.success('Leave request submitted successfully');
    setShowForm(false);
    setFormData({ startDate: '', endDate: '', reason: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Leave Management</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Apply Leave'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Apply for Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reason</label>
                  <textarea
                    required
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button type="submit">Submit Request</Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>My Leaves</CardTitle>
          </CardHeader>
          <CardContent>
            {myLeaves.length === 0 ? (
              <p className="text-gray-500 py-8 text-center">No leave records found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Start Date</th>
                      <th className="text-left p-3">End Date</th>
                      <th className="text-left p-3">Reason</th>
                      <th className="text-left p-3">Applied On</th>
                      <th className="text-left p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myLeaves.map(leave => (
                      <tr key={leave.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{leave.startDate}</td>
                        <td className="p-3">{leave.endDate}</td>
                        <td className="p-3">{leave.reason}</td>
                        <td className="p-3">{leave.appliedDate}</td>
                        <td className="p-3">
                          <Badge
                            variant={
                              leave.status === 'approved'
                                ? 'default'
                                : leave.status === 'rejected'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {leave.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
