import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Clock,
  BookOpen,
  Search,
  ShieldCheck,
  Building2,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import { ROUTES } from '@/constants/routes';
import {
  deleteExam,
  getPublicExams,
  getStagedExamsQueue,
  updateExam,
  verifyStagedExam,
  type UpdateExamPayload,
} from '@/services/examService';
import type { DirectoryExam } from '@/types';

const CATEGORY_LABELS: Record<string, string> = {
  federal: 'Federal',
  provincial: 'Provincial',
  armed_forces: 'Armed Forces',
  'armed-forces': 'Armed Forces',
  banking: 'Banking',
  testing_service: 'Testing Service',
  other: 'Other',
};

const standardCategoryOptions = [
  { label: 'Federal (e.g. FPSC)', value: 'federal' },
  { label: 'Provincial (e.g. PPSC / SPSC)', value: 'provincial' },
  { label: 'Armed Forces', value: 'armed-forces' },
  { label: 'Banking', value: 'banking' },
  { label: 'Other', value: 'other' },
];

const conductingAuthorityOptions = [
  { label: 'FPSC', value: 'FPSC' },
  { label: 'PPSC', value: 'PPSC' },
  { label: 'KPPSC', value: 'KPPSC' },
  { label: 'SPSC', value: 'SPSC' },
  { label: 'BPSC', value: 'BPSC' },
  { label: 'AJKPSC', value: 'AJKPSC' },
  { label: 'GBPSC', value: 'GBPSC' },
  { label: 'NTS', value: 'NTS' },
  { label: 'PTS', value: 'PTS' },
  { label: 'OTS', value: 'OTS' },
  { label: 'ETEA', value: 'ETEA' },
  { label: 'STS', value: 'STS' },
  { label: 'PAK_ARMY', value: 'PAK_ARMY' },
  { label: 'PAK_NAVY', value: 'PAK_NAVY' },
  { label: 'PAK_AIR_FORCE', value: 'PAK_AIR_FORCE' },
  { label: 'POLICE', value: 'POLICE' },
  { label: 'OTHER', value: 'OTHER' },
];

const provinceOptions = [
  { label: 'Federal', value: 'Federal' },
  { label: 'Punjab', value: 'Punjab' },
  { label: 'Sindh', value: 'Sindh' },
  { label: 'Khyber Pakhtunkhwa', value: 'Khyber Pakhtunkhwa' },
  { label: 'Balochistan', value: 'Balochistan' },
  { label: 'AJK', value: 'AJK' },
  { label: 'Gilgit-Baltistan', value: 'Gilgit-Baltistan' },
  { label: 'Nationwide', value: 'Nationwide' },
];

