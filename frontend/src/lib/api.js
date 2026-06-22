const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';

/**
 * Get authorization headers with JWT token
 */
function getAuthHeaders() {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Generic API request handler
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

// ========================================
// Auth API
// ========================================
export const authAPI = {
  login: (email, password) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMe: () => apiRequest('/auth/me'),

  updateProfile: (data) =>
    apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ========================================
// Papers API
// ========================================
export const papersAPI = {
  getAll: (page = 0, size = 12, sortBy = 'createdAt', direction = 'desc') =>
    apiRequest(`/papers?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`),

  getById: (id) => apiRequest(`/papers/${id}`),

  search: (params) => {
    const query = new URLSearchParams();
    if (params.course) query.set('course', params.course);
    if (params.semester) query.set('semester', params.semester);
    if (params.year) query.set('year', params.year);
    if (params.subjectName) query.set('subjectName', params.subjectName);
    if (params.keyword) query.set('keyword', params.keyword);
    query.set('page', params.page || 0);
    query.set('size', params.size || 12);
    query.set('sortBy', params.sortBy || 'createdAt');
    query.set('direction', params.direction || 'desc');
    return apiRequest(`/papers/search?${query.toString()}`);
  },

  upload: (formData) =>
    apiRequest('/papers', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    }),

  update: (id, data) => {
    const query = new URLSearchParams();
    Object.entries(data).forEach(([key, val]) => {
      if (val !== undefined && val !== null) query.set(key, val);
    });
    return apiRequest(`/papers/${id}?${query.toString()}`, { method: 'PUT' });
  },

  delete: (id) => apiRequest(`/papers/${id}`, { method: 'DELETE' }),

  getDownloadUrl: (id) => `${API_BASE}/papers/${id}/download`,

  download: async (id) => {
    const url = `${API_BASE}/papers/${id}/download`;
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Download failed');
    return response.blob();
  },

  // Filters
  getCourses: () => apiRequest('/papers/filters/courses'),
  getSubjects: (course) => apiRequest(`/papers/filters/subjects?course=${encodeURIComponent(course)}`),
  getYears: () => apiRequest('/papers/filters/years'),
};

// ========================================
// AI API
// ========================================
export const aiAPI = {
  analyzePaper: (paperId) =>
    apiRequest(`/ai/analyze-paper/${paperId}`, { method: 'POST' }),

  chat: (query, paperId = null) =>
    apiRequest('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ query, paperId }),
    }),
};

// ========================================
// Admin API
// ========================================
export const adminAPI = {
  getStats: () => apiRequest('/admin/stats'),
  getStudents: () => apiRequest('/admin/students'),
};
