import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { formatRelativeTime } from '@/utils/dateHelpers';
import { getCurrentAffairs } from '@/services/currentAffairsService';
import { SourceAttributionBadge } from '@/components/common/SourceAttributionBadge';
import { getCategoryClass } from './categoryStyles';
import type { CurrentAffairsItem } from '@/types/currentAffairs';

interface CurrentAffairsCompactWidgetProps {
  title?: string;
  limit?: number;
  className?: string;
}

const ROW_CLASSES = 'flex h-[96px] flex-col justify-center py-2.5';

function RowSkeleton() {
  return (
    <li className={cn(ROW_CLASSES, 'animate-pulse')} aria-hidden="true">
      <div className="flex items-center justify-between gap-2">
        <div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-10 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="mt-1.5 h-5 w-full rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-1.5 h-[22px] w-28 rounded-full bg-gray-200 dark:bg-gray-700" />
    </li>
  );
}

export function CurrentAffairsCompactWidget({
  title = 'Today\u2019s Current Affairs',
  limit = 4,
  className,
}: CurrentAffairsCompactWidgetProps) {
  const [items, setItems] = useState<CurrentAffairsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    getCurrentAffairs({ limit })
      .then((res) => {
        if (!active) return;
        setItems(res.data);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setItems([]);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [limit]);

  return (
    <section
      aria-label={title}
      className={cn(
        'overflow-hidden rounded-xl border backdrop-blur-md',
        'border-white/20 bg-white/70 dark:border-gray-800/50 dark:bg-gray-900/70',
        className
      )}
    >
      <header className="flex items-center justify-between gap-2 border-b border-gray-200/60 px-4 py-3 dark:border-gray-800/60">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900">
            <Newspaper
              size={14}
              className="text-primary-600 dark:text-primary-400"
              aria-hidden="true"
            />
          </span>
          <h2 className="truncate text-sm font-bold font-heading text-gray-900 dark:text-white">
            {title}
          </h2>
        </div>
        <Link
          to={ROUTES.CURRENT_AFFAIRS}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 focus-ring dark:text-primary-400 dark:hover:text-primary-300"
        >
          View all
          <ArrowRight size={12} aria-hidden="true" />
        </Link>
      </header>

      {loading ? (
        <ul className="divide-y divide-gray-200/60 dark:divide-gray-800/60">
          {Array.from({ length: limit }).map((_, i) => (
            <RowSkeleton key={i} />
          ))}
        </ul>
      ) : items.length > 0 ? (
        <ul className="divide-y divide-gray-200/60 dark:divide-gray-800/60">
          {items.map((item) => (
            <li key={item.id} className={ROW_CLASSES}>
              <div className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    'inline-flex max-w-[60%] truncate rounded-full px-2 py-0.5 text-[10px] font-semibold',
                    getCategoryClass(item.category)
                  )}
                >
                  {item.category}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
                  <Clock size={10} aria-hidden="true" />
                  <time dateTime={item.publicationDate}>
                    {formatRelativeTime(item.publicationDate)}
                  </time>
                </span>
              </div>
              <p className="mt-1.5 truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                {item.title}
              </p>
              <div className="mt-1.5">
                <SourceAttributionBadge
                  sourceName={item.sourceName}
                  sourceUrl={item.sourceUrl}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-4 py-6 text-center text-xs text-gray-500 dark:text-gray-400">
          No current affairs available right now. Check back soon.
        </p>
      )}
    </section>
  );
}
