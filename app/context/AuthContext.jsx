import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import jwtDecode from 'jwt-decode';
import { login, logout } from '../utils/api';

// 创建认证上下文
const AuthContext = createContext(null);

// 提供认证上下文的组件
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // 初始化时检查是否已登录
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // 解析 JWT token
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          // 验证 token 是否过期
          if (decoded.exp > currentTime) {
            setUser({
              id: decoded.id,
              username: decoded.username,
              role: decoded.role,
            });
          } else {
            // token 已过期，清除本地存储
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            setUser(null);
          }
        } catch (error) {
          console.error('Invalid token:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          setUser(null);
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);
  
  // 登录函数
  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      const data = await login(credentials);
      
      if (data.user) {
        setUser(data.user);
        navigate('/admin');
        return { success: true };
      }
      
      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  };
  
  // 登出函数
  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      setUser(null);
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 提供的上下文值
  const value = {
    user,
    loading,
    login: handleLogin,
    logout: handleLogout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;