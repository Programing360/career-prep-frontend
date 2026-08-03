import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Flame, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { toDateKey } from '@/utils/dateHelpers';
import { getCompletedQuiz } from '@/utils/quizStorage';

interface DailyQuizCompactWidgetProps {
  streak?: number;
  className?: string;
}

export function DailyQuizCompactWidget({
  streak = 0,
  className,
}: DailyQuizCompactWidgetProps) {
  const [completed] = useState(() => getCompletedQuiz(toDateKey(new Date())));

  return (
    <section
      aria-label="Daily quiz"
      className={cn(
        'relative overflow-hidden rounded-xl border border-primary-200/60 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 p-4 text-white shadow-sm',
        'dark:border-primary-800/60',
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full bg-white/10 blur-2xl"
        aria-hidden="true"
      />
      <div className="relative flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
          {completed ? (
            <CheckCircle2 size={18} aria-hidden="true" />
          ) : (
            <Zap size={18} aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">
            {completed
              ? 'Today\u2019s quiz done!'
              : 'Start Today\u2019s 2-Min Quiz'}
          </p>
          <p className="mt-0.5 truncate text-xs text-white/80">
            {completed
              ? `You scored ${completed.score}/${completed.totalQuestions}. Tap to review.`
              : '8 quick questions. Test your general knowledge.'}
          </p>
        </div>
        <Link
          to={ROUTES.DAILY_QUIZ}
          className="inline-flex shrink-0 items-center gap-1 rounded-md bg-white/15 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/25 focus-ring"
        >
          {completed ? 'Review' : 'Start'}
          <ArrowRight size={12} aria-hidden="true" />
        </Link>
      </div>
      <div className="relative mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-white/90">
        <Flame size={13} className="text-amber-300" aria-hidden="true" />
        {streak > 0 ? (
          <span>
            {streak} day{streak === 1 ? '' : 's'} streak — keep it going!
          </span>
        ) : (
          <span>Complete today\u2019s quiz to start a streak.</span>
        )}
      </div>
    </section>
  );
}
