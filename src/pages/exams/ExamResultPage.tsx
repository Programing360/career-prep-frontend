import { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import type { MCQ } from '@/types';
import type { RootState } from '@/store/store';
import type { ExamResult } from '@/store/slices/examAttemptSlice';

type ReviewTab = 'all' | 'incorrect' | 'skipped';

const subjectLabels: Record<string, string> = {
  english: 'English',
  gk: 'General Knowledge',
  reasoning: 'Verbal & Reasoning',
  urdu: 'Urdu',
  accounting: 'Accounting',
};

const mockExamResults: Record<
  string,
  {
    examTitle: string;
    totalQuestions: number;
    durationMinutes: number;
    result: ExamResult;
    timeTakenMinutes: number;
    answers: Record<string, number>;
    questions: MCQ[];
  }
> = {
  'css-preliminary': {
    examTitle: 'CSS Preliminary Exam 2025',
    totalQuestions: 10,
    durationMinutes: 120,
    timeTakenMinutes: 87,
    result: {
      totalQuestions: 10,
      answered: 10,
      correct: 7,
      incorrect: 3,
      unanswered: 0,
      markedForReview: 1,
      score: 7,
      totalMarks: 10,
      accuracy: 70,
    },
    answers: {
      'eq-1': 1,
      'eq-2': 1,
      'eq-3': 0,
      'eq-4': 2,
      'eq-5': 2,
      'eq-6': 2,
      'eq-7': 1,
      'eq-8': 2,
      'eq-9': 2,
      'eq-10': 0,
    },
    questions: [
      {
        id: 'eq-1',
        examId: 'css-preliminary',
        subjectId: 'gk',
        question: 'Which of the following is the capital of Turkey?',
        options: ['Istanbul', 'Ankara', 'Izmir', 'Antalya'],
        correctAnswer: 1,
        difficulty: 'easy',
      },
      {
        id: 'eq-2',
        examId: 'css-preliminary',
        subjectId: 'english',
        question: 'Choose the antonym of "Ephemeral":',
        options: ['Fleeting', 'Permanent', 'Transient', 'Brief'],
        correctAnswer: 1,
        difficulty: 'medium',
      },
      {
        id: 'eq-3',
        examId: 'css-preliminary',
        subjectId: 'reasoning',
        question: 'If 5x + 3 = 28, what is the value of x?',
        options: ['5', '6', '7', '8'],
        correctAnswer: 1,
        difficulty: 'easy',
      },
      {
        id: 'eq-4',
        examId: 'css-preliminary',
        subjectId: 'gk',
        question:
          'The Great Wall of China was primarily built to protect against invasions from which direction?',
        options: ['South', 'East', 'North', 'West'],
        correctAnswer: 2,
        difficulty: 'easy',
      },
      {
        id: 'eq-5',
        examId: 'css-preliminary',
        subjectId: 'english',
        question:
          'Which figure of speech is used in: "The wind whispered through the trees"?',
        options: ['Simile', 'Metaphor', 'Personification', 'Hyperbole'],
        correctAnswer: 2,
        difficulty: 'medium',
      },
      {
        id: 'eq-6',
        examId: 'css-preliminary',
        subjectId: 'gk',
        question: 'What is the smallest prime number?',
        options: ['0', '1', '2', '3'],
        correctAnswer: 2,
        difficulty: 'easy',
      },
      {
        id: 'eq-7',
        examId: 'css-preliminary',
        subjectId: 'reasoning',
        question: 'Find the next number: 3, 7, 15, 31, 63, ?',
        options: ['96', '127', '125', '128'],
        correctAnswer: 1,
        difficulty: 'medium',
      },
      {
        id: 'eq-8',
        examId: 'css-preliminary',
        subjectId: 'gk',
        question: 'Which organ produces insulin?',
        options: ['Liver', 'Kidney', 'Pancreas', 'Heart'],
        correctAnswer: 2,
        difficulty: 'easy',
      },
      {
        id: 'eq-9',
        examId: 'css-preliminary',
        subjectId: 'english',
        question: '"Neither the teacher nor the students ___ present."',
        options: ['was', 'is', 'were', 'has been'],
        correctAnswer: 2,
        difficulty: 'medium',
      },
      {
        id: 'eq-10',
        examId: 'css-preliminary',
        subjectId: 'reasoning',
        question: 'A clock shows 3:15. Angle between hour and minute hands?',
        options: ['0 degrees', '7.5 degrees', '15 degrees', '22.5 degrees'],
        correctAnswer: 1,
        difficulty: 'hard',
      },
    ],
  },
};

const mockAiExplanations: Record<string, string> = {
  'eq-3':
    'To solve 5x + 3 = 28: Subtract 3 from both sides: 5x = 25. Divide by 5: x = 5. Wait — 5(5)+3 = 28? 25+3 = 28. Yes! But the answer marked was 0 (x=5), which is option A. The correct answer is option B (x=5). Check: 5(5)+3=28. Correct!',
  'eq-5':
    '"The wind whispered through the trees" uses Personification — attributing human qualities (whispering) to a non-human entity (wind). Personification makes descriptions more vivid and relatable.',
  'eq-10':
    'At 3:15, the minute hand points at 3 (90 degrees from 12). The hour hand is at 3 + (15/60) of the way to 4 = 3.25 hours. Hour hand angle = 3.25 x 30 = 97.5 degrees. Angle between hands = 97.5 - 90 = 7.5 degrees.',
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
  if (accuracy >= 50) return { label: 'Average', color: 'text-amber-600' };
  return { label: 'Needs Improvement', color: 'text-danger-600' };
}

export default function ExamResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const examAttempt = useSelector((state: RootState) => state.examAttempt);

  const [reviewTab, setReviewTab] = useState<ReviewTab>('all');
  const [expandedAi, setExpandedAi] = useState<Record<string, boolean>>({});

  const data = useMemo(() => {
    if (examAttempt.result && examAttempt.questions.length > 0) {
      const timeUsed =
        examAttempt.durationMinutes * 60 - examAttempt.timeRemaining;
      return {
        examTitle: examAttempt.examTitle,
        totalQuestions: examAttempt.questions.length,
        durationMinutes: examAttempt.durationMinutes,
        result: examAttempt.result,
        timeTakenMinutes: Math.round(timeUsed / 60),
        answers: examAttempt.answers,
        questions: examAttempt.questions,
      };
    }
    return mockExamResults[id || ''] || mockExamResults['css-preliminary'];
  }, [examAttempt, id]);

  const {
    result,
    questions,
    answers,
    examTitle,
    timeTakenMinutes,
    durationMinutes,
  } = data;

  const subjectBreakdown = useMemo(() => {
    const map: Record<
      string,
      { total: number; correct: number; incorrect: number; skipped: number }
    > = {};
    for (const q of questions) {
      const sid = q.subjectId;
      if (!map[sid])
        map[sid] = { total: 0, correct: 0, incorrect: 0, skipped: 0 };
      map[sid].total += 1;
      const ans = answers[q.id];
      if (ans === undefined) {
        map[sid].skipped += 1;
      } else if (ans === q.correctAnswer) {
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
        const a = answers[q.id];
        return a !== undefined && a !== q.correctAnswer;
      });
    return questions.filter((q) => answers[q.id] === undefined);
  }, [questions, answers, reviewTab]);

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
                              ? 'bg-amber-500'
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
                const studentAns = answers[q.id];
                const isCorrect = studentAns === q.correctAnswer;
                const wasSkipped = studentAns === undefined;

                return (
                  <div key={q.id} className="px-5 py-4">
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
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                                  : 'bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300'
                            )}
                          >
                            {q.difficulty}
                          </span>
                          <span className="text-[10px] text-[rgb(var(--color-text-muted))]">
                            {subjectLabels[q.subjectId] || q.subjectId}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-medium text-[rgb(var(--color-text-primary))]">
                          {q.question}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {q.options.map((opt, oi) => {
                            const isStudentChoice = studentAns === oi;
                            const isCorrectOpt = oi === q.correctAnswer;
                            return (
                              <span
                                key={oi}
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
                                {String.fromCharCode(65 + oi)}. {opt}
                              </span>
                            );
                          })}
                        </div>

                        {wasSkipped && (
                          <p className="mt-1.5 text-xs text-[rgb(var(--color-text-muted))]">
                            You skipped this question. Correct answer:{' '}
                            <span className="font-semibold text-accent-600">
                              {String.fromCharCode(65 + q.correctAnswer)}.{' '}
                              {q.options[q.correctAnswer]}
                            </span>
                          </p>
                        )}

                        {!wasSkipped && !isCorrect && (
                          <p className="mt-1.5 text-xs text-[rgb(var(--color-text-muted))]">
                            Your answer:{' '}
                            <span className="font-semibold text-danger-600">
                              {String.fromCharCode(65 + studentAns)}.{' '}
                              {q.options[studentAns]}
                            </span>{' '}
                            &middot; Correct:{' '}
                            <span className="font-semibold text-accent-600">
                              {String.fromCharCode(65 + q.correctAnswer)}.{' '}
                              {q.options[q.correctAnswer]}
                            </span>
                          </p>
                        )}

                        {q.explanation && (
                          <button
                            onClick={() => toggleAi(q.id)}
                            className="mt-2 flex items-center gap-1 text-xs font-medium text-primary-500 hover:text-primary-600"
                          >
                            <Brain size={12} />
                            {expandedAi[q.id]
                              ? 'Hide'
                              : 'Ask AI for Detailed Explanation'}
                            <ChevronRight
                              size={10}
                              className={cn(
                                'transition-transform',
                                expandedAi[q.id] && 'rotate-90'
                              )}
                            />
                          </button>
                        )}

                        {expandedAi[q.id] && (
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
                                  {mockAiExplanations[q.id] ||
                                    q.explanation ||
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
