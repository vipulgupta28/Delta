import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY!;

export interface AuthenticatedRequest extends Request {
  user?: {
    username: string;
    email: string;
    user_id: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token' });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET) as any;
    req.user = data;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  
  if (token) {
    try {
      const data = jwt.verify(token, JWT_SECRET) as any;
      req.user = data;
    } catch (err) {
      // Token is invalid, but we continue without authentication
    }
  }
  
  next();
};
