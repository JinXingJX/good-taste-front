import { useEffect, useState } from 'react';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { redirect } from "react-router";
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Footer from './components/Footer';
import './utils/i18n';

// Import tailwind styles - if you're using a different location, adjust this import
// The exact path will depend on your project setup
import './tailwind.css';

// 获取初始语言设置
export async function loader({ request }) {
  // 从请求中获取语言设置
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') || 'zh';
  
  return json({ lang });
}

// 导出元数据配置
export const meta = () => {
  return [
    { charset: 'utf-8' },
    { viewport: 'width=device-width,initial-scale=1' },
    { title: '公司官网' },
    { description: '公司官方网站，展示公司信息、产品和服务' }
  ];
};

// 根组件
export default function App() {
  const { lang: initialLang } = useLoaderData();
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(initialLang);
  
  // 语言切换函数
  const changeLanguage = (lng) => {
    setLanguage(lng);
    i18n.changeLanguage(lng);
    // 更新 HTML 元素的 lang 属性
    document.documentElement.lang = lng;
    // 存储在 localStorage 中
    localStorage.setItem('i18nextLng', lng);
  };

  // 初始化时设置语言
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