import React, { useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBoard } from '../../contexts/BoardContext';
import BoardList from './components/BoardList';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import BoardCreateForm from './components/BoardCreateForm';
import BoardWriteForm from './components/BoardWriteForm';
import './BoardPage.css';
import { Post } from '../../types';

const BoardPage: React.FC = () => {
  const { category, postId } = useParams<{ category?: string; postId?: string }>();
  const navigate = useNavigate();
  const {
    boards,
    posts,
    currentPost,
    loading,
    error,
    fetchBoards,
    fetchPosts,
    fetchPost,
    deletePost
  } = useBoard();

  const isWrite = window.location.pathname.endsWith('/write');
  const isCreate = window.location.pathname.endsWith('/create');
  const mounted = useRef(false);
  const boardsLoaded = useRef(false);
  const lastPostId = useRef<string | undefined>(undefined);

  // boards 데이터 로드
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      fetchBoards();
    }
  }, [fetchBoards]);

  // boards가 로드된 후 posts 데이터 로드
  useEffect(() => {
    if (loading || !boards.length) return;

    if (isCreate || isWrite) {
      return;
    }

    if (postId && category) {
      const board = boards.find(b => b.name === category);
      if (board) {
        // postId가 변경되었을 때만 fetchPost 호출
        if (postId !== lastPostId.current) {
          lastPostId.current = postId;
          fetchPost(board.id, postId);
        }
      }
    } else if (category) {
      const board = boards.find(b => b.name === category);
      if (board && !boardsLoaded.current) {
        boardsLoaded.current = true;
        fetchPosts(board.id);
      }
    }
  }, [category, postId, isWrite, isCreate, fetchPosts, fetchPost, boards, loading]);

  const handleDeletePost = useCallback(async () => {
    if (!category || !postId) return;
    try {
      const board = boards.find(b => b.name === category);
      if (board) {
        await deletePost(board.id, postId);
        navigate(`/board/${category}`);
      }
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
    }
  }, [category, postId, deletePost, navigate, boards]);

  if (loading) {
    return <div className="board-container">로딩 중...</div>;
  }

  if (error) {
    return <div className="board-container">{error}</div>;
  }

  // 게시판 생성
  if (isCreate) {
    return <BoardCreateForm />;
  }

  // 글쓰기
  if (isWrite && category) {
    const board = boards.find(b => b.name === category);
    if (board) {
      return <BoardWriteForm boardId={board.id} />;
    }
  }

  // 게시글 상세
  if (category && postId && !isWrite && currentPost) {
    return <PostDetail post={currentPost} onDelete={handleDeletePost} />;
  }

  // 카테고리별 게시글 목록
  if (category && !postId && !isWrite) {
    const board = boards.find(b => b.name === category);
    if (!board) {
      return <div className="board-container">존재하지 않는 게시판입니다.</div>;
    }
    return <PostList board={board} posts={posts as unknown as Post[]} />;
  }

  // 게시판 목록
  return <BoardList boards={boards} posts={posts as unknown as Post[]} />;
};

export default BoardPage; 