'use client';

import { useState, useEffect } from 'react';
import { Section, Question } from '../types';

interface FlashcardsModeProps {
  category: 'B' | 'K';
  onExit: () => void;
}

const FlashcardsMode: React.FC<FlashcardsModeProps> = ({ category, onExit }) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'ne'>('en');
  const [showNavigationPanel, setShowNavigationPanel] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [cardStartTime, setCardStartTime] = useState(Date.now());
  const [cardTimes, setCardTimes] = useState<number[]>([]);

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

  // Track total time
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Reset card start time when card or section changes
  useEffect(() => {
    setCardStartTime(Date.now());
  }, [currentQuestionIndex, selectedSection]);

  // Force re-render every second for real-time timer display
  useEffect(() => {
    const interval = setInterval(() => {
      // This will trigger a re-render to update the current card timer
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSectionSelect = (section: Section) => {
    setSelectedSection(section);
    setCurrentQuestionIndex(0);
    setFlipped(false);
    // Reset timer states
    setTotalTime(0);
    setCardStartTime(Date.now());
    setCardTimes([]);
  };

  const handleNextQuestion = () => {
    if (selectedSection && currentQuestionIndex < selectedSection.questions.length - 1) {
      // Record time spent on current card
      const timeSpent = Math.floor((Date.now() - cardStartTime) / 1000);
      setCardTimes(prev => {
        const newTimes = [...prev];
        newTimes[currentQuestionIndex] = timeSpent;
        return newTimes;
      });
      
      setCurrentQuestionIndex(prev => prev + 1);
      setFlipped(false);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      // Record time spent on current card
      const timeSpent = Math.floor((Date.now() - cardStartTime) / 1000);
      setCardTimes(prev => {
        const newTimes = [...prev];
        newTimes[currentQuestionIndex] = timeSpent;
        return newTimes;
      });
      
      setCurrentQuestionIndex(prev => prev - 1);
      setFlipped(false);
    }
  };

  const toggleFlip = () => {
    setFlipped(!flipped);
  };

  const handleCardJump = (index: number) => {
    // Record time spent on current card
    const timeSpent = Math.floor((Date.now() - cardStartTime) / 1000);
    setCardTimes(prev => {
      const newTimes = [...prev];
      newTimes[currentQuestionIndex] = timeSpent;
      return newTimes;
    });
    
    setCurrentQuestionIndex(index);
    setFlipped(false);
    setShowNavigationPanel(false);
  };

  const getCurrentQuestion = (): Question | null => {
    return selectedSection?.questions[currentQuestionIndex] || null;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentCardTime = (): number => {
    return Math.floor((Date.now() - cardStartTime) / 1000);
  };

  const getAverageTimePerCard = (): number => {
    const completedTimes = cardTimes.filter(time => time > 0);
    if (completedTimes.length === 0) return 0;
    return Math.floor(completedTimes.reduce((sum, time) => sum + time, 0) / completedTimes.length);
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Flashcards Mode</h2>
        
        {/* Language Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Language:</label>
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-md transition-colors ${
                language === 'en'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('ne')}
              className={`px-4 py-2 rounded-md transition-colors ${
                language === 'ne'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              नेपाली
            </button>
          </div>
        </div>
        
        <p className="mb-6 text-gray-600">
          Select a section to review questions as flashcards. Click on a card to flip between question and answer.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {sections.map((section, index) => (
            <button
              key={index}
              onClick={() => handleSectionSelect(section)}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-md text-left transition-colors cursor-pointer"
            >
              <h3 className="font-medium text-blue-700">
                {section.section_name[language]}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
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
        <h2 className="text-xl font-semibold text-gray-800">
          {selectedSection.section_name[language]}
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNavigationPanel(!showNavigationPanel)}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors cursor-pointer"
          >
            {showNavigationPanel ? 'Hide Panel' : 'Show Panel'}
          </button>
          <div className="text-sm text-gray-600">
            Card {currentQuestionIndex + 1} of {selectedSection.questions.length}
          </div>
        </div>
      </div>

      {/* Language Selection */}
      <div className="mb-4">
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 text-sm rounded-md transition-colors cursor-pointer ${
              language === 'en'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('ne')}
            className={`px-3 py-1 text-sm rounded-md transition-colors cursor-pointer ${
              language === 'ne'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            नेपाली
          </button>
        </div>
      </div>

      {/* Timer Display */}
      <div className="flex justify-center gap-6 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <span className="font-medium">Total Time:</span>
          <span className="text-blue-600 font-mono">{formatTime(totalTime)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium">Avg per Card:</span>
          <span className="text-green-600 font-mono">{formatTime(getAverageTimePerCard())}</span>
        </div>
      </div>

      {/* Flashcard with flip animation */}
      <div className="perspective-1000 mb-6">
        <div 
          onClick={toggleFlip}
          className={`cursor-pointer relative w-full min-h-[250px] transition-transform duration-700 transform-style-preserve-3d ${
            flipped ? 'rotate-y-180' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front of card (Question) */}
          <div 
            className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-6 flex items-center justify-center backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-center">
              <div className="text-sm text-blue-600 mb-3 font-medium">Question {currentQuestion.question_number}</div>
              
              {/* Traffic Symbol Image for questions 416-500 */}
              {currentQuestion.question_number >= 416 && currentQuestion.question_number <= 500 && (
                <div className="mb-4 flex justify-center">
                  <img 
                    src={`/assets/icons/B${currentQuestion.question_number}.png`}
                    alt={`Traffic symbol for question ${currentQuestion.question_number}`}
                    className="max-w-[200px] max-h-[150px] object-contain rounded-lg shadow-sm"
                    onError={(e) => {
                      console.warn(`Image not found: B${currentQuestion.question_number}.png`);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="text-lg font-medium text-gray-800 leading-relaxed">
                {currentQuestion.question[language]}
              </div>
              <div className="mt-4 text-sm text-gray-500">Click to reveal answer</div>
            </div>
          </div>
          
          {/* Back of card (Answer) */}
          <div 
            className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg p-6 flex items-center justify-center backface-hidden"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="text-center">
              <div className="text-sm text-green-600 mb-3 font-medium">Correct Answer</div>
              <div className="text-xl font-bold text-green-700 mb-2">
                Option {String.fromCharCode(65 + (typeof currentQuestion.correct_answer === 'string' 
                  ? currentQuestion.correct_answer.charCodeAt(0) - 97
                  : currentQuestion.correct_answer))}
              </div>
              <div className="text-lg font-medium text-gray-800 leading-relaxed">
                {currentQuestion.options[language][typeof currentQuestion.correct_answer === 'string' 
                  ? currentQuestion.correct_answer.charCodeAt(0) - 97
                  : currentQuestion.correct_answer]}
              </div>
              <div className="mt-4 text-sm text-gray-500">Click to see question again</div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
      
      <div className="text-center mb-6">
        <p className="text-sm text-gray-500">Click the card to flip</p>
      </div>

      {/* Card Navigation Panel */}
      {showNavigationPanel && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-sm font-medium text-gray-700 mb-3">Card Navigation</div>
          <div className="grid grid-cols-10 gap-2 mb-4">
            {selectedSection.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => handleCardJump(index)}
                className={`w-8 h-8 text-xs rounded-md transition-colors cursor-pointer ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="flex gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
              <span>Current Card</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-white border border-gray-300 rounded-sm"></div>
              <span>Other Cards</span>
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

export default FlashcardsMode;