// app/utils/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Define all namespaces used in your application
const namespaces = [
    'common',
    'home',
    'about',
    'resources',
    'culture',
    'products',
    'message',
    'contact',
    'admin' // Add admin namespace
];

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'zh', // Default language
    ns: namespaces,    // List all your namespaces
    defaultNS: 'common', // Default namespace to use
    debug: process.env.NODE_ENV === 'development', // Enable debug logs in dev
    interpolation: {
      escapeValue: false // React already safes from xss
    },
    detection: {
      // Order and from where user language should be detected
      order: ['localStorage', 'navigator', 'htmlTag'],
      // Cache user language detection result in localStorage
      caches: ['localStorage'],
      // Optional: cookie settings if using cookie detection
      // cookieSameSite: 'strict',
      // cookieSecure: process.env.NODE_ENV === 'production',
    },
    backend: {
      // Path where resources get loaded from
      // Make sure JSON files exist at public/locales/en/common.json, public/locales/zh/common.json, etc.
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    // React specific options
    react: {
        useSuspense: true // Use Suspense for loading translations
    }
  });

export default i18n;