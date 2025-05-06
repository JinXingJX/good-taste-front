// app/routes/_layout.tsx (New File)
import { Outlet } from "react-router";
import { useContext } from "react";
import Header from "~/components/Header"; // Assuming Header is in components
import Footer from "~/components/Footer"; // Assuming Footer is in components
import LanguageContext from "~/context/LanguageContext";

export default function PublicLayout() {
  const { language, setLanguage } = useContext(LanguageContext);

  return (
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
  );
}