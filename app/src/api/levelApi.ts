// src/api/levelApi.ts
import axiosInstance from './axiosInstance';
import type { Level } from './types/levelTypes';
import type { LevelWithProgress } from "../../src/api/types/levelTypes";

export const fetchLevelDetails = async (id: number): Promise<Level> => {
  const response = await axiosInstance.get(`/api/levels/${id}`);
  return response.data;
};
export const fetchLevels = async (): Promise<Level[]> => {
  const response = await axiosInstance.get('/api/levels');
  return response.data;
};

export const unlockLevel = async (levelId: number): Promise<LevelWithProgress> => {
  const response = await axiosInstance.post('/api/levels', { levelId });
  return response.data;
};

export const updateLevelProgress = async (levelId: number, time: number, score: number): Promise<LevelWithProgress> => {
  const response = await axiosInstance.patch(`/api/levels/${levelId}`, { time, score });
  return response.data;
};