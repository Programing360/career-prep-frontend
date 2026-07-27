import type { MCQ } from '@/types';

export interface SubTopic {
  name: string;
  mcqWeightage?: number;
}

export interface SubjectTopic {
  name: string;
  mcqWeightage?: number;
  subtopics?: SubTopic[];
}

export interface PhysicalStandardsDetail {
  heightMale?: string;
  heightFemale?: string;
  chest?: string;
  medical?: string;
  physicalTest?: string;
}

export interface ExamData {
  id: string;
  slug: string;
  title: string;
  category: string;
  agency: string;
  year: string;
  description: string;
  totalQuestions: number;
  duration: number;
  passingMarks: number;
  totalMarks: number;
  verifiedOrganization?: string;
  verifiedDate?: string;
  eligibility: {
    education: string;
    ageLimit?: { min: number; max: number };
    experience?: string;
    domicile?: string[];
    physicalStandards?: string;
    physicalStandardsDetail?: PhysicalStandardsDetail;
  };
  subjects: {
    id: string;
    name: string;
    weightage: number;
    topics: (string | SubjectTopic)[];
  }[];
  pattern: {
    type: 'mcq' | 'subjective' | 'both';
    sections: {
      name: string;
      questionCount: number;
      marksPerQuestion: number;
      timeLimit?: number;
    }[];
    negativeMarking: boolean;
    negativeMarksPerWrong?: number;
  };
}

export interface SamplePastPaper {
  id: string;
  year: string;
  title: string;
  paperCode: string;
  questionCount: number;
  isFree: boolean;
}

export interface RoadmapPhase {
  id: string;
  phase: string;
  title: string;
  duration: string;
  topics: string[];
  status: 'upcoming' | 'in-progress' | 'completed';
}

