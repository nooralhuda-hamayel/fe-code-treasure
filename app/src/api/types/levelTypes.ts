export interface Level {
    id: number;
    name: string;
    difficulty: string;
    requiredScoreToUnlock: number;
    timeLimit?: number;
  }
  
  export interface UserProgress {
    unlockedLevels: number;
    completedLevels: number[];
    bestTimes: Record<number, number>;
    bestScores: Record<number, number>;
  }
  
  export interface User {
    id: string;
    username: string;
    email: string;
    progress?: UserProgress; // جعل progress اختياري
  

  }
  
  export interface LevelWithProgress extends Level {
    unlocked: boolean;
    completed: boolean;
    bestTime?: number;
    bestScore?: number;
  }