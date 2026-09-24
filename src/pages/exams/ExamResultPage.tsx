import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Trophy,
  Clock,
  Target,
  TrendingUp,
  Check,
  XIcon,
  SkipForward,
  ArrowLeft,
  Brain,
  ChevronRight,
  BarChart3,
  Award,
  BookOpen,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { getResult, getExamById } from '@/services/examApi';
import type { MCQ } from '@/types';
import type { RootState } from '@/store/store';
import type { ExamResult } from '@/store/slices/examAttemptSlice';

type ReviewTab = 'all' | 'incorrect' | 'skipped';

interface ResultViewData {
  examTitle: string;
  totalQuestions: number;
  durationMinutes: number;
  result: ExamResult;
  timeTakenMinutes: number;
  answers: Record<string, string>;
  questions: MCQ[];
}

const subjectLabels: Record<string, string> = {
  english: 'English',
  gk: 'General Knowledge',
  reasoning: 'Verbal & Reasoning',
  urdu: 'Urdu',
  accounting: 'Accounting',
};

function getPredictedPercentile(accuracy: number): string {
  if (accuracy >= 90) return '95th';
  if (accuracy >= 80) return '85th';
  if (accuracy >= 70) return '72nd';
  if (accuracy >= 60) return '58th';
  if (accuracy >= 50) return '42nd';
  return '28th';
}

function getGrade(accuracy: number): { label: string; color: string } {
  if (accuracy >= 80) return { label: 'Excellent', color: 'text-accent-600' };
  if (accuracy >= 65) return { label: 'Good', color: 'text-primary-600' };
  if (accuracy >= 50) return { label: 'Average', color: 'text-primary-600' };
  return { label: 'Needs Improvement', color: 'text-danger-600' };
}

