'use client';

import { UserAnswer } from '../types';

interface ExamResultsProps {
  score: number;
  totalMarks: number;
  userAnswers: UserAnswer[];
  onRestart: () => void;
  onExit: () => void;
}

const ExamResults: React.FC<ExamResultsProps> = ({ 
  score, 
  totalMarks, 
  userAnswers, 
  onRestart, 
  onExit 
}) => {
  const percentage = Math.round((score / totalMarks) * 100);
  const isPassed = score >= 60; // 60 is the passing mark
  
  // Calculate statistics
  const totalQuestions = userAnswers.length;
  const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const unanswered = 25 - totalQuestions; // 25 is the total number of questions in the exam
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Exam Results</h2>
      
      {/* Result Summary */}
      <div className="mb-8 text-center">
        <div className={`text-4xl font-bold mb-2 ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
          {isPassed ? 'PASSED' : 'FAILED'}
        </div>
        <div className="text-3xl font-bold text-gray-800 mb-1">
          {score} / {totalMarks}
        </div>
        <div className="text-xl text-gray-600">
          {percentage}%
        </div>
      </div>
      
      {/* Result Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 p-4 rounded-md text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">{correctAnswers}</div>
          <div className="text-sm text-gray-600">Correct Answers</div>
        </div>
        <div className="bg-red-50 p-4 rounded-md text-center">
          <div className="text-2xl font-bold text-red-600 mb-1">{incorrectAnswers}</div>
          <div className="text-sm text-gray-600">Incorrect Answers</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <div className="text-2xl font-bold text-gray-600 mb-1">{unanswered}</div>
          <div className="text-sm text-gray-600">Unanswered</div>
        </div>
      </div>
      
      {/* Pass/Fail Message */}
      <div className={`p-4 rounded-md mb-8 ${isPassed ? 'bg-green-50' : 'bg-red-50'}`}>
        <p className={`text-center ${isPassed ? 'text-green-700' : 'text-red-700'}`}>
          {isPassed 
            ? 'Congratulations! You have passed the exam. You are ready for your license trial.'
            : 'You did not pass this time. Keep practicing and try again!'}
        </p>
      </div>
      
      {/* Actions */}
      <div className="flex justify-between mt-8">
        <button 
          onClick={onExit}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
        >
          Back to Home
        </button>
        <button 
          onClick={onRestart}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ExamResults;