import axios from 'axios';
import { ApiError } from '@/lib/types';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://be-code-treasure.onrender.com/api';

interface ApiErrorData {
    message?: string;
    error?: any;
    [key: string]: any;
}

interface ApiErrorType {
    response?: {
        status?: number;
        data?: ApiErrorData;
    };
    config?: {
        url?: string;
    };
}

/**
 * Create axios instance with default configuration
 */
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

/**
 * Handle API errors consistently
 */
const handleApiError = (error: unknown): never => {
    const apiError: ApiError = {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
        status: 500,
        details: {}
    };

    if (axios.isAxiosError(error)) {
        const axiosError = error as ApiErrorType;
        apiError.code = axiosError.response?.status?.toString() || 'UNKNOWN_ERROR';
        apiError.message = axiosError.response?.data?.message || 'An unexpected error occurred';
        apiError.status = axiosError.response?.status;
        apiError.details = axiosError.response?.data || {};

        // Clear token on authentication errors
        if (axiosError.response?.status === 401) {
            localStorage.removeItem('token');
        }
    }

    // Log error for debugging
    console.error('API Error:', apiError);

    throw apiError;
};

/**
 * Request interceptor to include auth token
 */
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(handleApiError(error))
);

/**
 * Response interceptor to handle common errors
 */
apiClient.interceptors.response.use(
    response => response,
    (error) => {
        // Handle unauthorized access
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            // Only redirect if not on login page and not refreshing token
            const isLoginPage = window.location.pathname === '/login';
            const isRefreshingToken = error.config?.url?.includes('/refresh');
            
            if (!isLoginPage && !isRefreshingToken) {
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(handleApiError(error));
    }
);

export default apiClient; 