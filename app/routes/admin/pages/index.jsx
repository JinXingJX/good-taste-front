import { useEffect, useState } from 'react';
import { json, useLoaderData } from 'react-router';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

// 服务器端数据加载
export async function loader() {
  try {
    // 在实际应用中，这里会调用 API 获取数据
    // 由于这是示例代码，我们返回模拟数据
    return json({
      pages: [
        { id: 1, page_key: 'home', title_zh: '首页', title_en: 'Home', updated_at: new Date().toISOString() },
        { id: 2, page_key: 'about', title_zh: '关于我们', title_en: 'About Us', updated_at: new Date().toISOString() },
        { id: 3, page_key: 'resources', title_zh: '原料资源', title_en: 'Resources', updated_at: new Date().toISOString() },
        { id: 4, page_key: 'culture', title_zh: '文化与我们', title_en: 'Culture & Us', updated_at: new Date().toISOString() },
        { id: 5, page_key: 'contact', title_zh: '联系我们', title_en: 'Contact Us', updated_at: new Date().toISOString() }
      ]
    });
  } catch (error) {
    console.error('Error loading pages:', error);
    return json({ pages: [] });
  }
}

export default function AdminPages() {
  const { pages } = useLoaderData();
  const { t } = useTranslation(['admin', 'common']);
  const [currentLanguage, setCurrentLanguage] = useState('zh');
  
  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('admin:pages.title')}</h1>
        
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">{t('admin:pages.language')}:</span>
          <select 
            value={currentLanguage}
            onChange={(e) => setCurrentLanguage(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="zh">{t('common:language.chinese')}</option>
            <option value="en">{t('common:language.english')}</option>
          </select>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <p className="text-gray-600">
            {t('admin:pages.description')}
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin:pages.key')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {currentLanguage === 'zh' ? t('admin:pages.titleZh') : t('admin:pages.titleEn')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin:pages.lastUpdated')}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin:pages.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {page.page_key}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {currentLanguage === 'zh' ? page.title_zh : page.title_en}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(page.updated_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a 
                      href={`/admin/pages/${page.page_key}`} 
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {t('admin:pages.edit')}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{t('admin:pages.tips')}</h2>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md text-blue-700">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">
                {t('admin:pages.tipContent')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}