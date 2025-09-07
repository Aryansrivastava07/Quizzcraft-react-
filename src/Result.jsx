import { useLocation, useNavigate } from "react-router-dom";
import {
  useEffect,
  useState,
  useCallback,
  react,
  useLayoutEffect,
  useMemo,
} from "react";
import { DoughnutChart, LineChart } from "./Components/Graphs.jsx";
import Accordion from "./Components/Accordion.jsx";
import { attemptAPI, isAuthenticated } from "./utils/api";

export const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const attemptId = location.state?.attemptId;
  const [responses, setResponses] = useState(null);
  const [timeSpent, setTimeSpent] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [score, setScore] = useState(null);
  const [totalQuestions,setTotalQuestions] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/auth/login");
      return;
    }
    
    if (!attemptId) {
      setError("No attempt ID provided");
      setLoading(false);
      return;
    }
    
    loadAttemptData();
  }, [attemptId, navigate]);

  const loadAttemptData = async () => {
    try {
      const response = await attemptAPI.reviewAttempt(attemptId);
      if (response.success) {
        setQuizId(response.data.quizId);
        setQuizData(response.data);
        setScore(response.data.score);
        setTotalQuestions(response.data.totalQuestions);
        setTimeSpent(response.data.timeSpent);
        setTimeTaken(response.data.timeTaken);
        setResponses(response.data.answers);
      } else {
        setError(response.message || "Failed to load attempt data");
      }
    } catch (error) {
      console.error("Error loading attempt data:", error);
      setError("Failed to load attempt data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadLeaderboard();
  }, [quizId]);

  const loadLeaderboard = async () => {
    if (!quizId) return;
    
    try {
      const response = await attemptAPI.getLeaderboard(quizId);
      if (response.success) {
        setLeaderboard(response.data.leaderboard || []);
      }
    } catch (error) {
      console.error("Error loading leaderboard:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f5f6f9] dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#041b43] mx-auto mb-4"></div>
          <div className="text-xl text-[#041b43] font-semibold dark:text-white">Loading results...</div>
          <div className="text-sm text-gray-600 mt-2">Fetching your quiz performance data</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f5f6f9] dark:bg-gray-950">
        <div className="text-center">
          <div className="text-red-500 text-xl font-semibold mb-2">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#041b43] text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-950">
      <div className="bg-slate-300 dark:bg-gray-950 text-gray-800 dark:text-white py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-[#041b43] dark:text-white">🎉 Quiz Performance</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">Your results are in!</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-semibold text-[#041b43] dark:text-white">{quizData?.quiz?.title || 'Quiz Complete'}</h2>
              <div className="flex gap-6 mt-2 text-sm text-gray-600 dark:text-gray-300">
                <span>📊 {totalQuestions} Questions</span>
                <span>⏱️ {Math.floor(timeTaken / 60)}m {timeTaken % 60}s</span>
                <span>🎯 {((score / totalQuestions) * 100).toFixed(1)}% Score</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid h-[90vh] w-full m-auto grid-cols-[1fr_2.5fr] justify-center items-center px-25 bg-gradient-to-t from-slate-100 to-slate-300 dark:from-gray-800 dark:to-gray-950 shadow-2xs">
        <div className="h-full w-full rounded-2xl grid grid-rows-[1fr_2.5fr] gap-5 p-5 ">
          <div className="h-full w-full rounded-2xl shadow-[var(--box_shadow)] dark:shadow-lg dark:shadow-[#0f1726]/50 p-5 grid grdo-rows-2 items-center justify-center bg-white dark:bg-[#0f1726]">
            <h2 className="font-bold text-center text-2xl text-[#041b43] dark:text-white">
              Score
            </h2>
            <p className="font-bold text-center text-5xl text-[#041b43] dark:text-white place-self-start">
              {score} / {totalQuestions}
            </p>
          </div>
          <div className="h-full w-full rounded-2xl shadow-[var(--box_shadow)] dark:shadow-lg dark:shadow-[#0f1726]/50 p-5  grid grdo-rows-2 items-center justify-center bg-white dark:bg-[#0f1726]">
            <h2 className="font-bold text-2xl text-center text-[#041b43] dark:text-white">
              Correct Answers
            </h2>
            <div className="max-h-full box-border">
              <DoughnutChart
                answered={totalQuestions}
                result={score}
                length={totalQuestions}
              />
            </div>
          </div>
        </div>
        <div className="h-full w-full rounded-2xl grid grid-rows-[1.5fr_2fr] gap-5 p-5 ">
          <div className="h-full w-full rounded-2xl shadow-[var(--box_shadow)] dark:shadow-lg dark:shadow-[#0f1726]/50 p-5 bg-white dark:bg-[#0f1726]">
            <h2 className="font-bold text-2xl text-[#041b43] dark:text-white">
              Time Spent in each Question
            </h2>
            <div className="max-h-full w-full pt-10 box-border relative ">
              <LineChart quesTimer={timeSpent || Array(totalQuestions).fill(0)} />
            </div>
          </div>
          <div className="h-full w-full rounded-2xl shadow-[var(--box_shadow)] dark:shadow-lg dark:shadow-[#0f1726]/50 p-5 bg-white dark:bg-[#0f1726]">
            <h2 className="font-bold text-2xl text-[#041b43] dark:text-white">Leaderboard</h2>
            <div className="mt-4 max-h-64 overflow-y-auto">
              {leaderboard.length > 0 ? (
                leaderboard.map((entry, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{entry.userId?.username || 'Anonymous'}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{entry.score}/{totalQuestions}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No leaderboard data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className=" py-6 px-8 mx-5 mt-10 mb-5 rounded-2xl ">
        <h1 className="font-bold text-5xl text-center text-[#041b43] dark:text-white">
          Review your Answers
        </h1>
      </div>
      <div className=" w-full m-auto justify-center items-center px-25 bg-gradient-to-b from-slate-100 to-slate-300 dark:from-gray-950 dark:to-gray-950 shadow-2xl">
        <Review quizData={quizData} responses={responses} timeSpent={timeSpent} />
      </div>
    </div>
  );
};
const Review = ({ quizData, responses, timeSpent }) => {
  
  // Early return if data is not available
  if (!quizData || !responses) {
    return (
      <div className="h-full w-full rounded-2xl shadow-[var(--box_shadow)] dark:shadow-lg dark:shadow-[#0f1726]/50 p-10 bg-white dark:bg-[#0f1726]">
        <p className="text-center text-gray-500 dark:text-gray-400">Loading review data...</p>
        <p className="text-center text-sm text-gray-400 dark:text-gray-500">QuizData: {quizData ? 'Available' : 'Missing'}</p>
        <p className="text-center text-sm text-gray-400 dark:text-gray-500">Responses: {responses ? 'Available' : 'Missing'}</p>
      </div>
    );
  }

  const { quiz } = quizData;
  
  // Additional check for quiz questions
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    console.log('Quiz questions check failed:', { quiz: !!quiz, questions: quiz?.questions?.length });
    return (
      <div className="h-full w-full rounded-2xl shadow-[var(--box_shadow)] dark:shadow-lg dark:shadow-[#0f1726]/50 p-10 bg-white dark:bg-[#0f1726]">
        <p className="text-center text-gray-500 dark:text-gray-400">No quiz questions available for review</p>
        <p className="text-center text-sm text-gray-400 dark:text-gray-500">Quiz: {quiz ? 'Available' : 'Missing'}</p>
        <p className="text-center text-sm text-gray-400 dark:text-gray-500">Questions: {quiz?.questions?.length || 0}</p>
      </div>
    );
  }
  function title(index, question, userAnswer, isCorrect) {
    const correctAnswerImg = "/correct.png";
    const wrongAnswerImg = "/incorrect.png";

    return (
      <div className="flex flex-col w-full">
        <span className="flex flex-row items-center-safe gap-2">
          <img
            src={isCorrect ? correctAnswerImg : wrongAnswerImg}
            className="w-6 h-6"
            alt=""
          />
          <h2 className="text-xl text-center font-bold text-gray-800 dark:text-gray-200 pr-10">
            Question {index}
          </h2>
          <div className="">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200"> {question.question} </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your answer: {userAnswer || "Not answered"}</p>
          </div>
        </span>
      </div>
    );
  }
  return (
    <div className="h-full w-full rounded-2xl shadow-[var(--box_shadow)] dark:shadow-lg dark:shadow-[#0f1726]/50 p-10 bg-white dark:bg-[#0f1726]">
      {quiz.questions.map((question, idx) => {
        // responses is now an array of answer indices, not objects
        const userSelectedOption = responses[idx]; // This is the selected option index
        const userAnswer = userSelectedOption !== null && userSelectedOption !== undefined ? 
          question.options[userSelectedOption] : null;
        const isCorrect = userSelectedOption === question.answer;
        
        // Get time spent from the separate timeSpent array (passed from parent)
        const timeSpentForQuestion = timeSpent && timeSpent[idx] ? timeSpent[idx] : 0;
        
        return (
          <Accordion
            title={title(idx + 1, question, userAnswer, isCorrect)}
            isright={isCorrect}
            key={idx}
          >
            <div className="flex flex-col gap-5">
              <span className="flex flex-row">
                <img
                  src="/correct.png"
                  className="w-5 h-5 mr-1"
                  alt=""
                />{" "}
                <p className="text-green-600 dark:text-green-400 font-bold">
                  Correct Answer : &nbsp;
                </p>
                <span className="text-gray-800 dark:text-gray-200">{question.options[question.answer]}</span>
              </span>
              <span className="flex flex-row">
                <img
                  src="/timetaken.png"
                  className="w-5 h-5 mr-1"
                  alt=""
                />{" "}
                <p className="font-bold text-gray-800 dark:text-gray-200">Time Taken : &nbsp;</p>
                <span className="text-gray-800 dark:text-gray-200">{timeSpentForQuestion} sec</span>
              </span>
              <span className="flex flex-row">
                💡
                <p className="font-bold whitespace-nowrap text-gray-800 dark:text-gray-200">
                  Explanation : &nbsp;
                </p>
                <p className="flex flex-wrap text-gray-700 dark:text-gray-300">
                  {question.explanation || "No explanation available."}
                </p>
              </span>
            </div>
          </Accordion>
        );
      })}
    </div>
  );
};
