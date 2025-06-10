import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// تعريف نوع البيانات لمستوى واحد
interface Level {
  id: number;
  time?: string;
  score?: number;
  isUnlocked: boolean;
  isCompleted: boolean;
}

// تعريف الحالة الأولية
interface LevelsState {
  levels: Level[];
  loading: boolean;
  error: string | null;
}

const initialState: LevelsState = {
  levels: [],
  loading: false,
  error: null,
};

// جلب المستويات من الـ API
export const fetchLevels = createAsyncThunk("levels/fetchLevels", async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/api/levels"); 
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch levels");
    }
  });

const levelSlice = createSlice({
  name: "levels",
  initialState,
  reducers: {
    // لو احتجت دوال لاحقًا لتحديث حالة معينة
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLevels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLevels.fulfilled, (state, action: PayloadAction<Level[]>) => {
        state.loading = false;
        state.levels = action.payload;
      })
      .addCase(fetchLevels.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default levelSlice.reducer;
