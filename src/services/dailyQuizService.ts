import api from '@/lib/axios';
import type { DailyQuiz, DailyQuizQuestion } from '@/types/dailyQuiz';
import { toDateKey } from '@/utils/dateHelpers';

export interface DailyQuizSubmitResponse {
  score: number;
  totalQuestions: number;
}

const DAILY_QUIZ_SIZE = 8;

const MOCK_DAILY_QUIZ_BANK: DailyQuizQuestion[] = [
  {
    id: 'dq-001',
    text: 'Which city is the capital of Pakistan?',
    options: [
      { id: 'a', text: 'Karachi' },
      { id: 'b', text: 'Islamabad' },
      { id: 'c', text: 'Lahore' },
      { id: 'd', text: 'Peshawar' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Islamabad became the capital of Pakistan in 1963, replacing Karachi.',
  },
  {
    id: 'dq-002',
    text: 'Who is known as the \u2018Father of the Nation\u2019 in Pakistan?',
    options: [
      { id: 'a', text: 'Liaquat Ali Khan' },
      { id: 'b', text: 'Allama Iqbal' },
      { id: 'c', text: 'Muhammad Ali Jinnah' },
      { id: 'd', text: 'Sir Syed Ahmed Khan' },
    ],
    correctAnswerId: 'c',
    explanation:
      'Muhammad Ali Jinnah led the movement for a separate Muslim state and served as Pakistan\u2019s first Governor-General.',
  },
  {
    id: 'dq-003',
    text: 'Which is the largest ocean in the world?',
    options: [
      { id: 'a', text: 'Atlantic Ocean' },
      { id: 'b', text: 'Indian Ocean' },
      { id: 'c', text: 'Arctic Ocean' },
      { id: 'd', text: 'Pacific Ocean' },
    ],
    correctAnswerId: 'd',
    explanation:
      'The Pacific Ocean covers roughly one-third of the Earth\u2019s surface, making it the largest ocean.',
  },
  {
    id: 'dq-004',
    text: 'In which year did Pakistan conduct its nuclear tests?',
    options: [
      { id: 'a', text: '1995' },
      { id: 'b', text: '1998' },
      { id: 'c', text: '2001' },
      { id: 'd', text: '1990' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Pakistan conducted its nuclear tests on 28 May 1998, an event commemorated each year as Youm-e-Takbeer.',
  },
  {
    id: 'dq-005',
    text: 'Which currency is used in the United Kingdom?',
    options: [
      { id: 'a', text: 'Euro' },
      { id: 'b', text: 'Dollar' },
      { id: 'c', text: 'Pound Sterling' },
      { id: 'd', text: 'Yen' },
    ],
    correctAnswerId: 'c',
    explanation:
      'The Pound Sterling (GBP) is the official currency of the United Kingdom.',
  },
  {
    id: 'dq-006',
    text: 'What does CPEC stand for?',
    options: [
      { id: 'a', text: 'China-Pakistan Economic Corridor' },
      { id: 'b', text: 'Central-Plan Energy Charter' },
      { id: 'c', text: 'China-Pakistan Export Consortium' },
      { id: 'd', text: 'Central Pakistan Energy Corridor' },
    ],
    correctAnswerId: 'a',
    explanation:
      'CPEC is a major infrastructure and economic cooperation programme between China and Pakistan.',
  },
  {
    id: 'dq-007',
    text: 'Which is the longest river in Pakistan?',
    options: [
      { id: 'a', text: 'Ravi' },
      { id: 'b', text: 'Chenab' },
      { id: 'c', text: 'Indus' },
      { id: 'd', text: 'Jhelum' },
    ],
    correctAnswerId: 'c',
    explanation:
      'The Indus River is the longest river in Pakistan, flowing over 3,000 km from Tibet to the Arabian Sea.',
  },
  {
    id: 'dq-008',
    text: 'The Great Wall is a famous landmark in which country?',
    options: [
      { id: 'a', text: 'India' },
      { id: 'b', text: 'Japan' },
      { id: 'c', text: 'China' },
      { id: 'd', text: 'Mongolia' },
    ],
    correctAnswerId: 'c',
    explanation:
      'The Great Wall of China stretches over 20,000 km and was built over several dynasties.',
  },
  {
    id: 'dq-009',
    text: 'Which Pakistani city is famous for the Badshahi Mosque?',
    options: [
      { id: 'a', text: 'Multan' },
      { id: 'b', text: 'Lahore' },
      { id: 'c', text: 'Faisalabad' },
      { id: 'd', text: 'Rawalpindi' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The Badshahi Mosque, built by Emperor Aurangzeb in 1673, is located in Lahore.',
  },
  {
    id: 'dq-010',
    text: 'Which planet is known as the Red Planet?',
    options: [
      { id: 'a', text: 'Venus' },
      { id: 'b', text: 'Jupiter' },
      { id: 'c', text: 'Saturn' },
      { id: 'd', text: 'Mars' },
    ],
    correctAnswerId: 'd',
    explanation:
      'Mars appears red because of iron oxide, or rust, on its surface.',
  },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildMockDailyQuiz(quizDate: string): DailyQuiz {
  const daySeed = quizDate
    .split('-')
    .reduce((sum, part) => sum + Number.parseInt(part, 10) * 7, 0);

  const startIndex = daySeed % MOCK_DAILY_QUIZ_BANK.length;
  const questions = Array.from(
    { length: DAILY_QUIZ_SIZE },
    (_, i) =>
      MOCK_DAILY_QUIZ_BANK[(startIndex + i) % MOCK_DAILY_QUIZ_BANK.length]
  );

  return {
    id: `daily-${quizDate.replaceAll('-', '')}`,
    quizDate,
    title: 'Daily General Knowledge Quiz',
    category: 'General Knowledge',
    questions,
  };
}

function scoreMockQuiz(answers: Record<string, string>): number {
  return MOCK_DAILY_QUIZ_BANK.reduce(
    (score, question) =>
      answers[question.id] === question.correctAnswerId ? score + 1 : score,
    0
  );
}

/**
 * Fetch today's daily quiz.
 * Maps to: GET /api/v1/daily-quiz
 * Falls back to mock questions when the backend endpoint is unavailable.
 */
export async function getTodayQuiz(): Promise<DailyQuiz> {
  const quizDate = toDateKey(new Date());
  try {
    const { data } = await api.get<{ success: boolean; data: DailyQuiz }>(
      '/daily-quiz'
    );
    return data.data;
  } catch {
    await delay(400);
    return buildMockDailyQuiz(quizDate);
  }
}

/**
 * Submit answers for a daily quiz and return the score.
 * Maps to: POST /api/v1/daily-quiz/submit
 * Falls back to mock scoring when the backend endpoint is unavailable.
 */
export async function submitDailyQuiz(
  quizId: string,
  answers: Record<string, string>
): Promise<DailyQuizSubmitResponse> {
  try {
    const { data } = await api.post<{
      success: boolean;
      data: DailyQuizSubmitResponse;
    }>('/daily-quiz/submit', { quizId, answers });
    return data.data;
  } catch {
    await delay(600);
    return {
      score: scoreMockQuiz(answers),
      totalQuestions: Object.keys(answers).length,
    };
  }
}

export { MOCK_DAILY_QUIZ_BANK };
