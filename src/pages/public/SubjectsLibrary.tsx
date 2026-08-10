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
  Sparkles,
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
      'from-purple-500/10 via-purple-500/5 to-transparent border-purple-200/60 dark:border-purple-800/40',
  },
  {
    id: 'english',
    name: 'English',
    description:
      'Grammar, vocabulary, comprehension, précis writing, and sentence correction.',
    icon: Languages,
    topicCount: 4,
    color:
      'from-fuchsia-500/10 via-fuchsia-500/5 to-transparent border-fuchsia-200/60 dark:border-fuchsia-800/40',
  },
  {
    id: 'math',
    name: 'Mathematics',
    description:
      'Arithmetic, algebra, geometry, statistics, and data interpretation.',
    icon: Calculator,
    topicCount: 4,
    color:
      'from-violet-500/10 via-violet-500/5 to-transparent border-violet-200/60 dark:border-violet-800/40',
  },
  {
    id: 'pak-studies',
    name: 'Pakistan Affairs',
    description:
      'History, geography, culture, constitution, and political system of Pakistan.',
    icon: Landmark,
    topicCount: 3,
    color:
      'from-indigo-500/10 via-indigo-500/5 to-transparent border-indigo-200/60 dark:border-indigo-800/40',
  },
  {
    id: 'physics',
    name: 'Physics',
    description:
      'Mechanics, thermodynamics, optics, electromagnetism, and modern physics.',
    icon: Atom,
    topicCount: 3,
    color:
      'from-pink-500/10 via-pink-500/5 to-transparent border-pink-200/60 dark:border-pink-800/40',
  },
  {
    id: 'reasoning',
    name: 'Verbal & Analytical Reasoning',
    description:
      'Logical reasoning, pattern recognition, syllogisms, and critical thinking.',
    icon: Brain,
    topicCount: 4,
    color:
      'from-purple-500/10 via-purple-500/5 to-transparent border-purple-200/60 dark:border-purple-800/40',
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    description:
      'Fundamentals of computing, programming concepts, networking, and databases.',
    icon: Computer,
    topicCount: 3,
    color:
      'from-cyan-500/10 via-cyan-500/5 to-transparent border-cyan-200/60 dark:border-cyan-800/40',
  },
  {
    id: 'islamic-studies',
    name: 'Islamic Studies',
    description:
      'Quran & Sunnah, Islamic history, jurisprudence, and contemporary issues.',
    icon: BookOpen,
    topicCount: 3,
    color:
      'from-violet-500/10 via-violet-500/5 to-transparent border-violet-200/60 dark:border-violet-800/40',
  },
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.05, ease: 'easeOut' },
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

const glassHeader =
  'backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-b border-white/40 dark:border-purple-500/20 shadow-lg shadow-purple-950/5';

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
                  {selectedSubject.name}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-2xl border bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md',
                    selectedSubject.color
                  )}
                >
                  <SubjectIcon
                    size={24}
                    className="text-purple-600 dark:text-purple-400"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                    {selectedSubject.name}
                  </h1>
                  <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
                    {selectedSubject.description}
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
                    'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all focus-ring',
                    selectedDifficulty === diff
                      ? diff === 'Easy'
                        ? 'border-emerald-400 bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : diff === 'Medium'
                          ? 'border-purple-400 bg-purple-600 text-white shadow-md shadow-purple-500/20'
                          : 'border-rose-400 bg-rose-500 text-white shadow-md shadow-rose-500/20'
                      : 'border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-700'
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
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors">
      {/* Background Ambient Orbs */}
      <div className="pointer-events-none absolute -top-10 -left-10 h-96 w-96 rounded-full bg-purple-600/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-20 h-96 w-96 rounded-full bg-fuchsia-600/15 blur-3xl" />

      {/* Header */}
      <section className={`relative ${glassHeader}`}>
        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
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

            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
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
        </div>
      </section>

      {/* Grid Content */}
      <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
                  'group relative overflow-hidden rounded-2xl border bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-5 text-left transition-all duration-300 shadow-xl shadow-purple-950/5 dark:shadow-purple-950/20 focus-ring hover:-translate-y-1 hover:border-purple-300/80 dark:hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10',
                  subject.color
                )}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/60 dark:border-purple-500/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm transition-transform group-hover:scale-105">
                  <SubjectIcon
                    size={22}
                    className="text-purple-600 dark:text-purple-400 transition-colors group-hover:text-purple-700 dark:group-hover:text-purple-300"
                  />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                  {subject.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {subject.description}
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-purple-200/50 dark:border-purple-800/50 bg-purple-50/80 dark:bg-purple-950/50 px-2.5 py-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-300">
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
