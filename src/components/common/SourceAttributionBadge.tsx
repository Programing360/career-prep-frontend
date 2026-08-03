import { BadgeCheck, ExternalLink, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SourceAttributionBadgeProps {
  sourceName: string;
  sourceUrl?: string;
  verified?: boolean;
  className?: string;
}

export function SourceAttributionBadge({
  sourceName,
  sourceUrl,
  verified = false,
  className,
}: SourceAttributionBadgeProps) {
  const tooltip = verified
    ? `Verified from ${sourceName}. This item has been cross-checked against official sources.`
    : `Source: ${sourceName}. Reproduced with attribution to the original publication.`;

  const label = verified ? (
    <>
      <BadgeCheck size={12} className="shrink-0" aria-hidden="true" />
      <span>Verified from</span>
      <span className="font-bold">{sourceName}</span>
    </>
  ) : (
    <>
      <ShieldCheck size={12} className="shrink-0" aria-hidden="true" />
      <span>Source:</span>
      <span className="font-bold">{sourceName}</span>
    </>
  );

  const badgeClasses = cn(
    'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap',
    verified
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/80 dark:bg-emerald-950/60 dark:text-emerald-300'
      : 'border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700/80 dark:bg-gray-800/60 dark:text-gray-300',
    className
  );

  if (sourceUrl) {
    return (
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        title={tooltip}
        aria-label={`${tooltip} Opens in a new tab.`}
        className={cn(badgeClasses, 'focus-ring hover:opacity-80')}
      >
        {label}
        <ExternalLink
          size={11}
          className="shrink-0 opacity-70"
          aria-hidden="true"
        />
      </a>
    );
  }

  return (
    <span title={tooltip} aria-label={tooltip} className={badgeClasses}>
      {label}
    </span>
  );
}
