import apiClient from './client';
import type { ApiResult } from '@/types';

export const userApi = {
  login(email: string, password: string): Promise<ApiResult<string>> {
    return apiClient.post('/user/login', { email, password });
  },
  register(userData: {
    email: string;
    password: string;
    username: string;
    nickname: string;
  }): Promise<ApiResult<null>> {
    return apiClient.post('/user/register', userData);
  },
  deleteAccount(email: string): Promise<ApiResult<null>> {
    return apiClient.post('/user/delete', { email });
  },
  updateProfile(updateData: {
    email: string;
    nickname?: string;
    avatar?: string;
    intro?: string;
    privacy?: number;
    password?: string;
  }): Promise<ApiResult<null>> {
    return apiClient.post('/user/update', updateData);
  },
  getCount(): Promise<ApiResult<number>> {
    return apiClient.get('/user/count');
  },
};
