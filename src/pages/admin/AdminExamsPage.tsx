import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Pencil,
  Trash2,
  Clock,
  BookOpen,
  Coins,
  CheckCircle,
  FileEdit,
  Search,
  Filter,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';

type ExamStatus = 'active' | 'draft';

interface AdminExam {
  id: string;
  title: string;
  subject: string;
  duration: number;
  totalQuestions: number;
  requiredTokens: number;
  passingScore: number;
  status: ExamStatus;
}

interface QuestionOption {
  label: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  subject: string;
  topic: string;
  options: QuestionOption[];
  correctOption: string;
  explanation: string;
}

const mockExams: AdminExam[] = [
  {
    id: 'e1',
    title: 'CSS General Knowledge Paper-I',
    subject: 'General Knowledge',
    duration: 120,
    totalQuestions: 100,
    requiredTokens: 50,
    passingScore: 60,
    status: 'active',
  },
  {
    id: 'e2',
    title: 'PCS English Essay & Composition',
    subject: 'English',
    duration: 180,
    totalQuestions: 50,
    requiredTokens: 75,
    passingScore: 50,
    status: 'active',
  },
  {
    id: 'e3',
    title: 'FPSC Intelligence Test',
    subject: 'Analytical Reasoning',
    duration: 90,
    totalQuestions: 80,
    requiredTokens: 30,
    passingScore: 65,
    status: 'draft',
  },
  {
    id: 'e4',
    title: 'PPSC Islamic Studies',
    subject: 'Islamic Studies',
    duration: 60,
    totalQuestions: 60,
    requiredTokens: 25,
    passingScore: 55,
    status: 'active',
  },
  {
    id: 'e5',
    title: 'NTS Quantitative Reasoning',
    subject: 'Mathematics',
    duration: 45,
    totalQuestions: 40,
    requiredTokens: 20,
    passingScore: 70,
    status: 'draft',
  },
];

const mockQuestions: Question[] = [
  {
    id: 'q1',
    text: 'Which Article of the Constitution of Pakistan guarantees freedom of speech?',
    subject: 'Constitutional Law',
    topic: 'Fundamental Rights',
    options: [
      { label: 'A', text: 'Article 15' },
      { label: 'B', text: 'Article 19' },
      { label: 'C', text: 'Article 25' },
      { label: 'D', text: 'Article 8' },
    ],
    correctOption: 'B',
    explanation:
      'Article 19 of the Constitution of Pakistan, 1973 guarantees freedom of speech, subject to reasonable restrictions imposed by law.',
  },
  {
    id: 'q2',
    text: 'What is the chemical formula for common table salt?',
    subject: 'General Science',
    topic: 'Chemistry',
    options: [
      { label: 'A', text: 'NaCl' },
      { label: 'B', text: 'KCl' },
      { label: 'C', text: 'CaCl₂' },
      { label: 'D', text: 'MgCl₂' },
    ],
    correctOption: 'A',
    explanation:
      'Common table salt is Sodium Chloride (NaCl), composed of sodium cations and chloride anions.',
  },
  {
    id: 'q3',
    text: 'The Treaty of Tordesillas was signed between which two countries?',
    subject: 'World History',
    topic: 'Medieval History',
    options: [
      { label: 'A', text: 'Spain and France' },
      { label: 'B', text: 'Portugal and Spain' },
      { label: 'C', text: 'England and Portugal' },
      { label: 'D', text: 'France and England' },
    ],
    correctOption: 'B',
    explanation:
      'The Treaty of Tordesillas (1494) was signed between Spain and Portugal, dividing newly discovered lands outside Europe.',
  },
  {
    id: 'q4',
    text: 'In SQL, which keyword is used to remove duplicate rows from a query result?',
    subject: 'Computer Science',
    topic: 'Database Management',
    options: [
      { label: 'A', text: 'UNIQUE' },
      { label: 'B', text: 'DISTINCT' },
      { label: 'C', text: 'REMOVE' },
      { label: 'D', text: 'GROUP BY' },
    ],
    correctOption: 'B',
    explanation:
      'The DISTINCT keyword in SQL is used to return only distinct (different) values, effectively removing duplicate rows.',
  },
  {
    id: 'q5',
    text: 'Which of the following is NOT a member of the Gulf Cooperation Council (GCC)?',
    subject: 'International Relations',
    topic: 'Regional Organizations',
    options: [
      { label: 'A', text: 'Kuwait' },
      { label: 'B', text: 'Oman' },
      { label: 'C', text: 'Iraq' },
      { label: 'D', text: 'Qatar' },
    ],
    correctOption: 'C',
    explanation:
      'Iraq is not a member of the GCC. The GCC comprises Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, and Oman.',
  },
  {
    id: 'q6',
    text: 'What is the derivative of sin(x) with respect to x?',
    subject: 'Mathematics',
    topic: 'Calculus',
    options: [
      { label: 'A', text: '-cos(x)' },
      { label: 'B', text: 'cos(x)' },
      { label: 'C', text: 'tan(x)' },
      { label: 'D', text: 'sin(x)' },
    ],
    correctOption: 'B',
    explanation:
      'The derivative of sin(x) is cos(x). This is a fundamental result in differential calculus.',
  },
  {
    id: 'q7',
    text: 'Who authored the book "The Republic"?',
    subject: 'Philosophy',
    topic: 'Western Philosophy',
    options: [
      { label: 'A', text: 'Aristotle' },
      { label: 'B', text: 'Socrates' },
      { label: 'C', text: 'Plato' },
      { label: 'D', text: 'Immanuel Kant' },
    ],
    correctOption: 'C',
    explanation:
      'Plato authored "The Republic" (Greek: Politeia), one of the most influential works of philosophy and political theory.',
  },
];

