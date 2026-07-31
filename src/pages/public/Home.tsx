import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Brain,
  ClipboardCheck,
  Award,
  Users,
  Sparkles,
  Target,
  TrendingUp,
  FileText,
  Zap,
  Lightbulb,
  Shield,
  Flame,
  Hash,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import Hero from '@/components/landing/Hero';

// ─── Animation Variants ──────────────────────────────────────────────────────

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ─── Data ────────────────────────────────────────────────────────────────────

const freeValueCards = [
  {
    icon: FileText,
    title: '20 Free MCQs',
    description:
      'Access 20 practice questions from our 2,000+ question bank — no signup required.',
    cta: 'Try Free MCQs',
    href: ROUTES.EXAMS,
  },
  {
    icon: ClipboardCheck,
    title: '1 Demo Mock Test',
    description:
      'Experience a full-length mock test with real exam conditions and instant scoring.',
    cta: 'Start Demo',
    href: ROUTES.MOCK_TEST_DEMO,
  },
  {
    icon: Zap,
    title: 'Daily Quiz',
    description:
      'Challenge yourself with fresh questions every day across multiple subjects.',
    cta: 'Take Quiz',
    href: ROUTES.PRACTICE,
  },
  {
    icon: Lightbulb,
    title: 'AI Explanation Preview',
    description:
      'See how our AI tutor breaks down complex concepts into simple, clear explanations.',
    cta: 'Preview AI Tutor',
    href: ROUTES.AI_TUTOR,
  },
];

const trendingExams = [
  { name: 'CSS', hot: true },
  { name: 'PMS', hot: true },
  { name: 'NTS GAT', hot: false },
  { name: 'FIA Sub Inspector', hot: true },
  { name: 'FPSC STS', hot: false },
  { name: 'PPSC Lecturer', hot: false },
  { name: 'ISSB', hot: true },
  { name: 'Police ASI', hot: false },
  { name: 'CT/TT Educators', hot: false },
  { name: 'Auditor', hot: false },
];

const examCategories = [
  {
    id: 'fpsc',
    title: 'FPSC',
    subtitle: 'Federal Public Service Commission',
    description: 'CSS, Assistant Directors, Section Officers & more',
    totalExams: 45,
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    icon: BookOpen,
  },
  {
    id: 'ppsc',
    title: 'PPSC',
    subtitle: 'Punjab Public Service Commission',
    description: 'Provincial services, Lecturers, Subject Specialists',
    totalExams: 62,
    color:
      'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
    icon: ClipboardCheck,
  },
  {
    id: 'kppsc',
    title: 'KPPSC',
    subtitle: 'Khyber Pakhtunkhwa PSC',
    description: 'KP civil services, Lecturers, Health professionals',
    totalExams: 38,
    color: 'bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400',
    icon: Shield,
  },
  {
    id: 'bpsc',
    title: 'BPSC',
    subtitle: 'Balochistan Public Service Commission',
    description: 'Provincial administration, Education & Health departments',
    totalExams: 22,
    color:
      'bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400',
    icon: Shield,
  },
  {
    id: 'spsc',
    title: 'SPSC',
    subtitle: 'Sindh Public Service Commission',
    description: 'Sindh civil services, Lecturers, Specialists',
    totalExams: 35,
    color: 'bg-pink-50 text-pink-600 dark:bg-pink-950 dark:text-pink-400',
    icon: Shield,
  },
  {
    id: 'nts',
    title: 'NTS',
    subtitle: 'National Testing Service',
    description: 'University admissions & national recruitment tests',
    totalExams: 53,
    color:
      'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400',
    icon: Brain,
  },
  {
    id: 'ots',
    title: 'OTS',
    subtitle: 'Open Testing Service',
    description: 'Government & private sector recruitment testing',
    totalExams: 18,
    color:
      'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400',
    icon: Brain,
  },
  {
    id: 'pts',
    title: 'PTS',
    subtitle: 'Pakistan Testing Service',
    description: 'Corporate, Government & educational institution testing',
    totalExams: 15,
    color: 'bg-lime-50 text-lime-600 dark:bg-lime-950 dark:text-lime-400',
    icon: FileText,
  },
  {
    id: 'etea',
    title: 'ETEA',
    subtitle: 'Educational Testing & Evaluation Agency',
    description: 'KP university admissions & professional entrance tests',
    totalExams: 12,
    color:
      'bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-950 dark:text-fuchsia-400',
    icon: Users,
  },
  {
    id: 'armed-forces',
    title: 'Armed Forces',
    subtitle: 'Army, Navy, PAF',
    description: 'ISSB, GD Officer, Technical & Non-Technical roles',
    totalExams: 28,
    color: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
    icon: Award,
  },
  {
    id: 'police',
    title: 'Police',
    subtitle: 'Punjab, Sindh, KPK, Balochistan Police & Rangers',
    description: 'Constable, ASI, Inspector, DSP preparation',
    totalExams: 34,
    color: 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400',
    icon: Target,
  },
];

