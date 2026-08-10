import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Lightbulb, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { DailyQuiz } from '@/types/dailyQuiz';
import examLottie from '../../assets/Quiz-1.svg';
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
  'flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all duration-200 focus-ring';

function getOptionClasses(
  answered: boolean,
  isCorrect: boolean,
  isSelected: boolean
): string {
  if (!answered) {
    return cn(
      OPTION_BASE_CLASSES,
      'border-slate-200/80 bg-white/80 text-slate-800 shadow-sm backdrop-blur-md',
      'hover:border-purple-400 hover:bg-purple-50/50 hover:shadow-md',
      'dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-200',
      'dark:hover:border-purple-600 dark:hover:bg-purple-950/40'
    );
  }
  if (isCorrect) {
    return cn(
      OPTION_BASE_CLASSES,
      'border-emerald-500 bg-emerald-50/90 text-emerald-900 shadow-sm',
      'dark:border-emerald-500/60 dark:bg-emerald-950/60 dark:text-emerald-200'
    );
  }
  if (isSelected) {
    return cn(
      OPTION_BASE_CLASSES,
      'border-rose-400 bg-rose-50/90 text-rose-800 shadow-sm',
      'dark:border-rose-600/60 dark:bg-rose-950/60 dark:text-rose-200'
    );
  }
  return cn(
    OPTION_BASE_CLASSES,
    'border-slate-200/40 bg-slate-50/50 text-slate-400 opacity-60 backdrop-blur-md',
    'dark:border-slate-800/40 dark:bg-slate-900/40 dark:text-slate-600'
  );
}

