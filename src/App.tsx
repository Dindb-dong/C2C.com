import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Navigation from './components/Navigation/Navigation';
import MainPage from './pages/MainPage/MainPage';
import NewsletterPage from './pages/NewsletterPage/NewsletterPage';
import ProblemBankPage from './pages/ProblemBankPage/ProblemBankPage';
import MentoringPage from './pages/MentoringPage/MentoringPage';
import BoardPage from './pages/BoardPage/BoardPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import MyPage from './pages/MyPage/MyPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/newsletter" element={<NewsletterPage />} />
            <Route path="/problem-bank" element={<ProblemBankPage />} />
            <Route path="/mentoring" element={<MentoringPage />} />
            <Route path="/board" element={<BoardPage />} />
            <Route path="/board/:category" element={<BoardPage />} />
            <Route path="/board/:category/:postId" element={<BoardPage />} />
            <Route path="/board/:category/write" element={<BoardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/my-page" element={<MyPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
