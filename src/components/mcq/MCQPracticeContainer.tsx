import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Filter,
  Timer,
  LayoutDashboard,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { MCQQuestionCard } from './MCQQuestionCard';
import { MCQFilterChips } from './MCQFilterChips';
import { MCQPaywallModal } from './MCQPaywallModal';
import { ROUTES } from '@/constants/routes';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUserProgress } from '@/store/slices/authSlice';
import {
  getMcqPreview,
  getTopics,
  submitMcqAnswers,
  saveMcqProgressAnswer,
  submitMcqExamProgress,
} from '@/services/mcqService';
import type {
  MCQQuestion,
  MCQFilterState,
  MCQUserProgress,
  DifficultyLevel,
  MCQSubmissionAnswer,
} from '@/types/mcq';
import type { TopicOption } from '@/services/mcqService';

const FREE_PREVIEW_LIMIT = 20;
const SESSION_STORAGE_KEY = 'mcq-practice-progress';

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

interface MCQPracticeContainerProps {
  examSlug: string;
  isEmbedded?: boolean;
}

function loadPersistedProgress(): MCQUserProgress | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MCQUserProgress;
  } catch {
    return null;
  }
}

function savePersistedProgress(progress: MCQUserProgress) {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // sessionStorage may be full or unavailable
  }
}

