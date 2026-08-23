import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import {
  Brain,
  Clock,
  Target,
  Trophy,
  CheckCircle2,
  Zap,
  FileText,
} from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import { ROUTES } from '@/constants/routes';
import {
  sampleMCQs,
  samplePastPapers,
} from '@/components/exams/examDetailData';
import type { ExamData } from '@/components/exams/examDetailData';

const MCQPracticeContainer = lazy(() =>
  import('@/components/mcq/MCQPracticeContainer').then((m) => ({
    default: m.MCQPracticeContainer,
  }))
);

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

export function MockTestTab({ exam }: { exam: ExamData }) {
  const stats = [
    {
      icon: Target,
      label: 'Questions',
      value: exam.totalQuestions.toLocaleString(),
    },
    { icon: Clock, label: 'Duration', value: `${exam.duration} min` },
    { icon: Trophy, label: 'Total Marks', value: exam.totalMarks },
    { icon: CheckCircle2, label: 'Passing Marks', value: exam.passingMarks },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <motion.h3
        variants={fadeInUp}
        className="mb-2 text-lg font-bold font-heading text-gray-900 dark:text-white"
      >
        Mock Test & Practice
      </motion.h3>
      <motion.p
        variants={fadeInUp}
        className="mb-6 text-sm text-gray-500 dark:text-gray-400"
      >
        Practice with free sample questions and full-length mock tests.
      </motion.p>

      <motion.div
        variants={fadeInUp}
        className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/20 bg-white/70 p-4 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70"
          >
            <div className="flex items-center gap-2">
              <s.icon size={14} className="text-primary-500" />
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {s.label}
              </span>
            </div>
            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
              {s.value}
            </p>
          </div>
        ))}
      </motion.div>

      <motion.div
        variants={fadeInUp}
        className="mb-6 rounded-xl border border-white/20 bg-white/70 p-5 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70"
      >
        <div className="mb-4 flex items-center gap-2">
          <Brain size={18} className="text-primary-500" />
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            Sample MCQs ({sampleMCQs.length} questions)
          </h4>
        </div>
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-10">
              <Spinner size={24} />
            </div>
          }
        >
          <MCQPracticeContainer examSlug={exam.slug} isEmbedded />
        </Suspense>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <div className="rounded-xl border border-white/20 bg-white/70 p-5 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-primary-500" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Full Mock Test
            </h4>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Take a timed, full-length mock test with{' '}
            {exam.totalQuestions.toLocaleString()} questions, automatic scoring,
            and detailed performance analytics.
          </p>
          <Link
            to={ROUTES.MOCK_TEST_DEMO}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700"
          >
            <Zap size={14} />
            Start Mock Test
          </Link>
        </div>
      </motion.div>

      {/* Past Papers Preview Teaser */}
      <motion.div variants={fadeInUp} className="mt-6">
        <h4 className="mb-3 text-base font-bold font-heading text-gray-900 dark:text-white">
          Past Papers Preview
        </h4>
        <div className="grid gap-3 sm:grid-cols-2">
          {samplePastPapers.slice(0, 2).map((paper) => (
            <div
              key={paper.id}
              className="rounded-xl border border-white/20 bg-white/70 p-4 backdrop-blur-md transition-all hover:shadow-md dark:border-gray-800/50 dark:bg-gray-900/70"
            >
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-primary-500" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {paper.title}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {paper.year} · {paper.questionCount} questions
              </p>
              <button className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700">
                Try Free Preview
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
