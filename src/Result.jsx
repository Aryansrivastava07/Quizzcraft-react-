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

export const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const responses = location.state?.Responses;
  const quesTimer = location.state?.quesTimer || [];
  const quizId = location.state?.quizID;
  const answered = location.state?.answered;
  const questions = location.state?.questions;
  const options = location.state?.options;
  const length = quesTimer.length;
  const [result, setResult] = useState();
  const [correctAnswer, setCorrectAnswer] = useState();
  const [resultFetched, setresultFetched] = useState(false);
// console.log(responses)
  // Fetch the answer key from the server
  const fetchAnswerKey = async () => {
    // send a request to the server to get the answer key with the quiz ID
    if (!quizId) {
      console.error("Quiz ID is not available in the location state.");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/answer-key?quizId=${quizId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch answer key", response.statusText);
      }
      const data = await response.json();
      return data.answers;
    } catch (error) {
      console.error("Error fetching answer key:", error);
      return [];
    }
  };
  useEffect(() => {
    fetchAnswerKey()
      .then((data) => {
        setCorrectAnswer(data);
        // console.log("Correct Answers:", data);
        // if (responses && data) {
        //   const score = responses.reduce((acc, response, idx) => {
        //     return acc + (response === data.answerKey[idx] ? 1 : 0);
        //   }, 0);

        //   setResult(score);
        //   setresultFetched(true);
        // }
        // Calculate the score based on responses and correct answers
        // const score = fetchScore(data.answerKey);
        const answers = data;
        let score = 0;
        for (let i = 0; i < responses.length; i++) {
          if (responses[i] === answers[i]) {
            score++;
          }
        }
        setResult(score);
        setresultFetched(true);
      })
      .catch((error) => {
        console.error("Error in fetching answer key:", error);
      });
  }, [quizId]);

  return (
    <>
      <div className="grid h-[90vh] w-full m-auto grid-cols-[1fr_2.5fr] justify-center items-center px-25 bg-[#f5f6f9] shadow-2xs">
        <div className="h-full w-full rounded-2xl grid grid-rows-[1fr_2.5fr] gap-5 p-5 ">
          <div className="h-full w-full rounded-2xl shadow-[var(--box_shadow)] p-5 grid grdo-rows-2 items-center justify-center">
            <h2 className="font-bold text-center text-2xl text-[#041b43]">
              Score
            </h2>
            <p className="font-bold text-center text-5xl text-[#041b43] place-self-start">
              {result} / 10
            </p>
          </div>
          <div className="h-full w-full rounded-2xl shadow-[var(--box_shadow)] p-5  grid grdo-rows-2 items-center justify-center">
            <h2 className="font-bold text-2xl text-center text-[#041b43]">
              Correct Answers
            </h2>
            <div className="max-h-full box-border">
              {resultFetched && (
                <DoughnutChart
                  answered={answered}
                  result={result}
                  length={length}
                />
              )}
            </div>
          </div>
        </div>
        <div className="h-full w-full rounded-2xl grid grid-rows-[1.5fr_2fr] gap-5 p-5 ">
          <div className="h-full w-full rounded-2xl shadow-[var(--box_shadow)] p-5">
            <h2 className="font-bold text-2xl text-[#041b43]">
              Time Spent in each Question
            </h2>
            <div className="max-h-full w-full pt-10 box-border relative ">
              {resultFetched && <LineChart quesTimer={quesTimer} />}
            </div>
          </div>
          <div className="h-full w-full rounded-2xl shadow-[var(--box_shadow)] p-5">
            <h2 className="font-bold text-2xl text-[#041b43]">Leaderboard</h2>
          </div>
        </div>
      </div>
      <h1 className="font-bold text-5xl text-center text-[#041b43] m-5 mt-10">
        Review your Answeres
      </h1>
      <div className=" w-full m-auto justify-center items-center px-25 bg-[#f5f6f9] shadow-2xl">
        {resultFetched && <Review
          questions={questions}
          options={options}
          correctAnswer={correctAnswer}
          responses={responses}
          quesTimer={quesTimer}
        />}
      </div>
    </>
  );
};
const Review = ({
  questions,
  options,
  correctAnswer,
  responses,
  quesTimer,
}) => {
  function title(index, ques, ans) {
    // const correctAnswerImg = "https://st.depositphotos.com/12141488/52464/i/450/depositphotos_524641226-stock-photo-raster-yes-icon-illustration.jpg";
    // const correctAnswerImg = "https://cdn3.iconfinder.com/data/icons/flat-actions-icons-9/792/Tick_Mark_Circle-512.png";
    const correctAnswerImg = "src/assets/correct.png";

    // const wrongAnswerImg = "https://static.vecteezy.com/system/resources/previews/014/313/137/non_2x/red-cross-icon-for-things-that-should-not-be-done-or-forbidden-png.png";
    const wrongAnswerImg = "src/assets/incorrect.png";

    return (
      <div className="flex flex-col w-full">
        <span className="flex flex-row items-center-safe gap-2">
          <img
            src={
              (responses[index - 1] === (correctAnswer[index - 1].correct_answer - '0')
                ? correctAnswerImg
                : wrongAnswerImg)
            }
            className="w-6 h-6"
            alt=""
          />
          <h2 className="text-xl text-center font-bold text-gray-800 pr-10">
            Question {index}
          </h2>
          <div className="">
            <h2 className="text-xl font-bold text-gray-800 "> {ques} </h2>
            <p className="text-sm text-gray-500">Your answer: {ans}</p>
          </div>
        </span>
      </div>
    );
  }
  return (
    <>
     {/* <div className="h-screen bg-amber-500 w-full"></div> */}
      {correctAnswer && (
        <div className="h-full w-full rounded-2xl shadow-[var(--box_shadow)] p-10">
          {questions.map((ques, idx) => (
            <Accordion
              title={title(idx + 1, ques, options[idx][responses[idx]])}
              isright={responses[idx] === correctAnswer[idx].correct_answer - '0'}
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
                    Correct Asswer : &nbsp;
                  </p>
                  {options[idx][(correctAnswer[idx].correct_answer - '0')]}
                </span>
                <span className="flex flex-row">
                  <img
                    src="src/assets/timetaken.png"
                    className="w-5 h-5 mr-1"
                    alt=""
                  />{" "}
                  <p className=" font-bold">Time Taken : &nbsp;</p>
                  {30 - quesTimer[idx]} sec
                </span>
                <span className="flex flex-row">
                  {/* <img
                    src="src/assets/timetaken.png"
                    className="w-5 h-5 mr-1"
                    alt=""
                  />{" "} */}
                  💡
                  <p className="font-bold whitespace-nowrap ">
                    Explanation : &nbsp;
                  </p>
                  <p className="flex flex-wrap">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Enim eius magnam tempora magni eligendi dolor delectus
                    quisquam voluptas, possimus nobis, mollitia a laboriosam
                    nemo assumenda.
                  </p>
                </span>
              </div>
            </Accordion>
          ))}
        </div>
      )}
    </>
  );
};