const subjectOptions = [
  { label: 'All Subjects', value: 'all' },
  { label: 'Constitutional Law', value: 'Constitutional Law' },
  { label: 'General Science', value: 'General Science' },
  { label: 'World History', value: 'World History' },
  { label: 'Computer Science', value: 'Computer Science' },
  { label: 'International Relations', value: 'International Relations' },
  { label: 'Mathematics', value: 'Mathematics' },
  { label: 'Philosophy', value: 'Philosophy' },
];

const examSubjectOptions = [
  { label: 'General Knowledge', value: 'General Knowledge' },
  { label: 'English', value: 'English' },
  { label: 'Analytical Reasoning', value: 'Analytical Reasoning' },
  { label: 'Islamic Studies', value: 'Islamic Studies' },
  { label: 'Mathematics', value: 'Mathematics' },
  { label: 'Computer Science', value: 'Computer Science' },
  { label: 'Constitutional Law', value: 'Constitutional Law' },
];

function StatusBadge({ status }: { status: ExamStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
        status === 'active'
          ? 'bg-accent-50 text-accent-700 dark:bg-accent-950 dark:text-accent-300'
          : 'bg-secondary-100 text-secondary-600 dark:bg-secondary-800 dark:text-secondary-300'
      )}
    >
      {status === 'active' ? <CheckCircle size={12} /> : <FileEdit size={12} />}
      {status === 'active' ? 'Active' : 'Draft'}
    </span>
  );
}

interface ExamModalProps {
  exam: AdminExam | null;
  onClose: () => void;
  onSave: (exam: AdminExam) => void;
}

