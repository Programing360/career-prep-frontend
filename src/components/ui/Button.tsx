import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white border-transparent hover:bg-primary-hover active:bg-primary-hover',
  secondary:
    'bg-secondary-500 text-white border-transparent hover:bg-secondary-600 active:bg-secondary-700',
  outline:
    'bg-transparent text-primary border border-primary hover:bg-accent active:bg-accent-hover',
  ghost:
    'bg-transparent text-[rgb(var(--color-text-primary))] border-transparent hover:bg-secondary-100 active:bg-secondary-200 dark:hover:bg-secondary-800 dark:active:bg-secondary-700',
  link: 'bg-transparent text-primary border-transparent underline underline-offset-2 hover:text-primary-hover px-1',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      className,
      children,
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
          fullWidth && 'w-full',
          isDisabled &&
            'pointer-events-none opacity-[var(--opacity-disabled)] cursor-not-allowed',
          className
        )}
        {...props}
      >
        {isLoading && <Spinner size={size === 'sm' ? 14 : 16} />}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