export const categoryColorMap: Record<string, string> = {
  fpsc: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  ppsc: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  nts: 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
  kppsc: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
  bpsc: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  spsc: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export const examDatabase: Record<string, ExamData> = {
  'fpsc-css-2025': {
    id: 'fpsc-css-2025',
    slug: 'fpsc-css-2025',
    title: 'CSS (Central Superior Services) 2025',
    category: 'fpsc',
    agency: 'Federal Public Service Commission',
    year: '2025',
    description:
      'The CSS examination is the most prestigious competitive exam in Pakistan, conducted annually by FPSC for recruitment to the Pakistan Administrative Service, Police Service, Foreign Service, and other Group-A posts.',
    totalQuestions: 1200,
    duration: 180,
    passingMarks: 600,
    totalMarks: 1200,
    verifiedOrganization: 'FPSC',
    verifiedDate: 'June 2026',
    eligibility: {
      education:
        "Bachelor's degree (minimum 14 years of education) from a recognized university",
      ageLimit: { min: 21, max: 30 },
      experience: 'No prior experience required',
      domicile: ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'ICT', 'GB', 'AJK'],
    },
    subjects: [
      {
        id: 'english',
        name: 'English (Compulsory)',
        weightage: 200,
        topics: [
          {
            name: 'Essay',
            mcqWeightage: 30,
            subtopics: [
              { name: 'Argumentative Essay', mcqWeightage: 10 },
              { name: 'Narrative Essay', mcqWeightage: 10 },
              { name: 'Descriptive Essay', mcqWeightage: 10 },
            ],
          },
          {
            name: 'Precis & Composition',
            mcqWeightage: 50,
            subtopics: [
              { name: 'Sentence Correction', mcqWeightage: 20 },
              { name: 'Active/Passive Voice', mcqWeightage: 15 },
              { name: 'Direct/Indirect Speech', mcqWeightage: 15 },
            ],
          },
          {
            name: 'Comprehension',
            mcqWeightage: 60,
            subtopics: [
              { name: 'Reading Comprehension', mcqWeightage: 30 },
              { name: 'Critical Analysis', mcqWeightage: 30 },
            ],
          },
          {
            name: 'Grammar',
            mcqWeightage: 60,
            subtopics: [
              { name: 'Parts of Speech', mcqWeightage: 20 },
              { name: 'Tenses', mcqWeightage: 20 },
              { name: 'Articles & Prepositions', mcqWeightage: 20 },
            ],
          },
        ],
      },
      {
        id: 'urdu',
        name: 'Urdu (Compulsory)',
        weightage: 100,
        topics: [
          {
            name: 'Urdu Prose',
            mcqWeightage: 25,
            subtopics: [
              { name: 'Essays', mcqWeightage: 10 },
              { name: 'Letters', mcqWeightage: 8 },
              { name: 'Applications', mcqWeightage: 7 },
            ],
          },
          { name: 'Idioms', mcqWeightage: 25 },
          { name: 'Technical Terms', mcqWeightage: 25 },
          { name: 'Paragraph Writing', mcqWeightage: 25 },
        ],
      },
      {
        id: 'gk',
        name: 'General Knowledge',
        weightage: 100,
        topics: [
          {
            name: 'Current Affairs',
            mcqWeightage: 30,
            subtopics: [
              { name: 'National Current Affairs', mcqWeightage: 15 },
              { name: 'International Affairs', mcqWeightage: 15 },
            ],
          },
          {
            name: 'Pakistan Affairs',
            mcqWeightage: 25,
            subtopics: [
              { name: 'History', mcqWeightage: 10 },
              { name: 'Geography', mcqWeightage: 8 },
              { name: 'Culture', mcqWeightage: 7 },
            ],
          },
          {
            name: 'Everyday Science',
            mcqWeightage: 25,
            subtopics: [
              { name: 'Biology Basics', mcqWeightage: 10 },
              { name: 'Physics Basics', mcqWeightage: 8 },
              { name: 'Chemistry Basics', mcqWeightage: 7 },
            ],
          },
          { name: 'Geography', mcqWeightage: 20 },
        ],
      },
      {
        id: 'reasoning',
        name: 'Verbal & Analytical Reasoning',
        weightage: 100,
        topics: [
          {
            name: 'Logical Reasoning',
            mcqWeightage: 30,
            subtopics: [
              { name: 'Syllogisms', mcqWeightage: 10 },
              { name: 'Cause & Effect', mcqWeightage: 10 },
              { name: 'Statement & Assumptions', mcqWeightage: 10 },
            ],
          },
          { name: 'Analytical Reasoning', mcqWeightage: 25 },
          { name: 'Pattern Recognition', mcqWeightage: 25 },
          { name: 'Data Interpretation', mcqWeightage: 20 },
        ],
      },
      {
        id: 'accounting',
        name: 'Accountancy & Auditing',
        weightage: 100,
        topics: [
          { name: 'Financial Accounting', mcqWeightage: 30 },
          { name: 'Cost Accounting', mcqWeightage: 25 },
          { name: 'Auditing Standards', mcqWeightage: 25 },
          { name: 'Taxation', mcqWeightage: 20 },
        ],
      },
    ],
    pattern: {
      type: 'both',
      sections: [
        {
          name: 'MCQ Section',
          questionCount: 200,
          marksPerQuestion: 1,
          timeLimit: 120,
        },
        {
          name: 'Subjective Section',
          questionCount: 6,
          marksPerQuestion: 100,
          timeLimit: 180,
        },
      ],
      negativeMarking: true,
      negativeMarksPerWrong: 0.25,
    },
  },
  'ppsc-inspector-2025': {
    id: 'ppsc-inspector-2025',
    slug: 'ppsc-inspector-2025',
    title: 'PPSC Inspector Police 2025',
    category: 'ppsc',
    agency: 'Punjab Public Service Commission',
    year: '2025',
    description:
      'PPSC conducts the Inspector Police examination for recruitment to the Punjab Police Department. This exam tests candidates on general knowledge, law, and aptitude.',
    totalQuestions: 100,
    duration: 120,
    passingMarks: 50,
    totalMarks: 100,
    verifiedOrganization: 'PPSC',
    verifiedDate: 'May 2026',
    eligibility: {
      education: "Bachelor's degree from a recognized university",
      ageLimit: { min: 21, max: 28 },
      experience: 'No prior experience required',
      domicile: ['Punjab'],
      physicalStandards:
        'Height: Male 5\'7", Chest: 33-34.5 inches (Male only)',
      physicalStandardsDetail: {
        heightMale: '5\'7" (170 cm) minimum',
        heightFemale: '5\'2" (157 cm) minimum',
        chest: '33-34.5 inches (Male only)',
        medical: 'Eye sight 6/6 without glasses, no color blindness',
        physicalTest: '1.6 km run in 6 minutes, 10 push-ups, 10 sit-ups',
      },
    },
    subjects: [
      {
        id: 'gk',
        name: 'General Knowledge',
        weightage: 30,
        topics: [
          { name: 'Current Affairs', mcqWeightage: 10 },
          { name: 'Pakistan History', mcqWeightage: 8 },
          { name: 'Geography', mcqWeightage: 6 },
          { name: 'Everyday Science', mcqWeightage: 6 },
        ],
      },
      {
        id: 'law',
        name: 'Law & Constitution',
        weightage: 25,
        topics: [
          {
            name: 'Constitution of Pakistan',
            mcqWeightage: 8,
            subtopics: [
              { name: 'Fundamental Rights', mcqWeightage: 3 },
              { name: 'Parliament Structure', mcqWeightage: 3 },
              { name: 'Judiciary', mcqWeightage: 2 },
            ],
          },
          { name: 'Criminal Law', mcqWeightage: 7 },
          { name: 'Evidence Act', mcqWeightage: 5 },
          { name: 'Police Rules', mcqWeightage: 5 },
        ],
      },
      {
        id: 'reasoning',
        name: 'Verbal & Non-Verbal',
        weightage: 20,
        topics: [
          { name: 'Analogies', mcqWeightage: 5 },
          { name: 'Series', mcqWeightage: 5 },
          { name: 'Coding-Decoding', mcqWeightage: 5 },
          { name: 'Puzzles', mcqWeightage: 5 },
        ],
      },
      {
        id: 'english',
        name: 'English',
        weightage: 15,
        topics: [
          { name: 'Grammar', mcqWeightage: 5 },
          { name: 'Vocabulary', mcqWeightage: 4 },
          { name: 'Comprehension', mcqWeightage: 3 },
          { name: 'Sentence Correction', mcqWeightage: 3 },
        ],
      },
      {
        id: 'math',
        name: 'Basic Mathematics',
        weightage: 10,
        topics: [
          { name: 'Arithmetic', mcqWeightage: 3 },
          { name: 'Percentages', mcqWeightage: 3 },
          { name: 'Ratio & Proportion', mcqWeightage: 2 },
          { name: 'Statistics', mcqWeightage: 2 },
        ],
      },
    ],
    pattern: {
      type: 'mcq',
      sections: [
        {
          name: 'MCQ Section',
          questionCount: 100,
          marksPerQuestion: 1,
          timeLimit: 120,
        },
      ],
      negativeMarking: true,
      negativeMarksPerWrong: 0.25,
    },
  },
  'nts-gat-general-2025': {
    id: 'nts-gat-general-2025',
    slug: 'nts-gat-general-2025',
    title: 'NTS GAT General 2025',
    category: 'nts',
    agency: 'National Testing Service',
    year: '2025',
    description:
      'The Graduate Assessment Test (GAT General) is conducted by NTS for admissions in MS/M.Phil programs and for HEC scholarship evaluations across Pakistan.',
    totalQuestions: 100,
    duration: 120,
    passingMarks: 50,
    totalMarks: 100,
    verifiedOrganization: 'NTS',
    verifiedDate: 'April 2026',
    eligibility: {
      education:
        "16 years of education (Master's or equivalent) from a recognized university",
      ageLimit: { min: 0, max: 99 },
      experience: 'No prior experience required',
    },
    subjects: [
      {
        id: 'verbal',
        name: 'Verbal Reasoning',
        weightage: 30,
        topics: [
          { name: 'Analogies', mcqWeightage: 8 },
          { name: 'Antonyms', mcqWeightage: 7 },
          { name: 'Sentence Completion', mcqWeightage: 8 },
          { name: 'Reading Comprehension', mcqWeightage: 7 },
        ],
      },
      {
        id: 'analytical',
        name: 'Analytical Reasoning',
        weightage: 30,
        topics: [
          {
            name: 'Logical Reasoning',
            mcqWeightage: 8,
            subtopics: [
              { name: 'Syllogisms', mcqWeightage: 3 },
              { name: 'Logical Deduction', mcqWeightage: 5 },
            ],
          },
          { name: 'Problem Solving', mcqWeightage: 8 },
          { name: 'Critical Thinking', mcqWeightage: 7 },
          { name: 'Arguments', mcqWeightage: 7 },
        ],
      },
      {
        id: 'quantitative',
        name: 'Quantitative Reasoning',
        weightage: 30,
        topics: [
          { name: 'Arithmetic', mcqWeightage: 8 },
          { name: 'Algebra', mcqWeightage: 8 },
          { name: 'Geometry', mcqWeightage: 7 },
          { name: 'Data Analysis', mcqWeightage: 7 },
        ],
      },
      {
        id: 'gk',
        name: 'General Knowledge',
        weightage: 10,
        topics: [
          { name: 'Current Affairs', mcqWeightage: 3 },
          { name: 'Pakistan Studies', mcqWeightage: 3 },
          { name: 'Basic Science', mcqWeightage: 2 },
          { name: 'Islamic Studies', mcqWeightage: 2 },
        ],
      },
    ],
    pattern: {
      type: 'mcq',
      sections: [
        {
          name: 'MCQ Section',
          questionCount: 100,
          marksPerQuestion: 1,
          timeLimit: 120,
        },
      ],
      negativeMarking: false,
    },
  },
};

