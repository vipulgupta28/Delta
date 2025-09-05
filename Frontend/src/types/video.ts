import { User } from './user';
import { Comment } from './post';

export interface Video {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  duration: number;
  author: User;
  views: number;
  likes: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  isLiked?: boolean;
  category?: 'shorts' | 'long-form' | 'live';
}

export interface VideoUpload {
  title: string;
  description?: string;
  file: File;
  tags?: string[];
  category: 'shorts' | 'long-form';
}

export interface LiveStream {
  id: string;
  title: string;
  description?: string;
  streamKey: string;
  isLive: boolean;
  viewerCount: number;
  startedAt: string;
  author: User;
}
