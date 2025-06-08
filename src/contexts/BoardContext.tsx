import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { getAccessToken } from '../utils/storage';
import { request } from '../utils/request';

interface BoardContextType {
  boards: Board[];
  posts: Post[];
  currentBoard: Board | null;
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
  fetchBoards: () => Promise<Board[] | undefined>;
  fetchPosts: (boardId: string) => Promise<Post[] | undefined>;
  fetchPost: (boardId: string, postId: string) => Promise<void>;
  createBoard: (data: { name: string; description: string }) => Promise<void>;
  createPost: (boardId: string, data: { title: string; content: string; category: string; tags: string[] }) => Promise<void>;
  updatePost: (boardId: string, postId: string, data: { title: string; content: string; category: string; tags: string[] }) => Promise<void>;
  deletePost: (boardId: string, postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
  likeComment: (postId: string, commentId: string) => Promise<void>;
  dislikeComment: (postId: string, commentId: string) => Promise<void>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestInProgress = useRef(false);

  const fetchBoards = useCallback(async () => {
    if (requestInProgress.current) return;
    requestInProgress.current = true;
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      const response = await request.get<Board[]>('/boards');
      setBoards(response.data);
      console.log('fetchBoards', response.data);
      return response.data;
    } catch (error) {
      setError('게시판 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching boards:', error);
    } finally {
      setLoading(false);
      requestInProgress.current = false;
    }
  }, []);

  const fetchPosts = useCallback(async (boardId: string) => {
    if (requestInProgress.current) return;
    requestInProgress.current = true;
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      const response = await request.get<Post[]>(`/boards/${boardId}/posts`);
      setPosts(response.data);
      setCurrentBoard(boards.find(board => board.id === boardId) || null);
      return response.data;
    } catch (error) {
      setError('게시글 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      requestInProgress.current = false;
    }
  }, [boards]);

  const fetchPost = useCallback(async (boardId: string, postId: string) => {
    if (requestInProgress.current) return;
    requestInProgress.current = true;
    setLoading(true);
    setError(null);
    setCurrentPost(null);
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      const response = await request.get<Post>(`/boards/${boardId}/posts/${postId}`);
      setCurrentPost(response.data);
      console.log('fetchPost', response.data);
      setCurrentBoard(boards.find(board => board.id === boardId) || null);
    } catch (error) {
      setError('게시글을 불러오는데 실패했습니다.');
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
      requestInProgress.current = false;
    }
  }, [boards]);

  const createBoard = useCallback(async (data: { name: string; description: string }) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      await request.post('/boards', data);
      await fetchBoards();
    } catch (error) {
      setError('게시판 생성에 실패했습니다.');
      console.error('Error creating board:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loading, fetchBoards]);

  const createPost = useCallback(async (boardId: string, data: { title: string; content: string; category: string; tags: string[] }) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      await request.post(`/boards/${boardId}/posts`, data);
      await fetchPosts(boardId);
    } catch (error) {
      setError('게시글 작성에 실패했습니다.');
      console.error('Error creating post:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loading, fetchPosts]);

  const updatePost = useCallback(async (boardId: string, postId: string, data: { title: string; content: string; category: string; tags: string[] }) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      await request.put(`/boards/${boardId}/posts/${postId}`, data);
      await fetchPost(boardId, postId);
    } catch (error) {
      setError('게시글 수정에 실패했습니다.');
      console.error('Error updating post:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loading, fetchPost]);

  const deletePost = useCallback(async (boardId: string, postId: string) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      await request.delete(`/boards/${boardId}/posts/${postId}`);
      await fetchPosts(boardId);
    } catch (error) {
      setError('게시글 삭제에 실패했습니다.');
      console.error('Error deleting post:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loading, fetchPosts]);

  const addComment = useCallback(async (postId: string, content: string) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      await request.post(`/posts/${postId}/comments`, { content });
      if (currentPost && currentBoard) {
        await fetchPost(currentBoard.id, postId);
      }
    } catch (error) {
      setError('댓글 작성에 실패했습니다.');
      console.error('Error adding comment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loading, currentPost, currentBoard, fetchPost]);

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
      if (currentPost && currentBoard) {
        await fetchPost(currentBoard.id, postId);
      }
    } catch (error) {
      setError('댓글 삭제에 실패했습니다.');
      console.error('Error deleting comment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loading, currentPost, currentBoard, fetchPost]);

  const likeComment = useCallback(async (postId: string, commentId: string) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      await request.post(`/posts/${postId}/comments/${commentId}/like`);
      if (currentPost && currentBoard) {
        await fetchPost(currentBoard.id, postId);
      }
    } catch (error) {
      setError('좋아요에 실패했습니다.');
      console.error('Error liking comment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loading, currentPost, currentBoard, fetchPost]);

  const dislikeComment = useCallback(async (postId: string, commentId: string) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      await request.post(`/posts/${postId}/comments/${commentId}/dislike`);
      if (currentPost && currentBoard) {
        await fetchPost(currentBoard.id, postId);
      }
    } catch (error) {
      setError('싫어요에 실패했습니다.');
      console.error('Error disliking comment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loading, currentPost, currentBoard, fetchPost]);

  const value = {
    boards,
    posts,
    currentBoard,
    currentPost,
    loading,
    error,
    fetchBoards,
    fetchPosts,
    fetchPost,
    createBoard,
    createPost,
    updatePost,
    deletePost,
    addComment,
    deleteComment,
    likeComment,
    dislikeComment
  };

  return (
    <BoardContext.Provider value={value}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
}; 