function ExamModal({ exam, onClose, onSave }: ExamModalProps) {
  const [title, setTitle] = useState(exam?.title ?? '');
  const [subject, setSubject] = useState(exam?.subject ?? '');
  const [duration, setDuration] = useState(exam?.duration?.toString() ?? '');
  const [passingScore, setPassingScore] = useState(
    exam?.passingScore?.toString() ?? ''
  );
  const [requiredTokens, setRequiredTokens] = useState(
    exam?.requiredTokens?.toString() ?? ''
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!exam;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Exam title is required.';
    if (!subject) errs.subject = 'Select a subject.';
    if (!duration || parseInt(duration) <= 0)
      errs.duration = 'Enter a valid time limit.';
    if (
      !passingScore ||
      parseInt(passingScore) <= 0 ||
      parseInt(passingScore) > 100
    )
      errs.passingScore = 'Enter a valid percentage (1–100).';
    if (!requiredTokens || parseInt(requiredTokens) < 0)
      errs.requiredTokens = 'Enter valid token amount.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      id: exam?.id ?? `e${Date.now()}`,
      title: title.trim(),
      subject,
      duration: parseInt(duration),
      totalQuestions: exam?.totalQuestions ?? 0,
      requiredTokens: parseInt(requiredTokens),
      passingScore: parseInt(passingScore),
      status: exam?.status ?? 'draft',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] shadow-xl">
        <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] px-6 py-4">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-primary-500" />
            <h2 className="font-semibold font-heading text-[rgb(var(--color-text-primary))]">
              {isEditing ? 'Edit Exam' : 'Create New Exam'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-[rgb(var(--color-surface-elevated))]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <Input
            label="Exam Title"
            required
            placeholder="e.g. CSS General Knowledge Paper-I"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors((p) => ({ ...p, title: '' }));
            }}
            error={errors.title}
          />

          <Select
            label="Subject"
            required
            options={examSubjectOptions}
            placeholder="Select subject"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setErrors((p) => ({ ...p, subject: '' }));
            }}
            error={errors.subject}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Time Limit (mins)"
              required
              type="number"
              placeholder="e.g. 120"
              value={duration}
              onChange={(e) => {
                setDuration(e.target.value);
                setErrors((p) => ({ ...p, duration: '' }));
              }}
              error={errors.duration}
            />

            <Input
              label="Passing Score (%)"
              required
              type="number"
              placeholder="e.g. 60"
              value={passingScore}
              onChange={(e) => {
                setPassingScore(e.target.value);
                setErrors((p) => ({ ...p, passingScore: '' }));
              }}
              error={errors.passingScore}
            />
          </div>

          <Input
            label="Required Tokens to Unlock"
            required
            type="number"
            placeholder="e.g. 50"
            leftIcon={<Coins size={16} className="text-primary-500" />}
            value={requiredTokens}
            onChange={(e) => {
              setRequiredTokens(e.target.value);
              setErrors((p) => ({ ...p, requiredTokens: '' }));
            }}
            error={errors.requiredTokens}
          />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[rgb(var(--color-border))] px-6 py-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700"
            onClick={handleSubmit}
          >
            {isEditing ? 'Save Changes' : 'Create Exam'}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface QuestionModalProps {
  onClose: () => void;
  onSave: (question: Question) => void;
}

