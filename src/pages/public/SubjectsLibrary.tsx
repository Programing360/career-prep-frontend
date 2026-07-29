import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { MCQPracticeContainer } from '@/components/mcq/MCQPracticeContainer';

interface Subject {
  id: string;
  name: string;
  description: string;
  icon: typeof BookOpen;
  topicCount: number;
  color: string;
}

const CORE_SUBJECTS: Subject[] = [
  {
    id: 'general-knowledge',
    name: 'General Knowledge',
    description:
      'Current affairs, everyday science, geography, and world events.',
    icon: Globe,
    topicCount: 4,
    color:
      'from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800',
  },
  {
    id: 'english',
    name: 'English',
    description:
      'Grammar, vocabulary, comprehension, précis writing, and sentence correction.',
    icon: Languages,
    topicCount: 4,
    color:
      'from-emerald-500/10 to-emerald-600/5 border-emerald-200 dark:border-emerald-800',
  },
  {
    id: 'math',
    name: 'Mathematics',
    description:
      'Arithmetic, algebra, geometry, statistics, and data interpretation.',
    icon: Calculator,
    topicCount: 4,
    color:
      'from-violet-500/10 to-violet-600/5 border-violet-200 dark:border-violet-800',
  },
  {
    id: 'pak-studies',
    name: 'Pakistan Affairs',
    description:
      'History, geography, culture, constitution, and political system of Pakistan.',
    icon: Landmark,
    topicCount: 3,
    color:
      'from-amber-500/10 to-amber-600/5 border-amber-200 dark:border-amber-800',
  },
  {
    id: 'physics',
    name: 'Physics',
    description:
      'Mechanics, thermodynamics, optics, electromagnetism, and modern physics.',
    icon: Atom,
    topicCount: 3,
    color:
      'from-rose-500/10 to-rose-600/5 border-rose-200 dark:border-rose-800',
  },
  {
    id: 'reasoning',
    name: 'Verbal & Analytical Reasoning',
    description:
      'Logical reasoning, pattern recognition, syllogisms, and critical thinking.',
    icon: Brain,
    topicCount: 4,
    color:
      'from-teal-500/10 to-teal-600/5 border-teal-200 dark:border-teal-800',
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    description:
      'Fundamentals of computing, programming concepts, networking, and databases.',
    icon: Computer,
    topicCount: 3,
    color:
      'from-cyan-500/10 to-cyan-600/5 border-cyan-200 dark:border-cyan-800',
  },
  {
    id: 'islamic-studies',
    name: 'Islamic Studies',
    description:
      'Quran & Sunnah, Islamic history, jurisprudence, and contemporary issues.',
    icon: BookOpen,
    topicCount: 3,
    color:
      'from-indigo-500/10 to-indigo-600/5 border-indigo-200 dark:border-indigo-800',
  },
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.06, ease: 'easeOut' },
  }),
};

const chipVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.15, delay: i * 0.03 },
  }),
};

export default function SubjectsLibrary() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    string | undefined
  >(undefined);

  const handleSelectSubject = useCallback((subject: Subject) => {
    setSelectedSubject(subject);
    setSelectedDifficulty(undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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

  const filteredSubjects = useMemo(() => CORE_SUBJECTS, []);

  if (selectedSubject) {
    const SubjectIcon = selectedSubject.icon;
    return (
      <div className="min-h-screen">
        <section className="relative overflow-hidden border-b border-white/20 bg-white/70 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-400/10 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Link
                  to={ROUTES.SUBJECTS}
                  onClick={handleBack}
                  className="hover:text-gray-700 dark:hover:text-gray-200"
                >
                  Subjects
                </Link>
                <ChevronRight size={12} />
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {selectedSubject.name}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br',
                    selectedSubject.color
                  )}
                >
                  <SubjectIcon
                    size={20}
                    className="text-primary-600 dark:text-primary-400"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                    {selectedSubject.name}
                  </h1>
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                    {selectedSubject.description}
                  </p>
                </div>
              </div>

              <button
                onClick={handleBack}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                <ArrowLeft size={14} />
                Back to all subjects
              </button>
            </motion.div>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Difficulty Filter Chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="mb-6 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4"
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
              Difficulty
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
                  'rounded-full border px-3 py-1.5 text-xs font-medium transition-all focus-ring',
                  !selectedDifficulty
                    ? 'border-primary-400 bg-primary-500 text-white dark:border-primary-600'
                    : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-secondary))] hover:border-primary-300 hover:bg-primary-50 dark:hover:border-primary-700'
                )}
              >
                All Levels
              </motion.button>
              {DIFFICULTIES.map((diff, i) => (
                <motion.button
                  key={diff}
                  custom={i + 1}
                  variants={chipVariants}
                  initial="hidden"
                  animate="show"
                  type="button"
                  onClick={() =>
                    handleDifficultyChange(
                      selectedDifficulty === diff ? undefined : diff
                    )
                  }
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-medium transition-all focus-ring',
                    selectedDifficulty === diff
                      ? diff === 'Easy'
                        ? 'border-accent-400 bg-accent-500 text-white'
                        : diff === 'Medium'
                          ? 'border-yellow-400 bg-yellow-500 text-white'
                          : 'border-danger-400 bg-danger-500 text-white'
                      : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-secondary))] hover:border-primary-300 hover:bg-primary-50 dark:hover:border-primary-700'
                  )}
                >
                  {diff}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* MCQ Practice Container */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <MCQPracticeContainer examSlug={selectedSubject.id} />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden border-b border-white/20 bg-white/70 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-400/10 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Link
                to={ROUTES.HOME}
                className="hover:text-gray-700 dark:hover:text-gray-200"
              >
                Home
              </Link>
              <ChevronRight size={12} />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Subjects
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Subjects Library
            </h1>
            <p className="mt-3 max-w-2xl text-base text-gray-600 dark:text-gray-300 sm:text-lg">
              Browse core subjects and practice MCQs to strengthen your
              preparation for competitive exams.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          role="list"
          aria-label="Core subjects"
        >
          {filteredSubjects.map((subject, i) => {
            const SubjectIcon = subject.icon;
            return (
              <motion.button
                key={subject.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="show"
                type="button"
                role="listitem"
                onClick={() => handleSelectSubject(subject)}
                className={cn(
                  'group relative overflow-hidden rounded-xl border bg-gradient-to-br p-5 text-left transition-all hover:shadow-lg focus-ring',
                  subject.color
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 dark:bg-gray-900/80">
                  <SubjectIcon
                    size={20}
                    className="text-primary-600 transition-colors group-hover:text-primary-700 dark:text-primary-400"
                  />
                </div>
                <h3 className="mt-3 text-sm font-bold text-gray-900 dark:text-white">
                  {subject.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                  {subject.description}
                </p>
                <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
                  <BookOpen size={10} />
                  {subject.topicCount} topics
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
