import api from '@/lib/axios';
import type { Exam, ExamAttempt, MCQ } from '@/types';

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
  answers: { mcqId: string; selectedOption: number }[];
  timeTaken: number;
}

export interface ExamResult {
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
    selectedOption: number | null;
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

/**
 * Start a new exam attempt (returns attempt metadata + first batch of MCQs).
 * POST /exams/:examId/attempts
 */
export async function startAttempt(examId: string): Promise<ExamAttempt> {
  const { data } = await api.post<ExamAttempt>(`/exams/${examId}/attempts`);
  console.log(data);
  return data;
}

/**
 * Submit answers for an exam attempt and receive results.
 * POST /exams/attempts/:attemptId/submit
 */
export async function submitAttempt(
  attemptId: string,
  payload: SubmitAttemptPayload
): Promise<ExamResult> {
  const { data } = await api.post<ExamResult>(
    `/exams/attempts/${attemptId}/submit`,
    payload
  );
  return data;
}

/**
 * Fetch results for a completed attempt.
 * GET /exams/attempts/:attemptId/result
 */
export async function getResult(attemptId: string): Promise<ExamResult> {
  const { data } = await api.get<ExamResult>(
    `/exams/attempts/${attemptId}/result`
  );
  return data;
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
