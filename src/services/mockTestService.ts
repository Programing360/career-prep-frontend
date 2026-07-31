import type {
  MockQuestion,
  MockTestResult,
  MockTestSession,
  TestType,
  UserAnswer,
} from '@/types/mockTest';

/**
 * Mock test service — simulates the mock-test backend layer.
 *
 * API contract mapped:
 * - startMockTest   -> POST /api/mock-tests/:examSlug/start
 * - syncTestTimer   -> GET  /api/mock-tests/session/:id/heartbeat
 * - submitMockTest  -> POST /api/mock-tests/session/:id/submit
 *
 * Active session state (session + questions + draft answers) is persisted in
 * sessionStorage so a page reload / reconnection can restore an in-flight test.
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

export interface PersistedMockTest {
  session: MockTestSession;
  questions: MockQuestion[];
  answers: UserAnswer[];
}

const SESSION_STORAGE_KEY = 'mock-test-active-session';

const MOCK_DEMO_DURATION_SECONDS = 600;
const VERBAL_NONVERBAL_DURATION_SECONDS = 900;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createSessionId(): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `mt-${Date.now().toString(36)}-${rand}`;
}

function readPersisted(): PersistedMockTest | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistedMockTest) : null;
  } catch {
    return null;
  }
}

function writePersisted(state: PersistedMockTest): void {
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
export function getActiveMockTest(): PersistedMockTest | null {
  return readPersisted();
}

export function clearActiveMockTest(): void {
  clearPersisted();
}

/**
 * Persist the user's draft answers so a reload can restore them.
 * Maps to: PATCH /api/mock-tests/session/:id/answers (debounced on the client).
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
 * Maps to: POST /api/mock-tests/:examSlug/start
 */
export async function startMockTest(
  examSlug: string,
  testType: TestType
): Promise<MockTestStartResponse> {
  await delay(600);

  const questions =
    testType === 'verbal_nonverbal'
      ? MOCK_VERBAL_NONVERBAL_QUESTIONS
      : MOCK_DEMO_QUESTIONS;
  const durationSeconds =
    testType === 'verbal_nonverbal'
      ? VERBAL_NONVERBAL_DURATION_SECONDS
      : MOCK_DEMO_DURATION_SECONDS;
  const now = Date.now();

  const session: MockTestSession = {
    id: createSessionId(),
    examSlug,
    testType,
    startTime: new Date(now).toISOString(),
    durationSeconds,
    expiresAt: new Date(now + durationSeconds * 1000).toISOString(),
    isSubmitted: false,
    status: 'active',
  };

  writePersisted({ session, questions, answers: [] });

  return { session, questions };
}

/**
 * Heartbeat poll — simulates the server's authoritative timer.
 * Detects server-side expiry and flips the session to 'expired'.
 * Maps to: GET /api/mock-tests/session/:id/heartbeat
 */
export async function syncTestTimer(
  sessionId: string
): Promise<MockTestTimerSync> {
  await delay(250);

  const state = readPersisted();
  if (!state || state.session.id !== sessionId) {
    throw new Error('Mock test session not found.');
  }

  const { session } = state;

  if (session.isSubmitted) {
    return {
      sessionId,
      status: 'completed',
      remainingSeconds: 0,
      expiresAt: session.expiresAt,
      expired: true,
    };
  }

  const remainingMs = new Date(session.expiresAt).getTime() - Date.now();
  if (remainingMs <= 0) {
    const expiredSession: MockTestSession = {
      ...session,
      status: 'expired',
    };
    writePersisted({ ...state, session: expiredSession });
    return {
      sessionId,
      status: 'expired',
      remainingSeconds: 0,
      expiresAt: session.expiresAt,
      expired: true,
    };
  }

  return {
    sessionId,
    status: 'active',
    remainingSeconds: Math.ceil(remainingMs / 1000),
    expiresAt: session.expiresAt,
    expired: false,
  };
}

/**
 * Submit answers for a session and receive the computed result.
 * Unanswered questions are counted as incorrect.
 * Maps to: POST /api/mock-tests/session/:id/submit
 */
