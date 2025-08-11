import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faList, faUserShield } from "@fortawesome/free-solid-svg-icons";

export const QuizCreated = ({ quizzesCreated }) => {
    console.log(quizzesCreated);
  return (
    <div className="p-8">
      <h2 className="text-3xl font-semibold text-[#1e2939] mb-6 text-center">Quizzes You Created</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzesCreated.map((quiz) => (
          <div
            key={quiz.id}
            className="group bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all relative"
          >
            {/* Hover overlay */}
            <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-[#0000004d] backdrop-blur-md text-white text-lg font-bold rounded-2xl z-10">
              View Stats →
            </div>

            {/* Quiz Card Content */}
            <div className="z-0 space-y-3">
              <h3 className="text-xl font-bold text-[#354960]">{quiz.title}</h3>
              <p className="text-sm text-[#6b7280]">Category: {quiz.category}</p>
              <p className="text-sm text-[#6b7280]">Questions: {quiz.questionsCount}</p>
              <div className="flex justify-between items-center text-sm text-[#4b5563]">
                <span>
                  <FontAwesomeIcon icon={faList} className="mr-2" />
                  Attempts: {quiz.totalAttempts}
                </span>
                <span>
                  <FontAwesomeIcon icon={faStar} className="mr-2 text-yellow-400" />
                  Avg Score: {quiz.averageScore}%
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#6169f9] font-medium">
                  🏆 Badge: {quiz.badgeEarned}
                </span>
                <span className="text-[#10b981] font-semibold">
                  {quiz.visibility === "public" ? "🌍 Public" : "🔒 Private"}
                </span>
              </div>
              <p className="text-xs text-gray-500 text-right">
                Created on: {new Date(quiz.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
