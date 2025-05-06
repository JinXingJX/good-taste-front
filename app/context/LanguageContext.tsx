// app/context/LanguageContext.jsx
import { createContext, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

// Create language context
const LanguageContext = createContext({
  language: 'zh', // Default initial value
  setLanguage: (lang: string) => {}, // Placeholder function
});

// Function to get the initial language safely
const getInitialLanguage = (): string => {
  if (typeof document !== 'undefined') { // Check if running in browser
    return localStorage.getItem('i18nextLng') || navigator.language.split('-')[0] || 'zh';
  }
  return 'zh'; // Default for server-side
};


// Language provider component
export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();
  // Initialize state safely for SSR and client hydration
  const [language, setLanguageState] = useState(getInitialLanguage);

  // Handle language change
  const handleLanguageChange = useCallback((lang: string) => {
    if (lang !== language) { // Only update if language actually changes
        setLanguageState(lang);
        i18n.changeLanguage(lang);
        if (typeof document !== 'undefined') { // Check if running in browser
            document.documentElement.lang = lang;
            localStorage.setItem('i18nextLng', lang);
        }
    }
  }, [i18n, language]); // Add dependencies

  // Effect to synchronize i18next language state if it changes externally
  // and set initial language on client
  useEffect(() => {
    const currentI18nLang = i18n.language || getInitialLanguage();
    if (currentI18nLang !== language) {
        setLanguageState(currentI18nLang);
        if (typeof document !== 'undefined') {
            document.documentElement.lang = currentI18nLang;
        }
    }

    const handleExternalChange = (lng: string) => {
      if (lng !== language) {
         setLanguageState(lng);
         if (typeof document !== 'undefined') {
             document.documentElement.lang = lng;
         }
      }
    };

    i18n.on('languageChanged', handleExternalChange);

    // Set initial lang on mount for client
    if (typeof document !== 'undefined') {
       handleLanguageChange(language);
    }

    return () => {
      i18n.off('languageChanged', handleExternalChange);
    };
  }, [i18n, language, handleLanguageChange]); // Add dependencies

  const value = {
    language,
    setLanguage: handleLanguageChange,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export default LanguageContext;