import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to inject the token
axiosInstance.interceptors.request.use(
  (config) => {
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

// Add a response interceptor to handle errors globally (e.g. 401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // We can handle token refresh logic here in the future if needed
    // For now, if 401, we just return the error and the component can redirect to login
    return Promise.reject(error);
  }
);
