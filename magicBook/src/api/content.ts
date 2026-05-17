import apiClient from './client';
import type { ApiResult, ContentArticle } from '@/types';

export const contentApi = {
  getMyList(email: string): Promise<ApiResult<ContentArticle[]>> {
    return apiClient.post('/content/myList', { email });
  },
  publish(publishData: {
    email: string;
    title: string;
    content: string;
    images: string;
    tags?: string;
    status?: number;
    privacy?: number;
  }): Promise<ApiResult<null>> {
    return apiClient.post('/content/publish', publishData);
  },
  deleteContent(id: number): Promise<ApiResult<null>> {
    return apiClient.post('/content/delete', { id });
  },
  getById(id: number, email: string): Promise<ApiResult<ContentArticle>> {
    return apiClient.post('/content/getById', { id, email });
  },
  getMeetList(page = 1, size = 10): Promise<ApiResult<ContentArticle[]>> {
    return apiClient.post('/content/meetList', { page, size });
  },
  getCount(): Promise<ApiResult<number>> {
    return apiClient.get('/content/count');
  },
};
