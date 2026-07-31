import { ArrowLeft, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ServerSyncedTimer } from './ServerSyncedTimer';
import type { TestType } from '@/types/mockTest';

interface MockTestHeaderProps {
  title: string;
  testType: TestType;
  sessionId: string;
  expiresAt: string;
  isActive: boolean;
  isSubmitting?: boolean;
  onExpire: () => void;
  onSubmit: () => void;
  onExit: () => void;
}

const TEST_TYPE_LABELS: Record<TestType, string> = {
  mock_demo: 'Demo Mode',
  verbal_nonverbal: 'Verbal & Non-Verbal',
};

export function MockTestHeader({
  title,
  testType,
  sessionId,
  expiresAt,
  isActive,
  isSubmitting = false,
  onExpire,
  onSubmit,
  onExit,
}: MockTestHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onExit}
          aria-label="Exit mock test"
          className="shrink-0 rounded-md p-1.5 text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-[rgb(var(--color-surface-elevated))] focus-ring"
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </button>
        <h1 className="truncate text-sm font-semibold text-[rgb(var(--color-text-primary))] sm:text-base">
          {title}
        </h1>
        <span
          className={cn(
            'hidden shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide sm:inline-flex',
            'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
          )}
        >
          <Zap size={10} aria-hidden="true" />
          {TEST_TYPE_LABELS[testType]}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <ServerSyncedTimer
          sessionId={sessionId}
          expiresAt={expiresAt}
          isActive={isActive}
          onExpire={onExpire}
        />
        <Button
          size="sm"
          variant="outline"
          isLoading={isSubmitting}
          onClick={onSubmit}
          className="border-danger-300 text-danger-600 hover:bg-danger-50 dark:border-danger-700 dark:text-danger-400 dark:hover:bg-danger-950"
        >
          Submit
        </Button>
      </div>
    </header>
  );
}
