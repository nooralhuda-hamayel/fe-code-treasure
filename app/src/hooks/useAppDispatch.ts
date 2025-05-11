// src/hooks/useAppDispatch.ts
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store';

/**
 * Hook معدل لاستخدام dispatch مع TypeScript
 * @returns {AppDispatch} dispatch function مع أنواع Redux المحددة
 */
const useAppDispatch = () => useDispatch<AppDispatch>();

export default useAppDispatch;