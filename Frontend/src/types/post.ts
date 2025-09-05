import { User } from './user';

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  likes: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  postId: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
}

export interface PostFormData {
  title: string;
  content: string;
  tags?: string[];
}
