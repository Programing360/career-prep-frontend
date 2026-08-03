export function LeaderboardSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/20 bg-white/70 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
      <div className="flex items-center gap-2 border-b border-gray-200/60 px-4 py-3.5 dark:border-gray-800/60">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="ml-auto h-3 w-14 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="animate-pulse px-4 pt-3">
        <div className="flex items-center gap-2 border-b border-gray-100/70 pb-2.5 dark:border-gray-800/50">
          <div className="h-3 w-10 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="ml-auto h-3 w-10 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
      <ul>
        {Array.from({ length: rows }).map((_, i) => (
          <li
            key={i}
            className="flex h-14 animate-pulse items-center gap-3 border-b border-gray-100/70 px-4 last:border-0 dark:border-gray-800/50"
            aria-hidden="true"
          >
            <div className="h-7 w-7 shrink-0 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-9 w-9 shrink-0 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-32 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-2.5 w-24 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="h-4 w-12 rounded bg-gray-200 dark:bg-gray-700" />
          </li>
        ))}
      </ul>
    </div>
  );
}
