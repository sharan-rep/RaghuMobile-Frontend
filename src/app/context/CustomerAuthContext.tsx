import { createContext, useContext, useState, ReactNode } from 'react';
import { registerCustomer, sendCustomerOtp, verifyCustomerOtp } from '../../modules/Auth/service/CustomerAuth';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
}

interface CustomerAuthContextType {
  customer: Customer | null;
  register: (data: { name: string; email: string; phone: string; full_address: string }) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  sendOtp: (phone: string) => Promise<boolean>;
  verifyOtp: (phone: string, otpCode: string) => Promise<boolean>;
  loginWithCustomerData: (customer: Customer, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

const STORAGE_KEY = 'raghu_customers';
const SESSION_KEY = 'raghu_customer_session';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(() => {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  });

  const loginWithCustomerData = (customerData: Customer, token: string) => {
    localStorage.setItem('raghu_token', token);
    localStorage.setItem(SESSION_KEY, JSON.stringify(customerData));
    setCustomer(customerData);
  };

  const getCustomers = (): Array<Customer & { password: string }> => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  };

  const register = async (data: { name: string; email: string; phone: string; full_address: string }): Promise<boolean> => {
    try {
      await registerCustomer(data);
      return true;
    } catch (err) {
      console.error('Customer register API error:', err);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 0 }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.access_token && data.user) {
          localStorage.setItem('raghu_token', data.access_token);
          const backendUser = data.user;
          const mappedUser: Customer = {
            id: backendUser._id || backendUser.id || 'customer-id',
            name: backendUser.name || 'Customer User',
            email: backendUser.email || email,
            phone: backendUser.phone || '',
            address: backendUser.address || '',
            gender: backendUser.gender || 'Other',
          };
          setCustomer(mappedUser);
          localStorage.setItem(SESSION_KEY, JSON.stringify(mappedUser));
          return true;
        }
      }
    } catch (err) {
      console.error('Customer login API error:', err);
    }

    // Mock Fallback for demo credentials
    if (password === 'password') {
      const mockUser: Customer = {
        id: 'mock-customer-id',
        name: 'Customer User',
        email,
        phone: '',
        address: '',
        gender: 'Other',
      };
      setCustomer(mockUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(mockUser));
      return true;
    }

    return false;
  };

  const sendOtp = async (phone: string): Promise<boolean> => {
    try {
      await sendCustomerOtp(phone);
      return true;
    } catch (err) {
      console.error('Customer sendOtp API error:', err);
      return false;
    }
  };

  const verifyOtp = async (phone: string, otpCode: string): Promise<boolean> => {
    try {
      const data = await verifyCustomerOtp(phone, otpCode);
      if (data.access_token && data.user) {
        localStorage.setItem('raghu_token', data.access_token);
        const backendUser = data.user;
        const mappedUser: Customer = {
          id: backendUser._id || backendUser.id || 'customer-id',
          name: backendUser.name || 'Customer User',
          email: backendUser.email || '',
          phone: backendUser.phone || phone,
          address: backendUser.full_address || '',
          gender: backendUser.gender || 'Other',
        };
        setCustomer(mappedUser);
        localStorage.setItem(SESSION_KEY, JSON.stringify(mappedUser));
        return true;
      }
    } catch (err) {
      console.error('Customer verifyOtp API error:', err);
    }
    return false;
  };

  const logout = () => {
    setCustomer(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <CustomerAuthContext.Provider value={{ customer, register, login, sendOtp, verifyOtp, loginWithCustomerData, logout, isAuthenticated: !!customer }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  return context;
}
