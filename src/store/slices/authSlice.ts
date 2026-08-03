import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User, StudentProgress } from '@/types';
import {
  setStorageItem,
  getStorageItem,
  removeStorageItem,
} from '@/utils/storageHelpers';

const STORAGE_KEYS = {
  user: 'auth_user',
  token: 'auth_token',
  progress: 'auth_progress',
} as const;

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoading: boolean;
  progress: StudentProgress | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isInitializing: true,
  isLoading: false,
  progress: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        user: User;
        token: string;
        progress?: StudentProgress;
      }>
    ) {
      const { user, token, progress } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      if (progress) {
        state.progress = progress;
      }

      setStorageItem(STORAGE_KEYS.user, user);
      setStorageItem(STORAGE_KEYS.token, token);
      if (progress) {
        setStorageItem(STORAGE_KEYS.progress, progress);
      }
    },

    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      setStorageItem(STORAGE_KEYS.user, action.payload);
    },

    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.progress = null;

      removeStorageItem(STORAGE_KEYS.user);
      removeStorageItem(STORAGE_KEYS.token);
      removeStorageItem(STORAGE_KEYS.progress);
    },

    updateUserProgress(state, action: PayloadAction<Partial<StudentProgress>>) {
      if (state.progress) {
        state.progress = { ...state.progress, ...action.payload };
      } else {
        state.progress = action.payload as StudentProgress;
      }
      setStorageItem(STORAGE_KEYS.progress, state.progress);
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    hydrateFromStorage(state) {
      const user = getStorageItem<User | null>(STORAGE_KEYS.user, null);
      const token = getStorageItem<string | null>(STORAGE_KEYS.token, null);
      const progress = getStorageItem<StudentProgress | null>(
        STORAGE_KEYS.progress,
        null
      );

      if (user && token) {
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
        state.progress = progress;
      }

      state.isInitializing = false;
    },
  },
});

export const {
  setCredentials,
  setUser,
  logout,
  updateUserProgress,
  setLoading,
  hydrateFromStorage,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
