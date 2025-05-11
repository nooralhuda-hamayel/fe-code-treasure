
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../api/types/authTypes';
import {
  loginUser,
  logoutUser,
  refreshUserToken,
  signupUser
} from './authThunks'; // استيراد الثونكات المطلوبة

// في authSlice.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean; // أضفنا هذه الخاصية
  isLoading: boolean;
  error: string | null;
}


const initialState: AuthState = {
  user: null,
  // token: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // setCredentials: (state, action: PayloadAction<{
    //   user: User;
    //   token: string;
    // }>) => {
    //   state.user = action.payload.user;
    //   // state.token = action.payload.token;
    //   state.error = null;
    // },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
    },
    logout: (state) => { //clearAuth: (state) => {
      state.user = null;
      //state.token = null;
      state.error = null;
      state.isLoading = false;//optinal
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // معالجة حالات loginUser
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        //state.token = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // معالجة حالات refreshUserToken
      .addCase(refreshUserToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshUserToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        // state.token = action.payload;
      })
      .addCase(refreshUserToken.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = action.payload as string;
      })

      // معالجة حالات logoutUser
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        // state.token = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
      })

      // معالجة حالات signupUser (اختياري)
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;