import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Label } from './Label';
import { ErrorMessage } from './ErrorMessage';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string | boolean;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      required,
      leftIcon,
      rightIcon,
      error,
      hint,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId =
      id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorMessage =
      typeof error === 'string'
        ? error
        : error
          ? 'This field is required'
          : undefined;

    return (
      <div className="w-full">
        {label && (
          <Label htmlFor={inputId} required={required} className="mb-1.5">
            {label}
          </Label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'h-10 w-full rounded-md border bg-transparent px-3 text-sm text-[rgb(var(--color-text-primary))] placeholder:text-secondary-400 transition-colors focus-ring',
              error
                ? 'border-danger-500 focus-visible:border-danger-500'
                : 'border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-border-hover))]',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">
              {rightIcon}
            </span>
          )}
        </div>
        <ErrorMessage message={errorMessage} />
        {hint && !error && (
          <p className="mt-1 text-xs text-secondary-500">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
