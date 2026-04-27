/**
 * Centralized API Client for RIC-SAU Dashboard
 * Handles all database interactions and file uploads.
 */

type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function fetchApi(endpoint: string, method: ApiMethod = 'GET', body?: any) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(endpoint, options);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || `API request failed: ${response.statusText}`);
  }

  return data;
}

/**
 * Generic Content API handler for the monolithic `/api/content` endpoint.
 */
export const contentApi = {
  // Fetch multiple items
  getMany: async (type: string, limit?: number, offset?: number) => {
    let url = `/api/content?type=${type}`;
    if (limit) url += `&limit=${limit}`;
    if (offset) url += `&offset=${offset}`;
    
    const res = await fetchApi(url, 'GET');
    return res.data;
  },

  // Fetch a single singleton item (like Home, About, Contact, Settings)
  getSingleton: async (type: string) => {
    const res = await fetchApi(`/api/content?type=${type}`, 'GET');
    return res.data;
  },

  // Create a new item or update a singleton
  create: async (type: string, data: any) => {
    const res = await fetchApi('/api/content', 'POST', { type, data });
    return res.data;
  },

  // Update an existing item by ID
  update: async (type: string, id: number, data: any) => {
    const res = await fetchApi('/api/content', 'PUT', { type, id, data });
    return res.data;
  },

  // Delete an item by ID
  delete: async (type: string, id: number) => {
    const res = await fetchApi(`/api/content?type=${type}&id=${id}`, 'DELETE');
    return res.data;
  },
};

/**
 * File Upload API handler.
 */
export const uploadApi = {
  uploadFile: async (file: File, meta?: Record<string, any>) => {
    const formData = new FormData();
    formData.append('file', file);
    
    if (meta) {
      Object.entries(meta).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Upload failed');
    }

    return data;
  }
};

/**
 * Authentication API handler.
 */
export const authApi = {
  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('adminUser');
      return true;
    } catch (e) {
      console.error('Logout failed:', e);
      return false;
    }
  }
};
