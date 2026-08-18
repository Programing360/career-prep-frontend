import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  BookOpen,
  ArrowRight,
  MessagesSquare,
  FileText,
  CalendarDays,
  Target,
  ClipboardCheck,
  RotateCcw,
  GraduationCap,
  ChevronDown,
  Phone,
  Mail,
  Clock,
} from 'lucide-react';
import examLottie from '../../assets/Exams.svg';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/Button';

type ActivePanel = 'help' | 'guide' | null;

const glassCard =
  'backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-purple-100/70 dark:border-purple-800/40 shadow-xl shadow-purple-950/5';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const prepSteps = [
  {
    icon: FileText,
    step: '01',
    title: 'Know Your Syllabus',
    description:
      'Start by downloading the official syllabus for your target exam (FPSC, PPSC, NTS). Understand the marking scheme, compulsory subjects, and optional groups before planning anything else.',
  },
  {
    icon: Target,
    step: '02',
    title: 'Set a Study Schedule',
    description:
      'Break your preparation into daily and weekly targets. Dedicate fixed hours to current affairs, general knowledge, and your optional subjects. Consistency beats intensity.',
  },
  {
    icon: BookOpen,
    step: '03',
    title: 'Study Subject-Wise',
    description:
      'Tackle one subject at a time using verified study material. Use our MCQs and AI Tutor explanations to master concepts rather than just memorizing answers.',
  },
  {
    icon: ClipboardCheck,
    step: '04',
    title: 'Attempt Mock Tests',
    description:
      'Simulate real exam conditions with timed mock tests. They build speed, improve accuracy, and train you to handle negative marking under pressure.',
  },
  {
    icon: RotateCcw,
    step: '05',
    title: 'Revise & Analyse',
    description:
      'Review every mistake after each test. Track weak topics with our analytics and revisit them. Regular revision turns short-term memory into lasting recall.',
  },
  {
    icon: CalendarDays,
    step: '06',
    title: 'Stay Updated',
    description:
      'Follow the official commission announcements for date sheets, eligibility criteria, and patterns. Keep practicing daily with current affairs and quizzes.',
  },
];

const helpChannels = [
  {
    icon: Phone,
    title: 'Call Us',
    detail: '+92 300 1234567',
    subtext: 'Mon – Sat, 9 AM – 6 PM',
  },
  {
    icon: Mail,
    title: 'Email Us',
    detail: 'support@meritprep.com',
    subtext: 'We respond within 24 hours',
  },
  {
    icon: MessagesSquare,
    title: 'Live Chat',
    detail: 'In-app chat widget',
    subtext: 'Instant answers during prep',
  },
  {
    icon: Clock,
    title: 'Response Time',
    detail: 'Within 24 Hours',
    subtext: 'Priority for premium users',
  },
];

