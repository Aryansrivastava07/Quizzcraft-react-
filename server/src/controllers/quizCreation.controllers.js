import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { GoogleGenAI, createUserContent, createPartFromUri } from "@google/genai";
import mongoose from "mongoose";
import Quiz from "../models/quiz.model.js";
import fs from "fs";



const quizCreation = asyncHandler(async (req, res, next) => {
    const uploads = req.files;
    const userPrompt = req.body.prompt;
    // console.log(req.user);
    if ((!uploads || uploads.length === 0) && !userPrompt) {
        throw new ApiError(400, "Please provide either files or a text prompt to generate a quiz.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    let fileParts = [];
    let geminiUploads = [];

    if (uploads && uploads.length > 0) {
        // Use Promise.all with .map to handle asynchronous operations in a loop correctly.
        // .forEach does not wait for async operations to complete.
        const uploadPromises = uploads.map(element =>
            ai.files.upload({
                file: element.path,
                config: { mimeType: element.mimetype },
            })
        );

        geminiUploads = await Promise.all(uploadPromises);

        // Wait for all files to become active. Videos and large files can take time to process.
        const activeFilesPromises = geminiUploads.map(async (uploadedFile) => {
            console.log(`File ${uploadedFile.name} uploaded. Waiting for it to be processed...`);
            let file = uploadedFile;
            const startTime = Date.now();
            const timeout = 180000; // 3 minutes timeout for processing
            const pollInterval = 5000; // Poll every 5 seconds

            while (file.state === 'PROCESSING' && (Date.now() - startTime < timeout)) {
                await new Promise(resolve => setTimeout(resolve, pollInterval));
                try {
                    file = await ai.files.get({ name: uploadedFile.name });
                    console.log(`Current state of ${file.name}: ${file.state}`);
                } catch (e) {
                    console.error(`Error getting file status for ${uploadedFile.name}`, e);
                    throw new ApiError(500, `Could not get status for file ${uploadedFile.name}.`);
                }
            }

            if (file.state !== 'ACTIVE') {
                console.error(`File ${file.name} did not become ACTIVE. Final state: ${file.state}`);
                throw new ApiError(400, `File ${file.name} could not be processed. Its state is ${file.state}.`);
            }
            
            console.log(`File ${file.name} is now ACTIVE.`);
            return file;
        });
        const activeFiles = await Promise.all(activeFilesPromises);
        fileParts = activeFiles.map(file => createPartFromUri(file.uri, file.mimeType));
    }

    const quizCreationSchema = {
        type: 'object',
        properties: {
            quiz: {
                type: 'object',
                description: "The quiz object containing a title and a list of questions.",
                properties: {
                    title: {
                        type: 'string',
                        description: "The title of the quiz, related to the topic."
                    },
                    questions: {
                        type: 'array',
                        description: "A list of quiz questions.",
                        items: {
                            type: 'object',
                            properties: {
                                question: {
                                    type: 'string',
                                    description: "The question for the user."
                                },
                                options: {
                                    type: 'array',
                                    description: "A list of 4 multiple choice options.",
                                    items: {
                                        type: 'string'
                                    }
                                },
                                answer: {
                                    type: 'integer',
                                    description: "The 0 index of the correct answer in the options array."
                                },
                                explanation:{
                                    type: 'string',
                                    description : "A clear and concise explanation of why the answer is correct."
                                }
                            },
                            required: ["question", "options", "answer", "explanation"]
                        }
                    }
                },
                required: ["title", "questions"]
            }
        },
        required: ["quiz"]
    };
    const prompt = `
    Generate a quiz based on the provided content.
    User's specific instructions: ${userPrompt}
    
    General Instructions:
    - Create exactly 10 multiple-choice questions (MCQs).
    - Ensure all questions and answers are directly answerable from the provided content.
    - For each MCQ, provide 4 distinct answer options.
    - The overall quiz should have a relevant title.
    - Each question must have a concise explanation for the correct answer.
    - Output the quiz as a single JSON object. The root object must have a "quiz" key.
    - The "quiz" object must contain a "title" and a "questions" array.
    - Each object in the "questions" array must follow this exact structure:
      {
        "question": "The full question text.",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "answer": "The string of the correct option.",
        "explanation": "A brief explanation of why this is the correct answer."
      }
    - Do not include any introductory or concluding remarks—only output the JSON object.
    `;
    const countTokensResponse = await ai.models.countTokens({
        model: "gemini-2.5-flash",
        contents: createUserContent([...fileParts, prompt]),
        config: {
            responseMimeType: "application/json",
            responseSchema: quizCreationSchema,
        },
    });
    console.log(countTokensResponse.totalTokens);
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: createUserContent([...fileParts, prompt]),
        config: {
            responseMimeType: "application/json",
            responseSchema: quizCreationSchema,
        },
    });


    uploads.forEach(file => fs.unlinkSync(file.path));

    const deletePromises = geminiUploads.map(element =>
        ai.files.delete({ name: element.name })
    );
    await Promise.all(deletePromises);

    // Correctly access the generated text from the response
    const generatedText = response.text;
    const quizData = JSON.parse(generatedText);

    const quiz = new Quiz({
        title: quizData.quiz.title,
        questions: quizData.quiz.questions,
        creatorId: req.user._id,
    });
    await quiz.save();


    // let quizData;

    // try {
    //     // Gemini can sometimes wrap the JSON in ```json ... ```, so we clean it up before parsing.
    //     const cleanedJsonString = generatedText.replace(/^```json\s*/, '').replace(/```$/, '').trim();
    //     quizData = JSON.parse(cleanedJsonString);
    // } catch (error) {
    //     console.error("Failed to parse Gemini response as JSON:", error);
    //     console.error("Raw Gemini Response:", generatedText);
    //     throw new ApiError(500, "Failed to parse the quiz data from the AI service. Please try again.");
    // }

    console.log(quizData);
    // Fix the syntax error and pass arguments correctly to ApiResponse
    return res.status(200).json(new ApiResponse(
        200,
        "Quiz generated successfully.",
        { response: {quizId : quiz._id} }
    ));
});

