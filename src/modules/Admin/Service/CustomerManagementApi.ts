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

export const listCustomers = async (params?: { search?: string, is_active?: boolean | null, page?: number, limit?: number }) => {
  const queryParams = new URLSearchParams();
  if (params) {
    if (params.search) queryParams.append('search', params.search);
    if (params.is_active !== undefined && params.is_active !== null) queryParams.append('is_active', String(params.is_active));
    if (params.page) queryParams.append('page', String(params.page));
    if (params.limit) queryParams.append('limit', String(params.limit));
  }

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/customers/${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail?.[0]?.msg || 'Failed to fetch customers');
  }
  return response.json();
};

export const getCustomer = async (customer_id: string) => {
  const response = await fetch(`${API_BASE_URL}/customers/${customer_id}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail?.[0]?.msg || 'Failed to fetch customer details');
  }
  return response.json();
};

export const deleteCustomer = async (customer_id: string) => {
  const response = await fetch(`${API_BASE_URL}/customers/${customer_id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail?.[0]?.msg || 'Failed to delete customer');
  }
  return response.json();
};

export const getCustomerOrders = async (customer_id: string) => {
  const response = await fetch(`${API_BASE_URL}/customers/${customer_id}/orders`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail?.[0]?.msg || 'Failed to fetch customer orders');
  }
  return response.json();
};

export const updateCustomerStatus = async (customer_id: string, is_active: boolean) => {
  // Using the path specified in the request
  const response = await fetch(`${API_BASE_URL}/customers/${customer_id}/orders`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ is_active }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail?.[0]?.msg || 'Failed to update customer status');
  }
  return response.json();
};
