import { Link } from 'react-router-dom';
import {
  Target,
  TrendingUp,
  Clock,
  ClipboardCheck,
  BookOpen,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Flame,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

interface ExecutiveMetrics {
  totalMcqsAttempted: number;
  averageAccuracy: number;
  totalMockTests: number;
  activeStudyHours: number;
}

interface SubjectPerformance {
  id: string;
  name: string;
  accuracy: number;
  totalAttempted: number;
  correct: number;
  incorrect: number;
  trend: 'up' | 'down' | 'stable';
}

interface TopicScore {
  topic: string;
  subject: string;
  accuracy: number;
}

const mockMetrics: ExecutiveMetrics = {
  totalMcqsAttempted: 1247,
  averageAccuracy: 72,
  totalMockTests: 18,
  activeStudyHours: 64,
};

const mockSubjectPerformance: SubjectPerformance[] = [
  {
    id: 'english',
    name: 'English',
    accuracy: 82,
    totalAttempted: 312,
    correct: 256,
    incorrect: 56,
    trend: 'up',
  },
  {
    id: 'gk',
    name: 'General Knowledge',
    accuracy: 65,
    totalAttempted: 289,
    correct: 188,
    incorrect: 101,
    trend: 'up',
  },
  {
    id: 'reasoning',
    name: 'Verbal & Reasoning',
    accuracy: 78,
    totalAttempted: 245,
    correct: 191,
    incorrect: 54,
    trend: 'stable',
  },
  {
    id: 'pakistan-affairs',
    name: 'Pakistan Affairs',
    accuracy: 58,
    totalAttempted: 198,
    correct: 115,
    incorrect: 83,
    trend: 'down',
  },
  {
    id: 'current-affairs',
    name: 'Current Affairs',
    accuracy: 71,
    totalAttempted: 143,
    correct: 102,
    incorrect: 41,
    trend: 'up',
  },
  {
    id: 'math',
    name: 'Mathematics',
    accuracy: 48,
    totalAttempted: 60,
    correct: 29,
    incorrect: 31,
    trend: 'down',
  },
];

const mockStrongTopics: TopicScore[] = [
  { topic: 'English Grammar & Vocabulary', subject: 'English', accuracy: 88 },
  { topic: 'Verbal Analogies', subject: 'Verbal & Reasoning', accuracy: 85 },
  {
    topic: 'Current International Affairs',
    subject: 'Current Affairs',
    accuracy: 79,
  },
];

const mockWeakTopics: TopicScore[] = [
  {
    topic: 'Mathematics & Data Interpretation',
    subject: 'Mathematics',
    accuracy: 42,
  },
  {
    topic: 'Pakistan Constitutional History',
    subject: 'Pakistan Affairs',
    accuracy: 48,
  },
  { topic: 'Everyday Science', subject: 'General Knowledge', accuracy: 53 },
];

const mockRecentActivity = [
  {
    id: '1',
    title: 'CSS Preliminary Mock #12',
    score: 72,
    date: '2 hours ago',
  },
  { id: '2', title: 'GK Practice Session', score: 65, date: '5 hours ago' },
  { id: '3', title: 'Verbal Reasoning Quiz', score: 85, date: 'Yesterday' },
  { id: '4', title: 'Pakistan Affairs Test', score: 58, date: '2 days ago' },
  { id: '5', title: 'English Vocabulary Drill', score: 91, date: '3 days ago' },
];

const mockWeeklyTrend = [
  { day: 'Mon', mcqs: 45, accuracy: 70 },
  { day: 'Tue', mcqs: 62, accuracy: 74 },
  { day: 'Wed', mcqs: 38, accuracy: 68 },
  { day: 'Thu', mcqs: 55, accuracy: 76 },
  { day: 'Fri', mcqs: 70, accuracy: 72 },
  { day: 'Sat', mcqs: 85, accuracy: 78 },
  { day: 'Sun', mcqs: 42, accuracy: 71 },
];

export default function AnalyticsPage() {
  const maxMcqs = Math.max(...mockWeeklyTrend.map((d) => d.mcqs));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
            Analytics & Performance
          </h1>
          <p className="text-xs text-[rgb(var(--color-text-secondary))]">
            Track your progress across all exams and practice sessions
          </p>
        </div>
        <Link to={ROUTES.PRACTICE}>
          <Button size="sm" leftIcon={<BookOpen size={14} />}>
            Practice Now
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          icon={Target}
          label="Total MCQs Attempted"
          value={mockMetrics.totalMcqsAttempted.toLocaleString()}
          color="bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400"
        />
        <MetricCard
          icon={TrendingUp}
          label="Average Accuracy"
          value={`${mockMetrics.averageAccuracy}%`}
          color="bg-accent-50 text-accent-600 dark:bg-accent-950 dark:text-accent-400"
        />
        <MetricCard
          icon={ClipboardCheck}
          label="Mock Tests Taken"
          value={mockMetrics.totalMockTests.toString()}
          color="bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400"
        />
        <MetricCard
          icon={Clock}
          label="Active Study Hours"
          value={`${mockMetrics.activeStudyHours}h`}
          color="bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StrengthsCard topics={mockStrongTopics} />
        <WeaknessCard topics={mockWeakTopics} />
      </div>

      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-primary-500" />
          <h2 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
            Subject Performance
          </h2>
        </div>

        <div className="mt-4 space-y-4">
          {mockSubjectPerformance.map((subject) => (
            <div key={subject.id}>
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                    {subject.name}
                  </span>
                  {subject.trend === 'up' && (
                    <TrendingUp size={12} className="text-accent-500" />
                  )}
                  {subject.trend === 'down' && (
                    <TrendingUp
                      size={12}
                      className="rotate-180 text-danger-500"
                    />
                  )}
                  {subject.trend === 'stable' && (
                    <Flame size={12} className="text-amber-500" />
                  )}
                </div>
                <span className="text-xs font-semibold text-[rgb(var(--color-text-secondary))]">
                  {subject.accuracy}% &middot; {subject.correct}/
                  {subject.totalAttempted}
                </span>
              </div>
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[rgb(var(--color-surface-elevated))]">
                <div
                  className={cn(
                    'absolute inset-y-0 left-0 rounded-full transition-all duration-700',
                    subject.accuracy >= 75
                      ? 'bg-accent-500'
                      : subject.accuracy >= 55
                        ? 'bg-primary-500'
                        : subject.accuracy >= 40
                          ? 'bg-amber-500'
                          : 'bg-danger-500'
                  )}
                  style={{ width: `${subject.accuracy}%` }}
                />
              </div>
              <div className="mt-1 flex gap-3 text-[10px] text-[rgb(var(--color-text-muted))]">
                <span className="text-accent-600">
                  {subject.correct} correct
                </span>
                <span className="text-danger-600">
                  {subject.incorrect} incorrect
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5">
        <div className="flex items-center gap-2">
          <Flame size={16} className="text-amber-500" />
          <h2 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
            Weekly Activity
          </h2>
        </div>

        <div className="mt-4 flex items-end gap-2" style={{ height: 120 }}>
          {mockWeeklyTrend.map((day) => {
            const height = (day.mcqs / maxMcqs) * 100;
            return (
              <div
                key={day.day}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <span className="text-[9px] font-medium text-[rgb(var(--color-text-muted))]">
                  {day.mcqs}
                </span>
                <div
                  className="w-full rounded-t-md bg-primary-500 transition-all duration-500"
                  style={{ height: `${height}%`, minHeight: 4 }}
                />
                <span className="text-[10px] font-medium text-[rgb(var(--color-text-muted))]">
                  {day.day}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-[10px] text-[rgb(var(--color-text-muted))]">
          MCQs attempted per day this week &middot; Average accuracy:{' '}
          {mockMetrics.averageAccuracy}%
        </p>
      </div>

      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-primary-500" />
            <h2 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
              Recent Activity
            </h2>
          </div>
          <Link
            to={ROUTES.EXAMS}
            className="flex items-center gap-1 text-xs font-medium text-primary-500 hover:text-primary-600"
          >
            View All
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="mt-4 divide-y divide-[rgb(var(--color-border))]">
          {mockRecentActivity.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                  item.score >= 75
                    ? 'bg-accent-100 dark:bg-accent-900'
                    : item.score >= 50
                      ? 'bg-amber-100 dark:bg-amber-900'
                      : 'bg-danger-100 dark:bg-danger-900'
                )}
              >
                {item.score >= 75 ? (
                  <CheckCircle2
                    size={14}
                    className="text-accent-600 dark:text-accent-400"
                  />
                ) : item.score >= 50 ? (
                  <Target
                    size={14}
                    className="text-amber-600 dark:text-amber-400"
                  />
                ) : (
                  <XCircle
                    size={14}
                    className="text-danger-600 dark:text-danger-400"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[rgb(var(--color-text-primary))]">
                  {item.title}
                </p>
                <p className="text-xs text-[rgb(var(--color-text-muted))]">
                  {item.date}
                </p>
              </div>
              <span
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-xs font-bold',
                  item.score >= 75
                    ? 'bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300'
                    : item.score >= 50
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                      : 'bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300'
                )}
              >
                {item.score}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Target;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4 transition-colors hover:border-primary-200 dark:hover:border-primary-800">
      <div
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-lg',
          color
        )}
      >
        <Icon size={18} />
      </div>
      <p className="mt-3 text-xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
        {value}
      </p>
      <p className="text-[10px] text-[rgb(var(--color-text-muted))]">{label}</p>
    </div>
  );
}

function StrengthsCard({ topics }: { topics: TopicScore[] }) {
  return (
    <div className="rounded-xl border border-accent-200 bg-accent-50/30 p-5 dark:border-accent-800 dark:bg-accent-950/30">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-100 dark:bg-accent-900">
          <TrendingUp
            size={16}
            className="text-accent-600 dark:text-accent-400"
          />
        </div>
        <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
          Top 3 Strong Topics
        </h3>
      </div>

      <div className="mt-4 space-y-3">
        {topics.map((t, i) => (
          <div key={t.topic} className="flex items-center gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[rgb(var(--color-text-primary))]">
                {t.topic}
              </p>
              <p className="text-[10px] text-[rgb(var(--color-text-muted))]">
                {t.subject}
              </p>
            </div>
            <span className="text-sm font-bold text-accent-600 dark:text-accent-400">
              {t.accuracy}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeaknessCard({ topics }: { topics: TopicScore[] }) {
  return (
    <div className="rounded-xl border border-danger-200 bg-danger-50/30 p-5 dark:border-danger-800 dark:bg-danger-950/30">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger-100 dark:bg-danger-900">
          <AlertTriangle
            size={16}
            className="text-danger-600 dark:text-danger-400"
          />
        </div>
        <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
          Top 3 Weak Topics
        </h3>
      </div>

      <div className="mt-4 space-y-3">
        {topics.map((t, i) => (
          <div key={t.topic} className="flex items-center gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-danger-500 text-[10px] font-bold text-white">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[rgb(var(--color-text-primary))]">
                {t.topic}
              </p>
              <p className="text-[10px] text-[rgb(var(--color-text-muted))]">
                {t.subject}
              </p>
            </div>
            <span className="text-sm font-bold text-danger-600 dark:text-danger-400">
              {t.accuracy}%
            </span>
          </div>
        ))}
      </div>

      <Link to={ROUTES.PRACTICE}>
        <Button
          size="sm"
          variant="outline"
          className="mt-4 w-full border-danger-300 text-danger-600 hover:bg-danger-50 dark:border-danger-700 dark:text-danger-400 dark:hover:bg-danger-950"
          leftIcon={<BookOpen size={12} />}
        >
          Practice Weak Topics Now
        </Button>
      </Link>
    </div>
  );
}
