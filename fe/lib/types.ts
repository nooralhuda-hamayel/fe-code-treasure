//used for levels pages user and admin
// Question Types
export type QuestionType = 'fill-gap' | 'drag-drop' | 'typed-gap';
//   language: "javascript" | "typescript" | "python" | "css" | "sql"

// Base Types
export type ID = number;

/**
 * Base interface for all entities
 */
export interface BaseEntity {
  id: ID;
  created_at: Date;
  updated_at: Date;
}

/**
 * Standard API error format
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  status?: number;
}

/**
 * Standard API response format
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

/**
 * Difficulty level enumeration
 */
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * Programming language types supported
 */
export type ProgrammingLanguage = 'javascript' | 'typescript' | 'python' | 'css' | 'sql';

/**
 * Level entity representing a game level
 * @extends BaseEntity
 */
export interface Level extends BaseEntity {
  name: string;
  description: string;
  difficulty: Difficulty;
  order: number;
  time_limit: number;
  questions_count: number;
  required_score: number;
  map_image: string | null;
  reward_coins: number;
  is_completed?: boolean;
  progress?: LevelProgress;
  rate?: number;
}

/**
 * Base question interface shared between frontend and backend
 * @extends BaseEntity
 */
export interface BaseQuestion extends BaseEntity {
  type: QuestionType;
  text: string;
  description: string;
  level_id: ID;
  points: number;
  language: ProgrammingLanguage;
  order: number;
  hint?: string;
  explanation?: string;
}

/**
 * Fill in the gap question type
 * @extends BaseQuestion
 */
export interface FillGapQuestion extends BaseQuestion {
  type: 'fill-gap';
  code_snippet: string;
  options: string[];
  correct_answer: string;
}

/**
 * Drag and drop question type
 * @extends BaseQuestion
 */
export interface DragDropQuestion extends BaseQuestion {
  type: 'drag-drop';
  code_blocks: string[];
  correct_order: number[];
}

/**
 * Typed gap question type
 * @extends BaseQuestion
 */
export interface TypedGapQuestion extends BaseQuestion {
  type: 'typed-gap';
  code_snippet: string;
  correct_answer: string;
}

export type Question = FillGapQuestion | DragDropQuestion | TypedGapQuestion;

/**
 * Backend specific question type
 */
export interface BackendQuestion {
  id: ID;
  level_id: ID;
  description: string;
  position_x: number;
  position_y: number;
  ordering: number;
  hint: string | null;
  explanation?: string;
  type: QuestionType;
  code_snippet: string;
  points: number;
  language: ProgrammingLanguage;
  options: BackendOption[];
}

/**
 * Backend option type for questions
 */
export interface BackendOption {
  id: ID;
  label: string;
  is_correct: boolean;
  ordering: number;
}

/**
 * User entity
 * @extends BaseEntity
 */
export interface User extends BaseEntity {
  name: string;
  email: string;
  role: "user" | "admin";
}

/**
 * Level progress tracking
 */
export interface LevelProgress {
  level_id: ID;
  completed: boolean;
  stars: number;
  best_score: number;
  best_time: number;
  attempts: number;
  questions_count: number;
  completed_count: number;
}

/**
 * User progress including unlocked status
 * @extends LevelProgress
 */
export interface UserProgress extends LevelProgress {
  unlocked: boolean;
}

/**
 * Level progress submission data
 */
export interface LevelProgressSubmission {
  score: number;
  stars: number;
  time_spent: number;
  completed: boolean;
  question_stats: Array<{
    question_id: ID;
    stars: number;
    attempts: number;
    used_hint: boolean;
    time_exceeded: boolean;
  }>;
}

/**
 * Question answer data
 */
export interface QuestionAnswer {
  question_id: ID;
  answer: string | number[] | string[];
  is_correct: boolean;
  points: number;
  time_taken: number;
}

/**
 * User statistics
 */
export interface UserStats {
  total_points: number;
  completed_levels: number;
  total_stars: number;
  average_score: number;
  total_time: number;
}

/**
 * Type validation functions
 */
export const typeValidators = {
  isLevel: (data: unknown): data is Level => {
    const level = data as Level;
    return (
      typeof level.id === 'number' &&
      typeof level.name === 'string' &&
      typeof level.description === 'string' &&
      ['easy', 'medium', 'hard'].includes(level.difficulty) &&
      typeof level.order === 'number' &&
      typeof level.time_limit === 'number' &&
      typeof level.required_score === 'number'
    );
  },

  isQuestion: (data: unknown): data is Question => {
    const question = data as Question;
    return (
      typeof question.id === 'number' &&
      typeof question.text === 'string' &&
      typeof question.level_id === 'number' &&
      ['fill-gap', 'drag-drop', 'typed-gap'].includes(question.type)
    );
  },

  isUser: (data: unknown): data is User => {
    const user = data as User;
    return (
      typeof user.id === 'number' &&
      typeof user.name === 'string' &&
      typeof user.email === 'string' &&
      ['user', 'admin'].includes(user.role)
    );
  }
};

/**
 * Backend answer format
 */
export interface BackendAnswer {
  option_id?: ID;
  answer: string | number[] | string[];
}

/**
 * Backend answer response format
 */
export interface BackendAnswerResponse {
  correct: boolean;
  points: number;
}

/**
 * Question conversion interface
 */
export interface QuestionConversion {
  fromBackend: (question: BackendQuestion) => Question;
  toBackend: (question: Question) => Omit<BackendQuestion, 'id'>;
}

/**
 * Extended user progress interface with base entity fields
 */
export interface ExtendedUserProgress extends UserProgress, BaseEntity {} 