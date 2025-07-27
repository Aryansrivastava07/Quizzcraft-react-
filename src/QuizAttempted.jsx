import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faClock, faMedal } from "@fortawesome/free-solid-svg-icons";

export const QuizAttempted = ({ quizAttempted }) => {
    
  return (
    <div className="p-8">
      <h2 className="text-3xl font-semibold text-[#1e2939] mb-6 text-center">Quizzes You Attempted</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizAttempted.map((quiz) => (
          <div
            key={quiz.id}
            className="group bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all relative"
          >
            {/* Hover Overlay */}
            <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-[#0000004d] backdrop-blur-md text-white text-lg font-bold rounded-2xl z-10">
              View Performance →
            </div>

            {/* Quiz Attempt Card */}
            <div className="z-0 space-y-2">
              <h3 className="text-xl font-bold text-[#354960]">{quiz.title}</h3>
              <p className="text-sm text-gray-600">Submitted: {new Date(quiz.submittedAt).toLocaleDateString()}</p>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Score: <strong>{quiz.score}%</strong></span>
                <span>Correct: {quiz.correctAnswers}/{quiz.totalQuestions}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-[#4b5563]">
                <span>
                  <FontAwesomeIcon icon={faClock} className="mr-1 text-gray-500" />
                  Time Taken: {quiz.timeTaken}
                </span>
                <span>
                  <FontAwesomeIcon icon={faMedal} className="mr-1 text-yellow-400" />
                  {quiz.badgeEarned}
                </span>
              </div>
              <p className={`text-right text-sm font-semibold ${
                quiz.verdict === "Excellent" ? "text-green-600" :
                quiz.verdict === "Passed" ? "text-blue-600" :
                "text-red-500"
              }`}>
                {quiz.verdict}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};