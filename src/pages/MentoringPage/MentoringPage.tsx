import React, { useState } from 'react';
import './MentoringPage.css';

// 목업 데이터
const mockMentors = [
  {
    id: 1,
    name: '김민준',
    sex: '남',
    grade: '대학교 4학년',
    university: '서울대학교',
    major: '경제학과',
    summary: [
      '고등학교 경제 교과목 심화 학습 및 내신 대비',
      '경제 관련 독서토론 및 보고서 작성 지도',
      '경제 관련 교내/외 활동 및 대회 준비 지원',
      '경제학과 입시 전형별 맞춤 전략 수립',
      '생활기록부 기재 가능한 경제 관련 프로젝트 진행'
    ],
    isOnline: true,
    isOffline: true,
    location: '서울특별시 서대문구',
    hourlyRate: {
      min: 25000,
      max: 35000
    },
    image: 'https://i.imgur.com/058PUXV.jpg'
  },
  {
    id: 2,
    name: '이서연',
    sex: '여',
    grade: '대학교 3학년',
    university: '고려대학교',
    major: '경영학과',
    summary: [
      '고등학교 경영/경제 교과목 심화 학습 및 내신 대비',
      '경영 관련 독서토론 및 보고서 작성 지도',
      '경영 관련 교내/외 활동 및 대회 준비 지원',
      '경영학과 입시 전형별 맞춤 전략 수립',
      '생활기록부 기재 가능한 경영 관련 프로젝트 진행'
    ],
    isOnline: true,
    isOffline: false,
    location: '',
    hourlyRate: {
      min: 30000,
      max: 40000
    },
    image: 'https://i.imgur.com/0GINXJj.jpg'
  },
  {
    id: 3,
    name: '박지훈',
    sex: '남',
    grade: '대학교 4학년',
    university: '연세대학교',
    major: '통계학과',
    summary: [
      '고등학교 수학/통계 교과목 심화 학습 및 내신 대비',
      '통계 관련 독서토론 및 보고서 작성 지도',
      '통계 관련 교내/외 활동 및 대회 준비 지원',
      '통계학과 입시 전형별 맞춤 전략 수립',
      '생활기록부 기재 가능한 통계 관련 프로젝트 진행'
    ],
    isOnline: false,
    isOffline: true,
    location: '서울특별시 마포구',
    hourlyRate: {
      min: 28000,
      max: 38000
    },
    image: 'https://i.imgur.com/3bYFfzc.jpg'
  },
  {
    id: 4,
    name: '최수아',
    sex: '여',
    grade: '대학교 3학년',
    university: '서강대학교',
    major: '금융학과',
    summary: [
      '고등학교 경제/금융 교과목 심화 학습 및 내신 대비',
      '금융 관련 독서토론 및 보고서 작성 지도',
      '금융 관련 교내/외 활동 및 대회 준비 지원',
      '금융학과 입시 전형별 맞춤 전략 수립',
      '생활기록부 기재 가능한 금융 관련 프로젝트 진행'
    ],
    isOnline: true,
    isOffline: true,
    location: '인천광역시 중구',
    hourlyRate: {
      min: 32000,
      max: 42000
    },
    image: 'https://i.imgur.com/3K8Gk1l.jpg'
  }
];

