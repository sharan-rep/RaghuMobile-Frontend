import { useState, useEffect } from 'react';
import { useAuth } from '../../app/context/AuthContext';
import { createStaff, listStaff, updateStaff, deleteStaff } from './Service/StaffManagementApi';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../app/components/ui/card';
import { Button } from '../../app/components/ui/button';
import { Input } from '../../app/components/ui/input';
import { toast } from 'sonner';
import { Badge } from '../../app/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../app/components/ui/tabs';
import StaffAttendancePage from '../Staff/StaffAttendancePage';
import ApprovalManagementPage from '../Staff/ApprovalManagementPage';

export default function StaffManagementPage() {
  const { user } = useAuth();
  const [staffList, setStaffList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const fetchStaff = async () => {
    try {
      const data = await listStaff();
      setStaffList(Array.isArray(data) ? data : (data.items || data.data || []));
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch staff');
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    } else {
      fetchStaff();
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    idProof: null as File | string | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('full_address', formData.address);
      if (formData.idProof instanceof File) {
        formDataToSend.append('id_proof_file', formData.idProof);
      } else if (typeof formData.idProof === 'string' && formData.idProof) {
        formDataToSend.append('id_proof_file', formData.idProof);
      }

      if (editingId) {
        await updateStaff(editingId, formDataToSend);
        toast.success('Staff member updated successfully!');
      } else {
        await createStaff(formDataToSend);
        toast.success('Staff member added successfully!');
      }
      
      setFormData({ name: '', email: '', phone: '', address: '', idProof: null });
      setShowForm(false);
      setEditingId(null);
      fetchStaff();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save staff member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (member: any) => {
    setFormData({
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      address: member.full_address || member.address || '',
      idProof: member.id_proof || member.id_proof_file || member.idProof || null,
    });
    setEditingId(member._id || member.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    try {
      await deleteStaff(id);
      toast.success('Staff member deleted successfully!');
      fetchStaff();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete staff member');
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-4">
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => navigate('/admin')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Staff Management</h1>
        </div>

        <Tabs defaultValue="add-staff" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 max-w-3xl">
            <TabsTrigger value="add-staff">Staff Directory</TabsTrigger>
            <TabsTrigger value="attendance">Staff Attendance</TabsTrigger>
            <TabsTrigger value="leave">Leave Approval</TabsTrigger>
          </TabsList>

          <TabsContent value="add-staff">
            <div className="flex justify-end mb-4">
              <Button onClick={() => {
                if (showForm) {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ name: '', email: '', phone: '', address: '', idProof: null });
                } else {
                  setShowForm(true);
                }
              }}>
                {showForm ? 'Cancel' : 'Add Staff'}
              </Button>
            </div>

            {showForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{editingId ? 'Edit Staff Member' : 'Add New Staff Member'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">ID Proof (Upload File) *</label>
                        <input
                          type="file"
                          required={!editingId}
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => setFormData({ ...formData, idProof: e.target.files?.[0] || null })}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        />
                        {editingId && typeof formData.idProof === 'string' && formData.idProof && (
                          <div className="text-sm mt-2 flex items-center gap-2">
                            <span className="text-gray-600">Current File:</span>
                            <a 
                              href={formData.idProof.startsWith('http') ? formData.idProof : `http://localhost:8000${formData.idProof.startsWith('/') ? '' : '/'}${formData.idProof}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-600 hover:underline font-medium flex items-center gap-1"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z"/><path d="M18 18h-4"/><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/></svg>
                              View ID Proof
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Address *</label>
                      <textarea
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => {
                        setShowForm(false);
                        setEditingId(null);
                        setFormData({ name: '', email: '', phone: '', address: '', idProof: null });
                      }}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Staff Member'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Staff Directory ({staffList.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b text-sm text-gray-500">
                        <th className="p-3">Name</th>
                        <th className="p-3">Contact</th>
                        <th className="p-3">Join Date</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staffList.map((member) => (
                        <tr key={member._id || member.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{member.name}</td>
                          <td className="p-3">
                            <div className="text-sm">{member.phone}</div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                          </td>
                          <td className="p-3 text-sm">{member.created_at ? new Date(member.created_at).toLocaleDateString() : (member.joinDate || '-')}</td>
                          <td className="p-3">
                            <Badge variant={(member.is_active ?? member.status === 'active') ? 'default' : 'secondary'}>
                              {(member.is_active ?? member.status === 'active') ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="p-3 flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(member)}>Edit</Button>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(member._id || member.id)}>Delete</Button>
                          </td>
                        </tr>
                      ))}
                      {staffList.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-gray-500">
                            No staff members found. Add your first staff member to get started.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance">
            <StaffAttendancePage isEmbedded={true} />
          </TabsContent>

          <TabsContent value="leave">
            <ApprovalManagementPage isEmbedded={true} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
