const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export interface RegisterCustomerData {
  name: string;
  email: string;
  phone: string;
  full_address: string;
}

export const registerCustomer = async (data: RegisterCustomerData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail?.[0]?.msg || 'Registration failed');
  }
  return response.json();
};

export const sendCustomerOtp = async (phone: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail?.[0]?.msg || 'Failed to send OTP');
  }
  return response.json();
};

export const verifyCustomerOtp = async (phone: string, otp_code: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp_code, role: 0 }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail?.[0]?.msg || 'OTP Verification failed');
  }
  return response.json();
};
