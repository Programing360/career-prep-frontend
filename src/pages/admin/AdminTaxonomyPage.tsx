import { useCallback, useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  FolderTree,
  Layers,
  Tag,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getChapters,
  createChapter,
  updateChapter,
  deleteChapter,
  getTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  SUBJECT_CATEGORIES,
  TOPIC_VERBAL_TYPES,
  type SubjectCategory,
  type TopicVerbalType,
  type TaxonomySubject,
  type TaxonomyChapter,
  type TaxonomyTopic,
} from '@/services/taxonomyService';

const CATEGORY_LABELS: Record<SubjectCategory, string> = {
  general: 'General',
  science: 'Science',
  law: 'Law',
  islamic: 'Islamic',
  current_affairs: 'Current Affairs',
  technical: 'Technical',
};

const VERBAL_TYPE_LABELS: Record<TopicVerbalType, string> = {
  verbal: 'Verbal',
  non_verbal: 'Non-Verbal',
  analytical: 'Analytical',
  none: 'None',
};

const categoryOptions = SUBJECT_CATEGORIES.map((value) => ({
  label: CATEGORY_LABELS[value],
  value,
}));

const verbalTypeOptions = TOPIC_VERBAL_TYPES.map((value) => ({
  label: VERBAL_TYPE_LABELS[value],
  value,
}));

type TabKey = 'subjects' | 'chapters' | 'topics';

const TABS: Array<{ key: TabKey; label: string; icon: typeof FolderTree }> = [
  { key: 'subjects', label: 'Subjects', icon: FolderTree },
  { key: 'chapters', label: 'Chapters', icon: Layers },
  { key: 'topics', label: 'Topics', icon: Tag },
];

interface DeleteTarget {
  kind: 'subject' | 'chapter' | 'topic';
  id: string;
  label: string;
}

function ModalShell({
  title,
  subtitle,
  onClose,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] shadow-xl">
        <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] px-6 py-4">
          <div>
            <h2 className="font-semibold font-heading text-[rgb(var(--color-text-primary))]">
              {title}
            </h2>
            {subtitle && <p className="text-xs ">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-[rgb(var(--color-surface-elevated))]"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
        <div className="flex items-center justify-end gap-3 border-t border-[rgb(var(--color-border))] px-6 py-4">
          {footer}
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({
  target,
  isDeleting,
  onCancel,
  onConfirm,
}: {
  target: DeleteTarget;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onCancel}
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
                Delete {target.kind}
              </h2>
              <p className="mt-0.5 text-xs ">This action cannot be undone.</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-[rgb(var(--color-surface-elevated))]"
            aria-label="Close delete dialog"
          >
            <X size={16} />
          </button>
        </div>
        <div className="mt-5 rounded-xl border border-danger-200 bg-danger-50 p-4 dark:border-danger-900 dark:bg-danger-950">
          <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
            Are you sure you want to permanently delete this {target.kind}?
          </p>
          <p className="mt-1 truncate text-sm text-danger-700 dark:text-danger-300">
            {target.label}
          </p>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2 border-t border-[rgb(var(--color-border))] pt-4">
          <Button variant="ghost" disabled={isDeleting} onClick={onCancel}>
            Cancel
          </Button>
          <Button
            leftIcon={<Trash2 size={14} />}
            isLoading={isDeleting}
            className="bg-danger-600 text-white hover:bg-danger-700"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

function PaginationBar({
  page,
  pages,
  total,
  onPageChange,
}: {
  page: number;
  pages: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-[rgb(var(--color-border))] px-4 py-3">
      <p className="text-xs ">
        {total} item{total === 1 ? '' : 's'} · Page {page} of {pages}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

// ==========================================
// SUBJECT MODAL
// ==========================================

interface SubjectModalProps {
  subject: TaxonomySubject | null;
  onClose: () => void;
  onSaved: () => void;
}

function SubjectModal({ subject, onClose, onSaved }: SubjectModalProps) {
  const { showToast } = useToast();
  const [title, setTitle] = useState(subject?.title ?? '');
  const [code, setCode] = useState(subject?.code ?? '');
  const [description, setDescription] = useState(subject?.description ?? '');
  const [category, setCategory] = useState<SubjectCategory>(
    subject?.category ?? 'general'
  );
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (title.trim().length < 2) {
      setError('Subject title must be at least 2 characters.');
      return;
    }
    if (code.trim().length < 2) {
      setError('Subject code must be at least 2 characters.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        code: code.trim(),
        description: description.trim() || undefined,
        category,
      };
      if (subject) {
        await updateSubject(subject._id, payload);
        showToast('Subject updated successfully');
      } else {
        await createSubject(payload);
        showToast('Subject created successfully');
      }
      onSaved();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save the subject.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalShell
      title={subject ? 'Edit Subject' : 'Add Subjects'}
      subtitle="Subjects are the top level of the taxonomy tree."
      onClose={onClose}
      footer={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => void handleSubmit()}
            isLoading={isSubmitting}
          >
            {subject ? 'Save Changes' : 'Create Subject'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Title"
          placeholder="e.g. Pakistan Affairs"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError('');
          }}
        />
        <Input
          label="Code"
          placeholder="e.g. PA-101"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError('');
          }}
        />
        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value as SubjectCategory)}
          options={categoryOptions}
        />
        <Textarea
          label="Description"
          placeholder="Optional short description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        {error && (
          <p className="text-xs font-medium text-danger-500">{error}</p>
        )}
      </div>
    </ModalShell>
  );
}

