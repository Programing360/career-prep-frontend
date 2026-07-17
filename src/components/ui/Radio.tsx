import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  label?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className, disabled, ...props }, ref) => {
    return (
      <label
        className={cn(
          'inline-flex items-center gap-2 cursor-pointer select-none',
          disabled && 'opacity-[var(--opacity-disabled)] cursor-not-allowed',
          className
        )}
      >
        <input
          ref={ref}
          type="radio"
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        <span
          className={cn(
            'flex h-[18px] w-[18px] items-center justify-center rounded-full border-[1.5px] transition-colors focus-ring',
            'border-[rgb(var(--color-border))]',
            'peer-checked:border-primary-500',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2'
          )}
        >
          <span
            className={cn(
              'h-2 w-2 rounded-full bg-primary-500 transition-transform',
              'scale-0 peer-checked:scale-100'
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

Radio.displayName = 'Radio';
