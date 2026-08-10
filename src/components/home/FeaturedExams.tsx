import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { ExamCard } from '@/components/exams/ExamCard';
import { mapDirectoryExamToExamCard } from '@/components/exams/examCardData';
import type { ExamCardData } from '@/components/exams/examCardData';
import { getPublicExams } from '@/services/examService';
import { ROUTES } from '@/constants/routes';

const FEATURED_COUNT = 6;

function FeaturedSkeletonCard() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-purple-100/80 bg-white/70 p-5 shadow-lg shadow-purple-950/5 backdrop-blur-md dark:border-purple-900/40 dark:bg-[#150E28]/70">
      <div className="flex items-start justify-between">
        <div className="h-6 w-20 animate-pulse rounded-full bg-purple-100/80 dark:bg-purple-900/40" />
        <div className="h-4 w-16 animate-pulse rounded bg-purple-100/80 dark:bg-purple-900/40" />
      </div>
      <div className="mt-4 h-6 w-5/6 animate-pulse rounded bg-purple-100/80 dark:bg-purple-900/40" />
      <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-purple-100/80 dark:bg-purple-900/40" />
      <div className="mt-4 flex gap-2">
        <div className="h-6 w-16 animate-pulse rounded-lg bg-purple-100/80 dark:bg-purple-900/40" />
        <div className="h-6 w-14 animate-pulse rounded-lg bg-purple-100/80 dark:bg-purple-900/40" />
        <div className="h-6 w-12 animate-pulse rounded-lg bg-purple-100/80 dark:bg-purple-900/40" />
      </div>
      <div className="mt-5 h-9 w-full animate-pulse rounded-xl bg-purple-100/80 dark:bg-purple-900/40" />
    </div>
  );
}

export default function FeaturedExams() {
  const [exams, setExams] = useState<ExamCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadFeatured();
  }, [loadFeatured]);

  const handleRetry = useCallback(() => {
    setError(null);
    setIsLoading(true);
    void loadFeatured();
  }, [loadFeatured]);

  return (
    <section className="relative px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <span className="mb-3 inline-block rounded-full border border-[#8B3DFF]/20 bg-[#F3E8FF] px-4 py-1 text-xs font-semibold uppercase tracking-wider text-[#8B3DFF] dark:bg-purple-950/60 dark:text-purple-300">
              <span className="mr-1 inline-flex items-center gap-1">
                <Sparkles size={12} /> Featured
              </span>
            </span>
            <h2 className="text-3xl font-bold font-heading text-gray-900 dark:text-white sm:text-4xl">
              Featured Exams
            </h2>
            <p className="mt-3 max-w-2xl text-gray-600 dark:text-purple-200/80">
              Hand-picked government exams to start your preparation today.
            </p>
          </div>
          <Link
            to={ROUTES.EXAMS}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#8B3DFF] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-500/20 transition-colors hover:bg-[#7424ED] dark:bg-purple-600 dark:hover:bg-purple-500"
          >
            View All Exams
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: FEATURED_COUNT }).map((_, i) => (
              <FeaturedSkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-purple-100/80 bg-white/70 py-16 text-center shadow-lg shadow-purple-950/5 backdrop-blur-md dark:border-purple-900/40 dark:bg-[#150E28]/70">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F3E8FF] text-[#8B3DFF] dark:bg-purple-950/80 dark:text-purple-300">
              <BookOpen size={28} />
            </div>
            <p className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              Couldn&apos;t Load Featured Exams
            </p>
            <p className="mt-1 max-w-md text-sm text-gray-600 dark:text-purple-200/70">
              {error}
            </p>
            <button
              onClick={handleRetry}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#8B3DFF] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-colors hover:bg-[#7424ED] dark:bg-purple-600 dark:hover:bg-purple-500"
            >
              Try Again
            </button>
          </div>
        ) : exams.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-purple-100/80 bg-white/70 py-16 text-center shadow-lg shadow-purple-950/5 backdrop-blur-md dark:border-purple-900/40 dark:bg-[#150E28]/70">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F3E8FF] text-[#8B3DFF] dark:bg-purple-950/80 dark:text-purple-300">
              <BookOpen size={28} />
            </div>
            <p className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              No Featured Exams Yet
            </p>
            <p className="mt-1 max-w-md text-sm text-gray-600 dark:text-purple-200/70">
              New exams are being added all the time. Check back soon or browse
              the full catalog.
            </p>
            <Link
              to={ROUTES.EXAMS}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#8B3DFF] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-colors hover:bg-[#7424ED] dark:bg-purple-600 dark:hover:bg-purple-500"
            >
              Browse Exams
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {exams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
