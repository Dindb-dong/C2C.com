import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import HamburgerMenu from '../HamburgerMenu/HamburgerMenu';
import './Header.css';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNoResults, setShowNoResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      setShowNoResults(true);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <HamburgerMenu />
          <Link to="/main" className="site-title">C2C.com</Link>
        </div>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            검색
          </button>
        </form>
        {showNoResults && (
          <div className="no-results">
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 