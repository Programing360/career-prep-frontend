import { useCallback, useState } from 'react';
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Save,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { cn } from '@/lib/utils';
import type { AdminQuestion, AdminMCQOption } from '@/types/exam';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

function createBlankQuestion(index: number): AdminQuestion {
  return {
    questionId: `q_${Date.now()}_${index}`,
    questionText: '',
    explanation: '',
    marks: 1,
    subjectTag: '',
    options: OPTION_LETTERS.map((letter) => ({
      optionId: letter,
      optionText: '',
      isCorrect: letter === 'A',
    })),
  };
}

interface QuestionCardProps {
  question: AdminQuestion;
  index: number;
  total: number;
  errors: Record<string, string>;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onChange: (index: number, field: keyof AdminQuestion, value: unknown) => void;
  onOptionChange: (
    qIndex: number,
    oIndex: number,
    field: keyof AdminMCQOption,
    value: string | boolean
  ) => void;
  onSetCorrect: (qIndex: number, oIndex: number) => void;
  onRemove: (index: number) => void;
}

function QuestionCard({
  question,
  index,
  total,
  errors,
  isCollapsed,
  onToggleCollapse,
  onChange,
  onOptionChange,
  onSetCorrect,
  onRemove,
}: QuestionCardProps) {
  const hasError = Object.keys(errors).some((k) => k.startsWith(`q${index}.`));

  return (
    <div
      className={cn(
        'rounded-xl border transition-colors',
        hasError
          ? 'border-danger-300 dark:border-danger-700'
          : 'border-[rgb(var(--color-border))]'
      )}
    >
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="flex flex-1 items-center gap-3 text-left"
        >
          <span
            className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
              hasError
                ? 'bg-danger-100 text-danger-700 dark:bg-danger-950 dark:text-danger-400'
                : 'bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-400'
            )}
          >
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[rgb(var(--color-text-primary))]">
              {question.questionText || `Question ${index + 1}`}
            </p>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">
              {question.marks} mark{question.marks !== 1 ? 's' : ''} ·{' '}
              {question.options.filter((o) => o.isCorrect).length > 0
                ? `Option ${question.options.find((o) => o.isCorrect)?.optionId}`
                : 'No correct answer'}
            </p>
          </div>
          {isCollapsed ? (
            <ChevronDown
              size={16}
              className="text-[rgb(var(--color-text-muted))]"
            />
          ) : (
            <ChevronUp
              size={16}
              className="text-[rgb(var(--color-text-muted))]"
            />
          )}
        </button>
        {total > 1 && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[rgb(var(--color-border))] text-danger-600 transition-colors hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-950"
            aria-label={`Remove question ${index + 1}`}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {!isCollapsed && (
        <div className="space-y-4 border-t border-[rgb(var(--color-border))] px-4 py-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="sm:col-span-3">
              <Textarea
                label="Question Text"
                required
                rows={3}
                placeholder="Enter the question stem..."
                value={question.questionText}
                onChange={(e) =>
                  onChange(index, 'questionText', e.target.value)
                }
                error={errors[`q${index}.questionText`]}
              />
            </div>
            <div className="space-y-4">
              <Input
                label="Marks"
                required
                type="number"
                min={1}
                placeholder="1"
                value={question.marks === 0 ? '' : question.marks}
                onChange={(e) =>
                  onChange(
                    index,
                    'marks',
                    Math.max(1, parseInt(e.target.value, 10) || 1)
                  )
                }
                error={errors[`q${index}.marks`]}
              />
              <Input
                label="Subject Tag"
                placeholder="e.g. GK, English"
                value={question.subjectTag ?? ''}
                onChange={(e) => onChange(index, 'subjectTag', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Options</Label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {question.options.map((opt, oIdx) => (
                <div
                  key={opt.optionId}
                  className={cn(
                    'flex items-start gap-3 rounded-lg border p-3 transition-colors',
                    opt.isCorrect
                      ? 'border-accent-400 bg-accent-50/50 dark:border-accent-600 dark:bg-accent-950/20'
                      : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSetCorrect(index, oIdx)}
                    className="mt-0.5 shrink-0"
                    title={
                      opt.isCorrect
                        ? 'Correct answer'
                        : 'Mark as correct answer'
                    }
                  >
                    {opt.isCorrect ? (
                      <CheckCircle2
                        size={20}
                        className="text-accent-600 dark:text-accent-400"
                      />
                    ) : (
                      <Circle
                        size={20}
                        className="text-[rgb(var(--color-text-muted))] hover:text-accent-500"
                      />
                    )}
                  </button>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold',
                          opt.isCorrect
                            ? 'bg-accent-600 text-white'
                            : 'bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-muted))]'
                        )}
                      >
                        {opt.optionId}
                      </span>
                      <span className="text-xs font-medium text-[rgb(var(--color-text-muted))]">
                        {opt.isCorrect && (
                          <span className="text-accent-600 dark:text-accent-400">
                            Correct
                          </span>
                        )}
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder={`Option ${opt.optionId}`}
                      value={opt.optionText}
                      onChange={(e) =>
                        onOptionChange(
                          index,
                          oIdx,
                          'optionText',
                          e.target.value
                        )
                      }
                      className={cn(
                        'w-full rounded-md border bg-transparent px-3 py-1.5 text-sm',
                        'border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))]',
                        'placeholder:text-[rgb(var(--color-text-muted))]',
                        'focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
                        errors[`q${index}.opt${oIdx}`] &&
                          'border-danger-500 focus:border-danger-500 focus:ring-danger-500'
                      )}
                    />
                    {errors[`q${index}.opt${oIdx}`] && (
                      <p className="text-xs text-danger-600 dark:text-danger-400">
                        {errors[`q${index}.opt${oIdx}`]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {errors[`q${index}.correctOption`] && (
              <div className="flex items-center gap-1.5 text-xs text-danger-600 dark:text-danger-400">
                <AlertCircle size={12} />
                {errors[`q${index}.correctOption`]}
              </div>
            )}
          </div>

          <Textarea
            label="Explanation (optional)"
            rows={2}
            placeholder="Explain why the correct answer is right..."
            value={question.explanation ?? ''}
            onChange={(e) => onChange(index, 'explanation', e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

interface AddMcqFormProps {
  examSlug: string;
  examTitle: string;
  onSuccess?: () => void;
}

export default function AddMcqForm({
  examSlug,
  examTitle,
  onSuccess,
}: AddMcqFormProps) {
  const [questions, setQuestions] = useState<AdminQuestion[]>([
    createBlankQuestion(0),
  ]);
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [savedCount, setSavedCount] = useState<number | null>(null);

  const handleAddQuestion = useCallback(() => {
    setQuestions((prev) => [...prev, createBlankQuestion(prev.length)]);
  }, []);

  const handleRemoveQuestion = useCallback((index: number) => {
    setQuestions((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((_, i) => i !== index);
      return next.map((q, i) => ({ ...q, questionId: `q_${Date.now()}_${i}` }));
    });
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  }, []);

  const handleToggleCollapse = useCallback((index: number) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const handleQuestionChange = useCallback(
    (index: number, field: keyof AdminQuestion, value: unknown) => {
      setQuestions((prev) =>
        prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
      );
      setErrors((prev) => {
        const next = { ...prev };
        delete next[`q${index}.${String(field)}`];
        return next;
      });
    },
    []
  );

  const handleOptionChange = useCallback(
    (
      qIndex: number,
      oIndex: number,
      field: keyof AdminMCQOption,
      value: string | boolean
    ) => {
      setQuestions((prev) =>
        prev.map((q, i) =>
          i === qIndex
            ? {
                ...q,
                options: q.options.map((o, j) =>
                  j === oIndex ? { ...o, [field]: value } : o
                ),
              }
            : q
        )
      );
      setErrors((prev) => {
        const next = { ...prev };
        delete next[`q${qIndex}.opt${oIndex}`];
        return next;
      });
    },
    []
  );

  const handleSetCorrect = useCallback((qIndex: number, oIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((o, j) => ({
                ...o,
                isCorrect: j === oIndex,
              })),
            }
          : q
      )
    );
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`q${qIndex}.correctOption`];
      return next;
    });
  }, []);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    questions.forEach((q, qi) => {
      if (!q.questionText.trim())
        errs[`q${qi}.questionText`] = 'Question text is required.';

      if (!q.marks || q.marks < 1)
        errs[`q${qi}.marks`] = 'Marks must be at least 1.';

      const filledOptions = q.options.filter((o) => o.optionText.trim());
      if (filledOptions.length < 2)
        errs[`q${qi}.correctOption`] = 'At least 2 options must have text.';

      q.options.forEach((o, oi) => {
        if (!o.optionText.trim())
          errs[`q${qi}.opt${oi}`] = 'Option text is required.';
      });

      const hasCorrect = q.options.some((o) => o.isCorrect);
      if (!hasCorrect)
        errs[`q${qi}.correctOption`] = 'Select one correct answer.';
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const qIndex = parseInt(
          firstErrorKey.split('.')[0].replace('q', ''),
          10
        );
        setCollapsed((prev) => {
          const next = new Set(prev);
          next.delete(qIndex);
          return next;
        });
      }
      return;
    }

    setSaving(true);
    try {
      const { postExamQuestions } = await import('@/services/adminService');
      await postExamQuestions(examSlug, {
        questions: questions.map(({ questionId: _, ...rest }) => rest),
      });
      setSavedCount(questions.length);
      onSuccess?.();
    } catch (err) {
      const { isApiError } = await import('@/lib/axios');
      if (isApiError(err) && (err as { errors?: unknown[] }).errors) {
        const apiErr = err as {
          errors: Array<{ field: string; message: string }>;
        };
        const fieldErrors: Record<string, string> = {};
        for (const fe of apiErr.errors) {
          fieldErrors[fe.field] = fe.message;
        }
        setErrors(fieldErrors);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-bold font-heading text-[rgb(var(--color-text-primary))]">
          Add MCQs
        </h2>
        <p className="text-sm text-[rgb(var(--color-text-muted))]">
          {examTitle} · {questions.length} question
          {questions.length !== 1 ? 's' : ''}
        </p>
      </div>

      {savedCount !== null && (
        <div className="flex items-center gap-2 rounded-lg border border-accent-300 bg-accent-50 px-4 py-3 text-sm text-accent-700 dark:border-accent-700 dark:bg-accent-950/40 dark:text-accent-300">
          <CheckCircle2 size={16} />
          {savedCount} question{savedCount !== 1 ? 's' : ''} saved successfully.
        </div>
      )}

      {Object.keys(errors).length > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-danger-300 bg-danger-50 px-4 py-3 text-sm text-danger-700 dark:border-danger-700 dark:bg-danger-950/40 dark:text-danger-300">
          <AlertCircle size={16} />
          Please fix {Object.keys(errors).length} validation error
          {Object.keys(errors).length !== 1 ? 's' : ''} below.
        </div>
      )}

      <div className="space-y-4">
        {questions.map((q, idx) => (
          <QuestionCard
            key={q.questionId}
            question={q}
            index={idx}
            total={questions.length}
            errors={errors}
            isCollapsed={collapsed.has(idx)}
            onToggleCollapse={() => handleToggleCollapse(idx)}
            onChange={handleQuestionChange}
            onOptionChange={handleOptionChange}
            onSetCorrect={handleSetCorrect}
            onRemove={handleRemoveQuestion}
          />
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-[rgb(var(--color-border))] pt-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          leftIcon={<Plus size={14} />}
          onClick={handleAddQuestion}
        >
          Add Question
        </Button>

        <Button
          type="button"
          leftIcon={<Save size={16} />}
          isLoading={saving}
          className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700"
          onClick={() => void handleSave()}
        >
          Save {questions.length} Question{questions.length !== 1 ? 's' : ''}
        </Button>
      </div>
    </div>
  );
}
