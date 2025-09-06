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
  const quizId = location.state?.quizId;
  const score = location.state?.score;
  const totalQuestions = location.state?.totalQuestions;
  
  const [attemptData, setAttemptData] = useState(null);
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
    loadLeaderboard();
  }, [attemptId, navigate]);

  const loadAttemptData = async () => {
    try {
      const response = await attemptAPI.reviewAttempt(attemptId);
      if (response.success) {
        setAttemptData(response.data);
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
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading results...</div>
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

  if (!attemptData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">No attempt data available</div>
      </div>
    );
  }

  return (
    <>
      <div className="grid h-[90vh] w-full m-auto grid-cols-[1fr_2.5fr] justify-center items-center px-25 bg-[#f5f6f9] shadow-2xs">
        <div className="h-full w-full rounded-2xl grid grid-rows-[1fr_2.5fr] gap-5 p-5 ">
          <div className="h-full w-full rounded-2xl shadow-[var(--box_shadow)] p-5 grid grdo-rows-2 items-center justify-center">
            <h2 className="font-bold text-center text-2xl text-[#041b43]">
              Score
            </h2>
            <p className="font-bold text-center text-5xl text-[#041b43] place-self-start">
              {attemptData.score} / {attemptData.totalQuestions}
            </p>
          </div>
          <div className="h-full w-full rounded-2xl shadow-[var(--box_shadow)] p-5  grid grdo-rows-2 items-center justify-center">
            <h2 className="font-bold text-2xl text-center text-[#041b43]">
              Correct Answers
            </h2>
            <div className="max-h-full box-border">
              <DoughnutChart
                answered={attemptData.totalQuestions}
                result={attemptData.score}
                length={attemptData.totalQuestions}
              />
            </div>
          </div>
        </div>
        <div className="h-full w-full rounded-2xl grid grid-rows-[1.5fr_2fr] gap-5 p-5 ">
          <div className="h-full w-full rounded-2xl shadow-[var(--box_shadow)] p-5">
            <h2 className="font-bold text-2xl text-[#041b43]">
              Time Spent in each Question
            </h2>
            <div className="max-h-full w-full pt-10 box-border relative ">
              <LineChart quesTimer={attemptData.responses?.map(r => r.timeSpent) || []} />
            </div>
          </div>
          <div className="h-full w-full rounded-2xl shadow-[var(--box_shadow)] p-5">
            <h2 className="font-bold text-2xl text-[#041b43]">Leaderboard</h2>
            <div className="mt-4 max-h-64 overflow-y-auto">
              {leaderboard.length > 0 ? (
                leaderboard.map((entry, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">{entry.username}</span>
                    <span className="text-sm text-gray-600">{entry.score}/{entry.totalQuestions}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No leaderboard data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <h1 className="font-bold text-5xl text-center text-[#041b43] m-5 mt-10">
        Review your Answers
      </h1>
      <div className=" w-full m-auto justify-center items-center px-25 bg-[#f5f6f9] shadow-2xl">
        <Review attemptData={attemptData} />
      </div>
    </>
  );
};
const Review = ({ attemptData }) => {
  const { quiz, responses } = attemptData;
  function title(index, question, userAnswer, isCorrect) {
    const correctAnswerImg = "src/assets/correct.png";
    const wrongAnswerImg = "src/assets/incorrect.png";

    return (
      <div className="flex flex-col w-full">
        <span className="flex flex-row items-center-safe gap-2">
          <img
            src={isCorrect ? correctAnswerImg : wrongAnswerImg}
            className="w-6 h-6"
            alt=""
          />
          <h2 className="text-xl text-center font-bold text-gray-800 pr-10">
            Question {index}
          </h2>
          <div className="">
            <h2 className="text-xl font-bold text-gray-800 "> {question.question} </h2>
            <p className="text-sm text-gray-500">Your answer: {userAnswer || "Not answered"}</p>
          </div>
        </span>
      </div>
    );
  }
  return (
    <>
      {quiz && responses && (
        <div className="h-full w-full rounded-2xl shadow-[var(--box_shadow)] p-10">
          {quiz.questions.map((question, idx) => {
            const userResponse = responses.find(r => r.questionIndex === idx);
            const userAnswer = userResponse?.selectedOption !== null ? 
              question.options[userResponse.selectedOption] : null;
            const isCorrect = userResponse?.selectedOption === question.answer;
            
            return (
              <Accordion
                title={title(idx + 1, question, userAnswer, isCorrect)}
                isright={isCorrect}
                key={idx}
              >
                <div className="flex flex-col gap-5">
                  <span className="flex flex-row">
                    <img
                      src="src/assets/correct.png"
                      className="w-5 h-5 mr-1"
                      alt=""
                    />{" "}
                    <p className="text-green-600 font-bold">
                      Correct Answer : &nbsp;
                    </p>
                    {question.options[question.answer]}
                  </span>
                  <span className="flex flex-row">
                    <img
                      src="src/assets/timetaken.png"
                      className="w-5 h-5 mr-1"
                      alt=""
                    />{" "}
                    <p className=" font-bold">Time Taken : &nbsp;</p>
                    {userResponse?.timeSpent || 0} sec
                  </span>
                  <span className="flex flex-row">
                    💡
                    <p className="font-bold whitespace-nowrap ">
                      Explanation : &nbsp;
                    </p>
                    <p className="flex flex-wrap">
                      {question.explanation || "No explanation available."}
                    </p>
                  </span>
                </div>
              </Accordion>
            );
          })}
        </div>
      )}
    </>
  );
};
