import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));
app.use('/avatars', express.static('public/avatars'));
app.use(cookieParser());


import quizCreation from './routes/quiz.routes.js';
import user from './routes/user.routes.js';
import attempt from './routes/attempt.routes.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

app.use('/api/v1/user',user);
app.use('/api/v1/quiz',quizCreation);
app.use('/api/v1/attempt',attempt);

// Error handling middleware (must be last)
app.use(errorHandler);

export { app };