const mockMentees = [
  {
    id: 1,
    sex: '남',
    grade: '고등학교 2학년',
    targetMajor: '경제학과',
    summary: [
      '경제 교과목 심화 학습 및 내신 성적 향상',
      '경제 관련 독서토론 및 보고서 작성 능력 향상',
      '경제 관련 교내/외 활동 및 대회 참가 경험 쌓기',
      '경제학과 입시 전형별 맞춤 전략 수립',
      '생활기록부 기재 가능한 경제 관련 프로젝트 진행'
    ],
    isOnline: true,
    isOffline: true,
    location: '서울특별시 강남구',
    hourlyRate: {
      min: 20000,
      max: 30000
    }
  },
  {
    id: 2,
    sex: '여',
    grade: '고등학교 3학년',
    targetMajor: '경영학과',
    summary: [
      '경영/경제 교과목 심화 학습 및 내신 성적 향상',
      '경영 관련 독서토론 및 보고서 작성 능력 향상',
      '경영 관련 교내/외 활동 및 대회 참가 경험 쌓기',
      '경영학과 입시 전형별 맞춤 전략 수립',
      '생활기록부 기재 가능한 경영 관련 프로젝트 진행'
    ],
    isOnline: true,
    isOffline: false,
    location: '',
    hourlyRate: {
      min: 25000,
      max: 35000
    }
  },
  {
    id: 3,
    sex: '남',
    grade: '고등학교 2학년',
    targetMajor: '통계학과',
    summary: [
      '수학/통계 교과목 심화 학습 및 내신 성적 향상',
      '통계 관련 독서토론 및 보고서 작성 능력 향상',
      '통계 관련 교내/외 활동 및 대회 참가 경험 쌓기',
      '통계학과 입시 전형별 맞춤 전략 수립',
      '생활기록부 기재 가능한 통계 관련 프로젝트 진행'
    ],
    isOnline: false,
    isOffline: true,
    location: '서울특별시 송파구',
    hourlyRate: {
      min: 22000,
      max: 32000
    }
  },
  {
    id: 4,
    sex: '여',
    grade: '고등학교 3학년',
    targetMajor: '금융학과',
    summary: [
      '경제/금융 교과목 심화 학습 및 내신 성적 향상',
      '금융 관련 독서토론 및 보고서 작성 능력 향상',
      '금융 관련 교내/외 활동 및 대회 참가 경험 쌓기',
      '금융학과 입시 전형별 맞춤 전략 수립',
      '생활기록부 기재 가능한 금융 관련 프로젝트 진행'
    ],
    isOnline: true,
    isOffline: true,
    location: '경기도 성남시 분당구',
    hourlyRate: {
      min: 28000,
      max: 38000
    }
  }
];

const MentorCard: React.FC<{ mentor: typeof mockMentors[0] }> = ({ mentor }) => {
  return (
    <div className="mentor-card">
      <div className="mentor-image">
        <img src={mentor.image} alt={mentor.name} />
      </div>
      <div className="mentor-info">
        <h3>{mentor.name} ({mentor.sex})</h3>
        <p className="mentor-grade">{mentor.grade}</p>
        <p className="mentor-university">{mentor.university} {mentor.major}</p>
        <div className="mentor-summary">
          {mentor.summary.map((item, index) => (
            <p key={index}>{item}</p>
          ))}
        </div>
        <div className="mentor-details">
          <p className="mentor-type">
            {mentor.isOnline && mentor.isOffline ? '대면/비대면' :
              mentor.isOnline ? '비대면' : '대면'}
            {mentor.isOffline && mentor.location && (
              <span className="mentor-location"> ({mentor.location})</span>
            )}
          </p>
          <p className="mentor-rate">
            시급: {mentor.hourlyRate.min.toLocaleString()}원 ~ {mentor.hourlyRate.max.toLocaleString()}원
          </p>
        </div>
      </div>
    </div>
  );
};

const MenteeCard: React.FC<{ mentee: typeof mockMentees[0] }> = ({ mentee }) => {
  return (
    <div className="mentee-card">
      <div className="mentee-info">
        <h3>{mentee.grade} ({mentee.sex})</h3>
        <p className="mentee-major">지망학과: {mentee.targetMajor}</p>
        <div className="mentee-summary">
          {mentee.summary.map((item, index) => (
            <p key={index}>{item}</p>
          ))}
        </div>
        <div className="mentee-details">
          <p className="mentee-type">
            {mentee.isOnline && mentee.isOffline ? '대면/비대면' :
              mentee.isOnline ? '비대면' : '대면'}
            {mentee.isOffline && mentee.location && (
              <span className="mentee-location"> ({mentee.location})</span>
            )}
          </p>
          <p className="mentee-rate">
            희망 시급: {mentee.hourlyRate.min.toLocaleString()}원 ~ {mentee.hourlyRate.max.toLocaleString()}원
          </p>
        </div>
      </div>
    </div>
  );
};

const MentoringPage: React.FC = () => {
  const [isMentorView, setIsMentorView] = useState(true);

  return (
    <div className="mentoring-page">
      <div className="toggle-container">
        <button
          className={`toggle-button ${isMentorView ? 'active' : ''}`}
          onClick={() => setIsMentorView(true)}
        >
          멘토 찾기
        </button>
        <button
          className={`toggle-button ${!isMentorView ? 'active' : ''}`}
          onClick={() => setIsMentorView(false)}
        >
          멘티 찾기
        </button>
      </div>

      <div className="content-container">
        {isMentorView ? (
          <div className="mentor-list">
            {mockMentors.map(mentor => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        ) : (
          <div className="mentee-list">
            {mockMentees.map(mentee => (
              <MenteeCard key={mentee.id} mentee={mentee} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentoringPage; 