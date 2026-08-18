import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Trash2,
  X,
  BookOpen,
  Map,
  FileText,
  Link2,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Spinner } from '@/components/ui/Spinner';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import {
  getPublicExams,
  getExamSyllabus,
  publishSyllabusVersion,
  publishExamRoadmap,
  type ExamSyllabusData,
} from '@/services/examService';
import {
  getSubjects,
  getTopics,
  type TaxonomySubject,
  type TaxonomyTopic,
} from '@/services/taxonomyService';
import type { DirectoryExam } from '@/types';

let idCounter = 0;
const nextId = () => `row-${++idCounter}`;

interface SubjectRow {
  id: string;
  subjectId: string;
  isCompulsory: boolean;
  marks: string;
  weightagePercentage: string;
  customNotes: string;
}

interface StandardRow {
  id: string;
  gender: string;
  minHeightInches: string;
  chestUnexpandedInches: string;
  chestExpandedInches: string;
  runningTestRequirement: string;
}

interface PhaseRow {
  id: string;
  title: string;
  durationWeeks: string;
  weeklyStrategyNotes: string;
  targetSubjectIds: string[];
  highPriorityTopics: string[];
}

type PageTab = 'syllabus' | 'roadmap';

function emptySubjectRow(): SubjectRow {
  return {
    id: nextId(),
    subjectId: '',
    isCompulsory: true,
    marks: '',
    weightagePercentage: '',
    customNotes: '',
  };
}

function emptyStandardRow(): StandardRow {
  return {
    id: nextId(),
    gender: 'male',
    minHeightInches: '',
    chestUnexpandedInches: '',
    chestExpandedInches: '',
    runningTestRequirement: '',
  };
}

function emptyPhaseRow(): PhaseRow {
  return {
    id: nextId(),
    title: '',
    durationWeeks: '',
    weeklyStrategyNotes: '',
    targetSubjectIds: [],
    highPriorityTopics: [],
  };
}

// ==========================================
// SYLLABUS FORM
// ==========================================

interface SyllabusFormProps {
  exam: DirectoryExam;
  subjects: TaxonomySubject[];
  currentSyllabus: ExamSyllabusData | null;
  loadingSyllabus: boolean;
  onPublished: (syllabusId: string) => void;
}

