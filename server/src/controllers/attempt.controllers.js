import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import Quiz from "../models/quiz.model.js";
import Attempt from "../models/attempt.model.js";

const getQuizForAttempt = asyncHandler(async (req, res) => {
    const { quizId } = req.params;

    if (!mongoose.isValidObjectId(quizId)) {
        throw new ApiError(400, "Invalid Quiz ID.");
    }

    const quiz = await Quiz.findById(quizId).select("-questions.answer -questions.explanation");

    if (!quiz) {
        throw new ApiError(404, "Quiz not found.");
    }

    return res.status(200).json(new ApiResponse(200, "Quiz fetched successfully for attempt.", { quiz }));
});

const submitAttempt = asyncHandler(async (req, res) => {
    const { quizId } = req.params;
    const { answers, timeTaken } = req.body;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(quizId)) {
        throw new ApiError(400, "Invalid Quiz ID.");
    }

    if (!answers || !Array.isArray(answers)) {
        throw new ApiError(400, "Answers must be an array.");
    }

    if (timeTaken === undefined || typeof timeTaken !== 'number') {
        throw new ApiError(400, "timeTaken must be a number.");
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        throw new ApiError(404, "Quiz not found.");
    }

    let score = 0;
    quiz.questions.forEach((question, index) => {
        if (question.answer === answers[index]) {
            score++;
        }
    });

    const attempt = new Attempt({
        userId,
        quizId,
        score,
        answers,
        timeTaken
    });

    await attempt.save();

    return res.status(201).json(new ApiResponse(201, "Quiz attempt submitted successfully.", {
        attemptId: attempt._id,
        score,
        totalQuestions: quiz.questions.length,
    }));
});

const getLeaderboard = asyncHandler(async (req, res) => {
    const { quizId } = req.params;

    if (!mongoose.isValidObjectId(quizId)) {
        throw new ApiError(400, "Invalid Quiz ID.");
    }

    const leaderboard = await Attempt.find({ quizId })
        .sort({ score: -1, timeTaken: 1 })
        .limit(10)
        .populate("userId", "username");

    return res.status(200).json(new ApiResponse(200, "Leaderboard fetched successfully.", { leaderboard }));
});

const getAttemptHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const attempts = await Attempt.find({ userId })
        .populate("quizId", "title")
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, "Attempt history fetched successfully.", { attempts }));
});

const reviewAttempt = asyncHandler(async (req, res) => {
    const { attemptId } = req.params;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(attemptId)) {
        throw new ApiError(400, "Invalid Attempt ID.");
    }

    const attempt = await Attempt.findById(attemptId);

    if (!attempt) {
        throw new ApiError(404, "Attempt not found.");
    }

    if (attempt.userId.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to review this attempt.");
    }

    const quiz = await Quiz.findById(attempt.quizId);

    if (!quiz) {
        throw new ApiError(404, "Associated quiz not found.");
    }

    const review = quiz.questions.map((question, index) => ({
        question: question.question,
        options: question.options,
        userAnswer: attempt.answers[index],
        correctAnswer: question.answer,
        explanation: question.explanation
    }));

    return res.status(200).json(new ApiResponse(200, "Attempt review fetched successfully.", { review }));
});

export {
    getQuizForAttempt,
    submitAttempt,
    getLeaderboard,
    getAttemptHistory,
    reviewAttempt
};