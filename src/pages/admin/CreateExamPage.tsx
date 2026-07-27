import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Check,
  Clock,
  Coins,
  BookOpen,
  FileText,
  Eye,
  Save,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';

interface ExamDetails {
  title: string;
  subject: string;
  category: string;
  duration: string;
  passingScore: string;
  entryFee: string;
}

interface QuestionOption {
  text: string;
}

interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  correctOption: number;
  explanation: string;
}

type StepId = 1 | 2 | 3;

const steps: { id: StepId; label: string; icon: typeof FileText }[] = [
  { id: 1, label: 'Basic Details', icon: FileText },
  { id: 2, label: 'Questions Builder', icon: BookOpen },
  { id: 3, label: 'Review & Publish', icon: Eye },
];

const subjectOptions = [
  { label: 'General Knowledge', value: 'General Knowledge' },
  { label: 'English', value: 'English' },
  { label: 'Analytical Reasoning', value: 'Analytical Reasoning' },
  { label: 'Islamic Studies', value: 'Islamic Studies' },
  { label: 'Mathematics', value: 'Mathematics' },
  { label: 'Computer Science', value: 'Computer Science' },
  { label: 'Constitutional Law', value: 'Constitutional Law' },
  { label: 'General Science', value: 'General Science' },
];

const categoryOptions = [
  { label: 'CSS', value: 'CSS' },
  { label: 'PCS', value: 'PCS' },
  { label: 'FPSC', value: 'FPSC' },
  { label: 'PPSC', value: 'PPSC' },
  { label: 'NTS', value: 'NTS' },
  { label: 'Other', value: 'Other' },
];

function StepIndicator({
  currentStep,
  completedSteps,
}: {
  currentStep: StepId;
  completedSteps: Set<StepId>;
}) {
  return (
    <nav className="flex items-center gap-2">
      {steps.map((step, idx) => {
        const isActive = currentStep === step.id;
        const isCompleted = completedSteps.has(step.id);

        return (
          <div key={step.id} className="flex items-center gap-2">
            {idx > 0 && (
              <div
                className={cn(
                  'h-px w-8 sm:w-12',
                  isCompleted || isActive
                    ? 'bg-primary-500'
                    : 'bg-[rgb(var(--color-border))]'
                )}
              />
            )}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors',
                  isActive
                    ? 'border-primary-500 bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400'
                    : isCompleted
                      ? 'border-primary-500 bg-primary-500 text-white'
                      : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-text-muted))]'
                )}
              >
                {isCompleted ? <Check size={14} /> : step.id}
              </div>
              <div className="hidden sm:block">
                <p
                  className={cn(
                    'text-xs font-medium',
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : isCompleted
                        ? 'text-[rgb(var(--color-text-primary))]'
                        : 'text-[rgb(var(--color-text-muted))]'
                  )}
                >
                  {step.label}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}

function BasicDetailsStep({
  details,
  onChange,
  errors,
}: {
  details: ExamDetails;
  onChange: (field: keyof ExamDetails, value: string) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold font-heading text-[rgb(var(--color-text-primary))]">
          Basic Exam Details
        </h3>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-muted))]">
          Configure the core settings for this exam.
        </p>
      </div>

      <Input
        label="Exam Title"
        required
        placeholder="e.g. CSS General Knowledge Paper-I"
        value={details.title}
        onChange={(e) => {
          onChange('title', e.target.value);
        }}
        error={errors.title}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Subject"
          required
          options={subjectOptions}
          placeholder="Select subject"
          value={details.subject}
          onChange={(e) => {
            onChange('subject', e.target.value);
          }}
          error={errors.subject}
        />

        <Select
          label="Category / Topic"
          required
          options={categoryOptions}
          placeholder="Select category"
          value={details.category}
          onChange={(e) => {
            onChange('category', e.target.value);
          }}
          error={errors.category}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          label="Duration (mins)"
          required
          type="number"
          placeholder="e.g. 120"
          leftIcon={<Clock size={16} className="text-primary-500" />}
          value={details.duration}
          onChange={(e) => {
            onChange('duration', e.target.value);
          }}
          error={errors.duration}
        />

        <Input
          label="Passing Score (%)"
          required
          type="number"
          placeholder="e.g. 60"
          value={details.passingScore}
          onChange={(e) => {
            onChange('passingScore', e.target.value);
          }}
          error={errors.passingScore}
        />

        <Input
          label="Entry Fee (Tokens)"
          required
          type="number"
          placeholder="e.g. 50"
          leftIcon={<Coins size={16} className="text-primary-500" />}
          value={details.entryFee}
          onChange={(e) => {
            onChange('entryFee', e.target.value);
          }}
          error={errors.entryFee}
        />
      </div>
    </div>
  );
}

