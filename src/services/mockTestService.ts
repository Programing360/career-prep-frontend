import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import api from '@/lib/axios';
import type {
  ApiResponse,
  MockQuestion,
  MockTestResult,
  MockTestSession,
  MockTestSessionDetail,
  MockTestStartRequest,
  MockTestSubmitRequest,
  TestType,
  UserAnswer,
} from '@/types/mockTest';

/**
 * Mock test service — talks to the real mock-test backend.
 *
 * API contract (base path /api/v1):
 * - startMockTest      -> POST /mock-tests/:examSlug/start
 * - syncTestTimer      -> GET  /mock-tests/session/:id/heartbeat
 * - submitMockTest     -> POST /mock-tests/session/:id/submit
 * - getMockTestSession -> GET  /mock-tests/session/:id
 *
 * Draft answers are mirrored into sessionStorage so a page reload can restore
 * an in-flight test; the server remains the source of truth for the timer and
 * final results.
 */

export interface MockTestStartResponse {
  session: MockTestSession;
  questions: MockQuestion[];
}

export interface MockTestTimerSync {
  sessionId: string;
  status: MockTestSession['status'];
  remainingSeconds: number;
  expiresAt: string;
  expired: boolean;
}

const SESSION_STORAGE_KEY = 'mock-test-active-session';

function readPersisted(): MockTestSessionDetail | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MockTestSessionDetail) : null;
  } catch {
    return null;
  }
}

function writePersisted(state: MockTestSessionDetail): void {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // sessionStorage may be unavailable (private mode / quota) — ignore
  }
}

function clearPersisted(): void {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Restore any in-flight mock test for the current browser tab.
 * Returns null when no active session exists (fresh reload after submit/clear).
 */
export function getActiveMockTest(): MockTestSessionDetail | null {
  return readPersisted();
}

export function clearActiveMockTest(): void {
  clearPersisted();
}

/**
 * Persist the user's draft answers locally so a reload can restore them.
 */
export function persistMockTestAnswers(
  sessionId: string,
  answers: UserAnswer[]
): void {
  const state = readPersisted();
  if (!state || state.session.id !== sessionId) return;
  writePersisted({ ...state, answers });
}

export function getMockTestAnswers(sessionId: string): UserAnswer[] {
  const state = readPersisted();
  return state && state.session.id === sessionId ? state.answers : [];
}

/**
 * Start a mock test for a given exam.
 * POST /mock-tests/:examSlug/start
 */
export async function startMockTest(
  examSlug: string,
  testType: TestType
): Promise<MockTestStartResponse> {
  const payload: MockTestStartRequest = { testType };
  // console.log(payload, testType);
  const { data } = await api.post<ApiResponse<MockTestStartResponse>>(
    API_ENDPOINTS.MOCK_TEST.START(examSlug),
    payload
  );
  // console.log(data);
  writePersisted({
    session: data.data.session,
    questions: data.data.questions,
    answers: [],
  });

  return data.data;
}

/**
 * Heartbeat poll against the server's authoritative timer.
 * GET /mock-tests/session/:sessionId/heartbeat
 */
export async function syncTestTimer(
  sessionId: string
): Promise<MockTestTimerSync> {
  const { data } = await api.get<ApiResponse<MockTestTimerSync>>(
    `/mock-tests/session/${sessionId}/heartbeat`
  );
  return data.data;
}

/**
 * Submit answers for a session and receive the computed result.
 * POST /mock-tests/session/:sessionId/submit
 */
export async function submitMockTest(
  sessionId: string,
  answers: UserAnswer[]
): Promise<MockTestResult> {
  const payload: MockTestSubmitRequest = { answers };
  console.log(payload, answers);
  const { data } = await api.post<ApiResponse<MockTestResult>>(
    `/mock-tests/session/${sessionId}/submit`,
    payload
  );

  clearPersisted();

  return data.data;
}

/**
 * Fetch the current state of a session (session + questions + saved answers).
 * GET /mock-tests/session/:sessionId
 */
export async function getMockTestSession(
  sessionId: string
): Promise<MockTestSessionDetail> {
  const { data } = await api.get<ApiResponse<MockTestSessionDetail>>(
    `/mock-tests/session/${sessionId}`
  );
  console.log(data);
  return data.data;
}
