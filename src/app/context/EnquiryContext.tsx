import { createContext, useContext, useState, ReactNode } from 'react';

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  preferredDate: string;
  message: string;
  submittedAt: string;
  status: 'New' | 'Contacted' | 'Resolved';
}

interface EnquiryContextType {
  enquiries: Enquiry[];
  addEnquiry: (data: Omit<Enquiry, 'id' | 'submittedAt' | 'status'>) => void;
  updateStatus: (id: string, status: Enquiry['status']) => void;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([
    {
      id: 'enq-001',
      name: 'Rajesh Kumar',
      phone: '+91 9876543210',
      email: 'rajesh@example.com',
      serviceType: 'Phone Purchase',
      preferredDate: '2026-06-25',
      message: 'Interested in iPhone 15 Pro Max. Would like to know about EMI options.',
      submittedAt: '2026-06-22T10:30:00',
      status: 'New',
    },
    {
      id: 'enq-002',
      name: 'Priya Devi',
      phone: '+91 8765432109',
      email: 'priya@example.com',
      serviceType: 'Repair',
      preferredDate: '2026-06-24',
      message: 'My Samsung Galaxy S23 screen is cracked. Need repair estimate.',
      submittedAt: '2026-06-22T14:15:00',
      status: 'Contacted',
    },
  ]);

  const addEnquiry = (data: Omit<Enquiry, 'id' | 'submittedAt' | 'status'>) => {
    const newEnquiry: Enquiry = {
      ...data,
      id: `enq-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'New',
    };
    setEnquiries(prev => [newEnquiry, ...prev]);
  };

  const updateStatus = (id: string, status: Enquiry['status']) => {
    setEnquiries(prev =>
      prev.map(e => (e.id === id ? { ...e, status } : e))
    );
  };

  return (
    <EnquiryContext.Provider value={{ enquiries, addEnquiry, updateStatus }}>
      {children}
    </EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const context = useContext(EnquiryContext);
  if (context === undefined) {
    throw new Error('useEnquiry must be used within an EnquiryProvider');
  }
  return context;
}