function QuestionCard({
  question,
  index,
  onUpdate,
  onRemove,
}: {
  question: Question;
  index: number;
  onUpdate: (id: string, field: keyof Question, value: unknown) => void;
  onRemove: (id: string) => void;
}) {
  const handleOptionChange = (optIndex: number, text: string) => {
    const newOptions = [...question.options];
    newOptions[optIndex] = { text };
    onUpdate(question.id, 'options', newOptions);
  };

  return (
    <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-900 dark:text-primary-300">
            {index + 1}
          </span>
          <h4 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
            Question {index + 1}
          </h4>
        </div>
        <button
          onClick={() => onRemove(question.id)}
          className="rounded-md p-1.5 text-[rgb(var(--color-text-muted))] transition-colors hover:bg-danger-50 hover:text-danger-500 dark:hover:bg-danger-950"
          title="Remove Question"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="mt-4 space-y-4">
        <Textarea
          label="Question Text"
          required
          placeholder="Enter the question text..."
          rows={2}
          value={question.text}
          onChange={(e) => onUpdate(question.id, 'text', e.target.value)}
        />

        <div className="space-y-2">
          <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
            Options
          </p>
          {question.options.map((opt, optIdx) => (
            <div key={optIdx} className="flex items-center gap-3">
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  question.correctOption === optIdx
                    ? 'bg-accent-500 text-white'
                    : 'bg-secondary-100 text-secondary-600 dark:bg-secondary-800 dark:text-secondary-300'
                )}
              >
                {String.fromCharCode(65 + optIdx)}
              </span>
              <input
                type="text"
                placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                value={opt.text}
                onChange={(e) => handleOptionChange(optIdx, e.target.value)}
                className="h-9 flex-1 rounded-md border border-[rgb(var(--color-border))] bg-transparent px-3 text-sm text-[rgb(var(--color-text-primary))] placeholder:text-secondary-400 transition-colors hover:border-[rgb(var(--color-border-hover))] focus-ring"
              />
              <button
                onClick={() => onUpdate(question.id, 'correctOption', optIdx)}
                className={cn(
                  'shrink-0 rounded-md px-2 py-1 text-xs font-medium transition-colors',
                  question.correctOption === optIdx
                    ? 'bg-accent-50 text-accent-700 dark:bg-accent-950 dark:text-accent-300'
                    : 'text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-surface-elevated))]'
                )}
                title={
                  question.correctOption === optIdx
                    ? 'Correct answer'
                    : 'Set as correct'
                }
              >
                {question.correctOption === optIdx ? (
                  <Check size={14} />
                ) : (
                  <Circle size={14} />
                )}
              </button>
            </div>
          ))}
        </div>

        <Textarea
          label="AI Explanation / Rationale"
          placeholder="Provide an explanation for the correct answer..."
          rows={2}
          value={question.explanation}
          onChange={(e) => onUpdate(question.id, 'explanation', e.target.value)}
        />
      </div>
    </div>
  );
}

