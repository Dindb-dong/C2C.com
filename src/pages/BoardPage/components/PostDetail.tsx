import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBoard } from '../../../contexts/BoardContext';
import { useAuth } from '../../../contexts/AuthContext';
import { usePost } from '../../../contexts/PostContext';
import './PostDetail.css';
import { request } from '../../../utils/request';

interface PostDetailProps {
  post: any;
  onDelete: () => void;
}

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
  likes: number;
  dislikes: number;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, onDelete }) => {
  const { user } = useAuth();
  const { currentBoard } = useBoard();
  const { addComment, deleteComment, likeComment, dislikeComment } = usePost();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchComments = async () => {
    if (!currentBoard?.id || !post.id) return;

    try {
      setLoading(true);
      const response = await request.get(`/boards/${currentBoard.id}/posts/${post.id}/comments`);
      if (response.status !== 200) throw new Error('댓글을 불러오는데 실패했습니다.');
      const data = response.data as Comment[];
      setComments(data);
    } catch (error) {
      console.error('댓글 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [currentBoard?.id, post.id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment(currentBoard?.id || '', post.id, newComment);
      setNewComment('');
      fetchComments(); // 댓글 작성 후 목록 새로고침
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    try {
      await deleteComment(post.id, commentId);
      fetchComments(); // 댓글 삭제 후 목록 새로고침
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
    }
  };

  const handleCommentLike = async (commentId: string) => {
    try {
      await likeComment(currentBoard?.id || '', post.id, commentId);
      fetchComments(); // 좋아요 후 목록 새로고침
    } catch (error) {
      console.error('좋아요 실패:', error);
    }
  };

  const handleCommentDislike = async (commentId: string) => {
    try {
      await dislikeComment(currentBoard?.id || '', post.id, commentId);
      fetchComments(); // 싫어요 후 목록 새로고침
    } catch (error) {
      console.error('싫어요 실패:', error);
    }
  };

  return (
    <div className="post-detail">
      <div className="post-header">
        <h2>제목: {post.title}</h2>
        <div className="post-meta">
          <span className="post-author">작성자: {post.author.name}</span>
          <span className="post-date">작성 날짜: {new Date(post.createdAt).toLocaleString()}</span>
        </div>
        <div className="post-tags">
          태그: {post.tags.map((tag: string) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>

      <div className="post-content">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {user && user.id === post.author.id && (
        <div className="post-actions">
          <Link to={`/board/${currentBoard?.id}/${post.id}/edit`} className="edit-button">수정</Link>
          <button onClick={onDelete} className="delete-button">삭제</button>
        </div>
      )}

      <div className="comments-section">
        <h2>댓글</h2>
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 작성하세요..."
            required
          />
          <button type="submit">댓글 작성</button>
        </form>

        <div className="comments-list">
          {loading ? (
            <div className="loading">댓글을 불러오는 중...</div>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <span className="comment-author">{comment.author.name}</span>
                  <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <div className="comment-content">{comment.content}</div>
                <div className="comment-actions">
                  <button onClick={() => handleCommentLike(comment.id)}>
                    👍 {comment.likes}
                  </button>
                  <button onClick={() => handleCommentDislike(comment.id)}>
                    👎 {comment.dislikes}
                  </button>
                  {user && user.id === comment.author.id && (
                    <button onClick={() => handleCommentDelete(comment.id)}>삭제</button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-comments">아직 댓글이 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail; 