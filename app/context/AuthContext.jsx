// app/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router'; // Use hooks from react-router
import { jwtDecode } from 'jwt-decode'; // Correct named import
import { login as apiLogin, logout as apiLogout } from '../utils/api'; // Use api functions

// Define the shape of the user object and context
interface User {
  id: number | string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// Create authentication context
const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to decode token safely
const decodeToken = (token: string): User | null => {
    try {
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp > currentTime) {
            // Ensure essential fields exist
            if (decoded.id && decoded.username && decoded.role) {
                 return {
                    id: decoded.id,
                    username: decoded.username,
                    role: decoded.role,
                 };
            }
        }
        // Token expired or invalid structure
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken'); // if used
        return null;
    } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken'); // if used
        return null;
    }
};


// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start loading until checked
  const navigate = useNavigate();
  const location = useLocation();

  // Check auth state on initial load (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') { // Run only on client
        const token = localStorage.getItem('token');
        if (token) {
            const decodedUser = decodeToken(token);
            setUser(decodedUser);
        }
        setLoading(false); // Finished initial check
    } else {
        setLoading(false); // No check needed on server
    }
  }, []);

  // Login function
  const handleLogin = useCallback(async (credentials: any) => {
    setLoading(true);
    try {
      const data = await apiLogin(credentials); // Call the API function

      if (data.token && data.user) {
        setUser(data.user);
        setLoading(false);
        // Redirect to admin dashboard or intended page after login
        const from = location.state?.from?.pathname || '/admin';
        navigate(from, { replace: true });
        return { success: true };
      } else {
         // Handle cases where API returns success but no token/user (shouldn't happen ideally)
         console.error('Login API success but missing token/user data:', data);
         setLoading(false);
         return { success: false, error: data.error || 'Login failed: Invalid server response' };
      }
    } catch (error: any) {
        console.error('Login error:', error);
        setLoading(false);
        // Extract error message from API response if possible
        const errorMessage = error.response?.data?.error || error.message || 'Login failed';
        return { success: false, error: errorMessage };
    }
  }, [navigate, location.state]); // Add dependencies

  // Logout function
  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      await apiLogout(); // Call the API function (clears local storage)
    } catch (error) {
      console.error('Logout API call failed (continuing local cleanup):', error);
    } finally {
      setUser(null);
      setLoading(false);
      // Redirect to login page after logout
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]); // Add dependency

  // Context value
  const value: AuthContextType = {
    user,
    loading,
    login: handleLogin,
    logout: handleLogout,
    isAuthenticated: !!user && !loading, // Only authenticated if not loading and user exists
    isAdmin: !!user && user.role === 'admin' && !loading,
  };

  // Don't render children until initial auth check is complete on the client
  if (loading && typeof window !== 'undefined') {
     return <div>Loading Authentication...</div>; // Or a spinner component
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}