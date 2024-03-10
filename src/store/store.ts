import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./features/auth/AuthSlice";

export const store = configureStore({
  reducer: {
    // reference reducers here
    auth: AuthReducer
  }
});

// create types for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
