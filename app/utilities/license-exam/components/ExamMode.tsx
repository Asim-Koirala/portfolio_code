'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Question, QuestionData, UserAnswer, ExamConfig } from '../types';

interface ExamModeProps {
  category: 'B' | 'K';
  onExit: () => void;
  onComplete?: (results: { totalScore: number; totalMarks: number; userAnswers: UserAnswer[]; passed: boolean }) => void;
}

const ExamMode: React.FC<ExamModeProps> = ({ category, onExit, onComplete }) => {
  // Exam configuration
  const examConfig: ExamConfig = {
    totalQuestions: 25,
    totalMarks: 100,
    timeLimit: 30, // 30 minutes
    passingMarks: 60,
    sectionDistribution: {
      'Knowledge related to driving': 6,
      'Knowledge related to vehicular act/regulation': 5,
      'Technical or mechanical knowledge of vehicle': 3,
      'Conceptual knowledge related to environment pollution': 2,
      'Knowledge related to accidental awareness': 3,
      'Knowledge related to traffic signals': 6
    }
  };

  // State variables
  const [language, setLanguage] = useState<'en' | 'ne'>('en');
  const [showSelectionScreen, setShowSelectionScreen] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(examConfig.timeLimit * 60);
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [examCompleted, setExamCompleted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [showNavigationPanel, setShowNavigationPanel] = useState<boolean>(false);
  const [showResultsModal, setShowResultsModal] = useState<boolean>(false);
  const [isReviewMode, setIsReviewMode] = useState<boolean>(false);
  const [examResults, setExamResults] = useState<{
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    timeSpent: string;
    userAnswers: UserAnswer[];
    totalScore: number;
    totalMarks: number;
    passed: boolean;
  } | null>(null);

  // Load questions from JSON file
  useEffect(() => {
    const loadQuestions = async () => {
      if (!category || !language) return;
       
       try {
         setLoading(true);
         const response = await fetch(`/assets/data/${category}.json`);
        if (!response.ok) {
          throw new Error('Failed to load questions');
        }
        
        const data: QuestionData = await response.json();
        
        // Select questions according to the exam structure
        const selectedQuestions: Question[] = [];
        
        // For each section, select the required number of questions
        Object.entries(examConfig.sectionDistribution).forEach(([sectionName, count]) => {
          // Find the section in the data (case-insensitive matching)
          let section = data.sections.find(s => 
            s.section_name.en.toLowerCase().trim() === sectionName.toLowerCase().trim()
          );
          
          // Handle the typo in B.json for 'Conceptual' section
          if (!section && sectionName.toLowerCase().includes('conceptual')) {
            section = data.sections.find(s => 
              s.section_name.en.toLowerCase().includes('onceptual') || 
              s.section_name.en.toLowerCase().includes('conceptual')
            );
          }
          
          if (section && section.questions.length > 0) {
            // Randomly select 'count' questions from this section
            const shuffled = [...section.questions].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, Math.min(count, section.questions.length));
            selectedQuestions.push(...selected);
          } else {
            console.warn(`Section not found: ${sectionName}`);
          }
        });
        
        // If we don't have enough questions, fill from all available questions
        if (selectedQuestions.length < examConfig.totalQuestions) {
          const allQuestions = data.sections.flatMap(section => section.questions);
          const remainingQuestions = allQuestions.filter(q => 
            !selectedQuestions.some(sq => sq.question_number === q.question_number)
          );
          const shuffledRemaining = remainingQuestions.sort(() => 0.5 - Math.random());
          const needed = examConfig.totalQuestions - selectedQuestions.length;
          selectedQuestions.push(...shuffledRemaining.slice(0, needed));
        }
        
        // Shuffle the final set of questions and ensure we have exactly the required number
        const shuffledQuestions = selectedQuestions
          .sort(() => 0.5 - Math.random())
          .slice(0, examConfig.totalQuestions);
        
        setQuestions(shuffledQuestions);
        setLoading(false);
      } catch (err) {
        console.error('Error loading questions:', err);
        setError('Failed to load questions. Please try again.');
        setLoading(false);
      }
    };
    
    loadQuestions();
  }, [category, language, examConfig.sectionDistribution, examConfig.totalQuestions]);

  // Complete the exam
  const handleExamComplete = useCallback(() => {
    setExamCompleted(true);
    const totalScore = userAnswers.reduce((sum, answer) => sum + answer.marks, 0);
    const correctAnswers = userAnswers.filter(answer => answer.marks > 0).length;
    const incorrectAnswers = userAnswers.length - correctAnswers;
    const passed = totalScore >= examConfig.passingMarks;
    const timeElapsed = (examConfig.timeLimit * 60) - timeRemaining;
    const timeSpent = formatTime(timeElapsed);
    const results = { 
      score: totalScore,
      totalQuestions: userAnswers.length,
      correctAnswers,
      incorrectAnswers,
      timeSpent,
      userAnswers,
      totalScore, 
      totalMarks: examConfig.totalMarks, 
      passed 
    };
    
    if (onComplete) {
      onComplete(results);
    } else {
      // Show results modal instead of alert
      setExamResults(results);
      setShowResultsModal(true);
    }
  }, [userAnswers, examConfig.passingMarks, examConfig.totalMarks, examConfig.timeLimit, timeRemaining, onComplete]);

  // Timer effect
  useEffect(() => {
    if (!examStarted || examCompleted) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleExamComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [examStarted, examCompleted, handleExamComplete]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle answer selection for single question mode
  const handleAnswerSelect = (optionIndex: number) => {
    if (examCompleted) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;
    
    const correctAnswerIndex = currentQuestion.correct_answer.charCodeAt(0) - 97; // Convert 'a', 'b', 'c', 'd' to 0, 1, 2, 3
    const isCorrect = optionIndex === correctAnswerIndex;
    const marks = isCorrect ? currentQuestion.marks : 0;
    
    const userAnswer: UserAnswer = {
      questionId: currentQuestion.question_number,
      selectedOption: optionIndex,
      isCorrect,
      marks
    };
    
    // Update user answers
    setUserAnswers(prev => {
      const existingIndex = prev.findIndex(a => a.questionId === currentQuestion.question_number);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = userAnswer;
        return updated;
      }
      return [...prev, userAnswer];
    });
  };

  // Handle answer selection for paper mode
  const handlePaperModeAnswerSelect = (question: Question, optionIndex: number) => {
    if (examCompleted) return;
    
    const correctAnswerIndex = question.correct_answer.charCodeAt(0) - 97; // Convert 'a', 'b', 'c', 'd' to 0, 1, 2, 3
    const isCorrect = optionIndex === correctAnswerIndex;
    const marks = isCorrect ? question.marks : 0;
    
    const userAnswer: UserAnswer = {
      questionId: question.question_number,
      selectedOption: optionIndex,
      isCorrect,
      marks
    };
    
    // Update user answers
    setUserAnswers(prev => {
      const existingIndex = prev.findIndex(a => a.questionId === question.question_number);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = userAnswer;
        return updated;
      }
      return [...prev, userAnswer];
    });
  };

  // Navigate to next question
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleExamComplete();
    }
  }, [currentQuestionIndex, questions.length, handleExamComplete]);

  // Navigate to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };



  // Handle retake exam
  const handleRetakeExam = () => {
    setShowResultsModal(false);
    setExamCompleted(false);
    setExamStarted(false);
    setShowSelectionScreen(true);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setTimeRemaining(examConfig.timeLimit * 60);
    setFlaggedQuestions(new Set());
    setExamResults(null);
    setLanguage('en');
  };

  // Handle proceed to instructions
  const handleProceedToInstructions = () => {
    if (language && category) {
      setShowSelectionScreen(false);
    }
  };

  // Handle review answers
  const handleReviewAnswers = () => {
    setShowResultsModal(false);
    setCurrentQuestionIndex(0); // Start from the first question
    setIsReviewMode(true);
    // Keep exam completed but allow navigation through questions
  };

  // Handle returning to results modal from review mode
  const handleBackToResults = () => {
    setIsReviewMode(false);
    setShowResultsModal(true);
  };

  // Show summary of correct and incorrect answers
  const [showSummary, setShowSummary] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState<boolean>(false);
  const [selectedQuestionForModal, setSelectedQuestionForModal] = useState<number | null>(null);
  const [examMode, setExamMode] = useState<'quiz' | 'paper'>('quiz');
  
  const handleShowSummary = () => {
    setShowSummary(true);
  };
  
  const handleCloseSummary = () => {
    setShowSummary(false);
  };

  const handleOpenQuestionModal = (questionIndex: number) => {
    setSelectedQuestionForModal(questionIndex);
    setShowQuestionModal(true);
  };

  const handleCloseQuestionModal = () => {
    setShowQuestionModal(false);
    setSelectedQuestionForModal(null);
  };

  // Toggle question flag
  const toggleQuestionFlag = (questionIndex: number) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex);
      } else {
        newSet.add(questionIndex);
      }
      return newSet;
    });
  };

  // Navigate to specific question
  const navigateToQuestion = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex);
    setShowNavigationPanel(false);
  };

  // Get question status for navigation
  const getQuestionStatus = (questionIndex: number) => {
    const question = questions[questionIndex];
    if (!question) return 'unanswered';
    
    const hasAnswer = userAnswers.some(answer => answer.questionId === question.question_number);
    const isFlagged = flaggedQuestions.has(questionIndex);
    
    if (hasAnswer && isFlagged) return 'answered-flagged';
    if (hasAnswer) return 'answered';
    if (isFlagged) return 'flagged';
    return 'unanswered';
  };

  // Start the exam
  const handleStartExam = () => {
    setExamStarted(true);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={onExit}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Render category and language selection screen
  if (showSelectionScreen) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Select Exam Options</h2>
        
        {/* Display Selected Category */}
        <div className="mb-8">
          <h3 className="text-xl font-medium text-gray-800 mb-4">Selected Category:</h3>
          <div className="p-4 rounded-lg border-2 border-blue-500 bg-blue-50 text-blue-700">
            <div className="text-center">
              <div className="text-4xl mb-2">{category === 'B' ? '🚗' : '🏍️'}</div>
              <h4 className="text-lg font-semibold mb-1">Category {category}</h4>
              <p className="text-sm">{category === 'B' ? 'Car/Jeep License' : 'Motorcycle License'}</p>
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-medium text-gray-800 mb-4">Select Language:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setLanguage('en')}
              className={`p-6 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                language === 'en'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">🇺🇸</div>
                <h4 className="text-lg font-semibold mb-1">English</h4>
                <p className="text-sm">English Language</p>
              </div>
            </button>
            <button
              onClick={() => setLanguage('ne')}
              className={`p-6 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                language === 'ne'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">🇳🇵</div>
                <h4 className="text-lg font-semibold mb-1">नेपाली</h4>
                <p className="text-sm">Nepali Language</p>
              </div>
            </button>
          </div>
        </div>

        {/* Exam Mode Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-medium text-gray-800 mb-4">Select Exam Mode:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setExamMode('quiz')}
              className={`p-6 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                examMode === 'quiz'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">💻</div>
                <h4 className="text-lg font-semibold mb-1">Quiz Mode</h4>
                <p className="text-sm">Interactive question-by-question format</p>
              </div>
            </button>
            <button
              onClick={() => setExamMode('paper')}
              className={`p-6 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                examMode === 'paper'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">📄</div>
                <h4 className="text-lg font-semibold mb-1">Paper Mode</h4>
                <p className="text-sm">OMR-style layout with print functionality</p>
              </div>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <button 
            onClick={onExit}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={handleProceedToInstructions}
            disabled={!language || !category}
            className={`px-6 py-3 rounded-md transition-colors cursor-pointer ${
              language && category
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Instructions
          </button>
        </div>
      </div>
    );
  }

  // Render exam instructions before starting
  if (!examStarted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Exam Instructions</h2>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-md">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Exam Structure:</h3>
          <ul className="list-disc pl-5 text-gray-600">
            <li>Total Questions: {examConfig.totalQuestions}</li>
            <li>Total Marks: {examConfig.totalMarks}</li>
            <li>Time Limit: {examConfig.timeLimit} minutes</li>
            <li>Passing Marks: {examConfig.passingMarks}</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Question Distribution:</h3>
          <ul className="list-disc pl-5 text-gray-600">
            {Object.entries(examConfig.sectionDistribution).map(([section, count]) => (
              <li key={section}>{count} questions from {section}</li>
            ))}
          </ul>
        </div>
        
        <div className="mb-6 p-4 bg-yellow-50 rounded-md">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Important Notes:</h3>
          <ul className="list-disc pl-5 text-gray-600">
            <li>You can navigate between questions using the Next and Previous buttons.</li>
            <li>The timer will start as soon as you begin the exam.</li>
            <li>The exam will automatically submit when the time is up.</li>
            <li>You need to score at least {examConfig.passingMarks} marks to pass.</li>
          </ul>
        </div>
        
        <div className="flex justify-between mt-8">
          <button 
            onClick={onExit}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={handleStartExam}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Start Exam
          </button>
        </div>
      </div>
    );
  }

  // Render the exam
  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = currentQuestion ? userAnswers.find(a => a.questionId === currentQuestion.question_number) : undefined;
  
  return (
    <>
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="mb-6">
        {/* Top row with title and exit button */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-2 sm:mb-0">
            <button 
              onClick={onExit}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors cursor-pointer text-sm w-fit"
            >
              Exit Exam
            </button>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">
              {category === 'B' ? 'Car/Jeep License Exam' : 'Motorcycle License Exam'}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs sm:text-sm text-gray-600">Language:</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs sm:text-sm font-medium">
              {language === 'en' ? 'English' : 'नेपाली'}
            </span>
          </div>
        </div>
        
        {/* Bottom row with controls */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <button
            onClick={() => setShowNavigationPanel(!showNavigationPanel)}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm cursor-pointer w-fit"
          >
            Question Panel
          </button>
          <div className="flex items-center justify-between sm:space-x-4">
            <div className="text-sm sm:text-base lg:text-lg font-medium text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <div className={`text-sm sm:text-base lg:text-lg font-bold ${timeRemaining <= 300 ? 'text-red-600' : 'text-gray-600'}`}>
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>
      </div>

      {/* Mode Toggle Button */}
      <div className="mb-4 flex justify-center">
        <div className="bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setExamMode('quiz')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              examMode === 'quiz'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            💻 Quiz Mode
          </button>
          <button
            onClick={() => setExamMode('paper')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              examMode === 'paper'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📄 Paper Mode
          </button>
        </div>
      </div>

      {examMode === 'quiz' ? (
        <>
          {/* Question Navigation Panel */}
      {showNavigationPanel && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Question Navigation</h3>
            <button
              onClick={() => setShowNavigationPanel(false)}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-2 mb-4">
            {questions.map((_, index) => {
              const status = getQuestionStatus(index);
              const isCurrent = index === currentQuestionIndex;
              
              let bgColor = 'bg-gray-200 text-gray-700';
              if (status === 'answered') bgColor = 'bg-blue-500 text-white';
              else if (status === 'flagged') bgColor = 'bg-yellow-500 text-white';
              else if (status === 'answered-flagged') bgColor = 'bg-orange-500 text-white';
              
              return (
                <button
                  key={index}
                  onClick={() => navigateToQuestion(index)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    isCurrent ? 'ring-2 ring-blue-500' : ''
                  } ${bgColor} hover:opacity-80`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium text-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded shadow-sm"></div>
              <span className="text-gray-800">Answered</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded shadow-sm"></div>
              <span className="text-gray-800">Flagged</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded shadow-sm"></div>
              <span className="text-gray-800">Answered & Flagged</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-300 rounded shadow-sm border"></div>
              <span className="text-gray-800">Unanswered</span>
            </div>
          </div>
        </div>
      )}

      {/* Question */}
      <div className="mb-8">
        {/* Traffic Symbol Image for questions 416-500 */}
        {currentQuestion && currentQuestion.question_number >= 416 && currentQuestion.question_number <= 500 && (
          <div className="mb-4 flex justify-center">
            <Image 
              src={`/assets/icons/B${currentQuestion.question_number}.png`}
              alt={`Traffic symbol for question ${currentQuestion.question_number}`}
              width={300}
              height={192}
              className="max-w-xs max-h-48 object-contain border border-gray-300 rounded-lg shadow-sm"
              onError={(e) => {
                console.warn(`Image not found: B${currentQuestion.question_number}.png`);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-2 sm:space-y-0">
          <h3 className="text-lg sm:text-xl font-medium text-gray-800 flex-1 pr-0 sm:pr-4">
            {currentQuestion ? currentQuestion.question[language] : "Loading question..."}
          </h3>
          <div className="flex items-center space-x-2">
            {examCompleted && userAnswer && (
              <div className={`px-3 py-1 rounded-md text-xs sm:text-sm font-medium ${userAnswer.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {userAnswer.isCorrect ? 'Correct' : 'Incorrect'}
              </div>
            )}
            {examCompleted && !userAnswer && (
              <div className="px-3 py-1 rounded-md text-xs sm:text-sm font-medium bg-gray-500 text-white">
                Unattempted
              </div>
            )}
            <button
              onClick={() => !examCompleted && toggleQuestionFlag(currentQuestionIndex)}
              className={`px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors w-fit ${
                flaggedQuestions.has(currentQuestionIndex)
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {flaggedQuestions.has(currentQuestionIndex) ? '🏁 Flagged' : '🏁 Flag'}
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {currentQuestion && currentQuestion.options[language].map((option, index) => {
            const isSelected = userAnswer?.selectedOption === index;
            const optionLetter = String.fromCharCode(97 + index); // a, b, c, d
            const correctAnswerIndex = currentQuestion.correct_answer.charCodeAt(0) - 97; // Convert 'a', 'b', 'c', 'd' to 0, 1, 2, 3
            const isCorrect = index === correctAnswerIndex;
            
            // Determine styling based on exam state and answer correctness
            let optionStyle = '';
            let optionBgColor = '';
            
            if (examCompleted) {
              if (isSelected && isCorrect) {
                optionStyle = 'bg-green-50 border-green-500 shadow-md';
                optionBgColor = 'bg-green-600 text-white';
              } else if (isSelected && !isCorrect) {
                optionStyle = 'bg-red-50 border-red-500 shadow-md';
                optionBgColor = 'bg-red-600 text-white';
              } else if (isCorrect) {
                optionStyle = 'bg-green-50 border-green-500 border-dashed shadow-sm';
                optionBgColor = 'bg-green-100 text-green-800 border border-green-300';
              } else {
                optionStyle = 'bg-white border-gray-200';
                optionBgColor = 'bg-gray-100 text-gray-600 border border-gray-300';
              }
            } else {
              optionStyle = isSelected 
                ? 'bg-blue-50 border-blue-400 shadow-md' 
                : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm';
              optionBgColor = isSelected 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 border border-gray-300';
            }
            
            return (
              <div 
                key={index}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 ${optionStyle}`}
                onClick={() => !examCompleted && handleAnswerSelect(index)}
              >
                <div className="flex items-start">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm font-bold ${optionBgColor}`}>
                    {examCompleted 
                      ? (isSelected ? (isCorrect ? '✓' : '✗') : (isCorrect ? '✓' : optionLetter.toUpperCase()))
                      : (isSelected ? '✓' : optionLetter.toUpperCase())
                    }
                  </div>
                  <div className="text-gray-800 font-medium leading-relaxed flex-1">
                    {option}
                  </div>
                  {examCompleted && isCorrect && (
                    <div className="ml-2 text-green-600 font-medium">
                      {isSelected ? '' : '(Correct Answer)'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex justify-between mt-8 gap-2">
        <button 
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
          className={`px-3 py-2 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base ${currentQuestionIndex === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'} transition-colors`}
        >
          Previous
        </button>
        
        {isReviewMode ? (
          <div className="flex space-x-2">
            {currentQuestionIndex < questions.length - 1 && (
              <button 
                onClick={handleNextQuestion}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer text-sm sm:text-base"
              >
                Next Question
              </button>
            )}
            <button 
              onClick={handleBackToResults}
              className="px-3 py-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer text-sm sm:text-base"
            >
              Back to Results
            </button>
          </div>
        ) : currentQuestionIndex < questions.length - 1 ? (
          <button 
            onClick={handleNextQuestion}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer text-sm sm:text-base"
          >
            Next
          </button>
        ) : (
          <button 
            onClick={handleExamComplete}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer text-sm sm:text-base"
          >
            Finish Exam
          </button>
        )}
      </div>
        </>
      ) : (
        /* Paper Mode - OMR Style Layout */
        <div className="paper-mode relative">
          {/* Sticky Status Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300 p-4 z-50 print:hidden shadow-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <div className="text-sm">
                  <span className="font-semibold text-gray-700">Questions Answered:</span>
            <span className="ml-2 text-blue-600 font-bold">{userAnswers.length} / {questions.length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(userAnswers.length / questions.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{Math.round((userAnswers.length / questions.length) * 100)}%</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <span className="font-semibold text-gray-700">Time Left:</span>
            <span className="ml-2 text-red-600 font-bold">
                    {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                {!examCompleted && (
                  <button
                    onClick={handleExamComplete}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer font-medium text-sm"
                  >
                    Submit Exam
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Answer Sheet</h3>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer flex items-center space-x-2"
            >
              <span>🖨️</span>
              <span>Print</span>
            </button>
          </div>
          
          <div className="bg-white border-2 border-gray-300 p-6 print:p-4 mb-24">
            {/* Header for print */}
            <div className="text-center mb-6 print:mb-4">
              <h2 className="text-2xl font-bold text-gray-800 print:text-xl">
                Nepal License Trial Exam - Category {category}
              </h2>
              <p className="text-gray-600 mt-2 print:text-sm">
                Language: {language === 'en' ? 'English' : 'नेपाली'} | Time: {examConfig.timeLimit} minutes | Total Questions: {questions.length}
              </p>
              <div className="mt-4 p-3 bg-gray-50 rounded print:bg-white print:border">
                <p className="text-sm text-gray-700">
                  <strong>Instructions:</strong> Fill in the circle completely for your chosen answer. Use a dark pen or pencil.
                </p>
              </div>
            </div>
            
            {/* OMR Style Answer Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:gap-4">
              {questions.map((question, questionIndex) => {
                const userAnswer = userAnswers.find(a => a.questionId === question.question_number);
                return (
                  <div key={questionIndex} className="border border-gray-200 p-4 print:p-2 rounded print:rounded-none">
                    <div className="mb-3 print:mb-2">
                      {/* Traffic Symbol Image for questions 416-500 */}
                      {question.question_number >= 416 && question.question_number <= 500 && (
                        <div className="mb-2 flex justify-center">
                          <Image 
                            src={`/assets/icons/B${question.question_number}.png`}
                            alt={`Traffic symbol for question ${question.question_number}`}
                            width={150}
                            height={96}
                            className="max-w-[150px] max-h-24 print:max-w-[100px] print:max-h-16 object-contain border border-gray-300 rounded shadow-sm"
                            onError={(e) => {
                              console.warn(`Image not found: B${question.question_number}.png`);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      
                      <div className="flex items-start space-x-3">
                        <div className="font-bold text-gray-800 min-w-[3rem] print:min-w-[2rem]">
                          Q.{questionIndex + 1}
                        </div>
                        <div className="flex-1 text-gray-800 text-sm print:text-xs leading-relaxed">
                          {question.question[language]}
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-12 print:ml-8 space-y-2 print:space-y-1">
                      {question.options[language].map((option, optionIndex) => {
                        const optionLetter = String.fromCharCode(65 + optionIndex); // A, B, C, D
                        const isSelected = userAnswer?.selectedOption === optionIndex;
                        const correctAnswerIndex = question.correct_answer.charCodeAt(0) - 97; // Convert 'a', 'b', 'c', 'd' to 0, 1, 2, 3
                        const isCorrect = optionIndex === correctAnswerIndex;
                        const showAnswers = examCompleted || isReviewMode;
                        
                        let buttonClass = 'w-5 h-5 print:w-4 print:h-4 rounded-full border-2 cursor-pointer transition-colors ';
                        let optionClass = 'text-sm print:text-xs flex-1 ';
                        
                        if (showAnswers) {
                          if (isCorrect) {
                            buttonClass += 'bg-green-500 border-green-500';
                            optionClass += 'text-green-700 font-medium';
                          } else if (isSelected && !isCorrect) {
                            buttonClass += 'bg-red-500 border-red-500';
                            optionClass += 'text-red-700';
                          } else {
                            buttonClass += isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-400 bg-white';
                            optionClass += 'text-gray-700';
                          }
                        } else {
                          buttonClass += isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white hover:border-blue-400 border-gray-400';
                          optionClass += 'text-gray-700';
                        }
                        
                        return (
                          <div key={optionIndex} className="flex items-center space-x-3 print:space-x-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-700 w-4 print:w-3 text-sm print:text-xs">
                                {optionLetter}.
                              </span>
                              <button
                                onClick={() => handlePaperModeAnswerSelect(question, optionIndex)}
                                className={`relative ${buttonClass}`}
                                disabled={examCompleted}
                              >
                                {(isSelected || (showAnswers && isCorrect)) && (
                                  <div className={`w-full h-full rounded-full ${
                                    showAnswers && isCorrect ? 'bg-green-500' : 
                                    showAnswers && isSelected && !isCorrect ? 'bg-red-500' : 
                                    'bg-blue-600'
                                  }`}></div>
                                )}
                                {showAnswers && isCorrect && (
                                  <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">✓</div>
                                )}
                                {showAnswers && isSelected && !isCorrect && (
                                  <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">✗</div>
                                )}
                              </button>
                            </div>
                            <div className={optionClass}>
                              {option}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Submit Section */}
            <div className="mt-8 print:mt-6 text-center border-t pt-6 print:pt-4">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Questions Answered: {userAnswers.length} / {questions.length}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(userAnswers.length / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {!examCompleted ? (
                <button
                  onClick={handleExamComplete}
                  className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer font-medium"
                >
                  Submit Exam
                </button>
              ) : isReviewMode && (
                <button
                  onClick={handleBackToResults}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer font-medium"
                >
                  Back to Results
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Results Modal */}
    {showResultsModal && examResults && (
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
          <div className="text-center">
            <div className={`text-6xl mb-4 ${examResults.passed ? 'text-green-500' : 'text-red-500'}`}>
              {examResults.passed ? '🎉' : '😞'}
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {examResults.passed ? 'Congratulations!' : 'Better Luck Next Time!'}
            </h2>
            <div className="mb-6 text-gray-800">
              <p className="text-lg mb-2">
                <span className="font-semibold">Score:</span> {examResults.totalScore}/{examResults.totalMarks}
              </p>
              <p className="text-lg mb-2">
                <span className="font-semibold">Percentage:</span> {Math.round((examResults.totalScore / examResults.totalMarks) * 100)}%
              </p>
              <p className={`text-lg font-bold ${examResults.passed ? 'text-green-600' : 'text-red-600'}`}>
                Result: {examResults.passed ? 'PASSED' : 'FAILED'}
              </p>
            </div>
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleReviewAnswers}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Review Answers
              </button>
              <button
                onClick={handleShowSummary}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors cursor-pointer"
              >
                Show Summary
              </button>
              <button
                onClick={handleRetakeExam}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer"
              >
                Take Test Again
              </button>
              <button
                onClick={() => setShowResultsModal(false)}
                className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Summary Modal */}
    {showSummary && examResults && (
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">Exam Summary</h2>
          
          <div className="mb-4 text-gray-800">
            <p className="text-base mb-2">
              <span className="font-semibold">Score:</span> {examResults.totalScore}/{examResults.totalMarks}
            </p>
            <p className="text-base mb-2">
              <span className="font-semibold">Percentage:</span> {Math.round((examResults.totalScore / examResults.totalMarks) * 100)}%
            </p>
            <p className={`text-base font-bold ${examResults.passed ? 'text-green-600' : 'text-red-600'}`}>
              Result: {examResults.passed ? 'PASSED' : 'FAILED'}
            </p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Question Summary</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((question, index) => {
                const userAnswer = userAnswers.find(a => a.questionId === question.question_number);
                const isFlagged = flaggedQuestions.has(index);
                
                let bgColor = 'bg-blue-500'; // Unattempted (blue)
                if (userAnswer) {
                  bgColor = userAnswer.isCorrect ? 'bg-green-500' : 'bg-red-500';
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => handleOpenQuestionModal(index)}
                    className={`w-10 h-10 rounded-md text-white font-medium flex items-center justify-center relative ${bgColor} hover:opacity-80 cursor-pointer`}
                  >
                    {index + 1}
                    {isFlagged && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-medium text-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded shadow-sm"></div>
              <span className="text-gray-800">Correct</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded shadow-sm"></div>
              <span className="text-gray-800">Incorrect</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded shadow-sm"></div>
              <span className="text-gray-800">Unattempted</span>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={handleReviewAnswers}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer text-sm"
            >
              Review Answers
            </button>
            <button
              onClick={handleCloseSummary}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors cursor-pointer text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Question Detail Modal */}
    {showQuestionModal && selectedQuestionForModal !== null && questions[selectedQuestionForModal] && (
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Question {selectedQuestionForModal + 1}</h2>
            <button
              onClick={handleCloseQuestionModal}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
            >
              ×
            </button>
          </div>
          
          <div className="mb-4">
            {/* Traffic Symbol Image for questions 416-500 */}
            {questions[selectedQuestionForModal].question_number >= 416 && questions[selectedQuestionForModal].question_number <= 500 && (
              <div className="mb-4 flex justify-center">
                <Image 
                  src={`/assets/icons/B${questions[selectedQuestionForModal].question_number}.png`}
                  alt={`Traffic symbol for question ${questions[selectedQuestionForModal].question_number}`}
                  width={300}
                  height={192}
                  className="max-w-xs max-h-48 object-contain border border-gray-300 rounded-lg shadow-sm"
                  onError={(e) => {
                    console.warn(`Image not found: B${questions[selectedQuestionForModal].question_number}.png`);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <p className="text-gray-800 mb-4 leading-relaxed">
              {questions[selectedQuestionForModal].question[language]}
            </p>
            
            <div className="space-y-3">
              {questions[selectedQuestionForModal].options[language].map((option, optionIndex) => {
                const userAnswer = userAnswers.find(a => a.questionId === questions[selectedQuestionForModal].question_number);
                const isUserAnswer = userAnswer?.selectedOption === optionIndex;
                const correctAnswerIndex = questions[selectedQuestionForModal].correct_answer.charCodeAt(0) - 97; // Convert 'a', 'b', 'c', 'd' to 0, 1, 2, 3
                const isCorrectAnswer = optionIndex === correctAnswerIndex;
                
                let optionClass = 'p-3 rounded-md border ';
                if (isCorrectAnswer) {
                  optionClass += 'bg-green-100 border-green-500 text-green-800';
                } else if (isUserAnswer && !isCorrectAnswer) {
                  optionClass += 'bg-red-100 border-red-500 text-red-800';
                } else {
                  optionClass += 'bg-gray-50 border-gray-300 text-gray-700';
                }
                
                return (
                  <div key={optionIndex} className={optionClass}>
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      <div className="flex items-center space-x-2">
                        {isCorrectAnswer && (
                          <span className="text-green-600 font-semibold text-sm">✓ Correct</span>
                        )}
                        {isUserAnswer && !isCorrectAnswer && (
                          <span className="text-red-600 font-semibold text-sm">✗ Your Answer</span>
                        )}
                        {isUserAnswer && isCorrectAnswer && (
                          <span className="text-green-600 font-semibold text-sm">✓ Your Answer</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {(() => {
              const userAnswer = userAnswers.find(a => a.questionId === questions[selectedQuestionForModal].question_number);
              if (!userAnswer) {
                return (
                  <div className="mt-4 p-3 bg-gray-100 rounded-md">
                    <span className="text-gray-600 font-medium">Status: Unattempted</span>
                  </div>
                );
              }
            })()}
            
            {flaggedQuestions.has(selectedQuestionForModal) && (
              <div className="mt-4 p-3 bg-yellow-100 rounded-md">
                <span className="text-yellow-800 font-medium">🚩 This question was flagged</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => {
                setCurrentQuestionIndex(selectedQuestionForModal);
                setShowSummary(false);
                handleCloseQuestionModal();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Go to Question
            </button>
            <button
              onClick={handleCloseQuestionModal}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default ExamMode;