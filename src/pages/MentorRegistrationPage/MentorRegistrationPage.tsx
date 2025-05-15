import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { request } from '../../utils/request';
import './MentorRegistrationPage.css';

interface MentorRegistrationData {
  title: string;
  description: string;
  career: string;
  skills: string[];
  hourly_rate: number;
}

const MentorRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [career, setCareer] = useState('');
  const [skills, setSkills] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const registrationData: MentorRegistrationData = {
        title,
        description,
        career,
        skills: skills.split(',').map(skill => skill.trim()),
        hourly_rate: Number(hourlyRate)
      };

      const response = await request.post('/mentor/profile', registrationData);

      if (response.status === 201) {
        alert('멘토 등록이 완료되었습니다!');
        navigate('/my-page');
      }
    } catch (error: any) {
      console.error('Failed to register as mentor:', error);
      setError('멘토 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mentor-registration-container">
      <h1>멘토 등록</h1>
      <form onSubmit={handleSubmit} className="mentor-registration-form">
        {error && <div className="error-msg">{error}</div>}

        <div className="form-group">
          <label>멘토링 제목</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="멘토링 제목을 입력하세요"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>멘토링 소개</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="멘토링에 대한 소개를 입력하세요"
            required
            disabled={isLoading}
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>경력 사항</label>
          <textarea
            value={career}
            onChange={e => setCareer(e.target.value)}
            placeholder="경력 사항을 입력하세요"
            required
            disabled={isLoading}
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>보유 기술</label>
          <input
            type="text"
            value={skills}
            onChange={e => setSkills(e.target.value)}
            placeholder="보유 기술을 쉼표(,)로 구분하여 입력하세요"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>시간당 요금 (원)</label>
          <input
            type="number"
            value={hourlyRate}
            onChange={e => setHourlyRate(e.target.value)}
            placeholder="시간당 요금을 입력하세요"
            required
            min="0"
            disabled={isLoading}
          />
        </div>

        <div className="button-group">
          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? '등록 중...' : '멘토 등록하기'}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate('/my-page')}
            disabled={isLoading}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default MentorRegistrationPage; 