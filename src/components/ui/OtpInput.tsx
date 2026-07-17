import {
  useRef,
  useCallback,
  type KeyboardEvent,
  type ClipboardEvent,
} from 'react';
import { cn } from '@/lib/utils';
import { Label } from './Label';
import { ErrorMessage } from './ErrorMessage';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  error?: string | boolean;
  disabled?: boolean;
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  label,
  required,
  error,
  disabled = false,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const errorMessage =
    typeof error === 'string'
      ? error
      : error
        ? 'This field is required'
        : undefined;

  const focusInput = useCallback(
    (index: number) => {
      const nextIndex = Math.min(index, length - 1);
      inputRefs.current[nextIndex]?.focus();
      inputRefs.current[nextIndex]?.select();
    },
    [length]
  );

  const handleChange = useCallback(
    (index: number, digit: string) => {
      if (disabled) return;
      if (!/^\d*$/.test(digit)) return;

      const newValue = value.split('');
      newValue[index] = digit;
      const joined = newValue.join('').slice(0, length);
      onChange(joined);

      if (digit && index < length - 1) {
        focusInput(index + 1);
      }
    },
    [value, onChange, length, disabled, focusInput]
  );

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        const newValue = value.split('');
        if (value[index]) {
          newValue[index] = '';
          onChange(newValue.join(''));
        } else if (index > 0) {
          newValue[index - 1] = '';
          onChange(newValue.join(''));
          focusInput(index - 1);
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault();
        focusInput(index - 1);
      } else if (e.key === 'ArrowRight' && index < length - 1) {
        e.preventDefault();
        focusInput(index + 1);
      }
    },
    [value, onChange, length, disabled, focusInput]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      if (disabled) return;
      e.preventDefault();

      const pasted = e.clipboardData
        .getData('text')
        .replace(/\D/g, '')
        .slice(0, length);
      if (pasted) {
        onChange(pasted);
        const nextIndex = Math.min(pasted.length, length - 1);
        focusInput(nextIndex);
      }
    },
    [onChange, length, disabled, focusInput]
  );

  const digits = value.split('').concat(Array(length - value.length).fill(''));

  return (
    <div className="w-full">
      {label && (
        <Label required={required} className="mb-1.5">
          {label}
        </Label>
      )}
      <div className="flex gap-2">
        {digits.slice(0, length).map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={disabled}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={cn(
              'h-10 w-10 rounded-md border bg-transparent text-center text-sm font-medium text-[rgb(var(--color-text-primary))] transition-colors focus-ring',
              error
                ? 'border-danger-500'
                : 'border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-border-hover))]',
              disabled && 'opacity-[var(--opacity-disabled)] cursor-not-allowed'
            )}
          />
        ))}
      </div>
      <ErrorMessage message={errorMessage} />
    </div>
  );
}
