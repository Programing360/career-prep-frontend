import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  ChevronRight,
  FileSearch,
  Newspaper,
  RefreshCcw,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/Button';
import { toDateKey, formatDate } from '@/utils/dateHelpers';
import {
  getCurrentAffairs,
  getCurrentAffairsCategories,
  type CurrentAffairsPaginatedResponse,
} from '@/services/currentAffairsService';
import { CurrentAffairsCard } from '@/components/current-affairs/CurrentAffairsCard';
import { CurrentAffairsFilterBar } from '@/components/current-affairs/CurrentAffairsFilterBar';
import { CurrentAffairsSkeleton } from '@/components/current-affairs/CurrentAffairsSkeleton';
import type { CurrentAffairsFilter } from '@/types/currentAffairs';

function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

export default function CurrentAffairsPage() {
  const todayKey = useMemo(() => toDateKey(new Date()), []);

  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [filters, setFilters] = useState<CurrentAffairsFilter>({
    category: null,
    date: todayKey,
    searchQuery: null,
    page: 1,
    limit: 9,
  });
  const [response, setResponse] =
    useState<CurrentAffairsPaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    getCurrentAffairsCategories().then((cats) => {
      if (active) setCategories(cats);
    });
    return () => {
      active = false;
    };
  }, []);

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCurrentAffairs({
        category: filters.category,
        date: filters.date,
        searchQuery: debouncedSearch || null,
        page: 1,
        limit: filters.limit ?? 9,
      });
      setResponse(res);
    } catch {
      setResponse(null);
      setError('Unable to load current affairs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.date, debouncedSearch, filters.limit]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFeed();
  }, [fetchFeed, reloadKey]);

  const handleFilterChange = useCallback((next: CurrentAffairsFilter) => {
    setFilters(next);
  }, []);

  const handleClearAll = useCallback(() => {
    setSearch('');
    setFilters({
      category: null,
      date: null,
      searchQuery: null,
      page: 1,
      limit: 9,
    });
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (!response || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await getCurrentAffairs({
        category: filters.category,
        date: filters.date,
        searchQuery: debouncedSearch || null,
        page: response.page + 1,
        limit: filters.limit ?? 9,
      });
      setResponse((prev) =>
        prev ? { ...res, data: [...prev.data, ...res.data] } : res
      );
    } finally {
      setLoadingMore(false);
    }
  }, [
    response,
    loadingMore,
    filters.category,
    filters.date,
    debouncedSearch,
    filters.limit,
  ]);

  const hasActiveFilters = Boolean(filters.category || filters.date || search);

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
                Current Affairs
              </span>
            </nav>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900">
                <Newspaper
                  size={22}
                  className="text-primary-600 dark:text-primary-400"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                  Current Affairs
                </h1>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                  Daily briefings sourced from trusted Pakistani &amp;
                  international publications.
                </p>
              </div>
            </div>

            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              <ShieldCheck size={12} aria-hidden="true" />
              Sourced from Dawn, APP &amp; leading wire services with full
              attribution
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative mb-4">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search current affairs…"
            aria-label="Search current affairs"
            className="w-full rounded-lg border border-white/20 bg-white/70 py-2.5 pl-10 pr-9 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus-ring dark:border-gray-800/50 dark:bg-gray-900/70 dark:text-gray-100 dark:placeholder:text-gray-500"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-gray-400 transition-colors hover:text-gray-700 focus-ring dark:text-gray-500 dark:hover:text-gray-200"
            >
              <X size={15} aria-hidden="true" />
            </button>
          )}
        </div>

        <CurrentAffairsFilterBar
          categories={categories}
          filters={filters}
          onChange={handleFilterChange}
        />

        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {response?.data.length ?? 0}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {response?.total ?? 0}
            </span>{' '}
            briefings
            {filters.date && (
              <>
                {' '}
                for{' '}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatDate(filters.date)}
                </span>
              </>
            )}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              <X size={12} aria-hidden="true" />
              Clear filters
            </button>
          )}
        </div>

        <div className="mt-6">
          {loading ? (
            <CurrentAffairsSkeleton count={9} />
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
          ) : response && response.data.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {response.data.map((item) => (
                <CurrentAffairsCard key={item.id} item={item} />
              ))}
            </motion.div>
          ) : (
            <div className="rounded-xl border border-white/20 bg-white/70 px-6 py-12 text-center backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
              <FileSearch
                size={32}
                className="mx-auto text-gray-300 dark:text-gray-600"
                aria-hidden="true"
              />
              <h2 className="mt-3 text-base font-bold font-heading text-gray-900 dark:text-white">
                No briefings found
              </h2>
              <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                Try adjusting the date, category or search term to see more
                results.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className={cn(
                    'mt-4 inline-flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2 text-xs font-semibold text-primary-600 transition-colors',
                    'hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-950'
                  )}
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {response && response.page < response.totalPages && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                isLoading={loadingMore}
                leftIcon={<ArrowDown size={14} aria-hidden="true" />}
              >
                Load More Briefings
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
