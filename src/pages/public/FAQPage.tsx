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
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

const glassCard =
  'backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border border-white/20 dark:border-gray-800/50 shadow-xl shadow-black/5';

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
      className={`${glassCard} overflow-hidden rounded-2xl`}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-white/30 dark:hover:bg-gray-800/30 sm:p-6"
      >
        <span className="text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0"
        >
          <ChevronDown
            size={20}
            className="text-slate-400 dark:text-slate-500"
          />
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
            <div className="border-t border-white/20 px-5 pb-5 pt-4 dark:border-gray-800/50 sm:px-6 sm:pb-6">
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

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
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-50/50 px-4 py-24 dark:bg-[#0a1328] sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-20 top-10 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

        <motion.div
          className="relative mx-auto max-w-3xl text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/50"
          >
            <HelpCircle
              size={32}
              className="text-blue-600 dark:text-blue-400"
            />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl"
          >
            Frequently Asked{' '}
            <span className="text-blue-600 dark:text-blue-400">Questions</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="mx-auto mt-4 max-w-xl text-slate-600 dark:text-slate-300"
          >
            Everything you need to know about MeritPrep. Can't find what you're
            looking for?
            <Link
              to={ROUTES.CONTACT}
              className="ml-1 font-semibold text-blue-600 hover:underline dark:text-blue-400"
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
              className={`${glassCard} flex items-center gap-3 rounded-full px-5 py-3`}
            >
              <Search size={20} className="shrink-0 text-slate-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Tabs + FAQ List */}
      <section className="bg-white px-4 py-16 dark:bg-slate-900 sm:px-6 lg:px-8">
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
                  className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gray-900 text-white shadow-md dark:bg-white dark:text-slate-900'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
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
                className="py-12 text-center"
              >
                <Search
                  size={40}
                  className="mx-auto text-slate-300 dark:text-slate-600"
                />
                <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  No questions found matching your search.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50/50 px-4 py-20 dark:bg-[#0a1328] sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className={`${glassCard} mx-auto max-w-3xl rounded-3xl p-10 text-center sm:p-14`}
        >
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Still Have Questions?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-slate-600 dark:text-slate-300">
            Our support team is here to help. Reach out and we'll get back to
            you within 24 hours.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to={ROUTES.CONTACT}>
              <Button
                size="lg"
                className="bg-gray-900 text-white shadow-md transition-all hover:bg-gray-800 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-100"
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
