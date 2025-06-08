// 토큰 관련 키 상수
const ACCESS_TOKEN_KEY = 'accessToken';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_ROLE_KEY = 'userRole';
const USER_ID_KEY = 'userId';

const TOKEN_EXPIRY_HOURS = 24;

// 로컬 스토리지에서 토큰 가져오기
export const getAccessToken = async (): Promise<string | null> => {
  try {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);

    if (!token || !expiryTime) {
      return null;
    }

    const now = new Date();
    const expiry = new Date(expiryTime);

    if (now > expiry) {
      // Token has expired, remove it
      await removeAccessToken();
      alert('로그인 만료');
      return null;
    }

    return token;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

export const setAccessToken = async (token: string): Promise<void> => {
  try {
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + TOKEN_EXPIRY_HOURS);

    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toISOString());
  } catch (error) {
    console.error('Error setting access token:', error);
    throw error;
  }
};

export const removeAccessToken = async (): Promise<void> => {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  } catch (error) {
    console.error('Error removing access token:', error);
    throw error;
  }
};

// Check token expiry
export const checkTokenExpiry = async (): Promise<void> => {
  try {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);

    if (token && expiryTime) {
      const now = new Date();
      const expiry = new Date(expiryTime);

      if (now > expiry) {
        await removeAccessToken();
        alert('로그인 만료');
      }
    }
  } catch (error) {
    console.error('Error checking token expiry:', error);
  }
};

export async function getRefreshToken(): Promise<string | null> {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function removeRefreshToken(): void {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export async function getUserRole(): Promise<string | null> {
  return localStorage.getItem(USER_ROLE_KEY);
}

export function setUserRole(role: string): void {
  localStorage.setItem(USER_ROLE_KEY, role);
}

export function removeUserRole(): void {
  localStorage.removeItem(USER_ROLE_KEY);
}

export async function getUserId(): Promise<string | null> {
  return localStorage.getItem(USER_ID_KEY);
}

export function setUserId(id: string): void {
  localStorage.setItem(USER_ID_KEY, id);
}

export function removeUserId(): void {
  localStorage.removeItem(USER_ID_KEY);
}

// 모든 인증 관련 데이터 제거
export function clearAuthData(): void {
  removeAccessToken();
  removeRefreshToken();
  removeUserRole();
  removeUserId();
} 