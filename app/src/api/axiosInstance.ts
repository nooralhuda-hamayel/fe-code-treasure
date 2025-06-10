import axios from 'axios';
import config from '../../../app/globals/env.config';
const BASE_URL = config.be_server;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // مهم لعمليات المصادقة
  
  timeout: 10000,
});
axiosInstance.interceptors.response.use(
  res => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true;
      try {
        await axiosInstance.get('/api/auth/refresh'); // الكوكي يُرسل تلقائيًا
        return axiosInstance(originalRequest); // إعادة الطلب بعد التجديد
      } catch (err) {
        window.location.href = '/auth?session_expired=true';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
// // Interceptor لإضافة التوكن للطلبات
// axiosInstance.interceptors.request.use((config) => {
//   const token = getToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

// Interceptor لمعالجة الأخطاء وتجديد التوكن
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
    
//     // إذا كان الخطأ 401 ولم يتم إعادة المحاولة بعد
//     if (error.response?.status === 401 && !originalRequest._retry) {
//     //   originalRequest._retry = true;
//          (originalRequest as any)._retry = true;
      
//       try {
        // const refreshToken = getRefreshToken();
        // if (refreshToken) {
        //   const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
        //     refreshToken
        //   });
          
          // setToken(data.accessToken);
          // if (data.refreshToken) {
          //   localStorage.setItem('refreshToken', data.refreshToken);
          // }
          
//           originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
//           return axiosInstance(originalRequest);
//         }
//       } catch (refreshError) {
//         clearToken();
//         window.location.href = '/auth?session_expired=true';
//         return Promise.reject(refreshError);
//       }
//     }
    
//     // معالجة أخطاء أخرى
//     if (error.response) {
//       switch (error.response.status) {
//         case 403:
//           window.location.href = '/unauthorized';
//           break;
//         case 500:
//           console.error('Server Error:', error.response.data);
//           break;
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

// // Level API
// export const fetchLevels = () => axiosInstance.get('/levels');
// export const fetchLevelDetails = (id: number) => axiosInstance.get(`/levels/${id}`);
// export const createLevel = (data: FormData) => axiosInstance.post('/levels', data, {
//   headers: {
//     'Content-Type': 'multipart/form-data'
//   }
// });

// // Auth API
// export const login = (credentials: { email: string; password: string }) => 
//   axiosInstance.post('/auth', credentials);

// export const register = (userData: { 
//   email: string; 
//   password: string; 
//   name: string 
// }) => axiosInstance.post('/users', userData);

// export const refreshAccessToken = () => 
//   axiosInstance.get('/auth/refresh');

// export const logout = () => 
//   axiosInstance.get('/auth/logout')
//     .finally(() => clearToken());

// // User API
// export const fetchCurrentUser = () => axiosInstance.get('/users/me');
// export const updateUserProfile = (data: { name?: string; avatar?: File }) => {
//   const formData = new FormData();
//   if (data.name) formData.append('name', data.name);
//   if (data.avatar) formData.append('avatar', data.avatar);
  
//   return axiosInstance.patch('/users/me', formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     }
  // });
// };

// export default axiosInstance;
