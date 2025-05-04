import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HamburgerMenu.css';

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
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
                  <Link to="/newsletter" className="modal-nav-link" onClick={closeMenu}>뉴스레터</Link>
                </li>
                <li className="modal-nav-item">
                  <Link to="/problem-bank" className="modal-nav-link" onClick={closeMenu}>문제은행</Link>
                </li>
                <li className="modal-nav-item">
                  <Link to="/mentoring" className="modal-nav-link" onClick={closeMenu}>멘토링</Link>
                </li>
                <li className="modal-nav-item">
                  <Link to="/board" className="modal-nav-link" onClick={closeMenu}>게시판</Link>
                </li>
                <li className="modal-nav-item">
                  <Link to="/settings" className="modal-nav-link" onClick={closeMenu}>환경설정</Link>
                </li>
                <li className="modal-nav-item">
                  <Link to="/my-page" className="modal-nav-link" onClick={closeMenu}>마이페이지</Link>
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