import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from './Label';
import { ErrorMessage } from './ErrorMessage';

interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  error?: string | boolean;
  disabled?: boolean;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  label,
  required,
  placeholder = 'Select items',
  error,
  disabled = false,
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const errorMessage =
    typeof error === 'string'
      ? error
      : error
        ? 'This field is required'
        : undefined;

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  const handleToggle = useCallback(
    (optionValue: string) => {
      const newValue = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];
      onChange(newValue);
    },
    [value, onChange]
  );

  const handleRemove = useCallback(
    (optionValue: string, e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(value.filter((v) => v !== optionValue));
    },
    [value, onChange]
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <Label required={required} className="mb-1.5">
          {label}
        </Label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border bg-transparent px-3 text-left text-sm transition-colors focus-ring',
          error
            ? 'border-danger-500'
            : 'border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-border-hover))]',
          isOpen && 'ring-2 ring-primary-500 ring-offset-2',
          disabled && 'opacity-[var(--opacity-disabled)] cursor-not-allowed',
          className
        )}
      >
        <span className="flex flex-wrap gap-1 overflow-hidden">
          {selectedOptions.length === 0 && (
            <span className="text-secondary-400">{placeholder}</span>
          )}
          {selectedOptions.map((opt) => (
            <span
              key={opt.value}
              className="inline-flex items-center gap-1 rounded bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300"
            >
              {opt.label}
              <button
                type="button"
                onClick={(e) => handleRemove(opt.value, e)}
                className="rounded-full p-0.5 hover:bg-primary-100 dark:hover:bg-primary-800"
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            'shrink-0 text-secondary-400 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="relative z-50 mt-1 max-h-60 overflow-auto rounded-md border border-[rgb(var(--color-border))] bg-white py-1 shadow-md dark:bg-secondary-800">
          {options.map((option) => {
            const isSelected = value.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleToggle(option.value)}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-secondary-50 dark:hover:bg-secondary-700',
                  isSelected &&
                    'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                )}
              >
                <span
                  className={cn(
                    'flex h-4 w-4 items-center justify-center rounded border transition-colors',
                    isSelected
                      ? 'border-primary-500 bg-primary-500 text-white'
                      : 'border-secondary-300 dark:border-secondary-600'
                  )}
                >
                  {isSelected && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                {option.label}
              </button>
            );
          })}
        </div>
      )}
      <ErrorMessage message={errorMessage} />
    </div>
  );
}
