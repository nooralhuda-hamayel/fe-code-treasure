export interface LoginData {
    email: string; 
    password: string;
  }

export interface FormData {
  email: string;
  name: string;
  password: string;
  otp?: string[];
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  accessToken: string;
  refreshToken?: string;
}
 
import type { UserProgress } from "./levelTypes";

// export interface User {
//   id: string;
//   username: string;
//   email: string;
//   role: string;
//   progress?: UserProgress;
// }
  // src/api/types/authTypes.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;//هون انا حطيت علامة السؤال لحتى تكون اختياري لانها مش موجودة بالباك بس تنوجد بالباك بشيل علامة السؤال هاي بتلزم لحتى احدد user or admin error show in authSlice
  // role:string;
  progress?: {
    unlockedLevels: number;
    completedLevels: number[];
    bestTimes: Record<number, number>;
    bestScores: Record<number, number>;
  };
}
  export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
  }
  
  export interface RefreshTokenResponse {
    accessToken: string;
  }