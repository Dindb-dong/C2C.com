import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';
import { request } from '../../utils/request';

interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const signupData: SignupRequest = {
        email,
        password,
        name: nickname
      };

      const response = await request.post<AuthResponse>('/api/signup', signupData);

      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      if (response.status === 201) {
        alert('회원가입이 완료되었습니다!');
        navigate('/');
      } else if (response.status === 400) {
        setError('이미 존재하는 이메일입니다.');
      } else { // 500 에러
        setError('회원가입 중 오류가 발생했습니다.');
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        setError('이미 존재하는 이메일입니다.');
      } else {
        setError('회원가입 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="signup-page">
      <form className="signup-form" onSubmit={handleSignup}>
        <h1>회원가입</h1>
        {error && <div className="error-msg">{error}</div>}
        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default SignupPage; 