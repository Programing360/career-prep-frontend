import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Coins,
  FileText,
  Eye,
  Plus,
  Send,
  Trash2,
  Building2,
  ListChecks,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Label } from '@/components/ui/Label';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { useToast } from '@/hooks/useToast';
import { createExam, type CreateExamPayload } from '@/services/adminService';
import { getSubjects } from '@/services/taxonomyService';
import { isApiError, type ApiError } from '@/lib/axios';

interface SelectionStageDraft {
  stageNumber: number;
  title: string;
  description: string;
  isEliminationStage: boolean;
}

interface ExamDetails {
  title: string;
  slug: string;
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
  selectionProcess: SelectionStageDraft[];
  categoryRef: string;
  targetSubjects: string[];
  sourceUrl: string;
  officialNotificationUrl: string;
}

type StepId = 1 | 2;

const steps: { id: StepId; label: string; icon: typeof FileText }[] = [
  { id: 1, label: 'Basic Details', icon: FileText },
  { id: 2, label: 'Review & Publish', icon: Eye },
];

const categoryOptions = [
  { label: 'Federal (e.g. FPSC)', value: 'federal' },
  { label: 'Provincial (e.g. PPSC / SPSC)', value: 'provincial' },
  { label: 'Armed Forces', value: 'armed_forces' },
  { label: 'Testing Service (e.g. NTS / ETEA)', value: 'testing_service' },
];

const provinceOptions = [
  { label: 'Federal', value: 'Federal' },
  { label: 'Punjab', value: 'Punjab' },
  { label: 'Khyber Pakhtunkhwa (KPK)', value: 'KPK' },
  { label: 'Sindh', value: 'Sindh' },
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

const formatOptions = [
  { label: 'MCQ', value: 'mcq' },
  { label: 'Descriptive', value: 'descriptive' },
  { label: 'Hybrid (MCQ + Descriptive)', value: 'hybrid' },
];

const negativeMarkingOptions = [
  { label: 'No', value: 'no' },
  { label: 'Yes', value: 'yes' },
];

const defaultDetails: ExamDetails = {
  title: '',
  slug: '',
  conductingAuthority: '',
  category: '',
  province: '',
  bpsScale: '',
  departmentName: '',
  advertisementNumber: '',
  applicationStartDate: '',
  applicationDeadline: '',
  expectedExamDate: '',
  minAge: '',
  maxAge: '',
  ageRelaxationYears: '',
  qualificationRequired: '',
  minimumGradeOrCgpa: '',
  allowedGender: '',
  eligibleDomiciles: '',
  totalMarks: '',
  durationMinutes: '',
  negativeMarking: '',
  negativeMarkingValue: '',
  passingPercentage: '',
  format: '',
  selectionProcess: [],
  categoryRef: '',
  targetSubjects: [],
  sourceUrl: '',
  officialNotificationUrl: '',
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

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

function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof FileText;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-950">
        <Icon size={18} className="text-primary-500" />
      </div>
      <div>
        <h4 className="text-sm font-semibold font-heading text-[rgb(var(--color-text-primary))]">
          {title}
        </h4>
        <p className="text-xs text-[rgb(var(--color-text-muted))]">
          {description}
        </p>
      </div>
    </div>
  );
}

