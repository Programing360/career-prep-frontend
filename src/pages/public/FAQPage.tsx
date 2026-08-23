import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  HelpCircle,
  BookOpen,
  Coins,
  HeadphonesIcon,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

// --- Glassmorphism Base Style ---------------------------------------------

const glassCard =
  'backdrop-blur-xl bg-white/70 dark:bg-[#150E28]/70 border border-purple-100/80 dark:border-purple-900/40 shadow-xl shadow-purple-950/5';

// --- Types & Data ---------------------------------------------------------

type FaqCategory = 'general' | 'exams' | 'tokens' | 'support';

interface FAQ {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
}

const categories: {
  id: FaqCategory;
  label: string;
  icon: typeof HelpCircle;
}[] = [
  { id: 'general', label: 'General', icon: HelpCircle },
  { id: 'exams', label: 'Exams', icon: BookOpen },
  { id: 'tokens', label: 'AI Tokens', icon: Coins },
  { id: 'support', label: 'Support', icon: HeadphonesIcon },
];

const faqs: FAQ[] = [
  // General
  {
    id: 'g1',
    category: 'general',
    question: 'What is MeritPrep?',
    answer:
      "MeritPrep is Pakistan's leading online platform for government exam preparation. We offer 25,000+ MCQs, AI-powered explanations, realistic mock tests, and personalized study plans for FPSC, PPSC, NTS, Armed Forces, and other competitive exams.",
  },
  {
    id: 'g2',
    category: 'general',
    question: 'Is MeritPrep free to use?',
    answer:
      'MeritPrep offers a generous free tier that includes access to a large number of MCQs and practice tests. For premium features like AI Tutor, unlimited mock tests, and advanced analytics, we offer affordable subscription plans.',
  },
  {
    id: 'g3',
    category: 'general',
    question: 'How do I create an account?',
    answer:
      'Simply click the "Sign Up" button on the homepage, enter your email address and create a password. You can also sign up using your Google account for instant access. The entire process takes less than 30 seconds.',
  },
  {
    id: 'g4',
    category: 'general',
    question: 'Can I use MeritPrep on my mobile phone?',
    answer:
      'Absolutely! MeritPrep is fully responsive and works perfectly on all devices — smartphones, tablets, laptops, and desktops. You can study anytime, anywhere.',
  },
  {
    id: 'g5',
    category: 'general',
    question: 'How accurate is the AI Tutor?',
    answer:
      'Our AI Tutor is trained on verified educational content and regularly updated. It provides accurate explanations with references. However, we always recommend cross-referencing with official sources for critical exam preparation.',
  },
  // Exams
  {
    id: 'e1',
    category: 'exams',
    question: 'Which exams does MeritPrep cover?',
    answer:
      'We cover a wide range of government exams including FPSC (CSS, Assistant Directors), PPSC (Provincial Services, Lecturers), NTS/NAT, Armed Forces (ISSB, GD Officer), Police (Constable to DSP), and Educators (STZ, SESE, CT PET).',
  },
  {
    id: 'e2',
    category: 'exams',
    question: 'How are the mock tests structured?',
    answer:
      'Our mock tests closely mirror the actual exam pattern — same number of questions, time limits, marking scheme, and negative marking where applicable. Each test is timed and provides a detailed score breakdown with topic-wise analysis.',
  },
  {
    id: 'e3',
    category: 'exams',
    question: 'Can I create custom practice sets?',
    answer:
      'Yes! You can filter questions by subject, topic, and difficulty level to create custom practice sets. This allows you to focus on specific areas where you need improvement.',
  },
  {
    id: 'e4',
    category: 'exams',
    question: 'How often is the question bank updated?',
    answer:
      "Our content team updates the question bank weekly with new MCQs based on the latest exam patterns, current affairs, and past paper analysis. You'll always have fresh content to practice with.",
  },
  {
    id: 'e5',
    category: 'exams',
    question: 'Do you provide past papers?',
    answer:
      'Yes, we have an extensive collection of past papers from various exams spanning the last 10+ years. These are available as both practice sets and timed mock tests.',
  },
  // AI Tokens
  {
    id: 't1',
    category: 'tokens',
    question: 'What are AI Tokens?',
    answer:
      'AI Tokens are the currency used to access premium AI features on MeritPrep, including AI Tutor explanations, Smart Study Plans, and detailed Performance Insights. Each feature costs a specific number of tokens per use.',
  },
  {
    id: 't2',
    category: 'tokens',
    question: 'How do I earn AI Tokens?',
    answer:
      'You earn tokens by maintaining daily login streaks, completing mock tests, achieving high scores, referring friends, and through special promotions. Premium subscribers also receive a monthly token allowance.',
  },
  {
    id: 't3',
    category: 'tokens',
    question: 'Can I purchase additional tokens?',
    answer:
      'Yes! You can purchase token packs at any time from your dashboard. We offer starter, pro, and unlimited packs at various price points to suit different needs.',
  },
  {
    id: 't4',
    category: 'tokens',
    question: 'Do tokens expire?',
    answer:
      'Tokens earned through activities never expire. However, bonus tokens from promotions may have an expiration date, which is clearly mentioned when you receive them.',
  },
  // Support
  {
    id: 's1',
    category: 'support',
    question: 'How can I contact support?',
    answer:
      'You can reach our support team through the Contact page, by emailing support@meritprep.com, or through the in-app chat widget. Our team typically responds within 24 hours.',
  },
  {
    id: 's2',
    category: 'support',
    question: 'I found an incorrect answer. How do I report it?',
    answer:
      'We take accuracy very seriously. You can flag any question by clicking the "Report" button below it. Our content team reviews all reports within 48 hours and makes corrections as needed.',
  },
  {
    id: 's3',
    category: 'support',
    question: 'Can I request a new subject or topic?',
    answer:
      'Absolutely! We love hearing from our users. Submit your request through the Contact page or the in-app feedback form, and our content team will evaluate it for inclusion.',
  },
  {
    id: 's4',
    category: 'support',
    question: 'How do I reset my password?',
    answer:
      'Click "Log in" and then "Forgot Password." Enter your email address and we\'ll send you a reset link. The link expires after 24 hours for security.',
  },
];

