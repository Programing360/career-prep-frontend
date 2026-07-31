import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Zap } from 'lucide-react';
import { PastPaperFilters } from '@/components/past-papers/PastPaperFilters';
import { PastPaperCard } from '@/components/past-papers/PastPaperCard';
import { PastPaperSkeleton } from '@/components/past-papers/PastPaperSkeleton';
import { PastPaperEmptyState } from '@/components/past-papers/PastPaperEmptyState';
import { LazyPastPaperViewer } from '@/components/past-papers/LazyPastPaperViewer';
import { getPastPapers } from '@/services/pastPaperService';
import { ROUTES } from '@/constants/routes';
import type { ExamData } from '@/components/exams/examDetailData';
import type { PastPaper, PastPaperFilterState } from '@/types/pastPaper';

function getPastPaperKey(slug: string): string {
  if (slug.includes('css')) return 'css';
  if (slug.includes('pms')) return 'pms';
  return '';
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

export function PastPapersTab({ exam }: { exam: ExamData }) {
  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<PastPaperFilterState>({
    year: null,
    subject: null,
    paperType: null,
    sourceType: null,
  });
  const [previewPaper, setPreviewPaper] = useState<PastPaper | null>(null);

  const examKey = getPastPaperKey(exam.slug);

  const fetchPapers = useCallback(async () => {
    if (!examKey) return;
    setIsLoading(true);
    try {
      const data = await getPastPapers(examKey, filters);
      setPapers(data);
    } finally {
      setIsLoading(false);
    }
  }, [examKey, filters]);

  useEffect(() => {
    if (!examKey) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPapers();
  }, [examKey, fetchPapers]);

  const handlePreview = useCallback(
    (id: string) => {
      const found = papers.find((p) => p.id === id);
      if (found && !found.isLocked) {
        setPreviewPaper(found);
      }
    },
    [papers]
  );

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <motion.h3
        variants={{
          hidden: { opacity: 0, y: 16 },
          show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
        }}
        className="mb-2 text-lg font-bold font-heading text-gray-900 dark:text-white"
      >
        Past Papers
      </motion.h3>
      <motion.p
        variants={{
          hidden: { opacity: 0, y: 16 },
          show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
        }}
        className="mb-6 text-sm text-gray-500 dark:text-gray-400"
      >
        Browse and preview previous year question papers for {exam.title}.
      </motion.p>

      {examKey && (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 16 },
            show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
          }}
          className="mb-8"
        >
          <PastPaperFilters
            filters={filters}
            onChange={setFilters}
            resultCount={papers.length}
            totalCount={papers.length}
          />
        </motion.div>
      )}

      {isLoading ? (
        <PastPaperSkeleton count={6} />
      ) : papers.length > 0 ? (
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.06 } },
          }}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {papers.map((paper) => (
            <PastPaperCard
              key={paper.id}
              paper={paper}
              onPreview={handlePreview}
            />
          ))}
        </motion.div>
      ) : (
        <PastPaperEmptyState examName={exam.title} />
      )}

      {/* Teaser Widgets */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 16 },
          show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
        }}
        className="mt-8"
      >
        <h4 className="mb-3 text-base font-bold font-heading text-gray-900 dark:text-white">
          Also Try
        </h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/20 bg-white/70 p-5 backdrop-blur-md transition-all hover:shadow-md dark:border-gray-800/50 dark:bg-gray-900/70">
            <div className="flex items-center gap-2">
              <Brain size={18} className="text-primary-500" />
              <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
                Sample MCQs
              </h5>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Practice with free questions before committing to the full exam.
            </p>
            <button className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700">
              Try Free Preview
            </button>
          </div>

          <div className="rounded-xl border border-white/20 bg-white/70 p-5 backdrop-blur-md transition-all hover:shadow-md dark:border-gray-800/50 dark:bg-gray-900/70">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-primary-500" />
              <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
                Demo Mock Test
              </h5>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Simulate real exam conditions with a timed practice test.
            </p>
            <Link
              to={ROUTES.MOCK_TEST_VERBAL_NONVERBAL}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700"
            >
              Try Free Preview
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Preview Modal */}
      {previewPaper && (
        <LazyPastPaperViewer
          paper={previewPaper}
          onClose={() => setPreviewPaper(null)}
        />
      )}
    </motion.div>
  );
}
