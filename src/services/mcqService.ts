import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import type { MCQQuestion, MCQSubmissionAnswer } from '@/types/mcq';

/** Filters accepted by the MCQ fetch endpoints. */
export interface MCQListFilters {
  topicId?: string;
  subjectId?: string;
  difficulty?: string;
  examSlug?: string;
  /** Category slug, e.g. 'army-test', 'css', 'nts' – maps to ?category= query param */
  category?: string;
  page?: number;
  limit?: number;
}

export interface MCQPaginatedResponse {
  data: MCQQuestion[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TopicOption {
  id: string;
  name: string;
}

/** Backend wrapper shape returned by `successful` API responses. */
interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

/**
 * Fetch MCQ questions by topic/difficulty/examSlug.
 * GET /api/v1/mcqs?examSlug=...&topicId=...&difficulty=...
 */
export async function getMcqs(
  filters?: MCQListFilters
): Promise<MCQPaginatedResponse> {
  const params = {
    ...filters,
    ...(filters?.difficulty
      ? { difficulty: filters.difficulty.toLowerCase() }
      : {}),
  };

  const { data } = await api.get<ApiEnvelope<MCQQuestion[]> | MCQQuestion[]>(
    API_ENDPOINTS.MCQS.BASE,
    { params }
  );

  if (Array.isArray(data)) {
    return {
      data,
      total: data.length,
      page: 1,
      limit: data.length,
      totalPages: 1,
    };
  }

  const items = (data.data ?? []).map((q: MCQQuestion) => ({
    ...q,
    question: q.question ?? q.questionText ?? '',
    questionText: q.questionText ?? q.question ?? '',
  }));
  const meta = data.meta;

  return {
    data: items,
    total: meta?.total ?? data.total ?? items.length,
    page: meta?.page ?? data.page ?? 1,
    limit: meta?.limit ?? data.limit ?? items.length,
    totalPages: meta?.totalPages ?? data.totalPages ?? 1,
  };
}

/**
 * Fetch MCQ preview questions by exam slug.
 * GET /api/v1/mcqs?examSlug=...
 */
export async function getMcqPreview(
  examSlug: string,
  filters?: { topicId?: string; difficulty?: string; page?: number }
): Promise<MCQPaginatedResponse> {
  return getMcqs({ ...filters, examSlug, limit: filters?.page ? 20 : 50 });
}

/**
 * Fetch MCQs filtered by category slug, e.g. 'army-test'.
 * GET /api/v1/mcqs?category=army-test
 *
 * Uses live MongoDB data — no hardcoded fallback arrays.
 * Loading and empty-state handling must be done in the calling component.
 */
export async function getMcqsByCategory(
  category: string,
  extra?: Omit<MCQListFilters, 'category'>
): Promise<MCQPaginatedResponse> {
  return getMcqs({ ...extra, category, limit: extra?.limit ?? 50 });
}

/** Mirror of the backend ai-tutor ExplainMcq response (IMCQ contract). */
export interface IAiTutorResponse {
  explanation: string;
  tokensRemaining: number;
}

/** Per-question evaluation result returned by POST /mcqs/submit. */
export interface MCQSubmissionResult {
  questionId: string;
  selectedOptionId: string;
  correct: boolean;
  isAnswered?: boolean;
  reason?: string;
  correctOptionId?: string | null;
  explanation?: string;
}

/** Response payload of POST /mcqs/submit (mirrors mcqService.evaluateAnswers). */
export interface MCQSubmitResponse {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  scorePercentage: number;
  results: MCQSubmissionResult[];
}

/**
 * Submit a set of MCQ answers for a practice session.
 * POST /api/v1/mcqs/submit
 */
export async function submitMcqAnswers(
  answers: MCQSubmissionAnswer[]
): Promise<MCQSubmitResponse> {
  const { data } = await api.post<
    ApiEnvelope<MCQSubmitResponse> | MCQSubmitResponse
  >(API_ENDPOINTS.MCQS.SUBMIT, { answers });
  const payload: MCQSubmitResponse =
    'data' in data && data.data ? data.data : (data as MCQSubmitResponse);
  return {
    totalQuestions: payload.totalQuestions ?? answers.length,
    correctAnswers: payload.correctAnswers ?? 0,
    incorrectAnswers: payload.incorrectAnswers ?? 0,
    scorePercentage: payload.scorePercentage ?? 0,
    results: payload.results ?? [],
  };
}

/** Backwards-compatible alias for practice-session submissions. */
export const submitPracticeSession = submitMcqAnswers;

/**
 * Fetch available topics for filter chips.
 * GET /api/v1/mcqs/topics
 */
export async function getTopics(): Promise<TopicOption[]> {
  const { data } = await api.get<ApiEnvelope<TopicOption[]> | TopicOption[]>(
    API_ENDPOINTS.MCQS.TOPICS
  );
  return Array.isArray(data) ? data : (data.data ?? []);
}

/** Fetch user progress for an exam from database */
export async function fetchMcqProgress(examSlug: string) {
  try {
    const { data } = await api.get(
      API_ENDPOINTS.MCQ_PRACTICE.PROGRESS(examSlug)
    );
    return 'data' in data ? data.data : data;
  } catch {
    return null;
  }
}

/** Save an individual MCQ answer to backend */
export async function saveMcqProgressAnswer(
  examSlug: string,
  questionId: string,
  selectedOptionId: string,
  currentIndex: number
) {
  try {
    const { data } = await api.post(
      API_ENDPOINTS.MCQ_PRACTICE.ANSWER(examSlug),
      {
        questionId,
        selectedOptionId,
        currentIndex,
      }
    );
    return 'data' in data ? data.data : data;
  } catch {
    return null;
  }
}

/** Submit full exam MCQ practice to backend database */
export async function submitMcqExamProgress(
  examSlug: string,
  answers: MCQSubmissionAnswer[]
) {
  const { data } = await api.post(API_ENDPOINTS.MCQ_PRACTICE.SUBMIT(examSlug), {
    answers,
  });
  return 'data' in data ? data.data : data;
}

/** Fetch user dashboard stats from backend database */
export async function fetchUserDashboardStats() {
  try {
    const { data } = await api.get(API_ENDPOINTS.MCQ_PRACTICE.USER_STATS);
    return 'data' in data ? data.data : data;
  } catch {
    return null;
  }
}
