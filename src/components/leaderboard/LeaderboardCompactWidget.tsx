import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { getLeaderboard } from '@/services/leaderboardService';
import type {
  LeaderboardEntry,
  LeaderboardPaginatedResponse,
} from '@/types/leaderboard';

interface LeaderboardCompactWidgetProps {
  examSlug: string;
  examTitle?: string;
  className?: string;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

const TOP_PLACEMENTS: Record<number, string> = {
  1: 'from-amber-300 to-yellow-500 text-amber-950',
  2: 'from-slate-200 to-slate-400 text-slate-900',
  3: 'from-orange-300 to-amber-600 text-orange-950',
};

function RowSkeleton() {
  return (
    <li
      className="flex h-12 items-center gap-3 animate-pulse"
      aria-hidden="true"
    >
      <div className="h-7 w-7 shrink-0 rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="h-9 w-9 shrink-0 rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-28 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-2.5 w-20 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="h-4 w-10 rounded bg-gray-200 dark:bg-gray-700" />
    </li>
  );
}

export function LeaderboardCompactWidget({
  examSlug,
  examTitle,
  className,
}: LeaderboardCompactWidgetProps) {
  const [response, setResponse] = useState<LeaderboardPaginatedResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getLeaderboard({ examSlug, timeWindow: 'weekly', page: 1, limit: 10 })
      .then((res) => {
        if (!active) return;
        setResponse(res);
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setResponse(null);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [examSlug]);

  const topThree: LeaderboardEntry[] = response?.data.slice(0, 3) ?? [];
  const currentUserRank = response?.currentUserRank ?? null;

  return (
    <section
      aria-label="Leaderboard"
      className={cn(
        'overflow-hidden rounded-xl border border-white/20 bg-white/70 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70',
        className
      )}
    >
      <header className="flex items-center justify-between gap-2 border-b border-gray-200/60 px-4 py-3 dark:border-gray-800/60">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950">
            <Trophy
              size={14}
              className="text-amber-600 dark:text-amber-400"
              aria-hidden="true"
            />
          </span>
          <h2 className="truncate text-sm font-bold font-heading text-gray-900 dark:text-white">
            Top Performers
          </h2>
        </div>
        <Link
          to={ROUTES.LEADERBOARD}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 focus-ring dark:text-primary-400 dark:hover:text-primary-300"
        >
          View all
          <ArrowRight size={12} aria-hidden="true" />
        </Link>
      </header>

      {loading ? (
        <ul className="px-4 py-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <RowSkeleton key={i} />
          ))}
        </ul>
      ) : topThree.length > 0 ? (
        <ul className="divide-y divide-gray-100/70 px-4 dark:divide-gray-800/50">
          {topThree.map((entry) => {
            const placement = TOP_PLACEMENTS[entry.rank] ?? '';
            return (
              <li key={entry.userId} className="flex h-14 items-center gap-3">
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[11px] font-extrabold ring-1 ring-white/40',
                    placement
                  )}
                >
                  {entry.rank}
                </span>
                {entry.avatarUrl ? (
                  <img
                    src={entry.avatarUrl}
                    alt={`${entry.displayName} avatar`}
                    className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white/40 dark:ring-gray-700"
                  />
                ) : (
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 ring-2 ring-white/40 dark:bg-primary-900 dark:text-primary-300 dark:ring-gray-700"
                    aria-hidden="true"
                  >
                    {initials(entry.displayName)}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {entry.displayName}
                  </p>
                  <p className="truncate text-[10px] text-gray-400 dark:text-gray-500">
                    {entry.accuracyPercentage}% accuracy
                  </p>
                </div>
                <span className="shrink-0 text-sm font-extrabold tabular-nums text-gray-900 dark:text-white">
                  {entry.score.toLocaleString()}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="px-4 py-6 text-center text-xs text-gray-500 dark:text-gray-400">
          No leaderboard data yet. Be the first to compete!
        </p>
      )}

      <footer className="border-t border-gray-200/60 px-4 py-3 dark:border-gray-800/60">
        {currentUserRank ? (
          <p className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300">
            <Flame size={13} className="text-orange-500" aria-hidden="true" />
            Your rank is{' '}
            <span className="font-extrabold text-primary-600 dark:text-primary-400">
              #{currentUserRank}
            </span>{' '}
            {examTitle ? `in ${examTitle}` : 'this week'}
          </p>
        ) : (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Take a mock test to get ranked.
          </p>
        )}
      </footer>
    </section>
  );
}
