import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Label } from './Label';
import { ErrorMessage } from './ErrorMessage';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  error?: string | boolean;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, required, error, hint, className, id, rows = 4, ...props },
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
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={cn(
            'w-full rounded-md border bg-transparent px-3 py-2.5 text-sm text-[rgb(var(--color-text-primary))] placeholder:text-secondary-400 transition-colors focus-ring resize-none',
            error
              ? 'border-danger-500 focus-visible:border-danger-500'
              : 'border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-border-hover))]',
            className
          )}
          {...props}
        />
        <ErrorMessage message={errorMessage} />
        {hint && !error && (
          <p className="mt-1 text-xs text-secondary-500">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
