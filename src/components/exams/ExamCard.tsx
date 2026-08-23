import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  BookOpen,
  ChevronRight,
  Shield,
  Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { ExamCardData } from '@/components/exams/examCardData';

// এজেন্সির জন্য কালার থিম স্ট্রাকচার
interface AgencyTheme {
  cardBg: string;
  badgeBg: string;
  badgeText: string;
  border: string;
  hoverBorder: string;
  accentText: string;
  chipBg: string;
}

const agencyThemes: Record<string, AgencyTheme> = {
  FPSC: {
    cardBg: 'bg-indigo-50/90 dark:bg-indigo-950/40',
    badgeBg: 'bg-indigo-600 text-white dark:bg-indigo-500',
    badgeText: 'text-white',
    border: 'border-indigo-200/80 dark:border-indigo-800/50',
    hoverBorder:
      'group-hover:border-indigo-400 dark:group-hover:border-indigo-600',
    accentText: 'text-indigo-700 dark:text-indigo-300',
    chipBg:
      'bg-indigo-100/80 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200',
  },
  PPSC: {
    cardBg: 'bg-emerald-50/90 dark:bg-emerald-950/40',
    badgeBg: 'bg-emerald-600 text-white dark:bg-emerald-500',
    badgeText: 'text-white',
    border: 'border-emerald-200/80 dark:border-emerald-800/50',
    hoverBorder:
      'group-hover:border-emerald-400 dark:group-hover:border-emerald-600',
    accentText: 'text-emerald-700 dark:text-emerald-300',
    chipBg:
      'bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200',
  },
  KPPSC: {
    cardBg: 'bg-teal-50/90 dark:bg-teal-950/40',
    badgeBg: 'bg-teal-600 text-white dark:bg-teal-500',
    badgeText: 'text-white',
    border: 'border-teal-200/80 dark:border-teal-800/50',
    hoverBorder: 'group-hover:border-teal-400 dark:group-hover:border-teal-600',
    accentText: 'text-teal-700 dark:text-teal-300',
    chipBg:
      'bg-teal-100/80 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200',
  },
  BPSC: {
    cardBg: 'bg-blue-50/90 dark:bg-blue-950/40',
    badgeBg: 'bg-blue-600 text-white dark:bg-blue-500',
    badgeText: 'text-white',
    border: 'border-blue-200/80 dark:border-blue-800/50',
    hoverBorder: 'group-hover:border-blue-400 dark:group-hover:border-blue-600',
    accentText: 'text-blue-700 dark:text-blue-300',
    chipBg:
      'bg-blue-100/80 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200',
  },
  SPSC: {
    cardBg: 'bg-rose-50/90 dark:bg-rose-950/40',
    badgeBg: 'bg-rose-600 text-white dark:bg-rose-500',
    badgeText: 'text-white',
    border: 'border-rose-200/80 dark:border-rose-800/50',
    hoverBorder: 'group-hover:border-rose-400 dark:group-hover:border-rose-600',
    accentText: 'text-rose-700 dark:text-rose-300',
    chipBg:
      'bg-rose-100/80 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200',
  },
  NTS: {
    cardBg: 'bg-purple-50/90 dark:bg-purple-950/40',
    badgeBg: 'bg-purple-600 text-white dark:bg-purple-500',
    badgeText: 'text-white',
    border: 'border-purple-200/80 dark:border-purple-800/50',
    hoverBorder:
      'group-hover:border-purple-400 dark:group-hover:border-purple-600',
    accentText: 'text-purple-700 dark:text-purple-300',
    chipBg:
      'bg-purple-100/80 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200',
  },
  OTS: {
    cardBg: 'bg-cyan-50/90 dark:bg-cyan-950/40',
    badgeBg: 'bg-cyan-600 text-white dark:bg-cyan-500',
    badgeText: 'text-white',
    border: 'border-cyan-200/80 dark:border-cyan-800/50',
    hoverBorder: 'group-hover:border-cyan-400 dark:group-hover:border-cyan-600',
    accentText: 'text-cyan-700 dark:text-cyan-300',
    chipBg:
      'bg-cyan-100/80 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-200',
  },
  PTS: {
    cardBg: 'bg-amber-50/90 dark:bg-amber-950/40',
    badgeBg: 'bg-amber-600 text-white dark:bg-amber-500',
    badgeText: 'text-white',
    border: 'border-amber-200/80 dark:border-amber-800/50',
    hoverBorder:
      'group-hover:border-amber-400 dark:group-hover:border-amber-600',
    accentText: 'text-amber-700 dark:text-amber-300',
    chipBg:
      'bg-amber-100/80 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200',
  },
  ETEA: {
    cardBg: 'bg-fuchsia-50/90 dark:bg-fuchsia-950/40',
    badgeBg: 'bg-fuchsia-600 text-white dark:bg-fuchsia-500',
    badgeText: 'text-white',
    border: 'border-fuchsia-200/80 dark:border-fuchsia-800/50',
    hoverBorder:
      'group-hover:border-fuchsia-400 dark:group-hover:border-fuchsia-600',
    accentText: 'text-fuchsia-700 dark:text-fuchsia-300',
    chipBg:
      'bg-fuchsia-100/80 dark:bg-fuchsia-900/50 text-fuchsia-800 dark:text-fuchsia-200',
  },
  default: {
    cardBg: 'bg-slate-50/90 dark:bg-slate-900/60',
    badgeBg: 'bg-slate-600 text-white dark:bg-slate-700',
    badgeText: 'text-white',
    border: 'border-slate-200/80 dark:border-slate-800',
    hoverBorder:
      'group-hover:border-slate-400 dark:group-hover:border-slate-600',
    accentText: 'text-slate-700 dark:text-slate-300',
    chipBg:
      'bg-slate-200/70 dark:bg-slate-800 text-slate-800 dark:text-slate-200',
  },
};

