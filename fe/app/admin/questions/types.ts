export type QuestionType = 'fill-gap' | 'drag-drop' | 'typed-gap';

export interface QuestionProgress {
  userId: string;
  questionId: string;
  currentStars: number;
  maxStars: number;
  attempts: number;
  usedHint: boolean;
  startTime: Date;
  completed: boolean;
  timeSpent: number;
}

export interface QuestionAttempt {
  userId: string;
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  timeSpent: number;
  starsLost: number;
  attemptNumber: number;
}

export interface QuestionHint {
  hint: string;
  cost: number;
}

export const QUESTION_CONSTANTS = {
  MAX_STARS: 5,
  MIN_STARS: 1,
  HINT_COST: 1,
  TIME_LIMIT: 60, // in seconds
  TIME_PENALTY: 2,
  WRONG_ANSWER_PENALTY: 1
} as const;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  text: string;
  description: string;
  level_id: string;
  points: number;
  language: string;
  order: number;
  explanation?: string;
  hint?: string;
  created_at: string;
  updated_at: string;
}

export interface FillGapQuestion extends BaseQuestion {
  type: 'fill-gap';
  codeSnippet: string;
  options: string[];
  correctAnswer: string;
}

export interface DragDropQuestion extends BaseQuestion {
  type: 'drag-drop';
  codeBlocks: string[];
  correctOrder: number[];
}

export interface TypedGapQuestion extends BaseQuestion {
  type: 'typed-gap';
  codeSnippet: string;
  correctAnswer: string;
}

export type Question = FillGapQuestion | DragDropQuestion | TypedGapQuestion;

export interface Level {
  id: string;
  name: string;
  description: string;
  order: number;
  difficulty: 'easy' | 'medium' | 'hard';
  requiredScore: number;
  timeLimit: number;
  rewardPoints: number;
  totalQuestions: number;
  map_image?: string;
}

export interface LevelProgress {
  level_id: string;
  completed: boolean;
  stars: number;
  bestScore: number;
  bestTime: number;
  attempts: number;
  questions_completed: number;
  total_questions: number;
}

export interface UserProgress {
  userId: string;
  levels: Record<string, LevelProgress>;
  totalStars: number;
  totalScore: number;
}

export interface AnswerResult {
  questionId: string;
  answer: string | string[];
  correct: boolean;
}

export interface QuestionResponse {
  success: boolean;
  data?: Question;
  error?: string;
}

export interface QuestionsResponse {
  success: boolean;
  data?: Question[];
  error?: string;
}

// أنواع إضافية للمستخدم والمستويات يمكن إضافتها هنا
export interface BackendOption {
  id: number;
  label: string;
  is_correct: boolean;
  ordering: number;
}

export interface BackendQuestion {
  id: number;
  description: string;
  position_x: number;
  position_y: number;
  ordering: number;
  hint: string | null;
  type: QuestionType;
  points: number;
  language: string;
  code_snippet: string;
  options: BackendOption[];
}

export interface BackendAnswer {
  option_id?: number;
  answer: string | number[];
}

export interface BackendAnswerResponse {
  correct: boolean;
  points: number;
} 