import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
  showLabel?: boolean;
  label?: ReactNode;
  labelClassName?: string;
}

export function ProgressBar({
  value,
  className,
  trackClassName,
  fillClassName,
  showLabel = false,
  label,
  labelClassName,
}: ProgressBarProps) {
  const percent = Math.min(Math.max(Math.round(value), 0), 100);

  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && (
        <div
          className={cn(
            'flex items-center justify-between text-sm',
            labelClassName
          )}
        >
          <span>{label}</span>
          <span className="tabular-nums">{percent}%</span>
        </div>
      )}
      <div
        className={cn(
          'h-2.5 w-full overflow-hidden rounded-full bg-[rgb(var(--color-surface-elevated))]',
          trackClassName
        )}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            'h-full rounded-full bg-primary-500 transition-[width] duration-300 ease-out',
            fillClassName
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
