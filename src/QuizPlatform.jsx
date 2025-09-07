import { useEffect, useState, useCallback, react } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { attemptAPI, isAuthenticated } from "./utils/api";
import { useTheme } from "./Components/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
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

const TogledarkMode = (darkMode) => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", darkMode ? "dark" : "light");
};

export const QuizPlatform = () => {
  const isTabActive = useIsTabActive();
  const location = useLocation();
  const navigate = useNavigate();
  const quizId = location.state?.quizId;
  const { darkMode, setDarkMode } = useTheme();
  
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attemptId, setAttemptId] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(true);
  const [mishapCount, setMishapCount] = useState(0);
  
  const questions = quizData?.questions?.map(q => q.question) || [];
  const options = quizData?.questions?.map(q => q.options) || [];
  const length = questions.length || 10;

  const [answered, setAnswered] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [Responses, setResponses] = useState([
    ...Array(length).fill(4),
  ]);
  const [quesTimer, setQuesTimer] = useState([]);
  const [timeSpentPerQuestion, setTimeSpentPerQuestion] = useState(
    [...Array(length)].map(() => 0)
  );

  // Fullscreen functionality
  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  const showFlashMessage = (message) => {
    setWarningMessage(message);
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 3000);
  };

  const handleMishap = (message) => {
    setMishapCount(prevCount => {
      const newCount = prevCount + 1;
      
      if (newCount >= 3) {
        showFlashMessage("🚨 Too many violations! Quiz will be auto-submitted.");
        setTimeout(() => {
          handleSubmit();
        }, 2000);
      } else {
        showFlashMessage(`${message} (Warning ${newCount}/3)`);
      }
      
      return newCount;
    });
  };

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
    
    // Don't auto-enter fullscreen, let user click the prompt
    // setTimeout(() => {
    //   enterFullscreen();
    // }, 1000);
  }, [quizId, navigate]);

  const loadQuizData = async () => {
    try {
      const response = await attemptAPI.startQuiz(quizId);
      if (response.success) {
        setQuizData(response.data.quiz);
        setAttemptId(response.data.attemptId);
        console.log('Quiz data loaded:', response.data.quiz);
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

  // Initialize timer when quiz data is loaded
  useEffect(() => {
    if (quizData && quizData.questions) {
      const timePerQuestion = quizData.timeLimit || 30; // Default to 30 if not specified
      const timers = Array(quizData.questions.length).fill(timePerQuestion);
      setQuesTimer(timers);
      console.log('Timer initialized with:', timePerQuestion, 'seconds per question');
    }
  }, [quizData]);

  const handleSubmit = async () => {
    // if (!attemptId) {
    //   setError("No attempt ID available");
    //   return;
    // }

    try {
      const attemptData = {
        answers: Responses,
        timeSpent: timeSpentPerQuestion,
      };
      
      console.log('Time spent per question:', timeSpentPerQuestion);
      console.log('Attempt data being sent:', attemptData);

      const response = await attemptAPI.submitAttempt(quizId, attemptData);
      // console.log(response);
      if (response.success) {
        navigate("/Result", {
          state: {
            attemptId: response.data.attemptId,
            // quizId: quizId,
            // score: response.data.score,
            // totalQuestions: length
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
  // ✅ Fullscreen and activity monitoring
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
      
      if (isNowFullscreen) {
        // Entered fullscreen - hide the prompt
        setShowFullscreenPrompt(false);
      } else {
        // Exited fullscreen - show prompt again and count as mishap
        setShowFullscreenPrompt(true);
        handleMishap("⚠️ Please stay in fullscreen mode during the quiz!");
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleMishap("⚠️ Tab switching detected! Please focus on the quiz.");
      }
    };

    const handleWindowBlur = () => {
      handleMishap("⚠️ Window lost focus! Please stay focused on the quiz.");
    };

    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 || e.clientX <= 0 || 
          e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        handleMishap("⚠️ Mouse left the window! Please stay within the quiz area.");
      }
    };

    const handleKeyDown = (e) => {
      // Prevent common shortcuts that could be used to cheat
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        handleMishap("⚠️ Alt+Tab is disabled during the quiz!");
      }
      if (e.ctrlKey && (e.key === 't' || e.key === 'n' || e.key === 'w')) {
        e.preventDefault();
        handleMishap("⚠️ Opening new tabs/windows is disabled during the quiz!");
      }
      if (e.key === 'F11') {
        e.preventDefault();
        showFlashMessage("⚠️ Please use the quiz interface to manage fullscreen!");
      }
    };

    // Add event listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // ✅ Prevent tab close without confirmation
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "Are you sure you want to leave? Your quiz progress may be lost.";
      return "Are you sure you want to leave? Your quiz progress may be lost.";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // ✅ Timer logic with tab visibility check
  useEffect(() => {
    if (!isTabActive || quesTimer.length === 0) {
      return;
    }

    const timer = setInterval(() => {
      setQuesTimer((prevTimers) => {
        const newTimers = [...prevTimers];
        setCurrentQuestionIndex(currentIdx => {
          if (newTimers[currentIdx] > 0) {
            newTimers[currentIdx] -= 1;
            
            // Track time spent on current question
            setTimeSpentPerQuestion(prev => {
              const newTimeSpent = [...prev];
              newTimeSpent[currentIdx] += 1;
              return newTimeSpent;
            });
          } else {
            // Time's up for current question, move to next
            if (currentIdx < length - 1) {
              return currentIdx + 1;
            }
          }
          return currentIdx;
        });
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTabActive, quesTimer.length, length]);

  // ... your JSX return ...
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-950">
        <div className="text-xl text-gray-800 dark:text-white">Loading quiz...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-950">
        <div className="text-red-500 dark:text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  if (!quizData || questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-950">
        <div className="text-xl text-gray-800 dark:text-white">No quiz data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-black dark:to-gray-900">
      {/* New Navbar */}
      <nav className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <img src="src/assets/logo2.png" className="h-10 w-auto" alt="QuizCraft" />
            <span className="text-2xl font-bold text-gray-800 dark:text-white">QuizCraft</span>
            
            {/* Dark Mode Toggle */}
            <div 
              className="relative w-12 h-8 rounded-full p-1 bg-gray-200 dark:bg-gray-700 transition-all duration-300 ease-in-out cursor-pointer ml-4" 
              style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset" }}
              onClick={() => {
                setDarkMode(!darkMode);
                TogledarkMode(!darkMode);
              }}
            >
              <div
                className="toggle absolute top-1/2 -left-0 h-9 w-9 rounded-full bg-gray-600 dark:bg-[#242c3c] -translate-y-1/2 -translate-x-3 dark:translate-x-5 rotate-0 dark:rotate-720 transition-all duration-300 grid place-items-center"
                style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset" }}
              >
                {darkMode ? (
                  <FontAwesomeIcon icon={faMoon} className="text-white" />
                ) : (
                  <FontAwesomeIcon icon={faSun} className="text-amber-300" />
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-600">
              {quizData.title}
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <img
              src="https://ui-avatars.com/api/?name=User&background=6366f1&color=fff"
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-indigo-200 dark:border-indigo-400"
            />
          </div>
        </div>
      </nav>

      {/* Fullscreen Entry Prompt */}
      {showFullscreenPrompt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl border-2 border-indigo-200 dark:border-indigo-600">
            <div className="text-6xl mb-4">🖥️</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Enter Fullscreen Mode
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              For the best quiz experience and to prevent distractions, please enter fullscreen mode.
            </p>
            <p className="text-sm text-red-600 dark:text-red-400 mb-6 font-medium">
              ⚠️ Warning: You have {3 - mishapCount} attempts remaining. Quiz will auto-submit after 3 violations.
            </p>
            <button
              onClick={() => {
                enterFullscreen();
              }}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Enter Fullscreen & Start Quiz
            </button>
          </div>
        </div>
      )}

      {/* Flash Warning Message */}
      {showWarning && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 bg-red-500 text-white px-6 py-3 rounded-lg shadow-2xl border-2 border-red-600 animate-pulse">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⚠️</span>
            <span className="font-bold text-lg">{warningMessage}</span>
          </div>
        </div>
      )}

      <div className="flex max-w-7xl mx-auto px-6 gap-6 py-6">
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
        <div className="flex-1 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-600 p-6 shadow-xl max-h-[85vh] overflow-y-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Progress</span>
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                {currentQuestionIndex + 1} of {length} questions
              </span>
            </div>
            <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${((currentQuestionIndex + 1) / length) * 100}%`,
                }}
              ></div>
            </div>
            <div className="text-center mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {Math.round(((currentQuestionIndex + 1) / length) * 100)}% Complete
              </span>
            </div>
          </div>
          <div className="bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-600">
            <div className="flex flex-row mb-6 text-sm text-gray-500 dark:text-gray-400 justify-between items-center bg-gray-50 dark:bg-gray-800/50 px-4 py-2 rounded-xl">
              <div className="flex items-center space-x-2">
                <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-full text-xs font-medium">
                  Question {currentQuestionIndex + 1} of {length}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 dark:text-gray-300">⏱️</span>
                <span className="font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-full text-sm">
                  {quesTimer[currentQuestionIndex]}s
                </span>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white leading-relaxed">
              {questions[currentQuestionIndex]}
            </h2>
            {options[currentQuestionIndex]?.map((option, index) => (
              <div
                key={index}
                id={`option-${index}`}
                className={`flex items-center mb-3 cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                  Responses[currentQuestionIndex] === index
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-400 shadow-lg transform scale-[1.01]"
                    : "bg-white/80 dark:bg-gray-600/80 text-gray-800 dark:text-white border-gray-200 dark:border-gray-500 hover:border-indigo-300 dark:hover:border-indigo-400 hover:shadow-md"
                } ${
                 quesTimer[currentQuestionIndex] === 0
                   ? "opacity-50 cursor-not-allowed pointer-events-none"
                   : "opacity-100 hover:transform hover:scale-[1.005]"
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
                <div className="flex items-center space-x-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    Responses[currentQuestionIndex] === index
                      ? "border-white bg-white"
                      : "border-gray-400 dark:border-gray-300"
                  }`}>
                    {Responses[currentQuestionIndex] === index && (
                      <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                    )}
                  </div>
                  <label htmlFor={`option-${index}`} className="text-lg font-medium flex-1">
                    {option}
                  </label>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-semibold shadow-lg hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:transform hover:scale-105"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <div className="flex space-x-3">
              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === length - 1}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:transform hover:scale-105"
              >
                Next
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:transform hover:scale-105"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Submit Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const LeftPanel = ({
  answered,
  length,
  currentQuestionIndex,
  handleQuestionSelect,
  Responses,
  quesTimer,
}) => {
  return (
    <div className="w-80 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-600 p-6 shadow-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          📊 Quiz Overview
        </h2>
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 p-4 rounded-xl border border-indigo-100 dark:border-gray-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Answered</span>
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{answered} / {length}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(answered / length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Questions</h3>
        <div className="grid grid-cols-5 gap-3 max-h-96 overflow-y-auto">
          {[...Array(length)].map((_, idx) => (
            <button
              key={idx}
              className={`w-12 h-12 rounded-xl font-bold text-sm transition-all duration-300 border-2 ${
                currentQuestionIndex === idx
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-400 shadow-lg transform scale-110"
                  : Responses[idx] <= 3
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-400 shadow-md hover:shadow-lg"
                  : "bg-white/80 dark:bg-gray-600/80 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-500 hover:border-indigo-300 dark:hover:border-indigo-400 hover:shadow-md"
              } ${
                quesTimer[idx] === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:transform hover:scale-105 cursor-pointer"
              }`}
              onClick={handleQuestionSelect(idx)}
              disabled={quesTimer[idx] === 0}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-300">Current Question:</span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            {currentQuestionIndex + 1} of {length}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-600 dark:text-gray-300">Completion:</span>
          <span className="font-bold text-green-600 dark:text-green-400">
            {Math.round((answered / length) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};