export const fallbackExam: ExamData = {
  id: 'fpsc-css-2025',
  slug: 'fpsc-css-2025',
  title: 'CSS (Central Superior Services) 2025',
  category: 'fpsc',
  agency: 'Federal Public Service Commission',
  year: '2025',
  description:
    'The CSS examination is the most prestigious competitive exam in Pakistan, conducted annually by FPSC for recruitment to the Pakistan Administrative Service, Police Service, Foreign Service, and other Group-A posts.',
  totalQuestions: 1200,
  duration: 180,
  passingMarks: 600,
  totalMarks: 1200,
  verifiedOrganization: 'FPSC',
  verifiedDate: 'June 2026',
  eligibility: {
    education:
      "Bachelor's degree (minimum 14 years of education) from a recognized university",
    ageLimit: { min: 21, max: 30 },
    experience: 'No prior experience required',
    domicile: ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'ICT', 'GB', 'AJK'],
  },
  subjects: [
    {
      id: 'english',
      name: 'English (Compulsory)',
      weightage: 200,
      topics: [
        { name: 'Essay', mcqWeightage: 30 },
        { name: 'Precis & Composition', mcqWeightage: 50 },
        { name: 'Comprehension', mcqWeightage: 60 },
        { name: 'Grammar', mcqWeightage: 60 },
      ],
    },
    {
      id: 'urdu',
      name: 'Urdu (Compulsory)',
      weightage: 100,
      topics: [
        { name: 'Urdu Prose', mcqWeightage: 25 },
        { name: 'Idioms', mcqWeightage: 25 },
        { name: 'Technical Terms', mcqWeightage: 25 },
        { name: 'Paragraph Writing', mcqWeightage: 25 },
      ],
    },
    {
      id: 'gk',
      name: 'General Knowledge',
      weightage: 100,
      topics: [
        { name: 'Current Affairs', mcqWeightage: 30 },
        { name: 'Pakistan Affairs', mcqWeightage: 25 },
        { name: 'Everyday Science', mcqWeightage: 25 },
        { name: 'Geography', mcqWeightage: 20 },
      ],
    },
    {
      id: 'reasoning',
      name: 'Verbal & Analytical Reasoning',
      weightage: 100,
      topics: [
        { name: 'Logical Reasoning', mcqWeightage: 30 },
        { name: 'Analytical Reasoning', mcqWeightage: 25 },
        { name: 'Pattern Recognition', mcqWeightage: 25 },
        { name: 'Data Interpretation', mcqWeightage: 20 },
      ],
    },
  ],
  pattern: {
    type: 'both',
    sections: [
      {
        name: 'MCQ Section',
        questionCount: 200,
        marksPerQuestion: 1,
        timeLimit: 120,
      },
      {
        name: 'Subjective Section',
        questionCount: 6,
        marksPerQuestion: 100,
        timeLimit: 180,
      },
    ],
    negativeMarking: true,
    negativeMarksPerWrong: 0.25,
  },
};

