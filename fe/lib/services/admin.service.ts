//used for admin levels page
import { Level, User, Question, ApiResponse, ID } from '../types';
import { apiClient } from './api-client';
import { BaseService } from './base.service';

interface DashboardStats {
    total_users: number;
    active_users: number;
    completed_levels: number;
    total_questions: number;
    average_score: number;
}

/**
 * Service for admin operations
 */
export class AdminService extends BaseService<Level> {
    constructor() {
        super('/admin');
    }

    /**
     * Get dashboard statistics
     */
    async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
        try {
            const response = await apiClient.get<DashboardStats>(`${this.endpoint}/stats`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * User management methods
     */
    async getAllUsers(): Promise<ApiResponse<User[]>> {
        try {
            const response = await apiClient.get<{ users: User[] }>(`${this.endpoint}/users`);
            return {
                success: true,
                data: response.data.users
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    async createAdmin(userData: { email: string; password: string; name: string }): Promise<ApiResponse<User>> {
        try {
            const response = await apiClient.post<{ user: User }>(`${this.endpoint}/users`, userData);
            return {
                success: true,
                data: response.data.user
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    async deleteUser(userId: ID): Promise<ApiResponse<void>> {
        try {
            await apiClient.delete(`${this.endpoint}/users/${userId}`);
            return {
                success: true
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Level management methods
     */
    async createLevel(levelData: Omit<Level, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Level>> {
        try {
            const response = await apiClient.post<{ level: Level }>(`${this.endpoint}/levels`, levelData);
            return {
                success: true,
                data: response.data.level
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    async updateLevel(levelId: ID, levelData: Partial<Level>): Promise<ApiResponse<Level>> {
        try {
            const response = await apiClient.put<{ level: Level }>(`${this.endpoint}/levels/${levelId}`, levelData);
            return {
                success: true,
                data: response.data.level
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    async deleteLevel(levelId: ID): Promise<ApiResponse<void>> {
        try {
            await apiClient.delete(`${this.endpoint}/levels/${levelId}`);
            return {
                success: true
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Question management methods
     */
    async getAllQuestions(): Promise<ApiResponse<Question[]>> {
        try {
            const response = await apiClient.get<{ questions: Question[] }>(`${this.endpoint}/questions`);
            return {
                success: true,
                data: response.data.questions
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    async createQuestion(questionData: Omit<Question, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Question>> {
        try {
            const response = await apiClient.post<{ question: Question }>(`${this.endpoint}/questions`, questionData);
            return {
                success: true,
                data: response.data.question
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    async updateQuestion(id: ID, questionData: Partial<Question>): Promise<ApiResponse<Question>> {
        try {
            const response = await apiClient.put<{ question: Question }>(`${this.endpoint}/questions/${id}`, questionData);
            return {
                success: true,
                data: response.data.question
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    async deleteQuestion(id: ID): Promise<ApiResponse<void>> {
        try {
            await apiClient.delete(`${this.endpoint}/questions/${id}`);
            return {
                success: true
            };
        } catch (error) {
            return this.handleError(error);
        }
    }
}

// Export singleton instance
export const adminService = new AdminService(); 