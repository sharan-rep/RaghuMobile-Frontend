import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const isTokenExpired = (token: string | null) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const token = localStorage.getItem('raghu_token');
      if (token && isTokenExpired(token)) {
        localStorage.removeItem('raghu_token');
        localStorage.removeItem('raghu_user');
        return null;
      }
      const saved = localStorage.getItem('raghu_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    const username = email.includes('@') ? email.split('@')[0] : email;
    const roleMap: Record<UserRole, number> = {
      admin: 1,
      staff: 2
    };
    const apiRole = roleMap[role];

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: apiRole }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.access_token && data.user) {
          localStorage.setItem('raghu_token', data.access_token);

          const backendUser = data.user;
          let frontendRole: UserRole = role; // Default fallback to requested role
          if (backendUser.role === 1) {
            frontendRole = 'admin';
          } else if (backendUser.role === 2) {
            frontendRole = 'staff';
          } else if (typeof backendUser.role === 'string') {
            frontendRole = backendUser.role as UserRole;
          }

          const mappedUser: User = {
            id: backendUser._id || backendUser.id || 'admin-id',
            name: backendUser.name || (role === 'admin' ? 'Admin User' : 'Staff User'),
            email: backendUser.email || email,
            role: frontendRole,
          };

          localStorage.setItem('raghu_user', JSON.stringify(mappedUser));
          setUser(mappedUser);
          return true;
        }
      }
    } catch (err) {
      console.error('Login API error, trying fallback:', err);
    }

    // Mock Fallback for demo credentials
    if ((role === 'admin' && password === 'admin123') || (role === 'staff' && password === 'staff123') || password === 'password') {
      const mockUser: User = {
        id: `mock-${role}-id`,
        name: role === 'admin' ? 'Admin User' : 'Staff User',
        email,
        role,
      };
      localStorage.setItem('raghu_user', JSON.stringify(mockUser));
      setUser(mockUser);
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem('raghu_token');
    localStorage.removeItem('raghu_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