const genderOptions = [
  { label: 'Both Male & Female', value: 'both' },
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

const formatOptions = [
  { label: 'MCQ', value: 'mcq' },
  { label: 'Descriptive', value: 'descriptive' },
  { label: 'Hybrid (MCQ + Descriptive)', value: 'hybrid' },
];

const negativeMarkingOptions = [
  { label: 'No', value: 'no' },
  { label: 'Yes', value: 'yes' },
];

interface EditFormState {
  title: string;
  conductingAuthority: string;
  category: string;
  province: string;
  bpsScale: string;
  departmentName: string;
  minAge: string;
  maxAge: string;
  qualificationRequired: string;
  allowedGender: string;
  eligibleDomiciles: string;
  totalMarks: string;
  durationMinutes: string;
  negativeMarking: string;
  format: string;
  sourceUrl: string;
  officialNotificationUrl: string;
}

function toEditForm(exam: DirectoryExam): EditFormState {
  return {
    title: exam.title ?? '',
    conductingAuthority: exam.conductingAuthority ?? '',
    category: exam.category ?? '',
    province: exam.province ?? '',
    bpsScale: exam.bpsScale != null ? String(exam.bpsScale) : '',
    departmentName: exam.departmentName ?? '',
    minAge:
      exam.eligibility?.minAge != null ? String(exam.eligibility.minAge) : '',
    maxAge:
      exam.eligibility?.maxAge != null ? String(exam.eligibility.maxAge) : '',
    qualificationRequired: exam.eligibility?.qualificationRequired ?? '',
    allowedGender: exam.eligibility?.allowedGender ?? '',
    eligibleDomiciles: (exam.eligibility?.eligibleDomiciles ?? []).join(', '),
    totalMarks:
      exam.examPattern?.totalMarks != null
        ? String(exam.examPattern.totalMarks)
        : '',
    durationMinutes:
      exam.examPattern?.durationMinutes != null
        ? String(exam.examPattern.durationMinutes)
        : '',
    negativeMarking: exam.examPattern?.negativeMarking ? 'yes' : 'no',
    format: exam.examPattern?.format ?? '',
    sourceUrl: exam.audit?.sourceUrl ?? '',
    officialNotificationUrl: exam.audit?.officialNotificationUrl ?? '',
  };
}

function validateEditForm(form: EditFormState): Record<string, string> {
  const errs: Record<string, string> = {};

  if (form.title.trim().length < 5)
    errs.title = 'Title must be at least 5 characters.';
  if (!form.conductingAuthority)
    errs.conductingAuthority = 'Select the conducting authority.';
  if (!form.category) errs.category = 'Select a category.';
  if (!form.province) errs.province = 'Select a province.';

  const bps = Number(form.bpsScale);
  if (!form.bpsScale || !Number.isInteger(bps) || bps < 1 || bps > 22)
    errs.bpsScale = 'BPS must be an integer between 1 and 22.';

  const minAge = Number(form.minAge);
  if (!form.minAge || !Number.isInteger(minAge) || minAge < 18)
    errs.minAge = 'Minimum age must be at least 18.';
  const maxAge = Number(form.maxAge);
  if (!form.maxAge || !Number.isInteger(maxAge) || maxAge > 60)
    errs.maxAge = 'Maximum age must be at most 60.';
  if (form.minAge && form.maxAge && Number(form.maxAge) <= Number(form.minAge))
    errs.maxAge = 'Maximum age must be greater than minimum age.';
  if (!form.qualificationRequired.trim())
    errs.qualificationRequired = 'Enter the required qualification.';
  if (!form.allowedGender) errs.allowedGender = 'Select allowed gender.';

  const totalMarks = Number(form.totalMarks);
  if (!form.totalMarks || !Number.isInteger(totalMarks) || totalMarks <= 0)
    errs.totalMarks = 'Total marks must be a positive integer.';
  const duration = Number(form.durationMinutes);
  if (!form.durationMinutes || !Number.isInteger(duration) || duration <= 0)
    errs.durationMinutes = 'Duration must be a positive integer (minutes).';
  if (!form.negativeMarking) errs.negativeMarking = 'Select yes or no.';
  if (!form.format) errs.format = 'Select the paper format.';

  return errs;
}

function QueueStatusBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-secondary-100 px-2 py-0.5 text-xs font-semibold text-secondary-600 dark:bg-secondary-800 dark:text-secondary-300">
      <Clock size={12} />
      Pending Verification
    </span>
  );
}

