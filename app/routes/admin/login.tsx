import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { login } from '../../utils/api';
import { Form } from 'react-router-dom';

export default function AdminLogin() {
  const { t } = useTranslation(['admin', 'common']);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();
  
  // 检查是否已登录
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);
  
  // 处理登录
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await login(data);
      
      if (response.token) {
        navigate('/admin');
      } else {
        setError(t('admin:login.invalidCredentials'));
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.error || 
        t('admin:login.loginFailed')
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('admin:login.title')}
          </h1>
          <p className="text-gray-600">
            {t('admin:login.subtitle')}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <Form method="post" className="space-y-6">
          <div>
            <label 
              htmlFor="username" 
              className="block text-gray-700 font-medium mb-2"
            >
              {t('admin:login.username')}
            </label>
            <input
              id="username"
              type="text"
              name="username"
              {...register('username', { required: true })}
              className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.username && (
              <p className="mt-1 text-red-500 text-sm">
                {t('common:forms.required')}
              </p>
            )}
          </div>
          
          <div>
            <label 
              htmlFor="password" 
              className="block text-gray-700 font-medium mb-2"
            >
              {t('admin:login.password')}
            </label>
            <input
              id="password"
              type="password"
              name="password"
              {...register('password', { required: true })}
              className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-red-500 text-sm">
                {t('common:forms.required')}
              </p>
            )}
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white py-3 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading 
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('admin:login.loggingIn')}
                </span>
              ) : (
                t('common:buttons.login')
              )}
            </button>
          </div>
        </Form>
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>
            {t('admin:login.forgotPassword')} 
            <a href="#" className="text-blue-600 hover:text-blue-500 ml-1">
              {t('admin:login.contactAdmin')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}