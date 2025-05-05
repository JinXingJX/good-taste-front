import { useEffect, useState } from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from 'react-router';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Footer from './components/Footer';
import './utils/i18n';

// Import tailwind styles
import './tailwind.css';

// Get initial language setting
export async function loader({ request }: { request: Request }) {
  // Get language from request
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') || 'zh';
  return ({ lang });
}

// Export metadata config
export const meta = () => {
  return [
    { charset: 'utf-8' },
    { viewport: 'width=device-width,initial-scale=1' },
    { title: '公司官网' },
    { description: '公司官方网站，展示公司信息、产品和服务' }
  ];
};

// Root component
export default function App() {
  const { lang: initialLang } = useLoaderData<{ lang: string }>();
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(initialLang);
  
  // Language change function
  const changeLanguage = (lng: string) => {
    setLanguage(lng);
    i18n.changeLanguage(lng);
    // Update HTML element lang attribute
    document.documentElement.lang = lng;
    // Store in localStorage
    localStorage.setItem('i18nextLng', lng);
  };

  // Set language on initialization
  useEffect(() => {
    const savedLang = localStorage.getItem('i18nextLng') || initialLang;
    if (savedLang) {
      setLanguage(savedLang);
      i18n.changeLanguage(savedLang);
      document.documentElement.lang = savedLang;
    }
  }, [initialLang, i18n]);

  return (
    <html lang={language} className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col min-h-screen bg-gray-50">
        <Header currentLanguage={language} onChangeLanguage={changeLanguage} />
        <main className="flex-grow">
          <Outlet context={{ language }} />
        </main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}