/**
 * ExamEnginePanel — MeritPrep Pakistan
 *
 * A self-contained exam lifecycle manager supporting three states:
 *   • IN_PROGRESS      — active question navigation + answer tracking
 *   • TOKEN_EXHAUSTED  — user has 0 AI tokens; exam is blocked
 *   • SUBMITTED_RESULT — polished score breakdown after submission
 *
 * Mock backend response shape (POST /api/test-attempts/submit):
 * {
 *   totalQuestions: number,
 *   correct: number,
 *   wrong: number,
 *   skipped: number,
 *   accuracy: string,   // e.g. "80%"
 *   xpEarned: number,
 *   remainingTokens: number
 * }
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Crown,
  ExternalLink,
  Flag,
  LayoutDashboard,
  Loader2,
  MinusCircle,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  Trophy,
  XCircle,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type ExamState = 'IN_PROGRESS' | 'TOKEN_EXHAUSTED' | 'SUBMITTED_RESULT';

interface ExamOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface ExamQuestion {
  id: string;
  text: string;
  subject: string;
  options: ExamOption[];
}

interface MockUser {
  name: string;
  avatarInitials: string;
  aiTokenBalance: number;
}

interface SubmitApiResponse {
  totalQuestions: number;
  correct: number;
  wrong: number;
  skipped: number;
  accuracy: string;
  xpEarned: number;
  remainingTokens: number;
}

interface ExamEnginePanelProps {
  /** Mock user injected from parent/auth context */
  user?: MockUser;
  /** Callback when user navigates to dashboard */
  onGoToDashboard?: () => void;
  /** Callback when user clicks Review Answers */
  onReviewAnswers?: () => void;
}

// ─────────────────────────────────────────────
// Demo Data (20 questions across 4 subjects)
// ─────────────────────────────────────────────

