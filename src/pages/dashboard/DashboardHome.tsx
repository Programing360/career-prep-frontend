import { Link } from 'react-router-dom';
import {
  Flame,
  TrendingUp,
  Target,
  Play,
  Clock,
  CheckCircle2,
  Bookmark,
  Zap,
  Trophy,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { MissedStudyRecovery } from '@/components/widgets/MissedStudyRecovery';
import ScoreTrendChart from '@/components/widgets/ScoreTrendChart';
import SubjectBreakdownChart from '@/components/widgets/SubjectBreakdownChart';

interface MockUser {
  name: string;
}

interface MockStreak {
  current: number;
  longest: number;
  lastActiveDate: string;
}

interface MockProgress {
  xp: number;
  xpNextLevel: number;
  level: number;
  levelTitle: string;
  coins: number;
  streak: MockStreak;
  readinessScore: number;
}

interface ContinueLearning {
  examId: string;
  examTitle: string;
  subject: string;
  lastTopic: string;
  progressPercent: number;
  lastStudied: string;
}

interface RecentActivity {
  id: string;
  type:
    | 'quiz_completed'
    | 'bookmark'
    | 'streak_milestone'
    | 'badge_earned'
    | 'practice_session';
  examId?: string;
  title: string;
  detail: string;
  timestamp: string;
  score?: number;
}

const mockUser: MockUser = {
  name: 'MD Limon',
};

const mockProgress: MockProgress = {
  xp: 450,
  xpNextLevel: 1000,
  level: 4,
  levelTitle: 'Explorer',
  coins: 120,
  streak: {
    current: 5,
    longest: 12,
    lastActiveDate: '2026-07-20',
  },
  readinessScore: 78,
};

const mockContinueLearning: ContinueLearning = {
  examId: 'css-prelim-2026',
  examTitle: 'CSS Written Exam 2026',
  subject: 'English Essay & Precis',
  lastTopic: 'Argumentative Essay Structures',
  progressPercent: 62,
  lastStudied: '2 hours ago',
};

const mockRecentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'quiz_completed',
    examId: 'gk-speed-test',
    title: 'GK Mock Test #14',
    detail: 'Completed 50 MCQs',
    timestamp: '1 hour ago',
    score: 82,
  },
  {
    id: '2',
    type: 'bookmark',
    title: 'PPSC Past Paper 2024',
    detail: 'Bookmarked for review',
    timestamp: '3 hours ago',
  },
  {
    id: '3',
    type: 'practice_session',
    examId: 'verbal-reasoning-mock',
    title: 'Reasoning & IQ Practice',
    detail: '15 questions attempted',
    timestamp: '5 hours ago',
    score: 73,
  },
  {
    id: '4',
    type: 'badge_earned',
    title: 'Quick Learner Badge',
    detail: 'Completed 5 quizzes in one day',
    timestamp: 'Yesterday',
  },
  {
    id: '5',
    type: 'quiz_completed',
    examId: 'english-essay-precis',
    title: 'Accounting Fundamentals',
    detail: 'Completed 30 MCQs',
    timestamp: 'Yesterday',
    score: 91,
  },
];

const lastSevenDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const activeDays = [true, true, true, true, true, false, false];

