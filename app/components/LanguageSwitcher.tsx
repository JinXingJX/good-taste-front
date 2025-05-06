import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
  currentLanguage: string;
  onChangeLanguage: (lang: string) => void;
}

export default function LanguageSwitcher({ currentLanguage, onChangeLanguage }: LanguageSwitcherProps) {
  const { t } = useTranslation();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: '中文' },
  ];

  return (
    <div className="relative inline-block text-left">
      <select
        value={currentLanguage}
        onChange={(e) => onChangeLanguage(e.target.value)}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        aria-label={t('common:language.switcher')}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
} 