import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Filter,
  Timer,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { MCQQuestionCard } from './MCQQuestionCard';
import { MCQFilterChips } from './MCQFilterChips';
import { MCQPaywallModal } from './MCQPaywallModal';
import { getMcqPreview, getTopics } from '@/services/mcqService';
import type { MCQQuestion, MCQFilterState, MCQUserProgress } from '@/types/mcq';
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
  const [filters, setFilters] = useState<MCQFilterState>({
    page: 1,
  });
  const [showFilters, setShowFilters] = useState(!isEmbedded);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState<MCQUserProgress>(
    loadPersistedProgress() ?? {
      answeredCount: 0,
      correctCount: 0,
      history: {},
    }
  );

  const [paywallOpen, setPaywallOpen] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isGuest = true;

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
      try {
        const [questionsRes, topicsRes] = await Promise.all([
          getMcqPreview(examSlug, filters),
          getTopics(),
        ]);
        if (!cancelled) {
          setQuestions(questionsRes.data);
          setTopics(topicsRes);
        }
      } catch {
        // silently handle
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [examSlug, filters]);

  const handleSelectOption = useCallback(
    (questionId: string, optionId: string) => {
      if (progress.history[questionId]) return;

      const question = questions.find((q) => q.id === questionId);
      if (!question) return;

      const selectedOption = question.options.find((o) => o.id === optionId);
      if (!selectedOption) return;

      const isCorrect = selectedOption.isCorrect === true;

      const newProgress: MCQUserProgress = {
        answeredCount: progress.answeredCount + 1,
        correctCount: progress.correctCount + (isCorrect ? 1 : 0),
        history: {
          ...progress.history,
          [questionId]: {
            selectedOptionId: optionId,
            isCorrect,
          },
        },
      };

      setProgress(newProgress);

      if (isGuest && newProgress.answeredCount >= FREE_PREVIEW_LIMIT) {
        setPaywallOpen(true);
      }
    },
    [progress, questions, isGuest]
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
        difficulty,
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
        if (q && !progress.history[q.id]) {
          const optIndex = parseInt(e.key, 10) - 1;
          if (q.options[optIndex]) {
            handleSelectOption(q.id, q.options[optIndex].id);
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
                ? `Question ${Math.min(currentIndex + 1, totalForDisplay)} of ${totalForDisplay} â€” Free Preview`
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
      {loading ? (
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
                key={currentQuestion.id}
                question={currentQuestion}
                questionNumber={currentIndex + 1}
                selectedOptionId={
                  progress.history[currentQuestion.id]?.selectedOptionId ?? null
                }
                isRevealed={!!progress.history[currentQuestion.id]}
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
                const isAnswered = !!progress.history[q.id];
                const isCorrect = progress.history[q.id]?.isCorrect;
                return (
                  <button
                    key={q.id}
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
            className="mt-8 rounded-xl border border-accent-200 bg-accent-50/50 p-6 text-center dark:border-accent-800 dark:bg-accent-950/50"
          >
            <p className="text-lg font-bold font-heading text-[rgb(var(--color-text-primary))]">
              All Done!
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
            <Button size="sm" className="mt-4" onClick={handleReset}>
              <RotateCcw size={14} />
              Practice Again
            </Button>
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
