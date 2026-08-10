import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  Home,
  RefreshCcw,
  Share2,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import type {
  DailyQuiz,
  DailyQuizAttempt,
  DailyQuizQuestion,
} from '@/types/dailyQuiz';
import resultLottie from '../../assets/Successful target.svg';

interface DailyQuizResultProps {
  attempt: DailyQuizAttempt;
  quiz: DailyQuiz;
  timeTakenSeconds: number;
  onRetry: () => void;
  onExit: () => void;
}

function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s} sec`;
  return `${m} min ${s} sec`;
}

function resultHeadline(
  score: number,
  total: number
): { title: string; emoji: string } {
  const ratio = total > 0 ? score / total : 0;
  if (ratio >= 0.9) return { title: 'Outstanding!', emoji: '🌟' };
  if (ratio >= 0.7) return { title: 'Great job!', emoji: '🎉' };
  if (ratio >= 0.5) return { title: 'Good effort!', emoji: '👏' };
  return { title: 'Keep practising!', emoji: '💪' };
}

function QuestionReview({
  question,
  index,
  answer,
}: {
  question: DailyQuizQuestion;
  index: number;
  answer?: string;
}) {
  const [showExplanation, setShowExplanation] = useState(false);
  const correctOption = question.options.find(
    (o) => o.id === question.correctAnswerId
  );
  const isCorrect = answer === question.correctAnswerId;

  return (
    <div className="rounded-xl border border-white/20 bg-white/70 p-4 backdrop-blur-md shadow-lg dark:border-slate-800/50 dark:bg-slate-900/70">
      <div className="flex items-start justify-between gap-3">
        <p className="flex items-start gap-2 text-sm font-semibold text-slate-900 dark:text-white">
          <span className="mt-0.5 shrink-0 text-xs font-bold text-slate-400 dark:text-slate-500">
            {index + 1}.
          </span>
          <span>{question.text}</span>
        </p>
        {isCorrect ? (
          <CheckCircle2
            size={18}
            className="shrink-0 text-emerald-500"
            aria-label="Correct"
          />
        ) : (
          <XCircle
            size={18}
            className="shrink-0 text-rose-500"
            aria-label="Incorrect"
          />
        )}
      </div>

      <div className="mt-3 space-y-1.5 text-xs">
        <p className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <span className="w-20 shrink-0 font-medium">Your answer:</span>
          <span
            className={cn(
              'rounded-md px-2 py-0.5 font-semibold',
              isCorrect
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
            )}
          >
            {question.options.find((o) => o.id === answer)?.text ??
              'Not answered'}
          </span>
        </p>
        {!isCorrect && (
          <p className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span className="w-20 shrink-0 font-medium">Correct answer:</span>
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              {correctOption?.text}
            </span>
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => setShowExplanation((v) => !v)}
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700 focus-ring dark:text-purple-400 dark:hover:text-purple-300"
        aria-expanded={showExplanation}
      >
        <ChevronDown
          size={13}
          aria-hidden="true"
          className={cn(
            'transition-transform duration-200',
            showExplanation && 'rotate-180'
          )}
        />
        {showExplanation ? 'Hide explanation' : 'Why?'}
      </button>

      {showExplanation && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600 dark:bg-slate-800/60 dark:text-slate-300"
        >
          {question.explanation}
        </motion.p>
      )}
    </div>
  );
}

export function DailyQuizResult({
  attempt,
  quiz,
  timeTakenSeconds,
  onRetry,
  onExit,
}: DailyQuizResultProps) {
  const { showToast } = useToast();
  const headline = useMemo(
    () => resultHeadline(attempt.score, attempt.totalQuestions),
    [attempt.score, attempt.totalQuestions]
  );
  const shareLink = useMemo(() => {
    if (typeof window === 'undefined') return ROUTES.DAILY_QUIZ;
    return `${window.location.origin}${ROUTES.DAILY_QUIZ}`;
  }, []);
  const shareText = `I scored ${attempt.score}/${attempt.totalQuestions} on today's MeritPrep Daily Quiz! Try it here: ${shareLink}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MeritPrep Daily Quiz',
          text: shareText,
          url: shareLink,
        });
        return;
      } catch {
        // user cancelled or share failed — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(shareText);
      showToast('Score copied to clipboard — share it anywhere!', 'success');
    } catch {
      showToast('Could not copy the score. Please try again.', 'error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="mx-auto w-full max-w-5xl"
    >
      {/* Main Results Card */}
      <div className="overflow-hidden rounded-3xl border border-purple-100 bg-white/80 shadow-xl backdrop-blur-xl dark:border-purple-900/30 dark:bg-slate-900/80">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Visual & Lottie Banner */}
          <div className="relative flex flex-col items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-700 to-violet-900 p-8 text-white lg:col-span-5">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent)]" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="relative mb-4 flex h-48 w-64 items-center justify-center rounded-2xl bg-white/10 p-2 shadow-2xl backdrop-blur-md ring-1 ring-white/20">
                {/* <iframe
                  src="https://lottie.host/embed/849c63b2-7bc0-4e5a-a3a8-44d4dd2c22ec/7o0w63o9Jb.lottie"
                  title="Interactive Quiz Animation"
                  className="pointer-events-none h-full w-full rounded-xl border-0"
                /> */}
                <img src={resultLottie} alt="Successful target"></img>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-purple-100 backdrop-blur-md">
                <Trophy size={14} className="text-amber-300" />
                Quiz Complete
              </span>
              <p className="mt-2 max-w-xs text-xs text-purple-200/90">
                Great job working through the questions! Here is how you
                performed today.
              </p>
            </div>
          </div>

          {/* Right Statistics & Actions Section */}
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                {headline.title} {headline.emoji}
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                {quiz.title}
              </p>

              <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-purple-100/60 bg-purple-50/50 p-6 dark:border-purple-900/30 dark:bg-purple-950/20 sm:flex-row sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    Your Score
                  </p>
                  <p className="mt-1 text-4xl font-black tabular-nums tracking-tight text-purple-700 dark:text-purple-300">
                    {attempt.score}{' '}
                    <span className="text-2xl text-slate-400">
                      / {attempt.totalQuestions}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2.5 shadow-sm dark:bg-slate-800/80">
                  <Clock
                    size={16}
                    className="text-purple-600 dark:text-purple-400"
                  />
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Time Taken
                    </p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {formatDuration(timeTakenSeconds)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  leftIcon={<Share2 size={15} aria-hidden="true" />}
                  onClick={handleShare}
                  className="border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-950/50"
                >
                  Share Score
                </Button>
                <Button
                  size="md"
                  fullWidth
                  leftIcon={<RefreshCcw size={15} aria-hidden="true" />}
                  onClick={onRetry}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                >
                  Take Again
                </Button>
              </div>

              <div className="mt-4 text-center sm:text-left">
                <Link
                  to={ROUTES.HOME}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 focus-ring dark:text-slate-400 dark:hover:text-purple-400"
                >
                  <Home size={14} aria-hidden="true" />
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="mt-8">
        <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
          <Sparkles size={16} className="text-purple-500" aria-hidden="true" />
          Review your answers
        </h3>
        <div className="mt-4 space-y-3">
          {quiz.questions.map((question, index) => (
            <QuestionReview
              key={question.id}
              question={question}
              index={index}
              answer={attempt.answers[question.id]}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onExit}
          className="text-slate-500 bg-slate-300 shadow-md"
        >
          Done
        </Button>
      </div>
    </motion.div>
  );
}