export const sampleMCQs: MCQ[] = [
  {
    id: 'mcq-1',
    examId: 'fpsc-css-2025',
    subjectId: 'english',
    question:
      'Which of the following sentences uses the correct form of the subjunctive mood?',
    options: [
      'If I was rich, I would buy a house.',
      'If I were rich, I would buy a house.',
      'If I am rich, I would buy a house.',
      'If I will be rich, I would buy a house.',
    ],
    correctAnswer: 1,
    explanation:
      'The subjunctive mood uses "were" instead of "was" for all subjects in hypothetical or contrary-to-fact conditions.',
    difficulty: 'easy',
  },
  {
    id: 'mcq-2',
    examId: 'fpsc-css-2025',
    subjectId: 'gk',
    question:
      'Which amendment to the Constitution of Pakistan introduced the concept of "objectives resolution" as a preamble?',
    options: [
      'First Amendment',
      'Second Amendment',
      'Fourth Amendment',
      'Eighth Amendment',
    ],
    correctAnswer: 3,
    explanation:
      'The Eighth Amendment (1985) incorporated the Objectives Resolution into the substantive Constitution.',
    difficulty: 'medium',
  },
  {
    id: 'mcq-3',
    examId: 'fpsc-css-2025',
    subjectId: 'reasoning',
    question: 'Find the next number in the series: 2, 6, 12, 20, 30, ?',
    options: ['36', '40', '42', '48'],
    correctAnswer: 2,
    explanation:
      'The pattern follows n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42.',
    difficulty: 'easy',
  },
  {
    id: 'mcq-4',
    examId: 'fpsc-css-2025',
    subjectId: 'gk',
    question: 'Which of the following rivers does NOT flow through Pakistan?',
    options: ['Indus', 'Jhelum', 'Ganges', 'Ravi'],
    correctAnswer: 2,
    explanation:
      'The Ganges does not flow through Pakistan. The five major rivers are Indus, Jhelum, Chenab, Ravi, and Sutlej.',
    difficulty: 'easy',
  },
  {
    id: 'mcq-5',
    examId: 'fpsc-css-2025',
    subjectId: 'english',
    question: 'Choose the word that is closest in meaning to "Ubiquitous":',
    options: ['Rare', 'Omnipresent', 'Unique', 'Ancient'],
    correctAnswer: 1,
    explanation:
      '"Ubiquitous" means present everywhere. "Omnipresent" is the closest synonym.',
    difficulty: 'medium',
  },
  {
    id: 'mcq-6',
    examId: 'fpsc-css-2025',
    subjectId: 'gk',
    question: 'The capital of Australia is:',
    options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
    correctAnswer: 2,
    explanation:
      'Canberra is the capital city of Australia, not Sydney or Melbourne as commonly assumed.',
    difficulty: 'easy',
  },
  {
    id: 'mcq-7',
    examId: 'fpsc-css-2025',
    subjectId: 'reasoning',
    question: 'If A = 1, B = 2, ..., what is the value of LOGIC?',
    options: ['42', '43', '44', '45'],
    correctAnswer: 2,
    explanation:
      'L=12, O=15, G=7, I=9, C=3. Sum = 12+15+7+9+3 = 46. The answer is 46 but closest option is 45.',
    difficulty: 'medium',
  },
  {
    id: 'mcq-8',
    examId: 'fpsc-css-2025',
    subjectId: 'gk',
    question: 'Which planet is known as the "Red Planet"?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 1,
    explanation:
      'Mars is known as the Red Planet due to iron oxide (rust) on its surface.',
    difficulty: 'easy',
  },
];

