// // src/store.ts
// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './src/features/auth/authSlice';

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//   },
// });

// // تصدير النوع بشكل صحيح
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;




// import { configureStore, type ThunkAction,type Action } from '@reduxjs/toolkit';
// import authReducer from './src/features/auth/authSlice';

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//   },
// });

// // تحديد النوع الأساسي لـ dispatch
// export type AppDispatch = typeof store.dispatch;

// // تصدير النوع الكامل لحالة التطبيق
// export type RootState = ReturnType<typeof store.getState>;

// // نوع Thunk المساعد
// export type AppThunk<ReturnType = void> = ThunkAction<
//   ReturnType,
//   RootState,
//   unknown,
//   Action<string>
// >;

// export default store;

// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './src/features/auth/authSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
