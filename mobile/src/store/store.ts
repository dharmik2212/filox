import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authReducer from "./slices/authSlice";
import filesReducer from "./slices/filesSlice";
import classificationReducer from "./slices/classificationSlice";
import duplicatesReducer from "./slices/duplicatesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    files: filesReducer,
    classification: classificationReducer,
    duplicates: duplicatesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch<AppDispatch>;
export const useAppSelector = useSelector<RootState>;