function StudyStreakCard() {
  return (
    <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 transition-colors hover:border-primary-200 dark:hover:border-primary-800 shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-950">
          <Flame size={20} className="text-primary-500" />
        </div>
        <span className="text-xs font-medium text-[rgb(var(--color-text-muted))]">
          Best: {mockProgress.streak.longest} days
        </span>
      </div>

      <div className="mt-4">
        <p className="text-2xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
          {mockProgress.streak.current} Day Streak ðŸ”¥
        </p>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Keep it up! You&apos;re on a roll this week.
        </p>
      </div>

      <div className="mt-4 flex items-end gap-2">
        {lastSevenDays.map((day, i) => (
          <div key={day} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className={`flex h-8 w-full items-center justify-center rounded-md text-xs font-medium transition-colors ${
                activeDays[i]
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-muted))]'
              }`}
            >
              {activeDays[i] ? (
                <CheckCircle2 size={14} />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-40" />
              )}
            </div>
            <span className="text-[10px] font-medium text-[rgb(var(--color-text-muted))]">
              {day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function XpProgressCard() {
  const xpPercent = Math.round(
    (mockProgress.xp / mockProgress.xpNextLevel) * 100
  );

  return (
    <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 transition-colors hover:border-primary-200 dark:hover:border-primary-800 shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950">
          <Zap size={20} className="text-violet-500" />
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700 dark:bg-violet-950 dark:text-violet-300">
          <Trophy size={12} />
          Level {mockProgress.level}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-lg font-bold font-heading text-[rgb(var(--color-text-primary))]">
          Level {mockProgress.level} {mockProgress.levelTitle}
        </p>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          {mockProgress.xp} / {mockProgress.xpNextLevel} XP to Level{' '}
          {mockProgress.level + 1}
        </p>
      </div>

      <div className="mt-4">
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-[rgb(var(--color-surface-elevated))]">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 to-primary-500 transition-all duration-700 ease-out"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-[rgb(var(--color-text-muted))]">
          <span>{mockProgress.xp} XP earned</span>
          <span>{mockProgress.xpNextLevel - mockProgress.xp} XP remaining</span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs text-[rgb(var(--color-text-secondary))]">
        <TrendingUp size={14} className="text-accent-500" />
        <span>+{45} XP gained this week</span>
      </div>
    </div>
  );
}

function ReadinessScoreCard() {
  const score = mockProgress.readinessScore;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (circumference * score) / 100;

  const scoreColor =
    score >= 75
      ? 'text-accent-500'
      : score >= 50
        ? 'text-primary-500'
        : 'text-danger-500';

  const scoreStroke =
    score >= 75
      ? 'stroke-accent-500'
      : score >= 50
        ? 'stroke-primary-500'
        : 'stroke-danger-500';

  const scoreLabel =
    score >= 75
      ? 'Great progress!'
      : score >= 50
        ? 'Keep improving!'
        : 'Time to focus!';

  return (
    <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 transition-colors hover:border-primary-200 dark:hover:border-primary-800 shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-950">
          <Target size={20} className="text-primary-500" />
        </div>
        <span className="text-xs font-medium text-[rgb(var(--color-text-muted))]">
          Overall
        </span>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="relative h-36 w-36">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              strokeWidth="8"
              className="stroke-[rgb(var(--color-surface-elevated))]"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={`${scoreStroke} transition-all duration-1000 ease-out`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold font-heading ${scoreColor}`}>
              {score}%
            </span>
            <span className="text-[11px] font-medium text-[rgb(var(--color-text-muted))]">
              Readiness
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
          Exam Readiness Score ðŸŽ¯
        </p>
        <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
          {scoreLabel} You're{' '}
          {score >= 75
            ? 'nearly exam-ready'
            : score >= 50
              ? 'making solid progress'
              : 'building your foundation'}
          .
        </p>
      </div>
    </div>
  );
}

function ContinueLearningCard() {
  return (
    <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Play size={18} className="text-primary-500" />
          <h3 className="font-semibold font-heading text-[rgb(var(--color-text-primary))]">
            Continue Learning
          </h3>
        </div>
        <Link
          to={ROUTES.EXAMS}
          className="flex items-center gap-1 text-xs font-medium text-primary-500 transition-colors hover:text-primary-600"
        >
          View All
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="mt-4 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
              {mockContinueLearning.examTitle}
            </p>
            <p className="mt-0.5 text-sm text-[rgb(var(--color-text-secondary))]">
              {mockContinueLearning.subject}
            </p>
            <p className="mt-1 text-xs text-[rgb(var(--color-text-muted))]">
              Last topic: {mockContinueLearning.lastTopic}
            </p>
          </div>
          <Link
            to={ROUTES.EXAM_ATTEMPT.replace(':id', mockContinueLearning.examId)}
          >
            <Button size="sm" leftIcon={<Play size={14} />}>
              Resume
            </Button>
          </Link>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-[rgb(var(--color-text-muted))]">
            <span>{mockContinueLearning.progressPercent}% complete</span>
            <span>{mockContinueLearning.lastStudied}</span>
          </div>
          <div className="relative mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[rgb(var(--color-border))]">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-primary-500 transition-all duration-500"
              style={{ width: `${mockContinueLearning.progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityIcon({ type }: { type: RecentActivity['type'] }) {
  switch (type) {
    case 'quiz_completed':
      return <CheckCircle2 size={16} className="text-accent-500" />;
    case 'bookmark':
      return <Bookmark size={16} className="text-primary-500" />;
    case 'streak_milestone':
      return <Flame size={16} className="text-primary-500" />;
    case 'badge_earned':
      return <Trophy size={16} className="text-violet-500" />;
    case 'practice_session':
      return <Target size={16} className="text-cyan-500" />;
    default:
      return (
        <Clock size={16} className="text-[rgb(var(--color-text-muted))]" />
      );
  }
}

function RecentActivityCard() {
  return (
    <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-primary-500" />
          <h3 className="font-semibold font-heading text-[rgb(var(--color-text-primary))]">
            Recent Activity
          </h3>
        </div>
        <Link
          to={ROUTES.ANALYTICS}
          className="flex items-center gap-1 text-xs font-medium text-primary-500 transition-colors hover:text-primary-600"
        >
          View All
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="mt-4 divide-y divide-[rgb(var(--color-border))]">
        {mockRecentActivity.map((item) => {
          const Wrapper = item.examId ? Link : 'div';
          const wrapperProps = item.examId
            ? {
                to: ROUTES.EXAM_ATTEMPT.replace(':id', item.examId),
                className:
                  'flex items-center gap-3 py-3 first:pt-0 last:pb-0 transition-colors hover:bg-[rgb(var(--color-surface-elevated))] -mx-2 px-2 rounded-lg',
              }
            : {
                className: 'flex items-center gap-3 py-3 first:pt-0 last:pb-0',
              };

          return (
            <Wrapper key={item.id} {...wrapperProps}>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[rgb(var(--color-surface-elevated))]">
                <ActivityIcon type={item.type} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[rgb(var(--color-text-primary))]">
                  {item.title}
                </p>
                <p className="truncate text-xs text-[rgb(var(--color-text-muted))]">
                  {item.detail}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                {item.score !== undefined && (
                  <span className="rounded-full bg-accent-50 px-2 py-0.5 text-[10px] font-semibold text-accent-700 dark:bg-accent-950 dark:text-accent-300">
                    {item.score}%
                  </span>
                )}
                <span className="flex items-center gap-1 text-[10px] text-[rgb(var(--color-text-muted))]">
                  <Calendar size={10} />
                  {item.timestamp}
                </span>
              </div>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const firstName = mockUser.name.split(' ').pop() || mockUser.name;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
            Welcome back, {firstName}!
          </h1>
          <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
            Here's your study progress for today. You've completed{' '}
            <span className="font-semibold text-primary-500">3 of 5</span> daily
            goals.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700 dark:bg-violet-950 dark:text-violet-300">
            <Zap size={14} />
            {mockProgress.xp} XP
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700 dark:bg-primary-950 dark:text-primary-300">
            <Trophy size={14} />
            {mockProgress.coins} Coins
          </div>
        </div>
      </div>

      <MissedStudyRecovery />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <StudyStreakCard />
        <XpProgressCard />
        <ReadinessScoreCard />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ContinueLearningCard />
        <RecentActivityCard />
      </div>

      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold font-heading text-[rgb(var(--color-text-primary))]">
            Analytics & Progress Overview
          </h2>
          <p className="mt-0.5 text-sm text-[rgb(var(--color-text-secondary))]">
            Track your performance across mock tests and subjects.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <ScoreTrendChart />
          <SubjectBreakdownChart />
        </div>
      </div>
    </div>
  );
}
