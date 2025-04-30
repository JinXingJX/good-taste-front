import { useTranslation } from 'react-i18next';

interface HeaderProps {
  currentLanguage: string;
  onChangeLanguage: (lang: string) => void;
}

export default function Header({ currentLanguage, onChangeLanguage }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">{t('app.title')}</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => onChangeLanguage('zh')}
              className={`px-3 py-1 rounded ${currentLanguage === 'zh' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              中文
            </button>
            <button
              onClick={() => onChangeLanguage('en')}
              className={`px-3 py-1 rounded ${currentLanguage === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              English
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 