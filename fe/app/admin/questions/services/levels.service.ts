import { Level, LevelProgress, ApiResponse, LevelProgressSubmission, UserProgress } from "@/lib/types"
import { apiClient } from "@/lib/services/api-client"

export class LevelsService {
    async getAllLevels(): Promise<ApiResponse<Level[]>> {
        try {
            const response = await apiClient.get<{ success: boolean; levels: Level[] }>(
                '/levels'
            );
            return {
                success: true,
                data: response.data.levels
            };
        } catch (error: any) {
            return {
                success: false,
                data: [],
                error: {
                    status: error.response?.status || 500,
                    message: error.response?.data?.error || 'Failed to fetch levels'
                }
            };
        }
    }

    async getUserProgress(): Promise<ApiResponse<{ [levelId: string]: UserProgress }>> {
        try {
            const response = await apiClient.get<{ 
                success: boolean; 
                data: { [levelId: string]: UserProgress }
            }>('/levels/progress');
            
            return {
                success: true,
                data: response.data.data
            };
        } catch (error: any) {
            return {
                success: false,
                data: {},
                error: {
                    status: error.response?.status || 500,
                    message: error.response?.data?.error || 'Failed to fetch user progress'
                }
            };
        }
    }

    async submitLevelProgress(levelId: string, progress: LevelProgressSubmission): Promise<ApiResponse<void>> {
        try {
            await apiClient.post<{ success: boolean }>(
                `/levels/${levelId}/progress`,
                progress
            );
            return {
                success: true,
                data: undefined
            };
        } catch (error: any) {
            return {
                success: false,
                data: undefined,
                error: {
                    status: error.response?.status || 500,
                    message: error.response?.data?.error || 'Failed to submit level progress'
                }
            };
        }
    }

    async getLevelById(levelId: string): Promise<ApiResponse<Level>> {
        try {
            const response = await apiClient.get<{ success: boolean; level: Level }>(
                `/levels/${levelId}`
            );
            return {
                success: true,
                data: response.data.level
            };
        } catch (error: any) {
            return {
                success: false,
                data: null as any,
                error: {
                    status: error.response?.status || 500,
                    message: error.response?.data?.error || 'Failed to fetch level'
                }
            };
        }
    }

    async updateLevel(levelId: string, levelData: Partial<Level>): Promise<ApiResponse<Level>> {
        try {
            const response = await apiClient.put<{ success: boolean; level: Level }>(
                `/levels/${levelId}`,
                levelData
            );
            return {
                success: true,
                data: response.data.level
            };
        } catch (error: any) {
            return {
                success: false,
                data: null as any,
                error: {
                    status: error.response?.status || 500,
                    message: error.response?.data?.error || 'Failed to update level'
                }
            };
        }
    }

    async createLevel(levelData: Omit<Level, 'id'>): Promise<ApiResponse<Level>> {
        try {
            const response = await apiClient.post<{ success: boolean; level: Level }>(
                '/levels',
                levelData
            );
            return {
                success: true,
                data: response.data.level
            };
        } catch (error: any) {
            return {
                success: false,
                data: null as any,
                error: {
                    status: error.response?.status || 500,
                    message: error.response?.data?.error || 'Failed to create level'
                }
            };
        }
    }

    async deleteLevel(levelId: string): Promise<ApiResponse<void>> {
        try {
            await apiClient.delete<{ success: boolean }>(
                `/levels/${levelId}`
            );
            return {
                success: true,
                data: undefined
            };
        } catch (error: any) {
            return {
                success: false,
                data: undefined,
                error: {
                    status: error.response?.status || 500,
                    message: error.response?.data?.error || 'Failed to delete level'
                }
            };
        }
    }
} 