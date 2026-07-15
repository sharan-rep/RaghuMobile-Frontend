const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const getHeaders = () => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export interface LeaveRequest {
  start_date: string;
  end_date: string;
  reason: string;
  staff_id: string;
}

export interface LeaveResponse {
  start_date: string;
  end_date: string;
  reason: string;
  id: string;
  staff_id: string;
  status: string;
  created_at: string;
}

export const applyLeave = async (data: LeaveRequest): Promise<LeaveResponse> => {
  const response = await fetch(`${API_BASE_URL}/leaves/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail?.[0]?.msg || 'Failed to apply leave');
  }
  return response.json();
};

export const getStaffLeaves = async (staff_id: string): Promise<LeaveResponse[]> => {
  const response = await fetch(`${API_BASE_URL}/leaves/staff/${staff_id}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail?.[0]?.msg || 'Failed to fetch staff leaves');
  }
  return response.json();
};

export const getAllLeaves = async (): Promise<LeaveResponse[]> => {
  const response = await fetch(`${API_BASE_URL}/leaves/`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail?.[0]?.msg || 'Failed to fetch all leaves');
  }
  return response.json();
};

export const updateLeaveStatus = async (leave_id: string, status: string): Promise<LeaveResponse> => {
  const response = await fetch(`${API_BASE_URL}/leaves/${leave_id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail?.[0]?.msg || 'Failed to update leave status');
  }
  return response.json();
};
