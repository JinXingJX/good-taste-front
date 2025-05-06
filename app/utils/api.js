// app/utils/api.js
import axios from 'axios';
import { redirect } from 'react-router-dom'; 
// API 基础 URL - Ensure this matches your Go backend address
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && window.localStorage;

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for sending/receiving cookies if JWT is cookie-based
});

// 请求拦截器：添加认证 token (assuming Bearer token in localStorage)
apiClient.interceptors.request.use(
  (config) => {
    if (isBrowser) {
      const token = localStorage.getItem('token');
      if (token && !config.url.includes('/auth/login')) { // Don't add token to login request
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：处理错误 (simplified - add refresh token logic if implemented)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized specifically for non-login/refresh requests
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') && // Avoid redirect loop on login failure
      isBrowser // Only attempt localStorage operations in browser
      // Add && originalRequest.url !== '/auth/refresh' if you implement refresh
    ) {
       originalRequest._retry = true; // Prevent infinite loops

       // Clear token and redirect to login
       console.error('Authentication error (401). Redirecting to login.');
       localStorage.removeItem('token');
       localStorage.removeItem('refreshToken'); // If using refresh tokens

       // IMPORTANT: Redirecting directly here can be tricky with React Router loaders/actions.
       // It's often better to handle the redirect in the loader/action itself after catching the error.
       // Throw a special error or return a specific value that the loader/action can catch.
       // For simplicity here, we'll throw the original error, but the loader/action MUST handle it.
       // throw new Response("Unauthorized", { status: 401 }); // Preferred way for loaders/actions
    }

    // Throw the error so it can be caught by calling functions (loaders/actions)
    return Promise.reject(error);
  }
);


// --- Public API Functions ---

// 获取页面内容
export const getPage = async (pageKey, language = 'zh') => {
  console.log(`API: Fetching page ${pageKey} for lang ${language}`);
  // Note: Your design doc API is /api/pages/:key, not requiring language.
  // Adjust the API call based on your actual Go backend implementation.
  // If language affects content fetched from backend, add lang query param.
  const response = await apiClient.get(`/pages/${pageKey}`);
  return response.data; // Assuming backend returns the full page object { id, page_key, title_zh, ... }
};

// 获取产品列表 (Add pagination/filtering params if needed)
export const getProducts = async (params = {}) => {
  console.log('API: Fetching products with params:', params);
  const response = await apiClient.get('/products', { params }); // Pass language via params if needed
  return response.data; // Assuming backend returns { products: [...] } or just [...]
};

// 获取产品详情
export const getProductById = async (id, language = 'zh') => {
  console.log(`API: Fetching product ${id} for lang ${language}`);
  // Adjust based on backend: `/products/${id}?lang=${language}` or similar if needed
  const response = await apiClient.get(`/products/${id}`);
  return response.data; // Assuming backend returns the product object
};

// 提交留言
export const submitMessage = async (messageData) => {
  console.log('API: Submitting message:', messageData);
  const response = await apiClient.post('/messages', messageData);
  return response.data;
};


// --- Admin API Functions (Require Authentication) ---

// 管理员登录
export const login = async (credentials) => {
  console.log('API: Attempting login for:', credentials.username);
  const response = await apiClient.post('/auth/login', credentials);
  // Save token if login is successful
  if (response.data.token && isBrowser) {
    localStorage.setItem('token', response.data.token);
    console.log('API: Login successful, token stored.');
  }
  // if (response.data.refreshToken && isBrowser) { // If using refresh tokens
  //   localStorage.setItem('refreshToken', response.data.refreshToken);
  // }
  return response.data; // Expected: { token: "...", user: { id, username, role } } or error
};

// 管理员登出
export const logout = async () => {
  console.log('API: Logging out');
  // Optional: Call backend logout if it invalidates tokens server-side
  try {
     await apiClient.post('/auth/logout');
  } catch (error) {
     // Ignore errors on logout, just clear local storage
     console.warn('API: Backend logout failed (may not be implemented):', error);
  } finally {
     if (isBrowser) {
       localStorage.removeItem('token');
       localStorage.removeItem('refreshToken'); // If using refresh tokens
       console.log('API: Local tokens cleared.');
     }
  }
};

// 更新页面内容 (Admin)
export const updatePage = async (pageKey, pageData) => {
  console.log(`API: Updating page ${pageKey}:`, pageData);
  const response = await apiClient.put(`/admin/pages/${pageKey}`, pageData);
  return response.data;
};

// 获取所有留言 (Admin - Add pagination/filtering params if needed)
export const getMessages = async (params = {}) => {
  console.log('API: Fetching messages with params:', params);
  const response = await apiClient.get('/admin/messages', { params });
  return response.data; // Assuming { messages: [...] } or similar
};

// 回复留言 (Admin)
export const replyMessage = async (messageId, replyData) => {
  console.log(`API: Replying to message ${messageId}:`, replyData);
  const response = await apiClient.put(`/admin/messages/${messageId}/reply`, replyData);
  return response.data;
};

// 删除留言 (Admin)
export const deleteMessage = async (messageId) => {
  console.log(`API: Deleting message ${messageId}`);
  const response = await apiClient.delete(`/admin/messages/${messageId}`);
  return response.data;
};


// 创建产品 (Admin)
export const createProduct = async (productData) => {
  console.log('API: Creating product:', productData);
  // Handle FormData if image upload is included
  const headers = productData instanceof FormData
    ? { 'Content-Type': 'multipart/form-data' }
    : { 'Content-Type': 'application/json' };
  const response = await apiClient.post('/admin/products', productData, { headers });
  return response.data;
};

// 更新产品 (Admin)
export const updateProduct = async (productId, productData) => {
  console.log(`API: Updating product ${productId}:`, productData);
   // Handle FormData if image upload is included
   const headers = productData instanceof FormData
     ? { 'Content-Type': 'multipart/form-data' }
     : { 'Content-Type': 'application/json' };
  const response = await apiClient.put(`/admin/products/${productId}`, productData, { headers });
  return response.data;
};

// 删除产品 (Admin)
export const deleteProduct = async (productId) => {
  console.log(`API: Deleting product ${productId}`);
  const response = await apiClient.delete(`/admin/products/${productId}`);
  return response.data;
};

// 获取用户列表 (Admin)
export const getUsers = async (params = {}) => {
    console.log('API: Fetching users with params:', params);
    const response = await apiClient.get('/admin/users', { params });
    return response.data; // Assuming { users: [...] }
};

// 创建用户 (Admin)
export const createUser = async (userData) => {
    console.log('API: Creating user:', userData.username);
    const response = await apiClient.post('/admin/users', userData);
    return response.data;
};

// 删除用户 (Admin)
export const deleteUser = async (userId) => {
    console.log(`API: Deleting user ${userId}`);
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
};

// 修改密码 (Admin or User?) - Endpoint might vary
// Assuming an admin can change any user's password, or a user changes their own
export const changePassword = async (userId, passwordData) => {
    console.log(`API: Changing password for user ${userId}`);
    // Adjust endpoint if necessary, e.g., /api/admin/users/:id/password or /api/profile/change-password
    const response = await apiClient.put(`/admin/users/${userId}/password`, passwordData); // Example endpoint
    return response.data;
}

// 获取网站设置 (Admin) - Assuming a single settings object
export const getSettings = async () => {
    console.log('API: Fetching settings');
    // Endpoint might be /api/admin/settings or similar
    const response = await apiClient.get('/admin/settings'); // Example endpoint
    return response.data;
};

// 更新网站设置 (Admin)
export const updateSettings = async (settingsData) => {
    console.log('API: Updating settings:', settingsData);
    // Endpoint might be /api/admin/settings or similar
    const response = await apiClient.put('/admin/settings', settingsData); // Example endpoint
    return response.data;
};


// // 上传文件 (Example - if you have a dedicated upload endpoint)
// export const uploadFile = async (file, folder = 'images') => {
//   console.log(`API: Uploading file to folder: ${folder}`);
//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('folder', folder);

//   const response = await apiClient.post('/admin/upload', formData, { // Example endpoint
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
//   return response.data; // Expected: { url: "..." }
// };

export default apiClient;