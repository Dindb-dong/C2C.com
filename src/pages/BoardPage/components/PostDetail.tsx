import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBoard } from '../../../contexts/BoardContext';
import { useAuth } from '../../../contexts/AuthContext';
import { usePost } from '../../../contexts/PostContext';
import './PostDetail.css';
import { request } from '../../../utils/request';
import { getUserId } from '../../../utils/storage';

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
  const { addComment, deleteComment, likeComment, dislikeComment, likePost, dislikePost } = usePost();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [postLikeLoading, setPostLikeLoading] = useState(false);
  const [postDislikeLoading, setPostDislikeLoading] = useState(false);
  const [currentPost, setCurrentPost] = useState(post);
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

  const fetchPost = async () => {
    if (!currentBoard?.id || !post.id) return;
    try {
      const response = await request.get(`/boards/${currentBoard.id}/posts/${post.id}`);
      if (response.status === 200) {
        setCurrentPost(response.data);
        console.log('fetchPost in PostDetail', response.data);
      }
    } catch (error) {
      console.error('게시글 로드 실패:', error);
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
      const userId = await getUserId();
      if (!userId) {
        alert('로그인이 필요합니다.');
        return;
      }
      await likeComment(currentBoard?.id || '', post.id, commentId, userId);
      fetchComments(); // 좋아요 후 목록 새로고침
    } catch (error) {
      console.error('좋아요 실패:', error);
    }
  };

  const handleCommentDislike = async (commentId: string) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        alert('로그인이 필요합니다.');
        return;
      }
      await dislikeComment(currentBoard?.id || '', post.id, commentId, userId);
      fetchComments(); // 싫어요 후 목록 새로고침
    } catch (error) {
      console.error('싫어요 실패:', error);
    }
  };

  const handlePostLike = async () => {
    if (postLikeLoading) return;
    try {
      setPostLikeLoading(true);
      const userId = await getUserId();
      if (!userId) {
        alert('로그인이 필요합니다.');
        return;
      }
      await likePost(currentBoard?.id || '', post.id, userId);
      await fetchPost(); // 게시글 데이터만 새로 불러오기
    } catch (error) {
      console.error('게시글 좋아요 실패:', error);
    } finally {
      setPostLikeLoading(false);
    }
  };

  const handlePostDislike = async () => {
    if (postDislikeLoading) return;
    try {
      setPostDislikeLoading(true);
      const userId = await getUserId();
      if (!userId) {
        alert('로그인이 필요합니다.');
        return;
      }
      await dislikePost(currentBoard?.id || '', post.id, userId);
      await fetchPost(); // 게시글 데이터만 새로 불러오기
    } catch (error) {
      console.error('게시글 싫어요 실패:', error);
    } finally {
      setPostDislikeLoading(false);
    }
  };

  if (!currentPost) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>로딩중...</div>;
  }

  return (
    <div className="post-detail">
      <div className="post-header">
        <h2>제목: {currentPost.title}</h2>
        <div className="post-meta">
          <span className="post-author">작성자: {currentPost.author.name}</span>
          <span className="post-date">작성 날짜: {new Date(currentPost.createdAt).toLocaleString()}</span>
        </div>
        <div className="post-tags">
          태그: {currentPost.tags.map((tag: string) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <div className="post-actions">
          <button
            onClick={handlePostLike}
            className={`like-button ${postLikeLoading ? 'loading' : ''}`}
            disabled={postLikeLoading}
          >
            {postLikeLoading ? '처리중...' : `👍 ${currentPost.likes || 0}`}
          </button>
          <button
            onClick={handlePostDislike}
            className={`dislike-button ${postDislikeLoading ? 'loading' : ''}`}
            disabled={postDislikeLoading}
          >
            {postDislikeLoading ? '처리중...' : `👎 ${currentPost.dislikes || 0}`}
          </button>
          {user && user.id === currentPost.author.id && (
            <>
              <button onClick={() => navigate(`/board/${currentBoard?.id}/${currentPost.id}/edit`)} className="edit-button">수정</button>
              <button onClick={onDelete} className="delete-button">삭제</button>
            </>
          )}
        </div>
      </div>

      <div className="post-content">
        <div dangerouslySetInnerHTML={{ __html: currentPost.content }} />
      </div>

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