export async function submitMockTest(
  sessionId: string,
  answers: UserAnswer[]
): Promise<MockTestResult> {
  await delay(700);

  const state = readPersisted();
  if (!state || state.session.id !== sessionId) {
    throw new Error('Mock test session not found.');
  }

  const { session, questions } = state;
  if (session.isSubmitted) {
    throw new Error('Mock test session has already been submitted.');
  }

  const answerMap = new Map(
    answers.map((answer) => [answer.questionId, answer])
  );

  let correctCount = 0;
  const subjectTotals = new Map<string, { total: number; correct: number }>();

  for (const question of questions) {
    const entry = subjectTotals.get(question.subjectCategory) ?? {
      total: 0,
      correct: 0,
    };
    entry.total += 1;

    const answer = answerMap.get(question.id);
    if (answer && answer.selectedOptionId === question.correctAnswerId) {
      correctCount += 1;
      entry.correct += 1;
    }

    subjectTotals.set(question.subjectCategory, entry);
  }

  const totalQuestions = questions.length;
  const incorrectCount = totalQuestions - correctCount;

  const expired = Date.now() >= new Date(session.expiresAt).getTime();
  const rawTimeSpent = Math.floor(
    (Date.now() - new Date(session.startTime).getTime()) / 1000
  );
  const timeSpentSeconds = expired
    ? session.durationSeconds
    : Math.min(session.durationSeconds, rawTimeSpent);

  const subjectBreakdown = Array.from(subjectTotals.entries()).map(
    ([subject, entry]) => ({
      subject,
      totalQuestions: entry.total,
      correctCount: entry.correct,
      incorrectCount: entry.total - entry.correct,
      accuracyPercentage:
        entry.total > 0 ? Math.round((entry.correct / entry.total) * 100) : 0,
    })
  );

  const completedSession: MockTestSession = {
    ...session,
    isSubmitted: true,
    status: 'completed',
  };
  writePersisted({ ...state, session: completedSession, answers });

  return {
    sessionId,
    score: correctCount,
    totalQuestions,
    correctCount,
    incorrectCount,
    timeSpentSeconds,
    subjectBreakdown,
  };
}

/* ------------------------------------------------------------------ */
/* Demo question banks                                                 */
/* ------------------------------------------------------------------ */

