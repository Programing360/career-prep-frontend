import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  BookOpen,
  ChevronRight,
  Shield,
  Image as ImageIcon,
  HelpCircle,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { ExamCardData } from '@/components/exams/examCardData';

// Dynamic thematic properties for each agency
interface AgencyTheme {
  gradientFrom: string;
  badgeBg: string;
  glowColor: string;
  accentText: string;
  chipBg: string;
  chipText: string;
}

const agencyThemes: Record<string, AgencyTheme> = {
  FPSC: {
    gradientFrom: 'from-indigo-500/20 via-indigo-500/5',
    badgeBg: 'bg-indigo-600/90 text-white dark:bg-indigo-500/90',
    glowColor:
      'group-hover:shadow-indigo-500/15 dark:group-hover:shadow-indigo-500/20',
    accentText:
      'text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500',
    chipBg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
    chipText: 'text-indigo-700 dark:text-indigo-300',
  },
  PPSC: {
    gradientFrom: 'from-emerald-500/20 via-emerald-500/5',
    badgeBg: 'bg-emerald-600/90 text-white dark:bg-emerald-500/90',
    glowColor:
      'group-hover:shadow-emerald-500/15 dark:group-hover:shadow-emerald-500/20',
    accentText:
      'text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500',
    chipBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    chipText: 'text-emerald-700 dark:text-emerald-300',
  },
  KPPSC: {
    gradientFrom: 'from-teal-500/20 via-teal-500/5',
    badgeBg: 'bg-teal-600/90 text-white dark:bg-teal-500/90',
    glowColor:
      'group-hover:shadow-teal-500/15 dark:group-hover:shadow-teal-500/20',
    accentText: 'text-teal-600 dark:text-teal-400 group-hover:text-teal-500',
    chipBg: 'bg-teal-500/10 dark:bg-teal-500/15',
    chipText: 'text-teal-700 dark:text-teal-300',
  },
  BPSC: {
    gradientFrom: 'from-blue-500/20 via-blue-500/5',
    badgeBg: 'bg-blue-600/90 text-white dark:bg-blue-500/90',
    glowColor:
      'group-hover:shadow-blue-500/15 dark:group-hover:shadow-blue-500/20',
    accentText: 'text-blue-600 dark:text-blue-400 group-hover:text-blue-500',
    chipBg: 'bg-blue-500/10 dark:bg-blue-500/15',
    chipText: 'text-blue-700 dark:text-blue-300',
  },
  SPSC: {
    gradientFrom: 'from-rose-500/20 via-rose-500/5',
    badgeBg: 'bg-rose-600/90 text-white dark:bg-rose-500/90',
    glowColor:
      'group-hover:shadow-rose-500/15 dark:group-hover:shadow-rose-500/20',
    accentText: 'text-rose-600 dark:text-rose-400 group-hover:text-rose-500',
    chipBg: 'bg-rose-500/10 dark:bg-rose-500/15',
    chipText: 'text-rose-700 dark:text-rose-300',
  },
  NTS: {
    gradientFrom: 'from-purple-500/20 via-purple-500/5',
    badgeBg: 'bg-purple-600/90 text-white dark:bg-purple-500/90',
    glowColor:
      'group-hover:shadow-purple-500/15 dark:group-hover:shadow-purple-500/20',
    accentText:
      'text-purple-600 dark:text-purple-400 group-hover:text-purple-500',
    chipBg: 'bg-purple-500/10 dark:bg-purple-500/15',
    chipText: 'text-purple-700 dark:text-purple-300',
  },
  OTS: {
    gradientFrom: 'from-cyan-500/20 via-cyan-500/5',
    badgeBg: 'bg-cyan-600/90 text-white dark:bg-cyan-500/90',
    glowColor:
      'group-hover:shadow-cyan-500/15 dark:group-hover:shadow-cyan-500/20',
    accentText: 'text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-500',
    chipBg: 'bg-cyan-500/10 dark:bg-cyan-500/15',
    chipText: 'text-cyan-700 dark:text-cyan-300',
  },
  PTS: {
    gradientFrom: 'from-amber-500/20 via-amber-500/5',
    badgeBg: 'bg-amber-600/90 text-white dark:bg-amber-500/90',
    glowColor:
      'group-hover:shadow-amber-500/15 dark:group-hover:shadow-amber-500/20',
    accentText: 'text-amber-600 dark:text-amber-400 group-hover:text-amber-500',
    chipBg: 'bg-amber-500/10 dark:bg-amber-500/15',
    chipText: 'text-amber-700 dark:text-amber-300',
  },
  ETEA: {
    gradientFrom: 'from-fuchsia-500/20 via-fuchsia-500/5',
    badgeBg: 'bg-fuchsia-600/90 text-white dark:bg-fuchsia-500/90',
    glowColor:
      'group-hover:shadow-fuchsia-500/15 dark:group-hover:shadow-fuchsia-500/20',
    accentText:
      'text-fuchsia-600 dark:text-fuchsia-400 group-hover:text-fuchsia-500',
    chipBg: 'bg-fuchsia-500/10 dark:bg-fuchsia-500/15',
    chipText: 'text-fuchsia-700 dark:text-fuchsia-300',
  },
  default: {
    gradientFrom: 'from-slate-500/20 via-slate-500/5',
    badgeBg: 'bg-slate-700/90 text-white dark:bg-slate-600/90',
    glowColor:
      'group-hover:shadow-slate-500/15 dark:group-hover:shadow-slate-500/20',
    accentText:
      'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white',
    chipBg: 'bg-slate-500/10 dark:bg-slate-500/15',
    chipText: 'text-slate-700 dark:text-slate-300',
  },
};

