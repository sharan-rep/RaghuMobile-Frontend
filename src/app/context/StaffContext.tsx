import { createContext, useContext, useState, ReactNode } from 'react';

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
  staffId: string;
  staffName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
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
  addLeaveRequest: (request: LeaveRequest) => void;
  updateLeaveStatus: (id: string, status: 'approved' | 'rejected') => void;
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

  const addLeaveRequest = (request: LeaveRequest) => {
    setLeaveRequests((prev) => [...prev, request]);
  };

  const updateLeaveStatus = (id: string, status: 'approved' | 'rejected') => {
    setLeaveRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req))
    );
  };

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
