// app/routes/_layout.tsx (New File)
import { Outlet } from 'react-router-dom';
import { useContext } from "react";
import Header from "~/components/Header"; // Assuming Header is in components
import Footer from "~/components/Footer"; // Assuming Footer is in components
import LanguageContext from "~/context/LanguageContext";
import { I18nextProvider } from 'react-i18next';
import i18n from '~/utils/i18n';
import { LanguageProvider } from '~/context/LanguageContext';
import { AuthProvider } from '~/context/AuthContext';

// This wraps all routes with necessary providers
export default function PublicLayout() {
  const { language, setLanguage } = useContext(LanguageContext);

  return (
    <I18nextProvider i18n={i18n} defaultNS={'common'}>
      <LanguageProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header
              currentLanguage={language}
              onChangeLanguage={setLanguage}
            />
            <main className="flex-grow container mx-auto px-4 py-8">
              {/* Outlet renders the specific page component (index, about, etc.) */}
              <Outlet />
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </I18nextProvider>
  );
}