const getQuiz = asyncHandler(async (req, res, next) => {
    const { id } = req.query;
    // console.log(id);
    if (!id) {
        throw new ApiError(400, "Quiz id is required.");
    }
    const quiz = await Quiz.findById(id);
    if (!quiz) {
        throw new ApiError(404, "Quiz not found.");
    }
    return res.status(200).json(new ApiResponse(
        200,
        "Quiz fetched successfully.",
        { quiz }
    ));
})

const updateQuiz = asyncHandler(async (req, res, next) => {
    const { id, updatedQuiz: rawUpdatedQuiz } = req.body;
    const userId = req.user._id;

    if (!id || !mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "A valid quiz ID is required.");
    }

    if (!rawUpdatedQuiz) {
        throw new ApiError(400, "Updated quiz data is required.");
    }

    let updatedQuiz;
    if (typeof rawUpdatedQuiz === 'string') {
        try {
            updatedQuiz = JSON.parse(rawUpdatedQuiz);
        } catch (error) {
            throw new ApiError(400, "Invalid JSON format for updatedQuiz.");
        }
    } else {
        updatedQuiz = rawUpdatedQuiz;
    }

    // The incoming `_id` for subdocuments might be in an EJSON-like format
    // like `{ $oid: '...' }`, which Mongoose's ObjectId caster doesn't
    // handle directly. This preprocesses the `_id`s into plain strings.
    if (updatedQuiz.questions && Array.isArray(updatedQuiz.questions)) {
        for (const question of updatedQuiz.questions) {
            if (question._id != null && typeof question._id === 'object' && question._id.$oid != null) {
                question._id = question._id.$oid;
            }
        }
    }

    const quiz = await Quiz.findById(id);

    if (!quiz) {
        throw new ApiError(404, "Quiz not found.");
    }

    if (quiz.creatorId.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to update this quiz.");
    }

    quiz.title = updatedQuiz.title;
    quiz.questions = updatedQuiz.questions;
    const savedQuiz = await quiz.save();

    return res.status(200).json(new ApiResponse(200, "Quiz updated successfully.", { quiz: savedQuiz }));
})

const deleteQuiz = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;

    if (!id || !mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "A valid quiz ID is required.");
    }

    const quiz = await Quiz.findById(id);

    if (!quiz) {
        throw new ApiError(404, "Quiz not found.");
    }

    if (quiz.creatorId.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to delete this quiz.");
    }

    await quiz.deleteOne();

    return res.status(200).json(new ApiResponse(200, "Quiz deleted successfully.", {}));
});


export { quizCreation,
    getQuiz,
    updateQuiz,
    deleteQuiz
 };