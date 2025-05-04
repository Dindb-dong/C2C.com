import React from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css';

interface HotPost {
  id: number;
  title: string;
  board: string;
  boardId: string;
  author: string;
  date: string;
}

const MainPage: React.FC = () => {
  // 임시 데이터
  const siteStats = {
    totalUsers: 1234,
    totalPosts: 5678,
    activeUsers: 89
  };

  const hotPosts: HotPost[] = [
    { id: 1, title: '최신 기술 트렌드 분석', board: '기술 게시판', boardId: 'tech', author: '홍길동', date: '2024-03-20' },
    { id: 2, title: '스타트업 성공 사례', board: '경제 게시판', boardId: 'economy', author: '김철수', date: '2024-03-19' },
    { id: 3, title: 'AI의 미래', board: '과학 게시판', boardId: 'science', author: '이영희', date: '2024-03-18' },
    { id: 4, title: '문화 현상 분석', board: '문화 게시판', boardId: 'culture', author: '박민수', date: '2024-03-17' }
  ];

  return (
    <div className="main-page">
      {/* 최신 소식 배너 */}
      <div className="news-banner">
        <h2>최신 소식</h2>
        <p>새로운 기능이 추가되었습니다! 자세한 내용은 공지사항을 확인하세요.</p>
      </div>

      {/* 사이트 실적 */}
      <div className="site-stats">
        <h2>사이트 실적</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <h3>총 회원 수</h3>
            <p>{siteStats.totalUsers.toLocaleString()}명</p>
          </div>
          <div className="stat-item">
            <h3>총 게시글</h3>
            <p>{siteStats.totalPosts.toLocaleString()}개</p>
          </div>
          <div className="stat-item">
            <h3>활성 사용자</h3>
            <p>{siteStats.activeUsers}명</p>
          </div>
        </div>
      </div>

      {/* Hot 게시글 목록 */}
      <div className="hot-posts">
        <h2>🔥 Hot 게시글</h2>
        <div className="posts-grid">
          {hotPosts.map((post) => (
            <Link
              key={post.id}
              to={`/board/${post.boardId}/${post.id}`}
              className="post-card"
            >
              <h3>{post.title}</h3>
              <p className="post-meta">
                <span className="board-name">{post.board}</span>
                <span className="author">{post.author}</span>
                <span className="date">{post.date}</span>
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage; 