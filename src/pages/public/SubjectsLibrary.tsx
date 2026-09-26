import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { useLenis } from 'lenis/react';
import {
  ChevronRight,
  BookOpen,
  Globe,
  Languages,
  Calculator,
  Landmark,
  Atom,
  Brain,
  Computer,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  AlertCircle,
  FileQuestion,
  Search,
  Filter,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { MCQPracticeContainer } from '@/components/mcq/MCQPracticeContainer';
import { getSubjects, type TaxonomySubject } from '@/services/taxonomyService';
import StudentLottie from '../../assets/STUDENT.svg';

const CATEGORY_CONFIG: Record<
  string,
  { icon: typeof BookOpen; color: string }
> = {
  general: {
    icon: Globe,
    color:
      'from-purple-500/10 via-purple-500/5 to-transparent border-purple-200/60 dark:border-purple-800/40',
  },
  general_knowledge: {
    icon: Globe,
    color:
      'from-purple-500/10 via-purple-500/5 to-transparent border-purple-200/60 dark:border-purple-800/40',
  },
  science: {
    icon: Atom,
    color:
      'from-pink-500/10 via-pink-500/5 to-transparent border-pink-200/60 dark:border-pink-800/40',
  },
  law: {
    icon: Landmark,
    color:
      'from-indigo-500/10 via-indigo-500/5 to-transparent border-indigo-200/60 dark:border-indigo-800/40',
  },
  islamic: {
    icon: BookOpen,
    color:
      'from-violet-500/10 via-violet-500/5 to-transparent border-violet-200/60 dark:border-violet-800/40',
  },
  current_affairs: {
    icon: Globe,
    color:
      'from-fuchsia-500/10 via-fuchsia-500/5 to-transparent border-fuchsia-200/60 dark:border-fuchsia-800/40',
  },
  technical: {
    icon: Computer,
    color:
      'from-cyan-500/10 via-cyan-500/5 to-transparent border-cyan-200/60 dark:border-cyan-800/40',
  },
  math: {
    icon: Calculator,
    color:
      'from-violet-500/10 via-violet-500/5 to-transparent border-violet-200/60 dark:border-violet-800/40',
  },
  english: {
    icon: Languages,
    color:
      'from-fuchsia-500/10 via-fuchsia-500/5 to-transparent border-fuchsia-200/60 dark:border-fuchsia-800/40',
  },
  reasoning: {
    icon: Brain,
    color:
      'from-purple-500/10 via-purple-500/5 to-transparent border-purple-200/60 dark:border-purple-800/40',
  },
};

const CATEGORY_OPTIONS = [
  { label: 'All Categories', value: 'all' },
  { label: 'General Knowledge', value: 'general' },
  { label: 'Science', value: 'science' },
  { label: 'Law & Governance', value: 'law' },
  { label: 'Islamic Studies', value: 'islamic' },
  { label: 'Current Affairs', value: 'current_affairs' },
  { label: 'Technical / IT', value: 'technical' },
];

function getSubjectVisuals(subject: TaxonomySubject) {
  const catKey = (subject.category || '').toLowerCase();
  const codeKey = (subject.code || '').toLowerCase();

  if (CATEGORY_CONFIG[catKey]) return CATEGORY_CONFIG[catKey];
  if (CATEGORY_CONFIG[codeKey]) return CATEGORY_CONFIG[codeKey];

  const titleLower = (subject.title || '').toLowerCase();
  if (titleLower.includes('english') || titleLower.includes('grammar'))
    return CATEGORY_CONFIG.english;
  if (titleLower.includes('math') || titleLower.includes('algebra'))
    return CATEGORY_CONFIG.math;
  if (titleLower.includes('computer') || titleLower.includes('tech'))
    return CATEGORY_CONFIG.technical;
  if (titleLower.includes('islam')) return CATEGORY_CONFIG.islamic;
  if (titleLower.includes('pakistan') || titleLower.includes('affair'))
    return CATEGORY_CONFIG.law;
  if (titleLower.includes('science') || titleLower.includes('physics'))
    return CATEGORY_CONFIG.science;
  if (titleLower.includes('reasoning') || titleLower.includes('logic'))
    return CATEGORY_CONFIG.reasoning;

  return {
    icon: BookOpen,
    color:
      'from-purple-500/10 via-purple-500/5 to-transparent border-purple-200/60 dark:border-purple-800/40',
  };
}

const DIFFICULTIES = [
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' },
] as const;

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.05, ease: 'easeOut' },
  }),
};

const chipVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.15, delay: i * 0.03 },
  }),
};

const glassHeader =
  'backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-b border-white/40 dark:border-purple-500/20 shadow-lg shadow-purple-950/5';

