import { useState, useEffect } from 'react';
import { json, useLoaderData, useOutletContext } from 'react-router';
import { useTranslation } from 'react-i18next';
import { getProductById, getProducts } from '../../utils/api';

// 服务器端数据加载
export async function loader({ params, request }) {
  const { id } = params;
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') || 'zh';
  
  try {
    // 加载产品详情
    const product = await getProductById(id, lang);
    
    // 加载同类产品（可选）
    let relatedProducts = [];
    if (product.category_id) {
      relatedProducts = await getProducts(product.category_id, lang, 3);
      // 排除当前产品
      relatedProducts = relatedProducts.filter(p => p.id !== product.id);
    }
    
    return json({
      product,
      relatedProducts,
      lang
    });
  } catch (error) {
    console.error(`Error loading product ${id}:`, error);
    return json({
      product: null,
      relatedProducts: [],
      lang
    });
  }
}

export default function ProductDetail() {
  const { product, relatedProducts, lang } = useLoaderData();
  const { language } = useOutletContext();
  const { t, i18n } = useTranslation(['products', 'common']);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // 选择主图
  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      // 查找主图，如果没有则使用第一张
      const mainImage = product.images.find(img => img.is_main) || product.images[0];
      setSelectedImage(mainImage.image_url);
    }
  }, [product]);
  
  // 语言变化时更新内容
  useEffect(() => {
    if (lang !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, lang, i18n]);
  
  // 产品不存在
  if (!product) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">{t('products:productNotFound')}</h1>
          <p className="text-gray-600 mb-6">{t('products:productNotFoundDesc')}</p>
          <a
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            {t('products:backToProducts')}
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* 面包屑导航 */}
        <div className="mb-6 text-sm text-gray-600">
          <a href="/" className="hover:text-blue-600">{t('common:navigation.home')}</a>
          <span className="mx-2">/</span>
          <a href="/products" className="hover:text-blue-600">{t('common:navigation.products')}</a>
          {product.category_name && (
            <>
              <span className="mx-2">/</span>
              <a href={`/products?category=${product.category_id}`} className="hover:text-blue-600">
                {product.category_name}
              </a>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-gray-500">{product.name}</span>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* 产品图片 */}
              <div className="w-full md:w-1/2">
                <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={product.name}
                      className="w-full h-auto object-contain max-h-96"
                    />
                  ) : (
                    <div className="w-full h-80 flex items-center justify-center text-gray-400">
                      {t('products:noImage')}
                    </div>
                  )}
                </div>
                
                {/* 缩略图列表 */}
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {product.images.map((image) => (
                      <button
                        key={image.id}
                        onClick={() => setSelectedImage(image.image_url)}
                        className={`p-1 border rounded-md ${
                          selectedImage === image.image_url
                            ? 'border-blue-500'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image.image_url}
                          alt={language === 'zh' ? image.alt_text_zh : image.alt_text_en}
                          className="w-full h-16 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* 产品信息 */}
              <div className="w-full md:w-1/2">
                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                
                {product.category_name && (
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {product.category_name}
                    </span>
                  </div>
                )}
                
                <div className="prose prose-blue max-w-none mb-6">
                  <div dangerouslySetInnerHTML={{ __html: product.desc }} />
                </div>
                
                {product.specs && (
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">{t('products:specifications')}</h2>
                    <div className="prose prose-blue max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: product.specs }} />
                    </div>
                  </div>
                )}
                
                <div className="mt-8 flex space-x-4">
                  <a
                    href="/contact"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
                  >
                    {t('products:contactUs')}
                  </a>
                  
                  <a
                    href="/message"
                    className="inline-block bg-transparent border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
                  >
                    {t('products:inquireNow')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 相关产品 */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">{t('products:relatedProducts')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <a
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.id}`}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    {relatedProduct.image_url ? (
                      <img
                        src={relatedProduct.image_url}
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center text-gray-400">
                        {t('products:noImage')}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-gray-600 line-clamp-2">
                      {relatedProduct.desc}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}