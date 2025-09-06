require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const testjson = require("../src/dump/test2.json"); // Import test JSON for debugging

const app = express();
const port = 5000;

// Configure Multer for file uploads (store in memory for direct processing)
const upload = multer({ storage: multer.memoryStorage() });

// Enable CORS for your React app
app.use(cors());
app.use(express.json()); // For parsing JSON bodies if needed

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" }); // Or gemini-1.5-pro for more complex tasks

let answerKeys = {
  // Global variable to store answer keys
}; // Global variable to store answer keys
app.post("/send-otp", async (req, res) => {
  console.log("OTP sent");
  return res.status(200).json({ message: "161521" });
});


app.post("/generate-quiz", upload.any(), async (req, res) => {
  console.log("Files received:");
  //   const fileSummary = req.files.map(file => ({
  //   fieldname: file.fieldname,
  //   originalname: file.originalname,
  //   mimetype: file.mimetype,
  //   size: file.size,
  // }));

  // res.json({
  //   message: "Received everything!",
  //   fields: req.body,
  //   files: fileSummary,
  // });
  answerKeys["quiz-1752351409162"] = [1, 1, 2, 2, 1, 1, 1, 2, 1, 2]; // Merge with existing answer keys
  return res.json({ data: testjson, answerKey: answerKeys["quiz-1752351409162"] }); // Return the test JSON directly for debugging
});

app.post("/upload-pdf", upload.single("pdf"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No PDF file uploaded." });
  }

  if (req.file.mimetype !== "application/pdf") {
    return res.status(400).json({ message: "Only PDF files are allowed." });
  }
  // If you want to use the test JSON for debugging, uncomment the line below
  // Store the answer key in the global variable
  // answerKeys['quiz-1752351409162'] = [1, 1, 2, 2, 1, 1, 1, 2, 1, 2]; // Merge with existing answer keys
  // return res.json({ data: testjson }); // Return the test JSON directly for debugging

  console.log("Pdf file received:", req.file.originalname);
  try {
    const pdfBuffer = req.file.buffer;

    // Direct PDF input to Gemini
    const result = await model.generateContent([
      {
        text: `
        From the following PDF content, generate a quiz.
        Instructions:
        - Create exactly 10 multiple-choice questions (MCQs).
        - Ensure all questions and answers are directly answerable from the provided PDF content.
        - For each MCQ, provide 4 distinct answer options.
        - Output the quiz as a JSON array. Each object in the array must follow this structure:
        {
          "question": "The question text",
          "type": "multiple_choice",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correct_answer": "Corerct option index (0-3)"
        }
        - Do not include any introductory or concluding remarks—only output the JSON array.

        `,
      },
      {
        inlineData: {
          data: pdfBuffer.toString("base64"), // Convert buffer to base64
          mimeType: req.file.mimetype,
        },
      },
    ]);

    // Extract the text content from the Gemini response
    const responseText = result.response.text();

    // --- START OF CORRECTION ---
    let cleanedResponseText = responseText.trim(); // Remove leading/trailing whitespace

    // Check if the response starts and ends with JSON Markdown fences
    if (cleanedResponseText.startsWith("```json")) {
      cleanedResponseText = cleanedResponseText.substring("```json".length);
    }
    if (cleanedResponseText.endsWith("```")) {
      cleanedResponseText = cleanedResponseText.substring(
        0,
        cleanedResponseText.length - "```".length
      );
    }
    cleanedResponseText = cleanedResponseText.trim(); // Trim again after removing fences
    // --- END OF CORRECTION ---

    // Attempt to parse the JSON string
    let dataToSend = { quizId: "", quiz: [] };
    let quiz = [];
    const quizId = `quiz-${Date.now()}`;
    dataToSend.quizId = quizId;
    try {
      quiz = JSON.parse(cleanedResponseText); // Use the cleaned text here
      // Add unique id to each quiz question
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", parseError);
      console.error(
        "Raw Gemini Response (after cleaning attempt):",
        cleanedResponseText
      ); // Log cleaned text for debugging
      console.error("Original Gemini Response:", responseText); // Also log original for comparison
      return res.status(500).json({
        message:
          "Could not parse quiz from Gemini response. Check console for raw response and parsing error.",
        rawResponseSnippet: responseText.substring(0, 200) + "...", // Provide a snippet in the client error
      });
    }
    // Store the asnwer key with Quiz ID in another array
    const answerKey = quiz.map((q) => ({
      correct_answer: q.correct_answer,
    }));
    // console.log("Answer Key:", answerKey);
    // Store the answer key in the global variable
    answerKeys[quizId] = { answerKey }; // Merge with existing answer keys
    // Remove the answer key and Type from the quiz
    quiz = quiz.map((q) => {
      const { correct_answer, type, ...rest } = q; // Destructure to remove correct_answer
      return rest; // Return the rest of the object
    });
    dataToSend.quiz = quiz;
    console.log("Quiz Data:", dataToSend.quiz);
    console.log("Answer Key:", answerKey);
    res.json({ data: dataToSend });
  } catch (error) {
    console.error("Error in /generate-quiz:", error);
    res
      .status(500)
      .json({ message: "Server error generating quiz.", error: error.message });
  }
});

app.get("/answer-key", (req, res) => {
  //match the quiz ID from the request query
  const quizId = req.query.quizId;
  if (!quizId) {
    return res.status(400).json({ message: "Quiz ID is required." });
  }
  // // Filter the answer keys for the specific quiz ID
  // const answerKey = answerKeys.filter((key) => key.quizId === quizId);
  // // Return the answer key

  // if (Object.keys(answerKey).length === 0) {
  //   return res.status(404).json({ message: "No answer key available." });
  // }
  // // Return the answer key as a JSON response
  // console.log("Answer Key:", answerKey);
  // res.json({ answerKey });
  const answers = answerKeys[quizId];
  console.log("Answer Key for Quiz ID:", quizId, answers);
  if (answers) {
    res.json({ answers });
  } else {
    res.status(404).json({ error: "Quiz ID not found" });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
