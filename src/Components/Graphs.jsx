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
import { useMemo } from "react";
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

export const DoughnutChart = ({ result, answered, length }) => {
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

export const BarChart = ({ quesTimer }) => {
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
        barPercentage: 0.5, // Shrinks bar width relative to category
        categoryPercentage: 0.5,
      },
    ],
  };
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

export const LineChart = ({ quesTimer }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "nearest", // or 'index', 'point', 'x', 'y'
      intersect: false, // set to false to trigger hover even when not directly over a point
    },

    elements: {
      line: {
        tension: .3, // Adjust this value for more or less curve
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        // title: {
        //   display:true,
        // },
        grid: { display: true },
      },
      y: {
        beginAtZero: true,
        grid: { display: false },
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
