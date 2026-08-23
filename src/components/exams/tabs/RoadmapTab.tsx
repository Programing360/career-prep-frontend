import { motion, type Variants } from 'framer-motion';
import { Map, Clock, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { roadmapPhases } from '@/components/exams/examDetailData';
import type { ExamData, RoadmapPhase } from '@/components/exams/examDetailData';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950',
    border: 'border-emerald-200 dark:border-emerald-800',
    label: 'Completed',
  },
  'in-progress': {
    icon: ArrowRight,
    color: 'text-primary-500',
    bg: 'bg-primary-50 dark:bg-primary-950',
    border: 'border-primary-200 dark:border-primary-800',
    label: 'In Progress',
  },
  upcoming: {
    icon: Circle,
    color: 'text-gray-400 dark:text-gray-500',
    bg: 'bg-gray-50 dark:bg-gray-900',
    border: 'border-gray-200 dark:border-gray-700',
    label: 'Upcoming',
  },
};

export function RoadmapTab({
  exam,
  phases,
  title,
  strategySummary,
}: {
  exam: ExamData;
  phases?: RoadmapPhase[];
  title?: string;
  strategySummary?: string;
}) {
  const resolvedPhases = phases && phases.length > 0 ? phases : roadmapPhases;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <motion.h3
        variants={fadeInUp}
        className="mb-2 text-lg font-bold font-heading text-gray-900 dark:text-white"
      >
        Study Roadmap
      </motion.h3>
      <motion.p
        variants={fadeInUp}
        className="mb-6 text-sm text-gray-500 dark:text-gray-400"
      >
        A structured preparation plan for {exam.title}.
        {title ? ` ${title}.` : ''}
      </motion.p>

      {strategySummary && (
        <motion.p
          variants={fadeInUp}
          className="mb-6 rounded-xl border border-white/20 bg-white/70 p-4 text-sm text-gray-600 dark:border-gray-800/50 dark:bg-gray-900/70 dark:text-gray-300"
        >
          {strategySummary}
        </motion.p>
      )}

      <div className="space-y-4">
        {resolvedPhases.map((phase) => {
          const config = statusConfig[phase.status];
          const StatusIcon = config.icon;

          return (
            <motion.div
              key={phase.id}
              variants={fadeInUp}
              className={cn(
                'rounded-xl border bg-white/70 p-5 backdrop-blur-md transition-all hover:shadow-md dark:bg-gray-900/70',
                config.border
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                      config.bg
                    )}
                  >
                    <StatusIcon size={18} className={config.color} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      {phase.phase}
                    </p>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      {phase.title}
                    </h4>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <Clock size={12} />
                  {phase.duration}
                </div>
              </div>

              {phase.topics.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {phase.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-3 flex items-center gap-1.5">
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                    config.bg,
                    config.color
                  )}
                >
                  {config.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        variants={fadeInUp}
        className="mt-6 rounded-xl border border-white/20 bg-white/70 p-5 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70"
      >
        <div className="flex items-center gap-2">
          <Map size={18} className="text-primary-500" />
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            Quick Stats
          </h4>
        </div>
        <div className="mt-3 space-y-2">
          {[
            {
              label: 'Passing Score',
              value: `${exam.passingMarks}/${exam.totalMarks}`,
            },
            { label: 'Duration', value: `${exam.duration} min` },
            {
              label: 'Negative Marking',
              value: exam.pattern.negativeMarking
                ? `Yes (-${exam.pattern.negativeMarksPerWrong})`
                : 'No',
            },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-500 dark:text-gray-400">
                {s.label}
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
