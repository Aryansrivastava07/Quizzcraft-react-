import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { GoogleGenAI, createUserContent, createPartFromUri } from "@google/genai";
import fs from "fs";



const quizCreation = asyncHandler(async (req, res, next) => {
    const uploads = req.files;

    if (!uploads || uploads.length === 0) {
        throw new ApiError(400, "No files were uploaded.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Use Promise.all with .map to handle asynchronous operations in a loop correctly.
    // .forEach does not wait for async operations to complete.
    const uploadPromises = uploads.map(element =>
        ai.files.upload({
            file: element.path,
            config: { mimeType: element.mimetype },
        })
    );


    const geminiUploads = await Promise.all(uploadPromises);

    const fileParts = geminiUploads.map(file => createPartFromUri(file.uri, file.mimeType));
    const prompt = `
    From the following PDF content, generate a quiz.
        Instructions:
        - Create exactly 10 multiple-choice questions (MCQs).
        - Ensure all questions and answers are directly answerable from the provided PDF content.
        - For each MCQ, provide 4 distinct answer options.
        - title of quiz should be in title key
        - Output the quiz as a JSON array in questions key . Each object in the array must follow this structure:
        {
          "question": "The question text",
          "type": "multiple_choice",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correct_answer": "Corerct option index (0-3)"
        }
        - Do not include any introductory or concluding remarks—only output the JSON array.
    `;
    const countTokensResponse = await ai.models.countTokens({
        model: "gemini-2.5-flash",
        contents: createUserContent([...fileParts, prompt]),
    });
    console.log(countTokensResponse.totalTokens);
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: createUserContent([...fileParts, prompt]),
    });


    uploads.forEach(file => fs.unlinkSync(file.path));

    const deletePromises = geminiUploads.map(element =>
        ai.files.delete({ name: element.name })
    );
    await Promise.all(deletePromises);

    // Correctly access the generated text from the response
    const generatedText = response.candidates[0].content.parts[0].text;
    
    let quizData;

    try {
        // Gemini can sometimes wrap the JSON in ```json ... ```, so we clean it up before parsing.
        const cleanedJsonString = generatedText.replace(/^```json\s*/, '').replace(/```$/, '').trim();
        quizData = JSON.parse(cleanedJsonString);
    } catch (error) {
        console.error("Failed to parse Gemini response as JSON:", error);
        console.error("Raw Gemini Response:", generatedText);
        throw new ApiError(500, "Failed to parse the quiz data from the AI service. Please try again.");
    }

    console.log(quizData);
    // Fix the syntax error and pass arguments correctly to ApiResponse
    return res.status(200).json(new ApiResponse(
        200,
        "Quiz generated successfully.",
        { quiz: quizData }
    ));
});

export { quizCreation };