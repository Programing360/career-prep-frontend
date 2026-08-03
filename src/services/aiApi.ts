import api from '@/lib/axios';

export interface ExplanationPayload {
  mcqId: string;
  question: string;
  correctAnswer: string;
  selectedAnswer?: string;
}

export interface ExplanationResponse {
  explanation: string;
  keyConcepts: string[];
  relatedTopics: string[];
  tokensUsed: number;
}

export interface StudyPlanPayload {
  weakSubjects: string[];
  targetExam: string;
  daysUntilExam: number;
  dailyStudyHours: number;
}

export interface StudyPlanResponse {
  planId: string;
  schedule: {
    day: number;
    date: string;
    subjects: {
      subject: string;
      hours: number;
      topics: string[];
      mcqsToPractice: number;
    }[];
  }[];
  totalMcqs: number;
  totalHours: number;
  tokensUsed: number;
}

export interface TokenBalance {
  remaining: number;
  total: number;
  resetsAt: string;
}

/**
 * Generate AI explanation for a specific MCQ.
 * POST /ai/explain
 */
export async function generateExplanation(
  payload: ExplanationPayload
): Promise<ExplanationResponse> {
  const { data } = await api.post<ExplanationResponse>('/ai/explain', payload);
  return data;
}

/**
 * Generate a personalized study plan based on weak areas.
 * POST /ai/study-plan
 */
export async function createStudyPlan(
  payload: StudyPlanPayload
): Promise<StudyPlanResponse> {
  const { data } = await api.post<StudyPlanResponse>('/ai/study-plan', payload);
  return data;
}

/**
 * Get current AI token balance for the authenticated user.
 * GET /ai/tokens
 */
export async function getTokenBalance(): Promise<TokenBalance> {
  const { data } = await api.get<TokenBalance>('/ai/tokens');
  return data;
}

/**
 * Deduct tokens (called internally before making AI requests).
 * POST /ai/tokens/deduct
 */
export async function deductTokens(
  amount: number,
  feature: string
): Promise<TokenBalance> {
  const { data } = await api.post<TokenBalance>('/ai/tokens/deduct', {
    amount,
    feature,
  });
  return data;
}

/**
 * Get AI tutor chat history.
 * GET /ai/tutor/history
 */
export async function getTutorHistory(): Promise<
  { role: 'user' | 'assistant'; content: string; timestamp: string }[]
> {
  const { data } = await api.get('/ai/tutor/history');
  return data;
}

/**
 * Send a message to AI tutor.
 * POST /ai/tutor/chat
 */
export async function sendTutorMessage(
  message: string,
  context?: { subject?: string; examId?: string }
): Promise<{
  reply: string;
  tokensUsed: number;
}> {
  const { data } = await api.post('/ai/tutor/chat', {
    message,
    ...context,
  });
  return data;
}
