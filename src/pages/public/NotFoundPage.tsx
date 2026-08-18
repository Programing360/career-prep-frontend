import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  ArrowLeft,
  Search,
  Compass,
  GraduationCap,
  BookOpen,
  FileQuestion,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/Button';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

const quickLinks = [
  {
    icon: BookOpen,
    title: 'Browse Exams',
    description: 'Explore FPSC, PPSC, NTS and more',
    to: ROUTES.EXAMS,
  },
  {
    icon: GraduationCap,
    title: 'Practice MCQs',
    description: 'Sharpen your skills with mock tests',
    to: ROUTES.PRACTICE,
  },
  {
    icon: Search,
    title: 'AI Tutor',
    description: 'Get instant concept explanations',
    to: ROUTES.AI_TUTOR,
  },
  {
    icon: FileQuestion,
    title: 'FAQ & Help',
    description: 'Find answers to common questions',
    to: ROUTES.FAQ,
  },
];

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-[#FAF7FF] px-4 py-16 transition-colors duration-300 dark:bg-[#0F0A1C] sm:px-6 lg:px-8 pt-20">
      {/* Ambient Background Orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-purple-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-fuchsia-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative mx-auto w-full max-w-3xl text-center"
      >
        {/* 404 Number */}
        <motion.div variants={fadeUp} className="relative select-none">
          <span className="pointer-events-none absolute inset-0 mx-auto -mt-4 flex items-center justify-center text-[10rem] font-black text-purple-600/5 dark:text-purple-400/5 sm:text-[14rem]">
            404
          </span>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white shadow-2xl shadow-purple-600/30 dark:from-purple-500 dark:to-fuchsia-500"
          >
            <FileQuestion size={44} />
          </motion.div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={fadeUp}
          className="mt-10 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl"
        >
          Oops! Page{' '}
          <span className="text-purple-600 dark:text-purple-400">
            Not Found
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={fadeUp}
          className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg"
        >
          The page you're looking for may have been moved, renamed, or never
          existed. Let's get you back on track with your exam preparation.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link to={ROUTES.HOME} className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-purple-600 font-semibold text-white shadow-lg shadow-purple-600/25 transition-all hover:bg-purple-700 hover:shadow-purple-600/40 dark:bg-purple-500 dark:hover:bg-purple-600"
            >
              <Home size={16} />
              Back to Home
            </Button>
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur-md transition-all hover:bg-slate-50 active:scale-95 focus:outline-none dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </motion.div>

        {/* Divider */}
        <motion.div
          variants={fadeUp}
          className="mx-auto mt-14 flex items-center gap-4"
        >
          <div className="h-px flex-1 bg-purple-200/60 dark:bg-purple-900/50" />
          <Compass size={18} className="text-purple-500 dark:text-purple-400" />
          <div className="h-px flex-1 bg-purple-200/60 dark:bg-purple-900/50" />
        </motion.div>

        {/* Quick Links */}
        <motion.div
          variants={fadeUp}
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.to}
                className="group rounded-2xl border border-purple-100/80 bg-white/70 p-5 text-left shadow-lg shadow-purple-950/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/40 hover:shadow-xl hover:shadow-purple-500/10 dark:border-purple-900/40 dark:bg-[#150E28]/70 dark:hover:border-purple-500/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3E8FF] text-[#8B3DFF] transition-colors group-hover:bg-[#E9D5FF] dark:bg-purple-950/80 dark:text-purple-300">
                  <Icon size={18} />
                </div>
                <p className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-purple-300/70">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}
