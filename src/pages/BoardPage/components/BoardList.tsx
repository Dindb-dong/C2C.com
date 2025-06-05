import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BoardList.css';
import { Board, Post } from '../../../types';

interface BoardListProps {
  boards: Board[];
  posts: Post[];
}

const BoardList: React.FC<BoardListProps> = ({ boards, posts }) => {
  const navigate = useNavigate();

  return (
    <div className="board-list">
      <h2>게시판 목록</h2>
      <div className="boards-grid">
        {boards.map((board) => (
          <div
            key={board.id}
            className="board-card"
            onClick={() => navigate(`/board/${board.name}`)}
          >
            <h3>{board.name}</h3>
            <p>{board.description}</p>
            {/* <div className="board-stats">
              <span>게시글 {posts.filter(post => post.boardId === board.id).length}개</span>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardList; 