const DEMO_QUESTIONS: ExamQuestion[] = [
  // Pakistan Studies
  {
    id: 'q1',
    subject: 'Pakistan Studies',
    text: 'Which article of the Constitution of Pakistan guarantees freedom of speech?',
    options: [
      { id: 'q1a', text: 'Article 15', isCorrect: false },
      { id: 'q1b', text: 'Article 19', isCorrect: true },
      { id: 'q1c', text: 'Article 25', isCorrect: false },
      { id: 'q1d', text: 'Article 66', isCorrect: false },
    ],
  },
  {
    id: 'q2',
    subject: 'Pakistan Studies',
    text: 'When was the Objective Resolution passed?',
    options: [
      { id: 'q2a', text: 'March 12, 1949', isCorrect: true },
      { id: 'q2b', text: 'August 14, 1947', isCorrect: false },
      { id: 'q2c', text: 'March 23, 1940', isCorrect: false },
      { id: 'q2d', text: 'December 25, 1948', isCorrect: false },
    ],
  },
  {
    id: 'q3',
    subject: 'Pakistan Studies',
    text: 'Who was the first Governor-General of Pakistan?',
    options: [
      { id: 'q3a', text: 'Liaquat Ali Khan', isCorrect: false },
      { id: 'q3b', text: 'Iskander Mirza', isCorrect: false },
      { id: 'q3c', text: 'Muhammad Ali Jinnah', isCorrect: true },
      { id: 'q3d', text: 'Ayub Khan', isCorrect: false },
    ],
  },
  {
    id: 'q4',
    subject: 'Pakistan Studies',
    text: 'The Indus Waters Treaty was signed in which year?',
    options: [
      { id: 'q4a', text: '1955', isCorrect: false },
      { id: 'q4b', text: '1960', isCorrect: true },
      { id: 'q4c', text: '1965', isCorrect: false },
      { id: 'q4d', text: '1970', isCorrect: false },
    ],
  },
  {
    id: 'q5',
    subject: 'Pakistan Studies',
    text: 'Tarbela Dam is located on which river?',
    options: [
      { id: 'q5a', text: 'Jhelum', isCorrect: false },
      { id: 'q5b', text: 'Chenab', isCorrect: false },
      { id: 'q5c', text: 'Indus', isCorrect: true },
      { id: 'q5d', text: 'Ravi', isCorrect: false },
    ],
  },
  // General Knowledge
  {
    id: 'q6',
    subject: 'General Knowledge',
    text: 'Which country has the largest land area?',
    options: [
      { id: 'q6a', text: 'China', isCorrect: false },
      { id: 'q6b', text: 'United States', isCorrect: false },
      { id: 'q6c', text: 'Russia', isCorrect: true },
      { id: 'q6d', text: 'Canada', isCorrect: false },
    ],
  },
  {
    id: 'q7',
    subject: 'General Knowledge',
    text: 'The United Nations was established in which year?',
    options: [
      { id: 'q7a', text: '1944', isCorrect: false },
      { id: 'q7b', text: '1945', isCorrect: true },
      { id: 'q7c', text: '1946', isCorrect: false },
      { id: 'q7d', text: '1948', isCorrect: false },
    ],
  },
  {
    id: 'q8',
    subject: 'General Knowledge',
    text: 'Which planet is known as the Red Planet?',
    options: [
      { id: 'q8a', text: 'Venus', isCorrect: false },
      { id: 'q8b', text: 'Jupiter', isCorrect: false },
      { id: 'q8c', text: 'Mars', isCorrect: true },
      { id: 'q8d', text: 'Saturn', isCorrect: false },
    ],
  },
  {
    id: 'q9',
    subject: 'General Knowledge',
    text: 'The Great Wall of China was primarily built during which dynasty?',
    options: [
      { id: 'q9a', text: 'Han Dynasty', isCorrect: false },
      { id: 'q9b', text: 'Ming Dynasty', isCorrect: true },
      { id: 'q9c', text: 'Tang Dynasty', isCorrect: false },
      { id: 'q9d', text: 'Song Dynasty', isCorrect: false },
    ],
  },
  {
    id: 'q10',
    subject: 'General Knowledge',
    text: 'Which element has the chemical symbol "Au"?',
    options: [
      { id: 'q10a', text: 'Silver', isCorrect: false },
      { id: 'q10b', text: 'Aluminum', isCorrect: false },
      { id: 'q10c', text: 'Gold', isCorrect: true },
      { id: 'q10d', text: 'Copper', isCorrect: false },
    ],
  },
  // Mathematics
  {
    id: 'q11',
    subject: 'Mathematics',
    text: 'What is the value of pi to two decimal places?',
    options: [
      { id: 'q11a', text: '3.12', isCorrect: false },
      { id: 'q11b', text: '3.14', isCorrect: true },
      { id: 'q11c', text: '3.16', isCorrect: false },
      { id: 'q11d', text: '3.18', isCorrect: false },
    ],
  },
  {
    id: 'q12',
    subject: 'Mathematics',
    text: 'If x squared equals 49, what is the positive value of x?',
    options: [
      { id: 'q12a', text: '6', isCorrect: false },
      { id: 'q12b', text: '7', isCorrect: true },
      { id: 'q12c', text: '8', isCorrect: false },
      { id: 'q12d', text: '9', isCorrect: false },
    ],
  },
  {
    id: 'q13',
    subject: 'Mathematics',
    text: 'A train travels 360 km in 4 hours. What is its speed?',
    options: [
      { id: 'q13a', text: '80 km/h', isCorrect: false },
      { id: 'q13b', text: '90 km/h', isCorrect: true },
      { id: 'q13c', text: '100 km/h', isCorrect: false },
      { id: 'q13d', text: '110 km/h', isCorrect: false },
    ],
  },
  {
    id: 'q14',
    subject: 'Mathematics',
    text: 'What is 15% of 200?',
    options: [
      { id: 'q14a', text: '25', isCorrect: false },
      { id: 'q14b', text: '30', isCorrect: true },
      { id: 'q14c', text: '35', isCorrect: false },
      { id: 'q14d', text: '40', isCorrect: false },
    ],
  },
  {
    id: 'q15',
    subject: 'Mathematics',
    text: 'The area of a circle with radius 7 cm is approximately:',
    options: [
      { id: 'q15a', text: '144 cm squared', isCorrect: false },
      { id: 'q15b', text: '154 cm squared', isCorrect: true },
      { id: 'q15c', text: '164 cm squared', isCorrect: false },
      { id: 'q15d', text: '174 cm squared', isCorrect: false },
    ],
  },
  // English
  {
    id: 'q16',
    subject: 'English',
    text: 'Choose the correct synonym of "Benevolent":',
    options: [
      { id: 'q16a', text: 'Hostile', isCorrect: false },
      { id: 'q16b', text: 'Generous', isCorrect: true },
      { id: 'q16c', text: 'Indifferent', isCorrect: false },
      { id: 'q16d', text: 'Reckless', isCorrect: false },
    ],
  },
  {
    id: 'q17',
    subject: 'English',
    text: 'Which sentence is grammatically correct?',
    options: [
      { id: 'q17a', text: 'She do not like coffee.', isCorrect: false },
      { id: 'q17b', text: 'She does not likes coffee.', isCorrect: false },
      { id: 'q17c', text: 'She does not like coffee.', isCorrect: true },
      { id: 'q17d', text: 'She do not likes coffee.', isCorrect: false },
    ],
  },
  {
    id: 'q18',
    subject: 'English',
    text: 'What is the plural of "Criterion"?',
    options: [
      { id: 'q18a', text: 'Criterions', isCorrect: false },
      { id: 'q18b', text: 'Criteria', isCorrect: true },
      { id: 'q18c', text: 'Criterias', isCorrect: false },
      { id: 'q18d', text: 'Criteriones', isCorrect: false },
    ],
  },
  {
    id: 'q19',
    subject: 'English',
    text: 'The word "Ubiquitous" means:',
    options: [
      { id: 'q19a', text: 'Rare and unusual', isCorrect: false },
      { id: 'q19b', text: 'Present everywhere', isCorrect: true },
      { id: 'q19c', text: 'Extremely small', isCorrect: false },
      { id: 'q19d', text: 'Difficult to understand', isCorrect: false },
    ],
  },
  {
    id: 'q20',
    subject: 'English',
    text: 'Identify the antonym of "Ephemeral":',
    options: [
      { id: 'q20a', text: 'Transient', isCorrect: false },
      { id: 'q20b', text: 'Momentary', isCorrect: false },
      { id: 'q20c', text: 'Permanent', isCorrect: true },
      { id: 'q20d', text: 'Fleeting', isCorrect: false },
    ],
  },
];

