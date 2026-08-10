import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { toDateKey } from '@/utils/dateHelpers';
import { getCompletedQuiz } from '@/utils/quizStorage';
import readBookLottie from '../../assets/Woman read book.svg';
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
        'relative overflow-hidden rounded-2xl border border-white/40 dark:border-purple-500/20 bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 p-4 text-white shadow-xl shadow-purple-950/10 backdrop-blur-xl',
        className
      )}
    >
      {/* Background Glow Accents */}
      <div
        className="pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full bg-white/10 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-fuchsia-400/20 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative flex items-center gap-3">
        {/* Lottie Animation or Completion Icon Badge */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/15 backdrop-blur-md shadow-inner overflow-hidden">
          {completed ? (
            <CheckCircle2
              size={24}
              className="text-emerald-300"
              aria-hidden="true"
            />
          ) : (
            <div className="h-10 w-10 flex items-center justify-center">
              {/* <DotLottieReact
                src="https://lottie.host/81f96409-51a8-4c33-87ec-5476d05f3215/k5yS0cByYk.lottie" // Energy/Lightning Lottie URL
                loop
                autoplay
              /> */}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold tracking-tight">
            {completed ? 'Today’s quiz done!' : 'Start Today’s 2-Min Quiz'}
          </p>
          <p className="mt-0.5 truncate text-xs text-purple-100/80">
            {completed
              ? `You scored ${completed.score}/${completed.totalQuestions}. Tap to review.`
              : '8 quick questions. Test your general knowledge.'}
          </p>
        </div>
        <div></div>

        {/* CTA Button */}
        <Link
          to={ROUTES.DAILY_QUIZ}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/30 bg-white/20 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-white/30 hover:scale-105 active:scale-95 focus-ring"
        >
          {completed ? 'Review' : 'Start'}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
      <div>
        <img src={readBookLottie} alt="Read Book" />
      </div>
      {/* Streak Footer with Fire Lottie Animation */}
      <div className="relative mt-3 flex items-center gap-2 rounded-xl bg-black/10 px-3 py-1.5 backdrop-blur-sm text-xs font-medium text-purple-100">
        <div className="h-5 w-5 shrink-0 flex items-center justify-center">
          {/* <DotLottieReact
            src="https://lottie.host/786a9f4c-21a4-4d87-9b2f-76d9101fbe54/v4YpE7r2e3.lottie" // Flame Lottie URL
            loop
            autoplay
          /> */}
          <img src={readBookLottie} alt="Read Book" />
        </div>
        {streak > 0 ? (
          <span>
            <strong className="text-amber-300 font-bold">
              {streak} day{streak === 1 ? '' : 's'}
            </strong>{' '}
            streak — keep it going!
          </span>
        ) : (
          <span>Complete today’s quiz to start a streak.</span>
        )}
      </div>
    </section>
  );
}
