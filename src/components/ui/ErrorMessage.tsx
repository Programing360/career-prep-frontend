import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message?: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <p role="alert" className={cn('mt-1 text-xs text-danger-500', className)}>
      {message}
    </p>
  );
}