function getLetterClasses(
  answered: boolean,
  isCorrect: boolean,
  isSelected: boolean
): string {
  if (!answered) {
    return 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300';
  }
  if (isCorrect) {
    return 'bg-emerald-500 text-white shadow-sm';
  }
  if (isSelected) {
    return 'bg-rose-500 text-white shadow-sm';
  }
  return 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500';
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
    <div className="mx-auto w-full max-w-5xl">
      {/* Progress Bar & Indicators */}
      <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-purple-100/60 bg-white/60 p-4 backdrop-blur-md dark:border-purple-950/40 dark:bg-slate-900/60">
        <div className="flex flex-1 items-center gap-2">
          {quiz.questions.map((q, index) => {
            const isDone =
              index < questionIndex || (index === questionIndex && answered);
            const isCurrent = index === questionIndex;

            return (
              <div key={q.id} className="relative flex-1">
                <span
                  className={cn(
                    'block h-2 rounded-full transition-all duration-300',
                    isDone
                      ? isCorrect || index < questionIndex
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : 'bg-gradient-to-r from-rose-500 to-pink-500'
                      : isCurrent
                        ? 'bg-purple-600 ring-2 ring-purple-300 dark:ring-purple-800'
                        : 'bg-slate-200 dark:bg-slate-800'
                  )}
                />
              </div>
            );
          })}
        </div>
        <span className="shrink-0 rounded-lg bg-purple-100 px-2.5 py-1 text-xs font-bold tabular-nums text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
          {questionIndex + 1} / {quiz.questions.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="overflow-hidden rounded-3xl border border-purple-100 dark:border-purple-900/30 bg-white/80 dark:bg-slate-900/80 shadow-xl backdrop-blur-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Side: Visual/Lottie Banner Section */}
            <div className="relative flex flex-col items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-700 to-violet-900 p-8 text-white lg:col-span-5">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent)]" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-4 flex h-64 w-72 items-center justify-center rounded-2xl bg-white/10 p-2 backdrop-blur-md shadow-2xl ring-1 ring-white/20">
                  {/* <iframe
                    src="https://lottie.host/embed/849c63b2-7bc0-4e5a-a3a8-44d4dd2c22ec/7o0w63o9Jb.lottie"
                    title="Interactive Quiz Animation"
                    className="h-full w-full rounded-xl border-0 pointer-events-none"
                  /> */}
                  <img
                    src={examLottie}
                    alt="Exam Lottie Animation"
                    className="h-full w-full  rounded-xl border-0 pointer-events-none"
                  />
                </div>

                <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-purple-100 backdrop-blur-md">
                  Question {questionIndex + 1}
                </span>
                <p className="mt-2 text-xs text-purple-200/90 max-w-xs">
                  Take your time, analyze each option carefully before picking!
                </p>
              </div>
            </div>

            {/* Right Side: Question & Options Section */}
            <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                  {question.text}
                </h2>

                <div
                  className="mt-6 space-y-3"
                  role="radiogroup"
                  aria-label={`Options for question ${questionIndex + 1}`}
                >
                  {question.options.map((option, index) => {
                    const isCorrectOption =
                      option.id === question.correctAnswerId;
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
                            'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors',
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
                        <span className="flex-1 font-medium">
                          {option.text}
                        </span>
                        {answered && isCorrectOption && (
                          <CheckCircle2
                            size={20}
                            className="shrink-0 text-emerald-600 dark:text-emerald-400"
                            aria-hidden="true"
                          />
                        )}
                        {answered && isSelectedOption && !isCorrectOption && (
                          <XCircle
                            size={20}
                            className="shrink-0 text-rose-500 dark:text-rose-400"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                <AnimatePresence>
                  {answered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div
                        className={cn(
                          'mt-5 rounded-2xl border p-4 shadow-sm backdrop-blur-md',
                          isCorrect
                            ? 'border-emerald-500/40 bg-emerald-50/80 dark:border-emerald-600/40 dark:bg-emerald-950/40'
                            : 'border-rose-400/40 bg-rose-50/80 dark:border-rose-600/40 dark:bg-rose-950/40'
                        )}
                      >
                        <p
                          className={cn(
                            'flex items-center gap-2 text-sm font-bold',
                            isCorrect
                              ? 'text-emerald-800 dark:text-emerald-200'
                              : 'text-rose-800 dark:text-rose-200'
                          )}
                        >
                          {isCorrect ? (
                            <CheckCircle2 size={18} aria-hidden="true" />
                          ) : (
                            <XCircle size={18} aria-hidden="true" />
                          )}
                          {isCorrect
                            ? 'Well Done! Correct Answer'
                            : 'Not quite right'}
                        </p>
                        {!isCorrect && (
                          <p className="mt-1 text-xs font-semibold text-rose-700 dark:text-rose-300">
                            Correct Answer:{' '}
                            <span className="underline decoration-rose-400">
                              {
                                question.options.find(
                                  (o) => o.id === question.correctAnswerId
                                )?.text
                              }
                            </span>
                          </p>
                        )}
                        <p className="mt-2.5 flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                          <Lightbulb
                            size={16}
                            className="mt-0.5 shrink-0 text-amber-500"
                            aria-hidden="true"
                          />
                          <span>{question.explanation}</span>
                        </p>
                      </div>

                      <div className="mt-5">
                        <Button
                          size="lg"
                          fullWidth
                          onClick={onNext}
                          isLoading={isSubmitting}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/20"
                          rightIcon={
                            !isSubmitting && (
                              <ArrowRight size={16} aria-hidden="true" />
                            )
                          }
                        >
                          {isLastQuestion
                            ? 'Complete & View Score'
                            : 'Next Question'}
                        </Button>
                        <p className="mt-2 text-center text-[11px] text-slate-400 dark:text-slate-500">
                          Press{' '}
                          <kbd className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                            Enter
                          </kbd>{' '}
                          to continue
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {!answered && (
                <p className="mt-6 text-center text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  Shortcut: Press{' '}
                  <kbd className="rounded bg-slate-100 px-1 py-0.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    1
                  </kbd>{' '}
                  -{' '}
                  <kbd className="rounded bg-slate-100 px-1 py-0.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {quiz.questions[questionIndex].options.length}
                  </kbd>{' '}
                  on your keyboard to select an answer.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
