import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

type IconButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  'aria-label': string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<IconButtonVariant, string> = {
  primary:
    'bg-primary-500 text-white border-transparent hover:bg-primary-600 active:bg-primary-700',
  secondary:
    'bg-secondary-500 text-white border-transparent hover:bg-secondary-600 active:bg-secondary-700',
  outline:
    'bg-transparent text-primary-500 border border-primary-500 hover:bg-primary-50 active:bg-primary-100 dark:hover:bg-primary-950 dark:active:bg-primary-900',
  ghost:
    'bg-transparent text-[rgb(var(--color-text-primary))] border-transparent hover:bg-secondary-100 active:bg-secondary-200 dark:hover:bg-secondary-800 dark:active:bg-secondary-700',
};

const sizeStyles: Record<IconButtonSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

const iconSizes: Record<IconButtonSize, number> = {
  sm: 14,
  md: 18,
  lg: 20,
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      variant = 'ghost',
      size = 'md',
      isLoading = false,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center rounded-md border font-medium transition-colors focus-ring',
          variantStyles[variant],
          sizeStyles[size],
          isDisabled &&
            'pointer-events-none opacity-[var(--opacity-disabled)] cursor-not-allowed',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Spinner size={iconSizes[size]} />
        ) : (
          <span className="flex items-center justify-center">{icon}</span>
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
