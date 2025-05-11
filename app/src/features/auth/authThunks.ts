
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import type { LoginData, AuthResponse } from '../../api/types/authTypes';


export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    credentials: LoginData,
    { rejectWithValue }
  ): Promise<AuthResponse | ReturnType<typeof rejectWithValue>> => {
    try {
      const response = await axiosInstance.post<AuthResponse>('api/auth', credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.get('/api/auth/logout');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const refreshUserToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      // const refreshToken = getRefreshToken();
      const response = await axiosInstance.get<AuthResponse>('/api/auth/refresh');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const signupUser = createAsyncThunk(
    'auth/signup',
    async (
      userData: {  name: string;  email: string; password: string },
      { rejectWithValue }
    ) => {
      try {
        const response = await axiosInstance.post('/api/users', userData);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );
  

  // export const signupUser = createAsyncThunk(
  //   'auth/signup',
  //   async (userData: { email: string; username: string; password: string }) => {
  //     const response = await axiosInstance.post('/users', userData);
  //     return response.data;
  //   }
  // );