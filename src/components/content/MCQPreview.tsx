import { useState, useCallback } from 'react';
import { Check, X, ChevronRight, Brain, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { PaywallModal } from './PaywallModal';
import type { MCQ } from '@/types';

const FREE_QUESTION_LIMIT = 3;

interface AnswerState {
  selectedOptionId: string;
  isCorrect: boolean;
}

interface MCQPreviewProps {
  questions: MCQ[];
  isPremiumView?: boolean;
}

export function MCQPreview({
  questions,
  isPremiumView = false,
}: MCQPreviewProps) {
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallTriggered, setPaywallTriggered] = useState(false);

  const answeredCount = Object.keys(answers).length;

  const handleAnswer = useCallback(
    (questionId: string, optionId: string, isCorrect: boolean) => {
      if (answers[questionId]) return;

      setAnswers((prev) => ({
        ...prev,
        [questionId]: {
          selectedOptionId: optionId,
          isCorrect,
        },
      }));
    },
    [answers]
  );

  const showAll = isPremiumView || !paywallTriggered;

  const visibleQuestions = showAll
    ? questions
    : questions.slice(0, FREE_QUESTION_LIMIT);

  const getNextLockedIndex = useCallback(
    (currentIndex: number) => {
      if (isPremiumView || paywallTriggered) return -1;
      const nextIndex = currentIndex + 1;
      if (
        nextIndex >= FREE_QUESTION_LIMIT &&
        nextIndex < questions.length &&
        !paywallTriggered
      ) {
        return nextIndex;
      }
      return -1;
    },
    [isPremiumView, paywallTriggered, questions.length]
  );

  const handleNextQuestion = useCallback(
    (currentIndex: number) => {
      if (isPremiumView) return;
      const lockedIndex = getNextLockedIndex(currentIndex);
      if (lockedIndex !== -1) {
        setPaywallTriggered(true);
        setPaywallOpen(true);
      }
    },
    [isPremiumView, getNextLockedIndex]
  );

  const isQuestionLocked = (index: number) => {
    return !isPremiumView && paywallTriggered && index >= FREE_QUESTION_LIMIT;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
          Free Practice Questions
        </h3>
        <span className="text-sm text-[rgb(var(--color-text-muted))]">
          {answeredCount}/{questions.length} answered
        </span>
      </div>

      {visibleQuestions.map((question, index) => {
        const answer = answers[question._id];
        const isLocked = isQuestionLocked(index);
        const isRevealed = !!answer;
        const isLastUnlocked =
          index === FREE_QUESTION_LIMIT - 1 && !paywallTriggered;

        return (
          <div
            key={question._id}
            className={cn(
              'rounded-xl border p-5 transition-all',
              isLocked
                ? 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] opacity-60'
                : isRevealed && answer.isCorrect
                  ? 'border-accent-300 bg-accent-50/50 dark:border-accent-700 dark:bg-accent-950/50'
                  : isRevealed && !answer.isCorrect
                    ? 'border-danger-300 bg-danger-50/50 dark:border-danger-700 dark:bg-danger-950/50'
                    : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]'
            )}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  isRevealed && answer.isCorrect
                    ? 'bg-accent-500 text-white'
                    : isRevealed && !answer.isCorrect
                      ? 'bg-danger-500 text-white'
                      : 'bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-secondary))]'
                )}
              >
                {isRevealed ? (
                  answer.isCorrect ? (
                    <Check size={14} />
                  ) : (
                    <X size={14} />
                  )
                ) : (
                  index + 1
                )}
              </span>
              <div className="flex-1">
                <p className="font-medium text-[rgb(var(--color-text-primary))]">
                  {question.question}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {question.options.map((option, optIndex) => {
                const isOptionSelected =
                  isRevealed && answer.selectedOptionId === option.id;
                const isCorrectOption = !!option.isCorrect;
                const showAsCorrect = isRevealed && isCorrectOption;
                const showAsWrong = isOptionSelected && !answer.isCorrect;

                return (
                  <button
                    key={option.id}
                    disabled={isRevealed || isLocked}
                    onClick={() =>
                      handleAnswer(question._id, option.id, isCorrectOption)
                    }
                    className={cn(
                      'flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-all',
                      showAsCorrect
                        ? 'border-accent-400 bg-accent-100 text-accent-800 dark:border-accent-600 dark:bg-accent-900 dark:text-accent-200'
                        : showAsWrong
                          ? 'border-danger-400 bg-danger-100 text-danger-800 dark:border-danger-600 dark:bg-danger-900 dark:text-danger-200'
                          : isRevealed
                            ? 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] opacity-50'
                            : isLocked
                              ? 'cursor-not-allowed border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))]'
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
                            : 'bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-muted))]'
                      )}
                    >
                      {showAsCorrect ? (
                        <Check size={10} />
                      ) : showAsWrong ? (
                        <X size={10} />
                      ) : (
                        String.fromCharCode(65 + optIndex)
                      )}
                    </span>
                    <span className="flex-1">{option.text}</span>
                  </button>
                );
              })}
            </div>

            {isRevealed && question.explanation && (
              <div className="mt-4 rounded-lg border border-primary-200 bg-primary-50/50 p-3 dark:border-primary-800 dark:bg-primary-950/50">
                <div className="flex items-start gap-2">
                  <Brain
                    size={16}
                    className="mt-0.5 shrink-0 text-primary-500"
                  />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                      AI Explanation
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[rgb(var(--color-text-secondary))]">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isRevealed && isLastUnlocked && (
              <div className="mt-4 flex justify-end">
                <Button size="sm" onClick={() => handleNextQuestion(index)}>
                  Next Question
                  <ChevronRight size={14} />
                </Button>
              </div>
            )}

            {isLocked && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-3">
                <Lock
                  size={14}
                  className="shrink-0 text-[rgb(var(--color-text-muted))]"
                />
                <span className="text-sm text-[rgb(var(--color-text-muted))]">
                  Register to unlock this question
                </span>
              </div>
            )}
          </div>
        );
      })}

      {!isPremiumView && paywallTriggered && (
        <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 text-center">
          <Lock
            size={24}
            className="mx-auto mb-2 text-[rgb(var(--color-text-muted))]"
          />
          <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
            You&apos;ve reached the free preview limit
          </p>
          <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
            Register to unlock all {questions.length} questions with AI-powered
            explanations.
          </p>
          <Button size="sm" className="mt-4">
            <span
              className="flex items-center gap-2"
              onClick={() => setPaywallOpen(true)}
            >
              Unlock Full Access
              <ChevronRight size={14} />
            </span>
          </Button>
        </div>
      )}

      {!isPremiumView && (
        <PaywallModal
          isOpen={paywallOpen}
          onClose={() => setPaywallOpen(false)}
        />
      )}
    </div>
  );
}
