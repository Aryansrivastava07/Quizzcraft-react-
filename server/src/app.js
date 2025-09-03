import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());


import quizCreation from './routes/quiz.routes.js';
import user from './routes/user.routes.js';

app.use('/api/v1/user',user);
app.use('/api/v1/quiz',quizCreation);

export { app };