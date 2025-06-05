import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoard } from '../../../contexts/BoardContext';

const BoardCreateForm: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { createBoard } = useBoard();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBoard({ name, description });
      navigate('/board');
    } catch (error) {
      console.error('게시판 생성 실패:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-form">
      <div className="form-group">
        <label htmlFor="name">게시판 이름</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">게시판 설명</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit">생성</button>
        <button type="button" onClick={() => navigate('/board')}>취소</button>
      </div>
    </form>
  );
};

export default BoardCreateForm; 