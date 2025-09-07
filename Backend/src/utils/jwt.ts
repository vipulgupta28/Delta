import jwt from 'jsonwebtoken';
import { Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY!;

export interface TokenPayload {
  username: string;
  email: string;
  user_id: string;
}

export const createToken = (payload: TokenPayload): string => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is undefined. Check your .env file.');
  }
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '5h' });
};

export const setAuthCookie = (res: Response, token: string): void => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};