const MOCK_DEMO_QUESTIONS: MockQuestion[] = [
  {
    id: 'md-1',
    text: 'Which city is the capital of Australia?',
    questionType: 'text',
    options: [
      { id: 'md-1-a', text: 'Sydney' },
      { id: 'md-1-b', text: 'Melbourne' },
      { id: 'md-1-c', text: 'Canberra' },
      { id: 'md-1-d', text: 'Perth' },
    ],
    correctAnswerId: 'md-1-c',
    subjectCategory: 'General Knowledge',
    explanation:
      'Canberra is the capital of Australia, selected as a compromise between Sydney and Melbourne.',
  },
  {
    id: 'md-2',
    text: 'What is the largest desert in the world (by area)?',
    questionType: 'text',
    options: [
      { id: 'md-2-a', text: 'Sahara' },
      { id: 'md-2-b', text: 'Arabian' },
      { id: 'md-2-c', text: 'Gobi' },
      { id: 'md-2-d', text: 'Kalahari' },
    ],
    correctAnswerId: 'md-2-a',
    subjectCategory: 'General Knowledge',
    explanation:
      'The Sahara is the largest hot desert, covering about 9.2 million square kilometres of North Africa.',
  },
  {
    id: 'md-3',
    text: 'Who was the founder of Pakistan?',
    questionType: 'text',
    options: [
      { id: 'md-3-a', text: 'Liaquat Ali Khan' },
      { id: 'md-3-b', text: 'Allama Iqbal' },
      { id: 'md-3-c', text: 'Quaid-e-Azam Muhammad Ali Jinnah' },
      { id: 'md-3-d', text: 'Sir Syed Ahmad Khan' },
    ],
    correctAnswerId: 'md-3-c',
    subjectCategory: 'Pakistan Studies',
    explanation:
      'Quaid-e-Azam Muhammad Ali Jinnah led the All-India Muslim League to the creation of Pakistan in 1947.',
  },
  {
    id: 'md-4',
    text: 'How many pillars of Islam are there?',
    questionType: 'text',
    options: [
      { id: 'md-4-a', text: '3' },
      { id: 'md-4-b', text: '4' },
      { id: 'md-4-c', text: '5' },
      { id: 'md-4-d', text: '6' },
    ],
    correctAnswerId: 'md-4-c',
    subjectCategory: 'Islamic Studies',
    explanation:
      'The five pillars of Islam are Shahada, Salah, Sawm, Zakat and Hajj.',
  },
  {
    id: 'md-5',
    text: 'Choose the closest synonym of "Ubiquitous":',
    questionType: 'text',
    options: [
      { id: 'md-5-a', text: 'Rare' },
      { id: 'md-5-b', text: 'Everywhere-present' },
      { id: 'md-5-c', text: 'Hidden' },
      { id: 'md-5-d', text: 'Temporary' },
    ],
    correctAnswerId: 'md-5-b',
    subjectCategory: 'English',
    explanation: 'Ubiquitous means present, appearing, or found everywhere.',
  },
  {
    id: 'md-6',
    text: 'What is 15% of 240?',
    questionType: 'text',
    options: [
      { id: 'md-6-a', text: '32' },
      { id: 'md-6-b', text: '34' },
      { id: 'md-6-c', text: '36' },
      { id: 'md-6-d', text: '38' },
    ],
    correctAnswerId: 'md-6-c',
    subjectCategory: 'Mathematics',
    explanation: '15% of 240 = 0.15 × 240 = 36.',
  },
  {
    id: 'md-7',
    text: 'The headquarters of SAARC is located in which city?',
    questionType: 'text',
    options: [
      { id: 'md-7-a', text: 'New Delhi' },
      { id: 'md-7-b', text: 'Kathmandu' },
      { id: 'md-7-c', text: 'Dhaka' },
      { id: 'md-7-d', text: 'Colombo' },
    ],
    correctAnswerId: 'md-7-b',
    subjectCategory: 'Current Affairs',
    explanation: 'The SAARC Secretariat is headquartered in Kathmandu, Nepal.',
  },
  {
    id: 'md-8',
    text: 'DNA stands for:',
    questionType: 'text',
    options: [
      { id: 'md-8-a', text: 'Deoxyribonucleic Acid' },
      { id: 'md-8-b', text: 'Dinuclear Amino Acid' },
      { id: 'md-8-c', text: 'Deoxyribose Nuclear Acid' },
      { id: 'md-8-d', text: 'Di-nucleic Atomic Acid' },
    ],
    correctAnswerId: 'md-8-a',
    subjectCategory: 'Science',
    explanation:
      'DNA (Deoxyribonucleic Acid) carries the genetic instructions for all known living organisms.',
  },
  {
    id: 'md-9',
    text: 'Which of the following is the national currency of Japan?',
    questionType: 'text',
    options: [
      { id: 'md-9-a', text: 'Won' },
      { id: 'md-9-b', text: 'Yuan' },
      { id: 'md-9-c', text: 'Yen' },
      { id: 'md-9-d', text: 'Ringgit' },
    ],
    correctAnswerId: 'md-9-c',
    subjectCategory: 'General Knowledge',
    explanation: 'The yen is the official currency of Japan.',
  },
  {
    id: 'md-10',
    text: 'Who is regarded as the national poet of Pakistan?',
    questionType: 'text',
    options: [
      { id: 'md-10-a', text: 'Faiz Ahmad Faiz' },
      { id: 'md-10-b', text: 'Allama Iqbal' },
      { id: 'md-10-c', text: 'Ahmad Faraz' },
      { id: 'md-10-d', text: 'Habib Jalib' },
    ],
    correctAnswerId: 'md-10-b',
    subjectCategory: 'Pakistan Studies',
    explanation:
      'Allama Muhammad Iqbal, author of "Tarana-e-Hind" and the "Shikwa/Jawab-e-Shikwa", is the national poet of Pakistan.',
  },
];

/* ------------------------------------------------------------------ */
/* Verbal / Non-verbal demo bank (includes diagram & image questions)  */
/* ------------------------------------------------------------------ */

