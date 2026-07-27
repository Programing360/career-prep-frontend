import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const glassCard =
  'backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border border-white/20 dark:border-gray-800/50 shadow-xl shadow-black/5';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Explanations',
    description:
      'Every MCQ comes with an instant AI-generated explanation so you truly understand the concept — not just the answer.',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
  },
  {
    icon: BookOpen,
    title: '25,000+ MCQs',
    description:
      'A massive question bank covering FPSC, PPSC, NTS, Armed Forces, Police, and Educator exams — updated regularly.',
    color:
      'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400',
  },
  {
    icon: Target,
    title: 'Realistic Mock Tests',
    description:
      'Timed mock exams that simulate real test conditions so you walk into your exam with confidence.',
    color:
      'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
  },
  {
    icon: TrendingUp,
    title: 'Smart Analytics',
    description:
      'Track your readiness score, identify weak areas, and follow a personalized study plan powered by data.',
    color:
      'bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400',
  },
  {
    icon: Shield,
    title: 'Trusted by Thousands',
    description:
      'Over 50,000 students rely on MeritPrep daily. Our proven methodology helps candidates succeed in competitive exams.',
    color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400',
  },
  {
    icon: Sparkles,
    title: 'AI Study Tutor',
    description:
      'Ask any question and get instant, accurate answers from our intelligent tutor — available 24/7.',
    color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-400',
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

function AnimatedCounter({
  target,
  suffix = '',
}: {
  target: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-50/50 px-4 py-24 dark:bg-[#0a1328] sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-10 top-1/4 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-1/4 right-10 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

        <motion.div
          className="relative mx-auto max-w-5xl text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.span
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-slate-700 backdrop-blur-sm dark:text-slate-200"
          >
            About MeritPrep
          </motion.span>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
          >
            Empowering Students to{' '}
            <span className="text-blue-600 dark:text-blue-400">
              Ace Their Exams
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300"
          >
            MeritPrep is Pakistan's leading government exam preparation
            platform, combining AI-powered learning tools with a massive
            question bank to help you succeed.
          </motion.p>

          {/* Floating Glass Cards */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="relative mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3"
          >
            <div
              className={`${glassCard} rounded-2xl p-6 transition-transform hover:scale-105`}
            >
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                50K+
              </p>
              <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                Active Students
              </p>
            </div>
            <div
              className={`${glassCard} rounded-2xl p-6 transition-transform hover:scale-105`}
            >
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                25K+
              </p>
              <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                MCQs Available
              </p>
            </div>
            <div
              className={`${glassCard} rounded-2xl p-6 transition-transform hover:scale-105`}
            >
              <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                89%
              </p>
              <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                Success Rate
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="bg-white px-4 py-20 dark:bg-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid items-center gap-12 lg:grid-cols-2"
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.6 }}>
              <span className="mb-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                Our Mission
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Making Quality Exam Prep Accessible to Everyone
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
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
                      className="shrink-0 text-emerald-500"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7 }}
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
                    className="rounded-2xl bg-white/50 p-4 text-center backdrop-blur-sm dark:bg-slate-800/50"
                  >
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
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
      <section className="bg-slate-50/50 px-4 py-20 dark:bg-[#0a1328] sm:px-6 lg:px-8">
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
              transition={{ duration: 0.5 }}
              className="mb-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
            >
              Platform Features
            </motion.span>
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
            >
              Everything You Need to Succeed
            </motion.h2>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-300"
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
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  className={`${glassCard} rounded-2xl p-6 transition-colors hover:border-blue-300/50 dark:hover:border-blue-700/50`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-20 dark:from-blue-900 dark:to-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid grid-cols-2 gap-8 lg:grid-cols-4"
          >
            {[
              { target: 50000, suffix: '+', label: 'Active Students' },
              { target: 25000, suffix: '+', label: 'MCQs in Database' },
              { target: 500, suffix: '+', label: 'Mock Tests' },
              { target: 89, suffix: '%', label: 'Student Success Rate' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <p className="text-4xl font-black text-white sm:text-5xl">
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm font-medium text-blue-100">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white px-4 py-20 dark:bg-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
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
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  className={`${glassCard} rounded-2xl p-6 text-center`}
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                    <Icon
                      size={28}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-slate-50/50 px-4 py-20 dark:bg-[#0a1328] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
            >
              Meet the Team
            </motion.h2>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="mx-auto mt-4 max-w-xl text-slate-600 dark:text-slate-300"
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
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                className={`${glassCard} rounded-2xl p-6 text-center`}
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-2xl font-bold text-white shadow-lg">
                  {member.initials}
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white px-4 py-20 dark:bg-slate-900 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className={`${glassCard} mx-auto max-w-4xl rounded-3xl p-10 text-center sm:p-14`}
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Ready to Start Your Journey?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600 dark:text-slate-300">
            Join over 50,000 students already preparing smarter with MeritPrep.
            Create your free account today.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to={ROUTES.REGISTER}>
              <Button
                size="lg"
                className="bg-gray-900 text-white shadow-md transition-all hover:bg-gray-800 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-100"
              >
                Get Started Free
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to={ROUTES.EXAMS}>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-200 bg-gray-100 text-gray-900 transition-all hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
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
