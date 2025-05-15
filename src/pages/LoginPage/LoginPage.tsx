import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { request } from '../../utils/request';
import { setAccessToken, setRefreshToken, setUserRole, setUserId } from '../../utils/storage';
import './LoginPage.css';

interface LoginResponse {
  error: any;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await request.post<LoginResponse>('/auth/login', {
        email,
        password,
      });
      if (response.status === 200) {
        const { accessToken, refreshToken, user } = response.data;

        // 토큰과 사용자 정보 저장
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setUserRole(user.role);
        setUserId(user.id);

        // 사용자 정보와 함께 마이페이지로 이동
        navigate('/my-page');
      } else if (response.status === 401) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        console.error('Login failed:', {
          status: response.status,
          statusText: response.statusText,
          error: response.data.error
        });
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <h1>로그인</h1>
        {error && <div className="error-msg">{error}</div>}
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
        <div className="signup-link">
          계정이 없으신가요? <Link to="/signup">회원가입</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage; 