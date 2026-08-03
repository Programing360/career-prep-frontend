import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  LeaderboardExamOption,
  LeaderboardTimeWindow,
} from '@/types/leaderboard';

interface LeaderboardFilterBarProps {
  exams: LeaderboardExamOption[];
  examSlug: string;
  timeWindow: LeaderboardTimeWindow;
  onExamChange: (examSlug: string) => void;
  onTimeWindowChange: (timeWindow: LeaderboardTimeWindow) => void;
  resultCount?: number;
  totalCount?: number;
}

const TIME_WINDOWS: { value: LeaderboardTimeWindow; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'all_time', label: 'All Time' },
];

export function LeaderboardFilterBar({
  exams,
  examSlug,
  timeWindow,
  onExamChange,
  onTimeWindowChange,
  resultCount,
  totalCount,
}: LeaderboardFilterBarProps) {
  return (
    <div className="rounded-xl border border-white/20 bg-white/70 p-4 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div role="group" aria-label="Leaderboard time window">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <Trophy size={12} aria-hidden="true" />
            Time Window
          </p>
          <div className="flex rounded-lg border border-white/20 bg-white/70 p-1 dark:border-gray-800/50 dark:bg-gray-900/70">
            {TIME_WINDOWS.map((window) => (
              <button
                key={window.value}
                type="button"
                aria-pressed={timeWindow === window.value}
                onClick={() => onTimeWindowChange(window.value)}
                className={cn(
                  'flex-1 rounded-md px-4 py-2 text-xs font-semibold transition-all focus-ring',
                  timeWindow === window.value
                    ? 'bg-primary-500 text-white shadow-sm dark:bg-primary-600'
                    : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                )}
              >
                {window.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="leaderboard-exam"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
          >
            Exam Category
          </label>
          <select
            id="leaderboard-exam"
            value={examSlug}
            onChange={(e) => onExamChange(e.target.value)}
            className="w-full cursor-pointer rounded-lg border border-white/20 bg-white/70 py-2.5 pl-3 pr-8 text-sm font-medium text-gray-900 transition-colors focus-ring sm:w-64 dark:border-gray-800/50 dark:bg-gray-900/70 dark:text-gray-100"
          >
            {exams.map((exam) => (
              <option key={exam.slug} value={exam.slug}>
                {exam.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {typeof resultCount === 'number' && typeof totalCount === 'number' && (
        <p className="mt-4 border-t border-gray-200/60 pt-3 text-xs text-gray-500 dark:border-gray-800/60 dark:text-gray-400">
          Showing{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {resultCount}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {totalCount}
          </span>{' '}
          candidates
        </p>
      )}
    </div>
  );
}
