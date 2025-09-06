import { useState } from "react";
import { useQuiz } from "./QuizContext";
// import { AddQuestionForm } from "./Somewhere/AddQuestionForm"; // adjust import as needed

const handleFileChange = (event, type, { setUploadedFiles }) => {
  const newFiles = Array.from(event.target.files);

  setUploadedFiles((prev) => {
    const existingSignatures = prev[type].map(
      (f) => `${f.name}-${f.size}-${f.lastModified}`
    );

    const uniqueFiles = newFiles.filter((file) => {
      const signature = `${file.name}-${file.size}-${file.lastModified}`;
      return !existingSignatures.includes(signature);
    });

    if (uniqueFiles.length > 0) {
      const newFilesObj = { ...prev };
      uniqueFiles.forEach((file) => {
        newFilesObj[type] = [...newFilesObj[type], { name: file.name, file }];
      });
      return newFilesObj;
    } else {
      return prev; // no change
    }
  });

  event.target.value = null; // Reset input for re-selection
};

// This function returns the presets with the latest context values
export function useChatPresets(setChatMessages) {
  const {
    quizData,
    setQuizData,
    anskey,
    setAnskey,
    uploadedFiles,
    setUploadedFiles,
    // setChatMessages, // make sure this is in your context!
  } = useQuiz();

  return {
    Upload: {
      text: "Upload your files below",
      content: (
        <div className="flex flex-row gap-4 max-w-sm mx-auto mt-8">
          <div>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange(e, "pdf", { setUploadedFiles })}
              className="hidden"
              id="upload-pdf"
            />
            <label
              htmlFor="upload-pdf"
              className="block w-full text-center cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow"
            >
              Upload PDF
            </label>
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                handleFileChange(e, "image", { setUploadedFiles })
              }
              className="hidden"
              id="upload-image"
            />
            <label
              htmlFor="upload-image"
              className="block w-full text-center cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow"
            >
              Upload Image
            </label>
          </div>
          <div>
            <input
              type="file"
              accept="video/*"
              onChange={(e) =>
                handleFileChange(e, "video", { setUploadedFiles })
              }
              className="hidden"
              id="upload-video"
            />
            <label
              htmlFor="upload-video"
              className="block w-full text-center cursor-pointer bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded shadow"
            >
              Upload Video
            </label>
          </div>
        </div>
      ),
    },
    QuizData: {
      text: "Quiz Generated:",
      content: (
        <div className="quiz-display">
          {quizData && Array.isArray(quizData) &&
            quizData.map((question, qIndex) => (
              <div
                key={qIndex}
                className="question-block border p-4 mb-4 rounded-lg shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">
                    Question {qIndex + 1}: {question.question}
                  </h3>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                    onClick={() => {
                      setQuizData((prevQuizData) =>
                        prevQuizData.filter((_, i) => i !== qIndex)
                      );
                      setAnskey((prevAnskey) =>
                        prevAnskey.filter((_, i) => i !== qIndex)
                      );
                    }}
                  >
                    Delete
                  </button>
                </div>
                <ul className="list-disc pl-5">
                  {question.options.map((option, oIndex) => (
                    <li
                      key={oIndex}
                      className={`mb-1 ${
                        oIndex === anskey[qIndex]
                          ? "text-green-600 font-medium"
                          : ""
                      }`}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          <button
            className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              setChatMessages((prev) => [
                ...prev,
                {
                  text: "Add a new question:",
                  content: (
                    <AddQuestionForm
                      setChatMessages={setChatMessages}
                      setQuizData={setQuizData}
                      setAnskey={setAnskey}
                    />
                  ),
                },
              ]);
            }}
          >
            Add New Question
          </button>
        </div>
      ),
    },
    AddQuestion: {
      text: "Add a new question:",
      content: (
        <AddQuestionForm
          setChatMessages={setChatMessages}
          setQuizData={setQuizData}
          setAnskey={setAnskey}
        />
      ),
    },
  };
}
const AddQuestionForm = ({ setChatMessages, setQuizData, setAnskey }) => {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newQuestion = {
      question: questionText,
      options: options.filter((option) => option.trim() !== ""), // Filter out empty options
    };

    setQuizData((prevQuizData) => [...prevQuizData, newQuestion]);
    setAnskey((prevAnskey) => [...prevAnskey, correctAnswer]);

    setChatMessages((prev) => [
      ...prev,
      { text: "Question added successfully!", content: null },
    ]);

    // Clear form
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(0);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded-lg shadow-md mt-4"
    >
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="question"
        >
          Question:
        </label>
        <input
          type="text"
          id="question"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Options:
        </label>
        {options.map((option, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
            />
            <input
              type="radio"
              name="correctAnswer"
              checked={correctAnswer === index}
              onChange={() => setCorrectAnswer(index)}
            />
            <label className="ml-1 text-gray-700 text-sm">Correct</label>
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Add Question
      </button>
    </form>
  );
};
