import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { getExamBySlug, type ExamDetailResponse } from '@/services/examService';
import AddMcqForm from './AddMcqForm';

export default function ExamMcqPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<ExamDetailResponse['data'] | null>(null);
  const [loading, setLoading] = useState(!!slug);
  const [error, setError] = useState<string | null>(
    slug ? null : 'No exam slug provided.'
  );

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await getExamBySlug(slug);
        console.log(res);
        if (!cancelled && res.data) {
          setExam(res.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to load exam details.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner size={32} />
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate(ROUTES.ADMIN_EXAMS)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-[rgb(var(--color-surface-elevated))] hover:text-[rgb(var(--color-text-primary))]"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex flex-col items-center justify-center rounded-xl border border-danger-300 bg-danger-50 py-12 text-center dark:border-danger-700 dark:bg-danger-950/40">
          <p className="text-sm font-medium text-danger-700 dark:text-danger-300">
            {error || 'Exam not found.'}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => navigate(ROUTES.ADMIN_EXAMS)}
          >
            Back to Exams
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(ROUTES.ADMIN_EXAMS)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-[rgb(var(--color-surface-elevated))] hover:text-[rgb(var(--color-text-primary))]"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-2xl font-bold font-heading dark:text-white">
              {exam.title}
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-400">
            Step 2: Add multiple-choice questions to this exam.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-5 py-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <ListChecks size={14} className="text-primary-500" />
            <span className="font-medium text-[rgb(var(--color-text-primary))]">
              {exam.examPattern.totalMarks} Total Marks
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                exam.examPattern.format === 'mcq'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-400'
                  : 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900 dark:text-secondary-400'
              )}
            >
              {exam.examPattern.format.toUpperCase()}
            </span>
          </div>
          {exam.examPattern.negativeMarking && (
            <span className="text-xs text-danger-600 dark:text-danger-400">
              Negative Marking: {exam.examPattern.negativeMarkingValue ?? 'Yes'}
            </span>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6">
        <AddMcqForm examSlug={exam.slug} examTitle={exam.title} />
      </div>
    </div>
  );
}