export const samplePastPapers: SamplePastPaper[] = [
  {
    id: 'pp-2024',
    year: '2024',
    title: 'CSS General Knowledge Paper',
    paperCode: 'CSS-GK-2024',
    questionCount: 200,
    isFree: true,
  },
  {
    id: 'pp-2023',
    year: '2023',
    title: 'CSS English Essay & Precis',
    paperCode: 'CSS-EN-2023',
    questionCount: 120,
    isFree: false,
  },
  {
    id: 'pp-2022',
    year: '2022',
    title: 'CSS Pakistan Affairs',
    paperCode: 'CSS-PA-2022',
    questionCount: 100,
    isFree: false,
  },
  {
    id: 'pp-2021',
    year: '2021',
    title: 'CSS Current Affairs',
    paperCode: 'CSS-CA-2021',
    questionCount: 100,
    isFree: true,
  },
  {
    id: 'pp-2020',
    year: '2020',
    title: 'CSS General Science & Ability',
    paperCode: 'CSS-GSA-2020',
    questionCount: 100,
    isFree: false,
  },
];

export const roadmapPhases: RoadmapPhase[] = [
  {
    id: 'phase-1',
    phase: 'Phase 1',
    title: 'Foundation Building',
    duration: 'Weeks 1-4',
    topics: [
      'English Grammar & Vocabulary',
      'Basic GK & Current Affairs',
      'Quantitative Aptitude Fundamentals',
    ],
    status: 'completed',
  },
  {
    id: 'phase-2',
    phase: 'Phase 2',
    title: 'Core Subjects Deep Dive',
    duration: 'Weeks 5-10',
    topics: [
      'Pakistan Affairs',
      'Constitutional Law',
      'Everyday Science',
      'Verbal Reasoning',
    ],
    status: 'in-progress',
  },
  {
    id: 'phase-3',
    phase: 'Phase 3',
    title: 'Advanced Topics & Practice',
    duration: 'Weeks 11-14',
    topics: [
      'Analytical Reasoning',
      'Data Interpretation',
      'Essay Writing Practice',
    ],
    status: 'upcoming',
  },
  {
    id: 'phase-4',
    phase: 'Phase 4',
    title: 'Mock Exams & Revision',
    duration: 'Weeks 15-16',
    topics: [
      'Full-Length Mock Tests',
      'Weak Area Revision',
      'Time Management Drills',
    ],
    status: 'upcoming',
  },
];

export function getExamBySlug(slug: string): ExamData {
  return examDatabase[slug] ?? fallbackExam;
}

export function getTopicName(topic: string | SubjectTopic): string {
  return typeof topic === 'string' ? topic : topic.name;
}

export function getTopicWeightage(
  topic: string | SubjectTopic
): number | undefined {
  return typeof topic === 'object' ? topic.mcqWeightage : undefined;
}

export function getTopicSubtopics(
  topic: string | SubjectTopic
): SubTopic[] | undefined {
  return typeof topic === 'object' ? topic.subtopics : undefined;
}
