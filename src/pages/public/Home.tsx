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
import { CurrentAffairsCompactWidget } from '@/components/current-affairs/CurrentAffairsCompactWidget';
import { DailyQuizCompactWidget } from '@/components/daily-quiz/DailyQuizCompactWidget';
import FeaturedExams from '@/components/home/FeaturedExams';
import { ExamSupportSection } from './ExamSupportSection';

// --- Animation Variants ---------------------------------------------------

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// --- Data -----------------------------------------------------------------

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
    color:
      'bg-purple-100 text-[#8B3DFF] dark:bg-purple-950/70 dark:text-purple-300',
    icon: BookOpen,
  },
  {
    id: 'ppsc',
    title: 'PPSC',
    subtitle: 'Punjab Public Service Commission',
    description: 'Provincial services, Lecturers, Subject Specialists',
    totalExams: 62,
    color:
      'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-300',
    icon: ClipboardCheck,
  },
  {
    id: 'kppsc',
    title: 'KPPSC',
    subtitle: 'Khyber Pakhtunkhwa PSC',
    description: 'KP civil services, Lecturers, Health professionals',
    totalExams: 38,
    color: 'bg-teal-100 text-teal-600 dark:bg-teal-950/70 dark:text-teal-300',
    icon: Shield,
  },
  {
    id: 'bpsc',
    title: 'BPSC',
    subtitle: 'Balochistan Public Service Commission',
    description: 'Provincial administration, Education & Health departments',
    totalExams: 22,
    color:
      'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-300',
    icon: Shield,
  },
  {
    id: 'spsc',
    title: 'SPSC',
    subtitle: 'Sindh Public Service Commission',
    description: 'Sindh civil services, Lecturers, Specialists',
    totalExams: 35,
    color: 'bg-pink-100 text-pink-600 dark:bg-pink-950/70 dark:text-pink-300',
    icon: Shield,
  },
  {
    id: 'nts',
    title: 'NTS',
    subtitle: 'National Testing Service',
    description: 'University admissions & national recruitment tests',
    totalExams: 53,
    color:
      'bg-violet-100 text-violet-600 dark:bg-violet-950/70 dark:text-violet-300',
    icon: Brain,
  },
  {
    id: 'ots',
    title: 'OTS',
    subtitle: 'Open Testing Service',
    description: 'Government & private sector recruitment testing',
    totalExams: 18,
    color:
      'bg-[#F3E8FF] text-[#8B3DFF] dark:bg-purple-950/70 dark:text-purple-300',
    icon: Brain,
  },
  {
    id: 'pts',
    title: 'PTS',
    subtitle: 'Pakistan Testing Service',
    description: 'Corporate, Government & educational institution testing',
    totalExams: 15,
    color:
      'bg-amber-100 text-amber-600 dark:bg-amber-950/70 dark:text-amber-300',
    icon: FileText,
  },
  {
    id: 'etea',
    title: 'ETEA',
    subtitle: 'Educational Testing & Evaluation Agency',
    description: 'KP university admissions & professional entrance tests',
    totalExams: 12,
    color:
      'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-950/70 dark:text-fuchsia-300',
    icon: Users,
  },
  {
    id: 'armed-forces',
    title: 'Armed Forces',
    subtitle: 'Army, Navy, PAF',
    description: 'ISSB, GD Officer, Technical & Non-Technical roles',
    totalExams: 28,
    color:
      'bg-purple-100 text-[#8B3DFF] dark:bg-purple-950/70 dark:text-purple-300',
    icon: Award,
  },
  {
    id: 'police',
    title: 'Police',
    subtitle: 'Punjab, Sindh, KPK, Balochistan Police & Rangers',
    description: 'Constable, ASI, Inspector, DSP preparation',
    totalExams: 34,
    color: 'bg-rose-100 text-rose-600 dark:bg-rose-950/70 dark:text-rose-300',
    icon: Target,
  },
];