function getAgencyTheme(key: string): AgencyTheme {
  return agencyThemes[key] ?? agencyThemes.default;
}

// ExamCardData ইন্টারফেসে `imageUrl` অথবা `coverImage` যোগ করতে নিশ্চিত হোন
export function ExamCard({
  exam,
}: {
  exam: ExamCardData & { imageUrl?: string };
}) {
  const theme = getAgencyTheme(exam.agencyKey);

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
      className="group h-full"
    >
      <div
        className={cn(
          'flex h-full flex-col overflow-hidden rounded-2xl border backdrop-blur-md shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
          theme.cardBg,
          theme.border,
          theme.hoverBorder
        )}
      >
        {/* Card Header Image Section */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
          {exam.imageUrl ? (
            <img
              src={exam.imageUrl}
              alt={exam.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 text-slate-400 dark:text-slate-600">
              <ImageIcon size={40} />
            </div>
          )}

          {/* Overlay Gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Badges on Top of Image */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md',
                theme.badgeBg
              )}
            >
              <Shield size={12} />
              {exam.agency}
            </span>

            {exam.verified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/40 shadow-xs">
                <BadgeCheck size={14} className="text-emerald-400" />
                Verified
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col p-5">
          {/* Exam Title */}
          <h3 className="text-base font-bold leading-snug text-slate-900 dark:text-white transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-400 line-clamp-2">
            {exam.title}
          </h3>

          {/* Meta Information Chips */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-lg px-2.5 py-1',
                theme.chipBg
              )}
            >
              <BookOpen size={12} />
              {exam.grade}
            </span>
            <span
              className={cn(
                'inline-flex items-center rounded-lg px-2.5 py-1',
                theme.chipBg
              )}
            >
              {exam.year}
            </span>
            <span
              className={cn(
                'inline-flex items-center rounded-lg px-2.5 py-1',
                theme.chipBg
              )}
            >
              {exam.questionCount.toLocaleString()} Qs
            </span>
          </div>
        </div>

        {/* Footer Button */}
        <div className="border-t border-slate-200/60 dark:border-slate-800/80 px-5 py-3 mt-auto">
          <Link to={`/exams/${exam.slug}`} className="block">
            <Button
              fullWidth
              variant="ghost"
              size="sm"
              rightIcon={
                <ChevronRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              }
              className={cn(
                'justify-between font-semibold transition-colors',
                theme.accentText
              )}
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
