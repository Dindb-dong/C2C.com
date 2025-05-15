import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { request } from '../../utils/request';
import { getAccessToken, clearAuthData } from '../../utils/storage';
import './MyPage.css';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  rating?: number;
  point?: number;
  referralCode?: string;
}

interface MentorProfile {
  id: string;
  user_id: string;
  title: string;
  description: string;
  career: string;
  skills: string[];
  hourly_rate: number;
  name: string;
}

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mentorProfile, setMentorProfile] = useState<MentorProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 수정 가능한 필드들
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      navigate('/login');
      return;
    }

    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const response = await request.get<UserProfile>('/auth/my-profile');
      if (response.status === 200) {
        setProfile(response.data);
        setName(response.data.name);
        setEmail(response.data.email);
        setReferralCode(response.data.referralCode || '');

        // 멘토인 경우 멘토 프로필도 가져오기
        if (response.data.role === 'mentor') {
          const mentorResponse = await request.get<MentorProfile>('/mentor/profile');
          if (mentorResponse.status === 200) {
            setMentorProfile(mentorResponse.data);
          }
        }

        setIsLoading(false);
      } else {
        setError('프로필 정보를 불러오는데 실패했습니다.');
        setIsLoading(false);
        console.log(response);
      }
    } catch (error: any) {
      console.error('Failed to fetch profile:', error);
      setError('프로필 정보를 불러오는데 실패했습니다.');
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const updateData = {
        name,
        email,
        ...(password && { password }), // 비밀번호가 입력된 경우에만 포함
      };

      const response = await request.put<UserProfile>('/auth/my-profile', updateData);
      console.log(response.data);
      setProfile(response.data);
      setEditMode(false);
      setPassword(''); // 비밀번호 필드 초기화
      alert('정보가 성공적으로 수정되었습니다.');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      setError('프로필 수정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMentorRegistration = () => {
    navigate('/mentor-registration');
  };

  if (isLoading) {
    return <div className="mypage-container">로딩 중...</div>;
  }

  if (!profile) {
    handleLogout();
    return <div className="mypage-container">멘토 프로필을 불러올 수 없습니다.</div>;
  }

  return (
    <div className="mypage-container">
      <h1>마이페이지</h1>
      <div className="role-badge">
        {profile.role === 'mentor' ? '멘토' : '멘티'}
      </div>

      <div className="profile-section">
        <div className="profile-info">
          <form onSubmit={handleSave} className="profile-form">
            {error && <div className="error-msg">{error}</div>}

            <div className="form-group">
              <label>닉네임</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={!editMode}
              />
            </div>

            <div className="form-group">
              <label>이메일</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={!editMode}
              />
            </div>

            <div className="form-group">
              <label>비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="변경 시에만 입력"
                disabled={!editMode}
              />
            </div>

            {!profile.referralCode && (
              <div className="form-group">
                <label>추천인 코드</label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={e => setReferralCode(e.target.value)}
                  disabled={!editMode}
                />
              </div>
            )}

            <div className="form-group">
              <label>평점</label>
              <input
                type="text"
                value={profile.rating ? `${profile.rating.toFixed(1)} / 5.0` : '평가 없음'}
                disabled
              />
            </div>

            <div className="form-group">
              <label>포인트</label>
              <input
                type="text"
                value={`${profile.point || 0} pt`}
                disabled
              />
            </div>

            <div className="mypage-btns">
              {editMode ? (
                <>
                  <button
                    type="submit"
                    className="save-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? '저장 중...' : '저장'}
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setEditMode(false);
                      setName(profile.name);
                      setEmail(profile.email);
                      setPassword('');
                    }}
                    disabled={isLoading}
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="edit-btn"
                    onClick={() => setEditMode(true)}
                  >
                    정보 수정
                  </button>
                  {profile.role !== 'MENTOR' && (
                    <button
                      type="button"
                      className="mentor-btn"
                      onClick={handleMentorRegistration}
                    >
                      멘토 등록
                    </button>
                  )}
                </>
              )}
              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyPage; 