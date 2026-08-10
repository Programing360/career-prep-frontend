import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BadgeCheck, BookOpen, ChevronRight, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { ExamCardData } from '@/components/exams/examCardData';

const agencyColors: Record<string, string> = {
  FPSC: 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300',
  PPSC: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  KPPSC: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300',
  BPSC: 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300',
  SPSC: 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300',
  NTS: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300',
  OTS: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300',
  PTS: 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300',
  ETEA: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

function getAgencyColor(key: string): string {
  return agencyColors[key] ?? agencyColors.default;
}

export function ExamCard({ exam }: { exam: ExamCardData }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: 'easeOut' },
        },
      }}
      className="group"
    >
      <div
        className={cn(
          'flex h-full flex-col rounded-xl border backdrop-blur-md transition-all duration-200',
          'border-white/20 bg-white/70 hover:shadow-lg dark:border-gray-800/50 dark:bg-gray-900/70'
        )}
      >
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide',
                getAgencyColor(exam.agencyKey)
              )}
            >
              <Shield size={10} />
              {exam.agency}
            </span>

            {exam.verified && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                <BadgeCheck size={14} />
                Verified
              </span>
            )}
          </div>

          <h3 className="mt-3 text-base font-bold font-heading leading-snug text-[rgb(var(--color-text-primary))] group-hover:text-primary-600 dark:group-hover:text-primary-400">
            {exam.title}
          </h3>

          <div className="mt-3 flex flex-wrap gap-2 text-xs text-[rgb(var(--color-text-secondary))]">
            <span className="inline-flex items-center gap-1 rounded-md bg-[rgb(var(--color-surface-elevated))] px-2 py-1">
              <BookOpen size={11} />
              {exam.grade}
            </span>
            <span className="inline-flex items-center rounded-md bg-[rgb(var(--color-surface-elevated))] px-2 py-1">
              {exam.year}
            </span>
            <span className="inline-flex items-center rounded-md bg-[rgb(var(--color-surface-elevated))] px-2 py-1">
              {exam.questionCount.toLocaleString()} Qs
            </span>
          </div>
        </div>

        <div className="border-t border-[rgb(var(--color-border))] px-5 py-3">
          <Link to={`/exams/${exam.slug}`} className="block">
            <Button
              fullWidth
              variant="ghost"
              size="sm"
              rightIcon={<ChevronRight size={14} />}
              className="justify-between hover:text-primary-600 dark:hover:text-primary-400"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