// ==========================================
// SUBJECTS TAB
// ==========================================

interface SubjectsTabProps {
  onRequestModal: (subject: TaxonomySubject | null) => void;
  onRequestDelete: (target: DeleteTarget) => void;
}

function SubjectsTab({ onRequestModal, onRequestDelete }: SubjectsTabProps) {
  const { showToast } = useToast();
  const [subjects, setSubjects] = useState<TaxonomySubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSubjects({
        search: search.trim() || undefined,
        category: (category as SubjectCategory) || undefined,
        page,
        limit: 50,
      });

      const responseData = Array.isArray(res.data)
        ? res.data
        : ((res.data as { subjects?: TaxonomySubject[] }).subjects ?? []);

      // console.log(res.data);
      setSubjects(responseData);
      setTotal(res.meta.total);
      setPages(res.meta.totalPages);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to load subjects.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [search, category, page, showToast]);

  useEffect(() => {
    const t = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
      <div className="flex flex-col  gap-3 border-b border-[rgb(var(--color-border))] p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 outline-0 ">
          <Search
            size={16}
            className="pointer-events-none  absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400"
          />
          <Input
            className="pl-9 md:w-56 outline-0"
            placeholder="Search by title or code..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          className="bg-white text-black dark:bg-gray-800 dark:text-white outline-0"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          options={[{ label: 'All categories', value: '' }, ...categoryOptions]}
        />
        <Button
          className="w-full"
          leftIcon={<Plus size={16} />}
          onClick={() => onRequestModal(null)}
        >
          Add Subject
        </Button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner size={24} />
        </div>
      ) : subjects.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
          <FolderTree size={28} className="text-secondary-400" />
          <p className="text-sm ">No subjects found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto h-[600px]">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0">
              <tr className="border-b border-[rgb(var(--color-border))] text-xs uppercase tracking-wide bg-purple-400 text-white">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects?.map((subject) => (
                <tr
                  key={subject._id}
                  className="border-b border-[rgb(var(--color-border))] last:border-0 hover:bg-[rgb(var(--color-surface-elevated))]"
                >
                  <td className="px-4 py-3 font-medium text-[rgb(var(--color-text-primary))]">
                    {subject.title}
                  </td>
                  <td className="px-4 py-3 text-[rgb(var(--color-text-secondary))]">
                    {subject.code}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                      {CATEGORY_LABELS[subject.category]}
                    </span>
                  </td>
                  <td className="max-w-[240px] truncate px-4 py-3 text-[rgb(var(--color-text-secondary))]">
                    {subject.description || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Pencil size={14} />}
                        onClick={() => onRequestModal(subject)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-950"
                        leftIcon={<Trash2 size={14} />}
                        onClick={() =>
                          onRequestDelete({
                            kind: 'subject',
                            id: subject._id,
                            label: subject.title as string,
                          })
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PaginationBar
        page={page}
        pages={pages}
        total={total}
        onPageChange={setPage}
      />
    </div>
  );
}

// ==========================================
// CHAPTER MODAL
// ==========================================

interface ChapterModalProps {
  chapter: TaxonomyChapter | null;
  subjects: TaxonomySubject[];
  onClose: () => void;
  onSaved: () => void;
}

function ChapterModal({
  chapter,
  subjects,
  onClose,
  onSaved,
}: ChapterModalProps) {
  const { showToast } = useToast();
  const subjectId = chapter
    ? typeof chapter.subjectId === 'string'
      ? chapter.subjectId
      : (chapter.subjectId?._id ?? '')
    : '';
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjectId);
  const [title, setTitle] = useState(chapter?.title ?? '');
  const [order, setOrder] = useState(chapter?.order?.toString() ?? '1');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedSubjectId) {
      setError('Please select a parent subject.');
      return;
    }
    if (title.trim().length < 2) {
      setError('Chapter title must be at least 2 characters.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      if (chapter) {
        await updateChapter(chapter._id, {
          title: title.trim(),
          order: parseInt(order, 10) || 1,
        });
        showToast('Chapter updated successfully');
      } else {
        await createChapter({
          subjectId: selectedSubjectId,
          title: title.trim(),
          order: parseInt(order, 10) || 1,
        });
        showToast('Chapter created successfully');
      }
      onSaved();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save the chapter.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalShell
      title={chapter ? 'Edit Chapter' : 'Add Chapter'}
      subtitle="Chapters group topics under a subject."
      onClose={onClose}
      footer={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => void handleSubmit()}
            isLoading={isSubmitting}
          >
            {chapter ? 'Save Changes' : 'Create Chapter'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Select
          label="Parent Subject"
          value={selectedSubjectId}
          disabled={Boolean(chapter)}
          onChange={(e) => {
            setSelectedSubjectId(e.target.value);
            setError('');
          }}
          placeholder="Select a subject"
          options={subjects.map((s) => ({
            label: s.title || '',
            value: s._id,
          }))}
        />
        <Input
          label="Title"
          placeholder="e.g. Constitutional History of Pakistan"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError('');
          }}
        />
        <Input
          label="Order"
          type="number"
          min={1}
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        />
        {error && (
          <p className="text-xs font-medium text-danger-500">{error}</p>
        )}
      </div>
    </ModalShell>
  );
}

