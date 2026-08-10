import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  Target,
  Filter,
  Search,
  ChevronRight,
  Trophy,
  AlertTriangle,
  Play,
  CheckCircle2,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import type { ExamCategory } from '@/types';

interface ExamCard {
  id: string;
  title: string;
  category: ExamCategory;
  subject: string;
  duration: number;
  totalQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  totalMarks: number;
  passingMarks: number;
  isFollowed: boolean;
  attemptCount?: number;
  lastScore?: number;
}

const mockExams: ExamCard[] = [
  {
    id: 'css-prelim-2026',
    title: 'CSS Preliminary 2026',
    category: 'css',
    subject: 'General Knowledge',
    duration: 120,
    totalQuestions: 200,
    difficulty: 'hard',
    totalMarks: 200,
    passingMarks: 100,
    isFollowed: true,
    attemptCount: 3,
    lastScore: 72,
  },
  {
    id: 'gk-speed-test',
    title: 'GK Speed Test',
    category: 'nts',
    subject: 'General Knowledge',
    duration: 30,
    totalQuestions: 50,
    difficulty: 'medium',
    totalMarks: 50,
    passingMarks: 25,
    isFollowed: false,
    attemptCount: 5,
    lastScore: 82,
  },
  {
    id: 'verbal-reasoning-mock',
    title: 'Verbal Reasoning Mock',
    category: 'fpsc',
    subject: 'Verbal Reasoning',
    duration: 45,
    totalQuestions: 60,
    difficulty: 'medium',
    totalMarks: 60,
    passingMarks: 30,
    isFollowed: true,
    attemptCount: 2,
    lastScore: 68,
  },
  {
    id: 'english-essay-precis',
    title: 'English Essay & Precis',
    category: 'css',
    subject: 'English',
    duration: 60,
    totalQuestions: 80,
    difficulty: 'hard',
    totalMarks: 100,
    passingMarks: 50,
    isFollowed: false,
  },
  {
    id: 'pakistan-affairs-full',
    title: 'Pakistan Affairs Full Test',
    category: 'css',
    subject: 'Pakistan Affairs',
    duration: 90,
    totalQuestions: 100,
    difficulty: 'hard',
    totalMarks: 100,
    passingMarks: 50,
    isFollowed: true,
    attemptCount: 1,
    lastScore: 58,
  },
  {
    id: 'ppsc-general',
    title: 'PPSC General Knowledge',
    category: 'ppsc',
    subject: 'General Knowledge',
    duration: 60,
    totalQuestions: 80,
    difficulty: 'medium',
    totalMarks: 80,
    passingMarks: 40,
    isFollowed: false,
  },
  {
    id: 'non-verbal-iq',
    title: 'Non-Verbal & IQ Test',
    category: 'fpsc',
    subject: 'Non-Verbal',
    duration: 40,
    totalQuestions: 50,
    difficulty: 'easy',
    totalMarks: 50,
    passingMarks: 25,
    isFollowed: false,
    attemptCount: 4,
    lastScore: 91,
  },
  {
    id: 'everyday-science',
    title: 'Everyday Science MCQs',
    category: 'nts',
    subject: 'Everyday Science',
    duration: 30,
    totalQuestions: 40,
    difficulty: 'easy',
    totalMarks: 40,
    passingMarks: 20,
    isFollowed: false,
  },
  {
    id: 'css-english-grammar',
    title: 'CSS English Grammar',
    category: 'css',
    subject: 'English',
    duration: 45,
    totalQuestions: 60,
    difficulty: 'medium',
    totalMarks: 60,
    passingMarks: 30,
    isFollowed: false,
  },
];

const categories: { id: ExamCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Exams' },
  { id: 'css', label: 'CSS' },
  { id: 'fpsc', label: 'FPSC' },
  { id: 'ppsc', label: 'PPSC' },
  { id: 'nts', label: 'NTS' },
  { id: 'pcs', label: 'PCS' },
];

const difficulties: { id: string; label: string }[] = [
  { id: 'all', label: 'All Levels' },
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
];

const difficultyConfig: Record<string, { color: string; icon: typeof Target }> =
  {
    easy: {
      color:
        'bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300',
      icon: Target,
    },
    medium: {
      color:
        'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
      icon: AlertTriangle,
    },
    hard: {
      color:
        'bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300',
      icon: AlertTriangle,
    },
  };

const categoryColors: Record<ExamCategory, string> = {
  css: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
  fpsc: 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
  ppsc: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
  nts: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
  pcs: 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300',
  other:
    'bg-secondary-100 text-secondary-700 dark:bg-secondary-900 dark:text-secondary-300',
};