function QuestionModal({ onClose, onSave }: QuestionModalProps) {
  const [text, setText] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctOption, setCorrectOption] = useState('');
  const [explanation, setExplanation] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!text.trim()) errs.text = 'Question text is required.';
    if (!subject) errs.subject = 'Select a subject.';
    if (!topic.trim()) errs.topic = 'Topic is required.';
    if (!optionA.trim()) errs.optionA = 'Option A is required.';
    if (!optionB.trim()) errs.optionB = 'Option B is required.';
    if (!optionC.trim()) errs.optionC = 'Option C is required.';
    if (!optionD.trim()) errs.optionD = 'Option D is required.';
    if (!correctOption) errs.correctOption = 'Select the correct option.';
    if (!explanation.trim()) errs.explanation = 'Explanation is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      id: `q${Date.now()}`,
      text: text.trim(),
      subject,
      topic: topic.trim(),
      options: [
        { label: 'A', text: optionA.trim() },
        { label: 'B', text: optionB.trim() },
        { label: 'C', text: optionC.trim() },
        { label: 'D', text: optionD.trim() },
      ],
      correctOption,
      explanation: explanation.trim(),
    });
    onClose();
  };

  const correctOptions = [
    { label: 'A', value: 'A' },
    { label: 'B', value: 'B' },
    { label: 'C', value: 'C' },
    { label: 'D', value: 'D' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] shadow-xl">
        <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] px-6 py-4">
          <div className="flex items-center gap-2">
            <Plus size={18} className="text-primary-500" />
            <h2 className="font-semibold font-heading text-[rgb(var(--color-text-primary))]">
              Add New Question
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-[rgb(var(--color-surface-elevated))]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <Textarea
            label="Question Text"
            required
            placeholder="Enter the question text..."
            rows={3}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setErrors((p) => ({ ...p, text: '' }));
            }}
            error={errors.text}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Subject"
              required
              options={examSubjectOptions}
              placeholder="Select subject"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setErrors((p) => ({ ...p, subject: '' }));
              }}
              error={errors.subject}
            />

            <Input
              label="Topic"
              required
              placeholder="e.g. Fundamental Rights"
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                setErrors((p) => ({ ...p, topic: '' }));
              }}
              error={errors.topic}
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
              Options
            </p>

            {[
              {
                label: 'A',
                value: optionA,
                setter: setOptionA,
                errKey: 'optionA',
              },
              {
                label: 'B',
                value: optionB,
                setter: setOptionB,
                errKey: 'optionB',
              },
              {
                label: 'C',
                value: optionC,
                setter: setOptionC,
                errKey: 'optionC',
              },
              {
                label: 'D',
                value: optionD,
                setter: setOptionD,
                errKey: 'optionD',
              },
            ].map((opt) => (
              <div key={opt.label} className="flex items-start gap-3">
                <span className="mt-2.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary-100 text-xs font-bold text-secondary-600 dark:bg-secondary-800 dark:text-secondary-300">
                  {opt.label}
                </span>
                <div className="flex-1">
                  <Input
                    placeholder={`Option ${opt.label}`}
                    value={opt.value}
                    onChange={(e) => {
                      opt.setter(e.target.value);
                      setErrors((p) => ({ ...p, [opt.errKey]: '' }));
                    }}
                    error={errors[opt.errKey]}
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-[rgb(var(--color-text-primary))]">
              Correct Option
            </p>
            <div className="flex gap-3">
              {correctOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setCorrectOption(opt.value);
                    setErrors((p) => ({ ...p, correctOption: '' }));
                  }}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg border-2 text-sm font-bold transition-colors',
                    correctOption === opt.value
                      ? 'border-accent-500 bg-accent-50 text-accent-700 dark:bg-accent-950 dark:text-accent-300'
                      : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-text-secondary))] hover:border-[rgb(var(--color-border-hover))]'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {errors.correctOption && (
              <p className="mt-1 text-xs text-danger-500">
                {errors.correctOption}
              </p>
            )}
          </div>

          <Textarea
            label="AI Explanation / Rationale"
            required
            placeholder="Provide an explanation for the correct answer..."
            rows={3}
            value={explanation}
            onChange={(e) => {
              setExplanation(e.target.value);
              setErrors((p) => ({ ...p, explanation: '' }));
            }}
            error={errors.explanation}
          />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[rgb(var(--color-border))] px-6 py-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700"
            onClick={handleSubmit}
          >
            Add Question
          </Button>
        </div>
      </div>
    </div>
  );
}

type TabId = 'exams' | 'questions';

