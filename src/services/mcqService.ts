import type { MCQQuestion, MCQFilterState, MCQUserProgress } from '@/types/mcq';

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

const MOCK_TOPICS: TopicOption[] = [
  { id: 'general-knowledge', name: 'General Knowledge' },
  { id: 'current-affairs', name: 'Current Affairs' },
  { id: 'english', name: 'English' },
  { id: 'math', name: 'Mathematics' },
  { id: 'physics', name: 'Physics' },
  { id: 'pak-studies', name: 'Pakistan Studies' },
  { id: 'islamic-studies', name: 'Islamic Studies' },
  { id: 'computer-science', name: 'Computer Science' },
];

const MOCK_QUESTIONS: MCQQuestion[] = [
  {
    id: 'mcq-1',
    question: 'Which of the following is the largest ocean on Earth?',
    imageUrl: undefined,
    options: [
      { id: 'opt-1a', text: 'Atlantic Ocean' },
      { id: 'opt-1b', text: 'Indian Ocean' },
      { id: 'opt-1c', text: 'Pacific Ocean', isCorrect: true },
      { id: 'opt-1d', text: 'Arctic Ocean' },
    ],
    explanation:
      'The Pacific Ocean is the largest and deepest ocean on Earth, covering more than 60 million square miles. It spans from the Arctic in the north to the Southern Ocean in the south.',
    topicId: 'general-knowledge',
    difficulty: 'Easy',
  },
  {
    id: 'mcq-2',
    question: 'What is the powerhouse of the cell?',
    options: [
      { id: 'opt-2a', text: 'Nucleus' },
      { id: 'opt-2b', text: 'Mitochondria', isCorrect: true },
      { id: 'opt-2c', text: 'Ribosome' },
      { id: 'opt-2d', text: 'Golgi apparatus' },
    ],
    explanation:
      "Mitochondria are often called the powerhouse of the cell because they generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy.",
    topicId: 'general-knowledge',
    difficulty: 'Easy',
  },
  {
    id: 'mcq-3',
    question: 'Which planet is known as the Red Planet?',
    options: [
      { id: 'opt-3a', text: 'Venus' },
      { id: 'opt-3b', text: 'Jupiter' },
      { id: 'opt-3c', text: 'Mars', isCorrect: true },
      { id: 'opt-3d', text: 'Saturn' },
    ],
    explanation:
      'Mars is called the Red Planet because of iron oxide (rust) on its surface, which gives it a reddish appearance visible from Earth.',
    topicId: 'general-knowledge',
    difficulty: 'Easy',
  },
  {
    id: 'mcq-4',
    question: 'Solve for x: 2x + 5 = 15',
    options: [
      { id: 'opt-4a', text: 'x = 4' },
      { id: 'opt-4b', text: 'x = 5', isCorrect: true },
      { id: 'opt-4c', text: 'x = 6' },
      { id: 'opt-4d', text: 'x = 7' },
    ],
    explanation:
      'Subtract 5 from both sides: 2x = 10. Divide both sides by 2: x = 5.',
    topicId: 'math',
    difficulty: 'Easy',
    formulaNotation: '2x + 5 = 15',
  },
  {
    id: 'mcq-5',
    question: 'Who was the founder of Pakistan?',
    options: [
      { id: 'opt-5a', text: 'Liaquat Ali Khan' },
      { id: 'opt-5b', text: 'Allama Iqbal' },
      {
        id: 'opt-5c',
        text: 'Quaid-e-Azam Muhammad Ali Jinnah',
        isCorrect: true,
      },
      { id: 'opt-5d', text: 'Sir Syed Ahmad Khan' },
    ],
    explanation:
      'Quaid-e-Azam Muhammad Ali Jinnah is recognized as the founder of Pakistan. He led the All-India Muslim League and played a pivotal role in the creation of Pakistan in 1947.',
    topicId: 'pak-studies',
    difficulty: 'Easy',
  },
  {
    id: 'mcq-6',
    question: 'What is the speed of light in a vacuum?',
    options: [
      { id: 'opt-6a', text: '300,000 km/s', isCorrect: true },
      { id: 'opt-6b', text: '150,000 km/s' },
      { id: 'opt-6c', text: '450,000 km/s' },
      { id: 'opt-6d', text: '600,000 km/s' },
    ],
    explanation:
      'The speed of light in a vacuum is approximately 299,792 km/s, commonly rounded to 300,000 km/s. It is denoted by the constant c.',
    topicId: 'physics',
    difficulty: 'Medium',
    formulaNotation: 'c = 299,792,458 \\text{ m/s}',
  },
  {
    id: 'mcq-7',
    question: "Which gas is most abundant in Earth's atmosphere?",
    options: [
      { id: 'opt-7a', text: 'Oxygen' },
      { id: 'opt-7b', text: 'Carbon Dioxide' },
      { id: 'opt-7c', text: 'Nitrogen', isCorrect: true },
      { id: 'opt-7d', text: 'Argon' },
    ],
    explanation:
      "Nitrogen makes up approximately 78% of Earth's atmosphere, followed by oxygen at about 21%.",
    topicId: 'general-knowledge',
    difficulty: 'Easy',
  },
  {
    id: 'mcq-8',
    question: 'What does CPU stand for in computing?',
    options: [
      { id: 'opt-8a', text: 'Central Processing Unit', isCorrect: true },
      { id: 'opt-8b', text: 'Central Program Utility' },
      { id: 'opt-8c', text: 'Computer Personal Unit' },
      { id: 'opt-8d', text: 'Central Peripheral Unit' },
    ],
    explanation:
      'CPU stands for Central Processing Unit. It is the primary component of a computer that performs most of the processing inside the computer.',
    topicId: 'computer-science',
    difficulty: 'Easy',
  },
  {
    id: 'mcq-9',
    question: 'In which year did World War II end?',
    options: [
      { id: 'opt-9a', text: '1943' },
      { id: 'opt-9b', text: '1944' },
      { id: 'opt-9c', text: '1945', isCorrect: true },
      { id: 'opt-9d', text: '1946' },
    ],
    explanation:
      'World War II ended in 1945. Germany surrendered in May 1945 (V-E Day), and Japan surrendered in August 1945 after the atomic bombings of Hiroshima and Nagasaki.',
    topicId: 'general-knowledge',
    difficulty: 'Easy',
  },
  {
    id: 'mcq-10',
    question: 'Choose the correct synonym of "Aberration":',
    options: [
      { id: 'opt-10a', text: 'Normality' },
      { id: 'opt-10b', text: 'Deviation', isCorrect: true },
      { id: 'opt-10c', text: 'Perfection' },
      { id: 'opt-10d', text: 'Consistency' },
    ],
    explanation:
      'Aberration means a departure from what is normal, usual, or expected. Deviation is its closest synonym.',
    topicId: 'english',
    difficulty: 'Medium',
  },
  {
    id: 'mcq-11',
    question: 'What is the chemical formula for water?',
    options: [
      { id: 'opt-11a', text: 'H2O', isCorrect: true },
      { id: 'opt-11b', text: 'CO2' },
      { id: 'opt-11c', text: 'NaCl' },
      { id: 'opt-11d', text: 'O2' },
    ],
    explanation:
      'Water is composed of two hydrogen atoms and one oxygen atom, giving it the chemical formula H₂O.',
    topicId: 'general-knowledge',
    difficulty: 'Easy',
    formulaNotation: 'H_2O',
  },
  {
    id: 'mcq-12',
    question: 'Which Surah of the Holy Quran is known as "Surah Al-Karim"?',
    options: [
      { id: 'opt-12a', text: 'Surah Al-Fatiha' },
      { id: 'opt-12b', text: 'Surah Al-Baqarah' },
      { id: 'opt-12c', text: 'Surah Al-Qalam', isCorrect: true },
      { id: 'opt-12d', text: 'Surah Ya-Seen' },
    ],
    explanation:
      'Surah Al-Qalam (Chapter 68) is known as Surah Al-Karim. It is named after the pen (Qalam) mentioned in its opening verses.',
    topicId: 'islamic-studies',
    difficulty: 'Medium',
  },
  {
    id: 'mcq-13',
    question: 'What is the derivative of sin(x)?',
    options: [
      { id: 'opt-13a', text: 'cos(x)', isCorrect: true },
      { id: 'opt-13b', text: '-cos(x)' },
      { id: 'opt-13c', text: 'tan(x)' },
      { id: 'opt-13d', text: '-sin(x)' },
    ],
    explanation:
      'The derivative of sin(x) with respect to x is cos(x). This is one of the fundamental derivatives in calculus.',
    topicId: 'math',
    difficulty: 'Medium',
    formulaNotation: '\\frac{d}{dx}\\sin(x) = \\cos(x)',
  },
  {
    id: 'mcq-14',
    question:
      'Which programming language is known as the "language of the web"?',
    options: [
      { id: 'opt-14a', text: 'Python' },
      { id: 'opt-14b', text: 'JavaScript', isCorrect: true },
      { id: 'opt-14c', text: 'Java' },
      { id: 'opt-14d', text: 'C++' },
    ],
    explanation:
      'JavaScript is known as the language of the web because it is the only programming language natively supported by all web browsers.',
    topicId: 'computer-science',
    difficulty: 'Easy',
  },
  {
    id: 'mcq-15',
    question: 'Who wrote the national anthem of Pakistan?',
    options: [
      { id: 'opt-15a', text: 'Allama Iqbal' },
      { id: 'opt-15b', text: 'Hafeez Jullundhri', isCorrect: true },
      { id: 'opt-15c', text: 'Faiz Ahmad Faiz' },
      { id: 'opt-15d', text: 'Ahmad Faraz' },
    ],
    explanation:
      'The national anthem of Pakistan, "Qaumi Taranah", was written by Hafeez Jullundhri in 1949. The music was composed by Ahmad G. Chagla.',
    topicId: 'pak-studies',
    difficulty: 'Medium',
  },
  {
    id: 'mcq-16',
    question: "Newton's First Law of Motion is also known as the law of:",
    options: [
      { id: 'opt-16a', text: 'Acceleration' },
      { id: 'opt-16b', text: 'Inertia', isCorrect: true },
      { id: 'opt-16c', text: 'Action-Reaction' },
      { id: 'opt-16d', text: 'Gravity' },
    ],
    explanation:
      "Newton's First Law states that an object at rest stays at rest, and an object in motion stays in motion unless acted upon by a force. This is called the Law of Inertia.",
    topicId: 'physics',
    difficulty: 'Easy',
  },
  {
    id: 'mcq-17',
    question: 'What is the capital of Turkey?',
    options: [
      { id: 'opt-17a', text: 'Istanbul' },
      { id: 'opt-17b', text: 'Ankara', isCorrect: true },
      { id: 'opt-17c', text: 'Izmir' },
      { id: 'opt-17d', text: 'Antalya' },
    ],
    explanation:
      'Ankara is the capital of Turkey, not Istanbul. Istanbul is the largest city, but Ankara has been the capital since 1923.',
    topicId: 'general-knowledge',
    difficulty: 'Medium',
  },
  {
    id: 'mcq-18',
    question: 'Choose the correct antonym of "Ephemeral":',
    options: [
      { id: 'opt-18a', text: 'Fleeting' },
      { id: 'opt-18b', text: 'Transitory' },
      { id: 'opt-18c', text: 'Permanent', isCorrect: true },
      { id: 'opt-18d', text: 'Brief' },
    ],
    explanation:
      'Ephemeral means lasting for a very short time. Its antonym is permanent, which means lasting forever.',
    topicId: 'english',
    difficulty: 'Hard',
  },
  {
    id: 'mcq-19',
    question: 'What is the value of Pi (π) to two decimal places?',
    options: [
      { id: 'opt-19a', text: '3.12' },
      { id: 'opt-19b', text: '3.14', isCorrect: true },
      { id: 'opt-19c', text: '3.16' },
      { id: 'opt-19d', text: '3.18' },
    ],
    explanation:
      'The value of Pi (π) is approximately 3.14159..., which rounds to 3.14 to two decimal places.',
    topicId: 'math',
    difficulty: 'Easy',
    formulaNotation: '\\pi \\approx 3.14159',
  },
  {
    id: 'mcq-20',
    question: 'In which year was the United Nations founded?',
    options: [
      { id: 'opt-20a', text: '1942' },
      { id: 'opt-20b', text: '1944' },
      { id: 'opt-20c', text: '1945', isCorrect: true },
      { id: 'opt-20d', text: '1948' },
    ],
    explanation:
      'The United Nations was founded on 24 October 1945, after World War II, to replace the League of Nations and prevent future conflicts.',
    topicId: 'current-affairs',
    difficulty: 'Medium',
  },
  {
    id: 'mcq-21',
    question: 'Which layer of the atmosphere contains the ozone layer?',
    options: [
      { id: 'opt-21a', text: 'Troposphere' },
      { id: 'opt-21b', text: 'Stratosphere', isCorrect: true },
      { id: 'opt-21c', text: 'Mesosphere' },
      { id: 'opt-21d', text: 'Thermosphere' },
    ],
    explanation:
      "The ozone layer is located in the stratosphere, approximately 15-35 km above the Earth's surface. It absorbs most of the Sun's harmful ultraviolet radiation.",
    topicId: 'physics',
    difficulty: 'Medium',
  },
  {
    id: 'mcq-22',
    question: 'What does HTML stand for?',
    options: [
      { id: 'opt-22a', text: 'Hyper Text Markup Language', isCorrect: true },
      { id: 'opt-22b', text: 'High Tech Modern Language' },
      { id: 'opt-22c', text: 'Hyper Transfer Markup Language' },
      { id: 'opt-22d', text: 'Home Tool Markup Language' },
    ],
    explanation:
      'HTML stands for Hyper Text Markup Language. It is the standard markup language for creating web pages.',
    topicId: 'computer-science',
    difficulty: 'Easy',
  },
  {
    id: 'mcq-23',
    question: 'The Battle of Plassey was fought in which year?',
    options: [
      { id: 'opt-23a', text: '1757', isCorrect: true },
      { id: 'opt-23b', text: '1764' },
      { id: 'opt-23c', text: '1857' },
      { id: 'opt-23d', text: '1947' },
    ],
    explanation:
      'The Battle of Plassey was fought on 23 June 1757. It was a decisive victory of the British East India Company over the Nawab of Bengal.',
    topicId: 'pak-studies',
    difficulty: 'Hard',
  },
  {
    id: 'mcq-24',
    question: 'What is the square root of 144?',
    options: [
      { id: 'opt-24a', text: '10' },
      { id: 'opt-24b', text: '11' },
      { id: 'opt-24c', text: '12', isCorrect: true },
      { id: 'opt-24d', text: '14' },
    ],
    explanation: 'The square root of 144 is 12, because 12 × 12 = 144.',
    topicId: 'math',
    difficulty: 'Easy',
    formulaNotation: '\\sqrt{144} = 12',
  },
  {
    id: 'mcq-25',
    question: 'Which of the following is NOT a prime number?',
    options: [
      { id: 'opt-25a', text: '2' },
      { id: 'opt-25b', text: '7' },
      { id: 'opt-25c', text: '9', isCorrect: true },
      { id: 'opt-25d', text: '13' },
    ],
    explanation:
      '9 is not a prime number because it is divisible by 1, 3, and 9. A prime number has exactly two distinct positive divisors.',
    topicId: 'math',
    difficulty: 'Easy',
  },
];

