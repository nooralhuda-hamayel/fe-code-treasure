const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://be-code-treasure.onrender.com/api'; 

export interface Question {
  id?: number;
  type: 'fill-gap' | 'drag-drop' | 'typed-gap';
  text: string;
  level_id: number;
  hint?: string;
  position_x?: number;
  position_y?: number;
  order?: number;
  language?: string;
  options?: string[];
  correctAnswer?: string;
  codeBlocks?: string[];
  correctOrder?: number[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class AdminQuestionsService {
  private baseUrl = `${API_BASE_URL}/admin/questions`;

  // جلب جميع الأسئلة
  async getAllQuestions(): Promise<ApiResponse<Question[]>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return await response.json();
    } catch (error) {
      console.error('Error fetching questions:', error);
      return {
        success: false,
        error: 'Failed to fetch questions'
      };
    }
  }

  // جلب أسئلة مستوى معين
  async getLevelQuestions(levelId: number): Promise<ApiResponse<Question[]>> {
    try {
      const response = await fetch(`${this.baseUrl}?level_id=${levelId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return await response.json();
    } catch (error) {
      console.error('Error fetching level questions:', error);
      return {
        success: false,
        error: 'Failed to fetch level questions'
      };
    }
  }

  // إضافة سؤال جديد
  async createQuestion(questionData: Omit<Question, 'id'>): Promise<ApiResponse<Question>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(questionData)
      });

      return await response.json();
    } catch (error) {
      console.error('Error creating question:', error);
      return {
        success: false,
        error: 'Failed to create question'
      };
    }
  }

  // تحديث سؤال
  async updateQuestion(questionId: number, questionData: Partial<Question>): Promise<ApiResponse<Question>> {
    try {
      const response = await fetch(`${this.baseUrl}/${questionId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(questionData)
      });

      return await response.json();
    } catch (error) {
      console.error('Error updating question:', error);
      return {
        success: false,
        error: 'Failed to update question'
      };
    }
  }

  // حذف سؤال
  async deleteQuestion(questionId: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/${questionId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return await response.json();
    } catch (error) {
      console.error('Error deleting question:', error);
      return {
        success: false,
        error: 'Failed to delete question'
      };
    }
  }
} 