import api from '@/lib/axios';

// ---------------------------------------------------------------------------
// Types – mirror the backend ai-tutor controller contracts exactly
// ---------------------------------------------------------------------------

export interface ChatPayload {
  prompt: string;
  /** Pass the sessionId returned by the first call to continue an existing session */
  sessionId?: string | null;
}

export interface ChatResponse {
  sessionId: string;
  reply: string;
  tokensRemaining: number;
}

export interface ExplainMcqPayload {
  question: string;
  /** Array of option strings, e.g. ["Option A", "Option B", ...] */
  options: string[];
  /** The correct answer text (string, not index) */
  correctAnswer: string;
  /** The answer the user actually selected, if any */
  userSelectedAnswer?: string;
}

export interface ExplainMcqResponse {
  explanation: string;
  tokensRemaining: number;
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/**
 * Send a chat message to the AI Tutor.
 * POST /ai-tutor/chat
 *
 * Pass `sessionId` on every call after the first so the backend appends to
 * the same MongoDB chat session instead of creating a new one.
 *
 * On success the backend deducts 10 tokens from the user's `aiTokenBalance`.
 * Returns `tokensRemaining` so the UI can stay in sync without a separate
 * balance fetch.
 *
 * Throws with status 403 when the user has insufficient tokens.
 */
export async function chatWithTutor(
  payload: ChatPayload
): Promise<ChatResponse> {
  const { data } = await api.post<{ status: string; data: ChatResponse }>(
    '/ai-tutor/chat',
    payload
  );
  return data.data;
}

/**
 * Get a detailed explanation for an MCQ answer.
 * POST /ai-tutor/explain-mcq
 *
 * Used by the "AI Explanation Generator" feature.
 * Also deducts 10 tokens on success.
 */
export async function explainMcq(
  payload: ExplainMcqPayload
): Promise<ExplainMcqResponse> {
  const { data } = await api.post<{
    status: string;
    data: ExplainMcqResponse;
  }>('/ai-tutor/explain-mcq', payload);
  return data.data;
}
