import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../contexts/LanguageContext';
import './LanguageSelectModal.css';

interface LanguageSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageSelectModal: React.FC<LanguageSelectModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();

  const handleLanguageSelect = (lang: keyof typeof SUPPORTED_LANGUAGES) => {
    changeLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="language-modal-overlay">
      <div className="language-modal">
        <h2>{t('settings.language')}</h2>
        <div className="language-options">
          {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
            <button
              key={code}
              className={`language-option ${currentLanguage === code ? 'selected' : ''}`}
              onClick={() => handleLanguageSelect(code as keyof typeof SUPPORTED_LANGUAGES)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectModal; 