export default function AdminExamsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [queue, setQueue] = useState<DirectoryExam[]>([]);
  const [totalQueue, setTotalQueue] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [examToDelete, setExamToDelete] = useState<DirectoryExam | null>(null);
  const [editingExam, setEditingExam] = useState<DirectoryExam | null>(null);
  const [editForm, setEditForm] = useState<EditFormState | null>(null);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    const loadExamData = async () => {
      try {
        const examData = await getPublicExams({ page: 1, limit: 10 });
        console.log(examData);
      } catch (err) {
        console.error('Failed to fetch public exams:', err);
      }
    };

    loadExamData();
  }, []);

  const loadQueue = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getStagedExamsQueue({ page: 1, limit: 10 });
      setQueue(res.data ?? []);
      setTotalQueue(res.meta?.total ?? res.data?.length ?? 0);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load the verification queue.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      void loadQueue();
    }, 0);
    return () => clearTimeout(t);
  }, [loadQueue]);

  const filteredQueue = useMemo(() => {
    if (!search.trim()) return queue;
    const q = search.toLowerCase();
    return queue.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.departmentName?.toLowerCase().includes(q) ||
        e.conductingAuthority.toLowerCase().includes(q)
    );
  }, [queue, search]);

  const categoryOptions = useMemo(() => {
    if (
      editingExam &&
      !standardCategoryOptions.some((o) => o.value === editingExam.category)
    ) {
      return [
        ...standardCategoryOptions,
        { label: editingExam.category, value: editingExam.category },
      ];
    }
    return standardCategoryOptions;
  }, [editingExam]);

  const handleVerify = useCallback(
    async (examId: string) => {
      // console.log(examId);
      setVerifyingId(examId);
      try {
        await verifyStagedExam(examId);
        // console.log(examId);
        setQueue((prev) => prev.filter((e) => e._id !== examId));
        showToast('Exam verified and published to catalog.', 'success');
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : 'Failed to verify exam.',
          'error'
        );
      } finally {
        setVerifyingId(null);
      }
    },
    [showToast]
  );

  const handleDelete = useCallback((exam: DirectoryExam) => {
    setExamToDelete(exam);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!examToDelete) return;
    const examId = examToDelete._id;
    setDeletingId(examId);
    try {
      await deleteExam(examId);
      setQueue((prev) => prev.filter((e) => e._id !== examId));
      setExamToDelete(null);
      showToast('Exam permanently deleted.', 'success');
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to delete exam.',
        'error'
      );
    } finally {
      setDeletingId(null);
    }
  }, [examToDelete, showToast]);

  const closeDelete = useCallback(() => {
    if (deletingId) return;
    setExamToDelete(null);
  }, [deletingId]);

  const openEdit = useCallback((exam: DirectoryExam) => {
    setEditErrors({});
    setEditForm(toEditForm(exam));
    setEditingExam(exam);
  }, []);

  const closeEdit = useCallback(() => {
    setEditingExam(null);
    setEditForm(null);
    setEditErrors({});
  }, []);

  const handleEditChange = useCallback(
    (field: keyof EditFormState, value: string) => {
      setEditForm((prev) => (prev ? { ...prev, [field]: value } : prev));
      setEditErrors((prev) => ({ ...prev, [field]: '' }));
    },
    []
  );

  const handleEditSave = useCallback(async () => {
    if (!editingExam || !editForm) return;

    const errs = validateEditForm(editForm);
    setEditErrors(errs);
    if (Object.keys(errs).length > 0) {
      showToast('Please fix the validation errors before saving.', 'error');
      return;
    }

    const payload: UpdateExamPayload = {
      title: editForm.title.trim(),
      conductingAuthority: editForm.conductingAuthority,
      category: editForm.category as UpdateExamPayload['category'],
      province: editForm.province,
      bpsScale: editForm.bpsScale ? Number(editForm.bpsScale) : undefined,
      departmentName: editForm.departmentName.trim(),
      eligibility: {
        minAge: Number(editForm.minAge),
        maxAge: Number(editForm.maxAge),
        qualificationRequired: editForm.qualificationRequired.trim(),
        allowedGender: editForm.allowedGender as 'male' | 'female' | 'both',
        eligibleDomiciles: editForm.eligibleDomiciles
          .split(',')
          .map((d) => d.trim())
          .filter(Boolean),
      },
      examPattern: {
        totalMarks: Number(editForm.totalMarks),
        durationMinutes: Number(editForm.durationMinutes),
        negativeMarking: editForm.negativeMarking === 'yes',
        format: editForm.format as 'mcq' | 'descriptive' | 'hybrid',
      },
    };

    if (editForm.sourceUrl.trim())
      payload.sourceUrl = editForm.sourceUrl.trim();
    if (editForm.officialNotificationUrl.trim())
      payload.officialNotificationUrl = editForm.officialNotificationUrl.trim();

    setSavingEdit(true);
    try {
      const res = await updateExam(editingExam._id, payload);
      setQueue((prev) =>
        prev.map((e) => (e._id === editingExam._id ? res.data : e))
      );
      showToast('Exam updated successfully.', 'success');
      closeEdit();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to update exam.',
        'error'
      );
    } finally {
      setSavingEdit(false);
    }
  }, [editingExam, editForm, showToast, closeEdit]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
          Exam Verification Queue
        </h1>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Review unverified exams and publish them to the public catalog.
        </p>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700 dark:border-danger-900 dark:bg-danger-950 dark:text-danger-300">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={() => void loadQueue()}>
            Retry
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400"
          />
          <input
            type="text"
            placeholder="Search queue by title, department, or authority..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-md border border-[rgb(var(--color-border))] bg-transparent pl-9 pr-3 text-sm text-[rgb(var(--color-text-primary))] placeholder:text-secondary-400 transition-colors hover:border-[rgb(var(--color-border-hover))] focus-ring"
          />
        </div>
        <Button
          size="sm"
          leftIcon={<Plus size={16} />}
          className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700"
          onClick={() => navigate(ROUTES.ADMIN_EXAMS_NEW)}
        >
          Create New Exam
        </Button>
      </div>

      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
        {loading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-10 animate-pulse rounded-md bg-[rgb(var(--color-surface-elevated))]"
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgb(var(--color-border))]">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                    Exam Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                    Authority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgb(var(--color-border))]">
                {filteredQueue.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-sm text-[rgb(var(--color-text-muted))]"
                    >
                      {search.trim()
                        ? 'No exams found matching your search.'
                        : 'The verification queue is empty. All exams are verified.'}
                    </td>
                  </tr>
                ) : (
                  filteredQueue.map((exam) => (
                    <tr
                      key={exam._id}
                      className="transition-colors hover:bg-[rgb(var(--color-surface-elevated))]"
                    >
                      <td className="max-w-[260px] px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-500 dark:bg-primary-950">
                            <BookOpen size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-[rgb(var(--color-text-primary))]">
                              {exam.title}
                            </p>
                            <p className="truncate text-xs text-[rgb(var(--color-text-muted))]">
                              BPS-{exam.bpsScale ?? '—'} · {exam.province}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[rgb(var(--color-text-secondary))]">
                        {exam.departmentName ?? '—'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-sm text-[rgb(var(--color-text-secondary))]">
                          <Building2
                            size={14}
                            className="text-[rgb(var(--color-text-muted))]"
                          />
                          {exam.conductingAuthority}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[rgb(var(--color-text-secondary))]">
                        {CATEGORY_LABELS[exam.category] ?? exam.category}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[rgb(var(--color-text-muted))]">
                        {exam.updatedAt
                          ? new Date(exam.updatedAt).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )
                          : '—'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <QueueStatusBadge />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<ShieldCheck size={14} />}
                            isLoading={verifyingId === exam._id}
                            disabled={
                              verifyingId !== null || deletingId !== null
                            }
                            onClick={() => void handleVerify(exam._id)}
                            className={cn(
                              'border-accent-500 text-accent-600 hover:bg-accent-50 dark:border-accent-700 dark:text-accent-400 dark:hover:bg-accent-950'
                            )}
                          >
                            Verify & Publish
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            leftIcon={<Pencil size={14} />}
                            disabled={
                              verifyingId !== null || deletingId !== null
                            }
                            onClick={() => openEdit(exam)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            leftIcon={<Trash2 size={14} />}
                            isLoading={deletingId === exam._id}
                            disabled={
                              verifyingId !== null || deletingId !== null
                            }
                            onClick={() => handleDelete(exam)}
                            className="text-danger-600 hover:bg-danger-50 hover:text-danger-700 dark:text-danger-400 dark:hover:bg-danger-950"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-[rgb(var(--color-border))] px-6 py-3">
          <p className="text-xs text-[rgb(var(--color-text-muted))]">
            Showing {filteredQueue.length} of {totalQueue} pending exams
          </p>
        </div>
      </div>

      {editingExam && editForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeEdit}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-heading text-[rgb(var(--color-text-primary))]">
                  Edit Exam
                </h2>
                <p className="mt-0.5 text-xs text-[rgb(var(--color-text-muted))]">
                  {editingExam.title}
                </p>
              </div>
              <button
                onClick={closeEdit}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-[rgb(var(--color-surface-elevated))] hover:text-[rgb(var(--color-text-primary))]"
                aria-label="Close edit dialog"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <Input
                label="Exam Title"
                required
                value={editForm.title}
                onChange={(e) => handleEditChange('title', e.target.value)}
                error={editErrors.title}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select
                  label="Conducting Authority"
                  required
                  options={conductingAuthorityOptions}
                  placeholder="Select conducting authority"
                  value={editForm.conductingAuthority}
                  onChange={(e) =>
                    handleEditChange('conductingAuthority', e.target.value)
                  }
                  error={editErrors.conductingAuthority}
                />
                <Select
                  label="Category"
                  required
                  options={categoryOptions}
                  placeholder="Select category"
                  value={editForm.category}
                  onChange={(e) => handleEditChange('category', e.target.value)}
                  error={editErrors.category}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Select
                  label="Province"
                  required
                  options={provinceOptions}
                  placeholder="Select province"
                  value={editForm.province}
                  onChange={(e) => handleEditChange('province', e.target.value)}
                  error={editErrors.province}
                />
                <Input
                  label="BPS Scale"
                  required
                  type="number"
                  min={1}
                  max={22}
                  value={editForm.bpsScale}
                  onChange={(e) => handleEditChange('bpsScale', e.target.value)}
                  error={editErrors.bpsScale}
                />
                <Input
                  label="Department Name"
                  required
                  value={editForm.departmentName}
                  onChange={(e) =>
                    handleEditChange('departmentName', e.target.value)
                  }
                  error={editErrors.departmentName}
                />
              </div>

              <div className="h-px bg-[rgb(var(--color-border))]" />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Input
                  label="Minimum Age"
                  required
                  type="number"
                  min={18}
                  value={editForm.minAge}
                  onChange={(e) => handleEditChange('minAge', e.target.value)}
                  error={editErrors.minAge}
                />
                <Input
                  label="Maximum Age"
                  required
                  type="number"
                  max={60}
                  value={editForm.maxAge}
                  onChange={(e) => handleEditChange('maxAge', e.target.value)}
                  error={editErrors.maxAge}
                />
                <Select
                  label="Allowed Gender"
                  required
                  options={genderOptions}
                  placeholder="Select gender"
                  value={editForm.allowedGender}
                  onChange={(e) =>
                    handleEditChange('allowedGender', e.target.value)
                  }
                  error={editErrors.allowedGender}
                />
              </div>
              <Textarea
                label="Required Qualification"
                required
                rows={2}
                value={editForm.qualificationRequired}
                onChange={(e) =>
                  handleEditChange('qualificationRequired', e.target.value)
                }
                error={editErrors.qualificationRequired}
              />
              <Input
                label="Eligible Domiciles"
                required
                placeholder="Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, AJK, Gilgit-Baltistan"
                value={editForm.eligibleDomiciles}
                onChange={(e) =>
                  handleEditChange('eligibleDomiciles', e.target.value)
                }
                error={editErrors.eligibleDomiciles}
                hint="Comma-separated list of domiciles."
              />

              <div className="h-px bg-[rgb(var(--color-border))]" />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Input
                  label="Total Marks"
                  required
                  type="number"
                  min={1}
                  value={editForm.totalMarks}
                  onChange={(e) =>
                    handleEditChange('totalMarks', e.target.value)
                  }
                  error={editErrors.totalMarks}
                />
                <Input
                  label="Duration (mins)"
                  required
                  type="number"
                  min={1}
                  value={editForm.durationMinutes}
                  onChange={(e) =>
                    handleEditChange('durationMinutes', e.target.value)
                  }
                  error={editErrors.durationMinutes}
                />
                <Select
                  label="Negative Marking"
                  required
                  options={negativeMarkingOptions}
                  placeholder="Select"
                  value={editForm.negativeMarking}
                  onChange={(e) =>
                    handleEditChange('negativeMarking', e.target.value)
                  }
                  error={editErrors.negativeMarking}
                />
                <Select
                  label="Paper Format"
                  required
                  options={formatOptions}
                  placeholder="Select format"
                  value={editForm.format}
                  onChange={(e) => handleEditChange('format', e.target.value)}
                  error={editErrors.format}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Source URL"
                  type="url"
                  placeholder="https://fpsc.gov.pk"
                  value={editForm.sourceUrl}
                  onChange={(e) =>
                    handleEditChange('sourceUrl', e.target.value)
                  }
                  error={editErrors.sourceUrl}
                />
                <Input
                  label="Official Notification URL"
                  type="url"
                  placeholder="https://fpsc.gov.pk/notifications"
                  value={editForm.officialNotificationUrl}
                  onChange={(e) =>
                    handleEditChange('officialNotificationUrl', e.target.value)
                  }
                  error={editErrors.officialNotificationUrl}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 border-t border-[rgb(var(--color-border))] pt-4">
              <Button variant="ghost" onClick={closeEdit}>
                Cancel
              </Button>
              <Button
                leftIcon={<ShieldCheck size={14} />}
                isLoading={savingEdit}
                className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700"
                onClick={() => void handleEditSave()}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {examToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeDelete}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-danger-50 text-danger-600 dark:bg-danger-950 dark:text-danger-400">
                  <Trash2 size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-heading text-[rgb(var(--color-text-primary))]">
                    Delete Exam
                  </h2>
                  <p className="mt-0.5 text-xs text-[rgb(var(--color-text-muted))]">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <button
                onClick={closeDelete}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-[rgb(var(--color-surface-elevated))] hover:text-[rgb(var(--color-text-primary))]"
                aria-label="Close delete dialog"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-5 rounded-xl border border-danger-200 bg-danger-50 p-4 dark:border-danger-900 dark:bg-danger-950">
              <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                Are you sure you want to permanently delete this exam?
              </p>
              <p className="mt-1 truncate text-sm text-danger-700 dark:text-danger-300">
                {examToDelete.title}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 border-t border-[rgb(var(--color-border))] pt-4">
              <Button
                variant="ghost"
                disabled={deletingId !== null}
                onClick={closeDelete}
              >
                Cancel
              </Button>
              <Button
                leftIcon={<Trash2 size={14} />}
                isLoading={deletingId === examToDelete._id}
                disabled={deletingId !== null}
                className="bg-danger-600 text-white hover:bg-danger-700"
                onClick={() => void confirmDelete()}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
