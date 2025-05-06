declare module './LanguageSwitcher' {
  interface LanguageSwitcherProps {
    currentLanguage: string;
    onChangeLanguage: (lang: string) => void;
    isMobile?: boolean;
  }

  const LanguageSwitcher: React.FC<LanguageSwitcherProps>;
  export default LanguageSwitcher;
} 