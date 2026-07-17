import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <section className={cn('w-full', className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
          {title}
        </h3>
        {description && (
          <p className="mt-0.5 text-sm text-secondary-500">{description}</p>
        )}
      </div>
      <div className="mb-4 h-px w-full bg-[rgb(var(--color-border))]" />
      <div className="space-y-4">{children}</div>
    </section>
  );
}
