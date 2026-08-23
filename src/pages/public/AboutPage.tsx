import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Brain,
  Users,
  Target,
  Shield,
  Heart,
  Sparkles,
  Award,
  GraduationCap,
  TrendingUp,
  CheckCircle2,
  Clock,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

// --- Animation Variants ---------------------------------------------------

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

// --- Glassmorphism Base Style ---------------------------------------------

const glassCard =
  'backdrop-blur-xl bg-white/70 dark:bg-[#150E28]/70 border border-purple-100/80 dark:border-purple-900/40 shadow-xl shadow-purple-950/5';

// --- Data -----------------------------------------------------------------

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Explanations',
    description:
      'Every MCQ comes with an instant AI-generated explanation so you truly understand the concept — not just the answer.',
    color:
      'bg-[#F3E8FF] text-[#8B3DFF] dark:bg-purple-950/80 dark:text-purple-300',
  },
  {
    icon: BookOpen,
    title: '25,000+ MCQs',
    description:
      'A massive question bank covering FPSC, PPSC, NTS, Armed Forces, Police, and Educator exams — updated regularly.',
    color:
      'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-300',
  },
  {
    icon: Target,
    title: 'Realistic Mock Tests',
    description:
      'Timed mock exams that simulate real test conditions so you walk into your exam with confidence.',
    color:
      'bg-[#F3E8FF] text-[#8B3DFF] dark:bg-purple-950/80 dark:text-purple-300',
  },
  {
    icon: TrendingUp,
    title: 'Smart Analytics',
    description:
      'Track your readiness score, identify weak areas, and follow a personalized study plan powered by data.',
    color:
      'bg-violet-100 text-violet-600 dark:bg-violet-950/80 dark:text-violet-300',
  },
  {
    icon: Shield,
    title: 'Trusted by Thousands',
    description:
      'Over 50,000 students rely on MeritPrep daily. Our proven methodology helps candidates succeed in competitive exams.',
    color: 'bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-300',
  },
  {
    icon: Sparkles,
    title: 'AI Study Tutor',
    description:
      'Ask any question and get instant, accurate answers from our intelligent tutor — available 24/7.',
    color: 'bg-teal-100 text-teal-600 dark:bg-teal-950/80 dark:text-teal-300',
  },
];

const values = [
  {
    icon: Heart,
    title: 'Student-First',
    description:
      'Every feature we build starts with one question: does this help students succeed?',
  },
  {
    icon: Award,
    title: 'Excellence',
    description:
      'We maintain the highest standards in content quality, accuracy, and user experience.',
  },
  {
    icon: Users,
    title: 'Community',
    description:
      'We believe in the power of shared knowledge and collective preparation.',
  },
  {
    icon: GraduationCap,
    title: 'Accessibility',
    description:
      'Quality exam preparation should be available to every student, regardless of background.',
  },
];

const teamMembers = [
  { name: 'Ahmad Khan', role: 'Founder & CEO', initials: 'AK' },
  { name: 'Fatima Ali', role: 'Head of Content', initials: 'FA' },
  { name: 'Hassan Raza', role: 'Lead Engineer', initials: 'HR' },
  { name: 'Sara Malik', role: 'AI Research Lead', initials: 'SM' },
];

// --- Main Component -------------------------------------------------------