const platformStats = [
  {
    label: 'Active Learners',
    value: '50,000+',
    icon: Users,
    color: 'text-[#8B3DFF] dark:text-purple-300',
  },
  {
    label: 'MCQs Practiced',
    value: '2.5M+',
    icon: Brain,
    color: 'text-emerald-500 dark:text-emerald-400',
  },
  {
    label: 'Success Rate',
    value: '89%',
    icon: TrendingUp,
    color: 'text-[#8B3DFF] dark:text-purple-300',
  },
  {
    label: 'Mock Tests Taken',
    value: '150K+',
    icon: ClipboardCheck,
    color: 'text-violet-500 dark:text-violet-400',
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

// --- Skeleton Component ---------------------------------------------------

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-purple-100/60 bg-white/60 p-6 shadow-sm dark:border-purple-900/40 dark:bg-[#150E28]/60">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 shrink-0 rounded-xl bg-purple-100/70 dark:bg-purple-900/40" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 rounded bg-purple-100/70 dark:bg-purple-900/40" />
          <div className="h-3 w-2/3 rounded bg-purple-100/70 dark:bg-purple-900/40" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-purple-100/70 dark:bg-purple-900/40" />
        <div className="h-3 w-3/4 rounded bg-purple-100/70 dark:bg-purple-900/40" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="h-3 w-1/4 rounded bg-purple-100/70 dark:bg-purple-900/40" />
        <div className="h-3 w-1/5 rounded bg-purple-100/70 dark:bg-purple-900/40" />
      </div>
    </div>
  );
}

// --- Main Component -------------------------------------------------------

export default function Home() {
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingCategories(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col bg-[#FAF7FF] text-gray-900 transition-colors duration-300 dark:bg-[#0F0A1C] dark:text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen">
        <Hero />
      </section>

      {/* Free-Value Highlight Strip */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="mb-3 inline-block rounded-full border border-[#8B3DFF]/20 bg-[#F3E8FF] px-4 py-1 text-xs font-semibold uppercase tracking-wider text-[#8B3DFF] dark:bg-purple-950/60 dark:text-purple-300">
              Free Preview
            </span>
            <h2 className="text-3xl font-bold font-heading text-gray-900 dark:text-white sm:text-4xl">
              Try Before You Commit
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600 dark:text-purple-200/80">
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
                  <div className="group flex h-full flex-col rounded-2xl border border-purple-100/80 bg-white/70 p-6 shadow-lg shadow-purple-950/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#8B3DFF]/30 hover:shadow-xl hover:shadow-purple-500/10 dark:border-purple-900/40 dark:bg-[#150E28]/70">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3E8FF] text-[#8B3DFF] dark:bg-purple-950/80 dark:text-purple-300">
                      <Icon size={22} />
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                      {card.title}
                    </h3>

                    <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600 dark:text-purple-200/70">
                      {card.description}
                    </p>

                    <Link
                      to={card.href}
                      className="mt-5 inline-flex items-center gap-2 self-start rounded-xl bg-[#8B3DFF] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#7424ED] dark:bg-purple-600 dark:hover:bg-purple-500"
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

      {/* Popular / Trending Exams Strip */}
      <section className="relative px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="mb-3 inline-block rounded-full border border-[#8B3DFF]/20 bg-[#F3E8FF] px-4 py-1 text-xs font-semibold uppercase tracking-wider text-[#8B3DFF] dark:bg-purple-950/60 dark:text-purple-300">
              Trending
            </span>
            <h2 className="text-3xl font-bold font-heading text-gray-900 dark:text-white sm:text-4xl">
              Popular Exams
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600 dark:text-purple-200/80">
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
                  className="group inline-flex items-center gap-2 rounded-full border border-purple-100/80 bg-white/80 px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-[#8B3DFF]/40 hover:bg-white hover:text-[#8B3DFF] hover:shadow-md dark:border-purple-900/50 dark:bg-[#150E28]/80 dark:text-purple-200 dark:hover:border-purple-500 dark:hover:bg-[#1A1230] dark:hover:text-purple-300"
                >
                  {exam.hot ? (
                    <Flame
                      size={15}
                      className="text-[#8B3DFF] transition-transform group-hover:scale-110 dark:text-purple-400"
                    />
                  ) : (
                    <Hash
                      size={15}
                      className="text-purple-400/60 dark:text-purple-400/40"
                    />
                  )}
                  {exam.name}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Exams (live catalog) */}
      <FeaturedExams />

      {/* Daily Quiz & Current Affairs Widgets */}
      <section className="relative px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="mb-3 inline-block rounded-full border border-[#8B3DFF]/20 bg-[#F3E8FF] px-4 py-1 text-xs font-semibold uppercase tracking-wider text-[#8B3DFF] dark:bg-purple-950/60 dark:text-purple-300">
              Daily Practice
            </span>
            <h2 className="text-3xl font-bold font-heading text-gray-900 dark:text-white sm:text-4xl">
              Stay Sharp Every Day
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600 dark:text-purple-200/80">
              A two-minute quiz and a fresh current affairs briefing to keep you
              ahead of the competition.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <DailyQuizCompactWidget />
            <CurrentAffairsCompactWidget />
          </div>
        </div>
      </section>

      {/* Exam Categories Grid */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold font-heading text-gray-900 dark:text-white sm:text-4xl">
              Official Testing Bodies
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600 dark:text-purple-200/80">
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
                    <div className="group flex h-full cursor-pointer flex-col rounded-2xl border border-purple-100/80 bg-white/70 p-6 shadow-lg shadow-purple-950/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#8B3DFF]/40 hover:shadow-xl hover:shadow-purple-500/10 dark:border-purple-900/40 dark:bg-[#150E28]/70 dark:hover:border-purple-500/50">
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold ${category.color}`}
                        >
                          <Icon size={22} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {category.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-purple-300/60">
                            {category.subtitle}
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 text-sm text-gray-600 dark:text-purple-200/70">
                        {category.description}
                      </p>

                      <div className="mt-5 flex items-center justify-between pt-2">
                        <span className="text-xs font-semibold text-gray-500 dark:text-purple-300/70">
                          {category.totalExams} exams
                        </span>
                        <Link
                          to={`${ROUTES.EXAMS}?category=${category.id}`}
                          className="flex items-center gap-1 text-sm font-semibold text-[#8B3DFF] group-hover:text-[#7424ED] dark:text-purple-300 dark:group-hover:text-purple-200"
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
      <section>
        <ExamSupportSection></ExamSupportSection>
      </section>

      {/* Social Proof & Platform Stats Block */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="mb-3 inline-block rounded-full border border-emerald-500/20 bg-emerald-100/70 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              Platform Stats
            </span>
            <h2 className="text-3xl font-bold font-heading text-gray-900 dark:text-white sm:text-4xl">
              Trusted by Thousands
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600 dark:text-purple-200/80">
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
                  <div className="group rounded-2xl border border-purple-100/80 bg-white/70 p-6 text-center shadow-lg shadow-purple-950/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#8B3DFF]/30 dark:border-purple-900/40 dark:bg-[#150E28]/70">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8FF] transition-colors group-hover:bg-[#E9D5FF] dark:bg-purple-950/80 dark:group-hover:bg-purple-900/80">
                      <Icon size={26} className={stat.color} />
                    </div>
                    <p className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-500 dark:text-purple-300/70">
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
              className="mx-auto mb-2 text-[#8B3DFF]/60 dark:text-purple-400/60"
            />
            <p className="text-sm font-medium text-gray-500 dark:text-purple-300/70">
              Data updated in real-time across all platforms
            </p>
          </motion.div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold font-heading text-gray-900 dark:text-white sm:text-4xl">
              Why Students Choose MeritPrep
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600 dark:text-purple-200/80">
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
                  className="rounded-2xl border border-purple-100/80 bg-white/70 p-6 shadow-xl shadow-purple-950/5 backdrop-blur-md dark:border-purple-900/40 dark:bg-[#150E28]/70"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3E8FF] text-[#8B3DFF] dark:bg-purple-950/80 dark:text-purple-300">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                    {prop.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-purple-200/70">
                    {prop.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Button
              size="lg"
              className="bg-[#8B3DFF] font-semibold text-white shadow-lg shadow-purple-500/25 hover:bg-[#7424ED] dark:bg-purple-600 dark:hover:bg-purple-500"
            >
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
