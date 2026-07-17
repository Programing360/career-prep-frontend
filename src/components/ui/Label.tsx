import { forwardRef, type LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { RequiredBadge } from './RequiredBadge';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ required, className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'block text-[13px] font-medium text-[rgb(var(--color-text-primary))]',
          className
        )}
        {...props}
      >
        {children}
        {required && <RequiredBadge />}
      </label>
    );
  }
);

Label.displayName = 'Label';