function QuestionsBuilderStep({
  questions,
  onAdd,
  onUpdate,
  onRemove,
}: {
  questions: Question[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Question, value: unknown) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold font-heading text-[rgb(var(--color-text-primary))]">
            Questions Builder
          </h3>
          <p className="mt-1 text-sm text-[rgb(var(--color-text-muted))]">
            Add and configure multiple-choice questions for this exam.
          </p>
        </div>
        <Button
          size="sm"
          leftIcon={<Plus size={16} />}
          className="bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-secondary-800 dark:text-secondary-200 dark:hover:bg-secondary-700"
          onClick={onAdd}
        >
          Add Question
        </Button>
      </div>

      {questions.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-[rgb(var(--color-border))] px-6 py-16 text-center">
          <BookOpen
            size={40}
            className="mx-auto text-[rgb(var(--color-text-muted))]"
          />
          <p className="mt-3 text-sm font-medium text-[rgb(var(--color-text-secondary))]">
            No questions added yet
          </p>
          <p className="mt-1 text-xs text-[rgb(var(--color-text-muted))]">
            Click "Add Question" to start building your exam.
          </p>
          <Button
            size="sm"
            leftIcon={<Plus size={16} />}
            className="mt-4 bg-gray-900 text-white hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700"
            onClick={onAdd}
          >
            Add First Question
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={idx}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}

      {questions.length > 0 && (
        <p className="text-xs text-[rgb(var(--color-text-muted))]">
          {questions.length} question{questions.length !== 1 ? 's' : ''} added
        </p>
      )}
    </div>
  );
}

