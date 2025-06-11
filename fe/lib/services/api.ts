//used for levels page 
import { 
  Level, 
  LevelProgress, 
  Question,
  BackendQuestion,
  BackendOption,
  ApiResponse,
  LevelProgressSubmission,
  DragDropQuestion,
  TypedGapQuestion,
  FillGapQuestion,
  User,
  ExtendedUserProgress,
  UserStats,
  ApiError,
  BackendAnswer,
  BackendAnswerResponse,
  BaseQuestion,
  QuestionConversion,
  ID
} from "@/lib/types"
import { apiClient } from "@/lib/services/api-client"
import { BaseService } from "./base.service"

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://be-code-treasure.onrender.com/api';

// Axios instance configuration
const api = apiClient;

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling authentication
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        await authService.refreshToken();
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Error handling
type ApiErrorResponse = {
  response?: {
    status: number;
    data?: {
      message?: string;
      error?: any;
    };
  };
};

const handleApiError = (error: unknown): ApiResponse<any> => {
  const apiError = error as ApiErrorResponse;
  if (apiError.response) {
    return {
      success: false,
      data: null,
      error: {
        code: apiError.response.status.toString(),
        status: apiError.response.status,
        message: apiError.response.data?.message || 'An error occurred',
        details: apiError.response.data?.error
      }
    };
  }
  
  return {
    success: false,
    data: null,
    error: {
      code: 'NETWORK_ERROR',
      status: 500,
      message: 'Network error or server is unreachable'
    }
  };
};

// تعريف وظائف التحويل
const questionConversion = {
  fromBackend: (q: BackendQuestion): Question => {
    const baseQuestion = {
      id: q.id,
      level_id: q.level_id,
      text: q.description,
      points: q.points || 1,
      order: q.ordering,
      description: q.description,
      created_at: new Date(),
      updated_at: new Date(),
      language: q.language,
      hint: q.hint || undefined,
      explanation: q.explanation
    };

    if (q.type === 'drag-drop') {
      return {
        ...baseQuestion,
        type: 'drag-drop' as const,
        code_blocks: q.options.map(opt => opt.label),
        correct_order: q.options
          .sort((a, b) => a.ordering - b.ordering)
          .map(opt => opt.id)
      } as DragDropQuestion;
    } else if (q.type === 'typed-gap' || q.options.length === 1) {
      return {
        ...baseQuestion,
        type: 'typed-gap' as const,
        code_snippet: q.code_snippet || q.description,
        correct_answer: q.options[0]?.label || ''
      } as TypedGapQuestion;
    } else {
      return {
        ...baseQuestion,
        type: 'fill-gap' as const,
        code_snippet: q.code_snippet || q.description,
        options: q.options.map(opt => opt.label),
        correct_answer: q.options.find(opt => opt.is_correct)?.label || ''
      } as FillGapQuestion;
    }
  },

  toBackend: (q: Question): Omit<BackendQuestion, 'id'> => {
    const baseQuestion = {
      level_id: q.level_id,
      description: q.text,
      position_x: 0,
      position_y: 0,
      ordering: q.order,
      hint: q.hint || null,
      explanation: q.explanation,
      type: q.type,
      code_snippet: '',
      points: q.points,
      language: q.language
    };

    if (q.type === 'drag-drop') {
      const dragDropQ = q as DragDropQuestion;
      return {
        ...baseQuestion,
        code_snippet: '',
        options: dragDropQ.code_blocks.map((block: string, index: number) => ({
          id: dragDropQ.correct_order[index],
          label: block,
          is_correct: true,
          ordering: index + 1
        }))
      };
    } else if (q.type === 'typed-gap') {
      const typedQ = q as TypedGapQuestion;
      return {
        ...baseQuestion,
        code_snippet: typedQ.code_snippet,
        options: [{
          id: 1,
          label: typedQ.correct_answer,
          is_correct: true,
          ordering: 1
        }]
      };
    } else {
      const fillGapQ = q as FillGapQuestion;
      return {
        ...baseQuestion,
        code_snippet: fillGapQ.code_snippet,
        options: fillGapQ.options.map((option, index) => ({
          id: index + 1,
          label: option,
          is_correct: option === fillGapQ.correct_answer,
          ordering: index + 1
        }))
      };
    }
  }
};

