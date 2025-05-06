// app/root.tsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  MetaFunction,
  LinksFunction,
} from "react-router";

import { Suspense, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './utils/i18n'; // Your i18n configuration
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';

import styles from "./tailwind.css?url"; // Import Tailwind CSS

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Good Taste International" }, // Default Title
    { name: "description", content: "Welcome!" },
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
};

// Function to get the initial language
// Needs to run safely on both server and client
const getInitialLanguage = (): string => {
  if (typeof document !== 'undefined') {
    // Client-side: Check localStorage first, then navigator
    return localStorage.getItem('i18nextLng') || navigator.language.split('-')[0] || 'zh';
  }
  // Server-side: Default to 'zh' or try to detect from headers if needed (more complex)
  return 'zh';
};


export default function Root() {
  const initialLang = getInitialLanguage(); // Get initial lang safely

  useEffect(() => {
    // Ensure HTML lang attribute is set on client-side mount/update
    if (typeof document !== 'undefined') {
       document.documentElement.lang = i18n.language || initialLang;
    }
  }, []); // Runs once on mount

  // Update lang attribute whenever i18n language changes
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
       if (typeof document !== 'undefined') {
          document.documentElement.lang = lng;
       }
    };
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);


  return (
    // No need for <html>, <head>, <body> here, React Router handles it.
    // Wrap with Providers
    <I18nextProvider i18n={i18n} defaultNS={'common'}>
      <LanguageProvider> {/* Provides language state */}
        <AuthProvider>   {/* Provides auth state */}
           {/* Suspense for lazy loading translations or components */}
           <Suspense fallback={<div>Loading...</div>}>
             <Meta />
             <Links />
             <Outlet /> {/* Renders the matched route component */}
             <ScrollRestoration /> {/* Handles scroll position */}
             <Scripts /> {/* Includes necessary scripts */}
           </Suspense>
        </AuthProvider>
      </LanguageProvider>
    </I18nextProvider>
  );
}