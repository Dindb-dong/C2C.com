import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BoardProvider } from './contexts/BoardContext';
import { PostProvider } from './contexts/PostContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import LanguageSelectModal from './components/LanguageSelectModal/LanguageSelectModal';
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
import MentorRegistrationPage from './pages/MentorRegistrationPage/MentorRegistrationPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import './App.css';

const AppContent: React.FC = () => {
  const { hasSelectedLanguage, setHasSelectedLanguage } = useLanguage();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 언어 선택 여부 확인
    const hasSelected = localStorage.getItem('hasSelectedLanguage') === 'true';
    if (!hasSelected) {
      setShowLanguageModal(true);
    }
  }, []);

  const handleCloseLanguageModal = () => {
    setShowLanguageModal(false);
    setHasSelectedLanguage(true);
  };

  return (
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
          <Route path="/mentor-registration" element={<MentorRegistrationPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
      <LanguageSelectModal
        isOpen={showLanguageModal}
        onClose={handleCloseLanguageModal}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <BoardProvider>
            <PostProvider>
              <AppContent />
            </PostProvider>
          </BoardProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
};

export default App;
