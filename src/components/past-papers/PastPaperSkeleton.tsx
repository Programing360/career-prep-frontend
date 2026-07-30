import { cn } from '@/lib/utils';

export function PastPaperSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'flex animate-pulse flex-col rounded-xl border',
            'border-white/20 bg-white/70 dark:border-gray-800/50 dark:bg-gray-900/70'
          )}
        >
          <div className="flex flex-1 flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
              <div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-14 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="h-5 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="flex flex-wrap gap-2">
              <div className="h-5 w-12 rounded-md bg-gray-200 dark:bg-gray-700" />
              <div className="h-5 w-20 rounded-md bg-gray-200 dark:bg-gray-700" />
              <div className="h-5 w-16 rounded-md bg-gray-200 dark:bg-gray-700" />
              <div className="h-5 w-14 rounded-md bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
          <div className="border-t border-gray-200/60 px-5 py-3 dark:border-gray-800/60">
            <div className="h-8 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      ))}
    </div>
  );
}
