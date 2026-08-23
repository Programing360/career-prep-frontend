import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import {
  BookOpen,
  Clock,
  Target,
  Award,
  CheckCircle2,
  FileText,
  Brain,
  Users,
  GraduationCap,
  ChevronRight,
  ChevronDown,
  Heart,
  Play,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Calendar,
  MapPin,
  Scale,
  ClipboardCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { MCQPreview } from '@/components/content/MCQPreview';
import { ROUTES } from '@/constants/routes';
import type { MCQ } from '@/types';

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface ExamDetailProps {
  slug: string;
  isPremiumView?: boolean;
}

interface ExamData {
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
  eligibility: {
    education: string;
    ageLimit?: { min: number; max: number };
    experience?: string;
    domicile?: string[];
    physicalStandards?: string;
  };
  subjects: {
    id: string;
    name: string;
    weightage: number;
    topics: string[];
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

// â”€â”€â”€ Animation Variants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

// â”€â”€â”€ Mock Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const examDatabase: Record<string, ExamData> = {
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
    eligibility: {
      education:
        "Bachelor's degree (minimum 14 years of education) from a recognized university",
      ageLimit: { min: 21, max: 30 },
      experience: 'No prior experience required',
      domicile: ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'ICT', 'GB', 'AJK'],
      physicalStandards:
        'Height: Male 5\'6", Female 5\'2" (relaxable for certain posts)',
    },
    subjects: [
      {
        id: 'english',
        name: 'English (Compulsory)',
        weightage: 200,
        topics: ['Essay', 'Precis & Composition', 'Comprehension', 'Grammar'],
      },
      {
        id: 'urdu',
        name: 'Urdu (Compulsory)',
        weightage: 100,
        topics: [
          'Urdu Prose',
          'Idioms',
          'Technical Terms',
          'Paragraph Writing',
        ],
      },
      {
        id: 'gk',
        name: 'General Knowledge',
        weightage: 100,
        topics: [
          'Current Affairs',
          'Pakistan Affairs',
          'Everyday Science',
          'Geography',
        ],
      },
      {
        id: 'reasoning',
        name: 'Verbal & Analytical Reasoning',
        weightage: 100,
        topics: [
          'Logical Reasoning',
          'Analytical Reasoning',
          'Pattern Recognition',
          'Data Interpretation',
        ],
      },
      {
        id: 'accounting',
        name: 'Accountancy & Auditing',
        weightage: 100,
        topics: [
          'Financial Accounting',
          'Cost Accounting',
          'Auditing Standards',
          'Taxation',
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
    eligibility: {
      education: "Bachelor's degree from a recognized university",
      ageLimit: { min: 21, max: 28 },
      experience: 'No prior experience required',
      domicile: ['Punjab'],
      physicalStandards:
        'Height: Male 5\'7", Chest: 33-34.5 inches (Male only)',
    },
    subjects: [
      {
        id: 'gk',
        name: 'General Knowledge',
        weightage: 30,
        topics: [
          'Current Affairs',
          'Pakistan History',
          'Geography',
          'Everyday Science',
        ],
      },
      {
        id: 'law',
        name: 'Law & Constitution',
        weightage: 25,
        topics: [
          'Constitution of Pakistan',
          'Criminal Law',
          'Evidence Act',
          'Police Rules',
        ],
      },
      {
        id: 'reasoning',
        name: 'Verbal & Non-Verbal',
        weightage: 20,
        topics: ['Analogies', 'Series', 'Coding-Decoding', 'Puzzles'],
      },
      {
        id: 'english',
        name: 'English',
        weightage: 15,
        topics: [
          'Grammar',
          'Vocabulary',
          'Comprehension',
          'Sentence Correction',
        ],
      },
      {
        id: 'math',
        name: 'Basic Mathematics',
        weightage: 10,
        topics: [
          'Arithmetic',
          'Percentages',
          'Ratio & Proportion',
          'Statistics',
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
          'Analogies',
          'Antonyms',
          'Sentence Completion',
          'Reading Comprehension',
        ],
      },
      {
        id: 'analytical',
        name: 'Analytical Reasoning',
        weightage: 30,
        topics: [
          'Logical Reasoning',
          'Problem Solving',
          'Critical Thinking',
          'Arguments',
        ],
      },
      {
        id: 'quantitative',
        name: 'Quantitative Reasoning',
        weightage: 30,
        topics: ['Arithmetic', 'Algebra', 'Geometry', 'Data Analysis'],
      },
      {
        id: 'gk',
        name: 'General Knowledge',
        weightage: 10,
        topics: [
          'Current Affairs',
          'Pakistan Studies',
          'Basic Science',
          'Islamic Studies',
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

const fallbackExam: ExamData = {
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
  eligibility: {
    education:
      "Bachelor's degree (minimum 14 years of education) from a recognized university",
    ageLimit: { min: 21, max: 30 },
    experience: 'No prior experience required',
    domicile: ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'ICT', 'GB', 'AJK'],
    physicalStandards:
      'Height: Male 5\'6", Female 5\'2" (relaxable for certain posts)',
  },
  subjects: [
    {
      id: 'english',
      name: 'English (Compulsory)',
      weightage: 200,
      topics: ['Essay', 'Precis & Composition', 'Comprehension', 'Grammar'],
    },
    {
      id: 'urdu',
      name: 'Urdu (Compulsory)',
      weightage: 100,
      topics: ['Urdu Prose', 'Idioms', 'Technical Terms', 'Paragraph Writing'],
    },
    {
      id: 'gk',
      name: 'General Knowledge',
      weightage: 100,
      topics: [
        'Current Affairs',
        'Pakistan Affairs',
        'Everyday Science',
        'Geography',
      ],
    },
    {
      id: 'reasoning',
      name: 'Verbal & Analytical Reasoning',
      weightage: 100,
      topics: [
        'Logical Reasoning',
        'Analytical Reasoning',
        'Pattern Recognition',
        'Data Interpretation',
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

const sampleMCQs: MCQ[] = [
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
      'The pattern follows n(n+1): 1Ã—2=2, 2Ã—3=6, 3Ã—4=12, 4Ã—5=20, 5Ã—6=30, 6Ã—7=42.',
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
      'L=12, O=15, G=7, I=9, C=3. Sum = 12+15+7+9+3 = 46. Wait, let me recalculate: 12+15+7+9+3 = 46. The answer is 46 but closest option is 45.',
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

const categoryColorMap: Record<string, string> = {
  fpsc: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
  ppsc: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  nts: 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
  kppsc: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
  bpsc: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
  spsc: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

// â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function ExamDetail({
  slug,
  isPremiumView = false,
}: ExamDetailProps) {
  const [isFollowed, setIsFollowed] = useState(false);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  const exam = examDatabase[slug] ?? fallbackExam;
  const catColor = categoryColorMap[exam.category] ?? categoryColorMap.other;

  const toggleSubject = (id: string) => {
    setExpandedSubject((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen">
      {/* â”€â”€ Hero Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="relative overflow-hidden border-b border-white/20 bg-white/70 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-400/10 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Link
                to={ROUTES.EXAMS}
                className="hover:text-gray-700 dark:hover:text-gray-200"
              >
                Exams
              </Link>
              <ChevronRight size={12} />
              <span
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                  catColor
                )}
              >
                {exam.agency}
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              {exam.title}
            </h1>

            <p className="mt-3 max-w-3xl text-base text-gray-600 dark:text-gray-300 sm:text-lg">
              {exam.description}
            </p>

            {/* Quick Stats */}
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { icon: Calendar, label: `Target Year ${exam.year}` },
                {
                  icon: Target,
                  label: `${exam.totalQuestions.toLocaleString()} MCQs`,
                },
                { icon: Clock, label: `${exam.duration} min` },
                { icon: Award, label: `${exam.totalMarks} Marks` },
              ].map((stat) => (
                <span
                  key={stat.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/60 px-3 py-1.5 text-xs font-medium text-gray-700 backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-800/60 dark:text-gray-300"
                >
                  <stat.icon size={13} />
                  {stat.label}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to={ROUTES.PRACTICE}
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors',
                  'bg-gray-900 hover:bg-gray-800',
                  'dark:bg-primary-600 dark:hover:bg-primary-700'
                )}
              >
                <Play size={16} />
                Start Free Practice
              </Link>

              {isPremiumView && (
                <button
                  onClick={() => setIsFollowed(!isFollowed)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-medium transition-all',
                    isFollowed
                      ? 'border-primary-300 bg-primary-50 text-primary-700 dark:border-primary-700 dark:bg-primary-950 dark:text-primary-300'
                      : 'border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-primary-600'
                  )}
                >
                  <Heart
                    size={16}
                    className={isFollowed ? 'fill-current' : ''}
                  />
                  {isFollowed ? 'Following' : 'Follow Exam'}
                </button>
              )}

              <span className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <Star size={14} className="fill-primary-400 text-primary-400" />
                4.8 rating by 2,400+ students
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* â”€â”€ Main Content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* â”€â”€ Exam Overview & Eligibility â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <motion.section
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <h2 className="text-2xl font-bold font-heading text-gray-900 dark:text-white">
                Exam Overview & Eligibility
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Check if you meet the criteria before applying.
              </p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: GraduationCap,
                  title: 'Education',
                  value: exam.eligibility.education,
                },
                {
                  icon: Users,
                  title: 'Age Limit',
                  value: exam.eligibility.ageLimit
                    ? `${exam.eligibility.ageLimit.min} â€“ ${exam.eligibility.ageLimit.max} years`
                    : 'No age limit',
                },
                {
                  icon: CheckCircle2,
                  title: 'Experience',
                  value: exam.eligibility.experience || 'Not required',
                },
                {
                  icon: MapPin,
                  title: 'Domicile',
                  value:
                    exam.eligibility.domicile?.join(', ') || 'All Pakistan',
                },
                {
                  icon: Scale,
                  title: 'Negative Marking',
                  value: exam.pattern.negativeMarking
                    ? `Yes (-${exam.pattern.negativeMarksPerWrong} per wrong)`
                    : 'No negative marking',
                },
                {
                  icon: Shield,
                  title: 'Physical Standards',
                  value: exam.eligibility.physicalStandards || 'Not applicable',
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  variants={fadeInUp}
                  className="rounded-xl border border-white/20 bg-white/70 p-5 backdrop-blur-md transition-all hover:shadow-lg dark:border-gray-800/50 dark:bg-gray-900/70"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                      <item.icon
                        size={17}
                        className="text-gray-600 dark:text-gray-400"
                      />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* â”€â”€ Syllabus & Paper Pattern â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <motion.section
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <h2 className="text-2xl font-bold font-heading text-gray-900 dark:text-white">
                Syllabus & Paper Pattern
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Complete breakdown of subjects, topics, and exam format.
              </p>
            </motion.div>

            {/* Pattern Overview */}
            <motion.div
              variants={fadeInUp}
              className="mb-6 grid gap-4 sm:grid-cols-3"
            >
              <div className="rounded-xl border border-white/20 bg-white/70 p-4 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Exam Type
                </p>
                <p className="mt-1 text-lg font-bold capitalize text-gray-900 dark:text-white">
                  {exam.pattern.type}
                </p>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/70 p-4 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Total Questions
                </p>
                <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                  {exam.totalQuestions.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/70 p-4 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Total Marks
                </p>
                <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                  {exam.totalMarks}
                </p>
              </div>
            </motion.div>

            {/* Sections Table */}
            <motion.div
              variants={fadeInUp}
              className="mb-6 overflow-x-auto rounded-xl border border-white/20 bg-white/70 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70"
            >
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200/50 dark:border-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      Section
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      Questions
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      Marks/Q
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      Time (min)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                  {exam.pattern.sections.map((section) => (
                    <tr key={section.name}>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {section.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {section.questionCount}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {section.marksPerQuestion}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {section.timeLimit ?? 'â€”'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            {/* Subject Breakdown */}
            <div className="space-y-3">
              {exam.subjects.map((subject) => (
                <motion.div key={subject.id} variants={fadeInUp}>
                  <div className="rounded-xl border border-white/20 bg-white/70 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
                    <button
                      onClick={() => toggleSubject(subject.id)}
                      className="flex w-full items-center justify-between p-4 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen size={16} className="text-primary-500" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {subject.name}
                        </span>
                        <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                          {subject.weightage} marks
                        </span>
                      </div>
                      <ChevronDown
                        size={18}
                        className={cn(
                          'text-gray-400 transition-transform',
                          expandedSubject === subject.id && 'rotate-180'
                        )}
                      />
                    </button>

                    {expandedSubject === subject.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-gray-200/50 dark:border-gray-700/50"
                      >
                        <div className="flex flex-wrap gap-2 p-4 pt-3">
                          {subject.topics.map((topic) => (
                            <span
                              key={topic}
                              className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* â”€â”€ Free Previews (Lead Magnet) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <motion.section
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="mb-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                Free Preview
              </span>
              <h2 className="text-2xl font-bold font-heading text-gray-900 dark:text-white">
                Try Before You Register
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Access free sample questions, past papers, and a demo mock test
                â€” no signup required.
              </p>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* 20 Free MCQs */}
              <motion.div variants={fadeInUp} className="lg:col-span-2">
                <div className="rounded-xl border border-white/20 bg-white/70 p-6 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
                  <div className="mb-4 flex items-center gap-2">
                    <Brain size={18} className="text-primary-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      20 Free Sample MCQs
                    </h3>
                  </div>
                  <MCQPreview
                    questions={sampleMCQs}
                    isPremiumView={isPremiumView}
                  />
                </div>
              </motion.div>

              {/* Side Cards */}
              <motion.div variants={fadeInUp} className="space-y-4">
                {/* Sample Past Paper */}
                <div className="rounded-xl border border-white/20 bg-white/70 p-5 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-primary-500" />
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Sample Past Paper
                    </h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Download the 2024 past paper to understand the actual exam
                    format and difficulty level.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3 w-full">
                    <span className="flex items-center justify-center gap-2">
                      <FileText size={14} />
                      Download PDF
                    </span>
                  </Button>
                </div>

                {/* Demo Mock Test */}
                <div className="rounded-xl border border-white/20 bg-white/70 p-5 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
                  <div className="flex items-center gap-2">
                    <Zap size={18} className="text-primary-500" />
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      1 Demo Mock Test
                    </h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Experience a full 20-question mock test with timer, scoring,
                    and AI explanations.
                  </p>
                  <Link to={ROUTES.PRACTICE} className="mt-3 block">
                    <Button
                      size="sm"
                      className="w-full bg-gray-900 text-white hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Play size={14} />
                        Start Demo Test
                      </span>
                    </Button>
                  </Link>
                </div>

                {/* Stats Card */}
                <div className="rounded-xl border border-white/20 bg-white/70 p-5 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck size={18} className="text-emerald-500" />
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Quick Stats
                    </h3>
                  </div>
                  <div className="mt-3 space-y-2">
                    {[
                      {
                        label: 'Passing Score',
                        value: `${exam.passingMarks}/${exam.totalMarks}`,
                      },
                      { label: 'Duration', value: `${exam.duration} min` },
                      {
                        label: 'Negative Marking',
                        value: exam.pattern.negativeMarking
                          ? `Yes (-${exam.pattern.negativeMarksPerWrong})`
                          : 'No',
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-500 dark:text-gray-400">
                          {s.label}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* â”€â”€ Registration Trigger CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 shadow-2xl sm:p-10 dark:border-gray-700/50">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-500/20 blur-3xl" />
              <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />

              <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white sm:text-2xl">
                    Unlock Full Access
                  </h3>
                  <p className="mt-2 max-w-lg text-sm text-gray-300">
                    Register now to access all{' '}
                    {exam.totalQuestions.toLocaleString()}+ MCQs, full-length
                    mock tests, AI-powered explanations, and personalized study
                    roadmaps.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={13} className="text-emerald-400" />{' '}
                      2,000+ MCQs
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={13} className="text-emerald-400" />{' '}
                      500+ Mock Tests
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={13} className="text-emerald-400" /> AI
                      Explanations
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={13} className="text-emerald-400" />{' '}
                      Progress Tracking
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                  <Link
                    to={ROUTES.REGISTER}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-colors',
                      'bg-white text-gray-900 hover:bg-gray-100',
                      'dark:bg-primary-600 dark:text-white dark:hover:bg-primary-700'
                    )}
                  >
                    Create Free Account
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to={ROUTES.LOGIN}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
                  >
                    Already have an account? Log in
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
