import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ClassificationState {
  results: Map<number, any>;
  processing: boolean;
  progress: number;
  error: string | null;
}

const initialState: ClassificationState = {
  results: new Map(),
  processing: false,
  progress: 0,
  error: null,
};

const classificationSlice = createSlice({
  name: "classification",
  initialState,
  reducers: {
    classificationStart: (state) => {
      state.processing = true;
      state.error = null;
      state.progress = 0;
    },
    classificationProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    classificationSuccess: (state, action: PayloadAction<any>) => {
      const { fileId, result } = action.payload;
      state.results.set(fileId, result);
      state.processing = false;
    },
    classificationError: (state, action: PayloadAction<string>) => {
      state.processing = false;
      state.error = action.payload;
    },
    batchClassificationSuccess: (state, action: PayloadAction<any[]>) => {
      action.payload.forEach((item) => {
        state.results.set(item.fileId, item.result);
      });
      state.processing = false;
    },
  },
});

export const {
  classificationStart,
  classificationProgress,
  classificationSuccess,
  classificationError,
  batchClassificationSuccess,
} = classificationSlice.actions;
export default classificationSlice.reducer;
