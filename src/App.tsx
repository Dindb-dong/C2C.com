import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Navigation from './components/Navigation/Navigation';
import HamburgerMenu from './components/HamburgerMenu/HamburgerMenu';
import MainPage from './pages/MainPage/MainPage';
import NewsletterPage from './pages/NewsletterPage/NewsletterPage';
import ProblemBankPage from './pages/ProblemBankPage/ProblemBankPage';
import MentoringPage from './pages/MentoringPage/MentoringPage';
import BoardPage from './pages/BoardPage/BoardPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <HamburgerMenu />
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/newsletter" element={<NewsletterPage />} />
            <Route path="/problem-bank" element={<ProblemBankPage />} />
            <Route path="/mentoring" element={<MentoringPage />} />
            <Route path="/board/:boardId" element={<BoardPage />} />
            <Route path="/board/:boardId/:postId" element={<BoardPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
