import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// 配置i18next
i18n
  .use(Backend) // 按需加载翻译文件
  .use(LanguageDetector) // 自动检测用户语言偏好
  .use(initReactI18next)
  .init({
    fallbackLng: 'zh',
    ns: ['common', 'home', 'about', 'products', 'contact', 'admin'],
    defaultNS: 'common',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    }
  });

export default i18n;