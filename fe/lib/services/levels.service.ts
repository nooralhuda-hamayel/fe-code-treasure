import { BaseService } from './base.service';
import { Level, ApiResponse, LevelProgress, LevelProgressSubmission, UserProgress, ID } from '../types';
import { apiClient } from './api-client';

/**
 * Service for managing game levels
 */
export class LevelsService extends BaseService<Level> {
  constructor() {
    super('/levels');
  }

  /**
   * Get user's progress for all levels
   */
  async getUserProgress(): Promise<ApiResponse<{ [levelId: string]: UserProgress }>> {
    try {
      const response = await apiClient.get<{ 
        success: boolean; 
        data: { [levelId: string]: UserProgress }
      }>(`${this.endpoint}/progress`);
      
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Submit user's progress for a specific level
   */
  async submitLevelProgress(levelId: ID, progress: LevelProgressSubmission): Promise<ApiResponse<void>> {
    try {
      await apiClient.post<{ success: boolean }>(
        `${this.endpoint}/${levelId}/progress`,
        progress
      );
      return {
        success: true,
        data: undefined
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get level progress for a specific level
   */
  async getLevelProgress(levelId: ID): Promise<ApiResponse<LevelProgress>> {
    try {
      const response = await apiClient.get<{ progress: LevelProgress }>(
        `${this.endpoint}/${levelId}/progress`
      );
      return {
        success: true,
        data: response.data.progress
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
} 