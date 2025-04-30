import { useState, useEffect } from 'react';
import { json, useLoaderData, useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import RichTextEditor from '../../../components/admin/RichTextEditor';

// 服务器端数据加载
export async function loader({ params }) {
  const { key } = params;
  
  try {
    // 在实际应用中，这里会调用 API 获取数据
    // 由于这是示例代码，我们返回模拟数据
    const pageData = {
      id: 1,
      page_key: key,
      title_zh: key === 'home' ? '首页' : 
                key === 'about' ? '关于我们' : 
                key === 'resources' ? '原料资源' : 
                key === 'culture' ? '文化与我们' : '联系我们',
      title_en: key === 'home' ? 'Home' : 
                key === 'about' ? 'About Us' : 
                key === 'resources' ? 'Resources' : 
                key === 'culture' ? 'Culture & Us' : 'Contact Us',
      content_zh: '<p>这是中文内容示例，实际内容会从数据库加载。</p>',
      content_en: '<p>This is a sample content in English, actual content would be loaded from the database.</p>',
      seo_keywords: 'keywords, sample',
      seo_desc: 'Sample meta description',
      updated_at: new Date().toISOString()
    };
    
    return json({ page: pageData });
  } catch (error) {
    console.error(`Error loading page ${key}:`, error);
    return json({ page: null });
  }
}

export default function PageEditor() {
  const { page } = useLoaderData();
  const { key } = useParams();
  const { t } = useTranslation(['admin', 'common']);
  const navigate = useNavigate();
  
  const [currentLanguage, setCurrentLanguage] = useState('zh');
  const [contentZh, setContentZh] = useState(page?.content_zh || '');
  const [contentEn, setContentEn] = useState(page?.content_en || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title_zh: page?.title_zh || '',
      title_en: page?.title_en || '',
      seo_keywords: page?.seo_keywords || '',
      seo_desc: page?.seo_desc || ''
    }
  });
  
  // 设置表单默认值
  useEffect(() => {
    if (page) {
      setValue('title_zh', page.title_zh);
      setValue('title_en', page.title_en);
      setValue('seo_keywords', page.seo_keywords);
      setValue('seo_desc', page.seo_desc);
      setContentZh(page.content_zh);
      setContentEn(page.content_en);
    }
  }, [page, setValue]);
  
  // 表单提交处理
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setSaveStatus(null);
      
      // 合并表单数据和富文本内容
      const formData = {
        ...data,
        content_zh: contentZh,
        content_en: contentEn
      };
      
      // 在实际应用中，这里会调用 API 保存数据
      console.log('Saving page:', formData);
      
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveStatus({ success: true, message: t('admin:pages.saveSuccess') });
      // 保存成功后，可以跳转或者留在当前页面
    } catch (error) {
      console.error('Error saving page:', error);
      setSaveStatus({ 
        success: false, 
        message: error.response?.data?.error || t('admin:pages.saveError') 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 语言切换处理
  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang);
  };
  
  // 页面不存在
  if (!page) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {t('admin:pages.pageNotFound')}
        </h2>
        <p className="text-gray-600 mb-6">
          {t('admin:pages.pageNotFoundDesc')}
        </p>
        <button
          onClick={() => navigate('/admin/pages')}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {t('admin:pages.backToPages')}
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {t('admin:pages.editing')}: {currentLanguage === 'zh' ? page.title_zh : page.title_en}
        </h1>
        
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">{t('admin:pages.language')}:</span>
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              type="button"
              onClick={() => handleLanguageChange('zh')}
              className={`px-4 py-2 ${
                currentLanguage === 'zh'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('common:language.chinese')}
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('en')}
              className={`px-4 py-2 ${
                currentLanguage === 'en'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('common:language.english')}
            </button>
          </div>
        </div>
      </div>
      
      {saveStatus && (
        <div
          className={`mb-6 p-4 rounded-md ${
            saveStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {saveStatus.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">
              {t('admin:pages.basicInfo')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {t('admin:pages.titleZh')}
                </label>
                <input
                  type="text"
                  {...register('title_zh', { required: true })}
                  className={`w-full border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.title_zh ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title_zh && (
                  <p className="mt-1 text-red-500 text-sm">
                    {t('common:forms.required')}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {t('admin:pages.titleEn')}
                </label>
                <input
                  type="text"
                  {...register('title_en', { required: true })}
                  className={`w-full border rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.title_en ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title_en && (
                  <p className="mt-1 text-red-500 text-sm">
                    {t('common:forms.required')}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">
              {t('admin:pages.content')}
            </h2>
            
            {currentLanguage === 'zh' ? (
              <RichTextEditor
                value={contentZh}
                onChange={setContentZh}
                placeholder={t('admin:pages.contentPlaceholder')}
              />
            ) : (
              <RichTextEditor
                value={contentEn}
                onChange={setContentEn}
                placeholder={t('admin:pages.contentPlaceholder')}
              />
            )}
          </div>
          
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t('admin:pages.seo')}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {t('admin:pages.keywords')}
                </label>
                <input
                  type="text"
                  {...register('seo_keywords')}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('admin:pages.keywordsPlaceholder')}
                />
                <p className="mt-1 text-gray-500 text-sm">
                  {t('admin:pages.keywordsHelp')}
                </p>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {t('admin:pages.description')}
                </label>
                <textarea
                  {...register('seo_desc')}
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('admin:pages.descriptionPlaceholder')}
                ></textarea>
                <p className="mt-1 text-gray-500 text-sm">
                  {t('admin:pages.descriptionHelp')}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/pages')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t('common:buttons.cancel')}
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('admin:pages.saving')}
              </span>
            ) : (
              t('common:buttons.save')
            )}
          </button>
        </div>
      </form>
    </div>
  );
}