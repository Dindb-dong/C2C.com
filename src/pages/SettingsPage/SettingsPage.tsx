import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../contexts/LanguageContext';
import './SettingsPage.css';

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1 className="settings-title">{t('settings.title', '환경설정')}</h1>

        <div className="settings-section">
          <h2 className="settings-section-title">{t('settings.language', '언어 설정')}</h2>
          <div className="language-selector">
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
              <button
                key={code}
                className={`language-button ${currentLanguage === code ? 'selected' : ''}`}
                onClick={() => changeLanguage(code as keyof typeof SUPPORTED_LANGUAGES)}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 