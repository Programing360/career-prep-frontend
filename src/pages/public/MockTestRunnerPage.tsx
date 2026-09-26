import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Menu,
  RotateCcw,
  XIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import {
  MockTestHeader,
  MockTestResultsView,
  QuestionCard,
  QuestionNavigator,
} from '@/components/mock-test';
import {
  clearActiveMockTest,
  getActiveMockTest,
  persistMockTestAnswers,
  startMockTest,
  submitMockTest,
} from '@/services/mockTestService';
import type {
  MockQuestion,
  MockTestResult,
  MockTestSession,
  TestType,
  UserAnswer,
} from '@/types/mockTest';

function isMockTestType(value: string | undefined): value is TestType {
  return value === 'mock_demo' || value === 'verbal_nonverbal';
}

function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return [h, m, s].map((n) => n.toString().padStart(2, '0')).join(':');
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function MockTestRunnerPage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();

  const [restored] = useState(() => getActiveMockTest());
  const canResume =
    Boolean(restored) &&
    restored?.session.status === 'active' &&
    !restored.session.isSubmitted;

  const [session, setSession] = useState<MockTestSession | null>(() =>
    canResume && restored ? restored.session : null
  );
  const [questions, setQuestions] = useState<MockQuestion[]>(() =>
    canResume && restored ? restored.questions : []
  );
  const [answers, setAnswers] = useState<UserAnswer[]>(() =>
    canResume && restored ? restored.answers : []
  );
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (!canResume || !restored || restored.answers.length === 0) return 0;
    const latestAnsweredAt = restored.answers.reduce(
      (max, answer) => (answer.answeredAt > max ? answer.answeredAt : max),
      ''
    );
    const latestQuestionId = restored.answers.find(
      (answer) => answer.answeredAt === latestAnsweredAt
    )?.questionId;
    const index = restored.questions.findIndex(
      (question) => question._id === latestQuestionId
    );
    return index >= 0 ? index : 0;
  });
  const [isLoading, setIsLoading] = useState(() => !canResume);
  const [loadError, setLoadError] = useState(false);
  const [retryNonce, setRetryNonce] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [result, setResult] = useState<MockTestResult | null>(null);
  const [expiredByTimer, setExpiredByTimer] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [modalTimeUsedSeconds, setModalTimeUsedSeconds] = useState(0);

  const submittingRef = useRef(false);

  useEffect(() => {
    if (session) return;
    if (!isMockTestType(type)) return;
    let cancelled = false;
    startMockTest(type, type)
      .then((response) => {
        if (cancelled) return;
        console.log(response);
        setSession(response.session);
        setQuestions(response.questions);
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoadError(true);
        setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [session, type, retryNonce]);

  useEffect(() => {
    if (session && session.status === 'active' && !session.isSubmitted) {
      persistMockTestAnswers(session.id, answers);
    }
  }, [session, answers]);

  useEffect(() => {
    if (session?.status === 'active' && !result) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [session, result]);

  const isActive = Boolean(
    session &&
    session.status === 'active' &&
    !session.isSubmitted &&
    !result &&
    !isSubmitting
  );

  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion
    ? answers.find((answer) => answer.questionId === currentQuestion._id)
    : undefined;
  // console.log(currentAnswer, answers);
  const stats = useMemo(() => {
    let answered = 0;
    let flagged = 0;
    for (const answer of answers) {
      // console.log(answer);
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

  const displayTitle =
    session?.testType === 'verbal_nonverbal'
      ? 'Verbal & Non-Verbal Demo'
      : 'Demo Mock Test';

  const updateAnswer = useCallback(
    (
      questionId: string,
      patch: { selectedOptionId?: string | null; isFlagged?: boolean }
    ) => {
      setAnswers((prev) => {
        const existing = prev.find(
          (answer) => answer.questionId === questionId
        );
        const next: UserAnswer = {
          selectedOptionId: null,
          isFlagged: false,
          ...existing,
          ...patch,
          questionId,
          answeredAt: new Date().toISOString(),
        };
        if (!existing) return [...prev, next];
        return prev.map((answer) =>
          answer.questionId === questionId ? next : answer
        );
      });
    },
    []
  );

  const handleSelectOption = useCallback(
    (optionId: string) => {
      if (!currentQuestion || !isActive) return;
      updateAnswer(currentQuestion._id, { selectedOptionId: optionId });
    },
    [currentQuestion, isActive, updateAnswer]
  );

  const handleToggleFlag = useCallback(() => {
    if (!currentQuestion || !isActive) return;
    updateAnswer(currentQuestion._id, {
      isFlagged: !(currentAnswer?.isFlagged ?? false),
    });
  }, [currentQuestion, currentAnswer, isActive, updateAnswer]);

  const handleClearSelection = useCallback(() => {
    if (!currentQuestion || !isActive) return;
    updateAnswer(currentQuestion._id, { selectedOptionId: null });
  }, [currentQuestion, isActive, updateAnswer]);

  const handleNavigate = useCallback(
    (index: number) => {
      if (index < 0 || index >= questions.length) return;
      const target = questions[index];
      setCurrentIndex(index);
      setPaletteOpen(false);
      if (
        target &&
        !answers.some((answer) => answer.questionId === target._id)
      ) {
        updateAnswer(target._id, {});
      }
    },
    [questions, answers, updateAnswer]
  );

  const handleSubmit = useCallback(
    async (isAutoSubmitted = false) => {
      if (submittingRef.current || !session) return;
      submittingRef.current = true;
      setIsSubmitting(true);
      setShowSubmitModal(false);
      if (isAutoSubmitted) setExpiredByTimer(true);
      try {
        const submitTime = Date.now();
        const submittedResult = await submitMockTest(session.id, answers);
        console.log(session, answers);
        // Ensure timeSpentSeconds is always populated — compute client-side as
        // a reliable fallback in case the backend field is absent.
        if (!submittedResult.timeSpentSeconds) {
          (submittedResult as MockTestResult).timeSpentSeconds = Math.floor(
            (submitTime - new Date(session.startTime).getTime()) / 1000
          );
        }
        console.log(submittedResult);
        setResult(submittedResult);
        setSubmitError(false);
        clearActiveMockTest();
      } catch {
        setSubmitError(true);
      } finally {
        setIsSubmitting(false);
        submittingRef.current = false;
      }
    },
    [session, answers]
  );

  const handleAutoExpire = useCallback(() => {
    void handleSubmit(true);
  }, [handleSubmit]);

  const handleOpenSubmitModal = useCallback(() => {
    if (!isActive || !session) return;
    const seconds = Math.min(
      session.durationSeconds,
      Math.floor((Date.now() - new Date(session.startTime).getTime()) / 1000)
    );
    setModalTimeUsedSeconds(seconds);
    setShowSubmitModal(true);
  }, [isActive, session]);

  const handleRetry = useCallback(() => {
    clearActiveMockTest();
    setSession(null);
    setQuestions([]);
    setAnswers([]);
    setResult(null);
    setCurrentIndex(0);
    setExpiredByTimer(false);
    setSubmitError(false);
    setIsLoading(true);
  }, []);

  const handleLoadErrorRetry = useCallback(() => {
    setLoadError(false);
    setIsLoading(true);
    setRetryNonce((nonce) => nonce + 1);
  }, []);

  const handleExit = useCallback(() => {
    navigate(ROUTES.EXAMS);
  }, [navigate]);

  if (!isMockTestType(type)) {
    return <Navigate to={ROUTES.EXAMS} replace />;
  }

  if (isLoading || !session || questions.length === 0) {
    return (
      <div
        aria-live="polite"
        aria-busy="true"
        className="flex min-h-screen w-full items-center justify-center p-4 bg-background"
      >
        <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-xs">
          {/* Spinner Container with Subtle Glow */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full blur-sm bg-primary/20 animate-pulse" />
            <Loader2
              size={36}
              className="relative animate-spin text-primary transition-colors duration-200"
            />
          </div>

          {/* Text Section */}
          <div className="space-y-1">
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              Preparing Mock Test
            </h3>
            <p className="text-xs text-muted-foreground">
              Please wait a moment while we set up your session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-screen items-center justify-center bg-[hsl(var(--background))] p-4">
        <div className="w-full max-w-sm rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 text-center shadow-xl">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-danger-100 dark:bg-danger-900">
            <AlertTriangle
              size={20}
              className="text-danger-600 dark:text-danger-400"
              aria-hidden="true"
            />
          </div>
          <h2 className="mt-3 text-lg font-semibold text-[rgb(var(--color-text-primary))]">
            Could not start the mock test
          </h2>
          <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
            Something went wrong while preparing your test. Please try again.
          </p>
          <Button size="sm" className="mt-4" onClick={handleLoadErrorRetry}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div
        className="min-h-screen overflow-y-auto p-4 py-8 sm:p-6 sm:py-12"
        data-lenis-prevent
      >
        <MockTestResultsView
          result={result}
          testType={session.testType}
          isAutoSubmitted={expiredByTimer}
          onRetry={handleRetry}
          onExit={handleExit}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#2c153b]">
      <MockTestHeader
        title={displayTitle}
        testType={session.testType}
        sessionId={session.id}
        expiresAt={session.expiresAt}
        isActive={isActive}
        isSubmitting={isSubmitting}
        onExpire={handleAutoExpire}
        onSubmit={handleOpenSubmitModal}
        onExit={handleExit}
      />

      {submitError && (
        <div className="flex items-center gap-2 border-b border-danger-300 bg-danger-50 px-4 py-2 text-xs text-danger-700 dark:border-danger-700 dark:bg-danger-950 dark:text-danger-300">
          <AlertTriangle size={14} className="shrink-0" aria-hidden="true" />
          <span>Could not submit your mock test. Please try again.</span>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div
          className="flex flex-1 flex-col overflow-y-auto p-4 sm:p-6"
          data-lenis-prevent
        >
          <div className="mx-auto flex w-full max-w-3xl flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion._id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <QuestionCard
                  question={currentQuestion}
                  questionNumber={currentIndex + 1}
                  totalQuestions={questions.length}
                  answer={currentAnswer}
                  isActive={isActive}
                  onSelect={handleSelectOption}
                  onToggleFlag={handleToggleFlag}
                />
              </motion.div>
            </AnimatePresence>

            {isActive && (
              <div className="mt-4 flex items-center justify-between gap-2">
                <button
                  type="button"
                  disabled={!currentAnswer?.selectedOptionId}
                  onClick={handleClearSelection}
                  className="flex items-center gap-1.5 rounded-lg border border-[rgb(var(--color-border))] px-3 py-2 text-xs font-medium text-[rgb(var(--color-text-secondary))] transition-all hover:border-danger-300 hover:text-danger-600 disabled:cursor-not-allowed disabled:opacity-50 focus-ring"
                >
                  <RotateCcw size={12} aria-hidden="true" />
                  Clear Selection
                </button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<ChevronLeft size={14} />}
                    disabled={currentIndex === 0}
                    onClick={() => handleNavigate(currentIndex - 1)}
                  >
                    Prev
                  </Button>

                  {currentIndex === questions.length - 1 ? (
                    <Button
                      size="sm"
                      rightIcon={<ChevronRight size={14} />}

                      onClick={handleOpenSubmitModal}
                    >
                      Submit
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      rightIcon={<ChevronRight size={14} />}
                      disabled={currentIndex === questions.length - 1}
                      onClick={() => handleNavigate(currentIndex + 1)}
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="hidden w-64 shrink-0 border-l border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4 lg:block">
          <QuestionNavigator
            questions={questions}
            answers={answers}
            currentIndex={currentIndex}
            onSelect={handleNavigate}
          />
        </aside>
      </div>

      {isActive && (
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          aria-label="Open question palette"
          className="fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg transition-colors hover:bg-primary-600 focus-ring lg:hidden"
        >
          <Menu size={20} aria-hidden="true" />
        </button>
      )}

      {paletteOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setPaletteOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 border-l border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                Question Palette
              </h3>
              <button
                type="button"
                onClick={() => setPaletteOpen(false)}
                aria-label="Close question palette"
                className="rounded-md p-1 text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-surface-elevated))] focus-ring"
              >
                <XIcon size={18} aria-hidden="true" />
              </button>
            </div>
            <QuestionNavigator
              questions={questions}
              answers={answers}
              currentIndex={currentIndex}
              onSelect={handleNavigate}
            />
          </div>
        </div>
      )}

      {isSubmitting && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-black/60 backdrop-blur-sm"
        >
          <Loader2
            size={36}
            className="animate-spin text-white"
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-white">
            Submitting your answers...
          </p>
        </div>
      )}

      {showSubmitModal && isActive && (
        <SubmitModal
          stats={stats}
          timeUsedSeconds={modalTimeUsedSeconds}
          isSubmitting={isSubmitting}
          onConfirm={() => void handleSubmit(false)}
          onCancel={() => setShowSubmitModal(false)}
        />
      )}
    </div>
  );
}

function SubmitModal({
  stats,
  timeUsedSeconds,
  isSubmitting,
  onConfirm,
  onCancel,
}: {
  stats: {
    answered: number;
    flagged: number;
    total: number;
    unanswered: number;
  };
  timeUsedSeconds: number;
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
            <AlertTriangle
              size={20}
              className="text-primary-600 dark:text-primary-400"
              aria-hidden="true"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
              Submit Mock Test?
            </h3>
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              Are you sure you want to submit?
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-3 text-center">
            <p className="text-lg font-bold text-accent-600">
              {stats.answered}
            </p>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">
              Answered
            </p>
          </div>
          <div className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-3 text-center">
            <p className="text-lg font-bold text-danger-600">
              {stats.unanswered}
            </p>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">
              Unanswered
            </p>
          </div>
          <div className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-3 text-center">
            <p className="text-lg font-bold text-violet-600">{stats.flagged}</p>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">
              Marked for Review
            </p>
          </div>
          <div className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-3 text-center">
            <p className="text-lg font-bold text-[rgb(var(--color-text-primary))]">
              {formatDuration(timeUsedSeconds)}
            </p>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">
              Time Used
            </p>
          </div>
        </div>

        {stats.unanswered > 0 && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 dark:border-primary-800 dark:bg-primary-950">
            <AlertTriangle
              size={14}
              className="mt-0.5 shrink-0 text-primary-500"
              aria-hidden="true"
            />
            <p className="text-xs text-primary-700 dark:text-primary-300">
              You have {stats.unanswered} unanswered question
              {stats.unanswered > 1 ? 's' : ''}. Once submitted, you cannot
              change your answers.
            </p>
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Go Back
          </Button>
          <Button
            size="sm"
            isLoading={isSubmitting}
            className="bg-danger-500 text-white hover:bg-danger-600"
            onClick={onConfirm}
          >
            Yes, Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
