import { useEffect, useState, useCallback, react } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { attemptAPI, isAuthenticated } from "./utils/api";
// import { Questions, Options } from './dump/TestQuiz';

const useIsTabActive = () => {
  const [isTabVisible, setIsTabVisible] = useState(true);

  const handleVisibilityChange = useCallback(() => {
    setIsTabVisible(document.visibilityState === "visible");
  }, []);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  return isTabVisible;
};

export const QuizPlatform = () => {
  const isTabActive = useIsTabActive();
  const location = useLocation();
  const navigate = useNavigate();
  const quizId = location.state?.quizId;
  
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attemptId, setAttemptId] = useState(null);
  
  const questions = quizData?.questions?.map(q => q.question) || [];
  const options = quizData?.questions?.map(q => q.options) || [];
  const length = questions.length || 10;

  const [answered, setAnswered] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [Responses, setResponses] = useState([
    ...Array(length).fill(4),
  ]);
  const [quesTimer, setQuesTimer] = useState(
    [...Array(length)].map(() => 30)
  );

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/auth/login");
      return;
    }
    
    if (!quizId) {
      setError("No quiz ID provided");
      setLoading(false);
      return;
    }
    
    loadQuizData();
  }, [quizId, navigate]);

  const loadQuizData = async () => {
    try {
      const response = await attemptAPI.startQuiz(quizId);
      if (response.success) {
        setQuizData(response.data.quiz);
        setAttemptId(response.data.attemptId);
      } else {
        setError(response.message || "Failed to load quiz");
      }
    } catch (error) {
      console.error("Error loading quiz:", error);
      setError("Failed to load quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!attemptId) {
      setError("No attempt ID available");
      return;
    }

    try {
      const attemptData = {
        responses: Responses.map((response, index) => ({
          questionIndex: index,
          selectedOption: response === 4 ? null : response,
          timeSpent: 30 - quesTimer[index]
        })),
        totalTimeSpent: quesTimer.reduce((acc, time) => acc + (30 - time), 0)
      };

      const response = await attemptAPI.submitAttempt(quizId, attemptData);
      
      if (response.success) {
        navigate("/Result", {
          state: {
            attemptId: attemptId,
            quizId: quizId,
            score: response.data.score,
            totalQuestions: length
          },
        });
      } else {
        setError(response.message || "Failed to submit quiz");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setError("Failed to submit quiz. Please try again.");
    }
  };

  function handleOptionSelect(index) {
    return () => {
      const newOptions = [...Responses];
      if (Responses[currentQuestionIndex] !== index) {
        // If the option is different, update the answered count
        newOptions[currentQuestionIndex] = index;
        setResponses(newOptions);
        if (Responses[currentQuestionIndex] === 4) {
          setAnswered(answered + 1);
        }
        document.getElementById(`option-${index}`).childNodes[0].checked = true;
      }
      // If the option is the same, do not change answered count
      else {
        setAnswered(answered - 1);
        newOptions[currentQuestionIndex] = 4; // Reset to unselected
        setResponses(newOptions);
        document.getElementById(
          `option-${index}`
        ).childNodes[0].checked = false; // Uncheck the radio button
      }
    };
  }
  function handleQuestionSelect(index) {
    return () => {
      setCurrentQuestionIndex(index);
      // Reset the radio button selection for the new question
      const selectedOption = Responses[index];
      if (selectedOption !== 4) {
        document.getElementById(
          `option-${selectedOption}`
        ).childNodes[0].checked = true;
      } else {
        // If no option is selected, uncheck all radio buttons
        document.querySelectorAll(".option").forEach((radio) => {
          radio.checked = false;
        });
      }
    };
  }
  // ✅ Prevent tab close without confirmation

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // ✅ Timer logic with tab visibility check
  useEffect(() => {
    if (!isTabActive) {
      return;
    }

    const timer = setInterval(() => {
      setQuesTimer((prevTimers) => {
        const newTimers = [...prevTimers];
        if (newTimers[currentQuestionIndex] > 0) {
          newTimers[currentQuestionIndex] -= 1;
        } else {
          if (currentQuestionIndex < length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
          }
        }
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, length, isTabActive]);

  // ... your JSX return ...
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading quiz...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!quizData || questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">No quiz data available</div>
      </div>
    );
  }

  return (
    <>
      <NavBar quizName={quizData.title} />
      <div className="flex h-[calc(100vh-72px)]">
        {/* /* Left Panel */}
        <LeftPanel
          answered={answered}
          length={length}
          currentQuestionIndex={currentQuestionIndex}
          handleQuestionSelect={handleQuestionSelect}
          Responses={Responses}
          quesTimer={quesTimer}
        />
        {/* Main Content */}
        <div className="w-3/4 p-8 overflow-y-auto ">
          {/* Progress Bar */}
          <div className="flex flex-row items-center justify-center m-5">
            <p className="">
              {currentQuestionIndex + 1} of {length}
            </p>
            <div className="relative w-[80%] align-middle h-2 bg-gray-200 rounded ml-2">
              <div
                className="absolute top-0 left-0 h-2 bg-blue-500 rounded"
                style={{
                  width: `${((1 + currentQuestionIndex) / length) * 100}%`,
                  transition: "width 0.3s ease-in-out",
                }}
              ></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex flex-row mb-6 text-sm text-gray-500 justify-between px-5">
              <p className="">
                Question {currentQuestionIndex + 1} of {length}
              </p>
              <p>
                Time Remaining:{" "}
                {/* Display the timer for the current question */}
                <span className="font-bold">
                  {quesTimer[currentQuestionIndex]} seconds
                </span>
              </p>
            </div>
            <h2 className="text-2xl font-bold mb-4 pl-5">
              {questions[currentQuestionIndex]}
            </h2>
            {options[currentQuestionIndex]?.map((option, index) => (
              <div
                key={index}
                id={`option-${index}`}
                className={`flex items-center mb-3 cursor-pointer p-2 rounded ${
                  Responses[currentQuestionIndex] === index
                    ? "bg-blue-500"
                    : "bg-gray-200"
                } hover:bg-blue-400 transition-colors
               ${
                 quesTimer[currentQuestionIndex] === 0
                   ? "opacity-50 cursor-not-allowed pointer-events-none"
                   : "opacity-100"
               }
              `}
                onClick={handleOptionSelect(index)}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  className="mr-3 option hidden"
                  onChange={handleOptionSelect(index)}
                />
                <label htmlFor={`option-${index}`} className="text-lg px-2">
                  {option}
                </label>
              </div>
            ))}
          </div>
          <div className="flex items-center mt-6 m-auto justify-evenly gap-4 px-10">
            <div className="flex items-center mt-6 m-auto justify-center gap-4 ">
              <button
                type="button"
                onClick={handleQuestionSelect(currentQuestionIndex - 1)}
                className={`mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors ${
                  currentQuestionIndex === 0
                    ? "opacity-50 cursor-not-allowed "
                    : ""
                }`}
                disabled={currentQuestionIndex === 0}
              >
                {" "}
                Previous
              </button>
              <button
                type="button"
                onClick={handleQuestionSelect(currentQuestionIndex + 1)}
                className={`mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors ${
                  currentQuestionIndex === length - 1
                    ? "opacity-50 cursor-not-allowed "
                    : ""
                }`}
                disabled={currentQuestionIndex === length - 1}
              >
                {" "}
                Next
              </button>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className={`mt-6 bg-[#e63d35] font-bold text-white px-4 py-2 rounded hover:bg-[#ae2929] transition-colors cursor-pointer`}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
const NavBar = ({ quizName = "Quiz" }) => {
  return (
    <nav className="w-full flex items-center justify-between px-8 shadow bg-amber-10">
      <div className="font-bold text-xl">
        <img src="src/assets/logo2.png" className="w-18" alt="" />
      </div>
      <div className="flex-1 flex justify-center">
        <span className="text-lg font-semibold">{quizName}</span>
      </div>
      <div>
        <img
          src="https://ui-avatars.com/api/?name=User"
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </nav>
  );
};

const LeftPanel = ({
  answered,
  length,
  currentQuestionIndex,
  handleQuestionSelect,
  Responses,
  quesTimer,
}) => {
  return (
    <div className="w-1/4 bg-gray-100 p-6 flex flex-col gap-4 rounded-e-4xl shadow-lg">
      <div>
        <h2 className="font-semibold text-lg mb-10 text-center">
          Quiz Progress
        </h2>
        <p className="px-5 mb-4">
          Answered: <span className="font-bold">{answered}</span> / {length}
        </p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(50px,1fr))] justify-items-start gap-5 max-w-[95%] p-5 bg-white border-2 rounded-2xl shadow-sm mx-auto">
        {[...Array(length)].map((_, idx) => (
          <div
            key={idx}
            className={`w-12 h-12 flex items-center justify-center rounded-xl border-2 text-sm font-semibold 
                    ${
                      currentQuestionIndex !== idx && Responses[idx] <= 3
                        ? "bg-green-500 text-white border-green-600 "
                        : currentQuestionIndex === idx
                        ? `bg-blue-300 shadow-2xl border-blue-600 ${
                            Responses[idx] <= 3
                              ? "opacity-100"
                              : "opacity-80"
                          }
                           `
                        : "bg-gray-200 text-gray-700 border-gray-300 "
                    } ${
              Responses[idx] <= 3
                ? "hover:bg-green-600 hover:text-white"
                : "hover:bg-blue-400 hover:text-white"
            }
              ${
                quesTimer[idx] === 0
                  ? "opacity-50 cursor-not-allowed pointer-events-none": "opacity-100"
              }      `}
            style={{
              justifyContent: "center",
              display: "flex",
            }}
            onClick={handleQuestionSelect(idx)}
          >
            {idx + 1}
          </div>
        ))}
      </div>
    </div>
  );
};
