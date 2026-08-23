import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  RefreshCcw,
  Sparkles,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { ExamCard } from '@/components/exams/ExamCard';
import {
  ExamFilters,
  type ExamFiltersState,
  type Jurisdiction,
  type PostGrade,
} from '@/components/exams/ExamFilters';
import { mapDirectoryExamToExamCard } from '@/components/exams/examCardData';
import type { ExamCardData } from '@/components/exams/examCardData';
import { CurrentAffairsCompactWidget } from '@/components/current-affairs/CurrentAffairsCompactWidget';
import { DailyQuizCompactWidget } from '@/components/daily-quiz/DailyQuizCompactWidget';
import { getPublicExams } from '@/services/examService';
import examLottie from '../../assets/exam student.svg';

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 300;

const initialFilters: ExamFiltersState = {
  search: '',
  jurisdiction: 'all',
  postGrade: 'all',
};

/** Map the filter UI jurisdiction values onto the backend `category` enum. */
const jurisdictionToCategory: Record<
  Exclude<Jurisdiction, 'all'>,
  'federal' | 'provincial' | 'armed_forces' | 'testing_service'
> = {
  federal: 'federal',
  provincial: 'provincial',
  'testing-services': 'testing_service',
  'armed-forces': 'armed_forces',
};

const postGradeToBps: Record<Exclude<PostGrade, 'all'>, number> = {
  'bps-11': 11,
  'bps-12': 12,
  'bps-13': 13,
  'bps-14': 14,
  'bps-15': 15,
  'bps-16': 16,
  'bps-17': 17,
};

const categoryToJurisdiction: Record<string, Jurisdiction> = {
  federal: 'federal',
  provincial: 'provincial',
  testing_service: 'testing-services',
  testing_services: 'testing-services',
  'testing-services': 'testing-services',
  armed_forces: 'armed-forces',
  'armed-forces': 'armed-forces',
};

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function SkeletonCard() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/40 bg-white/50 dark:border-slate-800/60 dark:bg-slate-900/40 backdrop-blur-xl shadow-lg">
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between">
          <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200/80 dark:bg-slate-800" />
          <div className="h-4 w-16 animate-pulse rounded bg-slate-200/80 dark:bg-slate-800" />
        </div>
        <div className="mt-4 h-6 w-5/6 animate-pulse rounded bg-slate-200/80 dark:bg-slate-800" />
        <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-slate-200/80 dark:bg-slate-800" />
        <div className="mt-4 flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-lg bg-slate-200/80 dark:bg-slate-800" />
          <div className="h-6 w-14 animate-pulse rounded-lg bg-slate-200/80 dark:bg-slate-800" />
          <div className="h-6 w-12 animate-pulse rounded-lg bg-slate-200/80 dark:bg-slate-800" />
        </div>
      </div>
      <div className="border-t border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="h-9 w-full animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800" />
      </div>
    </div>
  );
}

