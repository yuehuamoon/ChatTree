import axios from 'axios';
import { getToken, removeToken, removeUser } from '@/utils/storage';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data && typeof data.code !== 'undefined') {
      if (data.code === 200) {
        return data;
      }
      if (data.code === 401) {
        removeToken();
        removeUser();
        return Promise.reject(new Error(data.msg || 'Unauthorized'));
      }
      return Promise.reject(new Error(data.msg || data.message || 'Operation failed'));
    }
    return data;
  },
  (error) => {
    if (error.response) {
      const msg = error.response.data?.msg || error.response.statusText || error.message;
      return Promise.reject(new Error(msg));
    }
    return Promise.reject(new Error(error.message || 'Network error'));
  },
);

export default apiClient;