function ReviewPublishStep({
  details,
  questions,
}: {
  details: ExamDetails;
  questions: Question[];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold font-heading text-[rgb(var(--color-text-primary))]">
          Review & Publish
        </h3>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-muted))]">
          Review your exam configuration before publishing.
        </p>
      </div>

      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5">
        <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[rgb(var(--color-text-primary))]">
          <FileText size={16} className="text-primary-500" />
          Exam Settings
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">Title</p>
            <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
              {details.title || '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">
              Subject
            </p>
            <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
              {details.subject || '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">
              Category
            </p>
            <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
              {details.category || '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">
              Duration
            </p>
            <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
              {details.duration ? `${details.duration} mins` : '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">
              Passing Score
            </p>
            <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
              {details.passingScore ? `${details.passingScore}%` : '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">
              Entry Fee
            </p>
            <p className="text-sm font-medium text-primary-500">
              {details.entryFee ? `${details.entryFee} tokens` : '—'}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5">
        <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[rgb(var(--color-text-primary))]">
          <BookOpen size={16} className="text-primary-500" />
          Questions ({questions.length})
        </h4>

        {questions.length === 0 ? (
          <p className="text-sm text-[rgb(var(--color-text-muted))]">
            No questions added. Go back to add questions.
          </p>
        ) : (
          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="rounded-lg border border-[rgb(var(--color-border))] p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                    {idx + 1}
                  </span>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                      {q.text || 'Untitled question'}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={cn(
                            'flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs',
                            q.correctOption === optIdx
                              ? 'border-accent-300 bg-accent-50 text-accent-800 dark:border-accent-700 dark:bg-accent-950 dark:text-accent-200'
                              : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-text-secondary))]'
                          )}
                        >
                          <span
                            className={cn(
                              'flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-bold',
                              q.correctOption === optIdx
                                ? 'bg-accent-500 text-white'
                                : 'bg-secondary-100 text-secondary-600 dark:bg-secondary-800 dark:text-secondary-300'
                            )}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          {opt.text || '—'}
                        </div>
                      ))}
                    </div>
                    {q.explanation && (
                      <p className="text-xs text-[rgb(var(--color-text-muted))]">
                        <span className="font-medium">Explanation:</span>{' '}
                        {q.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Circle({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export default function CreateExamPage() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<StepId>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<StepId>>(new Set());

  const [details, setDetails] = useState<ExamDetails>({
    title: '',
    subject: '',
    category: '',
    duration: '',
    passingScore: '',
    entryFee: '',
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [detailErrors, setDetailErrors] = useState<Record<string, string>>({});

  const handleDetailChange = useCallback(
    (field: keyof ExamDetails, value: string) => {
      setDetails((prev) => ({ ...prev, [field]: value }));
      setDetailErrors((prev) => ({ ...prev, [field]: '' }));
    },
    []
  );

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!details.title.trim()) errs.title = 'Exam title is required.';
    if (!details.subject) errs.subject = 'Select a subject.';
    if (!details.category) errs.category = 'Select a category.';
    if (!details.duration || parseInt(details.duration) <= 0)
      errs.duration = 'Enter a valid duration.';
    if (
      !details.passingScore ||
      parseInt(details.passingScore) <= 0 ||
      parseInt(details.passingScore) > 100
    )
      errs.passingScore = 'Enter a valid percentage (1–100).';
    if (!details.entryFee || parseInt(details.entryFee) < 0)
      errs.entryFee = 'Enter a valid token amount.';
    setDetailErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const canProceed = (): boolean => {
    if (currentStep === 1) return validateStep1();
    if (currentStep === 2) return questions.length > 0;
    return true;
  };

  const handleNext = () => {
    if (!canProceed()) return;
    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    setCurrentStep((prev) => Math.min(prev + 1, 3) as StepId);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as StepId);
  };

  const handleAddQuestion = () => {
    const newQ: Question = {
      id: `q_${Date.now()}`,
      text: '',
      options: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }],
      correctOption: 0,
      explanation: '',
    };
    setQuestions((prev) => [...prev, newQ]);
  };

  const handleUpdateQuestion = useCallback(
    (id: string, field: keyof Question, value: unknown) => {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === id ? ({ ...q, [field]: value } as Question) : q
        )
      );
    },
    []
  );

  const handleRemoveQuestion = useCallback((id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }, []);

  const handleSaveDraft = () => {
    navigate(ROUTES.ADMIN_EXAMS);
  };

  const handlePublish = () => {
    navigate(ROUTES.ADMIN_EXAMS);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(ROUTES.ADMIN_EXAMS)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-[rgb(var(--color-surface-elevated))] hover:text-[rgb(var(--color-text-primary))]"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
            Create New Exam
          </h1>
          <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
            Set up a new exam with questions and publish it for students.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-6 py-4">
        <StepIndicator
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
      </div>

      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6">
        {currentStep === 1 && (
          <BasicDetailsStep
            details={details}
            onChange={handleDetailChange}
            errors={detailErrors}
          />
        )}
        {currentStep === 2 && (
          <QuestionsBuilderStep
            questions={questions}
            onAdd={handleAddQuestion}
            onUpdate={handleUpdateQuestion}
            onRemove={handleRemoveQuestion}
          />
        )}
        {currentStep === 3 && (
          <ReviewPublishStep details={details} questions={questions} />
        )}
      </div>

      <div className="flex items-center justify-between border-t border-[rgb(var(--color-border))] pt-4">
        <Button
          variant="ghost"
          leftIcon={<ArrowLeft size={16} />}
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          Back
        </Button>

        <div className="flex items-center gap-3">
          {currentStep === 3 && (
            <>
              <Button
                variant="outline"
                leftIcon={<Save size={16} />}
                className="bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-secondary-800 dark:text-secondary-200 dark:hover:bg-secondary-700"
                onClick={handleSaveDraft}
              >
                Save as Draft
              </Button>
              <Button
                leftIcon={<Send size={16} />}
                className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700"
                onClick={handlePublish}
              >
                Publish Exam
              </Button>
            </>
          )}

          {currentStep < 3 && (
            <Button
              leftIcon={<ArrowRight size={16} />}
              className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700"
              onClick={handleNext}
            >
              Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
