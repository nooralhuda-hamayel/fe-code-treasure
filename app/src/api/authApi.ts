
// import axiosInstance from './axiosInstance';
// import type { User , LoginData, AuthResponse, RefreshTokenResponse } from './types/authTypes';

// export const login = async (data: LoginData): Promise<AuthResponse> => {
//   const response = await axiosInstance.post('/auth', {
//     username: data.username,
//     password: data.password
//   });
//   return response.data;
// };
// // دالة للتحقق من حالة المصادقة
// export const checkAuth = async (): Promise<boolean> => {
//   try {
//     const response = await axiosInstance.get('/auth/check');
//     return response.data.isAuthenticated;
//   } catch (error) {
//     console.error('Auth check failed:', error);
//     return false;
//   }
// };

// export const getCurrentUser = async (): Promise<User | null> => {
//   try {
//     const response = await axiosInstance.get('/auth/me');
//     return response.data.user;
//   } catch (error) {
//     return null;
//   }
// };


// export const refreshToken = async (): Promise<RefreshTokenResponse> => {
// //   const refreshToken = localStorage.getItem('refreshToken');

//   const response = await axiosInstance.get('/auth/refresh', {
//     headers: {
//       'Authorization': `Bearer ${refreshToken}`
//     }
//   });
//   return response.data;
// };

// export const logout = async (): Promise<void> => {
//   await axiosInstance.get('/auth/logout');
// };

// src/api/authApi.ts
import axiosInstance from './axiosInstance';
import type { User, LoginData, AuthResponse, RefreshTokenResponse } from './types/authTypes';

// تسجيل الدخول
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/api/auth', {
    email: data.email,
    password: data.password
  });
  return response.data;
};

// التحقق من حالة المصادقة
export const checkAuth = async (): Promise<boolean> => {
  try {
    const response = await axiosInstance.get('/api/auth/check');
    return response.data.isAuthenticated;
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
};

// جلب المستخدم الحالي
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await axiosInstance.get('/api/auth/me');
    return response.data.user;
  } catch (error) {
    return null;
  }
};

// تجديد التوكن (باستخدام الكوكيز فقط)
export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  const response = await axiosInstance.get('/api/auth/refresh'); // الكوكيز تُرسل تلقائيًا
  return response.data;
};

// تسجيل الخروج
export const logout = async (): Promise<void> => {
  await axiosInstance.get('/api/auth/logout');
};