export function ExamSupportSection() {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const togglePanel = (panel: Exclude<ActivePanel, null>) => {
    const next = activePanel === panel ? null : panel;
    setActivePanel(next);
    if (next && panelRef.current) {
      setTimeout(() => {
        panelRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  };

  return (
    <section className="relative w-full py-12 px-4 sm:px-6 lg:px-8">
      {/* Outer Container with Soft Purple Background */}
      <div
        data-aos="fade-up"
        className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-purple-200/60 dark:border-purple-900/40 bg-gradient-to-br from-purple-50/80 via-purple-50/40 to-slate-50 dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-950 p-8 sm:p-12 lg:p-16 backdrop-blur-xl shadow-xl shadow-purple-900/5"
      >
        {/* Subtle Grid Pattern Effect */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_20px]" />

        <div className="relative z-10 grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Exam Illustration & Decorative Graphics */}
          <div
            data-aos="fade-right"
            data-aos-delay="200"
            className="flex items-center justify-center lg:col-span-5"
          >
            <div className="relative w-full max-w-md">
              {/* Floating Decorative Badge */}
              <div className="absolute -top-4 -left-2 z-20 flex items-center gap-2 rounded-2xl bg-white dark:bg-slate-800 p-3 shadow-lg border border-purple-100 dark:border-purple-900/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Got Questions?
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Instant Prep Assistance
                  </p>
                </div>
              </div>

              {/* Main SVG Vector / Graphic Illustration */}
              <div className="relative overflow-hidden rounded-2xl bg-white/60 dark:bg-slate-900/60 p-6 backdrop-blur-md border border-purple-100/80 dark:border-purple-800/40 shadow-sm">
                <img src={examLottie} alt="" />
              </div>
            </div>
          </div>

          {/* Right Column: Content & Action Buttons */}
          <div
            data-aos="fade-left"
            data-aos-delay="300"
            className="flex flex-col items-start lg:col-span-7"
          >
            {/* Horizontal Line Indicator */}
            <div className="h-1 w-12 rounded-full bg-purple-600 dark:bg-purple-400 mb-6" />

            {/* Main Section Heading */}
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl leading-tight">
              Stuck on Preparation?{' '}
              <span className="text-purple-600 dark:text-purple-400">
                We Got You Covered!
              </span>
            </h2>

            {/* Subtext Body Content */}
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              &ldquo;Preparation without proper guidance is like sailing without
              a compass.&rdquo; Whether you need syllabus breakdowns,
              subject-wise guidelines, or instant support for exam queries—our
              dedicated team ensures you excel in FPSC, PPSC, and NTS tests
              seamlessly.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-4 w-full sm:w-auto">
              {/* Primary Action Button */}
              <button
                onClick={() => togglePanel('help')}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3.5 text-sm shadow-lg shadow-purple-600/25 transition-all hover:shadow-purple-600/40 active:scale-95 focus:outline-none ${
                  activePanel === 'help'
                    ? 'ring-2 ring-purple-600/40 ring-offset-2 ring-offset-purple-50 dark:ring-offset-slate-900'
                    : ''
                }`}
              >
                Get Exam Help
                <motion.span
                  animate={{ rotate: activePanel === 'help' ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="inline-flex"
                >
                  <ArrowRight size={16} />
                </motion.span>
              </button>

              {/* Secondary Action Button */}
              <button
                onClick={() => togglePanel('guide')}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold px-6 py-3.5 text-sm shadow-xs transition-all active:scale-95 focus:outline-none ${
                  activePanel === 'guide'
                    ? 'border-purple-500 dark:border-purple-400 ring-2 ring-purple-500/30'
                    : ''
                }`}
              >
                <motion.span
                  animate={{ rotate: activePanel === 'guide' ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="inline-flex"
                >
                  <BookOpen
                    size={16}
                    className="text-purple-600 dark:text-purple-400"
                  />
                </motion.span>
                Preparation Guide
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Panels */}
        <div ref={panelRef} className="relative z-10 mt-10 scroll-mt-24">
          <AnimatePresence initial={false} mode="wait">
            {activePanel === 'help' && (
              <motion.div
                key="help"
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className={`${glassCard} rounded-3xl p-6 sm:p-10`}>
                  {/* Panel Header */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-600 text-white">
                      <MessagesSquare size={22} />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                        Get Exam Help
                      </h3>
                      <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300">
                        Instant support for exam queries — syllabus breakdowns,
                        subject-wise guidelines, and one-on-one guidance from
                        our team.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-5 lg:grid-cols-4">
                    {helpChannels.map((channel) => {
                      const Icon = channel.icon;
                      return (
                        <motion.div
                          key={channel.title}
                          variants={fadeUp}
                          initial="hidden"
                          animate="visible"
                          whileHover={{ y: -4 }}
                          className="rounded-2xl border border-purple-100/70 bg-white/60 p-5 dark:border-purple-800/40 dark:bg-slate-950/40"
                        >
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/80 dark:text-purple-300">
                            <Icon size={20} />
                          </div>
                          <p className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                            {channel.title}
                          </p>
                          <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                            {channel.detail}
                          </p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {channel.subtext}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Quick Help Topics */}
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="mt-8"
                  >
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Quick Help Topics
                    </h4>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {[
                        'Syllabus breakdown for your exam',
                        'Eligibility & application guidance',
                        'Subject-wise preparation strategy',
                        'Mock test & negative marking tips',
                      ].map((topic) => (
                        <motion.div
                          key={topic}
                          variants={fadeUp}
                          className="flex items-center gap-3 rounded-xl border border-purple-100/70 bg-white/50 px-4 py-3 dark:border-purple-800/40 dark:bg-slate-950/40"
                        >
                          <HelpCircle
                            size={16}
                            className="shrink-0 text-purple-500 dark:text-purple-400"
                          />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {topic}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* CTA Row */}
                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <Link to={ROUTES.CONTACT} className="w-full sm:w-auto">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/25 dark:bg-purple-500 dark:hover:bg-purple-600"
                      >
                        Contact Support
                        <ArrowRight size={16} />
                      </Button>
                    </Link>
                    <Link to={ROUTES.FAQ} className="w-full sm:w-auto">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300"
                      >
                        Browse FAQ
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {activePanel === 'guide' && (
              <motion.div
                key="guide"
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className={`${glassCard} rounded-3xl p-6 sm:p-10`}>
                  {/* Panel Header */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-600 text-white">
                      <GraduationCap size={22} />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                        Preparation Guide
                      </h3>
                      <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300">
                        A step-by-step roadmap to prepare for FPSC, PPSC, and
                        NTS exams — from your first day to exam day.
                      </p>
                    </div>
                  </div>

                  {/* Steps Grid */}
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {prepSteps.map((step) => {
                      const Icon = step.icon;
                      return (
                        <motion.div
                          key={step.step}
                          variants={fadeUp}
                          whileHover={{ y: -4 }}
                          className="group relative overflow-hidden rounded-2xl border border-purple-100/70 bg-white/60 p-6 dark:border-purple-800/40 dark:bg-slate-950/40"
                        >
                          <span className="pointer-events-none absolute -right-2 -top-4 text-6xl font-black text-purple-100/80 dark:text-purple-900/40 transition-colors group-hover:text-purple-200/80 dark:group-hover:text-purple-800/50">
                            {step.step}
                          </span>
                          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/80 dark:text-purple-300">
                            <Icon size={20} />
                          </div>
                          <h4 className="relative mt-4 text-base font-bold text-slate-900 dark:text-white">
                            {step.title}
                          </h4>
                          <p className="relative mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            {step.description}
                          </p>
                        </motion.div>
                      );
                    })}
                  </motion.div>

                  {/* CTA Row */}
                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <Link to={ROUTES.EXAMS} className="w-full sm:w-auto">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/25 dark:bg-purple-500 dark:hover:bg-purple-600"
                      >
                        Start Practicing
                        <ArrowRight size={16} />
                      </Button>
                    </Link>
                    <Link to={ROUTES.SUBJECTS} className="w-full sm:w-auto">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300"
                      >
                        <BookOpen size={16} />
                        Browse Subjects
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapse toggle */}
          {activePanel && (
            <button
              onClick={() => setActivePanel(null)}
              className="mx-auto mt-6 flex items-center gap-2 rounded-full border border-purple-200 bg-white/70 px-5 py-2 text-sm font-semibold text-purple-700 backdrop-blur-md transition-all hover:bg-purple-50 dark:border-purple-800 dark:bg-slate-900/70 dark:text-purple-300 dark:hover:bg-slate-800"
            >
              <ChevronDown
                size={16}
                className="rotate-180 transition-transform"
              />
              Close
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
