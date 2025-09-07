// Application Constants
export const APP_NAME = 'Delta';
export const APP_VERSION = '1.0.0';

// API Configuration
export const API_BASE_URL = "http://localhost:3000/api/v1";
export const API_TIMEOUT = 30000;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// File Upload
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Authentication
export const TOKEN_KEY = 'delta_token';
export const REFRESH_TOKEN_KEY = 'delta_refresh_token';
export const USER_KEY = 'delta_user';

// Video Categories
export const VIDEO_CATEGORIES = {
  SHORTS: 'shorts',
  LONG_FORM: 'long-form',
  LIVE: 'live',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PROFILE: '/profile',
  VIDEOS: '/videos',
  POSTS: '/posts',
  LIVE: '/live',
  CHANNELS: '/channels',
  INBOX: '/inbox',
  TRENDING: '/trending',
  RESEARCH: '/research',
  AI: '/ai',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
} as const;