export default function ExamsPage() {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const initialCategory =
    (searchParams.get('category') as ExamCategory | 'all') || 'all';
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    ExamCategory | 'all'
  >(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const filtered = useMemo(() => {
    return mockExams.filter((exam) => {
      const matchesSearch =
        search === '' ||
        exam.title.toLowerCase().includes(search.toLowerCase()) ||
        exam.subject.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || exam.category === selectedCategory;
      const matchesDifficulty =
        selectedDifficulty === 'all' || exam.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [search, selectedCategory, selectedDifficulty]);

  const followedCount = mockExams.filter((e) => e.isFollowed).length;
  const attemptedCount = mockExams.filter((e) => e.attemptCount).length;

  function getStartLink(exam: ExamCard): string {
    if (isAuthenticated) {
      return ROUTES.EXAM_ATTEMPT.replace(':id', exam.id);
    }
    return ROUTES.EXAM_DETAIL.replace(':slug', exam.id);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
            My Exams
          </h1>
          <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
            {mockExams.length} exams available middot; {followedCount} followed
            middot; {attemptedCount} attempted
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))]"
          />
          <input
            type="text"
            placeholder="Search exams by title or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] py-2.5 pl-10 pr-4 text-sm text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-muted))] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 py-2">
            <Filter size={14} className="text-[rgb(var(--color-text-muted))]" />
            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value as ExamCategory | 'all')
              }
              className="bg-transparent text-sm text-[rgb(var(--color-text-primary))] focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 py-2">
            <Target size={14} className="text-[rgb(var(--color-text-muted))]" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-transparent text-sm text-[rgb(var(--color-text-primary))] focus:outline-none"
            >
              {difficulties.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] py-16">
          <BookOpen
            size={40}
            className="text-[rgb(var(--color-text-muted))] opacity-40"
          />
          <p className="mt-4 text-lg font-semibold text-[rgb(var(--color-text-primary))]">
            No exams found
          </p>
          <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((exam) => {
            const DiffIcon = difficultyConfig[exam.difficulty].icon;
            const diffColor = difficultyConfig[exam.difficulty].color;
            const catColor = categoryColors[exam.category];
            const startLink = getStartLink(exam);

            return (
              <div
                key={exam.id}
                className={cn(
                  'group flex flex-col rounded-xl border bg-[rgb(var(--color-surface))] transition-all hover:shadow-md',
                  exam.isFollowed
                    ? 'border-primary-200 dark:border-primary-800'
                    : 'border-[rgb(var(--color-border))]'
                )}
              >
                <div className="flex items-start justify-between p-5 pb-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                        catColor
                      )}
                    >
                      {exam.category}
                    </span>
                    <span
                      className={cn(
                        'flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                        diffColor
                      )}
                    >
                      <DiffIcon size={10} />
                      {exam.difficulty}
                    </span>
                  </div>
                  {exam.isFollowed && (
                    <Star
                      size={16}
                      className="fill-primary-400 text-primary-400"
                    />
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5 pt-3">
                  <h3 className="text-base font-bold font-heading text-[rgb(var(--color-text-primary))]">
                    {exam.title}
                  </h3>
                  <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
                    {exam.subject}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-1.5">
                      <Clock
                        size={12}
                        className="text-[rgb(var(--color-text-muted))]"
                      />
                      <span className="text-xs text-[rgb(var(--color-text-secondary))]">
                        {exam.duration} min
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Target
                        size={12}
                        className="text-[rgb(var(--color-text-muted))]"
                      />
                      <span className="text-xs text-[rgb(var(--color-text-secondary))]">
                        {exam.totalQuestions} MCQs
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Trophy
                        size={12}
                        className="text-[rgb(var(--color-text-muted))]"
                      />
                      <span className="text-xs text-[rgb(var(--color-text-secondary))]">
                        {exam.totalMarks} marks
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2
                        size={12}
                        className="text-[rgb(var(--color-text-muted))]"
                      />
                      <span className="text-xs text-[rgb(var(--color-text-secondary))]">
                        Pass: {exam.passingMarks}
                      </span>
                    </div>
                  </div>

                  {exam.attemptCount !== undefined &&
                    exam.lastScore !== undefined && (
                      <div className="mt-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] px-3 py-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-[rgb(var(--color-text-muted))]">
                            Last attempt
                          </span>
                          <span
                            className={cn(
                              'text-xs font-bold',
                              exam.lastScore >= exam.passingMarks
                                ? 'text-accent-600 dark:text-accent-400'
                                : 'text-danger-600 dark:text-danger-400'
                            )}
                          >
                            {exam.lastScore}%
                          </span>
                        </div>
                        <p className="text-[10px] text-[rgb(var(--color-text-muted))]">
                          {exam.attemptCount} attempt
                          {exam.attemptCount > 1 ? 's' : ''}
                        </p>
                      </div>
                    )}

                  <div className="mt-auto pt-4">
                    <Link to={startLink} className="block">
                      <Button
                        fullWidth
                        variant={exam.isFollowed ? 'primary' : 'outline'}
                        leftIcon={<Play size={14} />}
                        rightIcon={<ChevronRight size={14} />}
                      >
                        {exam.attemptCount ? 'Retake Test' : 'Start Test'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
