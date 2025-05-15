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
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string): boolean => {
    // 영어, 숫자, 특수문자를 모두 포함하는지 확인
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLengthValid = password.length >= 8 && password.length < 16;

    return hasLetter && hasNumber && hasSpecial && isLengthValid;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePassword(password)) {
      setError('비밀번호는 8자 이상 16자 미만이며, 영어, 숫자, 특수문자를 모두 포함해야 합니다.');
      return;
    }

    setIsLoading(true);

    try {
      const signupData: SignupRequest = {
        email,
        password,
        name: nickname
      };

      const response = await request.post<AuthResponse>('/auth/signup', signupData);
      // 토큰을 로컬 스토리지에 저장
      if (response.status === 201) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        alert('회원가입이 완료되었습니다!');
        navigate('/');
      } else if (response.status === 400) {
        setError('이미 존재하는 이메일입니다.');
      } else { // 500 에러
        setError('회원가입 중 오류가 발생했습니다.');
        console.log(response);
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        setError('이미 존재하는 이메일입니다.');
      } else {
        setError('회원가입 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
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
          disabled={isLoading}
        />
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
          {isLoading ? '회원가입 중...' : '회원가입'}
        </button>
      </form>
    </div>
  );
};

export default SignupPage; 