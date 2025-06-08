import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useBoard } from '../../contexts/BoardContext';
import './MainPage.css';

interface HotPost {
  id: string;
  title: string;
  board: string;
  boardId: string;
  author: User;
  date: string;
  likes: number;
}

const MainPage: React.FC = () => {
  const { t } = useTranslation();
  const { fetchBoards, fetchPosts, boards, posts } = useBoard();
  const [hotPosts, setHotPosts] = useState<HotPost[]>([]);

  // 임시 데이터
  const siteStats = {
    totalUsers: 1234,
    totalPosts: 5678,
    activeUsers: 89
  };

  useEffect(() => {
    const loadHotPosts = async () => {
      try {
        // 게시판 목록 불러오기 (데이터 직접 반환)
        const fetchedBoards = await fetchBoards();

        const allPosts: HotPost[] = [];
        for (const board of fetchedBoards || []) {
          // 각 게시판의 게시글 직접 반환
          const boardPosts = await fetchPosts(board.id);
          const mappedPosts = boardPosts?.map(post => ({
            id: post.id,
            title: post.title,
            board: board.name,
            boardId: board.id,
            author: post.author,
            date: new Date(post.createdAt).toLocaleDateString(),
            likes: post.likes || 0
          }));
          allPosts.push(...(mappedPosts || []));
        }

        // 좋아요 순 정렬 및 게시판별 1개씩만
        const sortedPosts = allPosts.sort((a, b) => b.likes - a.likes);
        const selectedPosts: HotPost[] = [];
        const boardIds = new Set();

        for (const post of sortedPosts) {
          if (!boardIds.has(post.boardId)) {
            selectedPosts.push(post);
            boardIds.add(post.boardId);
          }
        }

        setHotPosts(selectedPosts);
      } catch (error) {
        console.error('Error loading hot posts:', error);
      }
    };

    loadHotPosts();
  }, []);

  return (
    <div className="main-page">
      {/* 최신 소식 배너 */}
      <div className="news-banner">
        <h2>{t('mainPage.news.title')}</h2>
        <p>{t('mainPage.news.problemBank')}</p>
        <br />
        <p>{t('mainPage.news.newsletter')}</p>
        <br />
        <p>{t('mainPage.news.language')}</p>
      </div>

      {/* 사이트 실적 */}
      <div className="site-stats">
        <h2>{t('mainPage.stats.title')}</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <h3>{t('mainPage.stats.totalUsers')}</h3>
            <p>{siteStats.totalUsers.toLocaleString()}{t('mainPage.stats.users')}</p>
          </div>
          <div className="stat-item">
            <h3>{t('mainPage.stats.totalPosts')}</h3>
            <p>{siteStats.totalPosts.toLocaleString()}{t('mainPage.stats.posts')}</p>
          </div>
          <div className="stat-item">
            <h3>{t('mainPage.stats.activeUsers')}</h3>
            <p>{siteStats.activeUsers}{t('mainPage.stats.users')}</p>
          </div>
        </div>
      </div>

      {/* Hot 게시글 목록 */}
      <div className="hot-posts">
        <h2>{t('mainPage.hotPosts.title')}</h2>
        <div className="posts-grid">
          {hotPosts.length === 0 ? (
            <div style={{ textAlign: 'center', width: '100%' }}>로딩중...</div>
          ) : (
            hotPosts.map((post) => (
              <Link
                key={post.id}
                to={`/board/${post.board}/${post.id}`}
                className="post-card"
              >
                <h3>{post.title}</h3>
                <p className="post-meta">
                  <span className="board-name">{post.board}</span>
                  <span className="author">{post.author.name}</span>
                  <span className="date">{post.date}</span>
                  <span className="likes">❤️ {post.likes}</span>
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage; 