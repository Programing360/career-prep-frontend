import { motion } from 'framer-motion';
import {
  Brain,
  Clock,
  Target,
  Trophy,
  CheckCircle2,
  Zap,
  FileText,
} from 'lucide-react';
import {
  sampleMCQs,
  samplePastPapers,
} from '@/components/exams/examDetailData';
import type { ExamData } from '@/components/exams/examDetailData';

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const stagger = {
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
            Free Sample MCQs ({sampleMCQs.length} questions)
          </h4>
        </div>
        <div className="space-y-3">
          {sampleMCQs.slice(0, 4).map((mcq, i) => (
            <div
              key={mcq.id}
              className="rounded-lg border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-800 dark:bg-gray-800/50"
            >
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
                Q{i + 1}
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {mcq.question}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {mcq.options.map((opt, j) => (
                  <span
                    key={j}
                    className="rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[11px] text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                  >
                    {String.fromCharCode(65 + j)}. {opt}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
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
          <button className="mt-3 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700">
            <Zap size={14} />
            Start Mock Test
          </button>
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
