import React, { useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useBoard } from '../../contexts/BoardContext';
import BoardList from './components/BoardList';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import BoardCreateForm from './components/BoardCreateForm';
import BoardWriteForm from './components/BoardWriteForm';
import './BoardPage.css';

const BoardPage: React.FC = () => {
  const { category, postId } = useParams<{ category?: string; postId?: string }>();
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

  // boards 데이터 로드 (최초 1회만)
  useEffect(() => {
    if (!boards.length) {
      fetchBoards();
    }
    // fetchBoards만 의존성에 넣기
  }, [fetchBoards]);

  // posts, post 데이터 로드
  useEffect(() => {
    if (!boards.length) return; // boards가 없으면 아무것도 하지 않음
    if (isCreate || isWrite) return;

    const board = boards.find(b => b.name === category);
    if (!board) return;

    if (category && postId) {
      // currentPost가 없을 때만 fetch
      if (!currentPost || currentPost.id !== postId) {
        fetchPost(board.id, postId);
      }
    } else if (category) {
      // posts가 없을 때만 fetch
      if (!posts.length || posts[0].boardId !== board.id) {
        fetchPosts(board.id);
      }
    }
    // category, postId, boards, isCreate, isWrite, fetchPosts, fetchPost만 의존성에 넣기
  }, [category, postId, boards, isCreate, isWrite, fetchPosts, fetchPost]);

  const handleDeletePost = useCallback(async () => {
    if (!category || !postId) return;
    try {
      const board = boards.find(b => b.name === category);
      if (board) {
        await deletePost(board.id, postId);
      }
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
    }
  }, [category, postId, deletePost, boards]);

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