export interface User {
  email: string;
  username: string;
  nickname: string;
  avatar: string;
  status: number | null;
}

export interface ContentArticle {
  id: number;
  title: string;
  content: string;
  email: string;
  username: string;
  nickname: string;
  status: number;
  privacy: number;
  images: string;
  tags?: string;
  createDate: number | string;
  commentCount: number;
  likeCount: number;
}

export interface ApiResult<T = unknown> {
  code: number;
  msg: string;
  data: T;
}

export interface Page<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}
