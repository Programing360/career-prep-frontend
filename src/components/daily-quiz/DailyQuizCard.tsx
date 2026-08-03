import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Lightbulb, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { DailyQuiz } from '@/types/dailyQuiz';

interface DailyQuizCardProps {
  quiz: DailyQuiz;
  questionIndex: number;
  answers: Record<string, string>;
  onSelect: (questionId: string, optionId: string) => void;
  onNext: () => void;
  isSubmitting?: boolean;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

const OPTION_BASE_CLASSES =
  'flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-colors focus-ring';

function getOptionClasses(
  answered: boolean,
  isCorrect: boolean,
  isSelected: boolean
): string {
  if (!answered) {
    return cn(
      OPTION_BASE_CLASSES,
      'border-white/20 bg-white/70 backdrop-blur-md text-gray-800',
      'hover:border-primary-300 hover:bg-primary-50',
      'dark:border-gray-800/50 dark:bg-gray-900/70 dark:text-gray-200',
      'dark:hover:border-primary-800 dark:hover:bg-primary-950/50'
    );
  }
  if (isCorrect) {
    return cn(
      OPTION_BASE_CLASSES,
      'border-emerald-500 bg-emerald-50 text-emerald-800',
      'dark:border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-200'
    );
  }
  if (isSelected) {
    return cn(
      OPTION_BASE_CLASSES,
      'border-danger-400 bg-danger-50 text-danger-700',
      'dark:border-danger-600 dark:bg-danger-950/40 dark:text-danger-200'
    );
  }
  return cn(
    OPTION_BASE_CLASSES,
    'border-white/20 bg-white/70 text-gray-500 backdrop-blur-md',
    'dark:border-gray-800/50 dark:bg-gray-900/70 dark:text-gray-500'
  );
}

function getLetterClasses(
  answered: boolean,
  isCorrect: boolean,
  isSelected: boolean
): string {
  if (!answered) {
    return 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300';
  }
  if (isCorrect) {
    return 'bg-emerald-500 text-white';
  }
  if (isSelected) {
    return 'bg-danger-400 text-white';
  }
  return 'bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-500';
}

export function DailyQuizCard({
  quiz,
  questionIndex,
  answers,
  onSelect,
  onNext,
  isSubmitting = false,
}: DailyQuizCardProps) {
  const question = quiz.questions[questionIndex];
  const selectedOptionId = answers[question.id];
  const answered = Boolean(selectedOptionId);
  const isLastQuestion = questionIndex === quiz.questions.length - 1;
  const isCorrect = answered && selectedOptionId === question.correctAnswerId;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-1.5">
          {quiz.questions.map((q, index) => {
            const isDone =
              index < questionIndex || (index === questionIndex && answered);
            return (
              <span
                key={q.id}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors',
                  isDone
                    ? isCorrect || index < questionIndex
                      ? 'bg-emerald-500'
                      : 'bg-danger-400'
                    : 'bg-gray-200 dark:bg-gray-800'
                )}
                aria-hidden="true"
              />
            );
          })}
        </div>
        <span className="shrink-0 text-xs font-semibold tabular-nums text-gray-400 dark:text-gray-500">
          {questionIndex + 1}/{quiz.questions.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <div className="mt-6 rounded-2xl border border-white/20 bg-white/70 p-5 shadow-sm backdrop-blur-md sm:p-6 dark:border-gray-800/50 dark:bg-gray-900/70">
            <h2 className="text-lg font-bold font-heading leading-snug text-gray-900 dark:text-white sm:text-xl">
              {question.text}
            </h2>

            <div
              className="mt-5 space-y-2.5"
              role="radiogroup"
              aria-label={`Options for question ${questionIndex + 1}`}
            >
              {question.options.map((option, index) => {
                const isCorrectOption = option.id === question.correctAnswerId;
                const isSelectedOption = option.id === selectedOptionId;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelectedOption}
                    disabled={answered}
                    onClick={() => onSelect(question.id, option.id)}
                    className={getOptionClasses(
                      answered,
                      isCorrectOption,
                      isSelectedOption
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold',
                        getLetterClasses(
                          answered,
                          isCorrectOption,
                          isSelectedOption
                        )
                      )}
                      aria-hidden="true"
                    >
                      {OPTION_LETTERS[index]}
                    </span>
                    <span className="flex-1">{option.text}</span>
                    {answered && isCorrectOption && (
                      <CheckCircle2
                        size={18}
                        className="shrink-0 text-emerald-600 dark:text-emerald-400"
                        aria-hidden="true"
                      />
                    )}
                    {answered && isSelectedOption && !isCorrectOption && (
                      <XCircle
                        size={18}
                        className="shrink-0 text-danger-500 dark:text-danger-400"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {answered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div
                    className={cn(
                      'mt-4 rounded-xl border px-4 py-3',
                      isCorrect
                        ? 'border-emerald-500/50 bg-emerald-50 dark:border-emerald-600/40 dark:bg-emerald-950/40'
                        : 'border-danger-400/50 bg-danger-50 dark:border-danger-600/40 dark:bg-danger-950/40'
                    )}
                  >
                    <p
                      className={cn(
                        'flex items-center gap-1.5 text-sm font-bold',
                        isCorrect
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : 'text-danger-700 dark:text-danger-300'
                      )}
                    >
                      {isCorrect ? (
                        <CheckCircle2 size={15} aria-hidden="true" />
                      ) : (
                        <XCircle size={15} aria-hidden="true" />
                      )}
                      {isCorrect ? 'Correct!' : 'Not quite'}
                    </p>
                    {!isCorrect && (
                      <p className="mt-1 text-xs font-medium text-danger-700 dark:text-danger-300">
                        The correct answer is{' '}
                        <span className="font-bold">
                          {
                            question.options.find(
                              (o) => o.id === question.correctAnswerId
                            )?.text
                          }
                        </span>
                        .
                      </p>
                    )}
                    <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                      <Lightbulb
                        size={13}
                        className="mt-0.5 shrink-0 text-amber-500"
                        aria-hidden="true"
                      />
                      {question.explanation}
                    </p>
                  </div>

                  <div className="mt-4">
                    <Button
                      size="lg"
                      fullWidth
                      onClick={onNext}
                      isLoading={isSubmitting}
                      rightIcon={
                        !isSubmitting && (
                          <ArrowRight size={16} aria-hidden="true" />
                        )
                      }
                    >
                      {isLastQuestion ? 'See My Score' : 'Continue'}
                    </Button>
                    <p className="mt-2 text-center text-[11px] text-gray-400 dark:text-gray-500">
                      Press Enter to continue
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>

      {!answered && (
        <p className="mt-3 text-center text-[11px] text-gray-400 dark:text-gray-500">
          Press 1–{quiz.questions[questionIndex].options.length} to answer
        </p>
      )}
    </div>
  );
}
