import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-white shadow mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-center text-gray-500">
          © {new Date().getFullYear()} {t('app.title')}
        </p>
      </div>
    </footer>
  );
} 