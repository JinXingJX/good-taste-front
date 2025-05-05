import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files directly to ensure they're bundled
import enCommon from '../locales/en/common.json';
import enHome from '../locales/en/home.json';
import zhCommon from '../locales/zh/common.json';
import zhHome from '../locales/zh/home.json';

// Configure i18next
i18n
  .use(Backend) // Load translations on-demand
  .use(LanguageDetector) // Auto-detect user language preferences
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
    resources: {
      en: {
        common: enCommon,
        home: enHome
      },
      zh: {
        common: zhCommon,
        home: zhHome
      }
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    }
  });

export default i18n;