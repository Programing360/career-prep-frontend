/**
 * ArmyTestPracticePage
 *
 * Dedicated practice interface for Army Test / ISSB / Initial Test category.
 * - Fetches live MCQs: GET /api/v1/mcqs?category=army-test[&topicId=...]
 * - No hardcoded fallback arrays — loading / empty states are explicit.
 * - "✨ Ask AI Tutor (10 Tokens)" button on each revealed MCQ explanation.
 * - On 403 (insufficient tokens) opens PricingModal automatically.
 * - Decrements header token balance in real-time via Redux aiTutorSlice.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Timer,
  Loader2,
  CheckCircle2,
  Zap,
  LayoutDashboard,
  Sparkles,
  Brain,
  AlertCircle,
  ShieldCheck,
  X,
  Check,
  Coins,
  Crown,
  XIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ROUTES } from '@/constants/routes';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTokensRemaining, logTokenUsage } from '@/store/slices/aiTutorSlice';
import { updateUserProgress } from '@/store/slices/authSlice';
import {
  getMcqsByCategory,
  submitMcqAnswers,
  submitMcqExamProgress,
} from '@/services/mcqService';
import { explainMcq } from '@/services/aiApi';
import type { MCQQuestion, MCQSubmissionAnswer } from '@/types/mcq';
import ReactMarkdown from 'react-markdown';
// ─── Constants ───────────────────────────────────────────────────────────────
const ARMY_SUBJECTS = [
  { id: '__all__', label: 'All Subjects' },
  { id: 'verbal-reasoning', label: 'Verbal Reasoning' },
  { id: 'non-verbal', label: 'Non-Verbal Intelligence' },
  { id: 'english', label: 'English' },
  { id: 'math', label: 'Math' },
  { id: 'general-knowledge', label: 'General Knowledge' },
];

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const TOKEN_PACKS = [
  {
    id: 'pack-50',
    name: '50 Tokens',
    tokens: 50,
    price: 'PKR 99',
    pricePerToken: 'PKR 1.98 / token',
    badge: undefined as string | undefined,
  },
  {
    id: 'pack-200',
    name: '200 Tokens',
    tokens: 200,
    price: 'PKR 299',
    pricePerToken: 'PKR 1.50 / token',
    badge: 'Popular',
  },
  {
    id: 'pack-500',
    name: '500 Tokens',
    tokens: 500,
    price: 'PKR 599',
    pricePerToken: 'PKR 1.20 / token',
    badge: 'Best Value',
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    tokens: 9999,
    price: 'PKR 999/mo',
    pricePerToken: 'Unlimited queries',
    badge: undefined,
  },
];

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface AnswerEntry {
  selectedOptionId: string;
  isCorrect: boolean;
  correctOptionId?: string | null;
  explanation?: string;
  /** Set by AI Tutor call — replaces/augments the default explanation */
  aiExplanation?: string;
}

interface ProgressState {
  answeredCount: number;
  correctCount: number;
  history: Record<string, AnswerEntry>;
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ArmyTestPracticePage() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const { tokensRemaining } = useAppSelector((s) => s.aiTutor);
  // console.log(tokensRemaining);
  const [searchParams] = useSearchParams();

  // Questions
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  // Subject filter
  const urlSubject = searchParams.get('subject') ?? '__all__';
  const [selectedSubject, setSelectedSubject] = useState(urlSubject);

  // Navigation
  const [currentIndex, setCurrentIndex] = useState(0);

  // Progress
  const [progress, setProgress] = useState<ProgressState>({
    answeredCount: 0,
    correctCount: 0,
    history: {},
  });

  // Timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Toast notifications
  const [toast, setToast] = useState<{
    msg: string;
    type: 'error' | 'success';
  } | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // AI Tutor
  const [aiLoadingId, setAiLoadingId] = useState<string | null>(null);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);

  // ── Helpers ────────────────────────────────────────────────────────────────
  function showToast(msg: string, type: 'error' | 'success' = 'error') {
    setToast({ msg, type });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 4500);
  }

  // Seed token balance from user profile once
  useEffect(() => {
    if (user?.aiTokenBalance !== undefined && tokensRemaining === null) {
      dispatch(setTokensRemaining(user.aiTokenBalance));
    }
  }, [user, tokensRemaining, dispatch]);

  // ── Fetch MCQs ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const extra =
      selectedSubject !== '__all__'
        ? { topicId: selectedSubject, limit: 50 }
        : { limit: 50 };

    Promise.resolve()
      .then(() => {
        if (cancelled) return;
        setLoading(true);
        setError(null);
        setCurrentIndex(0);
        setProgress({ answeredCount: 0, correctCount: 0, history: {} });
        setElapsedSeconds(0);
        setSubmitted(false);
        setSubmitError(null);
        return getMcqsByCategory('army-test', extra);
      })
      .then((res) => {
        if (cancelled) return;
        setQuestions(res?.data ?? []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load Army Test questions.'
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedSubject, retryKey]);

  // ── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const shouldRun = !loading && questions.length > 0 && !submitted;
    if (shouldRun && !intervalRef.current) {
      intervalRef.current = setInterval(
        () => setElapsedSeconds((p) => p + 1),
        1000
      );
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
  }, [loading, questions.length, submitted]);

  // ── Derived ────────────────────────────────────────────────────────────────
  const allDone =
    !loading &&
    questions.length > 0 &&
    progress.answeredCount >= questions.length;
  const accuracy =
    progress.answeredCount > 0
      ? Math.round((progress.correctCount / progress.answeredCount) * 100)
      : 0;
  const currentQuestion = questions[currentIndex];

  // ── Select option ──────────────────────────────────────────────────────────
  const handleSelectOption = useCallback(
    async (questionId: string, optionId: string) => {
      if (progress.history[questionId]) return;
      const question = questions.find((q) => q._id === questionId);
      if (!question) return;

      let graded = false;
      try {
        const res = await submitMcqAnswers([
          { questionId, selectedOptionId: optionId },
        ]);
        const result = res.results.find((r) => r.questionId === questionId);
        if (result) {
          const isCorrect = result.correct;
          setProgress((prev) => ({
            answeredCount: prev.answeredCount + 1,
            correctCount: prev.correctCount + (isCorrect ? 1 : 0),
            history: {
              ...prev.history,
              [questionId]: {
                selectedOptionId: optionId,
                isCorrect,
                correctOptionId: result.correctOptionId,
                explanation: result.explanation,
              },
            },
          }));
          graded = true;
        }
      } catch {
        /* fall through to local grading */
      }

      if (!graded) {
        const selectedOption = question.options.find((o) => o.id === optionId);
        const isCorrect = selectedOption?.isCorrect === true;
        const correctId = question.options.find((o) => o.isCorrect)?.id ?? null;
        setProgress((prev) => ({
          answeredCount: prev.answeredCount + 1,
          correctCount: prev.correctCount + (isCorrect ? 1 : 0),
          history: {
            ...prev.history,
            [questionId]: {
              selectedOptionId: optionId,
              isCorrect,
              correctOptionId: isCorrect ? optionId : correctId,
              explanation: question.explanation,
            },
          },
        }));
      }
    },
    [progress, questions]
  );

  // ── AI Tutor ───────────────────────────────────────────────────────────────
  const handleAiTutor = useCallback(
    async (question: MCQQuestion) => {
      if (!isAuthenticated) {
        showToast('Please log in to use the AI Tutor.', 'error');
        return;
      }
      const entry = progress.history[question._id];
      if (!entry) return;

      setAiLoadingId(question._id);
      try {
        const correctOption = question.options.find((o) => o.isCorrect);
        const userOption = question.options.find(
          (o) => o.id === entry.selectedOptionId
        );

        const res = await explainMcq({
          question: question.question ?? question.questionText ?? '',
          options: question.options.map((o) => o.text),
          correctAnswer: correctOption?.text ?? '',
          userSelectedAnswer: userOption?.text,
        });

        // Persist AI explanation into progress history
        setProgress((prev) => ({
          ...prev,
          history: {
            ...prev.history,
            [question._id]: {
              ...prev.history[question._id],
              aiExplanation: res.explanation,
            },
          },
        }));

        // Sync token balance in real-time
        dispatch(setTokensRemaining(res.tokensRemaining));
        dispatch(
          logTokenUsage({
            feature: 'MCQ Explanation (Army Test)',
            description: `AI explained: "${(question.question ?? '').slice(0, 50)}…"`,
            tokenCost: 10,
            type: 'debit',
          })
        );

        showToast('AI explanation generated!', 'success');
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response
          ?.status;
        if (status === 403) {
          setPricingModalOpen(true);
        } else {
          showToast(
            err instanceof Error
              ? err.message
              : 'AI Tutor request failed. Please try again.',
            'error'
          );
        }
      } finally {
        setAiLoadingId(null);
      }
    },
    [isAuthenticated, progress.history, dispatch]
  );

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (submitting || submitted) return;
    setSubmitting(true);
    setSubmitError(null);
    const payload: MCQSubmissionAnswer[] = Object.entries(progress.history).map(
      ([qId, entry]) => ({
        questionId: qId,
        selectedOptionId: entry.selectedOptionId,
      })
    );
    try {
      if (isAuthenticated) {
        const res = await submitMcqExamProgress('army-test-practice', payload);
        if (res) {
          dispatch(
            updateUserProgress({
              xp: res.xpEarned ?? progress.correctCount * 10,
              readinessScore: res.scorePercentage ?? accuracy,
            })
          );
        }
      } else {
        await submitMcqAnswers(payload);
      }
      setSubmitted(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Failed to submit. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }, [submitting, submitted, progress, isAuthenticated, dispatch, accuracy]);

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    setProgress({ answeredCount: 0, correctCount: 0, history: {} });
    setElapsedSeconds(0);
    setSubmitted(false);
    setSubmitError(null);
  }, []);

  const goToPrev = useCallback(
    () => setCurrentIndex((p) => Math.max(0, p - 1)),
    []
  );
  const goToNext = useCallback(
    () => setCurrentIndex((p) => Math.min(questions.length - 1, p + 1)),
    [questions.length]
  );

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const active = document.activeElement;
      if (
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      } else if (e.key >= '1' && e.key <= '4') {
        const q = questions[currentIndex];
        if (q && !progress.history[q._id]) {
          const idx = parseInt(e.key, 10) - 1;
          if (q.options[idx]) handleSelectOption(q._id, q.options[idx].id);
        }
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    goToPrev,
    goToNext,
    questions,
    currentIndex,
    progress.history,
    handleSelectOption,
  ]);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className={cn(
              'fixed left-1/2 top-4 z-[9999] -translate-x-1/2 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium shadow-2xl',
              toast.type === 'error'
                ? 'bg-danger-600 text-white'
                : 'bg-accent-600 text-white'
            )}
          >
            {toast.type === 'error' ? (
              <AlertCircle size={16} />
            ) : (
              <CheckCircle2 size={16} />
            )}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-md">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
              🎖️ Army Test Practice
            </h1>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">
              ISSB / Initial Test · Live MCQs
            </p>
          </div>
        </div>

        {/* Real-time token balance */}
        {isAuthenticated && (
          <div className="flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 dark:border-amber-700 dark:bg-amber-950/40">
            <Coins size={14} className="text-amber-500" />
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
              {tokensRemaining !== null
                ? tokensRemaining.toLocaleString()
                : '0'}{' '}
              tokens
            </span>
          </div>
        )}
      </div>

      {/* Subject Tabs */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Sparkles size={15} className="text-green-500" />
          <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
            Filter by Subject
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {ARMY_SUBJECTS.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubject(sub.id)}
              className={cn(
                'shrink-0 rounded-lg border px-4 py-2 text-sm font-medium transition-all',
                selectedSubject === sub.id
                  ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400'
                  : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-secondary))] hover:border-green-300 hover:text-green-600 dark:hover:border-green-700'
              )}
            >
              {sub.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] py-20">
          <Spinner size={32} />
          <p className="mt-4 text-sm text-[rgb(var(--color-text-muted))]">
            Loading Army Test questions…
          </p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-danger-200 bg-danger-50/40 py-16 text-center dark:border-danger-800">
          <AlertCircle size={32} className="text-danger-500" />
          <p className="mt-3 text-sm text-[rgb(var(--color-text-secondary))]">
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
      )}

      {/* Empty State */}
      {!loading && !error && questions.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] py-16 text-center">
          <ShieldCheck
            size={40}
            className="text-[rgb(var(--color-text-muted))] opacity-40"
          />
          <p className="mt-4 text-lg font-semibold text-[rgb(var(--color-text-primary))]">
            No Questions Found
          </p>
          <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
            No Army Test MCQs are available for this subject yet. Try "All
            Subjects".
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3"
            onClick={handleReset}
          >
            <RotateCcw size={14} /> Reset
          </Button>
        </div>
      )}

      {/* Main Quiz Interface */}
      {!loading && !error && questions.length > 0 && (
        <>
          {/* Progress bar */}
          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-medium text-[rgb(var(--color-text-secondary))]">
                Question {currentIndex + 1} of {questions.length}
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
                className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentIndex + 1) / questions.length) * 100}%`,
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Question Card */}
          {currentQuestion && (
            <QuestionCard
              key={currentQuestion._id}
              question={currentQuestion}
              questionNumber={currentIndex + 1}
              entry={progress.history[currentQuestion._id] ?? null}
              aiLoading={aiLoadingId === currentQuestion._id}
              isAuthenticated={isAuthenticated}
              tokensRemaining={tokensRemaining}
              onSelectOption={handleSelectOption}
              onAiTutor={handleAiTutor}
              onOpenPricing={() => setPricingModalOpen(true)}
            />
          )}

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrev}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={14} /> Previous
            </Button>

            {/* Dot indicators */}
            <div className="flex items-center gap-1.5">
              {questions.map((q, i) => {
                const ans = progress.history[q._id];
                return (
                  <button
                    key={q._id}
                    type="button"
                    onClick={() => setCurrentIndex(i)}
                    className={cn(
                      'h-2 rounded-full transition-all',
                      i === currentIndex
                        ? 'w-6 bg-green-500'
                        : ans
                          ? ans.isCorrect
                            ? 'w-2 bg-accent-400'
                            : 'w-2 bg-danger-400'
                          : 'w-2 bg-[rgb(var(--color-surface-elevated))]'
                    )}
                    aria-label={`Go to question ${i + 1}`}
                  />
                );
              })}
            </div>

            {allDone && !submitted ? (
              <Button size="sm" isLoading={submitting} onClick={handleSubmit}>
                <CheckCircle2 size={14} /> Submit Exam
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={goToNext}
                disabled={currentIndex >= questions.length - 1}
              >
                Next <ChevronRight size={14} />
              </Button>
            )}
          </div>

          {submitError && !submitted && (
            <p className="mt-2 text-center text-sm text-danger-500">
              {submitError}
            </p>
          )}

          {/* Results panel */}
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="rounded-xl border border-accent-200 bg-accent-50/50 p-6 text-center shadow-lg dark:border-accent-800 dark:bg-accent-950/50"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-100 text-accent-600 dark:bg-accent-900/50">
                <CheckCircle2 size={24} />
              </div>
              <p className="text-xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
                Army Test Practice Complete!
              </p>
              <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
                You answered{' '}
                <span className="font-semibold text-accent-600 dark:text-accent-400">
                  {progress.correctCount}
                </span>{' '}
                out of{' '}
                <span className="font-semibold">{progress.answeredCount}</span>{' '}
                correctly ({accuracy}% accuracy).
              </p>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-violet-600 dark:text-violet-400">
                <Zap size={14} />+{progress.correctCount * 10} XP Earned & Saved
                to Database
              </div>
              <div className="mt-5 flex items-center justify-center gap-3">
                <Button size="sm" variant="outline" onClick={handleReset}>
                  <RotateCcw size={14} /> Practice Again
                </Button>
                <Link
                  to={ROUTES.DASHBOARD}
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 shadow-md"
                >
                  <LayoutDashboard size={14} /> View Dashboard
                </Link>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Pricing Modal */}
      <AnimatePresence>
        {pricingModalOpen && (
          <PricingModal onClose={() => setPricingModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── QuestionCard ─────────────────────────────────────────────────────────────
interface QuestionCardProps {
  question: MCQQuestion;
  questionNumber: number;
  entry: AnswerEntry | null;
  aiLoading: boolean;
  isAuthenticated: boolean;
  tokensRemaining: number | null;
  onSelectOption: (qId: string, optId: string) => void;
  onAiTutor: (q: MCQQuestion) => void;
  onOpenPricing: () => void;
}

function QuestionCard({
  question,
  questionNumber,
  entry,
  aiLoading,
  isAuthenticated,
  tokensRemaining,
  onSelectOption,
  onAiTutor,
  onOpenPricing,
}: QuestionCardProps) {
  const isRevealed = !!entry;
  const isAnswerCorrect = isRevealed && entry.isCorrect;
  const revealedCorrectId =
    entry?.correctOptionId ??
    question.options.find((o) => o.isCorrect)?.id ??
    null;

  // Prefer AI explanation > server explanation > question-level explanation
  const displayExplanation =
    entry?.aiExplanation ?? entry?.explanation ?? question.explanation;

  const hasInsufficientTokens =
    tokensRemaining !== null && tokensRemaining < 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-xl border p-5 transition-all shadow-2xl',
        isRevealed && isAnswerCorrect
          ? 'border-accent-300 bg-accent-50/50 dark:border-accent-700 dark:bg-accent-950/50'
          : isRevealed && entry && !isAnswerCorrect
            ? 'border-danger-300 bg-danger-50/50 dark:border-danger-700 dark:bg-danger-950/50'
            : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]'
      )}
    >
      {/* Question header */}
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
            isRevealed && isAnswerCorrect
              ? 'bg-accent-500 text-white'
              : isRevealed && entry && !isAnswerCorrect
                ? 'bg-danger-500 text-white'
                : 'bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-secondary))]'
          )}
        >
          {isRevealed && entry ? (
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
          <p className="font-medium leading-relaxed text-[rgb(var(--color-text-primary))]">
            {question.question ?? question.questionText}
          </p>
          {question.imageUrl && (
            <img
              src={question.imageUrl}
              alt={`Illustration for question ${questionNumber}`}
              className="mt-3 max-h-48 rounded-lg border border-[rgb(var(--color-border))] object-contain"
            />
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

      {/* Options */}
      <div className="mt-4 grid gap-2 sm:grid-cols-2" role="radiogroup">
        {question.options.map((option, optIndex) => {
          const isSelected =
            isRevealed && entry?.selectedOptionId === option.id;
          const isCorrectOption =
            revealedCorrectId !== null && option.id === revealedCorrectId;
          const showAsCorrect = isRevealed && isCorrectOption;
          const showAsWrong = isRevealed && isSelected && !isCorrectOption;

          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: optIndex * 0.05 }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isRevealed}
              onClick={() => onSelectOption(question._id, option.id)}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500',
                showAsCorrect
                  ? 'border-accent-400 bg-accent-100 text-accent-800 dark:border-accent-600 dark:bg-accent-900 dark:text-accent-200'
                  : showAsWrong
                    ? 'border-danger-400 bg-danger-100 text-danger-800 dark:border-danger-600 dark:bg-danger-900 dark:text-danger-200'
                    : isRevealed
                      ? 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] opacity-50'
                      : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] hover:border-green-300 hover:bg-green-50/50 dark:hover:border-green-700 dark:hover:bg-green-950/30'
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
                        ? 'bg-green-500 text-white'
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

      {/* Explanation + AI Tutor section */}
      {isRevealed && (
        <div className="mt-4 space-y-3">
          {/* Explanation panel */}
          {displayExplanation && (
            <div
              className={cn(
                'rounded-lg border px-4 py-3',
                entry?.aiExplanation
                  ? 'border-violet-200 bg-violet-50/40 dark:border-violet-800 dark:bg-violet-950/40'
                  : 'border-primary-200 bg-primary-50/30 dark:border-primary-800 dark:bg-primary-950/30'
              )}
            >
              <div className="flex items-start gap-2">
                <Brain
                  size={15}
                  className={cn(
                    'mt-0.5 shrink-0',
                    entry?.aiExplanation
                      ? 'text-violet-500'
                      : 'text-primary-500'
                  )}
                />
                <div>
                  <p
                    className={cn(
                      'text-xs font-semibold uppercase tracking-wider',
                      entry?.aiExplanation
                        ? 'text-violet-600 dark:text-violet-400'
                        : 'text-primary-600 dark:text-primary-400'
                    )}
                  >
                    {entry?.aiExplanation
                      ? '✨ AI Tutor Explanation'
                      : 'Explanation'}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[rgb(var(--color-text-secondary))]">
                    <ReactMarkdown>{displayExplanation}</ReactMarkdown>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* "Ask AI Tutor" button — only if AI explanation not yet fetched */}
          {isAuthenticated && !entry?.aiExplanation && (
            <button
              id={`ai-tutor-btn-${question._id}`}
              onClick={() => {
                if (hasInsufficientTokens) {
                  onOpenPricing();
                  return;
                }
                onAiTutor(question);
              }}
              disabled={aiLoading}
              className={cn(
                'group flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed',
                hasInsufficientTokens
                  ? 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                  : 'border-violet-300 bg-violet-50/50 text-violet-700 hover:border-violet-400 hover:bg-violet-100 dark:border-violet-700 dark:bg-violet-950/50 dark:text-violet-400 dark:hover:bg-violet-950'
              )}
            >
              {aiLoading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Sparkles
                  size={15}
                  className="transition-transform group-hover:scale-110"
                />
              )}
              {aiLoading
                ? 'Asking AI Tutor…'
                : hasInsufficientTokens
                  ? '⚠️ Insufficient Tokens — Buy More'
                  : '✨ Ask AI Tutor (10 Tokens)'}
            </button>
          )}

          {/* Login prompt for guests */}
          {!isAuthenticated && (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-violet-300 bg-violet-50/30 py-2.5 text-xs font-medium text-violet-600 dark:border-violet-700 dark:bg-violet-950/20 dark:text-violet-400">
              <Sparkles size={13} />
              Log in to use AI Tutor explanations (10 tokens each)
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ─── PricingModal ─────────────────────────────────────────────────────────────
function PricingModal({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pricing-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-md rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-surface-elevated))]"
          aria-label="Close pricing modal"
        >
          <XIcon size={18} />
        </button>

        <div className="mb-1 flex items-center gap-2">
          <Coins size={20} className="text-amber-500" />
          <h2
            id="pricing-modal-title"
            className="text-lg font-bold text-[rgb(var(--color-text-primary))]"
          >
            Get More AI Tokens
          </h2>
        </div>
        <p className="mb-5 text-sm text-[rgb(var(--color-text-secondary))]">
          You need at least 10 tokens to use the AI Tutor. Choose a pack below.
        </p>

        <div className="space-y-3">
          {TOKEN_PACKS.map((plan) => (
            <div
              key={plan.id}
              className="relative flex items-center justify-between rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-4 transition-all hover:border-violet-300 dark:hover:border-violet-700"
            >
              {plan.badge && (
                <span className="absolute -top-2.5 left-4 rounded-full bg-violet-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  {plan.badge}
                </span>
              )}
              <div>
                <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                  {plan.name}
                </p>
                <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                  {plan.tokens >= 9999
                    ? 'Unlimited queries'
                    : `${plan.tokens} tokens`}
                </p>
                <p className="text-[10px] text-[rgb(var(--color-text-muted))]">
                  {plan.pricePerToken}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[rgb(var(--color-text-primary))]">
                  {plan.price}
                </span>
                <Button
                  size="sm"
                  variant={plan.id === 'premium' ? 'primary' : 'outline'}
                  leftIcon={
                    plan.id === 'premium' ? (
                      <Crown size={12} />
                    ) : (
                      <Coins size={12} />
                    )
                  }
                  onClick={() => {
                    dispatch(
                      logTokenUsage({
                        feature: 'Token Purchase',
                        description: `Purchased ${plan.name}`,
                        tokenCost: plan.tokens,
                        type: 'credit',
                      })
                    );
                    onClose();
                  }}
                >
                  {plan.id === 'premium' ? 'Upgrade' : 'Buy'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
