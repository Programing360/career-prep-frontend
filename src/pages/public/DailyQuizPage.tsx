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
  BookOpen,
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
import examLottie from '../../assets/Exams Preparation.svg';

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
        setError('Unable to load today’s quiz. Please try again.');
        setView('error');
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const handleReload = useCallback(() => {
    setView('loading');
    setError(null);
    setReloadKey((k) => k + 1);
  }, []);

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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
        <section className="relative overflow-hidden border-b border-purple-100 dark:border-purple-900/40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
              >
                <Link
                  to={ROUTES.HOME}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Home
                </Link>
                <ChevronRight size={12} aria-hidden="true" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Daily Quiz
                </span>
              </nav>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-800/40 shadow-inner">
                  <Sparkles
                    size={24}
                    className="text-purple-600 dark:text-purple-400"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                    Daily Quiz
                  </h1>
                  <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                    Test your knowledge and stay sharp every day.
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
            <div className="mx-auto w-full max-w-2xl rounded-2xl border border-purple-100 dark:border-purple-900/30 bg-white/80 dark:bg-slate-900/80 px-6 py-12 text-center backdrop-blur-xl shadow-lg">
              <RefreshCcw
                size={36}
                className="mx-auto text-purple-400 dark:text-purple-600 animate-spin-slow"
                aria-hidden="true"
              />
              <p className="mt-4 text-base font-semibold text-slate-800 dark:text-slate-200">
                {error}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-6 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/50 text-purple-700 dark:text-purple-300"
                onClick={handleReload}
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
        {/* Header Hero Section */}
        <section className="relative overflow-hidden border-b border-purple-100 dark:border-purple-900/30 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
              >
                <Link
                  to={ROUTES.HOME}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Home
                </Link>
                <ChevronRight size={12} aria-hidden="true" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Daily Quiz
                </span>
              </nav>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-800/40 shadow-inner">
                  <Sparkles
                    size={24}
                    className="text-purple-600 dark:text-purple-400"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                    Daily Knowledge Challenge
                  </h1>
                  <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                    Boost your learning curve in just two minutes every day.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {completedAttempt && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-950/30 p-4 backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2
                  size={24}
                  className="shrink-0 text-emerald-600 dark:text-emerald-400"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    Already Completed Today!
                  </p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    You scored {completedAttempt.score}/
                    {completedAttempt.totalQuestions}. Take it again to improve
                    your rank!
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 border-emerald-300 dark:border-emerald-700 bg-white dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100"
                onClick={handleStart}
              >
                Retake Quiz
              </Button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="overflow-hidden rounded-3xl border border-purple-100 dark:border-purple-900/30 bg-white/80 dark:bg-slate-900/80 shadow-xl backdrop-blur-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Illustration Column */}
              <div className="relative flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-8 text-white">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]" />
                <div className="relative flex flex-col items-center text-center">
                  <img
                    src={examLottie}
                    alt="Children reading and learning"
                    className="md:h-58 w-full max-w-xl rounded-2xl object-cover shadow-2xl border-2 border-white/20"
                  />
                  <div className="mt-4 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                    <BookOpen size={14} className="text-purple-200" />
                    <span>Interactive Learning</span>
                  </div>
                </div>
              </div>

              {/* Details Column */}
              <div className="flex flex-col justify-between p-6 sm:p-8">
                <div>
                  <span className="inline-block rounded-lg bg-purple-100 dark:bg-purple-950 px-3 py-1 text-xs font-bold text-purple-700 dark:text-purple-300">
                    {quiz.category}
                  </span>
                  <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    {quiz.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    Challenge your general knowledge with handpicked daily
                    questions. Track your progress and build a learning streak!
                  </p>

                  <div className="mt-6 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-5 text-xs font-medium text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2.5">
                      <FileQuestion size={16} className="text-purple-500" />
                      <span>
                        <strong>{questionCount}</strong> Multiple Choice
                        Questions
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Timer size={16} className="text-purple-500" />
                      <span>
                        Estimated Duration: <strong>2 Minutes</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock size={16} className="text-purple-500" />
                      <span>
                        Self-paced, <strong>No Strict Timer</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={handleStart}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3.5 px-6 font-bold text-white shadow-lg shadow-purple-500/25 transition-all hover:from-purple-700 hover:to-indigo-700 hover:shadow-purple-500/40 active:scale-[0.98]"
                  >
                    <span>Start Quiz Now</span>
                    <ArrowRight size={18} />
                  </button>
                  <p className="mt-2 text-center text-[11px] text-slate-400 dark:text-slate-500">
                    Tip: Press 1–4 keys to select options and Enter to progress.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (view === 'result' && quiz && attempt) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
        <section className="relative overflow-hidden border-b border-purple-100 dark:border-purple-900/30 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm">
          <div className="relative mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
              >
                <Link
                  to={ROUTES.HOME}
                  className="hover:text-purple-600 dark:hover:text-purple-400"
                >
                  Home
                </Link>
                <ChevronRight size={12} aria-hidden="true" />
                <Link
                  to={ROUTES.DAILY_QUIZ}
                  className="hover:text-purple-600 dark:hover:text-purple-400"
                >
                  Daily Quiz
                </Link>
                <ChevronRight size={12} aria-hidden="true" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
        <section className="relative overflow-hidden border-b border-purple-100 dark:border-purple-900/30 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm">
          <div className="relative mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-center justify-between gap-3"
            >
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
              >
                <Link
                  to={ROUTES.HOME}
                  className="hover:text-purple-600 dark:hover:text-purple-400"
                >
                  Home
                </Link>
                <ChevronRight size={12} aria-hidden="true" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Daily Quiz Active
                </span>
              </nav>
              <button
                type="button"
                onClick={() => setView('intro')}
                className="text-xs font-semibold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors"
              >
                Quit Quiz
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
