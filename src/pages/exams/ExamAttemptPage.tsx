import { useEffect, useCallback, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Clock,
  AlertTriangle,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Flag,
  RotateCcw,
  Menu,
  XIcon,
  Trophy,
  Target,
  BarChart3,
  MinusCircle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import type { MCQ } from '@/types';
import type { RootState } from '@/store/store';
import type { QuestionStatus } from '@/store/slices/examAttemptSlice';
import {
  initExam,
  selectOption,
  clearResponse,
  toggleMarkForReview,
  goToQuestion,
  tickTimer,
  setShowSubmitModal,
  submitExam,
  resetExam,
} from '@/store/slices/examAttemptSlice';

const mockExamData: Record<
  string,
  { title: string; durationMinutes: number; questions: MCQ[] }
> = {
  'css-preliminary': {
    title: 'CSS Preliminary Exam 2025',
    durationMinutes: 120,
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
        question: 'Find the next number in the series: 3, 7, 15, 31, 63, ?',
        options: ['96', '127', '125', '128'],
        correctAnswer: 1,
        difficulty: 'medium',
      },
      {
        id: 'eq-8',
        examId: 'css-preliminary',
        subjectId: 'gk',
        question: 'Which organ in the human body produces insulin?',
        options: ['Liver', 'Kidney', 'Pancreas', 'Heart'],
        correctAnswer: 2,
        difficulty: 'easy',
      },
      {
        id: 'eq-9',
        examId: 'css-preliminary',
        subjectId: 'english',
        question:
          'Identify the correct sentence: "Neither the teacher nor the students ___ present."',
        options: ['was', 'is', 'were', 'has been'],
        correctAnswer: 2,
        difficulty: 'medium',
      },
      {
        id: 'eq-10',
        examId: 'css-preliminary',
        subjectId: 'reasoning',
        question:
          'A clock shows 3:15. What is the angle between the hour and minute hands?',
        options: ['0 degrees', '7.5 degrees', '15 degrees', '22.5 degrees'],
        correctAnswer: 1,
        difficulty: 'hard',
      },
    ],
  },
  default: {
    title: 'General Practice Test',
    durationMinutes: 30,
    questions: [
      {
        id: 'dq-1',
        examId: 'default',
        subjectId: 'gk',
        question: 'What is the largest planet in our solar system?',
        options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 2,
        difficulty: 'easy',
      },
      {
        id: 'dq-2',
        examId: 'default',
        subjectId: 'gk',
        question: 'How many continents are there on Earth?',
        options: ['5', '6', '7', '8'],
        correctAnswer: 2,
        difficulty: 'easy',
      },
      {
        id: 'dq-3',
        examId: 'default',
        subjectId: 'english',
        question: 'What is the plural of "child"?',
        options: ['Childs', 'Childes', 'Children', 'Childern'],
        correctAnswer: 2,
        difficulty: 'easy',
      },
      {
        id: 'dq-4',
        examId: 'default',
        subjectId: 'reasoning',
        question:
          'If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?',
        options: ['Yes', 'No', 'Cannot be determined', 'Only some'],
        correctAnswer: 0,
        difficulty: 'easy',
      },
      {
        id: 'dq-5',
        examId: 'default',
        subjectId: 'gk',
        question: 'What is the boiling point of water at sea level in Celsius?',
        options: ['90Â°C', '95Â°C', '100Â°C', '110Â°C'],
        correctAnswer: 2,
        difficulty: 'easy',
      },
    ],
  },
};

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function getStatusColor(status: QuestionStatus | undefined): string {
  if (!status)
    return 'bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-muted))] border-[rgb(var(--color-border))]';
  if (status.markedForReview && status.answered)
    return 'bg-violet-500 text-white border-violet-500';
  if (status.markedForReview)
    return 'bg-violet-100 text-violet-700 border-violet-400 dark:bg-violet-900 dark:text-violet-300 dark:border-violet-600';
  if (status.answered) return 'bg-accent-500 text-white border-accent-500';
  if (status.visited)
    return 'bg-danger-100 text-danger-700 border-danger-400 dark:bg-danger-900 dark:text-danger-300 dark:border-danger-600';
  return 'bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-muted))] border-[rgb(var(--color-border))]';
}