// Tokens deducted per exam session
const TOKENS_PER_SESSION = 5;

// ─────────────────────────────────────────────
// Utility helpers
// ─────────────────────────────────────────────

function letterLabel(i: number): string {
  return String.fromCharCode(65 + i);
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

/** Simulate POST /api/test-attempts/submit with ~600ms network latency */
async function mockSubmitApi(
  answers: Record<string, string>,
  questions: ExamQuestion[],
  tokenBalance: number
): Promise<SubmitApiResponse> {
  await new Promise((r) => setTimeout(r, 650));

  let correct = 0;
  let skipped = 0;

  for (const q of questions) {
    const selectedId = answers[q.id];
    if (!selectedId) {
      skipped++;
    } else {
      const opt = q.options.find((o) => o.id === selectedId);
      if (opt?.isCorrect) correct++;
    }
  }

  const total = questions.length;
  const wrong = total - correct - skipped;
  const attempted = total - skipped;
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  const xpEarned = correct * 6;
  const remainingTokens = Math.max(0, tokenBalance - TOKENS_PER_SESSION);

  return {
    totalQuestions: total,
    correct,
    wrong,
    skipped,
    accuracy: `${accuracy}%`,
    xpEarned,
    remainingTokens,
  };
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

/** Animated radial accuracy ring */
function AccuracyRing({
  accuracy,
  size = 140,
}: {
  accuracy: number;
  size?: number;
}) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (accuracy / 100) * circumference);
    }, 300);
    return () => clearTimeout(timer);
  }, [accuracy, circumference]);

  const color =
    accuracy >= 75 ? '#22c55e' : accuracy >= 50 ? '#8b5cf6' : '#ef4444';

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgb(var(--color-border))"
          strokeWidth={10}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-black tabular-nums" style={{ color }}>
          {accuracy}%
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[rgb(var(--color-text-muted))]">
          Accuracy
        </span>
      </div>
    </div>
  );
}

/** Single stat card in result grid */
function StatCard({
  icon: Icon,
  label,
  value,
  colorClass,
  bgClass,
  delay,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  colorClass: string;
  bgClass: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className="flex flex-col items-center gap-2 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-4 py-5 text-center shadow-sm"
    >
      <span
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-xl',
          bgClass
        )}
      >
        <Icon size={18} className={colorClass} aria-hidden="true" />
      </span>
      <p className={cn('text-2xl font-black tabular-nums', colorClass)}>
        {value}
      </p>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[rgb(var(--color-text-muted))]">
        {label}
      </p>
    </motion.div>
  );
}

