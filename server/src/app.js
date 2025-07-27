import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import quizCreation from './routes/quizCreation.routes.js';
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

app.use('/api/v1/quiz',quizCreation);

export { app };