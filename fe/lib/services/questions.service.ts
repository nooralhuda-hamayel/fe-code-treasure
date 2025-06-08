import { BaseService } from './base.service';
import { Question, ApiResponse, QuestionAnswer, ID } from '../types';
import { apiClient } from './api-client';

/**
 * Service for managing quiz questions
 */
export class QuestionsService extends BaseService<Question> {
  constructor() {
    super('/questions');
  }

  /**
   * Get all questions for a specific level
   */
  async getLevelQuestions(levelId: ID): Promise<ApiResponse<Question[]>> {
    try {
      const response = await apiClient.get<{ success: boolean; questions: Question[] }>(
        `/levels/${levelId}/questions`
      );
      return {
        success: true,
        data: response.data.questions
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Submit an answer for a question
   */
  async submitAnswer(questionId: ID, answer: any): Promise<ApiResponse<QuestionAnswer>> {
    try {
      const response = await apiClient.post<{ success: boolean; data: QuestionAnswer }>(
        `${this.endpoint}/${questionId}/answer`,
        { answer }
      );
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get question hint
   */
  async getHint(questionId: ID): Promise<ApiResponse<string>> {
    try {
      const response = await apiClient.get<{ success: boolean; hint: string }>(
        `${this.endpoint}/${questionId}/hint`
      );
      return {
        success: true,
        data: response.data.hint
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
} 