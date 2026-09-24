import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { ExamCard } from '@/components/exams/ExamCard';
import { mapDirectoryExamToExamCard } from '@/components/exams/examCardData';
import type { ExamCardData } from '@/components/exams/examCardData';
import { getPublicExams } from '@/services/examService';
import { ROUTES } from '@/constants/routes';

const FEATURED_COUNT = 8;

function FeaturedSkeletonCard() {
  return (
    <div className="flex h-[380px] w-[280px] shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/60 sm:w-[320px]">
      <div className="h-40 w-full animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80" />
      <div className="mt-4 h-6 w-3/4 animate-pulse rounded bg-slate-200/80 dark:bg-slate-800/80" />
      <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-slate-200/80 dark:bg-slate-800/80" />
      <div className="mt-auto flex gap-2">
        <div className="h-6 w-16 animate-pulse rounded-lg bg-slate-200/80 dark:bg-slate-800/80" />
        <div className="h-6 w-14 animate-pulse rounded-lg bg-slate-200/80 dark:bg-slate-800/80" />
      </div>
    </div>
  );
}

export default function FeaturedExams() {
  const [exams, setExams] = useState<ExamCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const loadFeatured = useCallback(async () => {
    try {
      const response = await getPublicExams({
        limit: FEATURED_COUNT,
        sort: '-createdAt',
      });

      setExams(response.data.map(mapDirectoryExamToExamCard));
      setError(null);
    } catch {
      setError('Could not load featured exams right now.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve()
      .then(() => {
        if (cancelled) return;
        return getPublicExams({
          limit: FEATURED_COUNT,
          sort: '-createdAt',
        });
      })
      .then((response) => {
        if (cancelled || !response) return;
        setExams(response.data.map(mapDirectoryExamToExamCard));
        setError(null);
      })
      .catch(() => {
        if (!cancelled) {
          setError('Could not load featured exams right now.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    setIsLoading(true);
    void loadFeatured();
  }, [loadFeatured]);

  // Handle Carousel Scroll
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <span className="mb-3 inline-flex items-center gap-1 rounded-full border border-purple-500/20 bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:bg-purple-950/60 dark:text-purple-300">
              <Sparkles size={12} /> Featured
            </span>
            <h2 className="text-3xl font-bold font-heading text-slate-900 dark:text-white sm:text-4xl">
              Featured Exams
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400 sm:text-base">
              Hand-picked government exams to start your preparation today.
            </p>
          </div>

          {/* Controls Right Section */}
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <Link
              to={ROUTES.EXAMS}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 transition-colors hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
            >
              View All
              <ArrowRight size={16} />
            </Link>

            {/* Carousel Nav Buttons */}
            {exams.length > 0 && !isLoading && !error && (
              <div className="flex items-center gap-2 pl-2">
                <button
                  onClick={() => scroll('left')}
                  aria-label="Scroll left"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-700 backdrop-blur-md shadow-xs transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => scroll('right')}
                  aria-label="Scroll right"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-700 backdrop-blur-md shadow-xs transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Content Section */}
        {isLoading ? (
          <div className="mt-8 flex gap-6 overflow-x-hidden pb-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <FeaturedSkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white/70 py-16 text-center shadow-xs backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/60">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/80 dark:text-purple-300">
              <BookOpen size={26} />
            </div>
            <p className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
              Couldn't Load Featured Exams
            </p>
            <p className="mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400">
              {error}
            </p>
            <button
              onClick={handleRetry}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-purple-500/20 transition-all hover:bg-purple-700 active:scale-95"
            >
              Try Again
            </button>
          </div>
        ) : exams.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white/70 py-16 text-center shadow-xs backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/60">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/80 dark:text-purple-300">
              <BookOpen size={26} />
            </div>
            <p className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
              No Featured Exams Yet
            </p>
            <p className="mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400">
              New exams are being added all the time. Check back soon or browse
              the catalog.
            </p>
            <Link
              to={ROUTES.EXAMS}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-purple-500/20 transition-all hover:bg-purple-700 active:scale-95"
            >
              Browse Exams
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          /* Horizontal Swap List */
          <div
            ref={scrollContainerRef}
            className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="w-[280px] shrink-0 snap-start sm:w-[320px]"
              >
                <ExamCard exam={exam} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
