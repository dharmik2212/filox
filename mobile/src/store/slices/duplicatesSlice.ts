import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DuplicateState {
  pairs: any[];
  loading: boolean;
  error: string | null;
}

const initialState: DuplicateState = {
  pairs: [],
  loading: false,
  error: null,
};

const duplicatesSlice = createSlice({
  name: "duplicates",
  initialState,
  reducers: {
    duplicatesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    duplicatesSuccess: (state, action: PayloadAction<any[]>) => {
      state.pairs = action.payload;
      state.loading = false;
    },
    duplicatesError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearDuplicates: (state) => {
      state.pairs = [];
    },
  },
});

export const {
  duplicatesStart,
  duplicatesSuccess,
  duplicatesError,
  clearDuplicates,
} = duplicatesSlice.actions;
export default duplicatesSlice.reducer;
