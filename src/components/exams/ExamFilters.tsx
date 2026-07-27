import { Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Jurisdiction =
  'all' | 'federal' | 'provincial' | 'testing-services' | 'armed-forces';

export type PostGrade =
  | 'all'
  | 'bps-11'
  | 'bps-12'
  | 'bps-13'
  | 'bps-14'
  | 'bps-15'
  | 'bps-16'
  | 'bps-17';

export type ExamSector =
  | 'all'
  | 'general-recruitment'
  | 'competitive'
  | 'uniformed-forces'
  | 'technical';

export type SortOption = 'popularity' | 'latest' | 'a-z';

export interface ExamFiltersState {
  search: string;
  jurisdiction: Jurisdiction;
  postGrade: PostGrade;
  sector: ExamSector;
  sort: SortOption;
}

const jurisdictions: { id: Jurisdiction; label: string }[] = [
  { id: 'all', label: 'All Jurisdictions' },
  { id: 'federal', label: 'Federal (FPSC)' },
  { id: 'provincial', label: 'Provincial (PPSC, KPPSC, BPSC, SPSC)' },
  { id: 'testing-services', label: 'Testing Services (NTS, OTS, PTS, ETEA)' },
  { id: 'armed-forces', label: 'Armed Forces & Police' },
];

const postGrades: { id: PostGrade; label: string }[] = [
  { id: 'all', label: 'All Grades' },
  { id: 'bps-11', label: 'BPS-11' },
  { id: 'bps-12', label: 'BPS-12' },
  { id: 'bps-13', label: 'BPS-13' },
  { id: 'bps-14', label: 'BPS-14' },
  { id: 'bps-15', label: 'BPS-15' },
  { id: 'bps-16', label: 'BPS-16' },
  { id: 'bps-17', label: 'BPS-17+' },
];

const sectors: { id: ExamSector; label: string }[] = [
  { id: 'all', label: 'All Sectors' },
  { id: 'general-recruitment', label: 'General Recruitment' },
  { id: 'competitive', label: 'Competitive Exams (CSS/PMS)' },
  { id: 'uniformed-forces', label: 'Uniformed Forces' },
  { id: 'technical', label: 'Technical / Specialized' },
];

const sortOptions: { id: SortOption; label: string }[] = [
  { id: 'popularity', label: 'Popularity' },
  { id: 'latest', label: 'Latest' },
  { id: 'a-z', label: 'A-Z' },
];

interface ExamFiltersProps {
  filters: ExamFiltersState;
  onChange: (filters: ExamFiltersState) => void;
  resultCount: number;
  totalCount: number;
}

function selectClasses(active: boolean = false) {
  return cn(
    'w-full appearance-none rounded-lg border px-3 py-2.5 pr-8 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/40',
    active
      ? 'border-primary-400 bg-primary-50 text-primary-700 dark:border-primary-600 dark:bg-primary-950 dark:text-primary-300'
      : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))]'
  );
}

function labelClasses() {
  return 'block text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))] mb-1.5';
}

export function ExamFilters({
  filters,
  onChange,
  resultCount,
  totalCount,
}: ExamFiltersProps) {
  const activeFilterCount =
    (filters.jurisdiction !== 'all' ? 1 : 0) +
    (filters.postGrade !== 'all' ? 1 : 0) +
    (filters.sector !== 'all' ? 1 : 0);

  function update<K extends keyof ExamFiltersState>(
    key: K,
    value: ExamFiltersState[K]
  ) {
    onChange({ ...filters, [key]: value });
  }

  function resetAll() {
    onChange({
      search: '',
      jurisdiction: 'all',
      postGrade: 'all',
      sector: 'all',
      sort: 'popularity',
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            size={16}
            className="text-[rgb(var(--color-text-muted))]"
          />
          <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
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
            Clear all
          </button>
        )}
      </div>

      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))]"
        />
        <input
          type="text"
          placeholder="Search by title or agency..."
          value={filters.search}
          onChange={(e) => update('search', e.target.value)}
          className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] py-2.5 pl-10 pr-4 text-sm text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-muted))] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className={labelClasses()}>Jurisdiction</label>
          <div className="relative">
            <select
              value={filters.jurisdiction}
              onChange={(e) =>
                update('jurisdiction', e.target.value as Jurisdiction)
              }
              className={cn(
                selectClasses(filters.jurisdiction !== 'all'),
                'cursor-pointer'
              )}
            >
              {jurisdictions.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))]">
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
          <label className={labelClasses()}>Post / Grade</label>
          <div className="relative">
            <select
              value={filters.postGrade}
              onChange={(e) => update('postGrade', e.target.value as PostGrade)}
              className={cn(
                selectClasses(filters.postGrade !== 'all'),
                'cursor-pointer'
              )}
            >
              {postGrades.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))]">
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
          <label className={labelClasses()}>Category / Sector</label>
          <div className="relative">
            <select
              value={filters.sector}
              onChange={(e) => update('sector', e.target.value as ExamSector)}
              className={cn(
                selectClasses(filters.sector !== 'all'),
                'cursor-pointer'
              )}
            >
              {sectors.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))]">
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
          <label className={labelClasses()}>Sort by</label>
          <div className="relative">
            <select
              value={filters.sort}
              onChange={(e) => update('sort', e.target.value as SortOption)}
              className={cn(selectClasses(), 'cursor-pointer')}
            >
              {sortOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))]">
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

      <p className="text-xs text-[rgb(var(--color-text-muted))]">
        Showing{' '}
        <span className="font-semibold text-[rgb(var(--color-text-primary))]">
          {resultCount}
        </span>{' '}
        of{' '}
        <span className="font-semibold text-[rgb(var(--color-text-primary))]">
          {totalCount}
        </span>{' '}
        exams
      </p>
    </div>
  );
}
