import { useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  Clock,
  Target,
  ArrowRight,
  X,
  RefreshCcw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

interface RecoveryPlan {
  missedDays: number;
  lastActiveDate: string;
  adjustedDailyTarget: number;
  suggestedSubjects: { name: string; priority: 'high' | 'medium' }[];
  catchUpDays: number;
}

const mockRecoveryPlan: RecoveryPlan = {
  missedDays: 3,
  lastActiveDate: '2026-07-18',
  adjustedDailyTarget: 40,
  suggestedSubjects: [
    { name: 'General Knowledge', priority: 'high' },
    { name: 'Pakistan Affairs', priority: 'high' },
    { name: 'English', priority: 'medium' },
  ],
  catchUpDays: 5,
};

export function MissedStudyRecovery() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const plan = mockRecoveryPlan;

  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-solid border-primary-300 bg-gradient-to-br from-primary-50/80 to-primary-50/50 p-5 dark:border-primary-400 dark:from-[#1c1a41] dark:to-primary-950/30 shadow-lg">
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-3 rounded-md p-1 text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-surface-elevated))] hover:text-[rgb(var(--color-text-primary))]"
      >
        <X size={14} />
      </button>

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900">
          <AlertTriangle
            size={20}
            className="text-primary-600 dark:text-primary-400"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold font-heading text-[rgb(var(--color-text-primary))]">
            Missed-Study Recovery Plan
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-[rgb(var(--color-text-secondary))]">
            You've missed{' '}
            <span className="font-bold text-primary-600 dark:text-primary-400">
              {plan.missedDays} days
            </span>{' '}
            of study. Here's your adaptive catch-up strategy to get back on
            track.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-3">
          <div className="flex items-center gap-1.5">
            <Target size={12} className="text-primary-500" />
            <span className="text-[10px] font-medium text-[rgb(var(--color-text-muted))]">
              Adjusted Daily Target
            </span>
          </div>
          <p className="mt-1 text-lg font-bold font-heading text-[rgb(var(--color-text-primary))]">
            {plan.adjustedDailyTarget} MCQs
          </p>
          <p className="text-[10px] text-[rgb(var(--color-text-muted))]">
            Increased from 25 to accelerate recovery
          </p>
        </div>

        <div className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-3">
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-primary-500" />
            <span className="text-[10px] font-medium text-[rgb(var(--color-text-muted))]">
              Catch-Up Duration
            </span>
          </div>
          <p className="mt-1 text-lg font-bold font-heading text-[rgb(var(--color-text-primary))]">
            {plan.catchUpDays} Days
          </p>
          <p className="text-[10px] text-[rgb(var(--color-text-muted))]">
            To restore your original streak
          </p>
        </div>

        <div className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-3">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="text-accent-500" />
            <span className="text-[10px] font-medium text-[rgb(var(--color-text-muted))]">
              Last Active
            </span>
          </div>
          <p className="mt-1 text-lg font-bold font-heading text-[rgb(var(--color-text-primary))]">
            {plan.lastActiveDate}
          </p>
          <p className="text-[10px] text-[rgb(var(--color-text-muted))]">
            3 days ago
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
          Priority Subjects to Review
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {plan.suggestedSubjects.map((s) => (
            <span
              key={s.name}
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold',
                s.priority === 'high'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
              )}
            >
              {s.priority === 'high' && <AlertTriangle size={10} />}
              {s.name}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Link to={ROUTES.PRACTICE}>
          <Button size="sm" leftIcon={<RefreshCcw size={12} />}>
            Start Catch-Up Session
            <ArrowRight size={12} className="ml-1" />
          </Button>
        </Link>
        <Button size="sm" variant="ghost" onClick={() => setDismissed(true)}>
          Dismiss
        </Button>
      </div>
    </div>
  );
}
