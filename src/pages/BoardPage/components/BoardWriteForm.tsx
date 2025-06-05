import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoard } from '../../../contexts/BoardContext';
import './BoardWriteForm.css';

interface BoardWriteFormProps {
  boardId: string;
}

const BoardWriteForm: React.FC<BoardWriteFormProps> = ({ boardId }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const { createPost, boards } = useBoard();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !category) {
      alert('제목, 내용, 카테고리는 필수 입력 항목입니다.');
      return;
    }
    try {
      await createPost(boardId, {
        title,
        content,
        category,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean)
      });
      const board = boards.find(b => b.id === boardId);
      if (board) {
        navigate(`/board/${board.name}`);
      }
    } catch (error) {
      console.error('게시글 작성 실패:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="write-form">
      <div className="form-group">
        <label htmlFor="title">제목 *</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">카테고리 *</label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="예: 경제, 기술, 과학, 문화 등. 게시판이 없는 경우 운영자에게 문의"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="tags">태그 (쉼표로 구분)</label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="예: 양자컴퓨터,서울,금"
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">내용 *</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit">작성</button>
        <button type="button" onClick={() => {
          const board = boards.find(b => b.id === boardId);
          if (board) {
            navigate(`/board/${board.name}`);
          }
        }}>취소</button>
      </div>
    </form>
  );
};

export default BoardWriteForm; 