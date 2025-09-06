'use client';

import { useState, useEffect } from 'react';
import { Section, Question, UserAnswer } from '../types';

interface PracticeModeProps {
  category: 'B' | 'K';
  onExit: () => void;
}

const PracticeMode: React.FC<PracticeModeProps> = ({ category, onExit }) => {
  const [language, setLanguage] = useState<'en' | 'ne'>('en');
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNavigationPanel, setShowNavigationPanel] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  // Removed unused questionTimes state

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/assets/data/${category}.json`);
        if (!response.ok) {
          throw new Error(`Failed to fetch questions: ${response.status}`);
        }
        const data = await response.json();
        setSections(data.sections);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again later.');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [category]);

  // Timer for total time
  useEffect(() => {
    if (!selectedSection) return;
    
    const interval = setInterval(() => {
      setTotalTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedSection]);

  // Reset question start time when question changes
  useEffect(() => {
    if (selectedSection) {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex, selectedSection]);

  // Force re-render for current question timer
  useEffect(() => {
    if (!selectedSection) return;
    
    const interval = setInterval(() => {
      // This will trigger a re-render to update the current question timer
      setQuestionStartTime(prev => prev);
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedSection, currentQuestionIndex]);

  const handleSectionSelect = (section: Section) => {
    setSelectedSection(section);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowFeedback(false);
    setTotalTime(0);
    setQuestionStartTime(Date.now());
  };

  const handleAnswerSelect = (questionId: number, selectedOption: number) => {
    const currentQuestion = selectedSection?.questions[currentQuestionIndex];
    if (!currentQuestion) return;

    // Convert correct_answer from letter to index if it's a string
    const correctAnswerIndex = typeof currentQuestion.correct_answer === 'string' 
      ? currentQuestion.correct_answer.charCodeAt(0) - 97 // Convert 'a', 'b', 'c', 'd' to 0, 1, 2, 3
      : currentQuestion.correct_answer;
    
    const isCorrect = selectedOption === correctAnswerIndex;
    const answer: UserAnswer = {
      questionId,
      selectedOption,
      isCorrect,
      marks: isCorrect ? currentQuestion.marks : 0
    };

    setUserAnswers(prev => {
      const existingAnswerIndex = prev.findIndex(a => a.questionId === questionId);
      if (existingAnswerIndex >= 0) {
        const updated = [...prev];
        updated[existingAnswerIndex] = answer;
        return updated;
      }
      return [...prev, answer];
    });

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (selectedSection && currentQuestionIndex < selectedSection.questions.length - 1) {
      // Record time spent on current question
      const currentQuestion = selectedSection.questions[currentQuestionIndex];
      const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
      // Time tracking removed for simplification
      
      setCurrentQuestionIndex(prev => prev + 1);
      setShowFeedback(false);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      // Record time spent on current question
      const currentQuestion = selectedSection?.questions[currentQuestionIndex];
      if (currentQuestion) {
        const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
        // Time tracking removed for simplification
      }
      
      setCurrentQuestionIndex(prev => prev - 1);
      setShowFeedback(false);
    }
  };

  const getCurrentQuestion = (): Question | null => {
    return selectedSection?.questions[currentQuestionIndex] || null;
  };

  const getCurrentUserAnswer = (): UserAnswer | undefined => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return undefined;
    
    return userAnswers.find(answer => answer.questionId === currentQuestion.question_number);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentQuestionTime = (): number => {
    return Math.floor((Date.now() - questionStartTime) / 1000);
  };

  const handleQuestionJump = (questionIndex: number) => {
    // Record time spent on current question
    const currentQuestion = selectedSection?.questions[currentQuestionIndex];
    if (currentQuestion) {
      const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
      // Time tracking removed for simplification
    }
    
    setCurrentQuestionIndex(questionIndex);
    setShowFeedback(false);
    setShowNavigationPanel(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700">
        <p>{error}</p>
        <button 
          onClick={onExit}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!selectedSection) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Practice Mode</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Language:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  language === 'en' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('ne')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  language === 'ne' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                नेपाली
              </button>
            </div>
          </div>
        </div>
        
        <p className="mb-6 text-gray-600">
          Select a section to practice questions from that section. You&apos;ll receive immediate feedback after answering each question.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {sections.map((section, index) => (
            <button
              key={index}
              onClick={() => handleSectionSelect(section)}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors border border-blue-200 hover:border-blue-300 cursor-pointer"
            >
              <h3 className="font-semibold text-blue-800 text-lg mb-2">
                {section.section_name[language]}
              </h3>
              <p className="text-sm text-blue-600 font-medium">
                {section.questions.length} questions
              </p>
            </button>
          ))}
        </div>
        
        <button 
          onClick={onExit}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();
  const userAnswer = getCurrentUserAnswer();

  if (!currentQuestion) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">No Questions Available</h2>
        <p className="mb-6 text-gray-600">
          There are no questions available in this section.
        </p>
        <button 
          onClick={() => setSelectedSection(null)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Back to Sections
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header with section name and navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {selectedSection.section_name[language]}
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Language:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  language === 'en' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ne')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  language === 'ne' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                NE
              </button>
            </div>
          </div>
          {/* Timer Display */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <span className="text-gray-600">Total:</span>
              <span className="font-mono font-medium text-blue-600">{formatTime(totalTime)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-gray-600">Question:</span>
              <span className="font-mono font-medium text-green-600">{formatTime(getCurrentQuestionTime())}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-600 font-medium">
            Question {currentQuestionIndex + 1} of {selectedSection.questions.length}
          </div>
          <button
            onClick={() => setShowNavigationPanel(!showNavigationPanel)}
            className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
          >
            {showNavigationPanel ? 'Hide Panel' : 'Show Panel'}
          </button>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        {/* Traffic Symbol Image for questions 416-500 */}
        {currentQuestion.question_number >= 416 && currentQuestion.question_number <= 500 && (
          <div className="mb-4 flex justify-center">
            <img 
              src={`/assets/icons/B${currentQuestion.question_number}.png`}
              alt={`Traffic symbol for question ${currentQuestion.question_number}`}
              className="max-w-xs max-h-48 object-contain border border-gray-300 rounded-lg shadow-sm"
              onError={(e) => {
                console.warn(`Image not found: B${currentQuestion.question_number}.png`);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        
        <div className="text-lg font-medium text-gray-800 mb-6 leading-relaxed">
          {currentQuestion.question_number}. {currentQuestion.question[language]}
        </div>
        <div className="space-y-3 mt-4">
          {currentQuestion.options[language].map((option, index) => {
            const correctAnswerIndex = typeof currentQuestion.correct_answer === 'string' 
              ? currentQuestion.correct_answer.charCodeAt(0) - 97
              : currentQuestion.correct_answer;
            
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion.question_number, index)}
                disabled={showFeedback}
                className={`w-full text-left p-4 rounded-lg transition-all duration-200 border-2 ${
                  showFeedback 
                    ? index === correctAnswerIndex 
                      ? 'bg-green-50 border-green-400 text-green-800' 
                      : index === userAnswer?.selectedOption 
                        ? 'bg-red-50 border-red-400 text-red-800' 
                        : 'bg-gray-50 border-gray-200 text-gray-600' 
                    : userAnswer?.selectedOption === index 
                      ? 'bg-blue-50 border-blue-400 text-blue-800' 
                      : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-800'
                }`}
              >
                <div className="flex items-start">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm font-bold ${
                    showFeedback
                      ? index === correctAnswerIndex
                        ? 'bg-green-600 text-white'
                        : index === userAnswer?.selectedOption
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      : userAnswer?.selectedOption === index
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="font-medium leading-relaxed flex-1">{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className={`p-4 rounded-lg mb-6 border-l-4 ${
          userAnswer?.isCorrect 
            ? 'bg-green-50 border-green-400' 
            : 'bg-red-50 border-red-400'
        }`}>
          <p className={`font-semibold text-lg mb-2 ${
            userAnswer?.isCorrect ? 'text-green-700' : 'text-red-700'
          }`}>
            {userAnswer?.isCorrect ? '✅ Correct! Well done.' : '❌ Incorrect Answer'}
          </p>
          {!userAnswer?.isCorrect && (
            <p className="text-red-600 font-medium">
              The correct answer is: <span className="font-bold">
                {String.fromCharCode(65 + (typeof currentQuestion.correct_answer === 'string' 
                  ? currentQuestion.correct_answer.charCodeAt(0) - 97
                  : currentQuestion.correct_answer))}
              </span> - {currentQuestion.options[language][typeof currentQuestion.correct_answer === 'string' 
                ? currentQuestion.correct_answer.charCodeAt(0) - 97
                : currentQuestion.correct_answer]}
            </p>
          )}
        </div>
      )}

      {/* Question Navigation Panel */}
      {showNavigationPanel && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Question Navigation</h3>
          <div className="grid grid-cols-10 gap-2">
            {selectedSection.questions.map((question, index) => {
              const userAnswer = userAnswers.find(answer => answer.questionId === question.question_number);
              const isAnswered = userAnswer !== undefined;
              const isCorrect = userAnswer?.isCorrect;
              const isCurrent = index === currentQuestionIndex;
              
              return (
                <button
                  key={question.question_number}
                  onClick={() => handleQuestionJump(index)}
                  className={`w-8 h-8 text-xs font-medium rounded transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-blue-600 text-white border-2 border-blue-800'
                      : isAnswered
                      ? isCorrect
                        ? 'bg-green-100 text-green-800 border border-green-300 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 border border-red-300 hover:bg-red-200'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-center mt-3 space-x-4 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span>Current</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
              <span>Correct</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
              <span>Incorrect</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
              <span>Unanswered</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <div>
          <button 
            onClick={() => setSelectedSection(null)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors mr-2 cursor-pointer"
          >
            Back to Sections
          </button>
          <button 
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded-md ${currentQuestionIndex === 0 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors cursor-pointer'}`}
          >
            Previous
          </button>
        </div>
        <button 
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === selectedSection.questions.length - 1}
          className={`px-6 py-2 rounded-md ${currentQuestionIndex === selectedSection.questions.length - 1 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PracticeMode;