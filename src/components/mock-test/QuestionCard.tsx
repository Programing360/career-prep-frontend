import { Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NonVerbalImageRenderer } from './NonVerbalImageRenderer';
import type { MockQuestion, UserAnswer } from '@/types/mockTest';

interface QuestionCardProps {
  question: MockQuestion;
  questionNumber: number;
  totalQuestions: number;
  answer: UserAnswer | undefined;
  isActive: boolean;
  onSelect: (optionId: string) => void;
  onToggleFlag: () => void;
}

function letterLabel(optionIndex: number): string {
  return String.fromCharCode(65 + optionIndex);
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  answer,
  isActive,
  onSelect,
  onToggleFlag,
}: QuestionCardProps) {
  const isFlagged = Boolean(answer?.isFlagged);
  const hasImageOptions = question.options.some((option) => option.imageUrl);

  return (
    <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-[rgb(var(--color-text-muted))]">
          Question {questionNumber} of {totalQuestions}
        </span>
        <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-700 dark:bg-primary-900 dark:text-primary-300">
          {question.subjectCategory}
        </span>
      </div>

      <p className="text-[15px] font-medium leading-relaxed text-[rgb(var(--color-text-primary))]">
        {question.text}
      </p>

      {question.questionImageUrl && (
        <div className="mt-4">
          <NonVerbalImageRenderer
            src={question.questionImageUrl}
            alt={question.text}
            caption="Tap to view this diagram full-screen"
          />
        </div>
      )}

      {hasImageOptions ? (
        <div className="mt-5 grid grid-cols-2 gap-3">
          {question.options.map((option, optionIndex) => {
            const isSelected = answer?.selectedOptionId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                disabled={!isActive}
                onClick={() => onSelect(option.id)}
                className={cn(
                  'group relative flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all focus-ring',
                  isSelected
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                    : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] hover:border-primary-300 hover:bg-primary-50/50 dark:hover:border-primary-700 dark:hover:bg-primary-950/50',
                  !isActive && 'opacity-60'
                )}
              >
                <span
                  className={cn(
                    'absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border-[1.5px] text-[11px] font-bold transition-colors',
                    isSelected
                      ? 'border-primary-500 bg-primary-500 text-white'
                      : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-text-muted))]'
                  )}
                >
                  {letterLabel(optionIndex)}
                </span>
                {option.imageUrl && (
                  <img
                    src={option.imageUrl}
                    alt={option.text}
                    loading="lazy"
                    className="mt-2 h-24 w-24 object-contain"
                  />
                )}
                <span className="text-xs font-medium text-[rgb(var(--color-text-secondary))]">
                  {option.text}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 space-y-2.5">
          {question.options.map((option, optionIndex) => {
            const isSelected = answer?.selectedOptionId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                disabled={!isActive}
                onClick={() => onSelect(option.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all focus-ring',
                  isSelected
                    ? 'border-primary-400 bg-primary-50 text-primary-700 dark:border-primary-600 dark:bg-primary-950 dark:text-primary-300'
                    : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] hover:border-primary-300 hover:bg-primary-50/50 dark:hover:border-primary-700 dark:hover:bg-primary-950/50',
                  !isActive && 'opacity-60'
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[1.5px] text-xs font-bold transition-colors',
                    isSelected
                      ? 'border-primary-500 bg-primary-500 text-white'
                      : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-text-muted))]'
                  )}
                >
                  {letterLabel(optionIndex)}
                </span>
                <span className="flex-1">{option.text}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-[rgb(var(--color-border))] pt-4">
        <button
          type="button"
          disabled={!isActive}
          onClick={onToggleFlag}
          className={cn(
            'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all focus-ring',
            isFlagged
              ? 'border-violet-400 bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300'
              : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-text-secondary))] hover:border-violet-300 hover:text-violet-600',
            !isActive && 'opacity-60'
          )}
        >
          <Flag
            size={12}
            className={isFlagged ? 'fill-current' : ''}
            aria-hidden="true"
          />
          {isFlagged ? 'Unmark Review' : 'Mark for Review'}
        </button>
      </div>
    </div>
  );
}