function BasicDetailsStep({
  details,
  onChange,
  errors,
  subjectOptions,
  onToggleSubject,
  onAddStage,
  onRemoveStage,
  onStageChange,
}: {
  details: ExamDetails;
  onChange: (field: keyof ExamDetails, value: string) => void;
  errors: Record<string, string>;
  subjectOptions: { label: string; value: string }[];
  onToggleSubject: (subjectId: string) => void;
  onAddStage: () => void;
  onRemoveStage: (index: number) => void;
  onStageChange: (
    index: number,
    field: keyof SelectionStageDraft,
    value: string | boolean
  ) => void;
}) {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          icon={Building2}
          title="Core Profile"
          description="Identity, authority, and classification of the exam."
        />
        <Input
          label="Exam Title"
          required
          placeholder="e.g. Inspector Inland Revenue (BS-16)"
          value={details.title}
          onChange={(e) => onChange('title', e.target.value)}
          error={errors.title}
        />
        <Input
          label="Slug"
          required
          readOnly
          value={details.slug}
          hint="Auto-generated from the title. Must be unique."
          error={errors.slug}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Conducting Authority"
            required
            options={conductingAuthorityOptions}
            placeholder="Select conducting authority"
            value={details.conductingAuthority}
            onChange={(e) => onChange('conductingAuthority', e.target.value)}
            error={errors.conductingAuthority}
          />
          <Select
            label="Category"
            required
            options={categoryOptions}
            placeholder="Select category"
            value={details.category}
            onChange={(e) => onChange('category', e.target.value)}
            error={errors.category}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select
            label="Province"
            required
            options={provinceOptions}
            placeholder="Select province"
            value={details.province}
            onChange={(e) => onChange('province', e.target.value)}
            error={errors.province}
          />
          <Input
            label="BPS Scale"
            required
            type="number"
            min={1}
            max={22}
            placeholder="e.g. 16"
            value={details.bpsScale}
            onChange={(e) => onChange('bpsScale', e.target.value)}
            error={errors.bpsScale}
          />
          <Input
            label="Department Name"
            required
            placeholder="e.g. Federal Board of Revenue (FBR)"
            value={details.departmentName}
            onChange={(e) => onChange('departmentName', e.target.value)}
            error={errors.departmentName}
          />
        </div>
        <Input
          label="Advertisement Number"
          placeholder="e.g. F.4-1/2025-IG"
          value={details.advertisementNumber}
          onChange={(e) => onChange('advertisementNumber', e.target.value)}
          error={errors.advertisementNumber}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Application Start Date"
            type="date"
            value={details.applicationStartDate}
            onChange={(e) => onChange('applicationStartDate', e.target.value)}
            error={errors.applicationStartDate}
          />
          <Input
            label="Application Deadline"
            type="date"
            value={details.applicationDeadline}
            onChange={(e) => onChange('applicationDeadline', e.target.value)}
            error={errors.applicationDeadline}
          />
          <Input
            label="Expected Exam Date"
            type="date"
            value={details.expectedExamDate}
            onChange={(e) => onChange('expectedExamDate', e.target.value)}
            error={errors.expectedExamDate}
          />
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          icon={FileText}
          title="Eligibility Criteria"
          description="Who is allowed to apply for this exam."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Minimum Age"
            required
            type="number"
            min={18}
            placeholder="e.g. 20"
            leftIcon={<Clock size={16} className="text-primary-500" />}
            value={details.minAge}
            onChange={(e) => onChange('minAge', e.target.value)}
            error={errors.minAge}
          />
          <Input
            label="Maximum Age"
            required
            type="number"
            max={60}
            placeholder="e.g. 28"
            leftIcon={<Clock size={16} className="text-primary-500" />}
            value={details.maxAge}
            onChange={(e) => onChange('maxAge', e.target.value)}
            error={errors.maxAge}
          />
          <Select
            label="Allowed Gender"
            required
            options={genderOptions}
            placeholder="Select gender"
            value={details.allowedGender}
            onChange={(e) => onChange('allowedGender', e.target.value)}
            error={errors.allowedGender}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Age Relaxation (years)"
            type="number"
            min={0}
            placeholder="e.g. 5"
            value={details.ageRelaxationYears}
            onChange={(e) => onChange('ageRelaxationYears', e.target.value)}
            error={errors.ageRelaxationYears}
            hint="Extra age relaxation allowed for reserved categories."
          />
          <Input
            label="Minimum Grade / CGPA"
            placeholder="e.g. 2.5 CGPA or B Grade"
            value={details.minimumGradeOrCgpa}
            onChange={(e) => onChange('minimumGradeOrCgpa', e.target.value)}
            error={errors.minimumGradeOrCgpa}
          />
        </div>
        <Textarea
          label="Required Qualification"
          required
          rows={2}
          placeholder="e.g. Bachelor's degree with Economics, Commerce, Statistics, or Law"
          value={details.qualificationRequired}
          onChange={(e) => onChange('qualificationRequired', e.target.value)}
          error={errors.qualificationRequired}
        />
        <Input
          label="Eligible Domiciles"
          required
          placeholder="Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, AJK, Gilgit-Baltistan"
          value={details.eligibleDomiciles}
          onChange={(e) => onChange('eligibleDomiciles', e.target.value)}
          error={errors.eligibleDomiciles}
          hint="Comma-separated list of domiciles."
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          icon={Coins}
          title="Exam Pattern"
          description="Marks, duration, and format of the exam paper."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Total Marks"
            required
            type="number"
            min={1}
            placeholder="e.g. 100"
            value={details.totalMarks}
            onChange={(e) => onChange('totalMarks', e.target.value)}
            error={errors.totalMarks}
          />
          <Input
            label="Duration (mins)"
            required
            type="number"
            min={1}
            placeholder="e.g. 120"
            leftIcon={<Clock size={16} className="text-primary-500" />}
            value={details.durationMinutes}
            onChange={(e) => onChange('durationMinutes', e.target.value)}
            error={errors.durationMinutes}
          />
          <Select
            label="Negative Marking"
            required
            options={negativeMarkingOptions}
            placeholder="Select"
            value={details.negativeMarking}
            onChange={(e) => onChange('negativeMarking', e.target.value)}
            error={errors.negativeMarking}
          />
          <Select
            label="Paper Format"
            required
            options={formatOptions}
            placeholder="Select format"
            value={details.format}
            onChange={(e) => onChange('format', e.target.value)}
            error={errors.format}
          />
        </div>
        {details.negativeMarking === 'yes' && (
          <Input
            label="Negative Marking Value"
            type="number"
            step="0.01"
            min={0}
            placeholder="e.g. 0.25"
            value={details.negativeMarkingValue}
            onChange={(e) => onChange('negativeMarkingValue', e.target.value)}
            error={errors.negativeMarkingValue}
            hint="Marks deducted for every wrong answer."
          />
        )}
        <Input
          label="Passing Percentage"
          type="number"
          min={1}
          max={100}
          placeholder="e.g. 33"
          value={details.passingPercentage}
          onChange={(e) => onChange('passingPercentage', e.target.value)}
          error={errors.passingPercentage}
          hint="Minimum percentage required to pass the exam."
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          icon={ListChecks}
          title="Selection Process"
          description="Ordered stages of the recruitment / selection process."
        />
        {details.selectionProcess.length === 0 && (
          <p className="text-sm text-[rgb(var(--color-text-muted))]">
            No stages added yet. Add at least one stage for the selection
            process.
          </p>
        )}
        <div className="space-y-3">
          {details.selectionProcess.map((stage, index) => (
            <div
              key={stage.stageNumber}
              className="rounded-xl border border-[rgb(var(--color-border))] p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                  Stage {stage.stageNumber}
                </p>
                <button
                  type="button"
                  onClick={() => onRemoveStage(index)}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-[rgb(var(--color-border))] text-danger-600 transition-colors hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-950"
                  aria-label={`Remove stage ${stage.stageNumber}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Stage Title"
                    required
                    placeholder="e.g. Written Test"
                    value={stage.title}
                    onChange={(e) =>
                      onStageChange(index, 'title', e.target.value)
                    }
                  />
                  <label className="flex items-center gap-2 pt-6 text-sm font-medium text-[rgb(var(--color-text-secondary))]">
                    <input
                      type="checkbox"
                      checked={stage.isEliminationStage}
                      onChange={(e) =>
                        onStageChange(
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
                <Input
                  label="Stage Description"
                  placeholder="e.g. MCQ-based screening test out of 100 marks"
                  value={stage.description}
                  onChange={(e) =>
                    onStageChange(index, 'description', e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          leftIcon={<Plus size={14} />}
          onClick={onAddStage}
        >
          Add Stage
        </Button>
        {errors.selectionProcess && (
          <p className="text-sm text-danger-600 dark:text-danger-400">
            {errors.selectionProcess}
          </p>
        )}
      </section>

      <section className="space-y-4">
        <SectionHeading
          icon={ListChecks}
          title="Taxonomy Mapping"
          description="Link the exam to a category record and relevant subjects."
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Input
            label="Category Ref ID"
            placeholder="ExamCategory ObjectId (optional)"
            value={details.categoryRef}
            onChange={(e) => onChange('categoryRef', e.target.value)}
            error={errors.categoryRef}
            hint="ObjectId of the ExamCategory record this exam belongs to."
          />
          <div>
            <Label>Target Subjects</Label>
            <div className="mt-1.5 max-h-56 overflow-y-auto rounded-md border border-[rgb(var(--color-border))] p-2">
              {subjectOptions.length === 0 ? (
                <p className="px-2 py-3 text-sm text-[rgb(var(--color-text-muted))]">
                  No subjects available. Add subjects in Taxonomy first.
                </p>
              ) : (
                subjectOptions.map((subject) => {
                  const checked = details.targetSubjects.includes(
                    subject.value
                  );
                  return (
                    <label
                      key={subject.value}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-[rgb(var(--color-surface-elevated))]"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggleSubject(subject.value)}
                        className="h-4 w-4 rounded border-[rgb(var(--color-border))] accent-primary-600"
                      />
                      <span className="truncate">{subject.label}</span>
                    </label>
                  );
                })
              )}
            </div>
            <p className="mt-1 text-xs text-secondary-500">
              Subjects included in this exam's syllabus.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          icon={FileText}
          title="Source Links (Optional)"
          description="Official URLs referenced by the trust verification card."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Source URL"
            type="url"
            placeholder="https://fpsc.gov.pk"
            value={details.sourceUrl}
            onChange={(e) => onChange('sourceUrl', e.target.value)}
            error={errors.sourceUrl}
          />
          <Input
            label="Official Notification URL"
            type="url"
            placeholder="https://fpsc.gov.pk/notifications"
            value={details.officialNotificationUrl}
            onChange={(e) =>
              onChange('officialNotificationUrl', e.target.value)
            }
            error={errors.officialNotificationUrl}
          />
        </div>
      </section>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[rgb(var(--color-text-muted))]">{label}</p>
      <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
        {value || '—'}
      </p>
    </div>
  );
}

function ReviewPublishStep({
  details,
  subjectOptions,
}: {
  details: ExamDetails;
  subjectOptions: { label: string; value: string }[];
}) {
  const categoryLabel =
    categoryOptions.find((o) => o.value === details.category)?.label ??
    details.category;
  const provinceLabel =
    provinceOptions.find((o) => o.value === details.province)?.label ??
    details.province;
  const genderLabel =
    genderOptions.find((o) => o.value === details.allowedGender)?.label ??
    details.allowedGender;
  const formatLabel =
    formatOptions.find((o) => o.value === details.format)?.label ??
    details.format;
  const selectedSubjectLabels = details.targetSubjects
    .map((id) => subjectOptions.find((s) => s.value === id)?.label ?? id)
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold font-heading text-[rgb(var(--color-text-primary))]">
          Review & Publish
        </h3>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-muted))]">
          Review the exam profile before publishing it to the catalog. Manual
          entries are auto-verified.
        </p>
      </div>

      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5">
        <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[rgb(var(--color-text-primary))]">
          <Building2 size={16} className="text-primary-500" />
          Core Profile
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ReviewRow label="Title" value={details.title} />
          <ReviewRow label="Slug" value={details.slug} />
          <ReviewRow
            label="Conducting Authority"
            value={details.conductingAuthority}
          />
          <ReviewRow label="Category" value={categoryLabel} />
          <ReviewRow label="Province" value={provinceLabel} />
          <ReviewRow
            label="BPS Scale"
            value={details.bpsScale ? `BS-${details.bpsScale}` : ''}
          />
          <ReviewRow label="Department" value={details.departmentName} />
          <ReviewRow
            label="Advertisement Number"
            value={details.advertisementNumber}
          />
          <ReviewRow
            label="Application Start Date"
            value={
              details.applicationStartDate
                ? new Date(
                    details.applicationStartDate + 'T00:00:00'
                  ).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : ''
            }
          />
          <ReviewRow
            label="Application Deadline"
            value={
              details.applicationDeadline
                ? new Date(
                    details.applicationDeadline + 'T00:00:00'
                  ).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : ''
            }
          />
          <ReviewRow
            label="Expected Exam Date"
            value={
              details.expectedExamDate
                ? new Date(
                    details.expectedExamDate + 'T00:00:00'
                  ).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : ''
            }
          />
        </div>
      </div>

      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5">
        <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[rgb(var(--color-text-primary))]">
          <FileText size={16} className="text-primary-500" />
          Eligibility Criteria
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ReviewRow
            label="Age Range"
            value={
              details.minAge || details.maxAge
                ? `${details.minAge} – ${details.maxAge} years`
                : ''
            }
          />
          <ReviewRow
            label="Age Relaxation"
            value={
              details.ageRelaxationYears
                ? `${details.ageRelaxationYears} years`
                : ''
            }
          />
          <ReviewRow label="Allowed Gender" value={genderLabel} />
          <ReviewRow
            label="Minimum Grade / CGPA"
            value={details.minimumGradeOrCgpa}
          />
          <ReviewRow
            label="Required Qualification"
            value={details.qualificationRequired}
          />
          <ReviewRow
            label="Eligible Domiciles"
            value={details.eligibleDomiciles}
          />
        </div>
      </div>

      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5">
        <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[rgb(var(--color-text-primary))]">
          <Coins size={16} className="text-primary-500" />
          Exam Pattern
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ReviewRow label="Total Marks" value={details.totalMarks} />
          <ReviewRow
            label="Duration"
            value={
              details.durationMinutes ? `${details.durationMinutes} mins` : ''
            }
          />
          <ReviewRow
            label="Negative Marking"
            value={
              details.negativeMarking === 'yes'
                ? details.negativeMarkingValue
                  ? `Yes (${details.negativeMarkingValue} per wrong answer)`
                  : 'Yes'
                : details.negativeMarking === 'no'
                  ? 'No'
                  : ''
            }
          />
          <ReviewRow label="Paper Format" value={formatLabel} />
          <ReviewRow
            label="Passing Percentage"
            value={
              details.passingPercentage ? `${details.passingPercentage}%` : ''
            }
          />
        </div>
      </div>

      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5">
        <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[rgb(var(--color-text-primary))]">
          <ListChecks size={16} className="text-primary-500" />
          Selection Process
        </h4>
        {details.selectionProcess.length === 0 ? (
          <p className="text-sm text-[rgb(var(--color-text-muted))]">
            No stages added.
          </p>
        ) : (
          <div className="space-y-3">
            {details.selectionProcess.map((stage) => (
              <div
                key={stage.stageNumber}
                className="rounded-lg border border-[rgb(var(--color-border))] p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                    Stage {stage.stageNumber}: {stage.title}
                  </p>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-semibold',
                      stage.isEliminationStage
                        ? 'bg-danger-100 text-danger-700 dark:bg-danger-950 dark:text-danger-400'
                        : 'bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-400'
                    )}
                  >
                    {stage.isEliminationStage
                      ? 'Elimination'
                      : 'Non-elimination'}
                  </span>
                </div>
                {stage.description && (
                  <p className="mt-1 text-sm text-[rgb(var(--color-text-muted))]">
                    {stage.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5">
        <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[rgb(var(--color-text-primary))]">
          <ListChecks size={16} className="text-primary-500" />
          Taxonomy Mapping
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ReviewRow label="Category Ref ID" value={details.categoryRef} />
          <ReviewRow
            label="Target Subjects"
            value={selectedSubjectLabels.join(', ')}
          />
        </div>
      </div>

      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5">
        <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[rgb(var(--color-text-primary))]">
          <Eye size={16} className="text-primary-500" />
          Source Links
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ReviewRow label="Source URL" value={details.sourceUrl} />
          <ReviewRow
            label="Official Notification URL"
            value={details.officialNotificationUrl}
          />
        </div>
      </div>
    </div>
  );
}

export default function CreateExamPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState<StepId>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<StepId>>(new Set());

  const [details, setDetails] = useState<ExamDetails>(defaultDetails);
  const [detailErrors, setDetailErrors] = useState<Record<string, string>>({});
  const [publishing, setPublishing] = useState(false);
  const [subjectOptions, setSubjectOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const res = await getSubjects({ limit: 100 });
        const subjects = res.data.subjects ?? [];
        setSubjectOptions(
          subjects.map((s) => ({ label: s.title, value: s._id }))
        );
      } catch {
        // Subjects are optional for manual exam creation; ignore failures.
      }
    };
    const t = setTimeout(() => {
      void loadSubjects();
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const handleDetailChange = useCallback(
    (field: keyof ExamDetails, value: string) => {
      setDetails((prev) => {
        const next = { ...prev, [field]: value };
        if (field === 'title') next.slug = slugify(value);
        return next;
      });
      setDetailErrors((prev) => ({ ...prev, [field]: '' }));
    },
    []
  );

  const handleToggleSubject = useCallback((subjectId: string) => {
    setDetails((prev) => ({
      ...prev,
      targetSubjects: prev.targetSubjects.includes(subjectId)
        ? prev.targetSubjects.filter((id) => id !== subjectId)
        : [...prev.targetSubjects, subjectId],
    }));
  }, []);

  const handleAddStage = useCallback(() => {
    setDetails((prev) => ({
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
    }));
  }, []);

  const handleRemoveStage = useCallback((index: number) => {
    setDetails((prev) => {
      const stages = prev.selectionProcess
        .filter((_, i) => i !== index)
        .map((stage, i) => ({ ...stage, stageNumber: i + 1 }));
      return { ...prev, selectionProcess: stages };
    });
  }, []);

  const handleStageChange = useCallback(
    (
      index: number,
      field: keyof SelectionStageDraft,
      value: string | boolean
    ) => {
      setDetails((prev) => ({
        ...prev,
        selectionProcess: prev.selectionProcess.map((stage, i) =>
          i === index ? { ...stage, [field]: value } : stage
        ),
      }));
    },
    []
  );

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};

    if (details.title.trim().length < 5)
      errs.title = 'Title must be at least 5 characters.';
    if (details.slug.length < 3)
      errs.slug = 'Slug must be at least 3 characters (generated from title).';
    if (!details.conductingAuthority)
      errs.conductingAuthority = 'Select the conducting authority.';
    if (!details.category) errs.category = 'Select a category.';
    if (!details.province) errs.province = 'Select a province.';

    const bps = Number(details.bpsScale);
    if (!details.bpsScale || !Number.isInteger(bps) || bps < 1 || bps > 22)
      errs.bpsScale = 'BPS must be an integer between 1 and 22.';
    if (!details.departmentName.trim())
      errs.departmentName = 'Enter the department name.';

    const minAge = Number(details.minAge);
    if (!details.minAge || !Number.isInteger(minAge) || minAge < 18)
      errs.minAge = 'Minimum age must be at least 18.';
    const maxAge = Number(details.maxAge);
    if (!details.maxAge || !Number.isInteger(maxAge) || maxAge > 60)
      errs.maxAge = 'Maximum age must be at most 60.';
    if (
      details.minAge &&
      details.maxAge &&
      Number(details.maxAge) <= Number(details.minAge)
    )
      errs.maxAge = 'Maximum age must be greater than minimum age.';
    if (!details.qualificationRequired.trim())
      errs.qualificationRequired = 'Enter the required qualification.';
    if (!details.allowedGender) errs.allowedGender = 'Select allowed gender.';
    if (!details.eligibleDomiciles.trim())
      errs.eligibleDomiciles = 'Enter at least one eligible domicile.';

    const totalMarks = Number(details.totalMarks);
    if (!details.totalMarks || !Number.isInteger(totalMarks) || totalMarks <= 0)
      errs.totalMarks = 'Total marks must be a positive integer.';
    const duration = Number(details.durationMinutes);
    if (
      !details.durationMinutes ||
      !Number.isInteger(duration) ||
      duration <= 0
    )
      errs.durationMinutes = 'Duration must be a positive integer (minutes).';
    if (!details.negativeMarking) errs.negativeMarking = 'Select yes or no.';
    if (!details.format) errs.format = 'Select the paper format.';

    if (details.negativeMarking === 'yes') {
      const negValue = Number(details.negativeMarkingValue);
      if (
        !details.negativeMarkingValue ||
        !Number.isFinite(negValue) ||
        negValue < 0
      )
        errs.negativeMarkingValue =
          'Enter a non-negative value for negative marking.';
    }

    const passingPct = Number(details.passingPercentage);
    if (
      details.passingPercentage &&
      (!Number.isFinite(passingPct) || passingPct <= 0 || passingPct > 100)
    )
      errs.passingPercentage = 'Passing percentage must be between 1 and 100.';

    const ageRelaxation = Number(details.ageRelaxationYears);
    if (
      details.ageRelaxationYears &&
      (!Number.isInteger(ageRelaxation) || ageRelaxation < 0)
    )
      errs.ageRelaxationYears =
        'Age relaxation must be a non-negative integer.';

    const namedStages = details.selectionProcess.filter((s) => s.title.trim());
    if (namedStages.length === 0)
      errs.selectionProcess = 'Add at least one stage with a title.';

    if (details.sourceUrl.trim() && !isValidUrl(details.sourceUrl.trim()))
      errs.sourceUrl = 'Enter a valid URL (http/https).';
    if (
      details.officialNotificationUrl.trim() &&
      !isValidUrl(details.officialNotificationUrl.trim())
    )
      errs.officialNotificationUrl = 'Enter a valid URL (http/https).';

    setDetailErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const canProceed = (): boolean => {
    if (currentStep === 1) return validateStep1();
    return true;
  };

  const handleNext = () => {
    if (!canProceed()) return;
    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    setCurrentStep((prev) => Math.min(prev + 1, 2) as StepId);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as StepId);
  };

  const handlePublish = async () => {
    if (!validateStep1()) {
      setCurrentStep(1);
      showToast('Please fix the validation errors before publishing.', 'error');
      return;
    }

    const payload: CreateExamPayload = {
      title: details.title.trim(),
      slug: details.slug,
      conductingAuthority: details.conductingAuthority,
      category: details.category as CreateExamPayload['category'],
      province: details.province,
      bpsScale: Number(details.bpsScale),
      departmentName: details.departmentName.trim(),
      eligibility: {
        minAge: Number(details.minAge),
        maxAge: Number(details.maxAge),
        qualificationRequired: details.qualificationRequired.trim(),
        allowedGender:
          details.allowedGender as CreateExamPayload['eligibility']['allowedGender'],
        eligibleDomiciles: details.eligibleDomiciles
          .split(',')
          .map((d) => d.trim())
          .filter(Boolean),
      },
      examPattern: {
        totalMarks: Number(details.totalMarks),
        durationMinutes: Number(details.durationMinutes),
        negativeMarking: details.negativeMarking === 'yes',
        format: details.format as CreateExamPayload['examPattern']['format'],
      },
    };

    if (details.advertisementNumber.trim())
      payload.advertisementNumber = details.advertisementNumber.trim();
    if (details.applicationStartDate)
      payload.applicationStartDate = details.applicationStartDate;
    if (details.applicationDeadline)
      payload.applicationDeadline = details.applicationDeadline;
    if (details.expectedExamDate)
      payload.expectedExamDate = details.expectedExamDate;

    if (details.ageRelaxationYears)
      payload.eligibility.ageRelaxationYears = Number(
        details.ageRelaxationYears
      );
    if (details.minimumGradeOrCgpa.trim())
      payload.eligibility.minimumGradeOrCgpa =
        details.minimumGradeOrCgpa.trim();

    if (details.negativeMarking === 'yes' && details.negativeMarkingValue)
      payload.examPattern.negativeMarkingValue = Number(
        details.negativeMarkingValue
      );
    if (details.passingPercentage)
      payload.examPattern.passingPercentage = Number(details.passingPercentage);

    const stages = details.selectionProcess
      .filter((s) => s.title.trim())
      .map((s) => ({
        stageNumber: s.stageNumber,
        title: s.title.trim(),
        description: s.description.trim() || undefined,
        isEliminationStage: s.isEliminationStage,
      }));
    if (stages.length > 0) payload.selectionProcess = stages;

    if (details.categoryRef.trim())
      payload.categoryRef = details.categoryRef.trim();
    if (details.targetSubjects.length > 0)
      payload.targetSubjects = details.targetSubjects;

    if (details.sourceUrl.trim()) payload.sourceUrl = details.sourceUrl.trim();
    if (details.officialNotificationUrl.trim())
      payload.officialNotificationUrl = details.officialNotificationUrl.trim();

    setPublishing(true);
    try {
      const res = await createExam(payload);
      console.log(res);
      showToast('Exam created and published to catalog.', 'success');
      navigate(ROUTES.ADMIN_EXAMS);
    } catch (err) {
      const apiErr = err as ApiError;
      if (isApiError(apiErr) && apiErr.errors && apiErr.errors.length > 0) {
        const fieldErrors: Record<string, string> = {};
        const messages: string[] = [];
        for (const fe of apiErr.errors) {
          const fieldName = String(fe.path[fe.path.length - 1] ?? fe.field);
          fieldErrors[fieldName] = fe.message;
          messages.push(fe.message);
        }
        setDetailErrors(fieldErrors);
        setCurrentStep(1);
        showToast(
          `Submission rejected (${messages.length} field${
            messages.length === 1 ? '' : 's'
          }): ${messages.join(' • ')}`,
          'error'
        );
      } else {
        showToast(
          err instanceof Error ? err.message : 'Failed to create the exam.',
          'error'
        );
      }
    } finally {
      setPublishing(false);
    }
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
            Set up an exam profile and publish it to the catalog.
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
            subjectOptions={subjectOptions}
            onToggleSubject={handleToggleSubject}
            onAddStage={handleAddStage}
            onRemoveStage={handleRemoveStage}
            onStageChange={handleStageChange}
          />
        )}
        {currentStep === 2 && (
          <ReviewPublishStep
            details={details}
            subjectOptions={subjectOptions}
          />
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

        {currentStep === 2 && (
          <Button
            leftIcon={<Send size={16} />}
            isLoading={publishing}
            className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700"
            onClick={() => void handlePublish()}
          >
            Publish Exam
          </Button>
        )}

        {currentStep < 2 && (
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
  );
}
