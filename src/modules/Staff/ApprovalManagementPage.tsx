import { useEffect } from 'react';
import { useAuth } from '../../app/context/AuthContext';
import { useStaff } from '../../app/context/StaffContext';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../app/components/ui/card';
import { Button } from '../../app/components/ui/button';
import { Badge } from '../../app/components/ui/badge';
import { toast } from 'sonner';

export default function ApprovalManagementPage({ isEmbedded = false }: { isEmbedded?: boolean }) {
  const { user } = useAuth();
  const { leaveRequests, updateLeaveStatus } = useStaff();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleApproval = (id: string, status: 'approved' | 'rejected') => {
    updateLeaveStatus(id, status);
    toast.success(`Leave ${status} successfully!`);
  };

  if (!user || user.role !== 'admin') return null;

  const pendingRequests = leaveRequests.filter(r => r.status === 'pending');

  const content = (
    <>
      {!isEmbedded && <h1 className="text-3xl font-bold mb-6">Leave Approval Management</h1>}

      <Card>
          <CardHeader>
            <CardTitle>Pending Leave Requests ({pendingRequests.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No pending leave requests</p>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{request.staffName}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Leave Period:</span> {request.startDate} to {request.endDate}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Reason:</span> {request.reason}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Applied on: {request.appliedDate}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproval(request.id, 'approved')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleApproval(request.id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>All Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {leaveRequests.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No leave requests</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Staff Name</th>
                      <th className="text-left p-3">Start Date</th>
                      <th className="text-left p-3">End Date</th>
                      <th className="text-left p-3">Reason</th>
                      <th className="text-left p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequests.map((request) => (
                      <tr key={request.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{request.staffName}</td>
                        <td className="p-3">{request.startDate}</td>
                        <td className="p-3">{request.endDate}</td>
                        <td className="p-3 text-sm">{request.reason}</td>
                        <td className="p-3">
                          <Badge
                            variant={
                              request.status === 'approved'
                                ? 'default'
                                : request.status === 'rejected'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {request.status}
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
    </>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {content}
      </div>
    </div>
  );
}
