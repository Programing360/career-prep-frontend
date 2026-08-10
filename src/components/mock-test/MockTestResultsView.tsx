import { motion } from 'framer-motion';
import {
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  Clock,
  FileText,
  Lock,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  XCircle,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { MockTestCTA } from './MockTestCTA';
import type { MockTestResult, TestType } from '@/types/mockTest';

interface MockTestResultsViewProps {
  result: MockTestResult;
  testType: TestType;
  isAutoSubmitted?: boolean;
  onRetry: () => void;
  onExit: () => void;
}

function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return [h, m, s].map((n) => n.toString().padStart(2, '0')).join(':');
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function accuracyColor(accuracy: number): string {
  if (accuracy >= 75) return 'text-accent-600 dark:text-accent-400';
  if (accuracy >= 50) return 'text-primary-600 dark:text-primary-400';
  return 'text-danger-600 dark:text-danger-400';
}

function ScoreCard({
  icon: Icon,
  label,
  value,
  valueClass,
  delay,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  valueClass: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4 text-center shadow-sm"
    >
      <Icon
        size={16}
        className="mx-auto text-[rgb(var(--color-text-muted))]"
        aria-hidden="true"
      />
      <p
        className={cn(
          'mt-2 text-xl font-bold tabular-nums sm:text-2xl',
          valueClass
        )}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[11px] font-medium text-[rgb(var(--color-text-muted))]">
        {label}
      </p>
    </motion.div>
  );
}

export function MockTestResultsView({
  result,
  testType,
  isAutoSubmitted = false,
  onRetry,
  onExit,
}: MockTestResultsViewProps) {
  const accuracy =
    result.totalQuestions > 0
      ? Math.round((result.correctCount / result.totalQuestions) * 100)
      : 0;
  const isVerbalNonVerbal = testType === 'verbal_nonverbal';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="mx-auto w-full max-w-3xl"
    >
      {/* Demo Preview Results banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary-200 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 px-5 py-4 text-white shadow-lg sm:px-6 dark:border-primary-800/60">
        <div className="pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
            <Sparkles size={18} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold uppercase tracking-wide">
              Demo Preview Results
            </p>
            <p className="mt-0.5 truncate text-xs text-white/80">
              {isAutoSubmitted
                ? "Time's up â€” your demo was submitted automatically."
                : 'You completed a short demo test. Results are final for this session.'}
            </p>
          </div>
          <span className="hidden shrink-0 items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white sm:inline-flex">
            {isVerbalNonVerbal ? (
              <Zap size={10} aria-hidden="true" />
            ) : (
              <Lock size={10} aria-hidden="true" />
            )}
            {isVerbalNonVerbal ? 'Verbal & Non-Verbal' : 'Demo'} Â· Final
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="mt-8 flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
          <Trophy
            size={32}
            className="text-primary-600 dark:text-primary-400"
            aria-hidden="true"
          />
        </div>
        <h2 className="mt-4 text-2xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
          Your Demo Results
        </h2>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Here is how you performed on the{' '}
          {isVerbalNonVerbal ? 'Verbal & Non-Verbal' : 'General Knowledge'}{' '}
          demo.
        </p>
      </div>

      {/* Score summary cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <ScoreCard
          icon={Target}
          label="Overall Score"
          value={`${result.score}/${result.totalQuestions}`}
          valueClass="text-primary-600 dark:text-primary-400"
          delay={0.1}
        />
        <ScoreCard
          icon={FileText}
          label="Total Questions"
          value={String(result.totalQuestions)}
          valueClass="text-[rgb(var(--color-text-primary))]"
          delay={0.16}
        />
        <ScoreCard
          icon={CheckCircle2}
          label="Correct"
          value={String(result.correctCount)}
          valueClass="text-accent-600 dark:text-accent-400"
          delay={0.22}
        />
        <ScoreCard
          icon={XCircle}
          label="Incorrect"
          value={String(result.incorrectCount)}
          valueClass="text-danger-600 dark:text-danger-400"
          delay={0.28}
        />
        <ScoreCard
          icon={TrendingUp}
          label="Accuracy"
          value={`${accuracy}%`}
          valueClass={accuracyColor(accuracy)}
          delay={0.34}
        />
        <ScoreCard
          icon={Clock}
          label="Time Taken"
          value={formatDuration(result.timeSpentSeconds)}
          valueClass="text-[rgb(var(--color-text-primary))]"
          delay={0.4}
        />
      </div>

      {/* Subject-wise performance breakdown */}
      {result.subjectBreakdown.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.35, ease: 'easeOut' }}
          className="mt-6 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5 shadow-sm sm:p-6"
        >
          <div className="flex items-center gap-2">
            <BarChart3
              size={16}
              className="text-primary-500"
              aria-hidden="true"
            />
            <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
              Subject-wise Performance
            </h3>
          </div>

          <div className="mt-5 space-y-5">
            {result.subjectBreakdown.map((subject, index) => {
              const correctPct =
                subject.totalQuestions > 0
                  ? (subject.correctCount / subject.totalQuestions) * 100
                  : 0;
              const barDelay = 0.45 + index * 0.12;
              return (
                <div key={subject.subject}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-medium text-[rgb(var(--color-text-primary))]">
                      {subject.subject}
                    </span>
                    <span className="shrink-0 text-xs font-semibold tabular-nums text-[rgb(var(--color-text-secondary))]">
                      {subject.correctCount}/{subject.totalQuestions} Â·{' '}
                      {subject.accuracyPercentage}%
                    </span>
                  </div>
                  <div className="mt-2 flex h-2.5 w-full overflow-hidden rounded-full bg-[rgb(var(--color-surface-elevated))] ring-1 ring-[rgb(var(--color-border))]">
                    <motion.div
                      className={cn(
                        'h-full bg-accent-500',
                        correctPct >= 100 ? 'rounded-full' : 'rounded-l-full'
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${correctPct}%` }}
                      transition={{
                        duration: 0.7,
                        delay: barDelay,
                        ease: 'easeOut',
                      }}
                    />
                    {correctPct < 100 && (
                      <motion.div
                        className="h-full rounded-r-full bg-danger-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${100 - correctPct}%` }}
                        transition={{
                          duration: 0.7,
                          delay: barDelay,
                          ease: 'easeOut',
                        }}
                      />
                    )}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] font-medium text-[rgb(var(--color-text-muted))]">
                    <span className="inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                      Correct
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-danger-400" />
                      Incorrect
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Anti-tamper note */}
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-4 py-3 text-xs text-[rgb(var(--color-text-secondary))]">
        <Lock
          size={12}
          className="shrink-0 text-[rgb(var(--color-text-muted))]"
          aria-hidden="true"
        />
        <span>
          This result is final. Completed sessions are locked and cannot be
          modified or re-submitted.
        </span>
      </div>

      {/* Registration CTA */}
      <div className="mt-6">
        <MockTestCTA />
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
        <Button
          variant="outline"
          size="md"
          leftIcon={<ChevronLeft size={16} />}
          onClick={onExit}
        >
          Back to Exams
        </Button>
        <Button size="md" onClick={onRetry}>
          Take Demo Again
        </Button>
      </div>
    </motion.div>
  );
}
