import { useEffect } from 'react';
import { useAuth } from '../../app/context/AuthContext';
import { useStaff } from '../../app/context/StaffContext';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../app/components/ui/card';
import { Badge } from '../../app/components/ui/badge';
import { Button } from '../../app/components/ui/button';
import { toast } from 'sonner';

export default function StaffAttendancePage({ isEmbedded = false }: { isEmbedded?: boolean }) {
  const { user } = useAuth();
  const { attendance, addAttendance } = useStaff();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || (user.role !== 'admin' && user.role !== 'staff')) return null;

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === today);
  const presentToday = todayAttendance.filter(a => a.status === 'present').length;
  
  const displayAttendance = user.role === 'admin' ? attendance : attendance.filter(a => a.staffId === user.id);
  const hasMarkedToday = attendance.some(a => a.staffId === user.id && a.date === today);

  const handleMarkPresent = () => {
    addAttendance({
      id: Date.now().toString(),
      staffId: user.id,
      staffName: user.name,
      date: today,
      status: 'present',
    });
    toast.success('Attendance marked successfully!');
  };

  const content = (
    <>
      <div className="flex justify-between items-center mb-6">
        {!isEmbedded && <h1 className="text-3xl font-bold">Staff Attendance</h1>}
        <div className="flex-1"></div>
        {user.role === 'staff' && !hasMarkedToday && (
          <Button onClick={handleMarkPresent}>
            Mark Present Today
          </Button>
        )}
        {user.role === 'staff' && hasMarkedToday && (
          <Button disabled variant="outline">
            Attendance Marked
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Today's Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{today}</div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Present Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{presentToday}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{displayAttendance.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            {displayAttendance.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No attendance records found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Staff Name</th>
                      <th className="text-left p-3">Date</th>
                      <th className="text-left p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayAttendance.map((att) => (
                      <tr key={att.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{att.staffName}</td>
                        <td className="p-3">{att.date}</td>
                        <td className="p-3">
                          <Badge
                            variant={
                              att.status === 'present'
                                ? 'default'
                                : att.status === 'leave'
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {att.status}
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
      <div className="container mx-auto px-4 max-w-7xl">
        {content}
      </div>
    </div>
  );
}
