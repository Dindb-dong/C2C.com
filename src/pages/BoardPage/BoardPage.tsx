import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './BoardPage.css';

interface Post {
  id: number;
  title: string;
  author: string;
  content: string;
  createdAt: string;
  comments: Comment[];
  category: string;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

// 글쓰기 폼 컴포넌트
const BoardWriteForm: React.FC<{ category: string }> = ({ category }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  let convertedCategory;
  if (category === 'tech') {
    convertedCategory = '기술';
  } else if (category === 'economy') {
    convertedCategory = '경제';
  } else if (category === 'science') {
    convertedCategory = '과학';
  } else if (category === 'culture') {
    convertedCategory = '문화';
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제로는 서버에 저장하는 로직 필요
    alert('글이 등록되었습니다! (실제 저장은 구현 필요)');
    navigate(`/board/${category}`);
  };

  return (
    <div className="board-container">
      <div className="board-header">
        <h1>{convertedCategory} 주제 게시글 작성</h1>
      </div>
      <form className="post-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="author">작성자 이름</label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            rows={8}
          />
        </div>
        <button type="submit" className="write-button">등록</button>
      </form>
    </div>
  );
};

const BoardPage: React.FC = () => {
  const { category, postId } = useParams<{ category?: string; postId?: string }>();
  const isWrite = window.location.pathname.endsWith('/write');
  const [posts] = useState<Post[]>([
    {
      id: 1,
      title: '첫 번째 게시글',
      author: '작성자1',
      content: '이것은 첫 번째 게시글의 내용입니다.',
      createdAt: '2024-03-20 14:30:00',
      category: 'tech',
      comments: [
        {
          id: 1,
          author: '댓글러1',
          content: '좋은 글 감사합니다!',
          createdAt: '2024-03-20 15:00:00'
        }
      ]
    },
    {
      id: 2,
      title: '두 번째 게시글',
      author: '작성자2',
      content: '이것은 두 번째 게시글의 내용입니다.',
      createdAt: '2024-03-20 16:00:00',
      category: 'tech',
      comments: []
    },
    {
      id: 3,
      title: '경제 관련 게시글',
      author: '작성자3',
      content: '이것은 경제 관련 게시글입니다.',
      createdAt: '2024-03-20 17:00:00',
      category: 'economy',
      comments: []
    }
  ]);

  const boardNames: { [key: string]: string } = {
    tech: '기술 게시판',
    economy: '경제 게시판',
    science: '과학 게시판',
    culture: '문화 게시판'
  };

  // 글쓰기
  if (isWrite && category) {
    return <BoardWriteForm category={category} />;
  }

  // 게시글 상세
  if (category && postId && !isWrite) {
    const selectedPost = posts.find(post => post.id === parseInt(postId));
    if (!selectedPost) return <div className="board-container">존재하지 않는 게시글입니다.</div>;
    return (
      <div className="board-container">
        <div className="board-header">
          <Link to={`/board/${category}/write`} className="write-button">글쓰기</Link>
        </div>
        <div className="post-detail">
          <h1 className="post-title">{selectedPost.title}</h1>
          <div className="post-meta">
            <span className="post-author">작성자: {selectedPost.author}</span>
            <span className="post-date">{selectedPost.createdAt}</span>
          </div>
          <div className="post-content">
            {selectedPost.content}
          </div>
          <div className="comments-section">
            <h2>댓글</h2>
            {selectedPost.comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-meta">
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-date">{comment.createdAt}</span>
                </div>
                <div className="comment-content">{comment.content}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="other-posts">
          <h2>다른 게시글</h2>
          {posts
            .filter(post => post.id !== selectedPost.id && post.category === selectedPost.category)
            .map(post => (
              <Link key={post.id} to={`/board/${post.category}/${post.id}`} className="other-post">
                <h3>{post.title}</h3>
                <div className="other-post-meta">
                  <span>{post.author}</span>
                  <span>{post.createdAt}</span>
                </div>
              </Link>
            ))}
        </div>
      </div>
    );
  }

  // 카테고리별 게시글 목록
  if (category && !postId && !isWrite) {
    const currentBoardName = boardNames[category] || '게시판';
    const categoryPosts = posts.filter(post => post.category === category);
    return (
      <div className="board-container">
        <div className="board-header">
          <h1>{currentBoardName}</h1>
          <Link to={`/board/${category}/write`} className="write-button">글쓰기</Link>
        </div>
        <div className="posts-list">
          {categoryPosts.map(post => (
            <Link key={post.id} to={`/board/${category}/${post.id}`} className="post-item">
              <h2>{post.title}</h2>
              <div className="post-meta">
                <span className="post-author">{post.author}</span>
                <span className="post-date">{post.createdAt}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // 카테고리 선택 화면
  return (
    <div className="board-container">
      <div className="board-header">
        <h1>게시판</h1>
      </div>
      <div className="board-categories">
        {Object.entries(boardNames).map(([key, name]) => (
          <Link key={key} to={`/board/${key}`} className="board-category">
            <h2>{name}</h2>
            <p>게시글 수: {posts.filter(post => post.category === key).length}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BoardPage; 