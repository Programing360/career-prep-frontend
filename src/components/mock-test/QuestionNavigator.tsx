import { useMemo, useState } from 'react';
import { ChevronDown, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MockQuestion, UserAnswer } from '@/types/mockTest';

interface QuestionNavigatorProps {
  questions: MockQuestion[];
  answers: UserAnswer[];
  currentIndex: number;
  onSelect: (index: number) => void;
  defaultCollapsed?: boolean;
  className?: string;
}

type CellState =
  'answered' | 'answered-flagged' | 'flagged' | 'visited' | 'unvisited';

function cellState(answer: UserAnswer | undefined): CellState {
  if (!answer) return 'unvisited';
  if (answer.selectedOptionId) {
    return answer.isFlagged ? 'answered-flagged' : 'answered';
  }
  return answer.isFlagged ? 'flagged' : 'visited';
}

function cellClasses(state: CellState): string {
  switch (state) {
    case 'answered':
      return 'bg-accent-500 text-white border-accent-500';
    case 'answered-flagged':
      return 'bg-violet-500 text-white border-violet-500';
    case 'flagged':
      return 'bg-violet-100 text-violet-700 border-violet-400 dark:bg-violet-900 dark:text-violet-300 dark:border-violet-600';
    case 'visited':
      return 'bg-danger-100 text-danger-700 border-danger-400 dark:bg-danger-900 dark:text-danger-300 dark:border-danger-600';
    case 'unvisited':
      return 'bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-muted))] border-[rgb(var(--color-border))]';
  }
}

export function QuestionNavigator({
  questions,
  answers,
  currentIndex,
  onSelect,
  defaultCollapsed = false,
  className,
}: QuestionNavigatorProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const stats = useMemo(() => {
    let answered = 0;
    let flagged = 0;
    for (const answer of answers) {
      if (answer.selectedOptionId) answered += 1;
      if (answer.isFlagged) flagged += 1;
    }
    return {
      answered,
      flagged,
      total: questions.length,
      unanswered: questions.length - answered,
    };
  }, [answers, questions.length]);

  return (
    <div className={cn('flex h-full flex-col', className)}>
      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        aria-expanded={!collapsed}
        className="flex w-full items-center justify-between rounded-md px-1 py-1 text-left focus-ring"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-[rgb(var(--color-text-primary))]">
          <ListChecks
            size={16}
            className="text-primary-500"
            aria-hidden="true"
          />
          Question Palette
        </span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={cn(
            'text-[rgb(var(--color-text-muted))] transition-transform duration-200',
            collapsed && '-rotate-90'
          )}
        />
      </button>

      {!collapsed && (
        <>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-accent-500" />
              <span className="text-[rgb(var(--color-text-secondary))]">
                Answered ({stats.answered})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-violet-100 border border-violet-400 dark:bg-violet-900 dark:border-violet-600" />
              <span className="text-[rgb(var(--color-text-secondary))]">
                Marked ({stats.flagged})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-danger-100 border border-danger-400 dark:bg-danger-900 dark:border-danger-600" />
              <span className="text-[rgb(var(--color-text-secondary))]">
                Unanswered ({stats.unanswered})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))]" />
              <span className="text-[rgb(var(--color-text-secondary))]">
                Not Visited ({stats.total - answers.length})
              </span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5 overflow-y-auto">
            {questions.map((question, index) => {
              const answer = answers.find((a) => a.questionId === question._id);
              const state = cellState(answer);
              const isCurrent = index === currentIndex;
              return (
                <button
                  key={question._id}
                  type="button"
                  onClick={() => onSelect(index)}
                  aria-label={`Go to question ${index + 1}`}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-md border text-xs font-bold transition-all focus-ring',
                    isCurrent &&
                      'ring-2 ring-primary-500 ring-offset-1 ring-offset-[rgb(var(--color-surface))]',
                    cellClasses(state)
                  )}
                >
                  {answer?.isFlagged ? (
                    <span className="relative">
                      {index + 1}
                      <span className="absolute -right-1.5 -top-1.5 h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                  ) : (
                    index + 1
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-auto border-t border-[rgb(var(--color-border))] pt-3">
            <div className="space-y-1.5 text-xs text-[rgb(var(--color-text-secondary))]">
              <div className="flex justify-between">
                <span>Total Questions</span>
                <span className="font-semibold text-[rgb(var(--color-text-primary))]">
                  {stats.total}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Answered</span>
                <span className="font-semibold text-accent-600">
                  {stats.answered}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Unanswered</span>
                <span className="font-semibold text-[rgb(var(--color-text-primary))]">
                  {stats.unanswered}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Marked for Review</span>
                <span className="font-semibold text-violet-600">
                  {stats.flagged}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
