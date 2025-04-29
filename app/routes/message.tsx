import { useState } from 'react';
import { json, useActionData, useOutletContext } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { submitMessage } from '../utils/api';

// 处理表单提交
export async function action({ request }) {
  const formData = await request.formData();
  const messageData = Object.fromEntries(formData);
  
  try {
    await submitMessage(messageData);
    return json({ success: true });
  } catch (error) {
    console.error('Error submitting message:', error);
    return json({ 
      success: false, 
      error: error.response?.data?.error || 'Failed to submit message' 
    });
  }
}

export default function Message() {
  const actionData = useActionData();
  const { language } = useOutletContext();
  const { t } = useTranslation(['common']);
  const [submitted, setSubmitted] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm();
  
  // 处理表单提交结果
  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    try {
      // 表单将由 Remix 的 action 函数处理
      setSubmitted(true);
      // 重置表单
      reset();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };
  
  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            {t('navigation.message')}
          </h1>
          
          {submitted && actionData?.success ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-8 rounded-lg text-center mb-8">
              <svg 
                className="w-12 h-12 text-green-500 mx-auto mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <h3 className="text-xl font-semibold mb-2">
                {t('forms.messageSent')}
              </h3>
              <p className="mb-4">
                {t('forms.thankYou')}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                {t('forms.sendAnother')}
              </button>
            </div>
          ) : (
            <form 
              onSubmit={handleSubmit(onSubmit)} 
              className="bg-white shadow-sm rounded-lg p-8"
            >
              {actionData?.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                  {actionData.error}
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label 
                    htmlFor="name" 
                    className="block text-gray-700 font-medium mb-2"
                  >
                    {t('forms.name')} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name', { required: true })}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-red-500 text-sm">
                      {t('forms.required')}
                    </p>
                  )}
                </div>
                
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-gray-700 font-medium mb-2"
                  >
                    {t('forms.email')} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email', { 
                      required: true,
                      pattern: /^\S+@\S+\.\S+$/
                    })}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && errors.email.type === 'required' && (
                    <p className="mt-1 text-red-500 text-sm">
                      {t('forms.required')}
                    </p>
                  )}
                  {errors.email && errors.email.type === 'pattern' && (
                    <p className="mt-1 text-red-500 text-sm">
                      {t('forms.invalidEmail')}
                    </p>
                  )}
                </div>
                
                <div>
                  <label 
                    htmlFor="phone" 
                    className="block text-gray-700 font-medium mb-2"
                  >
                    {t('forms.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="company" 
                    className="block text-gray-700 font-medium mb-2"
                  >
                    {t('forms.company')}
                  </label>
                  <input
                    type="text"
                    id="company"
                    {...register('company')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label 
                  htmlFor="content" 
                  className="block text-gray-700 font-medium mb-2"
                >
                  {t('forms.message')} *
                </label>
                <textarea
                  id="content"
                  rows="6"
                  {...register('content', { required: true })}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.content ? 'border-red-500' : 'border-gray-300'
                  }`}
                ></textarea>
                {errors.content && (
                  <p className="mt-1 text-red-500 text-sm">
                    {t('forms.required')}
                  </p>
                )}
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  {t('buttons.send')}
                </button>
              </div>
            </form>
          )}
          
          <div className="mt-12 bg-white shadow-sm rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">
              {t('message:faq.title')}
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {t('message:faq.q1')}
                </h3>
                <p className="text-gray-600">
                  {t('message:faq.a1')}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {t('message:faq.q2')}
                </h3>
                <p className="text-gray-600">
                  {t('message:faq.a2')}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {t('message:faq.q3')}
                </h3>
                <p className="text-gray-600">
                  {t('message:faq.a3')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}