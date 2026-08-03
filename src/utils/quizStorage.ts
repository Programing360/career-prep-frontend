import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
} from './storageHelpers';
import type { DailyQuiz, DailyQuizAttempt } from '@/types/dailyQuiz';

export interface DailyQuizInProgress {
  quiz: DailyQuiz;
  questionIndex: number;
  answers: Record<string, string>;
  startedAt: string;
}

const COMPLETED_KEY_PREFIX = 'mp_daily_quiz_completed_';
const IN_PROGRESS_KEY = 'mp_daily_quiz_in_progress';

export function completedQuizKey(quizDate: string): string {
  return `${COMPLETED_KEY_PREFIX}${quizDate}`;
}

export function getCompletedQuiz(quizDate: string): DailyQuizAttempt | null {
  return getStorageItem<DailyQuizAttempt | null>(
    completedQuizKey(quizDate),
    null
  );
}

export function saveCompletedQuiz(attempt: DailyQuizAttempt): void {
  setStorageItem(completedQuizKey(attempt.completedAt.slice(0, 10)), attempt);
}

export function clearCompletedQuiz(quizDate: string): void {
  removeStorageItem(completedQuizKey(quizDate));
}

export function getInProgressQuiz(): DailyQuizInProgress | null {
  return getStorageItem<DailyQuizInProgress | null>(IN_PROGRESS_KEY, null);
}

export function saveInProgressQuiz(state: DailyQuizInProgress): void {
  setStorageItem(IN_PROGRESS_KEY, state);
}

export function clearInProgressQuiz(): void {
  removeStorageItem(IN_PROGRESS_KEY);
}
