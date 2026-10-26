import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; // npm i jwt-decode
import useAuthStore from '../store/useAuthStore';

export const ACCESS_COOKIE = 'authTokenBasma';
export const REFRESH_COOKIE = 'refreshTokenBasma';

const API_URL = import.meta.env.VITE_API_URL;

const cookieOpts = {
  secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
  sameSite: 'strict',
};

export const setAccessToken = (token) =>
  Cookies.set(ACCESS_COOKIE, token, { ...cookieOpts, expires: 7 });
export const setRefreshToken = (token) =>
  Cookies.set(REFRESH_COOKIE, token, { ...cookieOpts, expires: 30 });
export const clearTokens = () => {
  Cookies.remove(ACCESS_COOKIE);
  Cookies.remove(REFRESH_COOKIE);
};

// Keep the default Content-Type if useCrud relies on it for FormData
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'multipart/form-data' },
});

// Endpoints where 401 means "wrong credentials", not "expired token"
const NO_REFRESH_URLS = ['/auth/login', '/auth/refresh-token'];
const isAuthUrl = (url = '') => NO_REFRESH_URLS.some((u) => url.includes(u));

const forceLogout = () => {
  clearTokens();
  useAuthStore.getState().logout();
  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

const isExpiringSoon = (token, bufferSec = 60) => {
  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 - Date.now() < bufferSec * 1000;
  } catch {
    return true;
  }
};

// ── single-flight refresh ────────────────────────────────────────────────
let refreshPromise = null;

const refreshAccessToken = () => {
  if (!refreshPromise) {
    const refreshToken = Cookies.get(REFRESH_COOKIE);
    if (!refreshToken) return Promise.reject(new Error('No refresh token'));

    // Plain axios: skips our interceptors (no loops) and sends JSON
    refreshPromise = axios
      .post(
        `${API_URL}/auth/refresh-token`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then((res) => {
        const newToken = res.data?.data?.accessToken || res.data?.accessToken;
        if (!newToken) throw new Error('No access token in refresh response');
        setAccessToken(newToken);
        useAuthStore.setState({ token: newToken }); // keep store in sync
        return newToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

// ── request: attach token (refresh first if about to expire) ─────────────
api.interceptors.request.use(async (config) => {
  let token = Cookies.get(ACCESS_COOKIE);

  if (token && !isAuthUrl(config.url) && isExpiringSoon(token)) {
    try {
      token = await refreshAccessToken();
    } catch {
      // the response interceptor will handle the 401 / logout
    }
  }

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── response: on 401, refresh once and replay ────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    if (status !== 401 || !original || isAuthUrl(original.url) || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      const newToken = await refreshAccessToken();
      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (refreshError) {
      forceLogout();
      return Promise.reject(refreshError);
    }
  }
);

export default api;