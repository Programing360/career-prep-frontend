import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Lock,
  Calendar,
  BookOpen,
  Brain,
  Zap,
} from 'lucide-react';
import { samplePastPapers } from '@/components/exams/examDetailData';
import type { ExamData } from '@/components/exams/examDetailData';

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

export function PastPapersTab({ exam }: { exam: ExamData }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <motion.h3
        variants={fadeInUp}
        className="mb-2 text-lg font-bold font-heading text-gray-900 dark:text-white"
      >
        Past Papers
      </motion.h3>
      <motion.p
        variants={fadeInUp}
        className="mb-6 text-sm text-gray-500 dark:text-gray-400"
      >
        Download previous year question papers for {exam.title}.
      </motion.p>

      <div className="space-y-3">
        {samplePastPapers.map((paper) => (
          <motion.div
            key={paper.id}
            variants={fadeInUp}
            className="flex items-center justify-between rounded-xl border border-white/20 bg-white/70 p-4 backdrop-blur-md transition-all hover:shadow-md dark:border-gray-800/50 dark:bg-gray-900/70"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <FileText
                  size={18}
                  className="text-gray-600 dark:text-gray-400"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {paper.title}
                </p>
                <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={11} />
                    {paper.year}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <BookOpen size={11} />
                    {paper.questionCount} questions
                  </span>
                  <span className="font-mono text-[10px] text-gray-400 dark:text-gray-500">
                    {paper.paperCode}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {paper.isFree ? (
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-100 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-300 dark:hover:bg-primary-900">
                  <Download size={12} />
                  Free
                </button>
              ) : (
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300">
                  <Lock size={12} />
                  Premium
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Teaser Widgets */}
      <motion.div variants={fadeInUp} className="mt-8">
        <h4 className="mb-3 text-base font-bold font-heading text-gray-900 dark:text-white">
          Also Try
        </h4>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Sample MCQs Teaser */}
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

          {/* Demo Mock Test Teaser */}
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
            <button className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700">
              Try Free Preview
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