// ==========================================
// CHAPTERS TAB
// ==========================================

interface ChaptersTabProps {
  subjects: TaxonomySubject[];
  onRequestModal: (chapter: TaxonomyChapter | null) => void;
  onRequestDelete: (target: DeleteTarget) => void;
}

function ChaptersTab({
  subjects,
  onRequestModal,
  onRequestDelete,
}: ChaptersTabProps) {
  const { showToast } = useToast();
  const [chapters, setChapters] = useState<TaxonomyChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // console.log(subjectFilter);

  // if(chapters){
  //   const cap = chapters.filter(sub => sub.subjectId === subjectFilter)
  //   console.log(cap);
  // }

  // const subjectName = (chapter: TaxonomyChapter) =>
  //   typeof chapter.subjectId === 'object' ? chapter.subjectId.title : '—';
  // console.log(chapters, subjects);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getChapters({
        search: search.trim() || undefined,
        subjectId: subjectFilter || undefined,
        page,
        limit: 50,
      });
      // console.log(res.data);
      const responseData = Array.isArray(res.data)
        ? res.data
        : ((res.data as { chapters?: TaxonomyChapter[] }).chapters ?? []);
      setChapters(responseData ?? []);
      setTotal(res.meta.total);
      setPages(res.meta.totalPages);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to load chapters.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [search, subjectFilter, page, showToast]);

  useEffect(() => {
    const t = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
      <div className="flex flex-col gap-3 border-b border-[rgb(var(--color-border))] p-4 lg:flex-row lg:items-center">
        <div className="relative ">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400"
          />
          <Input
            className="pl-9"
            placeholder="Search by chapter title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          className="bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text))] dark:bg-[rgb(var(--color-surface))] dark:text-gray-100 dark:border-[rgb(var(--color-border))]"
          value={subjectFilter}
          onChange={(e) => {
            setSubjectFilter(e.target.value);
            setPage(1);
          }}
          options={[
            { label: 'All subjects', value: '' },
            ...(subjects?.map((s) => ({ label: s.title, value: s._id })) ?? []),
          ]}
        />
        <Button
          className="w-full"
          leftIcon={<Plus size={16} />}
          onClick={() => onRequestModal(null)}
        >
          Add Chapter
        </Button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner size={24} />
        </div>
      ) : chapters.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
          <Layers size={28} className="text-secondary-400" />
          <p className="text-sm ">No chapters found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[rgb(var(--color-border))] text-xs uppercase tracking-wide ">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">chapterNo</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {chapters.map((chapter) => (
                <tr
                  key={chapter._id}
                  className="border-b border-[rgb(var(--color-border))] last:border-0 hover:bg-[rgb(var(--color-surface-elevated))]"
                >
                  <td className="px-4 py-3 font-medium text-[rgb(var(--color-text-primary))]">
                    {chapter.title}
                  </td>
                  <td className="px-4 py-3 text-[rgb(var(--color-text-secondary))]">
                    {/* {subjectName(chapter)} */}
                    {subjects.find(
                      (s) =>
                        s._id ===
                        (typeof chapter.subjectId === 'object'
                          ? chapter.subjectId._id
                          : chapter.subjectId)
                    )?.title || '—'}
                  </td>
                  <td className="px-4 py-3 text-[rgb(var(--color-text-secondary))]">
                    {chapter.order}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Pencil size={14} />}
                        onClick={() => onRequestModal(chapter)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-950"
                        leftIcon={<Trash2 size={14} />}
                        onClick={() =>
                          onRequestDelete({
                            kind: 'chapter',
                            id: chapter._id,
                            label: chapter.title,
                          })
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PaginationBar
        page={page}
        pages={pages}
        total={total}
        onPageChange={setPage}
      />
    </div>
  );
}

// ==========================================
// TOPIC MODAL
// ==========================================

interface TopicModalProps {
  topic: TaxonomyTopic | null;
  subjects: TaxonomySubject[];
  defaultChapterId?: string;
  onClose: () => void;
  onSaved: () => void;
}

function TopicModal({
  topic,
  subjects,
  defaultChapterId,
  onClose,
  onSaved,
}: TopicModalProps) {
  const { showToast } = useToast();
  const [chapters, setChapters] = useState<TaxonomyChapter[]>([]);
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const initialSubjectId = topic
    ? typeof topic.subjectId === 'object'
      ? topic.subjectId?._id
      : ''
    : '';
  const initialChapterId = topic
    ? typeof topic.chapterId === 'object'
      ? topic.chapterId?._id
      : ''
    : (defaultChapterId ?? '');
  const [subjectId, setSubjectId] = useState(initialSubjectId);
  const [chapterId, setChapterId] = useState(initialChapterId);
  const [title, setTitle] = useState(topic?.title ?? '');
  const [description, setDescription] = useState(topic?.description ?? '');
  const [isVerbalOrNonVerbal, setIsVerbalOrNonVerbal] =
    useState<TopicVerbalType>(topic?.isVerbalOrNonVerbal ?? 'none');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadChapters = useCallback(
    async (sid: string, preferredChapterId?: string) => {
      if (!sid) {
        setChapters([]);
        return;
      }
      setChaptersLoading(true);
      try {
        const res = await getChapters({ subjectId: sid, limit: 100 });
        const responseData = Array.isArray(res.data)
          ? res.data
          : ((res.data as { chapters?: TaxonomyChapter[] }).chapters ?? []);
        const list = responseData ?? [];
        setChapters(list);
        setChapterId((prev: string) =>
          preferredChapterId &&
          list.some((c: TaxonomyChapter) => c._id === preferredChapterId)
            ? preferredChapterId
            : prev
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load chapters.'
        );
      } finally {
        setChaptersLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const t = setTimeout(() => {
      if (initialSubjectId) {
        void loadChapters(initialSubjectId, initialChapterId);
      }
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    if (!chapterId) {
      setError('Please select a parent chapter.');
      return;
    }
    if (title.trim().length < 2) {
      setError('Topic title must be at least 2 characters.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      if (topic) {
        await updateTopic(topic._id, {
          title: title.trim(),
          description: description.trim() || undefined,
          isVerbalOrNonVerbal,
        });
        showToast('Topic updated successfully');
      } else {
        await createTopic({
          chapterId,
          title: title.trim(),
          description: description.trim() || undefined,
          isVerbalOrNonVerbal,
        });
        showToast('Topic created successfully');
      }
      onSaved();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save the topic.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalShell
      title={topic ? 'Edit Topic' : 'Add Topic'}
      subtitle="Topics are the leaf level of the taxonomy tree."
      onClose={onClose}
      footer={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => void handleSubmit()}
            isLoading={isSubmitting}
          >
            {topic ? 'Save Changes' : 'Create Topic'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Select
          label="Subject"
          value={subjectId}
          disabled={Boolean(topic)}
          onChange={(e) => {
            setSubjectId(e.target.value);
            setChapterId('');
            setError('');
            void loadChapters(e.target.value);
          }}
          placeholder="Select a subject"
          options={subjects.map((s) => ({ label: s.title, value: s._id }))}
        />
        <Select
          label="Parent Chapter"
          value={chapterId}
          disabled={Boolean(topic) || !subjectId}
          onChange={(e) => {
            setChapterId(e.target.value);
            setError('');
          }}
          placeholder={
            chaptersLoading ? 'Loading chapters...' : 'Select a chapter'
          }
          options={chapters.map((c) => ({ label: c.title, value: c._id }))}
        />
        <Input
          label="Title"
          placeholder="e.g. Objective Resolution 1949"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError('');
          }}
        />
        <Textarea
          label="Description"
          placeholder="Optional short description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <Select
          label="Verbal / Non-Verbal Type"
          className="bg-white text-black dark:bg-gray-800 dark:text-white"
          value={isVerbalOrNonVerbal}
          onChange={(e) =>
            setIsVerbalOrNonVerbal(e.target.value as TopicVerbalType)
          }
          options={verbalTypeOptions}
        />
        {error && (
          <p className="text-xs font-medium text-danger-500">{error}</p>
        )}
      </div>
    </ModalShell>
  );
}

// ==========================================
// TOPICS TAB
// ==========================================

interface TopicsTabProps {
  subjects: TaxonomySubject[];
  onRequestModal: (topic: TaxonomyTopic | null) => void;
  onRequestDelete: (target: DeleteTarget) => void;
}

function TopicsTab({
  subjects,
  onRequestModal,
  onRequestDelete,
}: TopicsTabProps) {
  const { showToast } = useToast();
  const [topics, setTopics] = useState<TaxonomyTopic[]>([]);
  const [chapterOptions, setChapterOptions] = useState<TaxonomyChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [chapterFilter, setChapterFilter] = useState('');
  const [verbalFilter, setVerbalFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  console.log(subjects, topics);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTopics({
        search: search.trim() || undefined,
        subjectId: subjectFilter || undefined,
        chapterId: chapterFilter || undefined,
        isVerbalOrNonVerbal: (verbalFilter as TopicVerbalType) || undefined,
        page,
        limit: 50,
      });

      const responseData = Array.isArray(res.data)
        ? res.data
        : ((res.data as { topics?: TaxonomyTopic[] }).topics ?? []);

      setTopics(responseData ?? []);
      setTotal(res.meta.total);
      setPages(res.meta.totalPages);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to load topics.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [search, subjectFilter, chapterFilter, verbalFilter, page, showToast]);

  useEffect(() => {
    const t = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(t);
  }, [load]);

  useEffect(() => {
    if (!subjectFilter) return;
    let cancelled = false;
    void getChapters({ subjectId: subjectFilter, limit: 100 })
      .then((res) => {
        if (cancelled) return;
        const responseData = Array.isArray(res.data)
          ? res.data
          : ((res.data as { chapters?: TaxonomyChapter[] }).chapters ?? []);
        const list = responseData ?? [];
        // console.log(res);
        setChapterOptions(list);
        setChapterFilter((prev) =>
          prev && list.some((c: TaxonomyChapter) => c._id === prev) ? prev : ''
        );
      })
      .catch(() => {
        if (!cancelled) {
          setChapterOptions([]);
          setChapterFilter('');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [subjectFilter]);

  return (
    <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
      <div className="flex flex-col gap-3 border-b border-[rgb(var(--color-border))] p-4 xl:flex-row xl:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400"
          />
          <Input
            className="pl-9"
            placeholder="Search by topic title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="flex  gap-3">
          <Select
            className=""
            value={subjectFilter}
            onChange={(e) => {
              setSubjectFilter(e.target.value);
              setChapterFilter('');
              setChapterOptions([]);
              setPage(1);
            }}
            options={[
              { label: 'All subjects', value: '' },
              ...subjects.map((s) => ({ label: s.title, value: s._id })),
            ]}
          />
          <Select
            className=""
            value={chapterFilter}
            onChange={(e) => {
              setChapterFilter(e.target.value);
              setPage(1);
            }}
            options={[
              { label: 'All chapters', value: '' },
              ...chapterOptions.map((c) => ({ label: c.title, value: c._id })),
            ]}
          />
          <Select
            className=""
            value={verbalFilter}
            onChange={(e) => {
              setVerbalFilter(e.target.value);
              setPage(1);
            }}
            options={[{ label: 'All types', value: '' }, ...verbalTypeOptions]}
          />
        </div>
        <Button
          leftIcon={<Plus size={16} />}
          onClick={() => onRequestModal(null)}
        >
          Add Topic
        </Button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner size={24} />
        </div>
      ) : topics.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
          <Tag size={28} className="text-secondary-400" />
          <p className="text-sm ">No topics found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[rgb(var(--color-border))] text-xs uppercase tracking-wide ">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Chapter</th>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((topic) => (
                <tr
                  key={topic._id}
                  className="border-b border-[rgb(var(--color-border))] last:border-0 hover:bg-[rgb(var(--color-surface-elevated))]"
                >
                  <td className="px-4 py-3 font-medium text-[rgb(var(--color-text-primary))]">
                    {topic.title}
                  </td>
                  <td className="px-4 py-3 text-[rgb(var(--color-text-secondary))]">
                    {topic.chapterId && typeof topic.chapterId === 'object'
                      ? topic.chapterId.title
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-[rgb(var(--color-text-secondary))]">
                    {topic.subjectId && typeof topic.subjectId === 'object'
                      ? topic.subjectId.title
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        topic.isVerbalOrNonVerbal === 'none'
                          ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                          : 'bg-accent-50 text-accent-700 dark:bg-accent-950 dark:text-accent-300'
                      )}
                    >
                      {VERBAL_TYPE_LABELS[topic.isVerbalOrNonVerbal ?? 'none']}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Pencil size={14} />}
                        onClick={() => onRequestModal(topic)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-950"
                        leftIcon={<Trash2 size={14} />}
                        onClick={() =>
                          onRequestDelete({
                            kind: 'topic',
                            id: topic._id,
                            label: topic.title,
                          })
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PaginationBar
        page={page}
        pages={pages}
        total={total}
        onPageChange={setPage}
      />
    </div>
  );
}

// ==========================================
// PAGE
// ==========================================

export default function AdminTaxonomyPage() {
  const { showToast } = useToast();
  const [tab, setTab] = useState<TabKey>('subjects');
  const [subjects, setSubjects] = useState<TaxonomySubject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);

  // console.log();

  const [subjectModal, setSubjectModal] = useState<{
    open: boolean;
    subject: TaxonomySubject | null;
  }>({ open: false, subject: null });
  const [chapterModal, setChapterModal] = useState<{
    open: boolean;
    chapter: TaxonomyChapter | null;
  }>({ open: false, chapter: null });
  const [topicModal, setTopicModal] = useState<{
    open: boolean;
    topic: TaxonomyTopic | null;
  }>({ open: false, topic: null });
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const loadSubjects = useCallback(async () => {
    setSubjectsLoading(true);
    try {
      const res = await getSubjects({ limit: 100 });

      const responseData = Array.isArray(res.data)
        ? res.data
        : ((res.data as { subjects?: TaxonomySubject[] }).subjects ?? []);

      setSubjects(responseData ?? []);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to load subjects.',
        'error'
      );
    } finally {
      setSubjectsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const t = setTimeout(() => {
      void loadSubjects();
    }, 0);
    return () => clearTimeout(t);
  }, [loadSubjects, reloadKey]);

  const refresh = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      if (deleteTarget.kind === 'subject') {
        await deleteSubject(deleteTarget.id);
        showToast('Subject deleted successfully');
      } else if (deleteTarget.kind === 'chapter') {
        await deleteChapter(deleteTarget.id);
        showToast('Chapter deleted successfully');
      } else {
        await deleteTopic(deleteTarget.id);
        showToast('Topic deleted successfully');
      }
      setDeleteTarget(null);
      refresh();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to delete the item.',
        'error'
      );
    } finally {
      setDeletingId(null);
    }
  }, [deleteTarget, refresh, showToast]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading dark:text-white">
            Syllabus Taxonomy
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Manage subjects, chapters, and topics that power exam syllabi and
            the question bank.
          </p>
        </div>
        <Button
          variant="outline"
          leftIcon={<RefreshCw size={16} />}
          className="bg-white"
          onClick={refresh}
        >
          Refresh
        </Button>
      </div>

      <div className="flex gap-1 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'flex flex-1 items-center justify-center md:gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ',
              tab === key
                ? 'bg-[#7253aa] text-white dark:bg-primary-950 dark:text-primary-300'
                : 'text-[rgb(var(--color-text-secondary))] hover:bg-[#885cda] hover:text-white  '
            )}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {subjectsLoading && tab !== 'subjects' ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner size={24} />
        </div>
      ) : tab === 'subjects' ? (
        <SubjectsTab
          onRequestModal={(subject) => setSubjectModal({ open: true, subject })}
          onRequestDelete={setDeleteTarget}
        />
      ) : tab === 'chapters' ? (
        <ChaptersTab
          subjects={subjects}
          onRequestModal={(chapter) => setChapterModal({ open: true, chapter })}
          onRequestDelete={setDeleteTarget}
        />
      ) : (
        <TopicsTab
          subjects={subjects}
          onRequestModal={(topic) => setTopicModal({ open: true, topic })}
          onRequestDelete={setDeleteTarget}
        />
      )}

      {subjectModal.open && (
        <SubjectModal
          subject={subjectModal.subject}
          onClose={() => setSubjectModal({ open: false, subject: null })}
          onSaved={() => {
            setSubjectModal({ open: false, subject: null });
            refresh();
          }}
        />
      )}

      {chapterModal.open && (
        <ChapterModal
          chapter={chapterModal.chapter}
          subjects={subjects}
          onClose={() => setChapterModal({ open: false, chapter: null })}
          onSaved={() => {
            setChapterModal({ open: false, chapter: null });
            refresh();
          }}
        />
      )}

      {topicModal.open && (
        <TopicModal
          topic={topicModal.topic}
          subjects={subjects}
          onClose={() => setTopicModal({ open: false, topic: null })}
          onSaved={() => {
            setTopicModal({ open: false, topic: null });
            refresh();
          }}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          target={deleteTarget}
          isDeleting={deletingId === deleteTarget.id}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => void confirmDelete()}
        />
      )}
    </div>
  );
}
