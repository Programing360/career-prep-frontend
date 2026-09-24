import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MCQ } from '@/types';

export interface AnswerState {
  selectedOptionId: string;
  isCorrect: boolean;
}

export type FilterMode = 'all' | 'weak' | 'bookmarked';

interface PracticeState {
  selectedSubject: string;
  filterMode: FilterMode;
  currentIndex: number;
  answers: Record<string, AnswerState>;
  bookmarks: string[];
  notes: Record<string, string>;
  showExplanation: Record<string, boolean>;
  questions: MCQ[];
}

const initialState: PracticeState = {
  selectedSubject: 'verbal-reasoning',
  filterMode: 'all',
  currentIndex: 0,
  answers: {},
  bookmarks: [],
  notes: {},
  showExplanation: {},
  questions: [],
};

const practiceSlice = createSlice({
  name: 'practice',
  initialState,
  reducers: {
    setSubject(state, action: PayloadAction<string>) {
      state.selectedSubject = action.payload;
      state.currentIndex = 0;
    },

    setFilterMode(state, action: PayloadAction<FilterMode>) {
      state.filterMode = action.payload;
      state.currentIndex = 0;
    },

    setCurrentIndex(state, action: PayloadAction<number>) {
      state.currentIndex = action.payload;
    },

    goToNextQuestion(state) {
      if (state.currentIndex < state.questions.length - 1) {
        state.currentIndex += 1;
      }
    },

    goToPreviousQuestion(state) {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
      }
    },

    answerQuestion(
      state,
      action: PayloadAction<{
        questionId: string;
        optionId: string;
        isCorrect: boolean;
      }>
    ) {
      const { questionId, optionId, isCorrect } = action.payload;
      if (state.answers[questionId]) return;
      state.answers[questionId] = {
        selectedOptionId: optionId,
        isCorrect,
      };
    },

    toggleBookmark(state, action: PayloadAction<string>) {
      const id = action.payload;
      const idx = state.bookmarks.indexOf(id);
      if (idx === -1) {
        state.bookmarks.push(id);
      } else {
        state.bookmarks.splice(idx, 1);
      }
    },

    setNote(
      state,
      action: PayloadAction<{ questionId: string; note: string }>
    ) {
      const { questionId, note } = action.payload;
      if (note.trim() === '') {
        delete state.notes[questionId];
      } else {
        state.notes[questionId] = note;
      }
    },

    toggleExplanation(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.showExplanation[id] = !state.showExplanation[id];
    },

    loadQuestions(state, action: PayloadAction<MCQ[]>) {
      state.questions = action.payload;
      state.currentIndex = 0;
      state.answers = {};
      state.showExplanation = {};
    },

    resetPractice(state) {
      state.currentIndex = 0;
      state.answers = {};
      state.showExplanation = {};
    },
  },
});

export const {
  setSubject,
  setFilterMode,
  setCurrentIndex,
  goToNextQuestion,
  goToPreviousQuestion,
  answerQuestion,
  toggleBookmark,
  setNote,
  toggleExplanation,
  loadQuestions,
  resetPractice,
} = practiceSlice.actions;

export const practiceReducer = practiceSlice.reducer;
