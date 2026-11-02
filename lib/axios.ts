import axios from 'axios';
import Cookies from 'js-cookie';

export const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:5000/api`;
  }
  return 'http://localhost:5000/api';
};

export const getFileUrl = (filePath: string | null | undefined): string => {
  if (!filePath) return '';
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) return filePath;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '')
    : typeof window !== 'undefined'
      ? `http://${window.location.hostname}:5000`
      : 'http://localhost:5000';
  const cleanPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
  return `${baseUrl}${cleanPath}`;
};

export const axiosInstance = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to inject the token and dynamically update baseURL for mobile devices
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_API_URL) {
      config.baseURL = `http://${window.location.hostname}:5000/api`;
    }
    // Only attempt to read localStorage if we are in the browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token refresh on 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loop if refresh endpoint itself returned 401
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh-token') &&
      !originalRequest.url?.includes('/auth/login') &&
      typeof window !== 'undefined'
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const res = await axios.post(`${getApiUrl()}/auth/refresh-token`, { refreshToken });
          if (res.data?.accessToken) {
            localStorage.setItem('accessToken', res.data.accessToken);
            if (res.data?.refreshToken) {
              localStorage.setItem('refreshToken', res.data.refreshToken);
            }
            originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshErr) {
          // Refresh token also invalid/expired -> clear storage and redirect
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(refreshErr);
        }
      } else {
        localStorage.clear();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
