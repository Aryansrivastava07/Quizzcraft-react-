import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faClock, faMedal } from "@fortawesome/free-solid-svg-icons";
import { attemptAPI } from "../utils/api";

export const QuizAttempted = ({ quizAttempted }) => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        setLoading(true);
        const response = await attemptAPI.getAttemptHistory();
        console.log('Fetched attempts:', response);
        
        if (response.success && response.data) {
          setAttempts(response.data);
        } else {
          setAttempts([]);
        }
      } catch (error) {
        console.error('Error fetching attempts:', error);
        setError('Failed to load quiz attempts');
        setAttempts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-semibold text-[#1e2939] mb-6 text-center">Quizzes You Attempted</h2>
        <div className="flex justify-center items-center h-32">
          <div className="text-lg text-gray-600">Loading your quiz attempts...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-semibold text-[#1e2939] mb-6 text-center">Quizzes You Attempted</h2>
        <div className="flex justify-center items-center h-32">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  const displayAttempts = attempts.length > 0 ? attempts : [];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-semibold text-[#1e2939] mb-6 text-center">Quizzes You Attempted</h2>

      {displayAttempts.length === 0 ? (
        <div className="flex justify-center items-center h-32">
          <div className="text-lg text-gray-600">No quiz attempts yet. Start taking some quizzes!</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayAttempts.map((quiz, index) => (
            <div
              key={quiz._id || quiz.id || index}
              className="group bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all relative"
            >
              {/* Hover Overlay */}
              <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-[#0000004d] backdrop-blur-md text-white text-lg font-bold rounded-2xl z-10">
                View Performance →
              </div>

              {/* Quiz Attempt Card */}
              <div className="z-0 space-y-2">
                <h3 className="text-xl font-bold text-[#354960]">{quiz.quizTitle || quiz.title || 'Quiz'}</h3>
                <p className="text-sm text-gray-600">Submitted: {quiz.submittedAt ? new Date(quiz.submittedAt).toLocaleDateString() : 'Recently'}</p>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Score: <strong>{quiz.score || 0}%</strong></span>
                  <span>Correct: {quiz.correctAnswers || 0}/{quiz.totalQuestions || 0}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-[#4b5563]">
                  <span>
                    <FontAwesomeIcon icon={faClock} className="mr-1 text-gray-500" />
                    Time Taken: {quiz.timeTaken || 'N/A'}
                  </span>
                  <span>
                    <FontAwesomeIcon icon={faMedal} className="mr-1 text-yellow-400" />
                    {quiz.badgeEarned || 'None'}
                  </span>
                </div>
                <p className={`text-right text-sm font-semibold ${
                  quiz.verdict === "Excellent" ? "text-green-600" :
                  quiz.verdict === "Passed" ? "text-blue-600" :
                  "text-red-500"
                }`}>
                  {quiz.verdict || 'Completed'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};