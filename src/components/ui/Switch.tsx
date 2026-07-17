import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  label?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, className, disabled, ...props }, ref) => {
    return (
      <label
        className={cn(
          'inline-flex items-center gap-2.5 cursor-pointer select-none',
          disabled && 'opacity-[var(--opacity-disabled)] cursor-not-allowed',
          className
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        <span
          className={cn(
            'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-ring',
            'bg-secondary-300 peer-checked:bg-primary-500',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2',
            'peer-disabled:cursor-not-allowed'
          )}
        >
          <span
            className={cn(
              'pointer-events-none inline-block h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform',
              'translate-x-[1px] peer-checked:translate-x-[18px]'
            )}
          />
        </span>
        {label && (
          <span className="text-sm text-[rgb(var(--color-text-primary))]">
            {label}
          </span>
        )}
      </label>
    );
  }
);

Switch.displayName = 'Switch';
