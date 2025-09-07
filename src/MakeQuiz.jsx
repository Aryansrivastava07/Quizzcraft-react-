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
  const [isLoading, setIsLoading] = useState(false);
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
          {!quizData && !isLoading && <Input setChatMessages={setChatMessages} pdfs={pdfs} setIsLoading={setIsLoading} />}
          {isLoading && (
            <div className="flex justify-center items-center p-6">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  Generating Quiz...
                </span>
              </div>
            </div>
          )}
          {quizData && !isLoading && (
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex flex-wrap justify-center gap-3 mb-4">
                <button
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition hover:scale-105 flex items-center gap-2"
                  onClick={() => {
                    showQuestion({
                      setChatMessages,
                      presets,
                    });
                  }}
                >
                  <span>📋</span>
                  View Quiz
                </button>
                <button
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition hover:scale-105 flex items-center gap-2"
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
                  <span>🎯</span>
                  Attempt Quiz
                </button>
                <button 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition hover:scale-105 flex items-center gap-2"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/QuizPlatform?id=${quizId}`);
                    alert("Quiz link copied to clipboard!");
                  }}
                >
                  <span>🔗</span>
                  Share Quiz
                </button>
                <button 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition hover:scale-105 flex items-center gap-2"
                  onClick={() => {
                    setQuizData(null);
                    setQuizId(null);
                    setAnskey([]);
                    setChatMessages([
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
                  }}
                >
                  <span>🆕</span>
                  Create New Quiz
                </button>
              </div>
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
