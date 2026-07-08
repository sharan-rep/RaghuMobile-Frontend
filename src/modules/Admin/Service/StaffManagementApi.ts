const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  const headers: HeadersInit = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
};

export const createStaff = async (data: FormData) => {
  const response = await fetch(`${API_BASE_URL}/staff/`, {
    method: 'POST',
    headers: getHeaders(true),
    body: data,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail?.[0]?.msg || 'Failed to create staff');
  }
  return response.json();
};

export const listStaff = async () => {
  const response = await fetch(`${API_BASE_URL}/staff/`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail?.[0]?.msg || 'Failed to fetch staff list');
  }
  return response.json();
};

export const getStaff = async (staff_id: string) => {
  const response = await fetch(`${API_BASE_URL}/staff/${staff_id}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail?.[0]?.msg || 'Failed to fetch staff details');
  }
  return response.json();
};

export const updateStaff = async (staff_id: string, data: FormData | Record<string, any>) => {
  const isFormData = data instanceof FormData;
  const response = await fetch(`${API_BASE_URL}/staff/${staff_id}`, {
    method: 'PATCH',
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail?.[0]?.msg || 'Failed to update staff');
  }
  return response.json();
};

export const deleteStaff = async (staff_id: string) => {
  const response = await fetch(`${API_BASE_URL}/staff/${staff_id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail?.[0]?.msg || 'Failed to delete staff');
  }
  
  if (response.status === 204) {
    return { success: true };
  }
  return response.json().catch(() => ({ success: true }));
};

export const getStaffOrders = async (staff_id: string) => {
  const response = await fetch(`${API_BASE_URL}/staff/${staff_id}/orders`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail?.[0]?.msg || 'Failed to fetch staff orders');
  }
  return response.json();
};
