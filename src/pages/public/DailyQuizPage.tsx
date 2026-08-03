import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileQuestion,
  RefreshCcw,
  Sparkles,
  Timer,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/Button';
import {
  clearCompletedQuiz,
  clearInProgressQuiz,
  getCompletedQuiz,
  getInProgressQuiz,
  saveCompletedQuiz,
  saveInProgressQuiz,
  type DailyQuizInProgress,
} from '@/utils/quizStorage';
import { getTodayQuiz, submitDailyQuiz } from '@/services/dailyQuizService';
import { DailyQuizCard } from '@/components/daily-quiz/DailyQuizCard';
import { DailyQuizResult } from '@/components/daily-quiz/DailyQuizResult';
import { DailyQuizSkeleton } from '@/components/daily-quiz/DailyQuizSkeleton';
import { useToast } from '@/hooks/useToast';
import type { DailyQuiz, DailyQuizAttempt } from '@/types/dailyQuiz';

type QuizView = 'loading' | 'error' | 'intro' | 'quiz' | 'result';

export default function DailyQuizPage() {
  const { showToast } = useToast();

  const [view, setView] = useState<QuizView>('loading');
  const [quiz, setQuiz] = useState<DailyQuiz | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [completedAttempt, setCompletedAttempt] =
    useState<DailyQuizAttempt | null>(null);
  const [attempt, setAttempt] = useState<DailyQuizAttempt | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [timeTakenSeconds, setTimeTakenSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setView('loading');
    setError(null);
    getTodayQuiz()
      .then((nextQuiz) => {
        if (!active) return;
        setQuiz(nextQuiz);
        const stored = getCompletedQuiz(nextQuiz.quizDate);
        const saved = getInProgressQuiz();
        if (stored) {
          setCompletedAttempt(stored);
          setView('intro');
        } else if (saved && saved.quiz.id === nextQuiz.id) {
          setAnswers(saved.answers);
          setQuestionIndex(saved.questionIndex);
          setStartedAt(Number(saved.startedAt) || Date.now());
          setView('quiz');
        } else {
          setView('intro');
        }
      })
      .catch(() => {
        if (!active) return;
        setError('Unable to load today\u2019s quiz. Please try again.');
        setView('error');
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  useEffect(() => {
    if (view !== 'quiz' || !quiz) return;
    const state: DailyQuizInProgress = {
      quiz,
      questionIndex,
      answers,
      startedAt: String(startedAt),
    };
    saveInProgressQuiz(state);
  }, [view, quiz, questionIndex, answers, startedAt]);

  const handleSelect = useCallback((questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }, []);

  const handleStart = useCallback(() => {
    if (!quiz) return;
    setCompletedAttempt(null);
    clearCompletedQuiz(quiz.quizDate);
    clearInProgressQuiz();
    setAnswers({});
    setQuestionIndex(0);
    setStartedAt(Date.now());
    setView('quiz');
  }, [quiz]);

  const handleRetry = useCallback(() => {
    if (!quiz) return;
    setAttempt(null);
    clearCompletedQuiz(quiz.quizDate);
    clearInProgressQuiz();
    setCompletedAttempt(null);
    setAnswers({});
    setQuestionIndex(0);
    setStartedAt(Date.now());
    setView('quiz');
  }, [quiz]);

  const handleSubmit = useCallback(async () => {
    if (!quiz || isSubmitting) return;
    setIsSubmitting(true);
    const elapsed = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
    try {
      const res = await submitDailyQuiz(quiz.id, answers);
      const nextAttempt: DailyQuizAttempt = {
        quizId: quiz.id,
        score: res.score,
        totalQuestions: res.totalQuestions,
        answers,
        completedAt: new Date().toISOString(),
      };
      saveCompletedQuiz(nextAttempt);
      clearInProgressQuiz();
      setAttempt(nextAttempt);
      setTimeTakenSeconds(elapsed);
      setView('result');
    } catch {
      showToast('Could not submit your quiz. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }, [quiz, isSubmitting, answers, startedAt, showToast]);

  const handleNext = useCallback(() => {
    if (!quiz || isSubmitting) return;
    if (questionIndex < quiz.questions.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      void handleSubmit();
    }
  }, [quiz, isSubmitting, questionIndex, handleSubmit]);

  useEffect(() => {
    if (view !== 'quiz' || !quiz || isSubmitting) return;
    const handler = (event: KeyboardEvent) => {
      const question = quiz.questions[questionIndex];
      const answered = Boolean(answers[question.id]);
      if (event.key === 'Enter') {
        if (answered) handleNext();
        return;
      }
      const num = Number(event.key);
      if (!answered && num >= 1 && num <= question.options.length) {
        handleSelect(question.id, question.options[num - 1].id);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [
    view,
    quiz,
    questionIndex,
    answers,
    isSubmitting,
    handleNext,
    handleSelect,
  ]);

  if (view === 'loading' || view === 'error') {
    return (
      <div className="min-h-screen">
        <section className="relative overflow-hidden border-b border-white/20 bg-white/70 backdrop-blur-md shadow-sm dark:border-gray-800/50 dark:bg-gray-900/70">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-400/10 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
              >
                <Link
                  to={ROUTES.HOME}
                  className="hover:text-gray-700 dark:hover:text-gray-200"
                >
                  Home
                </Link>
                <ChevronRight size={12} aria-hidden="true" />
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Daily Quiz
                </span>
              </nav>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900">
                  <Sparkles
                    size={22}
                    className="text-primary-600 dark:text-primary-400"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                    Daily Quiz
                  </h1>
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                    Test your general knowledge in two minutes.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {view === 'loading' ? (
            <DailyQuizSkeleton />
          ) : (
            <div className="mx-auto w-full max-w-2xl rounded-xl border border-white/20 bg-white/70 px-6 py-12 text-center backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
              <RefreshCcw
                size={32}
                className="mx-auto text-gray-300 dark:text-gray-600"
                aria-hidden="true"
              />
              <p className="mt-3 text-sm font-medium text-gray-900 dark:text-white">
                {error}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setReloadKey((k) => k + 1)}
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === 'intro' && quiz) {
    const questionCount = quiz.questions.length;
    return (
      <div className="min-h-screen">
        <section className="relative overflow-hidden border-b border-white/20 bg-white/70 backdrop-blur-md shadow-sm dark:border-gray-800/50 dark:bg-gray-900/70">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-400/10 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
              >
                <Link
                  to={ROUTES.HOME}
                  className="hover:text-gray-700 dark:hover:text-gray-200"
                >
                  Home
                </Link>
                <ChevronRight size={12} aria-hidden="true" />
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Daily Quiz
                </span>
              </nav>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900">
                  <Sparkles
                    size={22}
                    className="text-primary-600 dark:text-primary-400"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                    Daily Quiz
                  </h1>
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                    Test your general knowledge in two minutes.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          {completedAttempt && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/50 bg-emerald-50 px-4 py-3.5 dark:border-emerald-600/40 dark:bg-emerald-950/40"
            >
              <CheckCircle2
                size={20}
                className="shrink-0 text-emerald-600 dark:text-emerald-400"
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
                  Already completed today
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  You scored {completedAttempt.score}/
                  {completedAttempt.totalQuestions}. Take it again to beat your
                  score.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={handleStart}
              >
                Take Again
              </Button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="rounded-2xl border border-white/20 bg-white/70 p-6 text-center shadow-sm backdrop-blur-md sm:p-8 dark:border-gray-800/50 dark:bg-gray-900/70"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
              <Sparkles
                size={26}
                className="text-primary-600 dark:text-primary-400"
                aria-hidden="true"
              />
            </div>
            <h2 className="mt-4 text-xl font-black font-heading text-gray-900 dark:text-white">
              {quiz.title}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {quiz.category}
            </p>

            <div className="mt-5 flex items-center justify-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-1.5">
                <FileQuestion size={13} aria-hidden="true" />
                {questionCount} questions
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Timer size={13} aria-hidden="true" />
                About 2 min
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={13} aria-hidden="true" />
                No time limit
              </span>
            </div>

            <Button
              size="lg"
              fullWidth
              className="mt-6"
              onClick={handleStart}
              rightIcon={<ArrowRight size={16} aria-hidden="true" />}
            >
              Start Quiz
            </Button>
            <p className="mt-2 text-[11px] text-gray-400 dark:text-gray-500">
              Use the 1–4 keys to answer and Enter to continue.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (view === 'result' && quiz && attempt) {
    return (
      <div className="min-h-screen">
        <section className="relative overflow-hidden border-b border-white/20 bg-white/70 backdrop-blur-md shadow-sm dark:border-gray-800/50 dark:bg-gray-900/70">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-400/10 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
              >
                <Link
                  to={ROUTES.HOME}
                  className="hover:text-gray-700 dark:hover:text-gray-200"
                >
                  Home
                </Link>
                <ChevronRight size={12} aria-hidden="true" />
                <Link
                  to={ROUTES.DAILY_QUIZ}
                  className="hover:text-gray-700 dark:hover:text-gray-200"
                >
                  Daily Quiz
                </Link>
                <ChevronRight size={12} aria-hidden="true" />
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Results
                </span>
              </nav>
            </motion.div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <DailyQuizResult
            attempt={attempt}
            quiz={quiz}
            timeTakenSeconds={timeTakenSeconds}
            onRetry={handleRetry}
            onExit={() => setView('intro')}
          />
        </div>
      </div>
    );
  }

  if (view === 'quiz' && quiz) {
    return (
      <div className="min-h-screen">
        <section className="relative overflow-hidden border-b border-white/20 bg-white/70 backdrop-blur-md shadow-sm dark:border-gray-800/50 dark:bg-gray-900/70">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-400/10 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-center justify-between gap-3"
            >
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
              >
                <Link
                  to={ROUTES.HOME}
                  className="hover:text-gray-700 dark:hover:text-gray-200"
                >
                  Home
                </Link>
                <ChevronRight size={12} aria-hidden="true" />
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Daily Quiz
                </span>
              </nav>
              <button
                type="button"
                onClick={() => setView('intro')}
                className="text-xs font-medium text-gray-500 hover:text-gray-700 focus-ring dark:text-gray-400 dark:hover:text-gray-200"
              >
                Quit quiz
              </button>
            </motion.div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <DailyQuizCard
            quiz={quiz}
            questionIndex={questionIndex}
            answers={answers}
            onSelect={handleSelect}
            onNext={handleNext}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    );
  }

  return null;
}