const mockQuestions = [...MOCK_QUESTIONS];

/**
 * Fetch MCQ preview questions (unauthenticated).
 * Maps to: GET /api/exams/:slug/mcqs/preview
 */
export async function getMcqPreview(
  _slug: string,
  filters?: MCQFilterState
): Promise<MCQPaginatedResponse> {
  await simulateDelay();

  const filtered = filterQuestions(mockQuestions, filters);

  const page = filters?.page ?? 1;
  const limit = 20;
  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + limit);

  return {
    data: paged,
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit),
  };
}

/**
 * Fetch MCQ questions (authenticated, full bank).
 * Maps to: GET /api/exams/:slug/mcqs
 */
export async function getMcqs(
  _slug: string,
  filters?: MCQFilterState
): Promise<MCQPaginatedResponse> {
  await simulateDelay();

  const filtered = filterQuestions(mockQuestions, filters);

  const page = filters?.page ?? 1;
  const limit = 20;
  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + limit);

  return {
    data: paged,
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit),
  };
}

/**
 * Fetch available topics for filter chips.
 * Maps to: GET /api/exams/:slug/mcqs/topics
 */
export async function getTopics(): Promise<TopicOption[]> {
  await simulateDelay();
  return MOCK_TOPICS;
}

/**
 * Fetch user progress for a given exam.
 * Maps to: GET /api/exams/:slug/mcqs/progress
 */
export async function getUserProgress(_slug: string): Promise<MCQUserProgress> {
  await simulateDelay();
  return {
    answeredCount: 0,
    correctCount: 0,
    history: {},
  };
}

function filterQuestions(
  questions: MCQQuestion[],
  filters?: MCQFilterState
): MCQQuestion[] {
  const result = questions;
  const topicFiltered = filters?.topicId
    ? result.filter((q) => q.topicId === filters.topicId)
    : result;
  const diffFiltered = filters?.difficulty
    ? topicFiltered.filter(
        (q) => q.difficulty.toLowerCase() === filters.difficulty!.toLowerCase()
      )
    : topicFiltered;
  return diffFiltered;
}

function simulateDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 300));
}

export { MOCK_TOPICS, MOCK_QUESTIONS };