export default function AdminExamsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('exams');

  const [exams, setExams] = useState<AdminExam[]>(mockExams);
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);

  const [examSearch, setExamSearch] = useState('');
  const [questionSearch, setQuestionSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');

  const [examModalOpen, setExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<AdminExam | null>(null);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);

  const filteredExams = useMemo(() => {
    return exams.filter((e) => {
      if (!examSearch) return true;
      const q = examSearch.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) || e.subject.toLowerCase().includes(q)
      );
    });
  }, [exams, examSearch]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch =
        !questionSearch ||
        q.text.toLowerCase().includes(questionSearch.toLowerCase());
      const matchesSubject =
        subjectFilter === 'all' || q.subject === subjectFilter;
      const matchesTopic = topicFilter === 'all' || q.topic === topicFilter;
      return matchesSearch && matchesSubject && matchesTopic;
    });
  }, [questions, questionSearch, subjectFilter, topicFilter]);

  const uniqueTopics = useMemo(() => {
    const topics = new Set(mockQuestions.map((q) => q.topic));
    return [
      { label: 'All Topics', value: 'all' },
      ...Array.from(topics).map((t) => ({ label: t, value: t })),
    ];
  }, []);

  const handleSaveExam = useCallback((exam: AdminExam) => {
    setExams((prev) => {
      const idx = prev.findIndex((e) => e.id === exam.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = exam;
        return next;
      }
      return [...prev, exam];
    });
  }, []);

  const handleDeleteExam = useCallback((examId: string) => {
    setExams((prev) => prev.filter((e) => e.id !== examId));
  }, []);

  const handleToggleStatus = useCallback((examId: string) => {
    setExams((prev) =>
      prev.map((e) =>
        e.id === examId
          ? { ...e, status: e.status === 'active' ? 'draft' : 'active' }
          : e
      )
    );
  }, []);

  const handleSaveQuestion = useCallback((question: Question) => {
    setQuestions((prev) => [...prev, question]);
  }, []);

  const handleDeleteQuestion = useCallback((questionId: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  }, []);

  const tabs: { id: TabId; label: string }[] = [
    { id: 'exams', label: 'Exams Management' },
    { id: 'questions', label: 'Question Bank' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
          Exam & Question Management
        </h1>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Create, edit, and manage exams and their question banks.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          size="sm"
          leftIcon={<Plus size={16} />}
          className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700"
          onClick={() => navigate(ROUTES.ADMIN_EXAMS_NEW)}
        >
          Create New Exam
        </Button>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<Plus size={16} />}
          onClick={() => setQuestionModalOpen(true)}
        >
          Add New Question
        </Button>
      </div>

      <div className="border-b border-[rgb(var(--color-border))]">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'relative pb-3 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text-secondary))]'
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary-500" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'exams' && (
        <div className="space-y-4">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400"
            />
            <input
              type="text"
              placeholder="Search exams by title or subject..."
              value={examSearch}
              onChange={(e) => setExamSearch(e.target.value)}
              className="h-10 w-full rounded-md border border-[rgb(var(--color-border))] bg-transparent pl-9 pr-3 text-sm text-[rgb(var(--color-text-primary))] placeholder:text-secondary-400 transition-colors hover:border-[rgb(var(--color-border-hover))] focus-ring"
            />
          </div>

          <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgb(var(--color-border))]">
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                      Exam Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                      Total Questions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                      Tokens
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
                  {filteredExams.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-12 text-center text-sm text-[rgb(var(--color-text-muted))]"
                      >
                        No exams found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredExams.map((exam) => (
                      <tr
                        key={exam.id}
                        className="transition-colors hover:bg-[rgb(var(--color-surface-elevated))]"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                            {exam.title}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-[rgb(var(--color-text-secondary))]">
                          {exam.subject}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="inline-flex items-center gap-1 text-sm text-[rgb(var(--color-text-secondary))]">
                            <Clock
                              size={14}
                              className="text-[rgb(var(--color-text-muted))]"
                            />
                            {exam.duration} min
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-[rgb(var(--color-text-primary))]">
                          {exam.totalQuestions}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-500">
                            <Coins size={14} />
                            {exam.requiredTokens}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <StatusBadge status={exam.status} />
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setEditingExam(exam);
                                setExamModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary-500 transition-colors hover:bg-primary-50 dark:hover:bg-primary-950"
                              title="Edit Exam"
                            >
                              <Pencil size={14} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleToggleStatus(exam.id)}
                              className={cn(
                                'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors',
                                exam.status === 'active'
                                  ? 'text-secondary-500 hover:bg-secondary-50 dark:hover:bg-secondary-900'
                                  : 'text-accent-500 hover:bg-accent-50 dark:hover:bg-accent-950'
                              )}
                              title={
                                exam.status === 'active'
                                  ? 'Set to Draft'
                                  : 'Publish'
                              }
                            >
                              <FileEdit size={14} />
                              {exam.status === 'active' ? 'Draft' : 'Publish'}
                            </button>
                            <button
                              onClick={() => handleDeleteExam(exam.id)}
                              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-danger-500 transition-colors hover:bg-danger-50 dark:hover:bg-danger-950"
                              title="Delete Exam"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-[rgb(var(--color-border))] px-6 py-3">
              <p className="text-xs text-[rgb(var(--color-text-muted))]">
                Showing {filteredExams.length} of {exams.length} exams
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400"
              />
              <input
                type="text"
                placeholder="Search questions..."
                value={questionSearch}
                onChange={(e) => setQuestionSearch(e.target.value)}
                className="h-10 w-full rounded-md border border-[rgb(var(--color-border))] bg-transparent pl-9 pr-3 text-sm text-[rgb(var(--color-text-primary))] placeholder:text-secondary-400 transition-colors hover:border-[rgb(var(--color-border-hover))] focus-ring"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter
                size={16}
                className="text-[rgb(var(--color-text-muted))]"
              />
              <Select
                options={subjectOptions}
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="h-10 w-auto min-w-[150px]"
              />
              <Select
                options={uniqueTopics}
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className="h-10 w-auto min-w-[150px]"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredQuestions.length === 0 ? (
              <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-6 py-12 text-center text-sm text-[rgb(var(--color-text-muted))]">
                No questions found matching your filters.
              </div>
            ) : (
              filteredQuestions.map((question) => (
                <div
                  key={question.id}
                  className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5 transition-colors hover:border-[rgb(var(--color-border-hover))]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                          {question.subject}
                        </span>
                        <span className="rounded-md bg-secondary-100 px-2 py-0.5 text-xs font-medium text-secondary-600 dark:bg-secondary-800 dark:text-secondary-300">
                          {question.topic}
                        </span>
                      </div>

                      <p className="text-sm font-medium leading-relaxed text-[rgb(var(--color-text-primary))]">
                        {question.text}
                      </p>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {question.options.map((opt) => (
                          <div
                            key={opt.label}
                            className={cn(
                              'flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm',
                              opt.label === question.correctOption
                                ? 'border-accent-300 bg-accent-50 text-accent-800 dark:border-accent-700 dark:bg-accent-950 dark:text-accent-200'
                                : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-text-secondary))]'
                            )}
                          >
                            <span
                              className={cn(
                                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                                opt.label === question.correctOption
                                  ? 'bg-accent-500 text-white'
                                  : 'bg-secondary-100 text-secondary-600 dark:bg-secondary-800 dark:text-secondary-300'
                              )}
                            >
                              {opt.label}
                            </span>
                            <span>{opt.text}</span>
                            {opt.label === question.correctOption && (
                              <CheckCircle
                                size={14}
                                className="ml-auto shrink-0 text-accent-500"
                              />
                            )}
                          </div>
                        ))}
                      </div>

                      {question.explanation && (
                        <div className="rounded-lg bg-secondary-50 px-3 py-2 text-xs leading-relaxed text-[rgb(var(--color-text-secondary))] dark:bg-secondary-900/50">
                          <span className="font-semibold text-[rgb(var(--color-text-primary))]">
                            Explanation:
                          </span>{' '}
                          {question.explanation}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="shrink-0 rounded-md p-1.5 text-[rgb(var(--color-text-muted))] transition-colors hover:bg-danger-50 hover:text-danger-500 dark:hover:bg-danger-950"
                      title="Delete Question"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-[rgb(var(--color-text-muted))]">
              Showing {filteredQuestions.length} of {questions.length} questions
            </p>
          </div>
        </div>
      )}

      {examModalOpen && (
        <ExamModal
          exam={editingExam}
          onClose={() => {
            setExamModalOpen(false);
            setEditingExam(null);
          }}
          onSave={handleSaveExam}
        />
      )}

      {questionModalOpen && (
        <QuestionModal
          onClose={() => setQuestionModalOpen(false)}
          onSave={handleSaveQuestion}
        />
      )}
    </div>
  );
}
