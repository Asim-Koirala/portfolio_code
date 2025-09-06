// Types for the license exam application

// Question section type
export interface Section {
  section_name: {
    en: string;
    ne: string;
  };
  questions: Question[];
}

// Question type
export interface Question {
  question_number: number;
  question: {
    en: string;
    ne: string;
  };
  options: {
    en: string[];
    ne: string[];
  };
  correct_answer: string;
  marks: number;
}

// Data structure for the entire question set
export interface QuestionData {
  sections: Section[];
}

// User answer type
export interface UserAnswer {
  questionId: number;
  selectedOption: number;
  isCorrect: boolean;
  marks: number;
}

// Exam configuration
export interface ExamConfig {
  totalQuestions: number;
  totalMarks: number;
  timeLimit: number; // in minutes
  passingMarks: number;
  sectionDistribution: {
    [key: string]: number; // section name: number of questions
  };
}