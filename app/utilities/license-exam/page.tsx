'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Use dynamic imports with loading priority
const UtilityLayout = dynamic(() => import('../../../components/UtilityLayout'), {
  loading: () => <div className="min-h-screen"></div>,
});

// Dynamically import components to reduce initial load time
const ExamMode = dynamic(() => import('./components/ExamMode'), {
  loading: () => <div className="animate-pulse bg-gray-100 h-64 rounded-lg"></div>,
});

const PracticeMode = dynamic(() => import('./components/PracticeMode'), {
  loading: () => <div className="animate-pulse bg-gray-100 h-64 rounded-lg"></div>,
});

const FlashcardsMode = dynamic(() => import('./components/FlashcardsMode'), {
  loading: () => <div className="animate-pulse bg-gray-100 h-64 rounded-lg"></div>,
});

export default function LicenseExam() {
  // State for tracking current mode
  const [currentMode, setCurrentMode] = useState<string>('home');
  const [category, setCategory] = useState<'B' | 'K' | null>(null); // B or K
  const [navigationStack, setNavigationStack] = useState<string[]>(['home']);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [pendingMode, setPendingMode] = useState<string>('');

  // Handle navigation with stack tracking
  const navigateToMode = (mode: string) => {
    if (!category) {
      setPendingMode(mode);
      setShowCategoryModal(true);
      return;
    }
    setNavigationStack(prev => [...prev, mode]);
    setCurrentMode(mode);
  };

  // Handle category selection from modal
  const handleCategorySelect = (selectedCategory: 'B' | 'K') => {
    setCategory(selectedCategory);
    setShowCategoryModal(false);
    if (pendingMode) {
      setNavigationStack(prev => [...prev, pendingMode]);
      setCurrentMode(pendingMode);
      setPendingMode('');
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowCategoryModal(false);
    setPendingMode('');
  };

  // Handle going back to previous screen
  const handleGoBack = () => {
    if (navigationStack.length > 1) {
      const newStack = [...navigationStack];
      newStack.pop(); // Remove current screen
      const previousScreen = newStack[newStack.length - 1];
      setNavigationStack(newStack);
      setCurrentMode(previousScreen);
    } else {
      // If no previous screen, go to home
      setCurrentMode('home');
      setNavigationStack(['home']);
    }
  };

  // Handle returning to home screen
  const handleBackToHome = () => {
    setCurrentMode('home');
    setNavigationStack(['home']);
  };

  // Render different modes based on currentMode state
  const renderContent = () => {
    switch (currentMode) {
      case 'exam':
        return (
          <ExamMode 
            category={category} 
            onExit={handleGoBack} 
          />
        );
      case 'practice':
        return (
          <PracticeMode 
            category={category} 
            onExit={handleGoBack} 
          />
        );
      case 'flashcards':
        return (
          <FlashcardsMode 
            category={category} 
            onExit={handleGoBack} 
          />
        );
      default:
        return (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to Nepal License Trial Exam Preparation</h2>
              <p className="text-gray-600 mb-6">
                This tool helps you prepare for the Nepali license trial written exam. Choose a category and mode below to get started:
              </p>
              
              {/* Category Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Select License Category</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setCategory('B')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 cursor-pointer ${
                      category === 'B'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                    }`}
                  >
                    Category B (Car/Jeep)
                  </button>
                  <button
                    onClick={() => setCategory('K')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 cursor-pointer ${
                      category === 'K'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                    }`}
                  >
                    Category K (Motorcycle)
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {/* Exam Mode Card */}
                <div 
                  className="bg-blue-50 rounded-lg p-6 cursor-pointer hover:shadow-md transition-all duration-300"
                  onClick={() => navigateToMode('exam')}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <i className="fas fa-clipboard-check text-blue-700 text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Exam Mode</h3>
            <p className="text-gray-600">
                    Simulates the actual exam with 25 questions, 30-minute timer, and automatic scoring.
                  </p>
                </div>
                
                {/* Practice Mode Card */}
                <div 
                  className="bg-green-50 rounded-lg p-6 cursor-pointer hover:shadow-md transition-all duration-300"
                  onClick={() => navigateToMode('practice')}
                >
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <i className="fas fa-book-open text-green-700 text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Practice Mode</h3>
            <p className="text-gray-600">
                    Go through all questions section-wise with instant feedback after each answer.
                  </p>
                </div>
                
                {/* Flashcards Mode Card */}
                <div 
                  className="bg-yellow-50 rounded-lg p-6 cursor-pointer hover:shadow-md transition-all duration-300"
                  onClick={() => navigateToMode('flashcards')}
                >
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
              <i className="fas fa-clone text-yellow-700 text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Flashcards</h3>
            <p className="text-gray-600">
                    Review questions one at a time with a "Flip for Answer" option for quick revision.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">About This Tool</h3>
          <p className="text-gray-600 mb-4">
                  The Nepal License Trial Exam consists of 25 questions from different sections, with a passing score of 60 marks out of 100.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Exam Structure:</h4>
          <ul className="list-disc pl-5 text-gray-600 text-sm">
                      <li>6 questions from Knowledge Related to Driving</li>
                      <li>5 questions from Knowledge Related to Vehicular Act/Regulation</li>
                      <li>3 questions from Technical or Mechanical Knowledge of Vehicle</li>
                      <li>2 questions from Conceptual Knowledge Related to Environmental Pollution</li>
                      <li>3 questions from Knowledge Related to Accidental Awareness</li>
                      <li>6 questions from Knowledge Related to Traffic Signals</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Available Options:</h4>
          <div className="text-gray-600 text-sm">
                      <p className="mb-1"><strong>Categories:</strong> B (Car/Jeep), K (Motorcycle)</p>
                      <p><strong>Languages:</strong> English, नेपाली</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <UtilityLayout
      title="Nepal License Trial Exam"
      description="Prepare for your Nepali license trial written test with practice questions and mock exams."
      onBack={currentMode === 'home' ? undefined : handleGoBack}
    >
      {renderContent()}
      
      {/* Category Selection Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Select License Category</h2>
        <p className="text-gray-600 mb-6">
              Please select a license category to continue with the exam mode.
            </p>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleCategorySelect('B')}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium"
              >
                Category B (Car/Jeep)
              </button>
              <button
                onClick={() => handleCategorySelect('K')}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer font-medium"
              >
                Category K (Motorcycle)
              </button>
            </div>
            
            <button
              onClick={handleModalClose}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </UtilityLayout>
  );
}