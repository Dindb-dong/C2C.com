import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Board, Post } from '../../../types';
import './PostList.css';

interface PostListProps {
  board: Board;
  posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ board, posts }) => {
  const navigate = useNavigate();
  const boardPosts = posts.filter(post => post.boardId === board.id);

  return (
    <div className="post-list">
      <div className="post-list-header">
        <h2>{board.name} 게시판</h2>
        <button onClick={() => navigate(`/board/${board.name}/write`)} className="write-button">
          글쓰기
        </button>
      </div>
      <div className="posts">
        {boardPosts.length > 0 ? (
          boardPosts.map(post => (
            <div
              key={post.id}
              className="post-item"
              onClick={() => navigate(`/board/${board.name}/${post.id}`)}
            >
              <div className="post-title">{post.title}</div>
              <div className="post-info">
                <span className="post-author">{post.authorName}</span>
                <span className="post-date">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
                <span className="post-stats">
                  댓글 {post.comments.length}개
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-posts">게시글이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default PostList; 