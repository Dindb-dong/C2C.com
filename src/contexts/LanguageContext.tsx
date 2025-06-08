import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import koTranslation from '../locales/ko/translation.json';
import enTranslation from '../locales/en/translation.json';
import jaTranslation from '../locales/ja/translation.json';

// 지원하는 언어 목록
export const SUPPORTED_LANGUAGES = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
} as const;

type Language = keyof typeof SUPPORTED_LANGUAGES;

interface LanguageContextType {
  currentLanguage: Language;
  changeLanguage: (lang: Language) => void;
  hasSelectedLanguage: boolean;
  setHasSelectedLanguage: (value: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// i18n 초기화
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ko: { translation: koTranslation },
      en: { translation: enTranslation },
      ja: { translation: jaTranslation }
    },
    fallbackLng: 'ko',
    interpolation: {
      escapeValue: false
    }
  });

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ko');
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 저장된 언어 설정 불러오기
    const savedLanguage = localStorage.getItem('preferredLanguage') as Language;
    const hasSelected = localStorage.getItem('hasSelectedLanguage') === 'true';

    if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
    setHasSelectedLanguage(hasSelected);
  }, []);

  const changeLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
    localStorage.setItem('hasSelectedLanguage', 'true');
    setHasSelectedLanguage(true);
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      changeLanguage,
      hasSelectedLanguage,
      setHasSelectedLanguage
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 