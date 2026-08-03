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
  if (ratio >= 0.9) return { title: 'Outstanding!', emoji: '\u{1F31F}' };
  if (ratio >= 0.7) return { title: 'Great job!', emoji: '\u{1F389}' };
  if (ratio >= 0.5) return { title: 'Good effort!', emoji: '\u{1F44F}' };
  return { title: 'Keep practising!', emoji: '\u{1F4AA}' };
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
    <div className="rounded-xl border border-white/20 bg-white/70 p-4 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
      <div className="flex items-start justify-between gap-3">
        <p className="flex items-start gap-2 text-sm font-semibold text-gray-900 dark:text-white">
          <span className="mt-0.5 shrink-0 text-xs font-bold text-gray-400 dark:text-gray-500">
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
            className="shrink-0 text-danger-400"
            aria-label="Incorrect"
          />
        )}
      </div>

      <div className="mt-3 space-y-1.5 text-xs">
        <p className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
          <span className="w-12 shrink-0 font-medium">Your answer</span>
          <span
            className={cn(
              'rounded-md px-2 py-0.5 font-semibold',
              isCorrect
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'bg-danger-50 text-danger-700 dark:bg-danger-950/40 dark:text-danger-300'
            )}
          >
            {question.options.find((o) => o.id === answer)?.text ??
              'Not answered'}
          </span>
        </p>
        {!isCorrect && (
          <p className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <span className="w-12 shrink-0 font-medium">Correct</span>
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              {correctOption?.text}
            </span>
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => setShowExplanation((v) => !v)}
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 focus-ring dark:text-primary-400 dark:hover:text-primary-300"
        aria-expanded={showExplanation}
      >
        <ChevronDown
          size={13}
          aria-hidden="true"
          className={cn(
            'transition-transform',
            showExplanation && 'rotate-180'
          )}
        />
        {showExplanation ? 'Hide explanation' : 'Why?'}
      </button>

      {showExplanation && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-xs leading-relaxed text-gray-600 dark:bg-gray-800/60 dark:text-gray-300"
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
      className="mx-auto w-full max-w-2xl"
    >
      <div className="rounded-2xl border border-white/20 bg-white/70 p-6 text-center shadow-sm backdrop-blur-md sm:p-8 dark:border-gray-800/50 dark:bg-gray-900/70">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
          <Trophy
            size={32}
            className="text-primary-600 dark:text-primary-400"
            aria-hidden="true"
          />
        </div>
        <h2 className="mt-4 text-2xl font-black font-heading text-gray-900 dark:text-white">
          {headline.title} {headline.emoji}
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {quiz.title}
        </p>

        <div className="mt-5">
          <p className="text-5xl font-black tabular-nums tracking-tight text-primary-600 dark:text-primary-400">
            {attempt.score}/{attempt.totalQuestions}
          </p>
          <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
            correct answers
          </p>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Clock size={13} aria-hidden="true" />
          Time taken: {formatDuration(timeTakenSeconds)}
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            size="md"
            fullWidth
            leftIcon={<Share2 size={15} aria-hidden="true" />}
            onClick={handleShare}
          >
            Share My Score
          </Button>
          <Button
            variant="outline"
            size="md"
            fullWidth
            leftIcon={<RefreshCcw size={15} aria-hidden="true" />}
            onClick={onRetry}
          >
            Take Again
          </Button>
        </div>

        <Link
          to={ROUTES.HOME}
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 focus-ring dark:text-gray-400 dark:hover:text-gray-200"
        >
          <Home size={12} aria-hidden="true" />
          Back to Home
        </Link>
      </div>

      <div className="mt-6">
        <h3 className="flex items-center gap-2 text-sm font-bold font-heading text-gray-900 dark:text-white">
          <Sparkles size={15} className="text-primary-500" aria-hidden="true" />
          Review your answers
        </h3>
        <div className="mt-3 space-y-3">
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

      <div className="mt-6 text-center">
        <Button variant="ghost" size="sm" onClick={onExit}>
          Done
        </Button>
      </div>
    </motion.div>
  );
}
