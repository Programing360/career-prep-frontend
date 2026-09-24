import api from '@/lib/axios';
import type { Exam, ExamAttempt, MCQ, MCQSubmissionAnswer } from '@/types';

export interface ExamListParams {
  category?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SubmitAttemptPayload {
  examId: string;
  /** Standard canonical answer payload (questionId + selectedOptionId). */
  answers: MCQSubmissionAnswer[];
  timeTaken: number;
}

export interface ExamResult {
  sessionId?: string;
  attempt: ExamAttempt;
  score: number;
  percentage: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalSkipped: number;
  subjectBreakdown: {
    subjectId: string;
    subjectName: string;
    correct: number;
    incorrect: number;
    skipped: number;
    accuracy: number;
  }[];
  questionReview: {
    mcq: MCQ;
    selectedOptionId: string | null;
    isCorrect: boolean;
  }[];
}

/**
 * Fetch paginated list of exams with optional filters.
 * GET /exams
 */
export async function getExams(
  params?: ExamListParams
): Promise<PaginatedResponse<Exam>> {
  const { data } = await api.get<PaginatedResponse<Exam>>('/exams', {
    params,
  });
  return data;
}

/**
 * Fetch a single exam by ID with full details.
 * GET /exams/:examId
 */
export async function getExamById(examId: string): Promise<Exam> {
  const { data } = await api.get<Exam>(`/exams/${examId}`);
  return data;
}

export interface ExamSessionData {
  sessionId?: string;
  attemptId?: string;
  examId?: string;
  examTitle?: string;
  durationMinutes?: number;
  questions?: MCQ[];
}

/**
 * Start a new exam attempt / session (returns session metadata + MCQs).
 * POST /exam-sessions/:examId/start
 */
export async function startAttempt(examId: string): Promise<ExamSessionData> {
  const response = await api.post(`/exam-sessions/${examId}/start`);
  return response.data?.data || response.data;
}

/**
 * Submit answers for an exam attempt and receive results.
 * POST /exam-sessions/submit
 */
export async function submitAttempt(
  attemptId: string,
  payload: SubmitAttemptPayload
): Promise<ExamResult> {
  const response = await api.post(`/exam-sessions/submit`, {
    sessionId: attemptId,
    examId: payload.examId,
    answers: payload.answers,
    timeTaken: payload.timeTaken,
  });
  return response.data?.data || response.data;
}

/**
 * Fetch results for a completed attempt.
 * GET /exam-sessions/:attemptId/result
 */
export async function getResult(attemptId: string): Promise<ExamResult> {
  const response = await api.get(`/exam-sessions/${attemptId}/result`);
  return response.data?.data || response.data;
}

/**
 * Fetch all results for the current user.
 * GET /exams/results
 */
export async function getResults(): Promise<ExamResult[]> {
  const { data } = await api.get<ExamResult[]>('/exams/results');
  return data;
}

/**
 * Fetch paginated MCQs for an exam (used during attempt).
 * GET /exams/:examId/mcqs
 */
export async function getExamMcqs(
  examId: string,
  page = 1,
  limit = 50
): Promise<PaginatedResponse<MCQ>> {
  const { data } = await api.get<PaginatedResponse<MCQ>>(
    `/exams/${examId}/mcqs`,
    { params: { page, limit } }
  );
  return data;
}
