import { cn } from '@/lib/utils';

export function CurrentAffairsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="Loading current affairs"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'flex animate-pulse flex-col overflow-hidden rounded-xl border',
            'border-white/20 bg-white/70 dark:border-gray-800/50 dark:bg-gray-900/70'
          )}
        >
          <div className="h-24 shrink-0 bg-gray-200 dark:bg-gray-700" />
          <div className="flex flex-1 flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
              <div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-10 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="h-5 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="border-t border-gray-200/60 px-5 py-3 dark:border-gray-800/60">
            <div className="h-5 w-32 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading current affairs briefings…</span>
    </div>
  );
}
