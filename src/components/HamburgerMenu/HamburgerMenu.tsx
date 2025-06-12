import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../contexts/LanguageContext';
import './HamburgerMenu.css';

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLanguageSelect = (lang: keyof typeof SUPPORTED_LANGUAGES) => {
    changeLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
  };

  return (
    <>
      <button className="hamburger-button" onClick={toggleMenu}>
        <span className="hamburger-icon"></span>
        <span className="hamburger-icon"></span>
        <span className="hamburger-icon"></span>
      </button>

      {isOpen && (
        <>
          <div className="modal-overlay" onClick={toggleMenu}></div>
          <div className="modal-menu">
            <nav className="modal-nav">
              <ul className="modal-nav-list">
                <li className="modal-nav-item">
                  <Link to="/newsletter" className="modal-nav-link" onClick={closeMenu}>{t('navigation.newsletter')}</Link>
                </li>
                <li className="modal-nav-item">
                  <Link to="/problem-bank" className="modal-nav-link" onClick={closeMenu}>{t('navigation.problemBank')}</Link>
                </li>
                <li className="modal-nav-item">
                  <Link to="/mentoring" className="modal-nav-link" onClick={closeMenu}>{t('navigation.mentoring')}</Link>
                </li>
                <li className="modal-nav-item">
                  <Link to="/board" className="modal-nav-link" onClick={closeMenu}>{t('navigation.board')}</Link>
                </li>
                <li className="modal-nav-item">
                  <Link to="/settings" className="modal-nav-link" onClick={closeMenu}>{t('navigation.settings')}</Link>
                </li>
                <li className="modal-nav-item">
                  <Link to="/my-page" className="modal-nav-link" onClick={closeMenu}>{t('navigation.myPage')}</Link>
                </li>
                <li className="modal-nav-item language-selector">
                  <span className="modal-nav-link">{t('navigation.language')}</span>
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
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default HamburgerMenu; 