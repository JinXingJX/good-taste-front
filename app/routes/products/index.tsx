import { useEffect, useState } from 'react';
import { json, useLoaderData, useOutletContext } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { getProducts, getProductCategories } from '../../utils/api';

// 服务器端数据加载
export async function loader({ request }) {
  const url = new URL(request.url);
  const categoryId = url.searchParams.get('category') || 'all';
  const lang = url.searchParams.get('lang') || 'zh';
  
  try {
    // 并行加载产品和分类数据
    const [products, categories] = await Promise.all([
      getProducts(categoryId !== 'all' ? categoryId : null, lang),
      getProductCategories(lang)
    ]);
    
    return json({
      products,
      categories,
      selectedCategoryId: categoryId,
      lang
    });
  } catch (error) {
    console.error('Error loading products:', error);
    return json({
      products: [],
      categories: [],
      selectedCategoryId: 'all',
      lang
    });
  }
}

export default function ProductsIndex() {
  const { products, categories, selectedCategoryId, lang } = useLoaderData();
  const { language } = useOutletContext();
  const { t, i18n } = useTranslation(['products', 'common']);
  const [filteredProducts, setFilteredProducts] = useState(products);
  
  // 处理分类切换
  const handleCategoryChange = (categoryId) => {
    window.location.href = categoryId === 'all' 
      ? '/products' 
      : `/products?category=${categoryId}`;
  };
  
  // 语言变化时更新内容
  useEffect(() => {
    if (lang !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, lang, i18n]);
  
  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {t('products:title')}
        </h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* 分类侧边栏 */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
                {t('products:categories')}
              </h2>
              
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`w-full text-left px-3 py-2 rounded-md ${
                      selectedCategoryId === 'all'
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {t('products:allProducts')}
                  </button>
                </li>
                
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => handleCategoryChange(category.id.toString())}
                      className={`w-full text-left px-3 py-2 rounded-md ${
                        selectedCategoryId === category.id.toString()
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* 产品列表 */}
          <div className="w-full md:w-3/4">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <a
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 flex items-center justify-center text-gray-400">
                          {t('products:noImage')}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 line-clamp-3">
                        {product.desc}
                      </p>
                      <div className="mt-4 text-blue-600 font-medium">
                        {t('common:buttons.readMore')} →
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 text-center">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <h3 className="text-xl font-semibold mb-2">
                  {t('products:noProducts')}
                </h3>
                <p className="text-gray-600">
                  {t('products:tryAnotherCategory')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}