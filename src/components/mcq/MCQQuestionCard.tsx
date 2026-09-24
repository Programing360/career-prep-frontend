import { useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MCQQuestion, MCQOption } from '@/types/mcq';
import { MCQExplanationPanel } from './MCQExplanationPanel';

interface MCQQuestionCardProps {
  question: MCQQuestion;
  questionNumber: number;
  selectedOptionId: string | null;
  isRevealed: boolean;
  correctOptionId?: string | null;
  explanation?: string;
  onSelectOption: (questionId: string, optionId: string) => void;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
};

const optionVariants = {
  hidden: { opacity: 0, x: -8 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, delay: i * 0.05 },
  }),
};

export function MCQQuestionCard({
  question,
  questionNumber,
  selectedOptionId,
  isRevealed,
  correctOptionId,
  explanation,
  onSelectOption,
}: MCQQuestionCardProps) {
  const selectedOption = selectedOptionId
    ? question.options.find((o) => o.id === selectedOptionId)
    : null;
  // The revealed correct option id: prefer the server-graded value, falling
  // back to the locally-marked correct option (used in offline/mock flows).
  const revealedCorrectId =
    correctOptionId !== undefined
      ? correctOptionId
      : (question.options.find((o) => o.isCorrect)?.id ?? null);
  const isAnswerCorrect =
    isRevealed && selectedOption?.id === revealedCorrectId;
  // console.log(question);
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, option: MCQOption) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!isRevealed) {
          onSelectOption(question._id, option.id);
        }
      }
    },
    [isRevealed, onSelectOption, question._id]
  );

  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate="show"
      className={cn(
        'rounded-xl border p-5 transition-all',
        isRevealed && isAnswerCorrect
          ? 'border-accent-300 bg-accent-50/50 dark:border-accent-700 dark:bg-accent-950/50'
          : isRevealed && selectedOption && !isAnswerCorrect
            ? 'border-danger-300 bg-danger-50/50 dark:border-danger-700 dark:bg-danger-950/50'
            : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]'
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
            isRevealed && isAnswerCorrect
              ? 'bg-accent-500 text-white'
              : isRevealed && selectedOption && !isAnswerCorrect
                ? 'bg-danger-500 text-white'
                : 'bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-secondary))]'
          )}
        >
          {isRevealed && selectedOption ? (
            isAnswerCorrect ? (
              <Check size={14} />
            ) : (
              <X size={14} />
            )
          ) : (
            questionNumber
          )}
        </span>
        <div className="flex-1">
          <p className="font-medium text-[rgb(var(--color-text-primary))]">
            {question.question}
          </p>
          {question.imageUrl && (
            <img
              src={question.imageUrl}
              alt={`Illustration for question ${questionNumber}`}
              className="mt-3 max-h-48 rounded-lg border border-[rgb(var(--color-border))] object-contain"
            />
          )}
          {question.formulaNotation && (
            <div className="mt-2 inline-block rounded-md bg-[rgb(var(--color-surface-elevated))] px-3 py-1.5 font-mono text-sm text-[rgb(var(--color-text-secondary))]">
              {question.formulaNotation}
            </div>
          )}
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
            question.difficulty === 'easy' &&
              'bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300',
            question.difficulty === 'medium' &&
              'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
            question.difficulty === 'hard' &&
              'bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300'
          )}
        >
          {question.difficulty}
        </span>
      </div>

      <div
        className="mt-4 grid gap-2 sm:grid-cols-2"
        role="radiogroup"
        aria-label={`Options for question ${questionNumber}`}
      >
        {question.options.map((option, optIndex) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrectOption =
            revealedCorrectId !== null && option.id === revealedCorrectId;
          const showAsCorrect = isRevealed && isCorrectOption;
          const showAsWrong = isRevealed && isSelected && !isCorrectOption;
          // console.log(isRevealed, isCorrectOption, option);
          return (
            <motion.button
              key={option.id}
              custom={optIndex}
              variants={optionVariants}
              initial="hidden"
              animate="show"
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-disabled={isRevealed}
              disabled={isRevealed}
              tabIndex={isRevealed ? -1 : 0}
              onClick={() => onSelectOption(question._id, option.id)}
              onKeyDown={(e) => handleKeyDown(e, option)}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-all focus-ring',
                showAsCorrect
                  ? 'border-accent-400 bg-accent-100 text-accent-800 dark:border-accent-600 dark:bg-accent-900 dark:text-accent-200'
                  : showAsWrong
                    ? 'border-danger-400 bg-danger-100 text-danger-800 dark:border-danger-600 dark:bg-danger-900 dark:text-danger-200'
                    : isRevealed
                      ? 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] opacity-50'
                      : isSelected
                        ? 'border-primary-400 bg-primary-50 dark:border-primary-600 dark:bg-primary-950'
                        : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] hover:border-primary-300 hover:bg-primary-50 dark:hover:border-primary-700 dark:hover:bg-primary-950'
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                  showAsCorrect
                    ? 'bg-accent-500 text-white'
                    : showAsWrong
                      ? 'bg-danger-500 text-white'
                      : isSelected
                        ? 'bg-primary-500 text-white'
                        : 'bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-muted))]'
                )}
              >
                {showAsCorrect ? (
                  <Check size={10} />
                ) : showAsWrong ? (
                  <X size={10} />
                ) : (
                  OPTION_LABELS[optIndex]
                )}
              </span>
              <span className="flex-1">{option.text}</span>
            </motion.button>
          );
        })}
      </div>

      <MCQExplanationPanel
        explanation={explanation ?? question.explanation}
        isRevealed={isRevealed}
      />
    </motion.div>
  );
}
