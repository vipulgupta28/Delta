import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth';
import videoRoutes from './routes/videos';
import reactionRoutes from './routes/comments';
import commentRoutes from "./routes/comments";
import websocketRoutes from './routes/websocket';

import postsRoutes from "./routes/posts";
import profileRoutes from "./routes/profile"; 


// Load environment variables
dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware
app.use(express.json());

app.use(cookieParser());


// Routes
app.use('/api/v1', authRoutes);
app.use('/api/v1', videoRoutes);
app.use('/api/v1', reactionRoutes);
app.use('/api/v1', commentRoutes);
app.use('/api/v1', postsRoutes);
app.use('/api/v1', profileRoutes);
app.use('/api/v1', websocketRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
