import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MCQ } from '@/types';

export interface QuestionStatus {
  answered: boolean;
  markedForReview: boolean;
  visited: boolean;
}

export interface ExamResult {
  totalQuestions: number;
  answered: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  markedForReview: number;
  score: number;
  totalMarks: number;
  accuracy: number;
}

interface ExamAttemptState {
  examId: string | null;
  examTitle: string;
  questions: MCQ[];
  answers: Record<string, string>;
  questionStatus: Record<string, QuestionStatus>;
  currentQuestionIndex: number;
  timeRemaining: number;
  durationMinutes: number;
  status: 'idle' | 'in_progress' | 'submitted';
  result: ExamResult | null;
  showSubmitModal: boolean;
}

const initialState: ExamAttemptState = {
  examId: null,
  examTitle: '',
  questions: [],
  answers: {},
  questionStatus: {},
  currentQuestionIndex: 0,
  timeRemaining: 0,
  durationMinutes: 0,
  status: 'idle',
  result: null,
  showSubmitModal: false,
};

function buildQuestionStatus(
  questions: MCQ[],
  answers: Record<string, string>,
  existingStatus: Record<string, QuestionStatus>
): Record<string, QuestionStatus> {
  const status: Record<string, QuestionStatus> = {};
  for (const q of questions) {
    const prev = existingStatus[q._id];
    status[q._id] = {
      answered: q._id in answers,
      markedForReview: prev?.markedForReview ?? false,
      visited: prev?.visited ?? false,
    };
  }
  return status;
}

function correctOptionId(q: MCQ): string | undefined {
  return q.options.find((o) => o.isCorrect)?.id;
}

const examAttemptSlice = createSlice({
  name: 'examAttempt',
  initialState,
  reducers: {
    initExam(
      state,
      action: PayloadAction<{
        examId: string;
        examTitle: string;
        questions: MCQ[];
        durationMinutes: number;
      }>
    ) {
      const { examId, examTitle, questions, durationMinutes } = action.payload;
      state.examId = examId;
      state.examTitle = examTitle;
      state.questions = questions;
      state.durationMinutes = durationMinutes;
      state.timeRemaining = durationMinutes * 60;
      state.answers = {};
      state.questionStatus = buildQuestionStatus(questions, {}, {});
      state.currentQuestionIndex = 0;
      state.status = 'in_progress';
      state.result = null;
      state.showSubmitModal = false;

      if (questions.length > 0) {
        const firstId = questions[0]._id;
        state.questionStatus[firstId] = {
          ...state.questionStatus[firstId],
          visited: true,
        };
      }
    },

    selectOption(
      state,
      action: PayloadAction<{ questionId: string; optionId: string }>
    ) {
      const { questionId, optionId } = action.payload;
      state.answers[questionId] = optionId;
      state.questionStatus[questionId] = {
        ...state.questionStatus[questionId],
        answered: true,
        visited: true,
      };
    },

    clearResponse(state, action: PayloadAction<string>) {
      const questionId = action.payload;
      delete state.answers[questionId];
      state.questionStatus[questionId] = {
        ...state.questionStatus[questionId],
        answered: false,
      };
    },

    toggleMarkForReview(state, action: PayloadAction<string>) {
      const questionId = action.payload;
      const current = state.questionStatus[questionId];
      state.questionStatus[questionId] = {
        ...current,
        markedForReview: !current?.markedForReview,
      };
    },

    goToQuestion(state, action: PayloadAction<number>) {
      const idx = action.payload;
      if (idx >= 0 && idx < state.questions.length) {
        state.currentQuestionIndex = idx;
        const qId = state.questions[idx]._id;
        state.questionStatus[qId] = {
          ...state.questionStatus[qId],
          visited: true,
        };
      }
    },

    tickTimer(state) {
      if (state.status !== 'in_progress') return;
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      }
      if (state.timeRemaining <= 0) {
        state.status = 'submitted';
      }
    },

    setShowSubmitModal(state, action: PayloadAction<boolean>) {
      state.showSubmitModal = action.payload;
    },

    submitExam(state) {
      const { questions, answers } = state;
      let correct = 0;
      let answered = 0;

      for (const q of questions) {
        if (q._id in answers) {
          answered += 1;
          if (answers[q._id] === correctOptionId(q)) {
            correct += 1;
          }
        }
      }

      const totalQuestions = questions.length;
      const incorrect = answered - correct;
      const unanswered = totalQuestions - answered;
      const markedForReview = Object.values(state.questionStatus).filter(
        (s) => s.markedForReview
      ).length;
      const score = correct;
      const totalMarks = totalQuestions;
      const accuracy =
        answered > 0 ? Math.round((correct / answered) * 100) : 0;

      state.result = {
        totalQuestions,
        answered,
        correct,
        incorrect,
        unanswered,
        markedForReview,
        score,
        totalMarks,
        accuracy,
      };
      state.status = 'submitted';
      state.showSubmitModal = false;
    },

    resetExam() {
      return initialState;
    },
  },
});

export const {
  initExam,
  selectOption,
  clearResponse,
  toggleMarkForReview,
  goToQuestion,
  tickTimer,
  setShowSubmitModal,
  submitExam,
  resetExam,
} = examAttemptSlice.actions;

export const examAttemptReducer = examAttemptSlice.reducer;
