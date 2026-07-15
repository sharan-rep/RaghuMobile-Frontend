const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const SERVER_URL = API_BASE_URL.replace(/\/api$/, '');

const getHeaders = (isFormData = false) => {
  let token = localStorage.getItem('raghu_token') || localStorage.getItem('adminToken') || localStorage.getItem('token');
  const headers: HeadersInit = {};

  if (token) {
    if (token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};

export const formatImageUrl = (url: string | null | undefined) => {
  if (url && url.startsWith('/static/')) {
    return `${SERVER_URL}${url}`;
  }
  return url;
};

export const formatProductImageUrls = (product: any) => {
  if (!product) return product;
  const p = { ...product };
  if (p.image) p.image = formatImageUrl(p.image);
  if (p.video) p.video = formatImageUrl(p.video);
  if (p.images && Array.isArray(p.images)) {
    p.images = p.images.map(formatImageUrl);
  }
  return p;
};

export interface ProductSpecifications {
  ram?: string;
  storage?: string;
}

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imei: string;
  image?: string;
  images?: string[];
  video?: string;
  brand: string;
  category: string;
  stock: number;
  inStock?: boolean;
  condition?: string;
  storage?: string;
  color?: string;
  specifications?: ProductSpecifications;
}

const processResponseData = (responseData: any) => {
  if (responseData && responseData.data) {
    if (Array.isArray(responseData.data.items)) {
      responseData.data.items = responseData.data.items.map(formatProductImageUrls);
    } else if (Array.isArray(responseData.data)) {
      responseData.data = responseData.data.map(formatProductImageUrls);
    } else {
      responseData.data = formatProductImageUrls(responseData.data);
    }
  } else if (Array.isArray(responseData)) {
    return responseData.map(formatProductImageUrls);
  } else if (responseData && typeof responseData === 'object') {
    return formatProductImageUrls(responseData);
  }
  return responseData;
};

export const createProduct = async (data: ProductPayload) => {
  const response = await fetch(`${API_BASE_URL}/products/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to create product');
  }

  return processResponseData(await response.json());
};

export const getProduct = async (productId: string) => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch product');
  }

  return processResponseData(await response.json());
};

export const updateProduct = async (productId: string, data: ProductPayload) => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update product');
  }

  return processResponseData(await response.json());
};

export const deleteProduct = async (productId: string) => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to delete product');
  }

  return processResponseData(await response.json());
};

export const listProducts = async (page = 1, limit = 100) => {
  const response = await fetch(`${API_BASE_URL}/products/?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to list products');
  }

  return processResponseData(await response.json());
};

export const downloadSampleExcel = async () => {
  const response = await fetch(`${API_BASE_URL}/products/download-sample`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to download sample excel');
  }

  // Handle blob response for file download
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sample_products.xlsx';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

export const bulkUploadExcel = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/products/upload-excel`, {
    method: 'POST',
    headers: getHeaders(true),
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to upload excel file');
  }

  return processResponseData(await response.json());
};
