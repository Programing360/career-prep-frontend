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
 * POST /api/ai/explain
 */
export async function generateExplanation(
  payload: ExplanationPayload
): Promise<ExplanationResponse> {
  const { data } = await api.post<ExplanationResponse>(
    '/api/ai/explain',
    payload
  );
  return data;
}

/**
 * Generate a personalized study plan based on weak areas.
 * POST /api/ai/study-plan
 */
export async function createStudyPlan(
  payload: StudyPlanPayload
): Promise<StudyPlanResponse> {
  const { data } = await api.post<StudyPlanResponse>(
    '/api/ai/study-plan',
    payload
  );
  return data;
}

/**
 * Get current AI token balance for the authenticated user.
 * GET /api/ai/tokens
 */
export async function getTokenBalance(): Promise<TokenBalance> {
  const { data } = await api.get<TokenBalance>('/api/ai/tokens');
  return data;
}

/**
 * Deduct tokens (called internally before making AI requests).
 * POST /api/ai/tokens/deduct
 */
export async function deductTokens(
  amount: number,
  feature: string
): Promise<TokenBalance> {
  const { data } = await api.post<TokenBalance>('/api/ai/tokens/deduct', {
    amount,
    feature,
  });
  return data;
}

/**
 * Get AI tutor chat history.
 * GET /api/ai/tutor/history
 */
export async function getTutorHistory(): Promise<
  { role: 'user' | 'assistant'; content: string; timestamp: string }[]
> {
  const { data } = await api.get('/api/ai/tutor/history');
  return data;
}

/**
 * Send a message to AI tutor.
 * POST /api/ai/tutor/chat
 */
export async function sendTutorMessage(
  message: string,
  context?: { subject?: string; examId?: string }
): Promise<{
  reply: string;
  tokensUsed: number;
}> {
  const { data } = await api.post('/api/ai/tutor/chat', {
    message,
    ...context,
  });
  return data;
}
