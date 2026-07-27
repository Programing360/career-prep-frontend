import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/authSlice';
import { practiceReducer } from './slices/practiceSlice';
import { examAttemptReducer } from './slices/examAttemptSlice';
import { aiTutorReducer } from './slices/aiTutorSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    practice: practiceReducer,
    examAttempt: examAttemptReducer,
    aiTutor: aiTutorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
