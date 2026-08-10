import { cn } from '@/lib/utils';
import type { LeaderboardEntry } from '@/types/leaderboard';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string | null;
  compact?: boolean;
}

const RANK_BADGES: Record<number, { label: string; className: string }> = {
  1: {
    label: '1st',
    className:
      'bg-gradient-to-br from-primary-300 to-primary-500 text-primary-950 ring-primary-400/60',
  },
  2: {
    label: '2nd',
    className:
      'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900 ring-slate-400/60',
  },
  3: {
    label: '3rd',
    className:
      'bg-gradient-to-br from-primary-300 to-primary-600 text-primary-950 ring-primary-400/60',
  },
};

const RANK_BADGE_ICONS: Record<number, string> = {
  1: '\u{1F947}',
  2: '\u{1F948}',
  3: '\u{1F949}',
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return `${seconds}s`;
}

function Avatar({
  entry,
  size = 'md',
}: {
  entry: LeaderboardEntry;
  size?: 'md' | 'lg';
}) {
  const base =
    'flex shrink-0 items-center justify-center rounded-full font-bold ring-2';
  const sizeClasses = size === 'lg' ? 'h-10 w-10 text-sm' : 'h-9 w-9 text-xs';
  const tone = entry.isCurrentUser
    ? 'bg-emerald-100 text-emerald-700 ring-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-700'
    : 'bg-primary-100 text-primary-700 ring-primary-200 dark:bg-primary-900 dark:text-primary-300 dark:ring-primary-800';

  if (entry.avatarUrl) {
    return (
      <img
        src={entry.avatarUrl}
        alt={`${entry.displayName} avatar`}
        className={cn(base, sizeClasses, 'object-cover')}
      />
    );
  }

  return (
    <span className={cn(base, sizeClasses, tone)} aria-hidden="true">
      {initials(entry.displayName)}
    </span>
  );
}

function RankCell({ rank }: { rank: number }) {
  if (rank <= 3) {
    const badge = RANK_BADGES[rank];
    return (
      <span
        className={cn(
          'inline-flex h-7 min-w-7 items-center justify-center gap-1 rounded-full px-1.5 text-[11px] font-extrabold ring-1',
          badge.className
        )}
        title={badge.label}
      >
        <span aria-hidden="true">{RANK_BADGE_ICONS[rank]}</span>
        <span className="sr-only">{badge.label}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center text-sm font-bold tabular-nums text-gray-500 dark:text-gray-400">
      {rank}
    </span>
  );
}

export function LeaderboardTable({
  entries,
  currentUserId,
  compact = false,
}: LeaderboardTableProps) {
  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">Leaderboard ranked by score</caption>
      <thead>
        <tr className="border-b border-gray-200/70 text-[10px] uppercase tracking-wider text-gray-400 dark:border-gray-800/70 dark:text-gray-500">
          <th scope="col" className="px-3 py-2.5 font-semibold">
            Rank
          </th>
          <th scope="col" className="px-3 py-2.5 font-semibold">
            Candidate
          </th>
          <th scope="col" className="px-3 py-2.5 text-right font-semibold">
            Score
          </th>
          {!compact && (
            <th
              scope="col"
              className="hidden px-3 py-2.5 text-right font-semibold sm:table-cell"
            >
              Time
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => {
          const isMe = entry.isCurrentUser || entry.userId === currentUserId;
          return (
            <tr
              key={entry.userId}
              className={cn(
                'border-b border-gray-100/70 transition-colors last:border-0 dark:border-gray-800/50',
                isMe
                  ? 'bg-emerald-50/80 shadow-[0_0_0_1px_rgba(16,185,129,0.35),0_4px_20px_-6px_rgba(16,185,129,0.35)] dark:bg-emerald-950/40'
                  : 'hover:bg-gray-50/80 dark:hover:bg-gray-800/40'
              )}
            >
              <td className="px-3 py-3">
                <RankCell rank={entry.rank} />
              </td>
              <td className="px-3 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar entry={entry} />
                  <div className="min-w-0">
                    <p
                      className={cn(
                        'truncate text-sm font-semibold',
                        isMe
                          ? 'text-emerald-800 dark:text-emerald-200'
                          : 'text-gray-800 dark:text-gray-200'
                      )}
                    >
                      {isMe && entry.displayName === 'You'
                        ? 'You'
                        : entry.displayName}
                    </p>
                    <p className="truncate text-[10px] text-gray-400 dark:text-gray-500">
                      {entry.accuracyPercentage}% accuracy Â·{' '}
                      {entry.totalTestsTaken} tests
                    </p>
                    {isMe && (
                      <span className="mt-0.5 inline-flex items-center rounded-full bg-emerald-500 px-2 py-px text-[9px] font-bold uppercase tracking-wide text-white">
                        You
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-3 py-3 text-right">
                <span className="text-sm font-extrabold tabular-nums text-gray-900 dark:text-white">
                  {entry.score.toLocaleString()}
                </span>
              </td>
              {!compact && (
                <td className="hidden px-3 py-3 text-right sm:table-cell">
                  <span className="text-xs font-medium tabular-nums text-gray-500 dark:text-gray-400">
                    {formatDuration(entry.timeSpentSeconds)}
                  </span>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