export default function ExamAttemptPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    examTitle,
    questions,
    answers,
    questionStatus,
    currentQuestionIndex,
    timeRemaining,
    status,
    result,
    showSubmitModal,
  } = useSelector((state: RootState) => state.examAttempt);

  const [paletteOpen, setPaletteOpen] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      const data = mockExamData[id || ''] || mockExamData.default;
      dispatch(
        initExam({
          examId: id || 'default',
          examTitle: data.title,
          questions: data.questions,
          durationMinutes: data.durationMinutes,
        })
      );
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (status !== 'in_progress') return;
    const interval = setInterval(() => {
      dispatch(tickTimer());
    }, 1000);
    return () => clearInterval(interval);
  }, [status, dispatch]);

  useEffect(() => {
    if (status === 'submitted' && !showSubmitModal && result) {
      dispatch(setShowSubmitModal(true));
    }
  }, [status, showSubmitModal, result, dispatch]);

  useEffect(() => {
    if (status === 'in_progress') {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [status]);

  const currentQuestion = questions[currentQuestionIndex];

  const stats = useMemo(() => {
    let answered = 0;
    let marked = 0;
    let notVisited = 0;
    for (const q of questions) {
      const s = questionStatus[q.id];
      if (s?.answered) answered++;
      if (s?.markedForReview) marked++;
      if (!s?.visited) notVisited++;
    }
    return {
      answered,
      marked,
      notVisited,
      total: questions.length,
      unanswered: questions.length - answered,
    };
  }, [questions, questionStatus]);

  const handleSelectOption = useCallback(
    (optionIndex: number) => {
      if (!currentQuestion || status !== 'in_progress') return;
      dispatch(
        selectOption({
          questionId: currentQuestion.id,
          optionIndex,
        })
      );
    },
    [currentQuestion, status, dispatch]
  );

  const handleClear = useCallback(() => {
    if (!currentQuestion || status !== 'in_progress') return;
    dispatch(clearResponse(currentQuestion.id));
  }, [currentQuestion, status, dispatch]);

  const handleMarkReview = useCallback(() => {
    if (!currentQuestion || status !== 'in_progress') return;
    dispatch(toggleMarkForReview(currentQuestion.id));
  }, [currentQuestion, status, dispatch]);

  const handleSubmit = useCallback(() => {
    dispatch(submitExam());
  }, [dispatch]);

  const handleExit = useCallback(() => {
    dispatch(resetExam());
    navigate(ROUTES.EXAMS);
  }, [dispatch, navigate]);

  if (!currentQuestion || questions.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-[hsl(var(--background))]">
        <div className="text-center">
          <Loader2
            size={32}
            className="mx-auto animate-spin text-primary-500"
          />
          <p className="mt-4 text-sm text-[rgb(var(--color-text-secondary))]">
            Loading exam...
          </p>
        </div>
      </div>
    );
  }

  const currentAnswer = answers[currentQuestion.id];
  const currentStatus = questionStatus[currentQuestion.id];
  const isTimeLow = timeRemaining <= 300;
  const isTimeCritical = timeRemaining <= 60;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[hsl(var(--background))]">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPaletteOpen(true)}
            className="rounded-md p-1.5 text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-elevated))] lg:hidden"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] sm:text-base">
            {examTitle}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-mono font-bold',
              isTimeCritical
                ? 'bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300'
                : isTimeLow
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-primary))]'
            )}
          >
            <Clock size={14} />
            {formatTime(timeRemaining)}
          </div>

          <Button
            size="sm"
            variant="outline"
            className="border-danger-300 text-danger-600 hover:bg-danger-50 dark:border-danger-700 dark:text-danger-400 dark:hover:bg-danger-950"
            onClick={() => dispatch(setShowSubmitModal(true))}
          >
            Submit Exam
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-[rgb(var(--color-text-muted))]">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase',
                  currentQuestion.difficulty === 'easy'
                    ? 'bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300'
                    : currentQuestion.difficulty === 'medium'
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300'
                )}
              >
                {currentQuestion.difficulty}
              </span>
            </div>

            <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5 sm:p-6">
              <p className="text-[15px] font-medium leading-relaxed text-[rgb(var(--color-text-primary))]">
                {currentQuestion.question}
              </p>

              <div className="mt-5 space-y-2.5">
                {currentQuestion.options.map((option, optIndex) => {
                  const isSelected = currentAnswer === optIndex;
                  return (
                    <button
                      key={optIndex}
                      disabled={status !== 'in_progress'}
                      onClick={() => handleSelectOption(optIndex)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all',
                        isSelected
                          ? 'border-primary-400 bg-primary-50 text-primary-700 dark:border-primary-600 dark:bg-primary-950 dark:text-primary-300'
                          : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] hover:border-primary-300 hover:bg-primary-50/50 dark:hover:border-primary-700 dark:hover:bg-primary-950/50',
                        status !== 'in_progress' && 'opacity-60'
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[1.5px] text-xs font-bold transition-colors',
                          isSelected
                            ? 'border-primary-500 bg-primary-500 text-white'
                            : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-text-muted))]'
                        )}
                      >
                        {String.fromCharCode(65 + optIndex)}
                      </span>
                      <span className="flex-1">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {status === 'in_progress' && (
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMarkReview}
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all',
                      currentStatus?.markedForReview
                        ? 'border-violet-400 bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300'
                        : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-text-secondary))] hover:border-violet-300 hover:text-violet-600'
                    )}
                  >
                    <Flag size={12} />
                    {currentStatus?.markedForReview
                      ? 'Unmark Review'
                      : 'Mark for Review'}
                  </button>
                  <button
                    onClick={handleClear}
                    className="flex items-center gap-1.5 rounded-lg border border-[rgb(var(--color-border))] px-3 py-2 text-xs font-medium text-[rgb(var(--color-text-secondary))] transition-all hover:border-danger-300 hover:text-danger-600"
                  >
                    <RotateCcw size={12} />
                    Clear
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<ChevronLeft size={14} />}
                    disabled={currentQuestionIndex === 0}
                    onClick={() =>
                      dispatch(goToQuestion(currentQuestionIndex - 1))
                    }
                  >
                    Prev
                  </Button>
                  <Button
                    size="sm"
                    rightIcon={<ChevronRight size={14} />}
                    disabled={currentQuestionIndex === questions.length - 1}
                    onClick={() =>
                      dispatch(goToQuestion(currentQuestionIndex + 1))
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="hidden w-64 shrink-0 border-l border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4 lg:block">
          <QuestionPalette
            questions={questions}
            questionStatus={questionStatus}
            currentIndex={currentQuestionIndex}
            stats={stats}
            onSelect={(idx) => dispatch(goToQuestion(idx))}
            isInteractive={status === 'in_progress'}
          />
        </aside>
      </div>

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
                onClick={() => setPaletteOpen(false)}
                className="rounded-md p-1 text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-surface-elevated))]"
              >
                <XIcon size={18} />
              </button>
            </div>
            <QuestionPalette
              questions={questions}
              questionStatus={questionStatus}
              currentIndex={currentQuestionIndex}
              stats={stats}
              onSelect={(idx) => {
                dispatch(goToQuestion(idx));
                setPaletteOpen(false);
              }}
              isInteractive={status === 'in_progress'}
            />
          </div>
        </div>
      )}

      {showSubmitModal && status === 'in_progress' && (
        <SubmitModal
          stats={stats}
          timeUsed={
            (mockExamData[id || ''] || mockExamData.default).durationMinutes *
              60 -
            timeRemaining
          }
          onConfirm={handleSubmit}
          onCancel={() => dispatch(setShowSubmitModal(false))}
        />
      )}

      {showSubmitModal && status === 'submitted' && result && (
        <ResultModal result={result} onExit={handleExit} />
      )}
    </div>
  );
}