const DIAGRAM_STROKE = '#334155';
const DIAGRAM_FILL = '#6366f1';
const DIAGRAM_FILL_LIGHT = '#e0e7ff';
const DIAGRAM_ACCENT = '#f43f5e';

function svgToDataUri(width: number, height: number, inner: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">` +
    `<rect width="${width}" height="${height}" rx="14" fill="#ffffff"/>` +
    inner +
    '</svg>';
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function optionSvg(inner: string): string {
  return svgToDataUri(96, 96, inner);
}

const OPTION_TEMPLATES: Record<string, string> = {
  triangle:
    '<path d="M48 20 L74 76 L22 76 Z" fill="' +
    DIAGRAM_FILL_LIGHT +
    '" stroke="' +
    DIAGRAM_STROKE +
    '" stroke-width="4" stroke-linejoin="round"/>',
  square:
    '<rect x="24" y="24" width="48" height="48" rx="6" fill="' +
    DIAGRAM_FILL_LIGHT +
    '" stroke="' +
    DIAGRAM_STROKE +
    '" stroke-width="4"/>',
  pentagon:
    '<path d="M48 20 L74 36 L66 66 L30 66 L22 36 Z" fill="' +
    DIAGRAM_FILL_LIGHT +
    '" stroke="' +
    DIAGRAM_STROKE +
    '" stroke-width="4" stroke-linejoin="round"/>',
  hexagon:
    '<path d="M48 16 L70 27 L70 50 L48 62 L26 50 L26 27 Z" fill="' +
    DIAGRAM_FILL_LIGHT +
    '" stroke="' +
    DIAGRAM_STROKE +
    '" stroke-width="4" stroke-linejoin="round"/>',
  circle:
    '<circle cx="48" cy="48" r="30" fill="' +
    DIAGRAM_FILL_LIGHT +
    '" stroke="' +
    DIAGRAM_STROKE +
    '" stroke-width="4"/>',
  star:
    '<path d="M48 18 L56.5 37.5 L78 40 L62 55 L66.5 76 L48 65.5 L29.5 76 L34 55 L18 40 L39.5 37.5 Z" fill="' +
    DIAGRAM_FILL_LIGHT +
    '" stroke="' +
    DIAGRAM_STROKE +
    '" stroke-width="4" stroke-linejoin="round"/>',
  octagon:
    '<path d="M48 18 L65 29 L78 46 L78 66 L65 83 L48 94 L31 83 L18 66 L18 46 Z" fill="' +
    DIAGRAM_FILL_LIGHT +
    '" stroke="' +
    DIAGRAM_STROKE +
    '" stroke-width="4" stroke-linejoin="round"/>',
};

function seriesStemSvg(): string {
  return svgToDataUri(
    240,
    150,
    '<path d="M40 40 L20 110 L60 110 Z" fill="' +
      DIAGRAM_FILL_LIGHT +
      '" stroke="' +
      DIAGRAM_STROKE +
      '" stroke-width="4" stroke-linejoin="round"/>' +
      '<rect x="95" y="35" width="50" height="50" rx="5" fill="' +
      DIAGRAM_FILL_LIGHT +
      '" stroke="' +
      DIAGRAM_STROKE +
      '" stroke-width="4"/>' +
      '<path d="M200 34 L234 54 L218 92 L182 92 L166 54 Z" fill="' +
      DIAGRAM_FILL_LIGHT +
      '" stroke="' +
      DIAGRAM_STROKE +
      '" stroke-width="4" stroke-linejoin="round"/>'
  );
}

const STRIPE_PATTERN =
  '<defs><pattern id="stripe" width="14" height="14" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">' +
  '<rect width="14" height="14" fill="' +
  DIAGRAM_FILL_LIGHT +
  '"/>' +
  '<rect width="7" height="14" fill="' +
  DIAGRAM_FILL +
  '"/>' +
  '</pattern></defs>';

function figureCompletionStemSvg(): string {
  return svgToDataUri(
    240,
    240,
    STRIPE_PATTERN +
      '<rect x="30" y="30" width="180" height="180" rx="10" fill="none" stroke="' +
      DIAGRAM_STROKE +
      '" stroke-width="4"/>' +
      '<rect x="30" y="30" width="90" height="90" fill="url(#stripe)"/>' +
      '<rect x="120" y="120" width="90" height="90" fill="url(#stripe)"/>' +
      '<line x1="120" y1="30" x2="120" y2="210" stroke="' +
      DIAGRAM_STROKE +
      '" stroke-width="4"/>' +
      '<line x1="30" y1="120" x2="210" y2="120" stroke="' +
      DIAGRAM_STROKE +
      '" stroke-width="4"/>' +
      '<rect x="30" y="30" width="180" height="180" rx="10" fill="none" stroke="' +
      DIAGRAM_STROKE +
      '" stroke-width="4"/>'
  );
}

const DOTTED_LINE =
  '<line x1="120" y1="12" x2="120" y2="228" stroke="#94a3b8" stroke-width="2.5" stroke-dasharray="7 7"/>';

function mirrorArrowSvg(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  barb1: string,
  barb2: string,
  dotX: number,
  dotY: number
): string {
  return (
    '<line x1="' +
    x1 +
    '" y1="' +
    y1 +
    '" x2="' +
    x2 +
    '" y2="' +
    y2 +
    '" stroke="' +
    DIAGRAM_STROKE +
    '" stroke-width="6" stroke-linecap="round"/>' +
    '<path d="' +
    barb1 +
    ' ' +
    barb2 +
    ' Z" fill="' +
    DIAGRAM_STROKE +
    '"/>' +
    '<circle cx="' +
    dotX +
    '" cy="' +
    dotY +
    '" r="7" fill="#e11d48"/>'
  );
}

function mirrorStemSvg(): string {
  return svgToDataUri(
    240,
    240,
    DOTTED_LINE +
      mirrorArrowSvg(75, 170, 148, 98, 'M148 98 L126 90 L140 114', '', 100, 132)
  );
}

function mirrorOptionSvg(variant: 'ne' | 'nw' | 'se' | 'sw'): string {
  if (variant === 'nw') {
    return optionSvg(
      mirrorArrowSvg(60, 70, 10, 20, 'M10 20 L32 12 L18 36', '', 36, 32)
    );
  }
  if (variant === 'se') {
    return optionSvg(
      mirrorArrowSvg(36, 26, 86, 76, 'M86 76 L64 68 L78 92', '', 60, 64)
    );
  }
  if (variant === 'sw') {
    return optionSvg(
      mirrorArrowSvg(60, 26, 10, 76, 'M10 76 L32 68 L18 92', '', 36, 64)
    );
  }
  // ne (original)
  return optionSvg(
    mirrorArrowSvg(36, 70, 86, 20, 'M86 20 L64 28 L78 4', '', 60, 32)
  );
}

function countTrianglesStemSvg(): string {
  return svgToDataUri(
    240,
    240,
    '<path d="M120 40 L40 200 L200 200 Z" fill="' +
      DIAGRAM_FILL_LIGHT +
      '" stroke="' +
      DIAGRAM_STROKE +
      '" stroke-width="4" stroke-linejoin="round"/>' +
      '<line x1="120" y1="40" x2="120" y2="200" stroke="' +
      DIAGRAM_STROKE +
      '" stroke-width="4"/>' +
      '<line x1="120" y1="200" x2="80" y2="120" stroke="' +
      DIAGRAM_STROKE +
      '" stroke-width="4"/>' +
      '<line x1="120" y1="200" x2="160" y2="120" stroke="' +
      DIAGRAM_STROKE +
      '" stroke-width="4"/>' +
      '<line x1="80" y1="120" x2="160" y2="120" stroke="' +
      DIAGRAM_STROKE +
      '" stroke-width="4"/>'
  );
}

function foldedPaperStemSvg(): string {
  return svgToDataUri(
    240,
    240,
    '<rect x="30" y="30" width="180" height="180" rx="8" fill="#f8fafc" stroke="' +
      DIAGRAM_STROKE +
      '" stroke-width="4"/>' +
      '<line x1="48" y1="192" x2="192" y2="48" stroke="' +
      DIAGRAM_STROKE +
      '" stroke-width="3" stroke-dasharray="8 8"/>' +
      '<circle cx="168" cy="58" r="9" fill="' +
      DIAGRAM_ACCENT +
      '"/>' +
      '<circle cx="58" cy="168" r="9" fill="none" stroke="' +
      DIAGRAM_ACCENT +
      '" stroke-width="3" stroke-dasharray="4 4"/>'
  );
}

function holeOptionSvg(holes: Array<[number, number]>): string {
  const circles = holes
    .map(
      ([x, y]) =>
        '<circle cx="' +
        x +
        '" cy="' +
        y +
        '" r="8" fill="' +
        DIAGRAM_ACCENT +
        '"/>'
    )
    .join('');
  return optionSvg(
    '<rect x="18" y="18" width="60" height="60" rx="6" fill="#f8fafc" stroke="' +
      DIAGRAM_STROKE +
      '" stroke-width="4"/>' +
      circles
  );
}

function makeVerbals(): MockQuestion[] {
  return [
    {
      id: 'vn-v1',
      text: 'Select the closest synonym of "Erudite":',
      questionType: 'text',
      options: [
        { id: 'vn-v1-a', text: 'Learned' },
        { id: 'vn-v1-b', text: 'Ignorant' },
        { id: 'vn-v1-c', text: 'Careless' },
        { id: 'vn-v1-d', text: 'Arrogant' },
      ],
      correctAnswerId: 'vn-v1-a',
      subjectCategory: 'Verbal Reasoning',
      explanation:
        'Erudite means having or showing great knowledge or learning; learned.',
    },
    {
      id: 'vn-v2',
      text: 'Select the word most nearly OPPOSITE in meaning to "Magnanimous":',
      questionType: 'text',
      options: [
        { id: 'vn-v2-a', text: 'Generous' },
        { id: 'vn-v2-b', text: 'Noble' },
        { id: 'vn-v2-c', text: 'Petty' },
        { id: 'vn-v2-d', text: 'Forgiving' },
      ],
      correctAnswerId: 'vn-v2-c',
      subjectCategory: 'Verbal Reasoning',
      explanation:
        'Magnanimous means generous or forgiving; petty means small-minded — its antonym.',
    },
    {
      id: 'vn-v3',
      text: 'Doctor is to Hospital as Teacher is to ______.',
      questionType: 'text',
      options: [
        { id: 'vn-v3-a', text: 'University' },
        { id: 'vn-v3-b', text: 'School' },
        { id: 'vn-v3-c', text: 'Library' },
        { id: 'vn-v3-d', text: 'Students' },
      ],
      correctAnswerId: 'vn-v3-b',
      subjectCategory: 'Verbal Reasoning',
      explanation:
        'A doctor works in a hospital; a teacher works in a school. (School is the better fit than university, which is only one kind of school.)',
    },
    {
      id: 'vn-v4',
      text: 'The committee remained ______ in its stance, refusing to reconsider the proposal.',
      questionType: 'text',
      options: [
        { id: 'vn-v4-a', text: 'flexible' },
        { id: 'vn-v4-b', text: 'obstinate' },
        { id: 'vn-v4-c', text: 'indecisive' },
        { id: 'vn-v4-d', text: 'receptive' },
      ],
      correctAnswerId: 'vn-v4-b',
      subjectCategory: 'Verbal Reasoning',
      explanation:
        '"Obstinate" (stubborn) fits the context of refusing to change position.',
    },
    {
      id: 'vn-v5',
      text: 'Find the next number in the series: 2, 6, 12, 20, ___.',
      questionType: 'text',
      options: [
        { id: 'vn-v5-a', text: '28' },
        { id: 'vn-v5-b', text: '30' },
        { id: 'vn-v5-c', text: '32' },
        { id: 'vn-v5-d', text: '36' },
      ],
      correctAnswerId: 'vn-v5-b',
      subjectCategory: 'Verbal Reasoning',
      explanation:
        'The series adds consecutive even numbers: +4, +6, +8, so the next difference is +10 → 20 + 10 = 30.',
    },
    {
      id: 'vn-v6',
      text: 'Which word does NOT belong with the others?',
      questionType: 'text',
      options: [
        { id: 'vn-v6-a', text: 'Apple' },
        { id: 'vn-v6-b', text: 'Mango' },
        { id: 'vn-v6-c', text: 'Carrot' },
        { id: 'vn-v6-d', text: 'Banana' },
      ],
      correctAnswerId: 'vn-v6-c',
      subjectCategory: 'Verbal Reasoning',
      explanation:
        'Apple, mango and banana are fruits; a carrot is a vegetable.',
    },
  ];
}

function makeNonVerbals(): MockQuestion[] {
  return [
    {
      id: 'vn-nv1',
      text: 'Study the series of figures. Which figure comes next in the sequence?',
      questionType: 'diagram',
      questionImageUrl: seriesStemSvg(),
      options: [
        {
          id: 'vn-nv1-a',
          text: 'Hexagon',
          imageUrl: optionSvg(OPTION_TEMPLATES.hexagon),
        },
        {
          id: 'vn-nv1-b',
          text: 'Circle',
          imageUrl: optionSvg(OPTION_TEMPLATES.circle),
        },
        {
          id: 'vn-nv1-c',
          text: 'Star',
          imageUrl: optionSvg(OPTION_TEMPLATES.star),
        },
        {
          id: 'vn-nv1-d',
          text: 'Octagon',
          imageUrl: optionSvg(OPTION_TEMPLATES.octagon),
        },
      ],
      correctAnswerId: 'vn-nv1-a',
      subjectCategory: 'Non-Verbal Reasoning',
      explanation:
        'The sequence adds one side to each polygon: triangle → square → pentagon, so the next figure is a hexagon.',
    },
    {
      id: 'vn-nv2',
      text: 'Which of the following figures is the ODD one out?',
      questionType: 'image',
      options: [
        {
          id: 'vn-nv2-a',
          text: 'Circle',
          imageUrl: optionSvg(OPTION_TEMPLATES.circle),
        },
        {
          id: 'vn-nv2-b',
          text: 'Circle',
          imageUrl: optionSvg(OPTION_TEMPLATES.circle),
        },
        {
          id: 'vn-nv2-c',
          text: 'Square',
          imageUrl: optionSvg(
            '<rect x="20" y="20" width="56" height="56" rx="6" fill="#fecdd3" stroke="#be123c" stroke-width="5"/>'
          ),
        },
        {
          id: 'vn-nv2-d',
          text: 'Circle',
          imageUrl: optionSvg(OPTION_TEMPLATES.circle),
        },
      ],
      correctAnswerId: 'vn-nv2-c',
      subjectCategory: 'Non-Verbal Reasoning',
      explanation:
        'Three figures are circles and one is a square, so the square is the odd one out.',
    },
    {
      id: 'vn-nv3',
      text: 'Complete the pattern. Which piece belongs in the empty quadrant?',
      questionType: 'diagram',
      questionImageUrl: figureCompletionStemSvg(),
      options: [
        {
          id: 'vn-nv3-a',
          text: 'Diagonal stripes',
          imageUrl: optionSvg(
            STRIPE_PATTERN +
              '<rect x="20" y="20" width="56" height="56" rx="6" fill="url(#stripe)"/>'
          ),
        },
        {
          id: 'vn-nv3-b',
          text: 'Blank square',
          imageUrl: optionSvg(
            '<rect x="20" y="20" width="56" height="56" rx="6" fill="none" stroke="' +
              DIAGRAM_STROKE +
              '" stroke-width="4"/>'
          ),
        },
        {
          id: 'vn-nv3-c',
          text: 'Dotted square',
          imageUrl: optionSvg(
            '<rect x="20" y="20" width="56" height="56" rx="6" fill="none" stroke="' +
              DIAGRAM_STROKE +
              '" stroke-width="4"/>' +
              '<circle cx="34" cy="34" r="7" fill="' +
              DIAGRAM_FILL +
              '"/>' +
              '<circle cx="62" cy="34" r="7" fill="' +
              DIAGRAM_FILL +
              '"/>' +
              '<circle cx="34" cy="62" r="7" fill="' +
              DIAGRAM_FILL +
              '"/>' +
              '<circle cx="62" cy="62" r="7" fill="' +
              DIAGRAM_FILL +
              '"/>'
          ),
        },
        {
          id: 'vn-nv3-d',
          text: 'Horizontal stripes',
          imageUrl: optionSvg(
            '<rect x="20" y="20" width="56" height="56" rx="6" fill="#e0e7ff" stroke="' +
              DIAGRAM_STROKE +
              '" stroke-width="4"/>' +
              '<rect x="20" y="33" width="56" height="11" fill="' +
              DIAGRAM_FILL +
              '"/>' +
              '<rect x="20" y="53" width="56" height="11" fill="' +
              DIAGRAM_FILL +
              '"/>'
          ),
        },
      ],
      correctAnswerId: 'vn-nv3-a',
      subjectCategory: 'Non-Verbal Reasoning',
      explanation:
        'The pattern is symmetrical across both diagonals: opposite quadrants share the same fill. The missing quadrant mirrors the striped one, so diagonal stripes complete the figure.',
    },
    {
      id: 'vn-nv4',
      text: 'A mirror is placed along the dotted vertical line. Which of the following is the correct mirror image of the given figure?',
      questionType: 'diagram',
      questionImageUrl: mirrorStemSvg(),
      options: [
        {
          id: 'vn-nv4-a',
          text: 'Original arrow',
          imageUrl: mirrorOptionSvg('ne'),
        },
        {
          id: 'vn-nv4-b',
          text: 'Mirrored arrow',
          imageUrl: mirrorOptionSvg('nw'),
        },
        {
          id: 'vn-nv4-c',
          text: 'Rotated arrow',
          imageUrl: mirrorOptionSvg('se'),
        },
        {
          id: 'vn-nv4-d',
          text: 'Rotated arrow',
          imageUrl: mirrorOptionSvg('sw'),
        },
      ],
      correctAnswerId: 'vn-nv4-b',
      subjectCategory: 'Non-Verbal Reasoning',
      explanation:
        'A vertical mirror flips left and right: the north-east arrow becomes a north-west arrow, with the dot reflecting to the other side of the arrow.',
    },
    {
      id: 'vn-nv5',
      text: 'How many triangles are there in the given figure?',
      questionType: 'diagram',
      questionImageUrl: countTrianglesStemSvg(),
      options: [
        { id: 'vn-nv5-a', text: '3' },
        { id: 'vn-nv5-b', text: '4' },
        { id: 'vn-nv5-c', text: '5' },
        { id: 'vn-nv5-d', text: '6' },
      ],
      correctAnswerId: 'vn-nv5-c',
      subjectCategory: 'Non-Verbal Reasoning',
      explanation:
        'The figure contains 3 corner triangles, 1 central inverted triangle and 1 large outer triangle — 5 triangles in total.',
    },
    {
      id: 'vn-nv6',
      text: 'A square paper is folded along the dashed line and a hole is punched as shown. Which figure shows the paper after it is unfolded?',
      questionType: 'diagram',
      questionImageUrl: foldedPaperStemSvg(),
      options: [
        {
          id: 'vn-nv6-a',
          text: 'One hole',
          imageUrl: holeOptionSvg([[68, 28]]),
        },
        {
          id: 'vn-nv6-b',
          text: 'Two mirrored holes',
          imageUrl: holeOptionSvg([
            [66, 28],
            [28, 66],
          ]),
        },
        {
          id: 'vn-nv6-c',
          text: 'Two adjacent holes',
          imageUrl: holeOptionSvg([
            [60, 34],
            [70, 58],
          ]),
        },
        {
          id: 'vn-nv6-d',
          text: 'Four holes',
          imageUrl: holeOptionSvg([
            [28, 28],
            [68, 28],
            [28, 68],
            [68, 68],
          ]),
        },
      ],
      correctAnswerId: 'vn-nv6-b',
      subjectCategory: 'Non-Verbal Reasoning',
      explanation:
        'When the paper is unfolded, the punched hole is reflected across the fold line, producing a mirrored pair of holes.',
    },
  ];
}

const MOCK_VERBAL_NONVERBAL_QUESTIONS: MockQuestion[] = [
  ...makeVerbals(),
  ...makeNonVerbals(),
];

export { MOCK_DEMO_QUESTIONS, MOCK_VERBAL_NONVERBAL_QUESTIONS };
