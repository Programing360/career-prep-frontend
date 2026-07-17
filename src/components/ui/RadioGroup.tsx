import { cn } from '@/lib/utils';
import { Radio } from './Radio';

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  name: string;
  disabled?: boolean;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function RadioGroup({
  options,
  value,
  onChange,
  name,
  disabled = false,
  className,
  orientation = 'vertical',
}: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      className={cn(
        orientation === 'horizontal'
          ? 'flex flex-wrap gap-4'
          : 'flex flex-col gap-3',
        className
      )}
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          name={name}
          value={option.value}
          label={option.label}
          checked={value === option.value}
          onChange={() => onChange?.(option.value)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