export default function ExamResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const examAttempt = useSelector((state: RootState) => state.examAttempt);

  const [reviewTab, setReviewTab] = useState<ReviewTab>('all');
  const [expandedAi, setExpandedAi] = useState<Record<string, boolean>>({});

  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiData, setApiData] = useState<ResultViewData | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const hasLiveResult =
    !!examAttempt.result && examAttempt.questions.length > 0;

  useEffect(() => {
    if (hasLiveResult) return;
    let cancelled = false;
    async function load() {
      setApiLoading(true);
      setApiError(null);
      try {
        const attemptId = id || '';
        const res = await getResult(attemptId);
        const questions = res.questionReview.map((r) => r.mcq);
        const answers: Record<string, string> = {};
        for (const r of res.questionReview) {
          if (r.selectedOptionId != null) {
            answers[r.mcq._id] = r.selectedOptionId;
          }
        }
        const totalQuestions = questions.length;
        const correct = res.totalCorrect;
        const incorrect = res.totalIncorrect;
        const skipped = res.totalSkipped;
        let examTitle = 'Exam Result';
        let durationMinutes = 30;
        try {
          const exam = await getExamById(res.attempt.examId);
          examTitle = exam.title;
          durationMinutes = exam.duration;
        } catch {
          // title/duration are best-effort
        }
        const summary: ExamResult = {
          totalQuestions,
          answered: correct + incorrect,
          correct,
          incorrect,
          unanswered: skipped,
          markedForReview: 0,
          score: res.score,
          totalMarks: totalQuestions,
          accuracy:
            res.percentage ?? Math.round((res.score / totalQuestions) * 100),
        };
        if (!cancelled) {
          setApiData({
            examTitle,
            totalQuestions,
            durationMinutes,
            result: summary,
            timeTakenMinutes: 0,
            answers,
            questions,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setApiError(
            err instanceof Error
              ? err.message
              : 'Failed to load exam result. Please try again.'
          );
        }
      } finally {
        if (!cancelled) setApiLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id, hasLiveResult, retryKey]);

  const data = useMemo<ResultViewData>(() => {
    if (hasLiveResult) {
      const timeUsed =
        examAttempt.durationMinutes * 60 - examAttempt.timeRemaining;
      return {
        examTitle: examAttempt.examTitle,
        totalQuestions: examAttempt.questions.length,
        durationMinutes: examAttempt.durationMinutes,
        result: examAttempt.result as ExamResult,
        timeTakenMinutes: Math.round(timeUsed / 60),
        answers: examAttempt.answers,
        questions: examAttempt.questions,
      };
    }
    return apiData as ResultViewData;
  }, [examAttempt, apiData, hasLiveResult]);

  const questions = useMemo(() => data?.questions ?? [], [data?.questions]);
  const answers = useMemo(() => data?.answers ?? {}, [data?.answers]);

  const subjectBreakdown = useMemo(() => {
    const map: Record<
      string,
      { total: number; correct: number; incorrect: number; skipped: number }
    > = {};
    for (const q of questions) {
      const sid = q.subjectId ?? 'general';
      if (!map[sid])
        map[sid] = { total: 0, correct: 0, incorrect: 0, skipped: 0 };
      map[sid].total += 1;
      const ans = answers[q._id];
      const correctId = q.options.find((o) => o.isCorrect)?.id;
      if (ans === undefined) {
        map[sid].skipped += 1;
      } else if (ans === correctId) {
        map[sid].correct += 1;
      } else {
        map[sid].incorrect += 1;
      }
    }
    return map;
  }, [questions, answers]);

  const filteredQuestions = useMemo(() => {
    if (reviewTab === 'all') return questions;
    if (reviewTab === 'incorrect')
      return questions.filter((q) => {
        const a = answers[q._id];
        const correctId = q.options.find((o) => o.isCorrect)?.id;
        return a !== undefined && a !== correctId;
      });
    return questions.filter((q) => answers[q._id] === undefined);
  }, [questions, answers, reviewTab]);

  if (apiError) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-danger-200 bg-danger-50/40 p-8 text-center dark:border-danger-800">
          <p className="text-sm text-[rgb(var(--color-text-secondary))]">
            {apiError}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setApiError(null);
              setRetryKey((k) => k + 1);
            }}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (apiLoading || !data) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <Loader2
            size={32}
            className="mx-auto animate-spin text-primary-500"
          />
          <p className="mt-4 text-sm text-[rgb(var(--color-text-secondary))]">
            Loading result...
          </p>
        </div>
      </div>
    );
  }

  const { result, examTitle, timeTakenMinutes, durationMinutes } = data;

  const grade = getGrade(result.accuracy);

  const toggleAi = (qId: string) => {
    setExpandedAi((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate(ROUTES.EXAMS)}
            className="rounded-lg p-2 text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-elevated))]"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
              Exam Result
            </h1>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">
              {examTitle}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900">
              <Trophy
                size={28}
                className="text-primary-600 dark:text-primary-400"
              />
            </div>
            <div>
              <p className="text-2xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
                {result.score} / {result.totalMarks}
              </p>
              <p className={cn('text-sm font-semibold', grade.color)}>
                {grade.label} &middot; {result.accuracy}% Accuracy
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <ScorecardStat
              icon={Target}
              label="Total Marks"
              value={`${result.score}/${result.totalMarks}`}
            />
            <ScorecardStat
              icon={Clock}
              label="Time Taken"
              value={`${timeTakenMinutes} min`}
              subtext={`of ${durationMinutes} min`}
            />
            <ScorecardStat
              icon={TrendingUp}
              label="Accuracy"
              value={`${result.accuracy}%`}
            />
            <ScorecardStat
              icon={Award}
              label="Predicted Rank"
              value={getPredictedPercentile(result.accuracy)}
              subtext="percentile"
            />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <MiniStat
              label="Correct"
              value={result.correct}
              color="text-accent-600"
              bg="bg-accent-50 dark:bg-accent-950"
            />
            <MiniStat
              label="Incorrect"
              value={result.incorrect}
              color="text-danger-600"
              bg="bg-danger-50 dark:bg-danger-950"
            />
            <MiniStat
              label="Skipped"
              value={result.unanswered}
              color="text-[rgb(var(--color-text-secondary))]"
              bg="bg-[rgb(var(--color-surface-elevated))]"
            />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-primary-500" />
            <h2 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
              Subject-wise Performance
            </h2>
          </div>

          <div className="mt-4 space-y-4">
            {Object.entries(subjectBreakdown).map(([sid, stats]) => {
              const pct =
                stats.total > 0
                  ? Math.round((stats.correct / stats.total) * 100)
                  : 0;
              return (
                <div key={sid}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                      {subjectLabels[sid] || sid}
                    </span>
                    <span className="text-xs font-semibold text-[rgb(var(--color-text-secondary))]">
                      {stats.correct}/{stats.total} ({pct}%)
                    </span>
                  </div>
                  <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[rgb(var(--color-surface-elevated))]">
                    <div
                      className={cn(
                        'absolute inset-y-0 left-0 rounded-full transition-all duration-700',
                        pct >= 75
                          ? 'bg-accent-500'
                          : pct >= 50
                            ? 'bg-primary-500'
                            : pct >= 30
                              ? 'bg-primary-500'
                              : 'bg-danger-500'
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-1 flex gap-3 text-[10px] text-[rgb(var(--color-text-muted))]">
                    <span className="text-accent-600">
                      {stats.correct} correct
                    </span>
                    <span className="text-danger-600">
                      {stats.incorrect} incorrect
                    </span>
                    <span>{stats.skipped} skipped</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
          <div className="border-b border-[rgb(var(--color-border))] px-5 py-4">
            <h2 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
              Question-by-Question Review
            </h2>
          </div>

          <div className="flex gap-1 border-b border-[rgb(var(--color-border))] px-5">
            {(
              [
                {
                  id: 'all' as ReviewTab,
                  label: 'All',
                  count: questions.length,
                },
                {
                  id: 'incorrect' as ReviewTab,
                  label: 'Incorrect',
                  count: result.incorrect,
                },
                {
                  id: 'skipped' as ReviewTab,
                  label: 'Skipped',
                  count: result.unanswered,
                },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setReviewTab(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-medium transition-colors',
                  reviewTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]'
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-[9px] font-bold',
                    reviewTab === tab.id
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-muted))]'
                  )}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="divide-y divide-[rgb(var(--color-border))]">
            {filteredQuestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Check size={32} className="text-accent-500 opacity-50" />
                <p className="mt-2 text-sm font-medium text-[rgb(var(--color-text-secondary))]">
                  {reviewTab === 'incorrect'
                    ? 'No incorrect answers!'
                    : 'No skipped questions!'}
                </p>
              </div>
            ) : (
              filteredQuestions.map((q, idx) => {
                const studentAns = answers[q._id];
                const correctOpt = q.options.find((o) => o.isCorrect);
                const isCorrect = studentAns === correctOpt?.id;
                const wasSkipped = studentAns === undefined;
                const studentOpt = q.options.find((o) => o.id === studentAns);

                return (
                  <div key={q._id} className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <span
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                          wasSkipped
                            ? 'bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-muted))]'
                            : isCorrect
                              ? 'bg-accent-500 text-white'
                              : 'bg-danger-500 text-white'
                        )}
                      >
                        {wasSkipped ? (
                          <SkipForward size={12} />
                        ) : isCorrect ? (
                          <Check size={12} />
                        ) : (
                          <XIcon size={12} />
                        )}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium text-[rgb(var(--color-text-muted))]">
                            Q{idx + 1}
                          </span>
                          <span
                            className={cn(
                              'rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase',
                              q.difficulty === 'easy'
                                ? 'bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300'
                                : q.difficulty === 'medium'
                                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                                  : 'bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300'
                            )}
                          >
                            {q.difficulty}
                          </span>
                          <span className="text-[10px] text-[rgb(var(--color-text-muted))]">
                            {q.subjectId
                              ? subjectLabels[q.subjectId] || q.subjectId
                              : ''}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-medium text-[rgb(var(--color-text-primary))]">
                          {q.question}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {q.options.map((opt, oi) => {
                            const isStudentChoice = studentAns === opt.id;
                            const isCorrectOpt = !!opt.isCorrect;
                            return (
                              <span
                                key={opt.id}
                                className={cn(
                                  'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs',
                                  isCorrectOpt
                                    ? 'border-accent-400 bg-accent-50 text-accent-700 dark:bg-accent-950 dark:text-accent-300'
                                    : isStudentChoice && !isCorrectOpt
                                      ? 'border-danger-400 bg-danger-50 text-danger-700 dark:bg-danger-950 dark:text-danger-300'
                                      : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-text-muted))]'
                                )}
                              >
                                {isCorrectOpt && <Check size={10} />}
                                {isStudentChoice && !isCorrectOpt && (
                                  <XIcon size={10} />
                                )}
                                {String.fromCharCode(65 + oi)}. {opt.text}
                              </span>
                            );
                          })}
                        </div>

                        {wasSkipped && correctOpt && (
                          <p className="mt-1.5 text-xs text-[rgb(var(--color-text-muted))]">
                            You skipped this question. Correct answer:{' '}
                            <span className="font-semibold text-accent-600">
                              {String.fromCharCode(
                                65 + q.options.indexOf(correctOpt)
                              )}
                              . {correctOpt.text}
                            </span>
                          </p>
                        )}

                        {!wasSkipped &&
                          !isCorrect &&
                          studentOpt &&
                          correctOpt && (
                            <p className="mt-1.5 text-xs text-[rgb(var(--color-text-muted))]">
                              Your answer:{' '}
                              <span className="font-semibold text-danger-600">
                                {String.fromCharCode(
                                  65 + q.options.indexOf(studentOpt)
                                )}
                                . {studentOpt.text}
                              </span>{' '}
                              &middot; Correct:{' '}
                              <span className="font-semibold text-accent-600">
                                {String.fromCharCode(
                                  65 + q.options.indexOf(correctOpt)
                                )}
                                . {correctOpt.text}
                              </span>
                            </p>
                          )}

                        {q.explanation && (
                          <button
                            onClick={() => toggleAi(q._id)}
                            className="mt-2 flex items-center gap-1 text-xs font-medium text-primary-500 hover:text-primary-600"
                          >
                            <Brain size={12} />
                            {expandedAi[q._id]
                              ? 'Hide'
                              : 'Ask AI for Detailed Explanation'}
                            <ChevronRight
                              size={10}
                              className={cn(
                                'transition-transform',
                                expandedAi[q._id] && 'rotate-90'
                              )}
                            />
                          </button>
                        )}

                        {expandedAi[q._id] && (
                          <div className="mt-2 rounded-lg border border-primary-200 bg-primary-50/50 p-3 dark:border-primary-800 dark:bg-primary-950/50">
                            <div className="flex items-start gap-2">
                              <Brain
                                size={14}
                                className="mt-0.5 shrink-0 text-primary-500"
                              />
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                                  AI Explanation
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-[rgb(var(--color-text-secondary))]">
                                  {q.explanation ||
                                    'No detailed explanation available.'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link to={ROUTES.PRACTICE}>
            <Button leftIcon={<BookOpen size={14} />}>
              Practice Weak Topics
            </Button>
          </Link>
          <Link to={ROUTES.EXAMS}>
            <Button variant="outline" leftIcon={<ArrowLeft size={14} />}>
              Back to Exams
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ScorecardStat({
  icon: Icon,
  label,
  value,
  subtext,
}: {
  icon: typeof Target;
  label: string;
  value: string;
  subtext?: string;
}) {
  return (
    <div className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-3">
      <Icon size={16} className="text-primary-500" />
      <p className="mt-1.5 text-xs text-[rgb(var(--color-text-muted))]">
        {label}
      </p>
      <p className="text-base font-bold text-[rgb(var(--color-text-primary))]">
        {value}
      </p>
      {subtext && (
        <p className="text-[10px] text-[rgb(var(--color-text-muted))]">
          {subtext}
        </p>
      )}
    </div>
  );
}

function MiniStat({
  label,
  value,
  color,
  bg,
}: {
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div className={cn('rounded-lg p-3 text-center', bg)}>
      <p className={cn('text-xl font-bold', color)}>{value}</p>
      <p className="text-[10px] text-[rgb(var(--color-text-muted))]">{label}</p>
    </div>
  );
}
