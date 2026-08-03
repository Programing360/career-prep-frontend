export function DailyQuizSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl animate-pulse" aria-hidden="true">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full bg-gray-200 dark:bg-gray-800"
          />
        ))}
        <div className="h-3 w-8 rounded bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="mt-6 rounded-2xl border border-white/20 bg-white/70 p-5 backdrop-blur-md sm:p-6 dark:border-gray-800/50 dark:bg-gray-900/70">
        <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="mt-2 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="mt-5 space-y-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-white/20 px-4 py-3.5 dark:border-gray-800/50"
            >
              <div className="h-7 w-7 rounded-md bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 flex-1 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
