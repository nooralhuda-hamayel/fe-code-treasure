import { QuestionAttempt, QuestionProgress, QUESTION_CONSTANTS } from '../types';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://be-code-treasure.onrender.com/api';

export class QuestionProgressService {
  async initializeQuestion(userId: string, questionId: string): Promise<QuestionProgress> {
    const response = await fetch(`${API_BASE_URL}/api/questions/${questionId}/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        currentStars: QUESTION_CONSTANTS.MAX_STARS,
        maxStars: QUESTION_CONSTANTS.MAX_STARS,
      })
    });

    if (!response.ok) {
      throw new Error('Failed to initialize question progress');
    }

    return await response.json();
  }

  async submitAttempt(
    userId: string,
    questionId: string,
    answer: string | string[],
    isCorrect: boolean,
    timeSpent: number
  ): Promise<QuestionAttempt> {
    let starsLost = 0;
    
    if (timeSpent > QUESTION_CONSTANTS.TIME_LIMIT) {
      starsLost += QUESTION_CONSTANTS.TIME_PENALTY;
    }

    if (!isCorrect) {
      starsLost += QUESTION_CONSTANTS.WRONG_ANSWER_PENALTY;
    }

    const response = await fetch(`${API_BASE_URL}/api/questions/${questionId}/attempt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        answer,
        isCorrect,
        timeSpent,
        starsLost
      })
    });

    if (!response.ok) {
      throw new Error('Failed to submit attempt');
    }

    return await response.json();
  }

  async useHint(userId: string, questionId: string): Promise<QuestionProgress> {
    const response = await fetch(`${API_BASE_URL}/api/questions/${questionId}/hint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        hintCost: QUESTION_CONSTANTS.HINT_COST
      })
    });

    if (!response.ok) {
      throw new Error('Failed to use hint');
    }

    return await response.json();
  }

  async canProceedToNextQuestion(userId: string, questionId: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/api/questions/${questionId}/progress?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to check progress');
    }

    const progress = await response.json();
    return progress.completed;
  }

  async getQuestionProgress(userId: string, questionId: string): Promise<QuestionProgress> {
    const response = await fetch(`${API_BASE_URL}/api/questions/${questionId}/progress?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get progress');
    }

    return await response.json();
  }
} 