import { createContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Create language context
const LanguageContext = createContext({
  language: 'zh',
  setLanguage: () => {},
});

// Language provider component
export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState('zh');

  // Handle language change
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    // Update HTML element lang attribute
    document.documentElement.lang = lang;
    // Store in localStorage
    localStorage.setItem('i18nextLng', lang);
  };

  // Initialize language on component mount
  useEffect(() => {
    const savedLang = localStorage.getItem('i18nextLng') || 'zh';
    setLanguage(savedLang);
    i18n.changeLanguage(savedLang);
    document.documentElement.lang = savedLang;
  }, [i18n]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleLanguageChange,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export default LanguageContext;