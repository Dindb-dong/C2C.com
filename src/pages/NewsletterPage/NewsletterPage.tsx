import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NewsletterPage.css';
import { request } from '../../utils/request';
interface TopicSummary {
  title: string;
  content: string;
}
interface NewsResponse {
  articles: NewsArticle[];
  topicSummary: TopicSummary[];
}

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  categoryCode: string;
  createdAt: string;
  updatedAt: string;
  topic: string;
}

interface Category {
  name: string;
  code: string;
}

const NewsletterPage: React.FC = () => {
  const categories: Category[] = [
    { name: '정치', code: '001000000' },
    { name: '경제', code: '002000000' },
    { name: '사회', code: '003000000' },
    { name: '문화', code: '004000000' },
    { name: '국제', code: '005000000' },
    { name: '지역', code: '006000000' },
    { name: '스포츠', code: '007000000' },
    { name: 'IT과학', code: '008000000' }
  ];

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [topicSummary, setTopicSummary] = useState<TopicSummary[]>([]);
  const [currentArticle, setCurrentArticle] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('002000000');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles(selectedCategory);
  }, [selectedCategory]);

  const fetchArticles = async (categoryCode: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await request.get<NewsResponse>(`/news/topics/${categoryCode}?noSearch=true`);
      console.log(response.data);
      setArticles(response.data.articles);
      setTopicSummary(response.data.topicSummary);
      setCurrentArticle(0);
    } catch (err) {
      setError('뉴스를 불러오는데 실패했습니다.');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentArticle(prev => Math.min(articles.length - 1, prev + 1));
    } else {
      setCurrentArticle(prev => Math.max(0, prev - 1));
    }
  };

  const handleCategorySelect = (categoryCode: string) => {
    setSelectedCategory(categoryCode);
  };

  return (
    <div className="newsletter-page">
      <div className="category-filters">
        {categories.map((category) => (
          <button
            key={category.code}
            className={`category-button ${selectedCategory === category.code ? 'active' : ''}`}
            onClick={() => handleCategorySelect(category.code)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="article-container">
        {loading ? (
          <div className="loading">로딩 중...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : topicSummary.length > 0 ? (
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
            <div className="topic-header">
              <h2>{topicSummary[currentArticle].title}</h2>
              <div className="article-summary">
                {topicSummary[currentArticle].content}
              </div>
            </div>
            <div className="related-articles">
              <h3>관련 기사</h3>
              {articles.map((article) => (
                article.topic === topicSummary[currentArticle].title ? (
                  <div key={article.id} className="related-article">
                    <h4>{article.title}</h4>
                    <div
                      className="article-content"
                      dangerouslySetInnerHTML={{ __html: article.content || '' }}
                    />
                    <div className="article-meta">
                      <a className="url" href={article.url} target="_blank" rel="noopener noreferrer">출처: {article.source}</a>
                      <span className="date">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ) : null
              ))}
            </div>
            <div className="article-index">
              {currentArticle + 1} / {topicSummary.length}
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
                disabled={currentArticle === topicSummary.length - 1}
                aria-label="다음 기사"
              >
                ➡️
              </button>
            </div>
          </div>
        ) : (
          <div className="article no-article">해당 카테고리의 뉴스가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default NewsletterPage; 