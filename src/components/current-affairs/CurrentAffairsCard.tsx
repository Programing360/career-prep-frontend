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
          'flex h-full flex-col overflow-hidden rounded-xl border backdrop-blur-md transition-all duration-200',
          'border-white/20 bg-white/70 hover:shadow-lg dark:border-gray-800/50 dark:bg-gray-900/70'
        )}
      >
        {item.imageUrl ? (
          <div className="relative h-40 shrink-0 overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex h-24 shrink-0 items-center justify-center bg-gradient-to-br from-primary-500/10 to-accent-500/10">
            <Newspaper
              size={32}
              className="text-primary-400/60 dark:text-primary-500/50"
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
            <span className="inline-flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
              <Calendar size={11} aria-hidden="true" />
              <time dateTime={item.publicationDate}>
                {formatRelativeTime(item.publicationDate)}
              </time>
            </span>
          </div>

          <h3
            className={cn(
              'mt-3 text-base font-bold font-heading leading-snug',
              'text-gray-900 group-hover:text-primary-600',
              'dark:text-white dark:group-hover:text-primary-400'
            )}
          >
            {item.title}
          </h3>

          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {item.summary}
          </p>

          {item.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <Tag
                size={11}
                className="text-gray-400 dark:text-gray-500"
                aria-hidden="true"
              />
              {item.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-gray-100/80 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-800/80 dark:text-gray-400"
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