function SyllabusForm({
  exam,
  subjects,
  currentSyllabus,
  loadingSyllabus,
  onPublished,
}: SyllabusFormProps) {
  const { showToast } = useToast();
  const [effectiveFrom, setEffectiveFrom] = useState('');
  const [totalPapers, setTotalPapers] = useState('1');
  const [sourceDocumentUrl, setSourceDocumentUrl] = useState('');
  const [subjectRows, setSubjectRows] = useState<SubjectRow[]>([
    emptySubjectRow(),
  ]);
  const [standardRows, setStandardRows] = useState<StandardRow[]>([]);
  const [showStandards, setShowStandards] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateSubjectRow = (id: string, patch: Partial<SubjectRow>) => {
    setSubjectRows((rows) =>
      rows.map((row) => (row.id === id ? { ...row, ...patch } : row))
    );
  };

  const updateStandardRow = (id: string, patch: Partial<StandardRow>) => {
    setStandardRows((rows) =>
      rows.map((row) => (row.id === id ? { ...row, ...patch } : row))
    );
  };

  const handleSubmit = async () => {
    if (!effectiveFrom) {
      setError('An effective date is required.');
      return;
    }
    if (!totalPapers || parseInt(totalPapers, 10) <= 0) {
      setError('Total papers must be greater than 0.');
      return;
    }
    if (
      !sourceDocumentUrl.trim() ||
      !/^https?:\/\/.+/i.test(sourceDocumentUrl.trim())
    ) {
      setError('A valid source document URL is required.');
      return;
    }
    if (subjectRows.length === 0 || subjectRows.some((row) => !row.subjectId)) {
      setError('Add at least one subject with a selected subject.');
      return;
    }
    for (const row of subjectRows) {
      if (!row.marks || parseFloat(row.marks) <= 0) {
        setError('Every subject row needs marks greater than 0.');
        return;
      }
      if (
        row.weightagePercentage === '' ||
        parseFloat(row.weightagePercentage) < 0 ||
        parseFloat(row.weightagePercentage) > 100
      ) {
        setError('Weightage must be between 0 and 100 for every subject.');
        return;
      }
    }

    setError('');
    setIsSubmitting(true);
    try {
      const res = await publishSyllabusVersion(exam._id, {
        effectiveFrom: new Date(`${effectiveFrom}T00:00:00.000Z`).toISOString(),
        totalPapers: parseInt(totalPapers, 10),
        sourceDocumentUrl: sourceDocumentUrl.trim(),
        subjectsBreakdown: subjectRows.map((row) => ({
          subjectId: row.subjectId,
          isCompulsory: row.isCompulsory,
          marks: parseFloat(row.marks),
          weightagePercentage: parseFloat(row.weightagePercentage),
          customNotes: row.customNotes.trim() || undefined,
        })),
        physicalStandards:
          showStandards && standardRows.length > 0
            ? standardRows
                .filter((row) => row.minHeightInches)
                .map((row) => ({
                  gender: row.gender as 'male' | 'female' | 'other',
                  minHeightInches: parseFloat(row.minHeightInches),
                  chestUnexpandedInches: row.chestUnexpandedInches
                    ? parseFloat(row.chestUnexpandedInches)
                    : undefined,
                  chestExpandedInches: row.chestExpandedInches
                    ? parseFloat(row.chestExpandedInches)
                    : undefined,
                  runningTestRequirement:
                    row.runningTestRequirement.trim() || undefined,
                }))
            : undefined,
      });
      showToast(
        `Syllabus version ${res.data.syllabusVersion} published successfully`
      );
      onPublished(res.data._id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to publish the syllabus.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {loadingSyllabus ? (
        <div className="flex h-32 items-center justify-center">
          <Spinner size={24} />
        </div>
      ) : currentSyllabus ? (
        <div className="rounded-xl border border-accent-200 bg-accent-50 p-4 dark:border-accent-900 dark:bg-accent-950">
          <div className="flex items-center gap-2">
            <CheckCircle2
              size={16}
              className="text-accent-600 dark:text-accent-400"
            />
            <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
              Active syllabus published
            </h3>
          </div>
          <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
            Version {currentSyllabus.syllabusVersion} ·{' '}
            {currentSyllabus.totalPapers} paper
            {currentSyllabus.totalPapers === 1 ? '' : 's'} ·{' '}
            {currentSyllabus.subjectsBreakdown.length} subject
            {currentSyllabus.subjectsBreakdown.length === 1 ? '' : 's'} ·
            effective{' '}
            {new Date(currentSyllabus.effectiveFrom).toLocaleDateString(
              'en-US',
              {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }
            )}
          </p>
          <p className="mt-2 text-xs text-[rgb(var(--color-text-muted))]">
            Publishing a new version will replace this one as the active
            syllabus for {exam.title}.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <p className="text-sm text-[rgb(var(--color-text-muted))]">
            No syllabus published for this exam yet. Publish the first version
            below.
          </p>
        </div>
      )}

      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
        <div className="flex items-center gap-2 border-b border-[rgb(var(--color-border))] px-5 py-4">
          <FileText size={16} className="text-primary-500" />
          <h3 className="font-semibold font-heading text-[rgb(var(--color-text-primary))]">
            Publish New Syllabus Version
          </h3>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Effective From"
              type="date"
              value={effectiveFrom}
              onChange={(e) => {
                setEffectiveFrom(e.target.value);
                setError('');
              }}
            />
            <Input
              label="Total Papers"
              type="number"
              min={1}
              value={totalPapers}
              onChange={(e) => setTotalPapers(e.target.value)}
            />
            <Input
              label="Source Document URL"
              type="url"
              placeholder="https://example.com/official-syllabus.pdf"
              value={sourceDocumentUrl}
              onChange={(e) => {
                setSourceDocumentUrl(e.target.value);
                setError('');
              }}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                Subjects Breakdown
              </h4>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Plus size={14} />}
                onClick={() =>
                  setSubjectRows((rows) => [...rows, emptySubjectRow()])
                }
              >
                Add Subject
              </Button>
            </div>

            {subjectRows.map((row, index) => (
              <div
                key={row.id}
                className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-muted))]">
                    Subject #{index + 1}
                  </p>
                  <button
                    onClick={() =>
                      setSubjectRows((rows) =>
                        rows.filter((r) => r.id !== row.id)
                      )
                    }
                    disabled={subjectRows.length === 1}
                    className="rounded-md p-1 text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-danger-50 hover:text-danger-600 disabled:opacity-40 dark:hover:bg-danger-950"
                    aria-label="Remove subject row"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  <Select
                    className="lg:col-span-2 bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text))] dark:bg-[rgb(var(--color-surface))] dark:text-gray-100 dark:border-[rgb(var(--color-border))]"

                    label="Subject"
                    value={row.subjectId}
                    onChange={(e) =>
                      updateSubjectRow(row.id, { subjectId: e.target.value })
                    }
                    placeholder="Select a subject"
                    options={subjects.map((s) => ({
                      label: `${s.title} (${s.code})`,
                      value: s._id,
                    }))}
                  />
                  <Input
                    label="Marks"
                    type="number"
                    className="bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text))] dark:bg-[rgb(var(--color-surface))] dark:text-gray-100 dark:border-[rgb(var(--color-border))]"
                    min={0}
                    value={row.marks}
                    onChange={(e) =>
                      updateSubjectRow(row.id, { marks: e.target.value })
                    }
                  />
                  <Input
                    label="Weightage %"
                    type="number"
                    className="bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text))] dark:bg-[rgb(var(--color-surface))] dark:text-gray-100 dark:border-[rgb(var(--color-border))]"
                    min={0}
                    max={100}
                    value={row.weightagePercentage}
                    onChange={(e) =>
                      updateSubjectRow(row.id, {
                        weightagePercentage: e.target.value,
                      })
                    }
                  />
                  <div className="flex items-end pb-2">
                    <Switch
                      label="Compulsory"
                      checked={row.isCompulsory}
                      onChange={(e) =>
                        updateSubjectRow(row.id, {
                          isCompulsory: e.target.checked,
                        })
                      }
                    />
                  </div>
                </div>
                <Input
                  className="mt-3 bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text))] dark:bg-[rgb(var(--color-surface))] dark:text-gray-100 dark:border-[rgb(var(--color-border))]"
                  label="Custom Notes"
                  placeholder="Optional notes for this subject (e.g. focus areas)"
                  value={row.customNotes}
                  onChange={(e) =>
                    updateSubjectRow(row.id, { customNotes: e.target.value })
                  }
                />
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                  Physical Standards
                </h4>
                <p className="text-xs text-[rgb(var(--color-text-muted))]">
                  Optional — used by armed forces, police, and rangers exams.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={showStandards ? <X size={14} /> : <Plus size={14} />}
                onClick={() => {
                  if (!showStandards) {
                    setStandardRows([emptyStandardRow()]);
                  }
                  setShowStandards((v) => !v);
                }}
              >
                {showStandards ? 'Remove Section' : 'Add Section'}
              </Button>
            </div>

            {showStandards &&
              standardRows.map((row, index) => (
                <div
                  key={row.id}
                  className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-muted))]">
                      Standard #{index + 1}
                    </p>
                    <button
                      onClick={() =>
                        setStandardRows((rows) =>
                          rows.filter((r) => r.id !== row.id)
                        )
                      }
                      className="rounded-md p-1 text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-danger-50 hover:text-danger-600 dark:hover:bg-danger-950"
                      aria-label="Remove standard row"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 dark:text-black">
                    <Select
                      label="Gender"
                      className="bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text))] dark:bg-[rgb(var(--color-surface))] dark:text-gray-100 dark:border-[rgb(var(--color-border))]"
                      value={row.gender}
                      onChange={(e) =>
                        updateStandardRow(row.id, { gender: e.target.value })
                      }
                      options={[
                        { label: 'Male', value: 'male' },
                        { label: 'Female', value: 'female' },
                        { label: 'Other', value: 'other' },
                      ]}
                    />
                    <Input
                      label="Min Height (in)"
                      type="number"
                      className="bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text))] dark:bg-[rgb(var(--color-surface))] dark:text-gray-100 dark:border-[rgb(var(--color-border))]"
                      min={0}
                      value={row.minHeightInches}
                      onChange={(e) =>
                        updateStandardRow(row.id, {
                          minHeightInches: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Chest Unexpanded (in)"
                      type="number"
                      className="bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text))] dark:bg-[rgb(var(--color-surface))] dark:text-gray-100 dark:border-[rgb(var(--color-border))]"
                      min={0}
                      value={row.chestUnexpandedInches}
                      onChange={(e) =>
                        updateStandardRow(row.id, {
                          chestUnexpandedInches: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Chest Expanded (in)"
                      type="number"
                      className="bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text))] dark:bg-[rgb(var(--color-surface))] dark:text-gray-100 dark:border-[rgb(var(--color-border))]"
                      min={0}
                      value={row.chestExpandedInches}
                      onChange={(e) =>
                        updateStandardRow(row.id, {
                          chestExpandedInches: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Running Test"
                      className="bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text))] dark:bg-[rgb(var(--color-surface))] dark:text-gray-100 dark:border-[rgb(var(--color-border))]"
                      placeholder="e.g. 1.6 km in 8 minutes"
                      value={row.runningTestRequirement}
                      onChange={(e) =>
                        updateStandardRow(row.id, {
                          runningTestRequirement: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              ))}
          </div>

          {error && (
            <p className="rounded-lg border border-danger-200 bg-danger-50 px-3 py-2 text-xs font-medium text-danger-700 dark:border-danger-900 dark:bg-danger-950 dark:text-danger-300">
              {error}
            </p>
          )}

          <div className="flex justify-end border-t border-[rgb(var(--color-border))] pt-4">
            <Button
              leftIcon={<FileText size={14} />}
              isLoading={isSubmitting}
              onClick={() => void handleSubmit()}
            >
              Publish Syllabus
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ROADMAP FORM
// ==========================================

interface RoadmapFormProps {
  exam: DirectoryExam;
  subjects: TaxonomySubject[];
  topics: TaxonomyTopic[];
  syllabusOptions: Array<{ label: string; value: string }>;
  prefillSyllabusId?: string;
}

function RoadmapForm({
  exam,
  subjects,
  topics,
  syllabusOptions,
  prefillSyllabusId,
}: RoadmapFormProps) {
  const { showToast } = useToast();
  const [syllabusVersionId, setSyllabusVersionId] = useState(
    prefillSyllabusId ?? ''
  );
  const [title, setTitle] = useState('');
  const [overallStrategySummary, setOverallStrategySummary] = useState('');
  const [totalEstimatedWeeks, setTotalEstimatedWeeks] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [phases, setPhases] = useState<PhaseRow[]>([emptyPhaseRow()]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updatePhaseRow = (id: string, patch: Partial<PhaseRow>) => {
    setPhases((rows) =>
      rows.map((row) => (row.id === id ? { ...row, ...patch } : row))
    );
  };

  const subjectOptions = subjects.map((s) => ({
    label: s.title,
    value: s._id,
  }));
  const topicOptions = topics.map((t) => ({
    label: `${t.title}${typeof t.subjectId === 'object' ? ` · ${t.subjectId.title}` : ''}`,
    value: t._id,
  }));

  const handleSubmit = async () => {
    if (!syllabusVersionId) {
      setError('Select the syllabus version this roadmap is based on.');
      return;
    }
    if (title.trim().length < 5) {
      setError('Roadmap title must be at least 5 characters.');
      return;
    }
    if (overallStrategySummary.trim().length < 20) {
      setError('Overall strategy summary must be at least 20 characters.');
      return;
    }
    if (!totalEstimatedWeeks || parseInt(totalEstimatedWeeks, 10) <= 0) {
      setError('Total estimated weeks must be greater than 0.');
      return;
    }
    if (phases.length === 0) {
      setError('Add at least one phase to the roadmap.');
      return;
    }
    for (const phase of phases) {
      if (phase.title.trim().length < 3) {
        setError('Every phase needs a title (min 3 characters).');
        return;
      }
      if (!phase.durationWeeks || parseInt(phase.durationWeeks, 10) <= 0) {
        setError('Every phase needs a positive duration in weeks.');
        return;
      }
      if (phase.weeklyStrategyNotes.trim().length < 10) {
        setError('Weekly strategy notes must be at least 10 characters.');
        return;
      }
    }

    setError('');
    setIsSubmitting(true);
    try {
      const res = await publishExamRoadmap(exam._id, {
        syllabusVersionId,
        title: title.trim(),
        overallStrategySummary: overallStrategySummary.trim(),
        totalEstimatedWeeks: parseInt(totalEstimatedWeeks, 10),
        isPublished,
        phases: phases.map((phase, index) => ({
          phaseNumber: index + 1,
          title: phase.title.trim(),
          durationWeeks: parseInt(phase.durationWeeks, 10),
          weeklyStrategyNotes: phase.weeklyStrategyNotes.trim(),
          targetSubjectIds: phase.targetSubjectIds,
          highPriorityTopics: phase.highPriorityTopics,
        })),
      });
      showToast(`Roadmap "${res.data.title}" published successfully`);
      setTitle('');
      setOverallStrategySummary('');
      setTotalEstimatedWeeks('');
      setPhases([emptyPhaseRow()]);
      setError('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to publish the roadmap.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
        <div className="flex items-center gap-2 border-b border-[rgb(var(--color-border))] px-5 py-4">
          <Map size={16} className="text-primary-500" />
          <h3 className="font-semibold font-heading text-[rgb(var(--color-text-primary))]">
            Publish Preparation Roadmap
          </h3>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Syllabus Version"
              value={syllabusVersionId}
              onChange={(e) => {
                setSyllabusVersionId(e.target.value);
                setError('');
              }}
              placeholder="Select a syllabus version"
              options={syllabusOptions}
            />
            <Input
              label="Total Estimated Weeks"
              type="number"
              min={1}
              value={totalEstimatedWeeks}
              onChange={(e) => setTotalEstimatedWeeks(e.target.value)}
            />
          </div>

          <Input
            label="Roadmap Title"
            placeholder="e.g. 12-Week PMA Long Course Preparation Strategy"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError('');
            }}
          />

          <Textarea
            label="Overall Strategy Summary"
            placeholder="Summarize the overall preparation approach (min 20 characters)..."
            value={overallStrategySummary}
            onChange={(e) => {
              setOverallStrategySummary(e.target.value);
              setError('');
            }}
            rows={3}
          />

          <div className="flex items-center justify-between rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] px-4 py-3">
            <div>
              <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                Publish immediately
              </p>
              <p className="text-xs text-[rgb(var(--color-text-muted))]">
                Unpublished roadmaps are not shown on the public exam page.
              </p>
            </div>
            <Switch
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                  Phases
                </h4>
                <p className="text-xs text-[rgb(var(--color-text-muted))]">
                  Structured weekly breakdown of the preparation plan.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Plus size={14} />}
                onClick={() => setPhases((rows) => [...rows, emptyPhaseRow()])}
              >
                Add Phase
              </Button>
            </div>

            {phases.map((phase, index) => (
              <div
                key={phase.id}
                className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-muted))]">
                    Phase {index + 1}
                  </p>
                  <button
                    onClick={() =>
                      setPhases((rows) => rows.filter((r) => r.id !== phase.id))
                    }
                    disabled={phases.length === 1}
                    className="rounded-md p-1 text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-danger-50 hover:text-danger-600 disabled:opacity-40 dark:hover:bg-danger-950"
                    aria-label="Remove phase"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label="Phase Title"
                    placeholder="e.g. Foundation: Core Concepts"
                    value={phase.title}
                    onChange={(e) =>
                      updatePhaseRow(phase.id, { title: e.target.value })
                    }
                  />
                  <Input
                    label="Duration (weeks)"
                    type="number"
                    min={1}
                    value={phase.durationWeeks}
                    onChange={(e) =>
                      updatePhaseRow(phase.id, {
                        durationWeeks: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                  <MultiSelect
                    label="Target Subjects"
                    options={subjectOptions}
                    value={phase.targetSubjectIds}
                    onChange={(value) =>
                      updatePhaseRow(phase.id, { targetSubjectIds: value })
                    }
                    placeholder="Select subjects..."
                  />
                  <MultiSelect
                    label="High Priority Topics"
                    options={topicOptions}
                    value={phase.highPriorityTopics}
                    onChange={(value) =>
                      updatePhaseRow(phase.id, { highPriorityTopics: value })
                    }
                    placeholder="Select topics..."
                  />
                </div>

                <Textarea
                  className="mt-3"
                  label="Weekly Strategy Notes"
                  placeholder="Describe what the candidate should do each week (min 10 characters)..."
                  value={phase.weeklyStrategyNotes}
                  onChange={(e) =>
                    updatePhaseRow(phase.id, {
                      weeklyStrategyNotes: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
            ))}
          </div>

          {error && (
            <p className="rounded-lg border border-danger-200 bg-danger-50 px-3 py-2 text-xs font-medium text-danger-700 dark:border-danger-900 dark:bg-danger-950 dark:text-danger-300">
              {error}
            </p>
          )}

          <div className="flex justify-end border-t border-[rgb(var(--color-border))] pt-4">
            <Button
              leftIcon={<Map size={14} />}
              isLoading={isSubmitting}
              onClick={() => void handleSubmit()}
            >
              Publish Roadmap
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// PAGE
// ==========================================

export default function AdminSyllabusPage() {
  const [tab, setTab] = useState<PageTab>('syllabus');
  const [exams, setExams] = useState<DirectoryExam[]>([]);
  const [examsLoading, setExamsLoading] = useState(true);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [subjects, setSubjects] = useState<TaxonomySubject[]>([]);
  const [topics, setTopics] = useState<TaxonomyTopic[]>([]);
  const [currentSyllabus, setCurrentSyllabus] =
    useState<ExamSyllabusData | null>(null);
  const [loadingSyllabus, setLoadingSyllabus] = useState(false);
  const [prefillSyllabusId, setPrefillSyllabusId] = useState<
    string | undefined
  >(undefined);

  const selectedExam = useMemo(
    () => exams.find((exam) => exam._id === selectedExamId) ?? null,
    [exams, selectedExamId]
  );

  const loadReferences = useCallback(async () => {
    try {
      const [examRes, subjectRes, topicRes] = await Promise.allSettled([
        getPublicExams({ limit: 100 }),
        getSubjects({ limit: 100 }),
        getTopics({ limit: 100 }),
      ]);
      if (examRes.status === 'fulfilled') {
        setExams(examRes.value.data);
      }
      if (subjectRes.status === 'fulfilled') {
        setSubjects(subjectRes.value.data.subjects ?? []);
      }
      if (topicRes.status === 'fulfilled') {
        setTopics(topicRes.value.data.topics ?? []);
      }
    } finally {
      setExamsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReferences();
  }, [loadReferences]);

  const loadCurrentSyllabus = useCallback(async (exam: DirectoryExam) => {
    setLoadingSyllabus(true);
    try {
      const res = await getExamSyllabus(exam.slug);
      setCurrentSyllabus(res.data.syllabus);
    } catch {
      setCurrentSyllabus(null);
    } finally {
      setLoadingSyllabus(false);
    }
  }, []);

  const handleExamChange = useCallback(
    (examId: string) => {
      setSelectedExamId(examId);
      setTab('syllabus');
      setPrefillSyllabusId(undefined);
      const exam = exams.find((e) => e._id === examId);
      if (exam) {
        void loadCurrentSyllabus(exam);
      } else {
        setCurrentSyllabus(null);
      }
    },
    [exams, loadCurrentSyllabus]
  );

  const handlePublished = useCallback(
    (syllabusId: string) => {
      setPrefillSyllabusId(syllabusId);
      setTab('roadmap');
      if (selectedExam) {
        void loadCurrentSyllabus(selectedExam);
      }
    },
    [selectedExam, loadCurrentSyllabus]
  );

  const syllabusOptions = useMemo(() => {
    const options: Array<{ label: string; value: string }> = [];
    if (currentSyllabus?._id) {
      options.push({
        label: `Version ${currentSyllabus.syllabusVersion} (active, effective ${new Date(
          currentSyllabus.effectiveFrom
        ).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })})`,
        value: currentSyllabus._id,
      });
    }
    if (prefillSyllabusId && prefillSyllabusId !== currentSyllabus?._id) {
      options.push({
        label: 'Version just published',
        value: prefillSyllabusId,
      });
    }
    return options;
  }, [currentSyllabus, prefillSyllabusId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
            Syllabus &amp; Roadmap Publisher
          </h1>
          <p className="mt-1 text-sm text-[rgb(var(--color-text-muted))]">
            Publish official syllabus versions and preparation roadmaps per
            exam.
          </p>
        </div>
        <Button
          variant="outline"
          leftIcon={<RefreshCw size={16} />}
          onClick={() => void loadReferences()}
        >
          Refresh
        </Button>
      </div>

      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
        <label className="mb-1.5 block text-sm font-medium text-[rgb(var(--color-text-primary))]">
          Select Exam
        </label>
        {examsLoading ? (
          <div className="flex h-10 items-center">
            <Spinner size={20} />
          </div>
        ) : (
          <Select
            value={selectedExamId}
            onChange={(e) => handleExamChange(e.target.value)}
            placeholder="Choose an exam to manage"
            options={exams.map((exam) => ({
              label: exam.title,
              value: exam._id,
            }))}
          />
        )}
      </div>

      {selectedExam ? (
        <>
          <div className="flex flex-col gap-2 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-950">
                <BookOpen size={18} className="text-primary-500" />
              </div>
              <div>
                <p className="font-semibold text-[rgb(var(--color-text-primary))]">
                  {selectedExam.title}
                </p>
                <p className="text-xs text-[rgb(var(--color-text-muted))]">
                  {selectedExam.conductingAuthority} · {selectedExam.category}
                </p>
              </div>
            </div>
            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-accent-50 px-2.5 py-1 text-xs font-medium text-accent-700 dark:bg-accent-950 dark:text-accent-300">
              <Link2 size={12} />
              {selectedExam.slug}
            </span>
          </div>

          <div className="flex gap-1 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-1">
            {(
              [
                { key: 'syllabus', label: 'Syllabus', icon: FileText },
                { key: 'roadmap', label: 'Roadmap', icon: Map },
              ] as const
            ).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                  tab === key
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
                    : 'text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-elevated))]'
                )}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          {tab === 'syllabus' ? (
            <SyllabusForm
              key={selectedExam._id}
              exam={selectedExam}
              subjects={subjects}
              currentSyllabus={currentSyllabus}
              loadingSyllabus={loadingSyllabus}
              onPublished={handlePublished}
            />
          ) : (
            <RoadmapForm
              key={selectedExam._id}
              exam={selectedExam}
              subjects={subjects}
              topics={topics}
              syllabusOptions={syllabusOptions}
              prefillSyllabusId={prefillSyllabusId}
            />
          )}
        </>
      ) : (
        <div className="flex h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[rgb(var(--color-border))]">
          <Map size={32} className="text-secondary-400" />
          <p className="text-sm text-[rgb(var(--color-text-muted))]">
            Select an exam above to start publishing its syllabus and roadmap.
          </p>
        </div>
      )}
    </div>
  );
}