export default function SubjectsLibrary() {
  const [subjects, setSubjects] = useState<TaxonomySubject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Selected Subject for MCQ Practice
  const [selectedSubject, setSelectedSubject] =
    useState<TaxonomySubject | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    string | undefined
  >(undefined);

  const lenis = useLenis();

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSubjects({ limit: 100 });
      setSubjects(response.data || []);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load subjects from database'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSubjects();
  }, [fetchSubjects]);

  // Client-side instant filtering based on search query & category filter
  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      // 1. Category match
      const matchesCategory =
        selectedCategory === 'all' ||
        (subject.category || '').toLowerCase() ===
          selectedCategory.toLowerCase();

      // 2. Search query match (against title, code, description, category)
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (subject.title || '').toLowerCase().includes(q) ||
        (subject.code || '').toLowerCase().includes(q) ||
        (subject.description || '').toLowerCase().includes(q) ||
        (subject.category || '').toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [subjects, selectedCategory, searchQuery]);

  const handleSelectSubject = useCallback(
    (subject: TaxonomySubject) => {
      setSelectedSubject(subject);
      setSelectedDifficulty(undefined);
      if (lenis) {
        lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [lenis]
  );

  const handleBack = useCallback(() => {
    setSelectedSubject(null);
    setSelectedDifficulty(undefined);
  }, []);

  const handleDifficultyChange = useCallback(
    (difficulty: string | undefined) => {
      setSelectedDifficulty(difficulty);
    },
    []
  );

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
  }, []);

  if (selectedSubject) {
    const visuals = getSubjectVisuals(selectedSubject);
    const SubjectIcon = visuals.icon;
    return (
      <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors">
        {/* Background Ambient Orbs */}
        <div className="pointer-events-none absolute -top-10 -left-10 h-96 w-96 rounded-full bg-purple-600/15 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-fuchsia-600/15 blur-3xl" />

        <section className={`relative ${glassHeader}`}>
          <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Link
                  to={ROUTES.SUBJECTS}
                  onClick={handleBack}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Subjects
                </Link>
                <ChevronRight size={12} />
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {selectedSubject.title}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-2xl border bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md',
                    visuals.color
                  )}
                >
                  <SubjectIcon
                    size={24}
                    className="text-purple-600 dark:text-purple-400"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                    {selectedSubject.title}
                  </h1>
                  <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
                    {selectedSubject.description ||
                      `${selectedSubject.title} study material and practice questions.`}
                  </p>
                </div>
              </div>

              <button
                onClick={handleBack}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
              >
                <ArrowLeft size={16} />
                Back to all subjects
              </button>
            </motion.div>
          </div>
        </section>

        <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Difficulty Filter Chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="mb-6 rounded-2xl border border-white/50 dark:border-purple-500/20 bg-white/40 dark:bg-slate-900/40 p-4 backdrop-blur-xl shadow-lg"
          >
            <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <Sparkles size={12} /> Difficulty Level
            </p>
            <div className="flex flex-wrap gap-2">
              <motion.button
                custom={0}
                variants={chipVariants}
                initial="hidden"
                animate="show"
                type="button"
                onClick={() => handleDifficultyChange(undefined)}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all focus-ring',
                  !selectedDifficulty
                    ? 'border-purple-500 bg-purple-600 text-white shadow-md shadow-purple-500/20 dark:bg-purple-500'
                    : 'border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-700'
                )}
              >
                All Levels
              </motion.button>
              {DIFFICULTIES.map((diff, i) => {
                const isSelected =
                  selectedDifficulty?.toLowerCase() === diff.value;
                return (
                  <motion.button
                    key={diff.value}
                    custom={i + 1}
                    variants={chipVariants}
                    initial="hidden"
                    animate="show"
                    type="button"
                    onClick={() =>
                      handleDifficultyChange(
                        isSelected ? undefined : diff.value
                      )
                    }
                    className={cn(
                      'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all focus-ring',
                      isSelected
                        ? diff.value === 'easy'
                          ? 'border-emerald-400 bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                          : diff.value === 'medium'
                            ? 'border-purple-400 bg-purple-600 text-white shadow-md shadow-purple-500/20'
                            : 'border-rose-400 bg-rose-500 text-white shadow-md shadow-rose-500/20'
                        : 'border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-700'
                    )}
                  >
                    {diff.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* MCQ Practice Container */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <MCQPracticeContainer
              examSlug={selectedSubject.code || selectedSubject._id}
            />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors">
      {/* Background Ambient Orbs */}
      <div className="pointer-events-none absolute -top-10 -left-10 h-96 w-96 rounded-full bg-purple-600/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-20 h-96 w-96 rounded-full bg-fuchsia-600/15 blur-3xl" />

      {/* Header */}
      <section className={`relative ${glassHeader}`}>
        <div className="relative flex flex-col md:flex-row items-center gap-10 md:gap-28 mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Link
                to={ROUTES.HOME}
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Home
              </Link>
              <ChevronRight size={12} />
              <span className="font-medium text-slate-800 dark:text-slate-200">
                Subjects
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Subjects{' '}
              <span className="text-purple-600 dark:text-purple-400">
                Library
              </span>
            </h1>
            <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
              Browse core subjects and practice MCQs to strengthen your
              preparation for competitive exams.
            </p>
          </motion.div>
          <img data-aos="zoom-in" className="w-80" src={StudentLottie} alt="" />
        </div>
      </section>

      {/* Content Area */}
      <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Search Bar & Category Filter */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects by name, code, or description..."
              className="w-full rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 pl-10 pr-10 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 backdrop-blur-md transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <Filter
              size={16}
              className="text-purple-600 dark:text-purple-400 shrink-0 hidden sm:inline"
            />
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((cat) => {
                const isSelected = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setSelectedCategory(cat.value)}
                    className={cn(
                      'whitespace-nowrap rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all shadow-sm focus-ring',
                      isSelected
                        ? 'border-purple-500 bg-purple-600 text-white shadow-purple-500/20 dark:bg-purple-500'
                        : 'border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50/50 dark:hover:bg-purple-950/30'
                    )}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Counter & Reset Filter */}
        {!loading && !error && subjects.length > 0 && (
          <div className="mb-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium px-1">
            <span>
              Showing{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                {filteredSubjects.length}
              </strong>{' '}
              of{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                {subjects.length}
              </strong>{' '}
              subjects
            </span>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={handleResetFilters}
                className="text-purple-600 dark:text-purple-400 hover:underline font-semibold inline-flex items-center gap-1"
              >
                <X size={12} /> Reset filters
              </button>
            )}
          </div>
        )}

        {/* Skeleton Loader */}
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-5 shadow-sm"
              >
                <div className="h-11 w-11 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="mt-4 h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="mt-2 h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
                <div className="mt-1 h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="mt-4 h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="mx-auto max-w-md rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/40 p-6 text-center shadow-lg">
            <AlertCircle className="mx-auto h-10 w-10 text-red-500 dark:text-red-400" />
            <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
              Failed to Load Subjects
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {error}
            </p>
            <button
              onClick={fetchSubjects}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-purple-700 transition-colors"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty DB State */}
        {!loading && !error && subjects.length === 0 && (
          <div className="mx-auto max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-8 text-center shadow-lg backdrop-blur-md">
            <FileQuestion className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
            <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
              No Subjects Found
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              There are no subjects in the database right now.
            </p>
          </div>
        )}

        {/* Empty Search/Filter Result State */}
        {!loading &&
          !error &&
          subjects.length > 0 &&
          filteredSubjects.length === 0 && (
            <div className="mx-auto max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-8 text-center shadow-lg backdrop-blur-md">
              <Search className="mx-auto h-12 w-12 text-purple-400 dark:text-purple-500 opacity-60" />
              <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
                No Matching Subjects
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                No subjects matched your search "{searchQuery}" or selected
                category filter.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-purple-700 transition-colors"
              >
                <X size={16} />
                Clear Filters
              </button>
            </div>
          )}

        {/* Subject Cards Grid */}
        {!loading && !error && filteredSubjects.length > 0 && (
          <div
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            role="list"
            aria-label="Core subjects"
          >
            {filteredSubjects.map((subject, i) => {
              const visuals = getSubjectVisuals(subject);
              const SubjectIcon = visuals.icon;
              return (
                <motion.button
                  key={subject._id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  type="button"
                  role="listitem"
                  onClick={() => handleSelectSubject(subject)}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-5 text-left transition-all duration-300 shadow-xl shadow-purple-950/5 dark:shadow-purple-950/20 focus-ring hover:-translate-y-1 hover:border-purple-300/80 dark:hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10',
                    visuals.color
                  )}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/60 dark:border-purple-500/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm transition-transform group-hover:scale-105">
                    <SubjectIcon
                      size={22}
                      className="text-purple-600 dark:text-purple-400 transition-colors group-hover:text-purple-700 dark:group-hover:text-purple-300"
                    />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                    {subject.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
                    {subject.description ||
                      `${subject.title} study material and practice questions.`}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-purple-200/50 dark:border-purple-800/50 bg-purple-50/80 dark:bg-purple-950/50 px-2.5 py-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-300">
                    <BookOpen size={10} />
                    {subject.code
                      ? subject.code.toUpperCase()
                      : subject.category || 'Subject'}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
