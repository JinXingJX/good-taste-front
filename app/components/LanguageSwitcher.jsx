import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher({ 
  currentLanguage, 
  onChangeLanguage,
  isMobile = false 
}) {
  const { t } = useTranslation();
  
  if (isMobile) {
    return (
      <div className="flex flex-col space-y-2">
        <button
          className={`px-3 py-2 rounded-md text-left ${
            currentLanguage === 'zh' 
              ? 'bg-blue-50 text-blue-600 font-medium' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => onChangeLanguage('zh')}
          aria-label="切换到中文"
        >
          {t('language.chinese')}
        </button>
        <button
          className={`px-3 py-2 rounded-md text-left ${
            currentLanguage === 'en' 
              ? 'bg-blue-50 text-blue-600 font-medium' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => onChangeLanguage('en')}
          aria-label="Switch to English"
        >
          {t('language.english')}
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex items-center space-x-1">
      <button
        className={`px-3 py-1 rounded-md transition-colors ${
          currentLanguage === 'zh' 
            ? 'bg-blue-100 text-blue-800 font-medium' 
            : 'hover:bg-gray-100'
        }`}
        onClick={() => onChangeLanguage('zh')}
        aria-label="切换到中文"
      >
        {t('language.chinese')}
      </button>
      <span className="text-gray-300">|</span>
      <button
        className={`px-3 py-1 rounded-md transition-colors ${
          currentLanguage === 'en' 
            ? 'bg-blue-100 text-blue-800 font-medium' 
            : 'hover:bg-gray-100'
        }`}
        onClick={() => onChangeLanguage('en')}
        aria-label="Switch to English"
      >
        {t('language.english')}
      </button>
    </div>
  );
}