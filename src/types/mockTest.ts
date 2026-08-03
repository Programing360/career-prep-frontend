export type TestType = 'mock_demo' | 'verbal_nonverbal';

export type QuestionType = 'text' | 'image' | 'diagram';

export type MockTestStatus = 'active' | 'expired' | 'completed';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface MockOption {
  id: string;
  text: string;
  imageUrl?: string;
}

export interface MockQuestion {
  id: string;
  text: string;
  questionType: QuestionType;
  questionImageUrl?: string;
  options: MockOption[];
  correctAnswerId: string;
  subjectCategory: string;
  explanation: string;
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
