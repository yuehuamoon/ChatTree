import apiClient from './client';
import type { ApiResult } from '@/types';

export const recommentApi = {
  getRecommendIds(): Promise<ApiResult<number[]>> {
    return apiClient.get('/recomment');
  },
};
