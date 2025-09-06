import { useState, useEffect, use } from "react";
import { handleFileUpload } from "./utils/HandleFile";
import { Input } from "./Components/QuizInput";
import { Chat } from "./Components/ChatBubble";
import { useQuiz } from "./Components/QuizContext";
import { useChatPresets } from "./Components/ChatPresets";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

export const MakeQuiz = () => {
  const navigate = useNavigate();
  const data = useLocation();
  const { isLoggedIn } = useAuth();
  const {
    quizData,
    setQuizData,
    anskey,
    setAnskey,
    uploadedFiles,
    setUploadedFiles,
    quizId,
    setQuizId,
  } = useQuiz();
  const [pdfs, setPdfs] = useState([]);
  const [chatMessages, setChatMessages] = useState([
    { text: "Welcome to the quiz creator!", content: null },
    {
      text: "Need help? Visit our docs",
      content: (
        <a href="/docs" className="text-blue-600 underline">
          View Docs
        </a>
      ),
    },
  ]);
  const presets = useChatPresets(setChatMessages);
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth/login');
      return;
    }
    
    const chatContainer = document.querySelector(".overflow-y-auto");
    if (chatContainer) {
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatMessages, isLoggedIn, navigate]);

  useEffect(() => {
    if (uploadedFiles.pdf.length > 0) {
      // console.log(uploadedFiles);
      handleFileUpload({
        fileUploaded: uploadedFiles.pdf[uploadedFiles.pdf.length - 1],
        setPdfs,
        setChatMessages,
      });
    }
  }, [uploadedFiles.pdf.length]);

  return (
    <div className="h-[90vh] grid grid-cols-[1fr_4fr] transition-all duration-150 bg-gradient-to-b from-slate-100 to-slate-300 dark:from-gray-900 dark:to-gray-950">
      <div className="shadow-2xl"></div>
      <div className="h-[90vh] shadow-2xl grid grid-rows-[1fr_auto] overflow-hidden">
        <div className="overflow-y-auto scroll-auto transition-all duration-75">
          {chatMessages.map((msg, index) => (
            <Chat key={index} mes={msg.text}>
              {msg.content}
            </Chat>
          ))}
        </div>
        <div className="self-end">
          {!quizData && <Input setChatMessages={setChatMessages} pdfs={pdfs} />}
          {quizData && (
            <div className="flex justify-around mt-4">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  showQuestion({
                    setChatMessages,
                    presets,
                  });
                }}
              >
                View Quiz
              </button>
              <button
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  if (quizId) {
                    navigate("/QuizPlatform", {
                      state: {
                        quizId: quizId,
                      },
                    });
                  } else {
                    alert("No quiz ID available. Please create a quiz first.");
                  }
                }}
              >
                Attempt Quiz
              </button>
              <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                Share Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const showQuestion = ({ setChatMessages, presets }) => {
  setChatMessages((prev) => [...prev, presets["QuizData"]]);
};
