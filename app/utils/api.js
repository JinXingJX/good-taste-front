import axios from 'axios';

// API 基础 URL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：添加认证 token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：处理错误和刷新 token
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 如果是 401 未授权错误，且不是刷新 token 的请求
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/refresh'
    ) {
      originalRequest._retry = true;

      try {
        // 尝试刷新 token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await apiClient.post('/auth/refresh', {
            refreshToken,
          });

          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            
            // 使用新 token 重试原始请求
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
            return apiClient(originalRequest);
          }
        }
        
        // 如果没有刷新 token 或刷新失败，重定向到登录页
        window.location.href = '/admin/login';
        return Promise.reject(error);
      } catch (refreshError) {
        // 刷新 token 请求失败，清除本地存储并重定向到登录页
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// 公共 API 函数

// 获取页面内容
export const getPage = async (pageKey, language = 'zh') => {
  try {
    const response = await apiClient.get(`/pages/${pageKey}?lang=${language}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching page ${pageKey}:`, error);
    throw error;
  }
};

// 获取产品列表
export const getProducts = async (category = null, language = 'zh') => {
  try {
    const url = category 
      ? `/products?category=${category}&lang=${language}` 
      : `/products?lang=${language}`;
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// 获取产品详情
export const getProductById = async (id, language = 'zh') => {
  try {
    const response = await apiClient.get(`/products/${id}?lang=${language}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

// 提交留言
export const submitMessage = async (messageData) => {
  try {
    const response = await apiClient.post('/messages', messageData);
    return response.data;
  } catch (error) {
    console.error('Error submitting message:', error);
    throw error;
  }
};

// 管理员登录
export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    
    // 保存 token 到本地存储
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// 管理员登出
export const logout = async () => {
  try {
    // 可选：如果后端需要处理登出
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // 无论如何，清除本地存储的 token
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
};

// 更新页面内容
export const updatePage = async (pageKey, pageData) => {
  try {
    const response = await apiClient.put(`/admin/pages/${pageKey}`, pageData);
    return response.data;
  } catch (error) {
    console.error(`Error updating page ${pageKey}:`, error);
    throw error;
  }
};

// 获取所有留言
export const getMessages = async (params = {}) => {
  try {
    const response = await apiClient.get('/admin/messages', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

// 回复留言
export const replyMessage = async (messageId, replyData) => {
  try {
    const response = await apiClient.put(`/admin/messages/${messageId}/reply`, replyData);
    return response.data;
  } catch (error) {
    console.error(`Error replying to message ${messageId}:`, error);
    throw error;
  }
};

// 更新产品
export const updateProduct = async (productId, productData) => {
  try {
    const response = await apiClient.put(`/admin/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${productId}:`, error);
    throw error;
  }
};

// 创建产品
export const createProduct = async (productData) => {
  try {
    const response = await apiClient.post('/admin/products', productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// 删除产品
export const deleteProduct = async (productId) => {
  try {
    const response = await apiClient.delete(`/admin/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product ${productId}:`, error);
    throw error;
  }
};

// 上传文件
export const uploadFile = async (file, folder = 'images') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    
    const response = await apiClient.post('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export default apiClient;