const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const getHeaders = () => {
  let token = localStorage.getItem('raghu_token') || localStorage.getItem('adminToken') || localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    if (token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export interface AddCartItemPayload {
  product_id: string;
  quantity: number;
  color?: string;
  storage?: string;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export const getCart = async () => {
  const response = await fetch(`${API_BASE_URL}/cart/`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to fetch cart');
  }
  return response.json();
};

export const addCartItem = async (payload: AddCartItemPayload) => {
  const response = await fetch(`${API_BASE_URL}/cart/items`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to add cart item');
  }
  return response.json();
};

export const updateCartItem = async (itemId: string, payload: UpdateCartItemPayload) => {
  const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to update cart item');
  }
  return response.json();
};

export const removeCartItem = async (itemId: string) => {
  const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to remove cart item');
  }
  return response.json();
};

export const clearCart = async () => {
  const response = await fetch(`${API_BASE_URL}/cart/`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to clear cart');
  }
  return response.json();
};
