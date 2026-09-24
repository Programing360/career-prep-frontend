import type { MCQOption, MCQQuestion } from './mcq';

export type TestType = 'mock_demo' | 'verbal_nonverbal';

export type QuestionType = 'text' | 'image' | 'diagram';

export type MockTestStatus = 'active' | 'expired' | 'completed';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/**
 * Mock-test option. Reuses the canonical `MCQOption` from `./mcq` so the mock
 * test and the rest of the platform share the same option vocabulary, extended
 * only for image-based options used by non-verbal reasoning questions.
 */
export interface MockOption extends MCQOption {
  imageUrl?: string;
}

/**
 * Mock-test question. Reuses the canonical `MCQQuestion` shape (`_id`,
 * `question`, `options`, `difficulty`, ...) and extends it with the few
 * mock-test-specific fields (question type / subject category). The correct
 * answer is expressed via `isCorrect` on the option (`correctAnswerId` was
 * removed in favour of the canonical representation).
 */
export interface MockQuestion extends Omit<MCQQuestion, 'options'> {
  options: MockOption[];
  questionType?: QuestionType;
  questionImageUrl?: string;
  text: string;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionId: string | null;
  isFlagged: boolean;
  answeredAt: string;
}

export interface MockTestSession {
  id: string;
  examSlug: string;
  testType: TestType;
  startTime: string;
  durationSeconds: number;
  expiresAt: string;
  isSubmitted: boolean;
  status: MockTestStatus;
}

export interface SubjectBreakdown {
  subject: string;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  accuracyPercentage: number;
}

export interface MockTestResult {
  sessionId: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  timeSpentSeconds: number;
  subjectBreakdown: SubjectBreakdown[];
}

export interface MockTestStartRequest {
  testType: TestType;
}

export interface MockTestSubmitRequest {
  answers: UserAnswer[];
}

export interface MockTestSessionDetail {
  session: MockTestSession;
  questions: MockQuestion[];
  answers: UserAnswer[];
}
