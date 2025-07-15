import { fetchData } from "pdfjs-dist";
import {
  useEffect,
  useState,
  useCallback,
  react,
  useLayoutEffect,
  useMemo,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  plugins,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  plugins,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

const DoughnutChart = ({ result, answered, length }) => {
  const data = {
    labels: ["Correct", "Incorrect", "Unanswered"],
    datasets: [
      {
        label: "Answers",
        data: [result, answered - result, 10 - answered],
        backgroundColor: [
          "rgb(78, 139, 250)",
          "rgb(92, 161, 255)",
          "rgb(200, 203, 229)",
        ],
        borderWidth: 0,
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#041b43",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
    rotation: 180, // Starts at 180 degrees (left)
  };

  const percentage = useMemo(() => {
    return `${Math.round((result / length) * 100)}%`;
  }, [result]);

  const centerTextPlugin = {
    id: "centerText",
    beforeDraw: (chart) => {
      if (!percentage) return;
      const {
        ctx,
        chartArea: { top, bottom, left, right },
      } = chart;
      const centerX = (left + right) / 2;
      const centerY = (top + bottom) / 2;
      ctx.save();
      ctx.font = "bold 30px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(percentage, centerX, centerY);
      ctx.restore();
    },
  };

  return (
    <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
  );
};

const BarChart = ({ quesTimer }) => {
  const data = {
    labels: Array.from({ length: quesTimer.length }, (_, i) => i + 1),
    datasets: [
      {
        label: "Answers",
        data: quesTimer,
        backgroundColor: [
          "rgb(78, 139, 250)",
          "rgb(92, 161, 255)",
          "rgb(200, 203, 229)",
          "rgb(78, 139, 250)",
        ],
        borderWidth: 0,
        // barThickness: 30,
        // maxBarThickness: 40,
        barPercentage: 0.5, // Shrinks bar width relative to category
        categoryPercentage: 0.5,
      },
    ],
  };
  // const options = {
  //   maintainAspectRatio: false,
  //   responsive: true,
  // };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#333",
          font: { size: 14 },
        },
      },
      y: {
        beginAtZero: true,
        grid: { display: false },
        ticks: {
          stepSize: 2,
          color: "#333",
          font: { size: 14 },
        },
      },
    },
  };

  return <Bar data={data} options={options} className="full-size-chart" />;
};

const LineChart = ({ quesTimer }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "nearest", // or 'index', 'point', 'x', 'y'
      intersect: false, // set to false to trigger hover even when not directly over a point
    },

    elements: {
      line: {
        tension: 0.3, // Adjust this value for more or less curve
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        // ticks: {
        //   color: "#333",
        //   font: { size: 14 },
        // },
      },
      y: {
        // beginAtZero: true,
        grid: { display: false },
        // ticks: {
        //   stepSize: 2,
        //   color: "#333",
        //   font: { size: 14 },
        // },
      },
    },
  };

  const data = {
    labels: Array.from({ length: quesTimer.length }, (_, i) => i + 1),
    datasets: [
      {
        label: "Answers",
        data: Array.from(
          { length: quesTimer.length },
          (_, i) => 30 - quesTimer[i++]
        ),
        backgroundColor: [
          "rgb(78, 139, 250)",
          "rgb(92, 161, 255)",
          "rgb(200, 203, 229)",
          "rgb(78, 139, 250)",
        ],
      },
    ],
  };
  return <Line options={options} data={data} />;
};

export const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const responses = location.state?.Responses;
  const quesTimer = location.state?.quesTimer || [];
  const length = quesTimer.length;
  const quizId = location.state?.quizID;
  const answered = location.state?.answered;
  const [result, setResult] = useState();
  const [correctAnswer, setCorrectAnswer] = useState();
  const [resultFetched, setresultRetched] = useState(false);

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
        if (responses && data) {
          const score = responses.reduce((acc, response, idx) => {
            return acc + (response === data[idx] ? 1 : 0);
          }, 0);
          setResult(score);
          setresultRetched(true);
        }
      })
      .catch((error) => {
        console.error("Error in fetching answer key:", error);
      });
  }, [quizId]);

  return (
    <>
      <div className="grid h-[90vh] w-full m-auto grid-cols-[1fr_2.5fr] justify-center items-center px-25 bg-[#f5f6f9]">
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
    </>
  );
};