// Auth Services
class AuthService extends BaseService<User> {
  constructor() {
    super('/auth');
  }

  async register(userData: { 
    email: string; 
    password: string; 
    name: string; 
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const response = await apiClient.post<{ user: User; token: string }>('/users', userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const response = await apiClient.post<{ user: User; token: string }>('/auth', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      await apiClient.post('/logout');//------------------------------
      localStorage.removeItem('token');
      return {
        success: true
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    try {
      const response = await apiClient.get<{ token: string }>('/refresh');
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.get<{ user: User }>('/user');//--------------
      return {
        success: true,
        data: response.data.user
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

// Create service instances
export const authService = new AuthService();

// Levels Services
export const levelsService = {
  getLevels: async (): Promise<ApiResponse<Level[]>> => {
    try {
      const response = await apiClient.get<{ levels: Level[] }>('/levels');
      return {
        success: true,
        data: response.data.levels
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  getLevelById: async (id: string): Promise<ApiResponse<Level>> => {
    try {
      const response = await apiClient.get<{ level: Level }>(`/levels/${id}`);
      return {
        success: true,
        data: response.data.level
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  getLevelProgress: async (levelId: string): Promise<ApiResponse<LevelProgress>> => {
    try {
      const response = await apiClient.get<{ progress: LevelProgress }>(`/levels/${levelId}/progress`);
      return {
        success: true,
        data: response.data.progress
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  submitLevelProgress: async (levelId: string, progress: LevelProgressSubmission): Promise<ApiResponse<LevelProgress>> => {
    try {
      const response = await apiClient.post<{ success: boolean; progress: LevelProgress }>(
        `/levels/${levelId}/progress`,
        progress
      );
      return {
        success: true,
        data: response.data.progress
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// Questions Services
export const questionsService = {
  getLevelQuestions: async (levelId: string): Promise<ApiResponse<Question[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<BackendQuestion[]>>(`/levels/${levelId}/questions`);
      const backendQuestions = response.data.data || [];

      // Convert backend questions to frontend format
      const questions = backendQuestions.map(questionConversion.fromBackend);

      return {
        success: true,
        data: questions
      };
    } catch (error) {
      const errorResponse = error as ApiErrorResponse;
      console.error('Error fetching questions:', error);
      return {
        success: false,
        data: [],
        error: {
          code: 'FETCH_QUESTIONS_ERROR',
          status: errorResponse.response?.status || 500,
          message: errorResponse.response?.data?.error || 'Failed to fetch questions'
        }
      };
    }
  },

  submitAnswer: async (questionId: string, answer: any): Promise<ApiResponse<{ correct: boolean; points: number }>> => {
    try {
      const response = await apiClient.put<ApiResponse<{ correct: boolean; points: number }>>(`/questions/${questionId}/answer`, answer);
      return response.data;
    } catch (error) {
      const errorResponse = error as ApiErrorResponse;
      return {
        success: false,
        data: { correct: false, points: 0 },
        error: errorResponse.response?.data?.error || 'Failed to submit answer'
      };
    }
  },

  getHint: async (questionId: string): Promise<ApiResponse<string>> => {
    try {
      const response = await apiClient.get<ApiResponse<string>>(`/questions/${questionId}/hint`);
      return response.data;
    } catch (error) {
      const errorResponse = error as ApiErrorResponse;
      return {
        success: false,
        data: '',
        error: errorResponse.response?.data?.error || 'Failed to get hint'
      };
    }
  },

  createQuestion: async (data: Omit<Question, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Question>> => {
    try {
      const response = await apiClient.post<ApiResponse<Question>>('/admin/questions', data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        data: null as unknown as Question,
        error: {
          code: 'QUESTION_CREATE_ERROR',
          status: 500,
          message: 'Failed to create question'
        }
      };
    }
  },

  updateQuestion: async (id: string, questionData: Omit<BackendQuestion, 'id'>): Promise<ApiResponse<Question>> => {
    try {
      const response = await apiClient.put<ApiResponse<Question>>(`/admin/questions/${id}`, questionData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        data: null as unknown as Question,
        error: {
          code: 'QUESTION_UPDATE_ERROR',
          status: 500,
          message: 'Failed to update question'
        }
      };
    }
  },

  deleteQuestion: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/admin/questions/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        data: undefined,
        error: {
          code: 'QUESTION_DELETE_ERROR',
          status: 500,
          message: 'Failed to delete question'
        }
      };
    }
  }
};

// User Progress Services
class UserProgressService extends BaseService<ExtendedUserProgress> {
  constructor() {
    super('/users');
  }

  async getUserProgress(): Promise<ApiResponse<ExtendedUserProgress>> {
    try {
      const response = await apiClient.get<{ progress: ExtendedUserProgress }>(`${this.endpoint}/progress`);
      return {
        success: true,
        data: response.data.progress
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getUserStats(): Promise<ApiResponse<UserStats>> {
    try {
      const response = await apiClient.get<{ stats: UserStats }>(`${this.endpoint}/stats`);
      return {
        success: true,
        data: response.data.stats
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

// Create service instances
export const userProgressService = new UserProgressService();

// Admin Services
export const adminService = {
  // User Management
  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await apiClient.get<ApiResponse<User[]>>('/admin/users');
    return response.data;
  },

  createAdmin: async (userData: { email: string; password: string; name: string }): Promise<ApiResponse<User>> => {
    const response = await apiClient.post<ApiResponse<User>>('/users/admins', userData);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/admin/users/${userId}`);
    return response.data;
  },

  // Level Management
  getAllLevels: async (): Promise<ApiResponse<Level[]>> => {
    const response = await apiClient.get<ApiResponse<Level[]>>('/levels');
    return response.data;
  },

  createLevel: async (levelData: Omit<Level, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Level>> => {
    const response = await apiClient.post<ApiResponse<Level>>('/levels', levelData);
    return response.data;
  },

  updateLevel: async (levelId: string, levelData: Partial<Level>): Promise<ApiResponse<Level>> => {
    const response = await apiClient.put<ApiResponse<Level>>(`/levels/${levelId}`, levelData);
    return response.data;
  },

  deleteLevel: async (levelId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/levels/${levelId}`);
    return response.data;
  },

  // Question Management
  getAllQuestions: async (): Promise<ApiResponse<Question[]>> => {
    const response = await apiClient.get<ApiResponse<Question[]>>('/admin/questions');
    return response.data;
  },

  createQuestion: async (questionData: Omit<BackendQuestion, 'id'>): Promise<ApiResponse<Question>> => {
    const response = await apiClient.post<ApiResponse<Question>>('/admin/questions', questionData);
    return response.data;
  },

  updateQuestion: async (id: string, questionData: Omit<BackendQuestion, 'id'>): Promise<ApiResponse<Question>> => {
    const response = await apiClient.put<ApiResponse<Question>>(`/admin/questions/${id}`, questionData);
    return response.data;
  },

  deleteQuestion: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/admin/questions/${id}`);
    return response.data;
  },

  // Dashboard Stats
  getDashboardStats: async (): Promise<ApiResponse<{
    total_users: number;
    active_users: number;
    completed_levels: number;
    total_questions: number;
    average_score: number;
  }>> => {
    const response = await apiClient.get<ApiResponse<{
      total_users: number;
      active_users: number;
      completed_levels: number;
      total_questions: number;
      average_score: number;
    }>>('/admin/stats');
    return response.data;
  }
};

export default apiClient; 