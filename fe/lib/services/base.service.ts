import { ApiResponse, ApiError, BaseEntity, ID } from '../types';
import { apiClient } from './api-client';
import { AxiosError } from 'axios';

interface ApiErrorData {
  message?: string;
  [key: string]: any;
}

/**
 * Base service class that provides common CRUD operations
 * @template T - Entity type that extends BaseEntity
 */
export abstract class BaseService<T extends BaseEntity> {
  protected constructor(protected readonly endpoint: string) {}

  /**
   * Handles API errors and converts them to ApiResponse format
   */
  protected handleError(error: unknown): ApiResponse<any> {
    const axiosError = error as AxiosError<ApiErrorData>;
    return {
      success: false,
      error: {
        code: axiosError.response?.status?.toString() || '500',
        message: axiosError.response?.data?.message || 'An error occurred',
        details: axiosError.response?.data || {}
      }
    };
  }

  /**
   * Get all entities
   */
  async getAll(): Promise<ApiResponse<T[]>> {
    try {
      const response = await apiClient.get<T[]>(this.endpoint);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get entity by ID
   */
  async getById(id: ID): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.get<T>(`${this.endpoint}/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Create new entity
   */
  async create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.post<T>(this.endpoint, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update existing entity
   */
  async update(id: ID, data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.put<T>(`${this.endpoint}/${id}`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Delete entity
   */
  async delete(id: ID): Promise<ApiResponse<void>> {
    try {
      await apiClient.delete(`${this.endpoint}/${id}`);
      return {
        success: true
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
} 