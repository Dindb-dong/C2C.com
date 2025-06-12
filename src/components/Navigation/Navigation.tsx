import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Navigation.css';

const Navigation: React.FC = () => {
  const { t } = useTranslation();

  return (
    <nav className="navigation">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/newsletter" className="nav-link">{t('navigation.newsletter')}</Link>
        </li>
        <li className="nav-item">
          <Link to="/problem-bank" className="nav-link">{t('navigation.problemBank')}</Link>
        </li>
        <li className="nav-item">
          <Link to="/mentoring" className="nav-link">{t('navigation.mentoring')}</Link>
        </li>
        <li className="nav-item">
          <Link to="/board" className="nav-link">{t('navigation.board')}</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation; 