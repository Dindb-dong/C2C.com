import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  return (
    <nav className="navigation">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/newsletter" className="nav-link">뉴스레터</Link>
        </li>
        <li className="nav-item">
          <Link to="/problem-bank" className="nav-link">문제은행</Link>
        </li>
        <li className="nav-item">
          <Link to="/mentoring" className="nav-link">멘토링</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation; 