function getAgencyTheme(key: string): AgencyTheme {
  return agencyThemes[key] ?? agencyThemes.default;
}

export function ExamCard({
  exam,
}: {
  exam: ExamCardData & { imageUrl?: string };
}) {
  const theme = getAgencyTheme(exam.agencyKey);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
        },
      }}
      whileHover={{ y: -6 }}
      className="group relative h-full"
    >
      <div
        className={cn(
          'relative flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-300',
          'border-slate-200/80 bg-white/80 dark:border-slate-800/80 dark:bg-slate-900/60',
          'backdrop-blur-xl shadow-sm hover:shadow-2xl',
          theme.glowColor
        )}
      >
        {/* Top Accent Gradient overlay based on Agency */}
        <div
          className={cn(
            'aria-hidden absolute inset-x-0 top-0 h-32 bg-gradient-to-b to-transparent opacity-60 transition-opacity group-hover:opacity-100',
            theme.gradientFrom
          )}
        />

        {/* Media Thumbnail Section */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800/50">
          {exam.imageUrl ? (
            <img
              src={exam.imageUrl}
              alt={exam.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200/60 dark:from-slate-800/80 dark:to-slate-900/80 text-slate-400 dark:text-slate-600">
              <ImageIcon size={36} strokeWidth={1.5} />
            </div>
          )}

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          {/* Floating Top Badges */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase shadow-lg backdrop-blur-md border border-white/20',
                theme.badgeBg
              )}
            >
              <Shield size={12} strokeWidth={2.5} />
              {exam.agency}
            </span>

            {exam.verified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-300 bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/30 shadow-md">
                <BadgeCheck size={13} className="text-emerald-400" />
                Verified
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="relative flex flex-1 flex-col p-5">
          {/* Exam Title */}
          <h3 className="text-base font-semibold leading-snug tracking-tight text-slate-900 dark:text-slate-100 transition-colors line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            {exam.title}
          </h3>

          {/* Chips / Metadata Section */}
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-colors',
                theme.chipBg,
                theme.chipText
              )}
            >
              <BookOpen size={13} strokeWidth={2} />
              {exam.grade}
            </span>

            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-colors',
                theme.chipBg,
                theme.chipText
              )}
            >
              <Calendar size={13} strokeWidth={2} />
              {exam.year}
            </span>

            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-colors',
                theme.chipBg,
                theme.chipText
              )}
            >
              <HelpCircle size={13} strokeWidth={2} />
              {exam.questionCount.toLocaleString()} Questions
            </span>
          </div>
        </div>

        {/* Card Footer */}
        <div className="border-t border-slate-100 dark:border-slate-800/60 px-5 py-3.5 mt-auto bg-slate-50/50 dark:bg-slate-900/30">
          <Link to={`/exams/${exam.slug}`} className="block">
            <Button
              fullWidth
              variant="ghost"
              size="sm"
              rightIcon={
                <ChevronRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              }
              className={cn('', theme.accentText)}
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
