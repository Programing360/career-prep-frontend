import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Crown,
  Medal,
  RefreshCcw,
  Trophy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import {
  getLeaderboard,
  MOCK_LEADERBOARD_EXAMS,
} from '@/services/leaderboardService';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { LeaderboardFilterBar } from '@/components/leaderboard/LeaderboardFilterBar';
import { LeaderboardSkeleton } from '@/components/leaderboard/LeaderboardSkeleton';
import type {
  LeaderboardPaginatedResponse,
  LeaderboardTimeWindow,
} from '@/types/leaderboard';

const DEFAULT_LIMIT = 20;

const TIME_WINDOW_LABELS: Record<LeaderboardTimeWindow, string> = {
  daily: 'today',
  weekly: 'this week',
  all_time: 'all time',
};

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [examSlug, setExamSlug] = useState('fpsc-css-2025');
  const [timeWindow, setTimeWindow] = useState<LeaderboardTimeWindow>('weekly');
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState<LeaderboardPaginatedResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getLeaderboard({
        examSlug,
        timeWindow,
        page,
        limit: DEFAULT_LIMIT,
      });
      setResponse(res);
    } catch {
      setResponse(null);
      setError('Unable to load the leaderboard. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [examSlug, timeWindow, page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLeaderboard();
  }, [fetchLeaderboard, reloadKey]);

  const handleExamChange = useCallback((nextExamSlug: string) => {
    setExamSlug(nextExamSlug);
    setPage(1);
  }, []);

  const handleTimeWindowChange = useCallback(
    (nextTimeWindow: LeaderboardTimeWindow) => {
      setTimeWindow(nextTimeWindow);
      setPage(1);
    },
    []
  );

  const currentUserId = user?.id ?? null;
  const entries = response?.data ?? [];
  const currentUserOnPage = entries.some(
    (entry) => entry.isCurrentUser || entry.userId === currentUserId
  );
  const showRankBar =
    !loading &&
    !error &&
    response !== null &&
    response.currentUserRank !== null &&
    !currentUserOnPage;

  const jumpToMyRank = useCallback(() => {
    if (!response?.currentUserRank) return;
    setPage(Math.max(1, Math.ceil(response.currentUserRank / DEFAULT_LIMIT)));
  }, [response]);

  const activeExamTitle =
    MOCK_LEADERBOARD_EXAMS.find((exam) => exam.slug === examSlug)?.title ??
    examSlug;

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden border-b border-white/20 bg-white/70 backdrop-blur-md shadow-sm dark:border-gray-800/50 dark:bg-gray-900/70">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-400/10 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
            >
              <Link
                to={ROUTES.HOME}
                className="hover:text-gray-700 dark:hover:text-gray-200"
              >
                Home
              </Link>
              <ChevronRight size={12} aria-hidden="true" />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Leaderboard
              </span>
            </nav>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-950">
                <Trophy
                  size={22}
                  className="text-primary-600 dark:text-primary-400"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                  Leaderboard
                </h1>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                  See where you stand against top performers {activeExamTitle}
                </p>
              </div>
            </div>

            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-[11px] font-semibold text-primary-700 dark:bg-primary-950/60 dark:text-primary-300">
              <Medal size={12} aria-hidden="true" />
              Ranked by total score Â· updated in real time
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <LeaderboardFilterBar
          exams={MOCK_LEADERBOARD_EXAMS}
          examSlug={examSlug}
          timeWindow={timeWindow}
          onExamChange={handleExamChange}
          onTimeWindowChange={handleTimeWindowChange}
          resultCount={response?.data.length}
          totalCount={response?.total}
        />

        <div className="mt-6">
          {loading ? (
            <LeaderboardSkeleton rows={10} />
          ) : error ? (
            <div className="rounded-xl border border-white/20 bg-white/70 px-6 py-12 text-center backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
              <RefreshCcw
                size={32}
                className="mx-auto text-gray-300 dark:text-gray-600"
                aria-hidden="true"
              />
              <p className="mt-3 text-sm font-medium text-gray-900 dark:text-white">
                {error}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setReloadKey((k) => k + 1)}
              >
                Try Again
              </Button>
            </div>
          ) : entries.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-white/20 bg-white/70 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
              <div className="flex items-center justify-between gap-3 border-b border-gray-200/60 px-4 py-3 dark:border-gray-800/60">
                <h2 className="flex items-center gap-1.5 text-sm font-bold font-heading text-gray-900 dark:text-white">
                  <Crown
                    size={14}
                    className="text-primary-500"
                    aria-hidden="true"
                  />
                  Top Candidates
                </h2>
                <span className="text-xs font-medium capitalize text-gray-500 dark:text-gray-400">
                  {TIME_WINDOW_LABELS[timeWindow]}
                </span>
              </div>
              <LeaderboardTable
                entries={entries}
                currentUserId={currentUserId}
              />

              <div className="flex items-center justify-between gap-3 border-t border-gray-200/60 px-4 py-3 dark:border-gray-800/60">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  leftIcon={<ArrowLeft size={14} aria-hidden="true" />}
                >
                  Previous
                </Button>
                <p className="text-xs font-medium tabular-nums text-gray-500 dark:text-gray-400">
                  Page{' '}
                  <span className="font-bold text-gray-900 dark:text-white">
                    {response?.page ?? 1}
                  </span>{' '}
                  of{' '}
                  <span className="font-bold text-gray-900 dark:text-white">
                    {response?.totalPages ?? 1}
                  </span>
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!response || page >= response.totalPages}
                  onClick={() =>
                    setPage((p) => Math.min(response?.totalPages ?? p, p + 1))
                  }
                  rightIcon={<ArrowRight size={14} aria-hidden="true" />}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-white/20 bg-white/70 px-6 py-12 text-center backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
              <Trophy
                size={32}
                className="mx-auto text-gray-300 dark:text-gray-600"
                aria-hidden="true"
              />
              <h2 className="mt-3 text-base font-bold font-heading text-gray-900 dark:text-white">
                No candidates yet
              </h2>
              <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                Take a mock test to be the first name on this board.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setReloadKey((k) => k + 1)}
              >
                Refresh
              </Button>
            </div>
          )}
        </div>
      </div>

      {showRankBar && response?.currentUserRank != null && (
        <div className="sticky bottom-0 z-30 px-4 pb-3 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={cn(
                'flex items-center justify-between gap-3 rounded-xl border border-emerald-500/40 px-4 py-3 shadow-lg',
                'bg-emerald-50/95 backdrop-blur-md dark:bg-emerald-950/90'
              )}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-extrabold text-white">
                  #{response.currentUserRank}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-emerald-900 dark:text-emerald-100">
                    You are ranked #{response.currentUserRank}
                  </p>
                  <p className="truncate text-[11px] text-emerald-700 dark:text-emerald-300">
                    {activeExamTitle} Â· {TIME_WINDOW_LABELS[timeWindow]}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={jumpToMyRank}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 focus-ring"
              >
                Jump to my rank
                <ArrowRight size={13} aria-hidden="true" />
              </button>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