export default function AboutPage() {
  return (
    <div className="flex flex-col bg-[#FAF7FF] text-gray-900 transition-colors duration-300 dark:bg-[#0F0A1C] dark:text-white">
      {/* ─── Hero Section with Gradient Banner & Image Layout ─── */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8 bg-gradient-to-br from-purple-100/60 via-indigo-50/40 to-[#FAF7FF] dark:from-[#190F35] dark:via-[#120B27] dark:to-[#0F0A1C] border-b border-purple-100/50 dark:border-purple-900/20">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 rounded-full bg-[#8B3DFF]/20 blur-3xl dark:bg-[#8B3DFF]/15" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-cyan-500/10 blur-3xl dark:bg-purple-900/30" />

        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid items-center gap-12 lg:grid-cols-12"
          >
            {/* Left Column: Text & Hero CTA */}
            <motion.div variants={fadeUp} className="text-left lg:col-span-7">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#8B3DFF]/20 bg-[#F3E8FF] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#8B3DFF] dark:bg-purple-950/80 dark:text-purple-300">
                <Sparkles size={14} className="animate-pulse" />
                About MeritPrep
              </span>

              <h1 className="text-4xl font-black font-heading tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl leading-[1.15]">
                Best Online Training Exam{' '}
                <span className="bg-gradient-to-r from-[#8B3DFF] via-purple-600 to-cyan-500 bg-clip-text text-transparent dark:from-purple-400 dark:to-cyan-400">
                  Platform
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-purple-200/80">
                MeritPrep is Pakistan's leading government exam preparation
                platform, combining AI-powered learning tools with a massive
                question bank to help you succeed.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link to={ROUTES.REGISTER}>
                  <Button
                    size="lg"
                    className="bg-[#8B3DFF] font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:bg-[#7424ED] dark:bg-purple-600 dark:hover:bg-purple-500"
                  >
                    Get Started Free
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link to={ROUTES.EXAMS}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-purple-200/80 bg-white/80 font-semibold text-gray-700 hover:border-[#8B3DFF]/40 hover:bg-white hover:text-[#8B3DFF] dark:border-purple-900/50 dark:bg-[#150E28]/80 dark:text-purple-200 dark:hover:border-purple-500 dark:hover:bg-[#1A1230] dark:hover:text-purple-300"
                  >
                    Explore Exams
                  </Button>
                </Link>
              </div>

              {/* Stats Bar Integrated in Hero */}
              <div className="mt-12 grid grid-cols-3 gap-4 border-t border-purple-200/60 dark:border-purple-900/40 pt-6">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-[#8B3DFF] dark:text-purple-300">
                    50K+
                  </p>
                  <p className="text-xs font-medium text-slate-500 dark:text-purple-300/60">
                    Active Students
                  </p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    25K+
                  </p>
                  <p className="text-xs font-medium text-slate-500 dark:text-purple-300/60">
                    MCQs Bank
                  </p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-[#8B3DFF] dark:text-purple-300">
                    89%
                  </p>
                  <p className="text-xs font-medium text-slate-500 dark:text-purple-300/60">
                    Success Rate
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Isometric Graphic Mockup */}
            <motion.div variants={fadeUp} className="relative lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative Background Card Glow */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-600 to-cyan-500 opacity-20 blur-xl dark:opacity-40" />

                <div
                  className={`${glassCard} relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-white/50 dark:border-purple-500/20 shadow-2xl`}
                >
                  {/* Mock Exam Graphic Card Visual */}
                  <div className="relative rounded-2xl bg-white/90 p-5 shadow-inner dark:bg-[#1C1335]/90 border border-purple-100 dark:border-purple-900/50">
                    <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/40 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-rose-400" />
                        <div className="h-3 w-3 rounded-full bg-amber-400" />
                        <div className="h-3 w-3 rounded-full bg-emerald-400" />
                      </div>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-purple-600 dark:text-purple-300">
                        <Clock size={12} /> 12:45 mins
                      </span>
                    </div>

                    {/* MCQ Questions Vector Simulation */}
                    <div className="mt-4 space-y-3">
                      <div className="h-4 w-3/4 rounded-md bg-purple-100 dark:bg-purple-950" />

                      <div className="space-y-2 pt-2">
                        {[
                          'A. Option Sample One',
                          'B. Option Sample Two',
                          'C. Correct Answer Option',
                        ].map((opt, idx) => (
                          <div
                            key={opt}
                            className={`flex items-center justify-between rounded-xl p-2.5 text-xs font-semibold ${
                              idx === 2
                                ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-50 dark:bg-purple-950/30 text-slate-600 dark:text-purple-200/70'
                            }`}
                          >
                            <span>{opt}</span>
                            {idx === 2 && (
                              <Check size={14} className="text-emerald-500" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Floating Micro Badge Elements */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute -bottom-3 -left-3 flex items-center gap-2 rounded-2xl bg-white dark:bg-[#231545] px-4 py-2.5 shadow-lg border border-purple-100 dark:border-purple-800/50"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/80 text-purple-600 dark:text-purple-300">
                      <Brain size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        AI Powered
                      </p>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">
                        Instant Explanations
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid items-center gap-12 lg:grid-cols-2"
          >
            <motion.div variants={fadeUp}>
              <span className="mb-3 inline-block rounded-full border border-[#8B3DFF]/20 bg-[#F3E8FF] px-4 py-1 text-xs font-semibold uppercase tracking-wider text-[#8B3DFF] dark:bg-purple-950/60 dark:text-purple-300">
                Our Mission
              </span>
              <h2 className="text-3xl font-bold font-heading text-gray-900 dark:text-white sm:text-4xl">
                Making Quality Exam Prep Accessible to Everyone
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-gray-600 dark:text-purple-200/80">
                We started MeritPrep with a simple belief: every student
                deserves access to high-quality preparation materials for
                government exams. Our AI-powered platform breaks down complex
                topics into digestible explanations, helping students learn
                smarter, not harder.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  'Personalized AI-driven study recommendations',
                  'Real-time progress tracking and readiness scoring',
                  'Expert-curated content for all major exam categories',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2
                      size={20}
                      className="shrink-0 text-emerald-500 dark:text-emerald-400"
                    />
                    <span className="text-sm font-semibold text-gray-700 dark:text-purple-100">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className={`${glassCard} rounded-3xl p-8`}
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Years Active', value: '3+' },
                  { label: 'Exams Covered', value: '200+' },
                  { label: 'Success Stories', value: '10K+' },
                  { label: 'Daily Users', value: '5K+' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-purple-100/60 bg-white/60 p-4 text-center backdrop-blur-sm dark:border-purple-900/30 dark:bg-[#1C1335]/60"
                  >
                    <p className="text-2xl font-extrabold text-[#8B3DFF] dark:text-purple-300">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-gray-500 dark:text-purple-300/60">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.span
              variants={fadeUp}
              className="mb-3 inline-block rounded-full border border-[#8B3DFF]/20 bg-[#F3E8FF] px-4 py-1 text-xs font-semibold uppercase tracking-wider text-[#8B3DFF] dark:bg-purple-950/60 dark:text-purple-300"
            >
              Platform Features
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-3xl font-bold font-heading text-gray-900 dark:text-white sm:text-4xl"
            >
              Everything You Need to Succeed
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-purple-200/80"
            >
              Powerful tools designed to make your exam preparation effective
              and enjoyable.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className={`${glassCard} flex h-full flex-col rounded-2xl p-6 transition-all duration-300 hover:border-[#8B3DFF]/40 hover:shadow-purple-500/10 dark:hover:border-purple-500/50`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-purple-200/70">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.span
              variants={fadeUp}
              className="mb-3 inline-block rounded-full border border-[#8B3DFF]/20 bg-[#F3E8FF] px-4 py-1 text-xs font-semibold uppercase tracking-wider text-[#8B3DFF] dark:bg-purple-950/60 dark:text-purple-300"
            >
              What Drives Us
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-3xl font-bold font-heading text-gray-900 dark:text-white sm:text-4xl"
            >
              Our Core Values
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className={`${glassCard} rounded-2xl p-6 text-center transition-all duration-300`}
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3E8FF] text-[#8B3DFF] dark:bg-purple-950/80 dark:text-purple-300">
                    <Icon size={28} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-purple-200/70">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.span
              variants={fadeUp}
              className="mb-3 inline-block rounded-full border border-[#8B3DFF]/20 bg-[#F3E8FF] px-4 py-1 text-xs font-semibold uppercase tracking-wider text-[#8B3DFF] dark:bg-purple-950/60 dark:text-purple-300"
            >
              Behind the Platform
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-3xl font-bold font-heading text-gray-900 dark:text-white sm:text-4xl"
            >
              Meet the Team
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-xl text-gray-600 dark:text-purple-200/80"
            >
              A passionate team of educators, engineers, and AI researchers
              dedicated to transforming exam preparation.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4"
          >
            {teamMembers.map((member) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className={`${glassCard} rounded-2xl p-6 text-center transition-all duration-300`}
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8B3DFF] to-[#6C1EDC] text-2xl font-bold text-white shadow-lg shadow-purple-500/20">
                  {member.initials}
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs font-semibold text-gray-500 dark:text-purple-300/60">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className={`${glassCard} mx-auto max-w-4xl rounded-3xl p-10 text-center sm:p-14`}
        >
          <h2 className="text-3xl font-bold font-heading text-gray-900 dark:text-white sm:text-4xl">
            Ready to Start Your Journey?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-600 dark:text-purple-200/80">
            Join over 50,000 students already preparing smarter with MeritPrep.
            Create your free account today.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to={ROUTES.REGISTER}>
              <Button
                size="lg"
                className="bg-[#8B3DFF] font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:bg-[#7424ED] dark:bg-purple-600 dark:hover:bg-purple-500"
              >
                Get Started Free
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to={ROUTES.EXAMS}>
              <Button
                size="lg"
                variant="outline"
                className="border-purple-200/80 bg-white/80 font-semibold text-gray-700 hover:border-[#8B3DFF]/40 hover:bg-white hover:text-[#8B3DFF] dark:border-purple-900/50 dark:bg-[#150E28]/80 dark:text-purple-200 dark:hover:border-purple-500 dark:hover:bg-[#1A1230] dark:hover:text-purple-300"
              >
                Explore Exams
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