export default function ExamCategoriesPage() {
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState<ExamFiltersState>(() => ({
    search: searchParams.get('search') ?? '',
    jurisdiction:
      categoryToJurisdiction[searchParams.get('category') ?? ''] ?? 'all',
    postGrade: 'all',
  }));

  const debouncedSearch = useDebounce(filters.search, SEARCH_DEBOUNCE_MS);

  const [exams, setExams] = useState<ExamCardData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pageRef = useRef(1);
  const isFetchingRef = useRef(false);
  const fetchTokenRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasMore = exams.length < totalCount;

  const fetchPage = useCallback(
    async (page: number, replace: boolean) => {
      if (isFetchingRef.current && !replace) return;
      isFetchingRef.current = true;
      const token = ++fetchTokenRef.current;

      try {
        const params: Record<string, string | number> = {
          page,
          limit: PAGE_SIZE,
        };
        const trimmedSearch = debouncedSearch.trim();
        if (trimmedSearch) params.search = trimmedSearch;
        if (filters.jurisdiction !== 'all') {
          params.category = jurisdictionToCategory[filters.jurisdiction];
        }
        if (filters.postGrade !== 'all') {
          params.bps = postGradeToBps[filters.postGrade];
        }

        const response = await getPublicExams(params);
        if (token !== fetchTokenRef.current) return;
        const cards = response.data.map(mapDirectoryExamToExamCard);

        setExams((prev) => (replace ? cards : [...prev, ...cards]));
        setTotalCount(response.meta.total);
        setError(null);
        pageRef.current = page;
      } catch {
        if (token !== fetchTokenRef.current) return;
        if (replace) {
          setExams([]);
          setTotalCount(0);
        }
        setError('Failed to load exams. Please try again.');
      } finally {
        if (token === fetchTokenRef.current) {
          isFetchingRef.current = false;
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [debouncedSearch, filters.jurisdiction, filters.postGrade]
  );

  // Reload from page 1 whenever the (debounced) filters change.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchPage(1, true);
  }, [fetchPage]);

  // Infinite scroll sentinel.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingRef.current) {
          setIsLoadingMore(true);
          void fetchPage(pageRef.current + 1, false);
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, fetchPage]);

  const handleFilterChange = useCallback((next: ExamFiltersState) => {
    setIsLoading(true);
    setFilters(next);
  }, []);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    void fetchPage(1, true);
  }, [fetchPage]);

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors">
      {/* Background Glow Accents */}
      <div className="pointer-events-none absolute -top-10 -left-10 h-96 w-96 rounded-full bg-purple-600/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-fuchsia-600/15 blur-3xl" />

      {/* Header Banner */}
      <section className="relative border-b border-white/40 dark:border-purple-500/20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg shadow-purple-950/5">
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-10 md:gap-28 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 dark:border-purple-800/50 bg-purple-50/80 dark:bg-purple-950/50 px-3 py-1 text-xs font-semibold text-purple-600 dark:text-purple-300 backdrop-blur-sm mb-4">
              <Sparkles size={12} /> Competitive Examination Hub
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
              Exam{' '}
              <span className="text-purple-600 dark:text-purple-400">
                Categories
              </span>
            </h1>
            <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg leading-relaxed">
              Browse all available government exams across federal, provincial,
              and testing services. Filter by jurisdiction, grade, and sector.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3.5 py-1.5 font-semibold text-slate-700 dark:text-slate-300 backdrop-blur-md shadow-sm">
                <BookOpen size={13} className="text-purple-500" />
                {totalCount.toLocaleString()} Exams Available
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3.5 py-1.5 font-semibold text-slate-700 dark:text-slate-300 backdrop-blur-md shadow-sm">
                <CheckCircle2 size={13} className="text-emerald-500" />
                {totalCount.toLocaleString()} Verified Tests
              </span>
            </div>
          </motion.div>
          <img
            data-aos="zoom-in"
            className="max-w-96"
            src={examLottie}
            alt="exam image"
          />
        </div>
      </section>

      {/* Main Body */}
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 pb-8 lg:grid-cols-3">
          <DailyQuizCompactWidget className="lg:col-span-1" />
          <CurrentAffairsCompactWidget className="lg:col-span-2" />
        </div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <ExamFilters
              filters={filters}
              onChange={handleFilterChange}
              resultCount={exams.length}
              totalCount={totalCount}
            />
          </motion.div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error && exams.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-white/50 dark:border-purple-500/20 bg-white/40 dark:bg-slate-900/40 py-20 backdrop-blur-xl shadow-xl text-center px-4"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 mb-4">
                <BookOpen size={32} />
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                Couldn't Load Exams
              </p>
              <p className="mt-1 max-w-md text-sm text-slate-600 dark:text-slate-400">
                {error}
              </p>
              <button
                onClick={handleRetry}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:bg-purple-700 hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
              >
                <RefreshCcw size={15} />
                Try Again
              </button>
            </motion.div>
          ) : exams.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-white/50 dark:border-purple-500/20 bg-white/40 dark:bg-slate-900/40 py-20 backdrop-blur-xl shadow-xl text-center px-4"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 mb-4">
                <BookOpen size={32} />
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                No Exams Found
              </p>
              <p className="mt-1 max-w-md text-sm text-slate-600 dark:text-slate-400">
                No exams match your current filter criteria. Try expanding your
                search options or clearing filters.
              </p>
              <button
                onClick={() => setFilters(initialFilters)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:bg-purple-700 hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
              >
                <RefreshCcw size={15} />
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <>
              <motion.div
                key={`${filters.jurisdiction}-${filters.postGrade}-${debouncedSearch}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                <AnimatePresence mode="popLayout">
                  {exams.map((exam) => (
                    <ExamCard key={exam.id} exam={exam} />
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Infinite scroll sentinel */}
              <div
                ref={sentinelRef}
                className="flex items-center justify-center py-8"
              >
                {isLoadingMore && (
                  <Loader2 size={20} className="animate-spin text-purple-500" />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