const platformStats = [
  {
    label: 'Active Learners',
    value: '50,000+',
    icon: Users,
    color: 'text-blue-500',
  },
  {
    label: 'MCQs Practiced',
    value: '2.5M+',
    icon: Brain,
    color: 'text-emerald-500',
  },
  {
    label: 'Success Rate',
    value: '89%',
    icon: TrendingUp,
    color: 'text-amber-500',
  },
  {
    label: 'Mock Tests Taken',
    value: '150K+',
    icon: ClipboardCheck,
    color: 'text-violet-500',
  },
];

const valueProps = [
  {
    icon: Sparkles,
    title: 'AI-Powered Tutor',
    description:
      'Get instant explanations for any MCQ with our AI tutor. Understand concepts, not just answers.',
  },
  {
    icon: ClipboardCheck,
    title: 'Real Mock Tests',
    description:
      'Practice with timed mock tests that simulate actual exam conditions and patterns.',
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    description:
      'Track your readiness score, identify weak areas, and follow a personalized study plan.',
  },
];

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 shrink-0 rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="h-3 w-1/4 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-1/5 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Home() {
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingCategories(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col">
      {/* ── Hero Section (untouched) ────────────────────────────────────── */}
      <section className="relative min-h-screen">
        <Hero />
      </section>

      {/* ── Free-Value Highlight Strip (untouched) ──────────────────────── */}
      <section className="relative bg-[hsl(var(--background))] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="mb-3 inline-block rounded-full bg-primary-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700 dark:bg-primary-900 dark:text-primary-300">
              Free Preview
            </span>
            <h2 className="text-3xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
              Try Before You Commit
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[rgb(var(--color-text-secondary))]">
              Explore our platform with free content — no credit card, no signup
              required for preview access.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {freeValueCards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div key={card.title} variants={fadeInUp}>
                  <div className="group flex h-full flex-col rounded-xl border border-white/20 bg-white/70 p-6 shadow-lg backdrop-blur-md transition-all hover:shadow-xl hover:-translate-y-1 dark:border-gray-800/50 dark:bg-gray-900/70">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                      <Icon
                        size={22}
                        className="text-gray-700 dark:text-gray-300"
                      />
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-[rgb(var(--color-text-primary))]">
                      {card.title}
                    </h3>

                    <p className="mt-2 flex-1 text-sm leading-relaxed text-[rgb(var(--color-text-secondary))]">
                      {card.description}
                    </p>

                    <Link
                      to={card.href}
                      className="mt-5 inline-flex items-center gap-2 self-start rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700"
                    >
                      {card.cta}
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Popular / Trending Exams Strip (NEW) ────────────────────────── */}
      <section className="bg-[hsl(var(--background))] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="mb-3 inline-block rounded-full bg-orange-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-orange-700 dark:bg-orange-900 dark:text-orange-300">
              Trending
            </span>
            <h2 className="text-3xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
              Popular Exams
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[rgb(var(--color-text-secondary))]">
              Quick access to the most sought-after exams among our students.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            {trendingExams.map((exam) => (
              <motion.div key={exam.name} variants={fadeInUp}>
                <Link
                  to={`${ROUTES.EXAMS}?search=${encodeURIComponent(exam.name)}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/70 px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-md transition-all hover:bg-gray-100 hover:shadow-md hover:-translate-y-0.5 dark:border-gray-800/50 dark:bg-gray-900/70 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {exam.hot ? (
                    <Flame
                      size={15}
                      className="text-orange-500 transition-transform group-hover:scale-110"
                    />
                  ) : (
                    <Hash
                      size={15}
                      className="text-gray-400 dark:text-gray-500"
                    />
                  )}
                  {exam.name}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Exam Categories Grid (expanded + skeleton loader) ────────────── */}
      <section className="bg-[hsl(var(--background))] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
              Official Testing Bodies
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[rgb(var(--color-text-secondary))]">
              Comprehensive preparation material for all major government
              testing organizations in Pakistan.
            </p>
          </div>

          {isLoadingCategories ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {examCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <motion.div key={category.id} variants={fadeInUp}>
                    <div className="group flex h-full cursor-pointer flex-col rounded-xl border border-white/20 bg-white/70 p-6 shadow-lg backdrop-blur-md transition-all hover:border-primary-300 hover:shadow-xl hover:-translate-y-1 dark:border-gray-800/50 dark:bg-gray-900/70 dark:hover:border-primary-700">
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${category.color}`}
                        >
                          <Icon size={22} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
                            {category.title}
                          </h3>
                          <p className="text-xs text-[rgb(var(--color-text-muted))]">
                            {category.subtitle}
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 text-sm text-[rgb(var(--color-text-secondary))]">
                        {category.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs font-medium text-[rgb(var(--color-text-muted))]">
                          {category.totalExams} exams
                        </span>
                        <Link
                          to={`${ROUTES.EXAMS}?category=${category.id}`}
                          className="flex items-center gap-1 text-sm font-medium text-primary-600 group-hover:text-primary-700 dark:text-primary-400"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Details
                          <ArrowRight
                            size={14}
                            className="transition-transform group-hover:translate-x-0.5"
                          />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Social Proof & Platform Stats Block (NEW) ───────────────────── */}
      <section className="bg-[rgb(var(--color-surface-elevated))] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="mb-3 inline-block rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
              Platform Stats
            </span>
            <h2 className="text-3xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
              Trusted by Thousands
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[rgb(var(--color-text-secondary))]">
              Real numbers that reflect the trust students place in MeritPrep
              for their exam preparation journey.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {platformStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div key={stat.label} variants={fadeInUp}>
                  <div className="group rounded-xl border border-white/20 bg-white/70 p-6 text-center shadow-lg backdrop-blur-md transition-all hover:shadow-xl hover:-translate-y-1 dark:border-gray-800/50 dark:bg-gray-900/70">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-gray-200 dark:bg-gray-800 dark:group-hover:bg-gray-700">
                      <Icon size={26} className={stat.color} />
                    </div>
                    <p className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 text-center"
          >
            <BarChart3
              size={20}
              className="mx-auto mb-2 text-gray-400 dark:text-gray-500"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Data updated in real-time across all platforms
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Value Propositions (untouched) ──────────────────────────────── */}
      <section className="bg-[rgb(var(--color-surface-elevated))] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
              Why Students Choose MeritPrep
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[rgb(var(--color-text-secondary))]">
              We combine smart technology with proven preparation strategies to
              maximize your chances of success.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {valueProps.map((prop) => {
              const Icon = prop.icon;
              return (
                <div
                  key={prop.title}
                  className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900">
                    <Icon
                      size={22}
                      className="text-primary-600 dark:text-primary-400"
                    />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[rgb(var(--color-text-primary))]">
                    {prop.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[rgb(var(--color-text-secondary))]">
                    {prop.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg">
              <Link to={ROUTES.REGISTER} className="flex items-center gap-2">
                Get Started for Free
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
