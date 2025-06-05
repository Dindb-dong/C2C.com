import React, { createContext, useContext, useState, useCallback } from 'react';
import { getAccessToken } from '../utils/storage';
import { request } from '../utils/request';

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  likes: number;
  dislikes: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PostContextType {
  loading: boolean;
  error: string | null;
  addComment: (boardId: string, postId: string, content: string) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
  likeComment: (boardId: string, postId: string, commentId: string) => Promise<void>;
  dislikeComment: (boardId: string, postId: string, commentId: string) => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addComment = useCallback(async (boardId: string, postId: string, content: string) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      await request.post<Comment>(`/boards/${boardId}/posts/${postId}/comments`, { content });
    } catch (error) {
      setError('댓글 작성에 실패했습니다.');
      console.error('Error adding comment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const deleteComment = useCallback(async (postId: string, commentId: string) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      await request.delete(`/posts/${postId}/comments/${commentId}`);
    } catch (error) {
      setError('댓글 삭제에 실패했습니다.');
      console.error('Error deleting comment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const likeComment = useCallback(async (boardId: string, postId: string, commentId: string) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      await request.post(`/boards/${boardId}/posts/${postId}/comments/${commentId}/like`);
    } catch (error) {
      setError('좋아요에 실패했습니다.');
      console.error('Error liking comment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const dislikeComment = useCallback(async (boardId: string, postId: string, commentId: string) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      await request.post(`/boards/${boardId}/posts/${postId}/comments/${commentId}/dislike`);
    } catch (error) {
      setError('싫어요에 실패했습니다.');
      console.error('Error disliking comment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const value = {
    loading,
    error,
    addComment,
    deleteComment,
    likeComment,
    dislikeComment
  };

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
}; 