import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  ChevronDown,
  BadgeCheck,
  Brain,
  FileText,
  Zap,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getTopicName,
  getTopicWeightage,
  getTopicSubtopics,
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

function WeightageBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <motion.div
          className="h-full rounded-full bg-primary-500"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <span className="text-[11px] font-medium tabular-nums text-gray-500 dark:text-gray-400">
        {value} MCQs
      </span>
    </div>
  );
}

export function SyllabusTab({
  exam,
  subjects,
}: {
  exam: ExamData;
  subjects?: ExamData['subjects'];
}) {
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  const toggleSubject = (id: string) => {
    setExpandedSubject((prev) => (prev === id ? null : id));
  };

  const resolvedSubjects = subjects ?? exam.subjects;
  const totalWeightage = resolvedSubjects.reduce(
    (s, sub) => s + sub.weightage,
    0
  );

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      {/* Verified Badge */}
      {exam.verifiedOrganization && (
        <motion.div
          variants={fadeInUp}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
        >
          <BadgeCheck size={16} className="text-emerald-500" />
          Verified from {exam.verifiedOrganization} official notification on{' '}
          {exam.verifiedDate}
        </motion.div>
      )}

      <motion.h3
        variants={fadeInUp}
        className="mb-2 text-lg font-bold font-heading text-gray-900 dark:text-white"
      >
        Syllabus & Paper Pattern
      </motion.h3>
      <motion.p
        variants={fadeInUp}
        className="mb-6 text-sm text-gray-500 dark:text-gray-400"
      >
        Complete breakdown of subjects, topics, and exam format.
      </motion.p>

      {/* Summary Cards */}
      <motion.div
        variants={fadeInUp}
        className="mb-6 grid gap-4 sm:grid-cols-3"
      >
        <div className="rounded-xl border border-white/20 bg-white/70 p-4 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Exam Type
          </p>
          <p className="mt-1 text-lg font-bold capitalize text-gray-900 dark:text-white">
            {exam.pattern.type}
          </p>
        </div>
        <div className="rounded-xl border border-white/20 bg-white/70 p-4 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Total Questions
          </p>
          <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
            {exam.totalQuestions.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-white/20 bg-white/70 p-4 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Total Marks
          </p>
          <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
            {exam.totalMarks}
          </p>
        </div>
      </motion.div>

      {/* Sections Table */}
      <motion.div
        variants={fadeInUp}
        className="mb-6 overflow-x-auto rounded-xl border border-white/20 bg-white/70 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70"
      >
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200/50 dark:border-gray-700/50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                Section
              </th>
              <th className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                Questions
              </th>
              <th className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                Marks/Q
              </th>
              <th className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                Time (min)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
            {exam.pattern.sections.map((section) => (
              <tr key={section.name}>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  {section.name}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {section.questionCount}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {section.marksPerQuestion}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {section.timeLimit ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Interactive Curriculum Tree */}
      <motion.div variants={fadeInUp} className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 size={18} className="text-primary-500" />
          <h4 className="text-base font-bold font-heading text-gray-900 dark:text-white">
            Subject-wise Curriculum Tree
          </h4>
        </div>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Expand each subject to explore topics, subtopics, and MCQ weightage
          distribution.
        </p>

        <div className="space-y-3">
          {resolvedSubjects.map((subject) => {
            const isExpanded = expandedSubject === subject.id;
            const subjectWeightPct =
              totalWeightage > 0
                ? Math.round((subject.weightage / totalWeightage) * 100)
                : 0;

            return (
              <motion.div key={subject.id} variants={fadeInUp}>
                <div className="rounded-xl border border-white/20 bg-white/70 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
                  <button
                    onClick={() => toggleSubject(subject.id)}
                    className="flex w-full items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen size={16} className="text-primary-500" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {subject.name}
                      </span>
                      <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                        {subject.weightage} marks
                      </span>
                      <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
                        {subjectWeightPct}% of total
                      </span>
                    </div>
                    <ChevronDown
                      size={18}
                      className={cn(
                        'text-gray-400 transition-transform',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </button>

                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-gray-200/50 dark:border-gray-700/50"
                    >
                      <div className="space-y-2 p-4 pt-3">
                        {subject.topics.map((topic) => {
                          const topicName = getTopicName(topic);
                          const topicW = getTopicWeightage(topic);
                          const subtopics = getTopicSubtopics(topic);

                          return (
                            <div
                              key={topicName}
                              className="rounded-lg border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-800 dark:bg-gray-800/30"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                  {topicName}
                                </span>
                                {topicW != null && (
                                  <WeightageBar
                                    value={topicW}
                                    max={Math.max(
                                      ...subject.topics.map(
                                        (t) => getTopicWeightage(t) ?? 0
                                      )
                                    )}
                                  />
                                )}
                              </div>

                              {subtopics && subtopics.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1.5 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                                  {subtopics.map((st) => (
                                    <span
                                      key={st.name}
                                      className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-gray-600 ring-1 ring-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:ring-gray-700"
                                    >
                                      {st.name}
                                      {st.mcqWeightage != null && (
                                        <span className="text-primary-500">
                                          {st.mcqWeightage}
                                        </span>
                                      )}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Teaser Widgets */}
      <motion.div variants={fadeInUp}>
        <h4 className="mb-3 text-base font-bold font-heading text-gray-900 dark:text-white">
          Quick Access
        </h4>
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Sample MCQs Teaser */}
          <div className="rounded-xl border border-white/20 bg-white/70 p-5 backdrop-blur-md transition-all hover:shadow-md dark:border-gray-800/50 dark:bg-gray-900/70">
            <div className="flex items-center gap-2">
              <Brain size={18} className="text-primary-500" />
              <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
                Sample MCQs
              </h5>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Preview free practice questions to gauge difficulty.
            </p>
            <button className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700">
              Try Free Preview
            </button>
          </div>

          {/* Past Papers Teaser */}
          <div className="rounded-xl border border-white/20 bg-white/70 p-5 backdrop-blur-md transition-all hover:shadow-md dark:border-gray-800/50 dark:bg-gray-900/70">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-primary-500" />
              <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
                Past Papers
              </h5>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Download previous years' papers and practice offline.
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
              Take a timed mini test with instant scoring.
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
