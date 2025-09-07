import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faList, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { quizAPI } from "../utils/api";

export const QuizCreated = ({ quizzesCreated }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await quizAPI.getQuizById();
        console.log('Fetched quizzes:', response);
        
        if (response.success && response.data && response.data.quizzes) {
          setQuizzes(response.data.quizzes);
        } else {
          setQuizzes([]);
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setError('Failed to load quizzes');
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);
  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-semibold text-[#1e2939] mb-6 text-center">Quizzes You Created</h2>
        <div className="flex justify-center items-center h-32">
          <div className="text-lg text-gray-600">Loading your quizzes...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-semibold text-[#1e2939] mb-6 text-center">Quizzes You Created</h2>
        <div className="flex justify-center items-center h-32">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  const displayQuizzes = quizzes.length > 0 ? quizzes : [];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-semibold text-[#1e2939] mb-6 text-center">Quizzes You Created</h2>

      {displayQuizzes.length === 0 ? (
        <div className="flex justify-center items-center h-32">
          <div className="text-lg text-gray-600">No quizzes created yet. Start creating your first quiz!</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayQuizzes.map((quiz, index) => (
          <div
            key={quiz._id || quiz.id || index}
            className="group bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all relative"
          >
            {/* Hover overlay */}
            <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-[#0000004d] backdrop-blur-md text-white text-lg font-bold rounded-2xl z-10">
              View Stats →
            </div>

            {/* Quiz Card Content */}
            <div className="z-0 space-y-3">
              <h3 className="text-xl font-bold text-[#354960]">{quiz.title || 'Untitled Quiz'}</h3>
              <p className="text-sm text-[#6b7280]">Category: {quiz.category || 'General'}</p>
              <p className="text-sm text-[#6b7280]">Questions: {quiz.questions?.length || 0}</p>
              <div className="flex justify-between items-center text-sm text-[#4b5563]">
                <span>
                  <FontAwesomeIcon icon={faList} className="mr-2" />
                  Attempts: {quiz.totalAttempts || 0}
                </span>
                <span>
                  <FontAwesomeIcon icon={faStar} className="mr-2 text-yellow-400" />
                  Avg Score: {quiz.averageScore || 0}%
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#6169f9] font-medium">
                  🏆 Badge: {quiz.badgeEarned || 'None'}
                </span>
                <span className="text-[#10b981] font-semibold">
                  {quiz.type === "public" ? "🌍 Public" : "🔒 Private"}
                </span>
              </div>
              <p className="text-xs text-gray-500 text-right">
                Created on: {quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : 'Recently'}
              </p>
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
};
