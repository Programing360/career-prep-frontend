import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Label } from './Label';
import { ErrorMessage } from './ErrorMessage';

interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
  glass?: boolean;
}

export function FormField({
  label,
  required,
  error,
  hint,
  children,
  className,
  glass = false,
}: FormFieldProps) {
  return (
    <div
      className={cn(
        glass &&
          'rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-glass)/0.8)] p-4 backdrop-blur-sm',
        !glass && 'w-full',
        className
      )}
    >
      {label && (
        <Label required={required} className="mb-1.5">
          {label}
        </Label>
      )}
      {children}
      <ErrorMessage message={error} />
      {hint && !error && (
        <p className="mt-1 text-xs text-secondary-500">{hint}</p>
      )}
    </div>
  );
}
