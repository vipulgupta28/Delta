import { Post } from './post';
import { Video } from './video';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  followers: number;
  following: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  posts: Post[];
  videos: Video[];
  isFollowing?: boolean;
}

export interface UserStats {
  totalPosts: number;
  totalVideos: number;
  totalLikes: number;
  totalViews: number;
}
