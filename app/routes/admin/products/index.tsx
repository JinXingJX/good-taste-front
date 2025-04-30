import { useState, useEffect } from 'react';
import { json, useLoaderData } from 'react-router';
import { useTranslation } from 'react-i18next';

// 服务器端数据加载
export async function loader() {
  try {
    // 在实际应用中，这里会调用 API 获取数据
    // 由于这是示例代码，我们返回模拟数据
    return json({
      products: [
        {
          id: 1,
          name_zh: '产品一',
          name_en: 'Product One',
          category_id: 1,
          category_name_zh: '分类一',
          category_name_en: 'Category One',
          featured: true,
          image_url: '/images/product1.jpg',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          name_zh: '产品二',
          name_en: 'Product Two',
          category_id: 1,
          category_name_zh: '分类一',
          category_name_en: 'Category One',
          featured: false,
          image_url: '/images/product2.jpg',
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          name_zh: '产品三',
          name_en: 'Product Three',
          category_id: 2,
          category_name_zh: '分类二',
          category_name_en: 'Category Two',
          featured: true,
          image_url: '/images/product3.jpg',
          created_at: new Date().toISOString()
        }
      ],
      categories: [
        { id: 1, name_zh: '分类一', name_en: 'Category One' },
        { id: 2, name_zh: '分类二', name_en: 'Category Two' }
      ]
    });
  } catch (error) {
    console.error('Error loading products:', error);
    return json({ products: [], categories: [] });
  }
}

export default function AdminProducts() {
  const { products, categories } = useLoaderData();
  const { t } = useTranslation(['admin', 'common']);
  const [currentLanguage, setCurrentLanguage] = useState('zh');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  // 筛选产品
  useEffect(() => {
    let result = [...products];
    
    // 按分类筛选
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category_id.toString() === selectedCategory);
    }
    
    // 按搜索词筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => {
        return (
          product.name_zh.toLowerCase().includes(query) ||
          product.name_en.toLowerCase().includes(query)
        );
      });
    }
    
    setFilteredProducts(result);
  }, [products, selectedCategory, searchQuery]);
  
  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };
  
  // 删除产品
  const handleDelete = async (id) => {
    if (confirmDelete !== id) {
      // 第一次点击，显示确认
      setConfirmDelete(id);
      return;
    }
    
    try {
      // 在实际应用中，这里会调用 API 删除产品
      console.log('Deleting product:', id);
      
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 更新状态（实际应用中应该重新获取数据）
      const updatedProducts = products.filter(product => product.id !== id);
      setFilteredProducts(updatedProducts);
      
      // 重置确认状态
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(t('admin:products.deleteError'));
    }
  };
  
  // 取消删除确认
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('admin:products.title')}</h1>
        
        <div className="flex items-center space-x-2">
          <a
            href="/admin/products/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            {t('admin:products.addNew')}
          </a>
          
          <a
            href="/admin/product-categories"
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            {t('admin:products.manageCategories')}
          </a>
          
          <select 
            value={currentLanguage}
            onChange={(e) => setCurrentLanguage(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="zh">{t('common:language.chinese')}</option>
            <option value="en">{t('common:language.english')}</option>
          </select>
        </div>
      </div>
      
      {/* 筛选工具栏 */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            {t('admin:products.search')}
          </label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('admin:products.searchPlaceholder')}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="w-48">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            {t('admin:products.category')}
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">{t('admin:products.allCategories')}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id.toString()}>
                {currentLanguage === 'zh' ? category.name_zh : category.name_en}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* 产品列表 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin:products.image')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin:products.name')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin:products.category')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin:products.featured')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin:products.created')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin:products.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-12 w-12 bg-gray-100 rounded-md overflow-hidden">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={currentLanguage === 'zh' ? product.name_zh : product.name_en}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {currentLanguage === 'zh' ? product.name_zh : product.name_en}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {currentLanguage === 'zh' ? product.category_name_zh : product.category_name_en}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.featured ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {t('admin:products.yes')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {t('admin:products.no')}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(product.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <a
                          href={`/admin/products/${product.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {t('admin:products.edit')}
                        </a>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className={confirmDelete === product.id ? "text-red-600 font-bold" : "text-red-600 hover:text-red-900"}
                        >
                          {confirmDelete === product.id ? t('admin:products.confirmDelete') : t('admin:products.delete')}
                        </button>
                        {confirmDelete === product.id && (
                          <>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={handleCancelDelete}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              {t('admin:products.cancel')}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">{t('admin:products.noProducts')}</h3>
            <p className="mt-1 text-sm text-gray-500">{t('admin:products.noProductsDesc')}</p>
            <div className="mt-6">
              <a
                href="/admin/products/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                {t('admin:products.addNew')}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}