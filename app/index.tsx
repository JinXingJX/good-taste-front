import { useEffect } from 'react';
import { useLoaderData, useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPage, getProducts, type Page, type Product } from '../utils/api';

// Define types for the loader and context
interface LoaderData {
  pageData: Page;
  featuredProducts: Product[];
  lang: string;
}

interface OutletContext {
  language: string;
}

// Server-side data loading using Router v7 loader
export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') || 'zh';
  
  try {
    // Load homepage content and featured products in parallel
    const [pageData, featuredProducts] = await Promise.all([
      getPage('home', lang),
      getProducts()
    ]);
    
    return { pageData, featuredProducts, lang };
  } catch (error) {
    console.error('Error loading home page data:', error);
    return { 
      pageData: { id: '', title: '', content: '', language: lang }, 
      featuredProducts: [],
      lang 
    };
  }
}

export default function Index() {
  const { pageData, featuredProducts, lang } = useLoaderData() as LoaderData;
  const { language } = useOutletContext() as OutletContext;
  const { t, i18n } = useTranslation(['home', 'common']);
  
  // Update content when language changes
  useEffect(() => {
    if (lang !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, lang, i18n]);
  
  return (
    <div className="flex flex-col">
      {/* Banner Carousel */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {pageData.title || t('home:banner.title')}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            {pageData.subtitle || t('home:banner.subtitle')}
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="/about" 
              className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
            >
              {t('common:buttons.readMore')}
            </a>
            <a 
              href="/contact" 
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white hover:text-blue-600 transition-colors"
            >
              {t('home:banner.contactUs')}
            </a>
          </div>
        </div>
      </section>
      
      {/* Company Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('home:overview.title')}</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('home:overview.quality.title')}</h3>
              <p className="text-gray-600">{t('home:overview.quality.description')}</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('home:overview.efficiency.title')}</h3>
              <p className="text-gray-600">{t('home:overview.efficiency.description')}</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('home:overview.service.title')}</h3>
              <p className="text-gray-600">{t('home:overview.service.description')}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t('home:featuredProducts.title')}</h2>
              <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                {t('home:featuredProducts.subtitle')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {featuredProducts.map((product: Product) => (
                <a 
                  key={product.id} 
                  href={`/products/${product.id}`}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        {t('home:featuredProducts.noImage')}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 line-clamp-3">
                      {product.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <a 
                href="/products" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                {t('home:featuredProducts.viewAll')}
              </a>
            </div>
          </div>
        </section>
      )}
      
      {/* About Us Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src="/images/about-preview.jpg" 
                alt={t('home:about.imageAlt')} 
                className="rounded-lg shadow-md w-full"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">{t('home:about.title')}</h2>
              <p className="text-gray-600 mb-6">{t('home:about.description')}</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('home:about.point1')}</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('home:about.point2')}</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('home:about.point3')}</span>
                </li>
              </ul>
              <a 
                href="/about" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                {t('common:buttons.readMore')}
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Us Call-to-Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">{t('home:contact.title')}</h2>
          <p className="text-lg max-w-3xl mx-auto mb-8">
            {t('home:contact.description')}
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="/contact" 
              className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
            >
              {t('home:contact.button')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 