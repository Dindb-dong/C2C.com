import React, { useState } from 'react';
import './NewsletterPage.css';

interface Article {
  id: number;
  title: string;
  content: string;
  topic: string;
}

const NewsletterPage: React.FC = () => {
  const articles: Article[] = [
    {
      id: 1,
      title: 'AI가 바꿀 미래 산업',
      content: 'AI 기술이 다양한 산업에 혁신을 가져오고 있습니다. 앞으로의 변화에 주목하세요.',
      topic: '기술',
    },
    {
      id: 2,
      title: '금리 인상, 경제에 미치는 영향',
      content: '최근 금리 인상이 경제 전반에 어떤 영향을 미치는지 분석합니다.',
      topic: '경제',
    },
    {
      id: 3,
      title: '우주 탐사의 새로운 시대',
      content: '민간 기업의 우주 진출이 활발해지며 우주 탐사의 패러다임이 바뀌고 있습니다.',
      topic: '과학',
    },
    {
      id: 4,
      title: 'MZ세대의 문화 트렌드',
      content: 'MZ세대가 주도하는 새로운 문화 트렌드와 그 영향력을 살펴봅니다.',
      topic: '문화',
    },
  ];

  const [currentArticle, setCurrentArticle] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [customTopic, setCustomTopic] = useState('');

  const topics = ['기술', '경제', '과학', '문화', '기타'];
  const recommendedTopics = ['인공지능', '블록체인', '스타트업', '환경'];

  const filteredArticles = selectedTopic === 'all'
    ? articles
    : selectedTopic === 'custom' && customTopic
      ? articles.filter(a => a.topic.includes(customTopic))
      : articles.filter(a => a.topic === selectedTopic);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentArticle(prev => Math.min(filteredArticles.length - 1, prev + 1));
    } else {
      setCurrentArticle(prev => Math.max(0, prev - 1));
    }
  };

  const handleTopicSelect = (topic: string) => {
    setCurrentArticle(0);
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
        {filteredArticles.length > 0 ? (
          <div
            className="article"
            onTouchStart={(e) => {
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
            }}
          >
            <h2>{filteredArticles[currentArticle]?.title}</h2>
            <p>{filteredArticles[currentArticle]?.content}</p>
            <div className="article-topic">주제: {filteredArticles[currentArticle]?.topic}</div>
            <div className="article-index">
              {currentArticle + 1} / {filteredArticles.length}
            </div>
            <div className="article-nav-buttons">
              <button
                className="article-nav-btn"
                onClick={() => handleSwipe('right')}
                disabled={currentArticle === 0}
                aria-label="이전 기사"
              >
                ⬅️
              </button>
              <button
                className="article-nav-btn"
                onClick={() => handleSwipe('left')}
                disabled={currentArticle === filteredArticles.length - 1}
                aria-label="다음 기사"
              >
                ➡️
              </button>
            </div>
          </div>
        ) : (
          <div className="article no-article">해당 주제의 뉴스가 없습니다.</div>
        )}
      </div>

      <div className="recommended-topics">
        <h3>맞춤 Pick 주제</h3>
        <div className="topic-buttons">
          {recommendedTopics.map((topic) => (
            <button
              key={topic}
              className="recommended-topic-button"
              onClick={() => handleTopicSelect(topic)}
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