function QuestionPalette({
  questions,
  questionStatus,
  currentIndex,
  stats,
  onSelect,
  isInteractive,
}: {
  questions: MCQ[];
  questionStatus: Record<string, QuestionStatus>;
  currentIndex: number;
  stats: {
    answered: number;
    marked: number;
    notVisited: number;
    total: number;
    unanswered: number;
  };
  onSelect: (index: number) => void;
  isInteractive: boolean;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 grid grid-cols-2 gap-2 text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-accent-500" />
          <span className="text-[rgb(var(--color-text-secondary))]">
            Answered ({stats.answered})
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-danger-100 border border-danger-400 dark:bg-danger-900" />
          <span className="text-[rgb(var(--color-text-secondary))]">
            Not Visited ({stats.notVisited})
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-violet-100 border border-violet-400 dark:bg-violet-900" />
          <span className="text-[rgb(var(--color-text-secondary))]">
            Marked ({stats.marked})
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))]" />
          <span className="text-[rgb(var(--color-text-secondary))]">
            Unanswered ({stats.unanswered})
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 overflow-y-auto">
        {questions.map((q, idx) => {
          const st = questionStatus[q.id];
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={q.id}
              onClick={() => onSelect(idx)}
              disabled={!isInteractive}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-md border text-xs font-bold transition-all',
                isCurrent &&
                  'ring-2 ring-primary-500 ring-offset-1 ring-offset-[rgb(var(--color-surface))]',
                getStatusColor(st)
              )}
            >
              {st?.markedForReview && st?.answered ? (
                <span className="relative">
                  {idx + 1}
                  <span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-white" />
                </span>
              ) : (
                idx + 1
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-auto border-t border-[rgb(var(--color-border))] pt-3">
        <div className="space-y-1.5 text-xs text-[rgb(var(--color-text-secondary))]">
          <div className="flex justify-between">
            <span>Total Questions</span>
            <span className="font-semibold">{stats.total}</span>
          </div>
          <div className="flex justify-between">
            <span>Answered</span>
            <span className="font-semibold text-accent-600">
              {stats.answered}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Unanswered</span>
            <span className="font-semibold">{stats.unanswered}</span>
          </div>
          <div className="flex justify-between">
            <span>Marked for Review</span>
            <span className="font-semibold text-violet-600">
              {stats.marked}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubmitModal({
  stats,
  timeUsed,
  onConfirm,
  onCancel,
}: {
  stats: {
    answered: number;
    marked: number;
    notVisited: number;
    total: number;
    unanswered: number;
  };
  timeUsed: number;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const unanswered = stats.total - stats.answered;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
            <AlertTriangle
              size={20}
              className="text-primary-600 dark:text-primary-400"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
              Submit Exam?
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
            <p className="text-lg font-bold text-danger-600">{unanswered}</p>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">
              Unanswered
            </p>
          </div>
          <div className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-3 text-center">
            <p className="text-lg font-bold text-violet-600">{stats.marked}</p>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">
              Marked for Review
            </p>
          </div>
          <div className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-3 text-center">
            <p className="text-lg font-bold text-[rgb(var(--color-text-primary))]">
              {formatTime(timeUsed)}
            </p>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">
              Time Used
            </p>
          </div>
        </div>

        {unanswered > 0 && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 dark:border-primary-800 dark:bg-primary-950">
            <AlertTriangle
              size={14}
              className="mt-0.5 shrink-0 text-primary-500"
            />
            <p className="text-xs text-primary-700 dark:text-primary-300">
              You have {unanswered} unanswered question
              {unanswered > 1 ? 's' : ''}. Once submitted, you cannot change
              your answers.
            </p>
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Go Back
          </Button>
          <Button
            size="sm"
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

function ResultModal({
  result,
  onExit,
}: {
  result: {
    totalQuestions: number;
    answered: number;
    correct: number;
    incorrect: number;
    unanswered: number;
    score: number;
    totalMarks: number;
    accuracy: number;
  };
  onExit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 shadow-xl">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
            <Trophy
              size={32}
              className="text-primary-600 dark:text-primary-400"
            />
          </div>
          <h2 className="text-xl font-bold text-[rgb(var(--color-text-primary))]">
            Exam Completed!
          </h2>
          <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
            Here&apos;s how you performed
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="relative h-32 w-32">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                strokeWidth="8"
                className="stroke-[rgb(var(--color-surface-elevated))]"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 54}
                strokeDashoffset={
                  2 * Math.PI * 54 * (1 - result.accuracy / 100)
                }
                className={cn(
                  'transition-all duration-1000 ease-out',
                  result.accuracy >= 75
                    ? 'stroke-accent-500'
                    : result.accuracy >= 50
                      ? 'stroke-primary-500'
                      : 'stroke-danger-500'
                )}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={cn(
                  'text-2xl font-bold',
                  result.accuracy >= 75
                    ? 'text-accent-500'
                    : result.accuracy >= 50
                      ? 'text-primary-500'
                      : 'text-danger-500'
                )}
              >
                {result.accuracy}%
              </span>
              <span className="text-[10px] font-medium text-[rgb(var(--color-text-muted))]">
                Accuracy
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-3 text-center">
            <Check size={16} className="mx-auto text-accent-500" />
            <p className="mt-1 text-lg font-bold text-accent-600">
              {result.correct}
            </p>
            <p className="text-[10px] text-[rgb(var(--color-text-muted))]">
              Correct
            </p>
          </div>
          <div className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-3 text-center">
            <X size={16} className="mx-auto text-danger-500" />
            <p className="mt-1 text-lg font-bold text-danger-600">
              {result.incorrect}
            </p>
            <p className="text-[10px] text-[rgb(var(--color-text-muted))]">
              Incorrect
            </p>
          </div>
          <div className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-3 text-center">
            <MinusCircle
              size={16}
              className="mx-auto text-[rgb(var(--color-text-muted))]"
            />
            <p className="mt-1 text-lg font-bold text-[rgb(var(--color-text-primary))]">
              {result.unanswered}
            </p>
            <p className="text-[10px] text-[rgb(var(--color-text-muted))]">
              Skipped
            </p>
          </div>
          <div className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-3 text-center">
            <Target size={16} className="mx-auto text-primary-500" />
            <p className="mt-1 text-lg font-bold text-primary-600">
              {result.score}/{result.totalMarks}
            </p>
            <p className="text-[10px] text-[rgb(var(--color-text-muted))]">
              Score
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-4">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-primary-500" />
            <span className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
              Performance Summary
            </span>
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[rgb(var(--color-text-secondary))]">
                Questions Attempted
              </span>
              <span className="font-semibold text-[rgb(var(--color-text-primary))]">
                {result.answered} / {result.totalQuestions}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[rgb(var(--color-border))]">
              <div
                className="h-full rounded-full bg-primary-500 transition-all duration-500"
                style={{
                  width: `${(result.answered / result.totalQuestions) * 100}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[rgb(var(--color-text-secondary))]">
                Accuracy Rate
              </span>
              <span className="font-semibold text-[rgb(var(--color-text-primary))]">
                {result.accuracy}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[rgb(var(--color-border))]">
              <div
                className="h-full rounded-full bg-accent-500 transition-all duration-500"
                style={{ width: `${result.accuracy}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-center">
          <Button onClick={onExit} leftIcon={<ChevronLeft size={16} />}>
            Back to Exams
          </Button>
        </div>
      </div>
    </div>
  );
}