export function MCQPracticeContainer({
  examSlug,
  isEmbedded = false,
}: MCQPracticeContainerProps) {
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [topics, setTopics] = useState<TopicOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MCQFilterState>({
    page: 1,
  });

  // console.log(filters);
  const [showFilters, setShowFilters] = useState(!isEmbedded);
  const [retryKey, setRetryKey] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState<MCQUserProgress>(
    loadPersistedProgress() ?? {
      answeredCount: 0,
      correctCount: 0,
      history: {},
    }
  );
  // console.log(progress);

  const [paywallOpen, setPaywallOpen] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const isGuest = !isAuthenticated;

  useEffect(() => {
    savePersistedProgress(progress);
  }, [progress]);

  const visibleQuestions = useMemo(() => {
    if (!isGuest) return questions;
    return questions.slice(0, FREE_PREVIEW_LIMIT);
  }, [questions, isGuest]);

  const totalForDisplay = isGuest
    ? Math.min(questions.length, FREE_PREVIEW_LIMIT)
    : questions.length;

  const allDone =
    !loading &&
    visibleQuestions.length > 0 &&
    progress.answeredCount >= visibleQuestions.length;

  useEffect(() => {
    const shouldRun =
      !loading && visibleQuestions.length > 0 && !paywallOpen && !allDone;

    if (shouldRun && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }

    if (!shouldRun && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [loading, visibleQuestions.length, paywallOpen, allDone]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [questionsRes, topicsRes] = await Promise.all([
          getMcqPreview(examSlug, filters),
          getTopics(),
        ]);
        if (!cancelled) {
          setQuestions(questionsRes.data);
          setTopics(topicsRes);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load questions. Please try again.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [examSlug, filters, retryKey]);

  const handleSelectOption = useCallback(
    async (questionId: string, optionId: string) => {
      if (progress.history[questionId]) return;

      const question = questions.find((q) => q._id === questionId);
      if (!question) return;

      const selectedOption = question.options.find((o) => o.id === optionId);
      if (!selectedOption) return;

      if (isAuthenticated) {
        saveMcqProgressAnswer(examSlug, questionId, optionId, currentIndex);
      }

      let graded = false;
      try {
        const res = await submitMcqAnswers([
          { questionId, selectedOptionId: optionId },
        ]);
        const result = res.results.find((r) => r.questionId === questionId);
        if (result) {
          const isCorrect = result.correct;
          const newProgress: MCQUserProgress = {
            answeredCount: progress.answeredCount + 1,
            correctCount: progress.correctCount + (isCorrect ? 1 : 0),
            history: {
              ...progress.history,
              [questionId]: {
                selectedOptionId: optionId,
                isCorrect,
                correctOptionId: result.correctOptionId,
                explanation: result.explanation,
              },
            },
          };
          graded = true;
          setProgress(newProgress);

          if (isGuest && newProgress.answeredCount >= FREE_PREVIEW_LIMIT) {
            setPaywallOpen(true);
          }
        }
      } catch {
        // Fall back to local grading when the server is unreachable
      }

      if (!graded) {
        const isCorrect = selectedOption.isCorrect === true;
        const newProgress: MCQUserProgress = {
          answeredCount: progress.answeredCount + 1,
          correctCount: progress.correctCount + (isCorrect ? 1 : 0),
          history: {
            ...progress.history,
            [questionId]: {
              selectedOptionId: optionId,
              isCorrect,
              correctOptionId: isCorrect ? optionId : null,
            },
          },
        };
        setProgress(newProgress);

        if (isGuest && newProgress.answeredCount >= FREE_PREVIEW_LIMIT) {
          setPaywallOpen(true);
        }
      }
    },
    [progress, questions, isGuest, isAuthenticated, examSlug, currentIndex]
  );

  const handleTopicChange = useCallback((topicId: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      topicId,
      page: 1,
    }));
    setCurrentIndex(0);
    setProgress({
      answeredCount: 0,
      correctCount: 0,
      history: {},
    });
    setElapsedSeconds(0);
  }, []);

  const handleDifficultyChange = useCallback(
    (difficulty: string | undefined) => {
      setFilters((prev) => ({
        ...prev,
        difficulty: difficulty as DifficultyLevel | undefined,
        page: 1,
      }));
      setCurrentIndex(0);
      setProgress({
        answeredCount: 0,
        correctCount: 0,
        history: {},
      });
      setElapsedSeconds(0);
    },
    []
  );

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    setProgress({
      answeredCount: 0,
      correctCount: 0,
      history: {},
    });
    setElapsedSeconds(0);
    setPaywallOpen(false);
  }, []);

  const handleSubmitAnswers = useCallback(async () => {
    const payload: MCQSubmissionAnswer[] = Object.entries(progress.history).map(
      ([questionId, entry]) => ({
        questionId,
        selectedOptionId: entry.selectedOptionId,
      })
    );
    if (payload.length === 0) return;
    try {
      if (isAuthenticated) {
        const res = await submitMcqExamProgress(examSlug, payload);
        if (res) {
          dispatch(
            updateUserProgress({
              xp: res.xpEarned ?? progress.correctCount * 10,
              readinessScore:
                res.scorePercentage ??
                Math.round(
                  (progress.correctCount /
                    Math.max(1, progress.answeredCount)) *
                    100
                ),
            })
          );
        }
      } else {
        await submitMcqAnswers(payload);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to submit answers. Please try again.'
      );
    }
  }, [
    progress.history,
    isAuthenticated,
    examSlug,
    dispatch,
    progress.correctCount,
    progress.answeredCount,
  ]);

  const submitFired = useRef(false);

  useEffect(() => {
    if (allDone && !submitFired.current) {
      submitFired.current = true;
      handleSubmitAnswers();
    }
    if (!allDone && submitFired.current) {
      submitFired.current = false;
    }
  }, [allDone, handleSubmitAnswers]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(visibleQuestions.length - 1, prev + 1));
  }, [visibleQuestions.length]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (paywallOpen) return;

      const active = document.activeElement;
      const isInput =
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement;
      if (isInput) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      } else if (e.key >= '1' && e.key <= '4') {
        const q = visibleQuestions[currentIndex];
        if (q && !progress.history[q._id]) {
          const optIndex = parseInt(e.key, 10) - 1;
          if (q.options[optIndex]) {
            handleSelectOption(q._id, q.options[optIndex].id);
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    paywallOpen,
    goToPrev,
    goToNext,
    visibleQuestions,
    currentIndex,
    progress.history,
    handleSelectOption,
  ]);

  const currentQuestion = visibleQuestions[currentIndex];

  const accuracy =
    progress.answeredCount > 0
      ? Math.round((progress.correctCount / progress.answeredCount) * 100)
      : 0;

  return (
    <div
      className={cn('mx-auto w-full', isEmbedded ? 'max-w-3xl' : 'max-w-4xl')}
    >
      {/* Header & Progress */}
      <div className="mb-6 space-y-4">
        {!isEmbedded && (
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
              MCQ Practice
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters((prev) => !prev)}
              >
                <Filter size={14} />
                Filters
              </Button>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw size={14} />
                Reset
              </Button>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-[rgb(var(--color-text-secondary))]">
              {isGuest
                ? `Question ${Math.min(currentIndex + 1, totalForDisplay)} of ${totalForDisplay} — Free Preview`
                : `Question ${currentIndex + 1} of ${visibleQuestions.length}`}
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[rgb(var(--color-text-muted))]">
                <Timer size={12} />
                {formatElapsed(elapsedSeconds)}
              </span>
              <span className="text-[rgb(var(--color-text-muted))]">
                {progress.answeredCount} answered
              </span>
              {progress.answeredCount > 0 && (
                <span
                  className={cn(
                    'font-semibold',
                    accuracy >= 70
                      ? 'text-accent-500'
                      : accuracy >= 40
                        ? 'text-primary-500'
                        : 'text-danger-500'
                  )}
                >
                  {accuracy}% accuracy
                </span>
              )}
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[rgb(var(--color-surface-elevated))]">
            <motion.div
              className="h-full rounded-full bg-primary-500"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentIndex + 1) / totalForDisplay) * 100}%`,
              }}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
            />
          </div>
          {isGuest && (
            <p className="mt-1 text-right text-[10px] text-[rgb(var(--color-text-muted))]">
              {Math.max(0, FREE_PREVIEW_LIMIT - progress.answeredCount)} free
              questions remaining
            </p>
          )}
        </div>
      </div>

      {/* Filter Chips */}
      {showFilters && !isEmbedded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mb-6 overflow-hidden rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4"
        >
          <MCQFilterChips
            topics={topics}
            selectedTopicId={filters.topicId}
            selectedDifficulty={filters.difficulty}
            onSelectTopic={handleTopicChange}
            onSelectDifficulty={handleDifficultyChange}
          />
        </motion.div>
      )}

      {/* Content */}
      {error ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-danger-200 bg-danger-50/40 py-20 text-center dark:border-danger-800">
          <p className="text-sm text-[rgb(var(--color-text-secondary))]">
            {error}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setError(null);
              setRetryKey((k) => k + 1);
            }}
          >
            Retry
          </Button>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner size={32} />
          <p className="mt-4 text-sm text-[rgb(var(--color-text-muted))]">
            Loading questions...
          </p>
        </div>
      ) : visibleQuestions.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-sm text-[rgb(var(--color-text-muted))]">
            No questions found for the selected filters.
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3"
            onClick={handleReset}
          >
            <RotateCcw size={14} />
            Reset Filters
          </Button>
        </div>
      ) : (
        <>
          {/* Question Card (single-card mode) */}
          <div aria-live="polite" aria-atomic="true">
            {currentQuestion && (
              <MCQQuestionCard
                key={currentQuestion._id}
                question={currentQuestion}
                questionNumber={currentIndex + 1}
                selectedOptionId={
                  progress.history[currentQuestion._id]?.selectedOptionId ??
                  null
                }
                isRevealed={!!progress.history[currentQuestion._id]}
                correctOptionId={
                  progress.history[currentQuestion._id]?.correctOptionId
                }
                explanation={progress.history[currentQuestion._id]?.explanation}
                onSelectOption={handleSelectOption}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrev}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={14} />
              Previous
            </Button>

            <div className="flex items-center gap-1.5">
              {visibleQuestions.map((q, i) => {
                const isAnswered = !!progress.history[q._id];
                const isCorrect = progress.history[q._id]?.isCorrect;
                return (
                  <button
                    key={q._id}
                    type="button"
                    onClick={() => setCurrentIndex(i)}
                    className={cn(
                      'h-2 rounded-full transition-all',
                      i === currentIndex
                        ? 'w-6 bg-primary-500'
                        : isAnswered
                          ? isCorrect
                            ? 'w-2 bg-accent-400'
                            : 'w-2 bg-danger-400'
                          : 'w-2 bg-[rgb(var(--color-surface-elevated))]'
                    )}
                    aria-label={`Go to question ${i + 1}`}
                  />
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNext}
              disabled={currentIndex >= visibleQuestions.length - 1}
            >
              Next
              <ChevronRight size={14} />
            </Button>
          </div>
        </>
      )}

      {/* Summary when all visible questions are answered */}
      {!loading &&
        visibleQuestions.length > 0 &&
        progress.answeredCount >= visibleQuestions.length && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-8 rounded-xl border border-accent-200 bg-accent-50/50 p-6 text-center shadow-lg dark:border-accent-800 dark:bg-accent-950/50"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-100 text-accent-600 dark:bg-accent-900/50 dark:text-accent-300">
              <CheckCircle2 size={24} />
            </div>
            <p className="text-xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
              Exam MCQs Submitted!
            </p>
            <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
              You answered{' '}
              <span className="font-semibold text-accent-600 dark:text-accent-400">
                {progress.correctCount}
              </span>{' '}
              out of{' '}
              <span className="font-semibold">{progress.answeredCount}</span>{' '}
              questions correctly ({accuracy}% accuracy).
            </p>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-violet-600 dark:text-violet-400">
              <Zap size={14} />+{progress.correctCount * 10} XP Earned & Saved
              to Database
            </div>
            <div className="mt-5 flex items-center justify-center gap-3">
              <Button size="sm" variant="outline" onClick={handleReset}>
                <RotateCcw size={14} />
                Practice Again
              </Button>
              <Link
                to={ROUTES.DASHBOARD}
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700 shadow-md"
              >
                <LayoutDashboard size={14} />
                View User Dashboard
              </Link>
            </div>
          </motion.div>
        )}

      {/* Paywall Modal */}
      {isGuest && (
        <MCQPaywallModal
          isOpen={paywallOpen}
          onClose={() => setPaywallOpen(false)}
          answeredCount={progress.answeredCount}
        />
      )}
    </div>
  );
}
