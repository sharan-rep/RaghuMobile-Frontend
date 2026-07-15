import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { applyLeave, getAllLeaves, getStaffLeaves, updateLeaveStatus as updateLeaveStatusApi } from '../../modules/Staff/Service/LeaveApi';

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  idProof: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface LeaveRequest {
  id: string;
  staff_id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | string;
  created_at: string;
  // Fallbacks for UI mapping if needed
  staffId?: string;
  staffName?: string;
  appliedDate?: string;
}

export interface Order {
  id: string;
  customerName: string;
  product: string;
  price: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

export interface Attendance {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  status: 'present' | 'absent' | 'leave';
}

interface StaffContextType {
  staff: Staff[];
  leaveRequests: LeaveRequest[];
  orders: Order[];
  attendance: Attendance[];
  addStaff: (staff: Staff) => void;
  addLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'created_at' | 'status'>) => Promise<void>;
  updateLeaveStatus: (id: string, status: string) => Promise<void>;
  fetchAllLeaves: () => Promise<void>;
  fetchStaffLeaves: (staffId: string) => Promise<void>;
  updateOrderStatus: (id: string, status: 'pending' | 'shipped' | 'delivered' | 'cancelled') => void;
  addAttendance: (att: Attendance) => void;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

const initialOrders: Order[] = [
  { id: '1', customerName: 'Raj Kumar', product: 'iPhone 15 Pro Max', price: 134900, status: 'pending', date: '2024-02-20' },
  { id: '2', customerName: 'Priya Singh', product: 'Samsung Galaxy S24', price: 79999, status: 'delivered', date: '2024-02-19' },
  { id: '3', customerName: 'Arun Raj', product: 'OnePlus 12', price: 64999, status: 'pending', date: '2024-02-21' },
];

export function StaffProvider({ children }: { children: ReactNode }) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  const addStaff = (newStaff: Staff) => {
    setStaff((prev) => [...prev, newStaff]);
  };

  const addLeaveRequest = async (request: Omit<LeaveRequest, 'id' | 'created_at' | 'status'>) => {
    try {
      const response = await applyLeave({
        start_date: request.startDate,
        end_date: request.endDate,
        reason: request.reason,
        staff_id: request.staff_id || request.staffId || '',
      });
      // Ensure local state uses the new response structure
      const newLeave: LeaveRequest = {
        id: response.id,
        staff_id: response.staff_id,
        startDate: response.start_date,
        endDate: response.end_date,
        reason: response.reason,
        status: response.status?.toLowerCase() || 'pending',
        created_at: response.created_at,
        staffId: response.staff_id,
        appliedDate: response.created_at
      };
      setLeaveRequests((prev) => [...prev, newLeave]);
    } catch (error) {
      console.error('Failed to apply leave:', error);
      throw error;
    }
  };

  const updateLeaveStatus = async (id: string, status: string) => {
    try {
      const response = await updateLeaveStatusApi(id, status);
      setLeaveRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: response.status?.toLowerCase() || 'pending' } : req))
      );
    } catch (error) {
      console.error('Failed to update leave status:', error);
      throw error;
    }
  };

  const fetchAllLeaves = useCallback(async () => {
    try {
      const data = await getAllLeaves();
      const formattedData = data.map(item => ({
        id: item.id,
        staff_id: item.staff_id,
        startDate: item.start_date,
        endDate: item.end_date,
        reason: item.reason,
        status: item.status?.toLowerCase() || 'pending',
        created_at: item.created_at,
        staffId: item.staff_id,
        appliedDate: item.created_at
      }));
      setLeaveRequests(formattedData);
    } catch (error) {
      console.error('Failed to fetch all leaves:', error);
    }
  }, []);

  const fetchStaffLeaves = useCallback(async (staffId: string) => {
    try {
      const data = await getStaffLeaves(staffId);
      const formattedData = data.map(item => ({
        id: item.id,
        staff_id: item.staff_id,
        startDate: item.start_date,
        endDate: item.end_date,
        reason: item.reason,
        status: item.status?.toLowerCase() || 'pending',
        created_at: item.created_at,
        staffId: item.staff_id,
        appliedDate: item.created_at
      }));
      setLeaveRequests(formattedData);
    } catch (error) {
      console.error('Failed to fetch staff leaves:', error);
    }
  }, []);

  const updateOrderStatus = (id: string, status: 'pending' | 'shipped' | 'delivered' | 'cancelled') => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
  };

  const addAttendance = (att: Attendance) => {
    setAttendance((prev) => [...prev, att]);
  };

  return (
    <StaffContext.Provider
      value={{
        staff,
        leaveRequests,
        orders,
        attendance,
        addStaff,
        addLeaveRequest,
        updateLeaveStatus,
        fetchAllLeaves,
        fetchStaffLeaves,
        updateOrderStatus,
        addAttendance,
      }}
    >
      {children}
    </StaffContext.Provider>
  );
}

export function useStaff() {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error('useStaff must be used within StaffProvider');
  }
  return context;
}
