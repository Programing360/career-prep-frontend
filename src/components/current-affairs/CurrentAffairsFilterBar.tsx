import { Calendar, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toDateKey } from '@/utils/dateHelpers';
import type { CurrentAffairsFilter } from '@/types/currentAffairs';

interface CurrentAffairsFilterBarProps {
  categories: string[];
  filters: CurrentAffairsFilter;
  onChange: (filters: CurrentAffairsFilter) => void;
}

export function CurrentAffairsFilterBar({
  categories,
  filters,
  onChange,
}: CurrentAffairsFilterBarProps) {
  const todayKey = toDateKey(new Date());

  function selectCategory(category: string | null) {
    onChange({ ...filters, category, page: 1 });
  }

  function selectDate(date: string | null) {
    onChange({ ...filters, date, page: 1 });
  }

  return (
    <div className="rounded-xl border border-white/20 bg-white/70 p-4 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div role="group" aria-label="Filter current affairs by category">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Category
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => selectCategory(null)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-medium transition-all focus-ring',
                !filters.category
                  ? 'border-primary-400 bg-primary-500 text-white dark:border-primary-600'
                  : 'border-white/20 bg-white/70 text-gray-600 hover:border-primary-300 hover:bg-primary-50 dark:border-gray-800/50 dark:bg-gray-900/70 dark:text-gray-300 dark:hover:border-primary-700'
              )}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  selectCategory(
                    filters.category === category ? null : category
                  )
                }
                aria-pressed={filters.category === category}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-medium transition-all focus-ring',
                  filters.category === category
                    ? 'border-primary-400 bg-primary-500 text-white dark:border-primary-600'
                    : 'border-white/20 bg-white/70 text-gray-600 hover:border-primary-300 hover:bg-primary-50 dark:border-gray-800/50 dark:bg-gray-900/70 dark:text-gray-300 dark:hover:border-primary-700'
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="current-affairs-date"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
          >
            Date
          </label>
          <div className="relative">
            <Calendar
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              aria-hidden="true"
            />
            <input
              id="current-affairs-date"
              type="date"
              value={filters.date ?? ''}
              max={todayKey}
              onChange={(e) => selectDate(e.target.value || null)}
              className={cn(
                'cursor-pointer rounded-lg border bg-white/70 py-2.5 pl-9 pr-9 text-sm font-medium text-gray-900 transition-colors focus-ring dark:bg-gray-900/70 dark:text-gray-100',
                filters.date
                  ? 'border-primary-400 dark:border-primary-600'
                  : 'border-white/20 dark:border-gray-800/50'
              )}
            />
            {filters.date && (
              <button
                type="button"
                onClick={() => selectDate(null)}
                aria-label="Clear date filter"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-gray-400 transition-colors hover:text-gray-700 focus-ring dark:text-gray-500 dark:hover:text-gray-200"
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
