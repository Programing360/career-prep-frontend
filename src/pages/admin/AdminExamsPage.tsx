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
import { Label } from '@/components/ui/Label';
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
  testing_service: 'Testing Service',
};

const standardCategoryOptions = [
  { label: 'Federal (e.g. FPSC)', value: 'federal' },
  { label: 'Provincial (e.g. PPSC / SPSC)', value: 'provincial' },
  { label: 'Armed Forces', value: 'armed_forces' },
  { label: 'Testing Service (e.g. NTS / ETEA)', value: 'testing_service' },
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
  { label: 'Khyber Pakhtunkhwa (KPK)', value: 'KPK' },
  { label: 'Balochistan', value: 'Balochistan' },
  { label: 'AJK', value: 'AJK' },
  { label: 'Gilgit-Baltistan', value: 'Gilgit-Baltistan' },
  { label: 'Nationwide', value: 'Nationwide' },
];

const genderOptions = [
  { label: 'Both Male & Female', value: 'both' },
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Transgender', value: 'transgender' },
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

interface EditSelectionStage {
  stageNumber: number;
  title: string;
  description: string;
  isEliminationStage: boolean;
}

interface EditFormState {
  title: string;
  conductingAuthority: string;
  category: string;
  province: string;
  bpsScale: string;
  departmentName: string;
  advertisementNumber: string;
  applicationStartDate: string;
  applicationDeadline: string;
  expectedExamDate: string;
  minAge: string;
  maxAge: string;
  ageRelaxationYears: string;
  qualificationRequired: string;
  minimumGradeOrCgpa: string;
  allowedGender: string;
  eligibleDomiciles: string;
  totalMarks: string;
  durationMinutes: string;
  negativeMarking: string;
  negativeMarkingValue: string;
  passingPercentage: string;
  format: string;
  selectionProcess: EditSelectionStage[];
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
    advertisementNumber: exam.advertisementNumber ?? '',
    applicationStartDate: exam.applicationStartDate
      ? exam.applicationStartDate.slice(0, 10)
      : '',
    applicationDeadline: exam.applicationDeadline
      ? exam.applicationDeadline.slice(0, 10)
      : '',
    expectedExamDate: exam.expectedExamDate
      ? exam.expectedExamDate.slice(0, 10)
      : '',
    minAge:
      exam.eligibility?.minAge != null ? String(exam.eligibility.minAge) : '',
    maxAge:
      exam.eligibility?.maxAge != null ? String(exam.eligibility.maxAge) : '',
    ageRelaxationYears:
      exam.eligibility?.ageRelaxationYears != null
        ? String(exam.eligibility.ageRelaxationYears)
        : '',
    qualificationRequired: exam.eligibility?.qualificationRequired ?? '',
    minimumGradeOrCgpa: exam.eligibility?.minimumGradeOrCgpa ?? '',
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
    negativeMarkingValue:
      exam.examPattern?.negativeMarkingValue != null
        ? String(exam.examPattern.negativeMarkingValue)
        : '',
    passingPercentage:
      exam.examPattern?.passingPercentage != null
        ? String(exam.examPattern.passingPercentage)
        : '',
    format: exam.examPattern?.format ?? '',
    selectionProcess: (exam.selectionProcess ?? []).map((s) => ({
      stageNumber: s.stageNumber,
      title: s.title,
      description: s.description ?? '',
      isEliminationStage: s.isEliminationStage,
    })),
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

  if (form.negativeMarking === 'yes') {
    const negValue = Number(form.negativeMarkingValue);
    if (
      !form.negativeMarkingValue ||
      !Number.isFinite(negValue) ||
      negValue < 0
    )
      errs.negativeMarkingValue =
        'Enter a non-negative value for negative marking.';
  }

  const passingPct = Number(form.passingPercentage);
  if (
    form.passingPercentage &&
    (!Number.isFinite(passingPct) || passingPct <= 0 || passingPct > 100)
  )
    errs.passingPercentage = 'Passing percentage must be between 1 and 100.';

  const ageRelax = Number(form.ageRelaxationYears);
  if (form.ageRelaxationYears && (!Number.isInteger(ageRelax) || ageRelax < 0))
    errs.ageRelaxationYears = 'Age relaxation must be a non-negative integer.';

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

function CatalogStatusBadge({ active }: { active: boolean }) {
  if (!active) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-danger-100 px-2 py-0.5 text-xs font-semibold text-danger-600 dark:bg-danger-900 dark:text-danger-300">
        Inactive
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-600 dark:bg-primary-800 dark:text-primary-300">
      <ShieldCheck size={12} />
      Verified
    </span>
  );
}

export default function AdminExamsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');
  const [queue, setQueue] = useState<DirectoryExam[]>([]);
  const [totalQueue, setTotalQueue] = useState(0);
  const [exams, setExams] = useState<DirectoryExam[]>([]);
  const [totalExams, setTotalExams] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allLoading, setAllLoading] = useState(false);
  const [allError, setAllError] = useState('');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [examToDelete, setExamToDelete] = useState<DirectoryExam | null>(null);
  const [editingExam, setEditingExam] = useState<DirectoryExam | null>(null);
  const [editForm, setEditForm] = useState<EditFormState | null>(null);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [savingEdit, setSavingEdit] = useState(false);

  const loadAllExams = useCallback(async () => {
    setAllLoading(true);
    setAllError('');
    try {
      const res = await getPublicExams({ page: 1, limit: 50 });
      setExams(res.data ?? []);
      setTotalExams(res.meta?.total ?? res.data?.length ?? 0);
    } catch (err) {
      setAllError(err instanceof Error ? err.message : 'Failed to load exams.');
    } finally {
      setAllLoading(false);
    }
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
      void loadAllExams();
    }, 0);
    return () => clearTimeout(t);
  }, [loadQueue, loadAllExams]);

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

  const filteredExams = useMemo(() => {
    if (!search.trim()) return exams;
    const q = search.toLowerCase();
    return exams.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.departmentName?.toLowerCase().includes(q) ||
        e.conductingAuthority.toLowerCase().includes(q)
    );
  }, [exams, search]);

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
        const res = await verifyStagedExam(examId);
        setQueue((prev) => prev.filter((e) => e._id !== examId));
        setExams((prev) => [res.data, ...prev]);
        setTotalExams((prev) => prev + 1);
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
      setExams((prev) => prev.filter((e) => e._id !== examId));
      setTotalExams((prev) => Math.max(0, prev - 1));
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

  const handleEditStageChange = useCallback(
    (
      index: number,
      field: keyof EditSelectionStage,
      value: string | boolean
    ) => {
      setEditForm((prev) =>
        prev
          ? {
              ...prev,
              selectionProcess: prev.selectionProcess.map((stage, i) =>
                i === index ? { ...stage, [field]: value } : stage
              ),
            }
          : prev
      );
    },
    []
  );

  const handleAddEditStage = useCallback(() => {
    setEditForm((prev) =>
      prev
        ? {
            ...prev,
            selectionProcess: [
              ...prev.selectionProcess,
              {
                stageNumber: prev.selectionProcess.length + 1,
                title: '',
                description: '',
                isEliminationStage: true,
              },
            ],
          }
        : prev
    );
  }, []);

  const handleRemoveEditStage = useCallback((index: number) => {
    setEditForm((prev) =>
      prev
        ? {
            ...prev,
            selectionProcess: prev.selectionProcess
              .filter((_, i) => i !== index)
              .map((stage, i) => ({ ...stage, stageNumber: i + 1 })),
          }
        : prev
    );
  }, []);

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
        allowedGender: editForm.allowedGender as
          'male' | 'female' | 'both' | 'transgender',
        eligibleDomiciles: editForm.eligibleDomiciles
          .split(',')
          .map((d) => d.trim())
          .filter(Boolean),
        ...(editForm.ageRelaxationYears
          ? { ageRelaxationYears: Number(editForm.ageRelaxationYears) }
          : {}),
        ...(editForm.minimumGradeOrCgpa.trim()
          ? { minimumGradeOrCgpa: editForm.minimumGradeOrCgpa.trim() }
          : {}),
      },
      examPattern: {
        totalMarks: Number(editForm.totalMarks),
        durationMinutes: Number(editForm.durationMinutes),
        negativeMarking: editForm.negativeMarking === 'yes',
        format: editForm.format as 'mcq' | 'descriptive' | 'hybrid',
        ...(editForm.negativeMarking === 'yes' && editForm.negativeMarkingValue
          ? { negativeMarkingValue: Number(editForm.negativeMarkingValue) }
          : {}),
        ...(editForm.passingPercentage
          ? { passingPercentage: Number(editForm.passingPercentage) }
          : {}),
      },
    };

    if (editForm.advertisementNumber.trim())
      payload.advertisementNumber = editForm.advertisementNumber.trim();
    if (editForm.applicationStartDate)
      payload.applicationStartDate = editForm.applicationStartDate;
    if (editForm.applicationDeadline)
      payload.applicationDeadline = editForm.applicationDeadline;
    if (editForm.expectedExamDate)
      payload.expectedExamDate = editForm.expectedExamDate;

    const stages = editForm.selectionProcess
      .filter((s) => s.title.trim())
      .map((s) => ({
        stageNumber: s.stageNumber,
        title: s.title.trim(),
        description: s.description.trim() || undefined,
        isEliminationStage: s.isEliminationStage,
      }));
    if (stages.length > 0) payload.selectionProcess = stages;

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
      setExams((prev) =>
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
        <h1 className="text-2xl font-bold font-heading dark:text-white">
          Exam Management
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Manage the public exam catalog and review pending verifications.
        </p>
      </div>

      <div className="inline-flex rounded-lg shadow-sm border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-1">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={cn(
            'inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'all'
              ? 'bg-gray-900 text-white dark:bg-primary-600'
              : 'text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]'
          )}
        >
          <BookOpen size={16} />
          All Exams
          <span
            className={cn(
              'rounded-full px-1.5 py-0.5 text-xs font-semibold',
              activeTab === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-[rgb(var(--color-surface-elevated))] '
            )}
          >
            {totalExams}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={cn(
            'inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'pending'
              ? 'bg-gray-900 text-white dark:bg-primary-600'
              : 'text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]'
          )}
        >
          <Clock size={16} />
          Pending Verification
          <span
            className={cn(
              'rounded-full px-1.5 py-0.5 text-xs font-semibold',
              activeTab === 'pending'
                ? 'bg-white/20 text-white'
                : 'bg-[rgb(var(--color-surface-elevated))] '
            )}
          >
            {totalQueue}
          </span>
        </button>
      </div>

      {(activeTab === 'all' ? allError : error) && (
        <div className="flex items-center justify-between rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700 dark:border-danger-900 dark:bg-danger-950 dark:text-danger-300">
          <span>{activeTab === 'all' ? allError : error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              void (activeTab === 'all' ? loadAllExams() : loadQueue())
            }
          >
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
            placeholder={
              activeTab === 'all'
                ? 'Search exams by title, department, or authority...'
                : 'Search queue by title, department, or authority...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-md border  bg-transparent pl-9 pr-3 text-sm text-[rgb(var(--color-text-primary))] placeholder:text-secondary-400 transition-colors hover:border-[rgb(var(--color-border-hover))] focus-ring shadow-lg"
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

      <div className="rounded-xl shadow-xl dark:bg-[#101c44]">
        {(activeTab === 'all' ? allLoading : loading) ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-10 animate-pulse rounded-md bg-[rgb(var(--color-surface-elevated))]"
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto h-[600px]">
            <table className="w-full">
              <thead className="sticky top-0">
                <tr className="border-b border-[rgb(var(--color-border))] bg-purple-400 text-white">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ">
                    Exam Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ">
                    Authority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider ">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgb(var(--color-border))] ">
                {(activeTab === 'all' ? filteredExams : filteredQueue)
                  .length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm ">
                      {search.trim()
                        ? 'No exams found matching your search.'
                        : activeTab === 'all'
                          ? 'No exams found in the catalog yet.'
                          : 'The verification queue is empty. All exams are verified.'}
                    </td>
                  </tr>
                ) : (
                  (activeTab === 'all' ? filteredExams : filteredQueue).map(
                    (exam) => (
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
                              <p className="truncate text-xs ">
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
                            <Building2 size={14} className="" />
                            {exam.conductingAuthority}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-[rgb(var(--color-text-secondary))]">
                          {CATEGORY_LABELS[exam.category] ?? exam.category}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm ">
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
                          {activeTab === 'all' ? (
                            <CatalogStatusBadge active={exam.isActive} />
                          ) : (
                            <QueueStatusBadge />
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {activeTab === 'pending' && (
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
                            )}
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
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-[rgb(var(--color-border))] px-6 py-3">
          <p className="text-xs ">
            Showing{' '}
            {activeTab === 'all'
              ? `${filteredExams.length} of ${totalExams} exams`
              : `${filteredQueue.length} of ${totalQueue} pending exams`}
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
                <p className="mt-0.5 text-xs ">{editingExam.title}</p>
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
              <Input
                label="Advertisement Number"
                placeholder="e.g. F.4-1/2025-IG"
                value={editForm.advertisementNumber}
                onChange={(e) =>
                  handleEditChange('advertisementNumber', e.target.value)
                }
                error={editErrors.advertisementNumber}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Input
                  label="Application Start Date"
                  type="date"
                  value={editForm.applicationStartDate}
                  onChange={(e) =>
                    handleEditChange('applicationStartDate', e.target.value)
                  }
                  error={editErrors.applicationStartDate}
                />
                <Input
                  label="Application Deadline"
                  type="date"
                  value={editForm.applicationDeadline}
                  onChange={(e) =>
                    handleEditChange('applicationDeadline', e.target.value)
                  }
                  error={editErrors.applicationDeadline}
                />
                <Input
                  label="Expected Exam Date"
                  type="date"
                  value={editForm.expectedExamDate}
                  onChange={(e) =>
                    handleEditChange('expectedExamDate', e.target.value)
                  }
                  error={editErrors.expectedExamDate}
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Age Relaxation (years)"
                  type="number"
                  min={0}
                  value={editForm.ageRelaxationYears}
                  onChange={(e) =>
                    handleEditChange('ageRelaxationYears', e.target.value)
                  }
                  error={editErrors.ageRelaxationYears}
                />
                <Input
                  label="Minimum Grade / CGPA"
                  placeholder="e.g. 2.5 CGPA or B Grade"
                  value={editForm.minimumGradeOrCgpa}
                  onChange={(e) =>
                    handleEditChange('minimumGradeOrCgpa', e.target.value)
                  }
                  error={editErrors.minimumGradeOrCgpa}
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
              {editForm.negativeMarking === 'yes' && (
                <Input
                  label="Negative Marking Value"
                  type="number"
                  step="0.01"
                  min={0}
                  value={editForm.negativeMarkingValue}
                  onChange={(e) =>
                    handleEditChange('negativeMarkingValue', e.target.value)
                  }
                  error={editErrors.negativeMarkingValue}
                  hint="Marks deducted for every wrong answer."
                />
              )}
              <Input
                label="Passing Percentage"
                type="number"
                min={1}
                max={100}
                value={editForm.passingPercentage}
                onChange={(e) =>
                  handleEditChange('passingPercentage', e.target.value)
                }
                error={editErrors.passingPercentage}
              />

              <div className="h-px bg-[rgb(var(--color-border))]" />

              <div>
                <div className="flex items-center justify-between gap-2">
                  <Label className="text-[13px] font-medium text-[rgb(var(--color-text-primary))]">
                    Selection Process
                  </Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    leftIcon={<Plus size={14} />}
                    onClick={handleAddEditStage}
                  >
                    Add Stage
                  </Button>
                </div>
                <div className="mt-3 space-y-3">
                  {editForm.selectionProcess.length === 0 ? (
                    <p className="text-sm ">No stages added yet.</p>
                  ) : (
                    editForm.selectionProcess.map((stage, index) => (
                      <div
                        key={stage.stageNumber}
                        className="rounded-xl border border-[rgb(var(--color-border))] p-4"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold uppercase tracking-wider ">
                            Stage {stage.stageNumber}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleRemoveEditStage(index)}
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-[rgb(var(--color-border))] text-danger-600 transition-colors hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-950"
                            aria-label={`Remove stage ${stage.stageNumber}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <Input
                            label="Stage Title"
                            required
                            placeholder="e.g. Written Test"
                            value={stage.title}
                            onChange={(e) =>
                              handleEditStageChange(
                                index,
                                'title',
                                e.target.value
                              )
                            }
                          />
                          <label className="flex items-center gap-2 pt-6 text-sm font-medium text-[rgb(var(--color-text-secondary))]">
                            <input
                              type="checkbox"
                              checked={stage.isEliminationStage}
                              onChange={(e) =>
                                handleEditStageChange(
                                  index,
                                  'isEliminationStage',
                                  e.target.checked
                                )
                              }
                              className="h-4 w-4 rounded border-[rgb(var(--color-border))] accent-primary-600"
                            />
                            Elimination Stage
                          </label>
                        </div>
                        <div className="mt-3">
                          <Input
                            label="Stage Description"
                            placeholder="e.g. MCQ-based screening test out of 100 marks"
                            value={stage.description}
                            onChange={(e) =>
                              handleEditStageChange(
                                index,
                                'description',
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
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
                  <p className="mt-0.5 text-xs ">
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