/** Token balance badge shown in the header */
function TokenBadge({ balance }: { balance: number }) {
  const isEmpty = balance === 0;
  return (
    <motion.span
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold',
        isEmpty
          ? 'border-red-400/40 bg-red-500/10 text-red-500 dark:text-red-400'
          : 'border-yellow-400/30 bg-yellow-400/10 text-yellow-600 dark:text-yellow-300'
      )}
      aria-label={`AI Tokens Left: ${balance}`}
    >
      <Zap
        size={11}
        className={isEmpty ? 'text-red-500' : 'text-yellow-500'}
        aria-hidden="true"
      />
      {String.fromCodePoint(0x26a1)} AI Tokens Left: {balance}
    </motion.span>
  );
}

// ─────────────────────────────────────────────
// Token Exhausted Screen
// ─────────────────────────────────────────────

function TokenExhaustedScreen({
  onGoToPricing,
}: {
  onGoToPricing: () => void;
}) {
  return (
    <motion.div
      key="token-exhausted"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center gap-6 py-10 text-center"
    >
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
          <Zap size={36} className="text-red-500" />
        </div>
        <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">
          0
        </span>
      </div>

      <div>
        <h2 className="text-2xl font-black text-[rgb(var(--color-text-primary))]">
          Out of AI Tokens!
        </h2>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-[rgb(var(--color-text-secondary))]">
          You have used all your AI tokens. Upgrade to{' '}
          <span className="font-bold text-violet-500">Premium</span> to unlock
          unlimited mock tests and AI tutor explanations.
        </p>
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-violet-300/30 bg-gradient-to-br from-violet-500/10 to-purple-500/5 p-5">
        <div className="mb-3 flex items-center gap-2">
          <Crown size={16} className="text-yellow-400" />
          <span className="text-sm font-bold text-[rgb(var(--color-text-primary))]">
            Premium Unlocks
          </span>
        </div>
        <ul className="space-y-2 text-left">
          {[
            'Unlimited AI tokens every month',
            'Full mock test analytics dashboard',
            'AI tutor explanations per question',
            'Priority leaderboard access',
          ].map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-xs text-[rgb(var(--color-text-secondary))]"
            >
              <CheckCircle2 size={12} className="shrink-0 text-emerald-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={onGoToPricing}
        className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:from-violet-500 hover:to-purple-500 hover:shadow-violet-500/30 focus-ring"
      >
        <Crown size={16} />
        View Subscription Plans
        <ExternalLink
          size={13}
          className="opacity-70 transition-transform group-hover:translate-x-0.5"
        />
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Result Screen
// ─────────────────────────────────────────────

function ResultScreen({
  apiResult,
  onReviewAnswers,
  onGoToDashboard,
}: {
  apiResult: SubmitApiResponse;
  onReviewAnswers: () => void;
  onGoToDashboard: () => void;
}) {
  const numericAccuracy = parseInt(apiResult.accuracy, 10) || 0;

  // Derive per-subject breakdown from the static question list
  const subjectBreakdown = useMemo(() => {
    const map: Record<string, { correct: number; total: number }> = {};
    for (const q of DEMO_QUESTIONS) {
      if (!map[q.subject]) map[q.subject] = { correct: 0, total: 0 };
      map[q.subject].total++;
    }
    // We do not have per-answer info here, so distribute correct evenly for display
    return Object.entries(map).map(([subject, { total }]) => ({
      subject,
      total,
    }));
  }, []);

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Success Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-6 py-5 text-white shadow-xl">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 left-4 h-28 w-28 rounded-full bg-white/5 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-inner">
            <Trophy size={28} aria-hidden="true" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
              Exam Completed Successfully!
            </p>
            <h2 className="mt-0.5 text-xl font-black">Your Score Summary</h2>
          </div>
          <div className="ml-auto hidden flex-col items-end sm:flex">
            <span className="flex items-center gap-1.5 rounded-full bg-yellow-400/20 px-3 py-1 text-xs font-bold text-yellow-300">
              <Star size={11} className="fill-yellow-300" />+
              {apiResult.xpEarned} XP Earned
            </span>
          </div>
        </div>
      </div>

      {/* Accuracy Ring + Stat Cards */}
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.15,
            type: 'spring',
            bounce: 0.3,
          }}
          className="flex shrink-0 flex-col items-center gap-2 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-6 py-6 shadow-sm"
        >
          <AccuracyRing accuracy={numericAccuracy} size={148} />
          <span className="mt-1 text-xs font-semibold text-[rgb(var(--color-text-muted))]">
            {numericAccuracy >= 75
              ? 'Excellent work!'
              : numericAccuracy >= 50
                ? 'Good effort!'
                : 'Keep practising!'}
          </span>
        </motion.div>

        <div className="grid w-full grid-cols-2 gap-3">
          <StatCard
            icon={Target}
            label="Total Score"
            value={`${apiResult.correct}/${apiResult.totalQuestions}`}
            colorClass="text-violet-600 dark:text-violet-400"
            bgClass="bg-violet-100 dark:bg-violet-900/40"
            delay={0.2}
          />
          <StatCard
            icon={CheckCircle2}
            label="Correct"
            value={apiResult.correct}
            colorClass="text-emerald-600 dark:text-emerald-400"
            bgClass="bg-emerald-100 dark:bg-emerald-900/40"
            delay={0.28}
          />
          <StatCard
            icon={XCircle}
            label="Wrong"
            value={apiResult.wrong}
            colorClass="text-red-600 dark:text-red-400"
            bgClass="bg-red-100 dark:bg-red-900/40"
            delay={0.36}
          />
          <StatCard
            icon={MinusCircle}
            label="Skipped"
            value={apiResult.skipped}
            colorClass="text-slate-500 dark:text-slate-400"
            bgClass="bg-slate-100 dark:bg-slate-800"
            delay={0.44}
          />
        </div>
      </div>

      {/* Subject breakdown bars */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5 shadow-sm"
      >
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 size={14} className="text-violet-500" />
          <h3 className="text-sm font-bold text-[rgb(var(--color-text-primary))]">
            Subject Distribution
          </h3>
        </div>
        <div className="space-y-3">
          {subjectBreakdown.map(({ subject, total }, idx) => {
            // Distribute the correct answers proportionally among subjects for visual
            const perSubjectCorrect = Math.round(
              (apiResult.correct / apiResult.totalQuestions) * total
            );
            const pct =
              total > 0 ? Math.round((perSubjectCorrect / total) * 100) : 0;
            return (
              <div key={subject}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[rgb(var(--color-text-primary))]">
                    {subject}
                  </span>
                  <span className="text-xs tabular-nums text-[rgb(var(--color-text-muted))]">
                    {perSubjectCorrect}/{total} &middot; {pct}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[rgb(var(--color-surface-elevated))]">
                  <motion.div
                    className={cn(
                      'h-full rounded-full',
                      pct >= 75
                        ? 'bg-emerald-500'
                        : pct >= 50
                          ? 'bg-violet-500'
                          : 'bg-red-500'
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{
                      duration: 0.9,
                      delay: 0.55 + idx * 0.1,
                      ease: 'easeOut',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Token Balance After Deduction */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="flex items-center justify-between rounded-xl border border-yellow-300/30 bg-yellow-400/5 px-4 py-3"
      >
        <div className="flex items-center gap-2.5">
          <Zap size={16} className="text-yellow-500" />
          <div>
            <p className="text-xs font-bold text-[rgb(var(--color-text-primary))]">
              AI Token Balance
            </p>
            <p className="text-[11px] text-[rgb(var(--color-text-muted))]">
              {TOKENS_PER_SESSION} tokens deducted this session
            </p>
          </div>
        </div>
        <span
          className={cn(
            'rounded-full px-3 py-1 text-sm font-black tabular-nums',
            apiResult.remainingTokens === 0
              ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
          )}
        >
          {apiResult.remainingTokens} left
        </span>
      </motion.div>

      {/* Mock API Response (collapsible) */}
      <details className="group rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
        <summary className="flex cursor-pointer select-none items-center gap-2 px-4 py-3 text-xs font-semibold text-[rgb(var(--color-text-secondary))]">
          <BarChart3
            size={13}
            className="text-[rgb(var(--color-text-muted))]"
          />
          Mock API Response &mdash; POST /api/test-attempts/submit
          <ChevronRight
            size={13}
            className="ml-auto text-[rgb(var(--color-text-muted))] transition-transform group-open:rotate-90"
          />
        </summary>
        <pre className="overflow-x-auto rounded-b-xl bg-[rgb(var(--color-surface-elevated))] px-4 py-4 text-[11px] leading-relaxed text-[rgb(var(--color-text-secondary))]">
          {JSON.stringify(apiResult, null, 2)}
        </pre>
      </details>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center"
      >
        <button
          type="button"
          onClick={onReviewAnswers}
          className="flex items-center justify-center gap-2 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-6 py-3 text-sm font-bold text-[rgb(var(--color-text-primary))] transition-all hover:border-violet-400 hover:text-violet-600 focus-ring"
        >
          <BookOpen size={15} />
          Review Detailed Answers
        </button>
        <button
          type="button"
          onClick={onGoToDashboard}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:from-violet-500 hover:to-purple-500 hover:shadow-violet-500/25 focus-ring"
        >
          <LayoutDashboard size={15} />
          Go to Dashboard
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// In-Progress Exam Screen
// ─────────────────────────────────────────────

function InProgressScreen({
  questions,
  answers,
  currentIndex,
  flaggedIds,
  elapsedSeconds,
  isSubmitting,
  onSelect,
  onToggleFlag,
  onNavigate,
  onClear,
  onSubmit,
}: {
  questions: ExamQuestion[];
  answers: Record<string, string>;
  currentIndex: number;
  flaggedIds: Set<string>;
  elapsedSeconds: number;
  isSubmitting: boolean;
  onSelect: (qId: string, optId: string) => void;
  onToggleFlag: (qId: string) => void;
  onNavigate: (i: number) => void;
  onClear: (qId: string) => void;
  onSubmit: () => void;
}) {
  const q = questions[currentIndex];
  const selectedOptId = q ? answers[q.id] : undefined;
  const isFlagged = q ? flaggedIds.has(q.id) : false;
  const answered = Object.keys(answers).length;
  const total = questions.length;

  return (
    <div className="flex flex-col gap-5">
      {/* Progress header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[rgb(var(--color-text-muted))]">
          <BookOpen size={13} />
          <span>
            Q {currentIndex + 1} of {total}
          </span>
          <span className="rounded-full bg-[rgb(var(--color-surface-elevated))] px-2 py-0.5 text-[10px]">
            {answered}/{total} answered
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-[rgb(var(--color-border))] px-3 py-1 text-xs font-bold tabular-nums text-[rgb(var(--color-text-primary))]">
          <Clock size={11} className="text-[rgb(var(--color-text-muted))]" />
          {formatTime(elapsedSeconds)}
        </div>
      </div>

      {/* Progress track */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[rgb(var(--color-surface-elevated))]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
          animate={{ width: `${(answered / total) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Question bubble navigator */}
      <div className="flex flex-wrap gap-1.5">
        {questions.map((question, i) => {
          const isAnswered = Boolean(answers[question.id]);
          const isCurrent = i === currentIndex;
          const isFlag = flaggedIds.has(question.id);
          return (
            <button
              key={question.id}
              type="button"
              onClick={() => onNavigate(i)}
              aria-label={`Go to question ${i + 1}`}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-bold transition-all focus-ring',
                isCurrent
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                  : isFlag
                    ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-400 dark:bg-amber-950 dark:text-amber-300'
                    : isAnswered
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                      : 'border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-muted))] hover:border-violet-300'
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Bubble legend */}
      <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold text-[rgb(var(--color-text-muted))]">
        {[
          { color: 'bg-violet-600', label: 'Current' },
          { color: 'bg-emerald-500', label: 'Answered' },
          { color: 'bg-amber-400', label: 'Flagged' },
          {
            color: 'border border-[rgb(var(--color-border))] bg-transparent',
            label: 'Unanswered',
          },
        ].map(({ color, label }) => (
          <span key={label} className="inline-flex items-center gap-1">
            <span className={cn('h-3 w-3 rounded-sm', color)} />
            {label}
          </span>
        ))}
      </div>

      {/* Question card */}
      {q && (
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5 shadow-sm sm:p-6"
          >
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-violet-700 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-300">
                <Sparkles size={9} />
                {q.subject}
              </span>
              <p className="mt-3 text-[15px] font-semibold leading-relaxed text-[rgb(var(--color-text-primary))]">
                {q.text}
              </p>
            </div>

            <div className="space-y-2.5">
              {q.options.map((opt, oi) => {
                const isSelected = selectedOptId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onSelect(q.id, opt.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all focus-ring',
                      isSelected
                        ? 'border-violet-500 bg-violet-50 font-semibold text-violet-700 shadow-sm dark:border-violet-600 dark:bg-violet-950 dark:text-violet-300'
                        : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))] hover:border-violet-300 hover:bg-violet-50/50 dark:hover:border-violet-700 dark:hover:bg-violet-950/30'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[1.5px] text-xs font-bold transition-all',
                        isSelected
                          ? 'border-violet-500 bg-violet-500 text-white'
                          : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-text-muted))]'
                      )}
                    >
                      {letterLabel(oi)}
                    </span>
                    <span className="flex-1">{opt.text}</span>
                    {isSelected && (
                      <CheckCircle2
                        size={15}
                        className="shrink-0 text-violet-500"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Card footer */}
            <div className="mt-5 flex items-center gap-2 border-t border-[rgb(var(--color-border))] pt-4">
              <button
                type="button"
                onClick={() => onToggleFlag(q.id)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all focus-ring',
                  isFlagged
                    ? 'border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-text-secondary))] hover:border-amber-300 hover:text-amber-600'
                )}
              >
                <Flag size={12} className={isFlagged ? 'fill-current' : ''} />
                {isFlagged ? 'Unmark' : 'Flag for Review'}
              </button>
              {selectedOptId && (
                <button
                  type="button"
                  onClick={() => onClear(q.id)}
                  className="flex items-center gap-1 rounded-lg border border-[rgb(var(--color-border))] px-3 py-2 text-xs font-medium text-[rgb(var(--color-text-secondary))] transition-all hover:border-red-300 hover:text-red-600 focus-ring"
                >
                  <RotateCcw size={11} />
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Navigation row */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={() => onNavigate(currentIndex - 1)}
          className="flex items-center gap-1.5 rounded-xl border border-[rgb(var(--color-border))] px-4 py-2.5 text-sm font-semibold text-[rgb(var(--color-text-secondary))] transition-all hover:border-violet-400 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40 focus-ring"
        >
          <ChevronLeft size={15} />
          Previous
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onSubmit}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:from-violet-500 hover:to-purple-500 hover:shadow-violet-500/25 disabled:cursor-not-allowed disabled:opacity-50 focus-ring"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Trophy size={14} />
                Submit Examination
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onNavigate(currentIndex + 1)}
            className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-violet-500 focus-ring"
          >
            Next
            <ChevronRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main ExamEnginePanel Component
// ─────────────────────────────────────────────

export function ExamEnginePanel({
  user = {
    name: 'Ali Hassan',
    avatarInitials: 'AH',
    aiTokenBalance: 15,
  },
  onGoToDashboard,
  onReviewAnswers,
}: ExamEnginePanelProps) {
  const questions = DEMO_QUESTIONS;

  const [examState, setExamState] = useState<ExamState>(
    user.aiTokenBalance === 0 ? 'TOKEN_EXHAUSTED' : 'IN_PROGRESS'
  );
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResult, setApiResult] = useState<SubmitApiResponse | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(user.aiTokenBalance);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Elapsed timer — only runs during IN_PROGRESS
  useEffect(() => {
    if (examState !== 'IN_PROGRESS') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examState]);

  // Live stats for the confirm modal
  const liveStats = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    for (const q of questions) {
      const selected = answers[q.id];
      if (!selected) {
        skipped++;
      } else {
        const opt = q.options.find((o) => o.id === selected);
        if (opt?.isCorrect) correct++;
        else wrong++;
      }
    }
    const attempted = correct + wrong;
    const accuracy =
      attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    return { correct, wrong, skipped, accuracy };
  }, [answers, questions]);

  const handleSelect = useCallback((qId: string, optId: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: optId }));
  }, []);

  const handleClear = useCallback((qId: string) => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
  }, []);

  const handleToggleFlag = useCallback((qId: string) => {
    setFlaggedIds((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  }, []);

  const handleNavigate = useCallback(
    (i: number) => {
      setCurrentIndex(Math.max(0, Math.min(i, questions.length - 1)));
    },
    [questions.length]
  );

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);
    try {
      const result = await mockSubmitApi(answers, questions, tokenBalance);
      setApiResult(result);
      setTokenBalance(result.remainingTokens);
      setExamState('SUBMITTED_RESULT');
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, questions, tokenBalance]);

  const handleGoToPricing = useCallback(() => {
    window.location.href = '/pricing';
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Panel Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-5 flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 text-xs font-black text-white shadow-md">
            {user.avatarInitials}
          </div>
          <div>
            <p className="text-xs font-semibold text-[rgb(var(--color-text-muted))]">
              MeritPrep Pakistan
            </p>
            <p className="text-sm font-bold text-[rgb(var(--color-text-primary))]">
              {user.name}
            </p>
          </div>
        </div>
        <TokenBadge balance={tokenBalance} />
      </motion.div>

      {/* Token-zero warning strip (during in-progress) */}
      {tokenBalance === 0 && examState === 'IN_PROGRESS' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 flex items-center gap-2 rounded-xl border border-red-300/40 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-600 dark:text-red-400"
        >
          <AlertTriangle size={13} className="shrink-0" />
          You have no AI tokens remaining. Submission is disabled. Please
          upgrade to continue.
        </motion.div>
      )}

      {/* Main Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5 shadow-md sm:p-7"
      >
        {/* Panel title bar */}
        <div className="mb-6 flex items-center gap-3 border-b border-[rgb(var(--color-border))] pb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/40">
            <BookOpen
              size={15}
              className="text-violet-600 dark:text-violet-400"
            />
          </div>
          <div>
            <h1 className="text-sm font-black text-[rgb(var(--color-text-primary))]">
              CSS Competitive Exam — Mock Test
            </h1>
            <p className="text-[11px] text-[rgb(var(--color-text-muted))]">
              {questions.length} Questions &middot; 4 Subjects &middot; 30
              Minutes
            </p>
          </div>
          <span
            className={cn(
              'ml-auto rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide',
              examState === 'IN_PROGRESS'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : examState === 'TOKEN_EXHAUSTED'
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
            )}
          >
            {examState === 'IN_PROGRESS'
              ? 'In Progress'
              : examState === 'TOKEN_EXHAUSTED'
                ? 'Token Exhausted'
                : 'Completed'}
          </span>
        </div>

        {/* State router */}
        <AnimatePresence mode="wait">
          {examState === 'TOKEN_EXHAUSTED' ? (
            <TokenExhaustedScreen
              key="exhausted"
              onGoToPricing={handleGoToPricing}
            />
          ) : examState === 'SUBMITTED_RESULT' && apiResult ? (
            <ResultScreen
              key="result"
              apiResult={apiResult}
              onReviewAnswers={() => onReviewAnswers?.()}
              onGoToDashboard={() => onGoToDashboard?.()}
            />
          ) : (
            <InProgressScreen
              key="in-progress"
              questions={questions}
              answers={answers}
              currentIndex={currentIndex}
              flaggedIds={flaggedIds}
              elapsedSeconds={elapsedSeconds}
              isSubmitting={isSubmitting}
              onSelect={handleSelect}
              onToggleFlag={handleToggleFlag}
              onNavigate={handleNavigate}
              onClear={handleClear}
              onSubmit={() => setShowConfirmModal(true)}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            key="confirm-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
              className="w-full max-w-md rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/40">
                  <Trophy
                    size={20}
                    className="text-violet-600 dark:text-violet-400"
                  />
                </div>
                <div>
                  <h3 className="text-base font-black text-[rgb(var(--color-text-primary))]">
                    Submit Examination?
                  </h3>
                  <p className="text-xs text-[rgb(var(--color-text-muted))]">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              {/* Live stat snapshot */}
              <div className="mt-5 grid grid-cols-3 gap-2">
                {[
                  {
                    label: 'Answered',
                    value: Object.keys(answers).length,
                    color: 'text-violet-600 dark:text-violet-400',
                  },
                  {
                    label: 'Skipped',
                    value: liveStats.skipped,
                    color: 'text-slate-500 dark:text-slate-400',
                  },
                  {
                    label: 'Flagged',
                    value: flaggedIds.size,
                    color: 'text-amber-600 dark:text-amber-400',
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-3 text-center"
                  >
                    <p
                      className={cn('text-lg font-black tabular-nums', s.color)}
                    >
                      {s.value}
                    </p>
                    <p className="text-[10px] font-semibold text-[rgb(var(--color-text-muted))]">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Token deduction notice */}
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-yellow-300/30 bg-yellow-400/5 px-3 py-2.5 text-xs text-[rgb(var(--color-text-secondary))]">
                <Zap size={12} className="shrink-0 text-yellow-500" />
                Submitting will deduct{' '}
                <strong className="mx-0.5 text-yellow-600 dark:text-yellow-400">
                  {TOKENS_PER_SESSION} AI tokens
                </strong>{' '}
                from your balance.
              </div>

              {liveStats.skipped > 0 && (
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-amber-300/30 bg-amber-400/5 px-3 py-2.5 text-xs text-amber-700 dark:text-amber-400">
                  <AlertTriangle size={12} className="shrink-0" />
                  {liveStats.skipped} question{liveStats.skipped > 1 ? 's' : ''}{' '}
                  unattempted. They will be marked as skipped.
                </div>
              )}

              <div className="mt-5 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="rounded-xl border border-[rgb(var(--color-border))] px-5 py-2.5 text-sm font-semibold text-[rgb(var(--color-text-secondary))] transition-all hover:bg-[rgb(var(--color-surface-elevated))] focus-ring"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  disabled={tokenBalance === 0 || isSubmitting}
                  onClick={() => void handleSubmit()}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:from-violet-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-50 focus-ring"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Trophy size={14} />
                      Yes, Submit Now
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
