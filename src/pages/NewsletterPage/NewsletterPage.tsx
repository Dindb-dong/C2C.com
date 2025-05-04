import React, { useState } from 'react';
import './NewsletterPage.css';

const NewsletterPage: React.FC = () => {
  const [currentArticle, setCurrentArticle] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [customTopic, setCustomTopic] = useState('');

  const topics = ['기술', '경제', '과학', '문화', '기타'];
  const recommendedTopics = ['인공지능', '블록체인', '스타트업', '환경'];

  const handleSwipe = (direction: 'left' | 'right') => {
    // TODO: Implement swipe functionality
    if (direction === 'left') {
      setCurrentArticle(prev => prev + 1);
    } else {
      setCurrentArticle(prev => Math.max(0, prev - 1));
    }
  };

  const handleTopicSelect = (topic: string) => {
    if (topic === '기타') {
      setSelectedTopic('custom');
    } else {
      setSelectedTopic(topic);
    }
  };

  return (
    <div className="newsletter-page">
      <div className="topic-filters">
        {topics.map((topic) => (
          <button
            key={topic}
            className={`topic-button ${selectedTopic === topic ? 'active' : ''}`}
            onClick={() => handleTopicSelect(topic)}
          >
            {topic}
          </button>
        ))}
        {selectedTopic === 'custom' && (
          <input
            type="text"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder="주제를 입력하세요"
            className="custom-topic-input"
          />
        )}
      </div>

      <div className="article-container">
        <div className="article" onTouchStart={(e) => {
          const touch = e.touches[0];
          const startX = touch.clientX;

          const handleTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0];
            const diff = startX - touch.clientX;

            if (Math.abs(diff) > 50) {
              handleSwipe(diff > 0 ? 'left' : 'right');
              document.removeEventListener('touchmove', handleTouchMove);
            }
          };

          document.addEventListener('touchmove', handleTouchMove);
        }}>
          {/* Article content will go here */}
          <h2>기사 제목</h2>
          <p>기사 내용...</p>
        </div>
      </div>

      <div className="recommended-topics">
        <h3>맞춤 Pick 주제</h3>
        <div className="topic-buttons">
          {recommendedTopics.map((topic) => (
            <button
              key={topic}
              className="recommended-topic-button"
              onClick={() => setSelectedTopic(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsletterPage; 