import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from './Label';
import { ErrorMessage } from './ErrorMessage';

interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
  error?: string | boolean;
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      required,
      options,
      placeholder,
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
          <select
            ref={ref}
            id={inputId}
            className={cn(
              'h-10 w-full appearance-none rounded-md border bg-transparent px-3 pr-9 text-sm text-[rgb(var(--color-text-primary))] transition-colors focus-ring',
              error
                ? 'border-danger-500 focus-visible:border-danger-500'
                : 'border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-border-hover))]',
              !props.value && 'text-secondary-400',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400"
          />
        </div>
        <ErrorMessage message={errorMessage} />
        {hint && !error && (
          <p className="mt-1 text-xs text-secondary-500">{hint}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
