import apiClient from './client';

export const ossApi = {
  // Backend returns raw URL string (not wrapped in Result)
  upload(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/oss/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }) as unknown as Promise<string>;
  },
};
