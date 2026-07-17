import { forwardRef, useRef, useEffect, type InputHTMLAttributes } from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'indeterminate'
> {
  label?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, indeterminate, className, disabled, ...props }, ref) => {
    const innerRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = indeterminate ?? false;
      }
    }, [indeterminate]);

    const setRef = (el: HTMLInputElement | null) => {
      innerRef.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) ref.current = el;
    };

    return (
      <label
        className={cn(
          'inline-flex items-center gap-2 cursor-pointer select-none',
          disabled && 'opacity-[var(--opacity-disabled)] cursor-not-allowed',
          className
        )}
      >
        <input
          ref={setRef}
          type="checkbox"
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        <span
          className={cn(
            'flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border-2 transition-colors focus-ring',
            'peer-checked:bg-primary-500 peer-checked:border-primary-500 peer-checked:text-white',
            'border-[rgb(var(--color-border))] text-transparent',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2'
          )}
        >
          {indeterminate ? (
            <Minus size={12} strokeWidth={3} />
          ) : (
            <Check
              size={12}
              strokeWidth={3}
              className="peer-checked:opacity-100 opacity-0"
            />
          )}
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

Checkbox.displayName = 'Checkbox';
