import React from 'react';
import { Link } from 'react-router-dom';
import './PostList.css';

interface PostListProps {
  board: Board;
  posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ board, posts }) => {
  const boardPosts = posts.filter(post => post.boardId === board.id);
  return (
    <div className="post-list">
      <div className="post-list-header">
        <h2>{board.name}</h2>
        <Link to={`/board/${board.name}/write`} className="write-button">
          글쓰기
        </Link>
      </div>
      <div className="posts">
        {boardPosts.length > 0 ? (
          boardPosts.map(post => (
            <Link
              key={post.id}
              to={`/board/${board.name}/${post.id}`}
              className="post-item"
            >
              <div className="post-title">{post.title}</div>
              <div className="post-info">
                <span className="post-author">{post.author.name}</span>
                <span className="post-date">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
                <span className="post-stats">
                  댓글 {post.comments.length}개
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="no-posts">게시글이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default PostList; 