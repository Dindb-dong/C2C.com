import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './BoardList.css';

interface BoardListProps {
  boards: Board[];
  posts: Post[];
}

const BoardList: React.FC<BoardListProps> = ({ boards, posts }) => {
  const navigate = useNavigate();
  return (
    <div className="board-list">
      <div className="board-list-header">
        <h2>게시판 목록</h2>
        <button onClick={() => navigate('/board/create')} className="create-board-button">
          게시판 생성
        </button>
      </div>
      <div className="boards-grid">
        {boards.map((board) => (
          <button
            key={board.id}
            className="board-card"
            onClick={() => navigate(`/board/${board.name}`)}
          >
            <h3>{board.name}</h3>
            <p>{board.description}</p>
            {/* <div className="board-stats">
              <span>게시글 {posts.filter(post => post.boardId === board.id).length}개</span>
            </div> */}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BoardList; 