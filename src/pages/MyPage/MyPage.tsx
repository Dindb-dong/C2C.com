import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyPage.css';

const defaultProfile = 'https://via.placeholder.com/120x120.png?text=Profile';

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const [profileImg, setProfileImg] = useState<string>(defaultProfile);
  const [nickname, setNickname] = useState('홍길동');
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('');
  const [point] = useState(1200);
  const [editMode, setEditMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
    }
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) setEmail(userEmail);
  }, [navigate]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfileImg(ev.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setEditMode(false);
    alert('정보가 저장되었습니다! (실제 저장은 구현 필요)');
  };

  return (
    <div className="mypage-container">
      <h1>마이페이지</h1>
      <div className="profile-section">
        <div className="profile-img-wrapper" onClick={() => fileInputRef.current?.click()}>
          <img src={profileImg} alt="프로필" className="profile-img" />
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleProfileChange}
          />
          <div className="profile-img-edit">프로필 변경</div>
        </div>
        <div className="profile-info">
          <form onSubmit={handleSave} className="profile-form">
            <div className="form-group">
              <label>닉네임</label>
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
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
            <div className="form-group">
              <label>멘토링 포인트</label>
              <input type="text" value={point + ' pt'} disabled />
            </div>
            <div className="mypage-btns">
              {editMode ? (
                <>
                  <button type="submit" className="save-btn">저장</button>
                  <button type="button" className="cancel-btn" onClick={() => setEditMode(false)}>취소</button>
                </>
              ) : (
                <button type="button" className="edit-btn" onClick={() => setEditMode(true)}>정보 수정</button>
              )}
              <button type="button" className="logout-btn" onClick={handleLogout}>로그아웃</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyPage; 