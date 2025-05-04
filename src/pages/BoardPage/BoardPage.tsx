import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './BoardPage.css';

interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  views: number;
  likes: number;
}

const BoardPage: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [posts, setPosts] = useState<Post[]>([
    { id: 1, title: '첫 번째 게시글', author: '홍길동', date: '2024-03-20', views: 123, likes: 45 },
    { id: 2, title: '두 번째 게시글', author: '김철수', date: '2024-03-19', views: 89, likes: 23 },
    { id: 3, title: '세 번째 게시글', author: '이영희', date: '2024-03-18', views: 67, likes: 12 },
  ]);

  const boardNames: { [key: string]: string } = {
    tech: '기술 게시판',
    economy: '경제 게시판',
    science: '과학 게시판',
    culture: '문화 게시판'
  };

  const handleWritePost = () => {
    // TODO: Implement write post functionality
    console.log('Write post clicked');
  };

  return (
    <div className="board-page">
      <div className="board-header">
        <h1>{boardNames[boardId || ''] || '게시판'}</h1>
        <button className="write-button" onClick={handleWritePost}>
          글쓰기
        </button>
      </div>

      <div className="posts-table">
        <div className="table-header">
          <div className="col-title">제목</div>
          <div className="col-author">작성자</div>
          <div className="col-date">작성일</div>
          <div className="col-views">조회수</div>
          <div className="col-likes">추천</div>
        </div>

        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/board/${boardId}/${post.id}`}
            className="post-row"
          >
            <div className="col-title">{post.title}</div>
            <div className="col-author">{post.author}</div>
            <div className="col-date">{post.date}</div>
            <div className="col-views">{post.views}</div>
            <div className="col-likes">{post.likes}</div>
          </Link>
        ))}
      </div>

      <div className="pagination">
        <button className="page-button">이전</button>
        <div className="page-numbers">
          <button className="page-number active">1</button>
          <button className="page-number">2</button>
          <button className="page-number">3</button>
        </div>
        <button className="page-button">다음</button>
      </div>
    </div>
  );
};

export default BoardPage; 