import { motion } from 'framer-motion';
import { Calendar, Newspaper, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/utils/dateHelpers';
import { SourceAttributionBadge } from '@/components/common/SourceAttributionBadge';
import { getCategoryClass } from './categoryStyles';
import type { CurrentAffairsItem } from '@/types/currentAffairs';

export function CurrentAffairsCard({ item }: { item: CurrentAffairsItem }) {
  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: 'easeOut' },
        },
      }}
      className="group flex h-full flex-col"
    >
      <div
        className={cn(
          'flex h-full flex-col overflow-hidden rounded-xl border backdrop-blur-md transition-all duration-300',
          'border-slate-200/80 bg-white/80 hover:border-purple-200 hover:shadow-xl dark:border-slate-800/80 dark:bg-slate-900/80 dark:hover:border-purple-900/50'
        )}
      >
        {item.imageUrl ? (
          <div className="relative h-40 shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img
              src={item.imageUrl}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex h-28 shrink-0 items-center justify-center bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-violet-500/10 dark:from-purple-900/20 dark:to-indigo-900/20">
            <Newspaper
              size={32}
              className="text-purple-500/60 dark:text-purple-400/50"
              aria-hidden="true"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                getCategoryClass(item.category)
              )}
            >
              {item.category}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <Calendar size={11} aria-hidden="true" />
              <time dateTime={item.publicationDate}>
                {formatRelativeTime(item.publicationDate)}
              </time>
            </span>
          </div>

          <h3
            className={cn(
              'mt-3 text-base font-bold leading-snug transition-colors duration-200',
              'text-slate-900 group-hover:text-purple-600',
              'dark:text-slate-100 dark:group-hover:text-purple-400'
            )}
          >
            {item.title}
          </h3>

          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {item.summary}
          </p>

          {item.tags && item.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <Tag
                size={11}
                className="text-slate-400 dark:text-slate-500"
                aria-hidden="true"
              />
              {item.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-purple-50/80 px-2 py-0.5 text-[10px] font-medium text-purple-700 ring-1 ring-purple-100 dark:bg-purple-950/50 dark:text-purple-300 dark:ring-purple-900/40"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto pt-4">
            <SourceAttributionBadge
              sourceName={item.sourceName}
              sourceUrl={item.sourceUrl}
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
}
