// app/routes/_layout.tsx (New File)
import { Outlet } from 'react-router-dom';
import { useState } from "react";
import { I18nextProvider } from 'react-i18next';
import i18n from '../utils/i18n';

// Assuming these components exist
import Header from "../components/Header";
import Footer from "../components/Footer";
import { LanguageProvider } from '../context/LanguageContext';
import { AuthProvider } from '../context/AuthContext';

// Layout component following React Router v7 best practices
export default function PublicLayout() {
  const [language, setLanguage] = useState('en');

  // Provide language context to children via outlet context
  const outletContext = {
    language,
    setLanguage,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        currentLanguage={language}
        onChangeLanguage={setLanguage}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Outlet renders the specific page component and passes context */}
        <Outlet context={outletContext} />
      </main>
      <Footer />
    </div>
  );
}