// --- Animation Variants ---------------------------------------------------

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

// --- Accordion Item Component ---------------------------------------------

function AccordionItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.4 }}
      className={`${glassCard} overflow-hidden rounded-2xl transition-all duration-300 ${
        isOpen
          ? 'border-[#8B3DFF]/40 shadow-purple-500/10 dark:border-purple-500/50'
          : 'hover:border-purple-200 dark:hover:border-purple-800/60'
      }`}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-purple-50/50 dark:hover:bg-purple-950/30 sm:p-6"
      >
        <span className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0 text-[#8B3DFF] dark:text-purple-300"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="border-t border-purple-100/60 px-5 pb-5 pt-4 dark:border-purple-900/40 sm:px-6 sm:pb-6">
              <p className="text-sm leading-relaxed text-slate-600 dark:text-purple-200/80">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- Main FAQ Page Component ----------------------------------------------

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<FaqCategory>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = faq.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col bg-[#FAF7FF] text-gray-900 transition-colors duration-300 dark:bg-[#0F0A1C] dark:text-white">
      {/* ─── Hero Section with Background Image ─── */}
      <section className="relative min-h-[420px] overflow-hidden border-b border-purple-100/50 px-4 py-20 dark:border-purple-900/20 sm:px-6 lg:px-8">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1600&auto=format&fit=crop" // পছন্দমতো ইমেজ URL ব্যবহার করুন
            alt="FAQ Background"
            className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
          />
          {/* Light & Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7FF]/90 via-[#FAF7FF]/80 to-[#FAF7FF] dark:from-[#0F0A1C]/95 dark:via-[#120B27]/90 dark:to-[#0F0A1C] backdrop-blur-[2px]" />
        </div>

        {/* Glow Effects */}
        <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[#8B3DFF]/15 blur-3xl dark:bg-[#8B3DFF]/25" />
        <div className="pointer-events-none absolute right-10 top-20 z-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl dark:bg-purple-900/30" />

        {/* Content Container */}
        <motion.div
          className="relative z-10 mx-auto max-w-3xl text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F3E8FF] shadow-inner dark:bg-purple-950/80 border border-purple-200/50 dark:border-purple-800/40"
          >
            <HelpCircle
              size={32}
              className="text-[#8B3DFF] dark:text-purple-300"
            />
          </motion.div>

          <motion.span
            variants={fadeUp}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#8B3DFF]/20 bg-[#F3E8FF]/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#8B3DFF] backdrop-blur-md dark:bg-purple-950/80 dark:text-purple-300"
          >
            <Sparkles size={14} className="animate-pulse" />
            Help Center
          </motion.span>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="mt-2 text-4xl font-black font-heading tracking-tight text-slate-900 dark:text-white sm:text-5xl"
          >
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-[#8B3DFF] via-purple-600 to-cyan-500 bg-clip-text text-transparent dark:from-purple-400 dark:to-cyan-400">
              Questions
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="mx-auto mt-4 max-w-xl text-base text-slate-600 dark:text-purple-200/80 sm:text-lg"
          >
            Everything you need to know about MeritPrep. Can't find what you're
            looking for?
            <Link
              to={ROUTES.CONTACT}
              className="ml-1 font-semibold text-[#8B3DFF] hover:underline dark:text-purple-300"
            >
              Contact us
            </Link>
            .
          </motion.p>

          {/* Search Bar */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="relative mx-auto mt-8 max-w-lg"
          >
            <div
              className={`${glassCard} flex items-center gap-3 rounded-2xl px-5 py-3.5 border-purple-200/80 dark:border-purple-800/40 focus-within:border-[#8B3DFF] dark:focus-within:border-purple-500 transition-all shadow-lg`}
            >
              <Search
                size={20}
                className="shrink-0 text-slate-400 dark:text-purple-300/60"
              />
              <input
                type="text"
                placeholder="Search questions or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-purple-300/40"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Tabs & FAQ List Section ─── */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Category Tabs */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mb-10 flex flex-wrap justify-center gap-3"
          >
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  variants={fadeUp}
                  transition={{ duration: 0.4 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setOpenId(null);
                    setSearchQuery('');
                  }}
                  className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-sm ${
                    isActive
                      ? 'bg-[#8B3DFF] text-white shadow-purple-500/25 dark:bg-purple-600'
                      : 'bg-white/80 text-gray-600 hover:bg-white hover:text-[#8B3DFF] dark:bg-[#150E28]/80 dark:text-purple-200/70 dark:hover:bg-[#1C1335] dark:hover:text-purple-300 border border-purple-100 dark:border-purple-900/40'
                  }`}
                >
                  <Icon size={16} />
                  {cat.label}
                </motion.button>
              );
            })}
          </motion.div>

          {/* FAQ List */}
          <motion.div
            key={activeCategory + searchQuery}
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-4"
          >
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  faq={faq}
                  isOpen={openId === faq.id}
                  onToggle={() => handleToggle(faq.id)}
                />
              ))
            ) : (
              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.4 }}
                className={`${glassCard} py-12 text-center rounded-2xl`}
              >
                <Search
                  size={40}
                  className="mx-auto text-purple-300 dark:text-purple-800"
                />
                <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-purple-300/60">
                  No questions found matching your search.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ─── Contact CTA Section ─── */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className={`${glassCard} mx-auto max-w-3xl rounded-3xl p-10 text-center sm:p-14 border border-purple-100 dark:border-purple-800/40`}
        >
          <h2 className="text-2xl font-bold font-heading tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Still Have Questions?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-slate-600 dark:text-purple-200/80 sm:text-base">
            Our support team is here to help. Reach out and we'll get back to
            you within 24 hours.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to={ROUTES.CONTACT}>
              <Button
                size="lg"
                className="bg-[#8B3DFF] font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:bg-[#7424ED] dark:bg-purple-600 dark:hover:bg-purple-500"
              >
                Contact Support
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
