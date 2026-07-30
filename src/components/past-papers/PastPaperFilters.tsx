import { SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PastPaperFilterState, SourceType } from '@/types/pastPaper';

const years = Array.from({ length: 11 }, (_, i) => 2025 - i);

const subjects = [
  'All Subjects',
  'Essay',
  'General Knowledge',
  'Pakistan Affairs',
  'Islamic Studies',
  'English',
  'Mathematics',
  'Computer Science',
  'Physics',
  'Reasoning',
];

const paperTypes: {
  value: PastPaperFilterState['paperType'];
  label: string;
}[] = [
  { value: null, label: 'All Types' },
  { value: 'Prelims', label: 'Prelims' },
  { value: 'Mains', label: 'Mains' },
  { value: 'Full Test', label: 'Full Test' },
];

const sourceTypes: {
  value: SourceType | 'all';
  label: string;
}[] = [
  { value: 'all', label: 'All Sources' },
  { value: 'official', label: 'Official' },
  { value: 'licensed', label: 'Licensed' },
  { value: 'practice_equivalent', label: 'Practice' },
];

interface PastPaperFiltersProps {
  filters: PastPaperFilterState;
  onChange: (filters: PastPaperFilterState) => void;
  resultCount: number;
  totalCount: number;
}

function selectClasses(active = false) {
  return cn(
    'w-full appearance-none rounded-lg border px-3 py-2.5 pr-8 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/40',
    active
      ? 'border-primary-400 bg-primary-50 text-primary-700 dark:border-primary-600 dark:bg-primary-950 dark:text-primary-300'
      : 'border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'
  );
}

function labelClasses() {
  return 'block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5';
}

export function PastPaperFilters({
  filters,
  onChange,
  resultCount,
  totalCount,
}: PastPaperFiltersProps) {
  const activeFilterCount =
    (filters.year != null ? 1 : 0) +
    (filters.subject != null ? 1 : 0) +
    (filters.paperType != null ? 1 : 0) +
    (filters.sourceType != null ? 1 : 0);

  function update<K extends keyof PastPaperFilterState>(
    key: K,
    value: PastPaperFilterState[K]
  ) {
    onChange({ ...filters, [key]: value });
  }

  function resetAll() {
    onChange({
      year: null,
      subject: null,
      paperType: null,
      sourceType: null,
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            size={16}
            className="text-gray-400 dark:text-gray-500"
          />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            Filters
          </span>
          {activeFilterCount > 0 && (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={resetAll}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <X size={12} />
            Reset Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className={labelClasses()}>Year</label>
          <div className="relative">
            <select
              value={filters.year ?? ''}
              onChange={(e) =>
                update('year', e.target.value ? Number(e.target.value) : null)
              }
              className={cn(
                selectClasses(filters.year != null),
                'cursor-pointer'
              )}
            >
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className={labelClasses()}>Subject</label>
          <div className="relative">
            <select
              value={filters.subject ?? 'All Subjects'}
              onChange={(e) =>
                update(
                  'subject',
                  e.target.value === 'All Subjects' ? null : e.target.value
                )
              }
              className={cn(
                selectClasses(filters.subject != null),
                'cursor-pointer'
              )}
            >
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className={labelClasses()}>Paper Type</label>
          <div className="relative">
            <select
              value={filters.paperType ?? ''}
              onChange={(e) =>
                update(
                  'paperType',
                  (e.target.value || null) as PastPaperFilterState['paperType']
                )
              }
              className={cn(
                selectClasses(filters.paperType != null),
                'cursor-pointer'
              )}
            >
              {paperTypes.map((t) => (
                <option key={t.label} value={t.value ?? ''}>
                  {t.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className={labelClasses()}>Source</label>
          <div className="relative">
            <select
              value={filters.sourceType ?? 'all'}
              onChange={(e) =>
                update(
                  'sourceType',
                  (e.target.value === 'all'
                    ? null
                    : e.target.value) as SourceType | null
                )
              }
              className={cn(
                selectClasses(filters.sourceType != null),
                'cursor-pointer'
              )}
            >
              {sourceTypes.map((s) => (
                <option key={s.label} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Showing{' '}
        <span className="font-semibold text-gray-900 dark:text-white">
          {resultCount}
        </span>{' '}
        of{' '}
        <span className="font-semibold text-gray-900 dark:text-white">
          {totalCount}
        </span>{' '}
        papers
      </p>
    </div>
  );
}
