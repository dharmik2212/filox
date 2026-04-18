import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FileState {
  items: any[];
  loading: boolean;
  error: string | null;
  selectedFiles: Set<number>;
}

const initialState: FileState = {
  items: [],
  loading: false,
  error: null,
  selectedFiles: new Set(),
};

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    // Load files
    loadFilesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loadFilesSuccess: (state, action: PayloadAction<any[]>) => {
      state.items = action.payload;
      state.loading = false;
    },
    loadFilesError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Select/deselect files
    toggleFileSelection: (state, action: PayloadAction<number>) => {
      const fileId = action.payload;
      if (state.selectedFiles.has(fileId)) {
        state.selectedFiles.delete(fileId);
      } else {
        state.selectedFiles.add(fileId);
      }
    },
    clearSelection: (state) => {
      state.selectedFiles.clear();
    },
  },
});

export const {
  loadFilesStart,
  loadFilesSuccess,
  loadFilesError,
  toggleFileSelection,
  clearSelection,
} = filesSlice.actions;
export default filesSlice.reducer;
