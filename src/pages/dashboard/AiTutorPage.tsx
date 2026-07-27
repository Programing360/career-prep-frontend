import { useState, useCallback, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Coins,
  Zap,
  Crown,
  Send,
  Sparkles,
  Calendar,
  Layers,
  Bot,
  User,
  Trash2,
  ArrowLeft,
  Check,
  XIcon,
  CreditCard,
  MessageSquare,
  Clock,
  TrendingDown,
  RotateCcw,
  FileQuestion,
  Mic,
  Lock,
  History,
  ListChecks,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { RootState } from '@/store/store';
import type { QuizQuestion } from '@/store/slices/aiTutorSlice';
import {
  sendMessage,
  receiveResponse,
  setActiveView,
  setActiveFeature,
  clearChat,
  buyTokenPack,
  upgradeToPremium,
  logTokenUsage,
  deductTokens,
  startQuiz,
  answerQuizQuestion,
  submitQuiz,
  closeQuiz,
} from '@/store/slices/aiTutorSlice';

const quickPromptChips = [
  'Explain the CSS Officer Selection Process',
  "Summarize Pakistan's 1973 Constitution",
  'Difference between Direct and Indirect Tax',
  'Tips for Verbal Reasoning MCQs',
];

const mockResponses: Record<string, string> = {
  default:
    "That's a great question! Here's a step-by-step breakdown:\n\n1. **Understanding the Core Concept**: The topic you've asked about is fundamental to Pakistan competitive exams.\n\n2. **Key Points to Remember**:\n   - This concept frequently appears in FPSC and PPSC exams\n   - Focus on the historical context and current implications\n   - Connect it with current affairs for a comprehensive answer\n\n3. **Exam Tip**: In CSS and PMS exams, always support your answer with relevant examples and constitutional references where applicable.\n\n4. **Practice Recommendation**: Try solving 10-15 MCQs on this topic to reinforce your understanding.",
  css: 'The **CSS (Central Superior Services) Officer Selection Process** involves multiple stages:\n\n1. **Written Examination** (1200 marks):\n   - Compulsory subjects: English, Urdu, General Knowledge, Current Affairs\n   - Optional subjects: Choose from Group A & B (600 marks each)\n   - Minimum passing: 50% in each paper\n\n2. **Psychological Assessment**:\n   - Intelligence tests\n   - Personality assessment\n   - Projective tests\n\n3. **Viva Voce / Interview** (300 marks):\n   - Conducted by FPSC panel\n   - Tests communication, general awareness, and personality\n\n4. **Final Merit**:\n   - Combined marks of Written + Viva\n   - Medical fitness test\n   - Character verification\n\n**Pro Tip**: Start preparation 8-10 months before the exam. Focus on English essay writing and current affairs daily.',
  constitution:
    "**Pakistan's Constitution of 1973** - Key Highlights:\n\n1. **Adopted**: April 12, 1973 (unanimous consent)\n2. **Suspended**: July 5, 1977 (General Zia's coup)\n3. **Restored**: March 23, 1985 (partially), December 29, 2006 (fully)\n\n**Key Features**:\n- Parliamentary form of government\n- Federal structure with provincial autonomy\n- Fundamental Rights (Articles 8-28)\n- Principles of Policy (Articles 29-40)\n- Islamic provisions (Article 2 & 227)\n- Judiciary independence (Article 175)\n\n**Important Amendments to Remember**:\n- 8th Amendment (1985): Objectives Resolution became substantive part\n- 13th Amendment (2002): Reduced Presidential powers\n- 18th Amendment (2010): Removed concurrent list, restored parliamentary sovereignty\n- 21st Amendment (2015): Established military courts\n\n**Exam Focus**: The 18th Amendment is the most frequently tested amendment in CSS/PMS exams.",
  tax: "**Direct vs Indirect Tax - Key Differences**:\n\n| Feature | Direct Tax | Indirect Tax |\n|---------|-----------|--------------|\n| **Definition** | Paid directly by the taxpayer to the government | Collected by an intermediary from the end consumer |\n| **Incidence** | Cannot be shifted | Can be shifted to others |\n| **Examples** | Income Tax, Wealth Tax, Property Tax | Sales Tax, GST, Custom Duty |\n| **Progressivity** | Usually progressive | Usually regressive |\n| **Collection** | Difficult to collect | Easier to collect |\n\n**Pakistan's Tax Structure**:\n- **FBR** (Federal Board of Revenue) collects both\n- Direct tax contributes ~40% of tax revenue\n- Indirect tax contributes ~60% of tax revenue\n- **WHT** (Withholding Tax) is the largest source\n\n**Exam Tip**: Remember that Pakistan has a high reliance on indirect taxes, making the tax system regressive.",
  verbal:
    '**Verbal Reasoning MCQ Preparation Tips**:\n\n1. **Analogy Questions**:\n   - Identify the relationship between the first pair\n   - Apply the same relationship to find the answer\n   - Practice: Book : Author :: Painting : ?\n\n2. **Series Completion**:\n   - Look for patterns (arithmetic, geometric, alternating)\n   - Check differences between consecutive terms\n   - Example: 2, 6, 12, 20, 30, ? (Answer: 42)\n\n3. **Coding-Decoding**:\n   - Find the coding pattern first\n   - Common patterns: reverse, shift, position-based\n   - Practice with 20+ questions daily\n\n4. **Blood Relations**:\n   - Draw a family tree diagram\n   - Use symbols: + for male, - for female\n   - Start from the known person\n\n5. **Direction Sense**:\n   - Draw diagrams for each movement\n   - Track both direction and distance\n   - Remember: Left = Anti-clockwise, Right = Clockwise\n\n**Daily Practice**: Solve 25 verbal reasoning questions every day. Track accuracy and focus on weak areas.',
  revision:
    "**AI Revision Planner** - Your Personalized Quick Review Schedule:\n\nBased on your weak areas, here's a focused 7-day revision plan:\n\n**Day 1-2: Pakistan Affairs**\n- Constitutional amendments (8th, 13th, 18th)\n- Pakistan Movement key events\n- Current political structure\n\n**Day 3: Current Affairs**\n- Last 6 months major events\n- International relations (Pakistan focus)\n- Economic indicators\n\n**Day 4: English**\n- Grammar rules & common errors\n- Sentence correction practice\n- Vocabulary building (50 words)\n\n**Day 5: General Knowledge**\n- Everyday science fundamentals\n- Geography (Pakistan + World)\n- Important dates and events\n\n**Day 6: Reasoning**\n- Series completion patterns\n- Analogy & classification\n- Coding-decoding rules\n\n**Day 7: Full Mock Test**\n- Take a timed 100-question mock test\n- Review mistakes\n- Focus on weak areas identified\n\n**Study Hours**: 4-5 hours/day with 15-min breaks every 90 minutes.",
};

function getMockResponse(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('css') && lower.includes('selection'))
    return mockResponses.css;
  if (lower.includes('constitution') || lower.includes('1973'))
    return mockResponses.constitution;
  if (
    lower.includes('tax') ||
    lower.includes('direct') ||
    lower.includes('indirect')
  )
    return mockResponses.tax;
  if (lower.includes('verbal') || lower.includes('reasoning'))
    return mockResponses.verbal;
  if (
    lower.includes('revision') ||
    lower.includes('review') ||
    lower.includes('schedule')
  )
    return mockResponses.revision;
  return mockResponses.default;
}

const mockQuizBank: Record<string, QuizQuestion[]> = {
  default: [
    {
      id: 'mq-1',
      question:
        'Which article of the Pakistan Constitution deals with Fundamental Rights?',
      options: [
        'Article 4-7',
        'Article 8-28',
        'Article 29-40',
        'Article 41-50',
      ],
      correctAnswer: 1,
      explanation:
        'Articles 8-28 of the Pakistan Constitution cover Fundamental Rights, including equality, freedom, and right to education.',
    },
    {
      id: 'mq-2',
      question: 'The 18th Amendment was passed in which year?',
      options: ['2008', '2009', '2010', '2011'],
      correctAnswer: 2,
      explanation:
        'The 18th Amendment was passed on April 8, 2010, removing the concurrent list and restoring parliamentary sovereignty.',
    },
    {
      id: 'mq-3',
      question: 'What is the full form of FBR in Pakistan?',
      options: [
        'Federal Bureau of Revenue',
        'Federal Board of Revenue',
        'Federal Budget Reform',
        'Federal Banking Regulation',
      ],
      correctAnswer: 1,
      explanation:
        'FBR stands for Federal Board of Revenue, which is responsible for collecting taxes in Pakistan.',
    },
    {
      id: 'mq-4',
      question: 'CSS stands for:',
      options: [
        'Central Superior Services',
        'Commissioner Superior Services',
        'Central Selection Services',
        'Civil Superior Services',
      ],
      correctAnswer: 0,
      explanation:
        'CSS stands for Central Superior Services, the permanent bureaucracy of Pakistan.',
    },
    {
      id: 'mq-5',
      question: 'The Objectives Resolution was originally adopted in:',
      options: ['1947', '1949', '1956', '1973'],
      correctAnswer: 1,
      explanation:
        'The Objectives Resolution was adopted on March 12, 1949 by the first Constituent Assembly of Pakistan under Liaquat Ali Khan.',
    },
  ],
  currentAffairs: [
    {
      id: 'ca-1',
      question:
        'Which organization released the World Economic Outlook report?',
      options: ['World Bank', 'IMF', 'WTO', 'UN'],
      correctAnswer: 1,
      explanation:
        'The International Monetary Fund (IMF) releases the World Economic Outlook report twice a year.',
    },
    {
      id: 'ca-2',
      question:
        'The Shanghai Cooperation Organisation (SCO) headquarters is located in:',
      options: ['Beijing', 'Shanghai', 'Moscow', 'Astana'],
      correctAnswer: 1,
      explanation: 'The SCO Secretariat is located in Beijing, China.',
    },
    {
      id: 'ca-3',
      question: 'Which is the largest trading partner of Pakistan?',
      options: ['USA', 'China', 'UAE', 'Saudi Arabia'],
      correctAnswer: 1,
      explanation:
        "China is Pakistan's largest trading partner, especially after the China-Pakistan Economic Corridor (CPEC).",
    },
    {
      id: 'ca-4',
      question: 'BRICS includes which of the following countries?',
      options: [
        'Brazil, Russia, India, China, South Africa',
        'Brazil, Russia, Indonesia, China, South Africa',
        'Britain, Russia, India, China, South Africa',
        'Brazil, Romania, India, China, South Africa',
      ],
      correctAnswer: 0,
      explanation:
        'BRICS comprises Brazil, Russia, India, China, and South Africa.',
    },
    {
      id: 'ca-5',
      question: 'GSP+ (Generalized Scheme of Preferences Plus) is granted by:',
      options: ['USA', 'China', 'European Union', 'World Bank'],
      correctAnswer: 2,
      explanation:
        'GSP+ is a preferential tariff arrangement granted by the European Union to developing countries.',
    },
  ],
  verbal: [
    {
      id: 'vr-1',
      question: 'Find the next number: 2, 6, 12, 20, 30, ?',
      options: ['36', '40', '42', '48'],
      correctAnswer: 2,
      explanation: 'Pattern: n(n+1) where n starts from 1. 6×7 = 42.',
    },
    {
      id: 'vr-2',
      question: 'If APPLE = 50, then ORANGE = ?',
      options: ['55', '60', '65', '70'],
      correctAnswer: 1,
      explanation:
        'Sum of letter positions: O(15)+R(18)+A(1)+N(14)+G(7)+E(5) = 60.',
    },
    {
      id: 'vr-3',
      question:
        "A is B's sister. C is B's mother. D is C's father. How is A related to D?",
      options: ['Granddaughter', 'Daughter', 'Sister', 'Grandmother'],
      correctAnswer: 0,
      explanation:
        "D is C's father, C is B's mother, A is B's sister. So A is D's granddaughter.",
    },
    {
      id: 'vr-4',
      question: 'Choose the analogy: Book : Author :: Painting : ?',
      options: ['Gallery', 'Artist', 'Canvas', 'Brush'],
      correctAnswer: 1,
      explanation:
        'A book is created by an author; a painting is created by an artist.',
    },
    {
      id: 'vr-5',
      question:
        'In a certain code, PEN is written as QFO. How is BOOK written?',
      options: ['CPPL', 'DNPM', 'CPPM', 'DNPL'],
      correctAnswer: 0,
      explanation:
        'Each letter is shifted +1: B+1=C, O+1=P, O+1=P, K+1=L. So BOOK = CPPL.',
    },
  ],
};

function getQuizForTopic(topic: string): QuizQuestion[] {
  const lower = topic.toLowerCase();
  if (lower.includes('current') || lower.includes('affairs'))
    return mockQuizBank.currentAffairs;
  if (lower.includes('verbal') || lower.includes('reasoning'))
    return mockQuizBank.verbal;
  return mockQuizBank.default;
}

const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter Pack',
    tokens: 500,
    price: 'Rs. 299',
    pricePerToken: 'Rs. 0.60/token',
    badge: null,
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    tokens: 1500,
    price: 'Rs. 699',
    pricePerToken: 'Rs. 0.47/token',
    badge: 'Popular',
  },
  {
    id: 'premium',
    name: 'Premium',
    tokens: 9999,
    price: 'Rs. 1,499/mo',
    pricePerToken: 'Unlimited',
    badge: 'Best Value',
  },
];

interface FeatureCardDef {
  id: string;
  icon: typeof Sparkles;
  title: string;
  description: string;
  color: string;
  tokenCost: number;
  comingSoon?: boolean;
}

const featureCards: FeatureCardDef[] = [
  {
    id: 'explanation',
    icon: Sparkles,
    title: 'AI Explanation Generator',
    description:
      'Paste any MCQ or concept to get a detailed step-by-step breakdown with exam-relevant insights.',
    color:
      'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400',
    tokenCost: 10,
  },
  {
    id: 'planner',
    icon: Calendar,
    title: 'AI Study Planner',
    description:
      'Generate a customized study calendar based on your exam target date and current progress.',
    color:
      'bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400',
    tokenCost: 15,
  },
  {
    id: 'flashcards',
    icon: Layers,
    title: 'AI Flashcards Generator',
    description:
      'Create quick revision flashcards for your weak topics with spaced repetition scheduling.',
    color: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
    tokenCost: 8,
  },
  {
    id: 'revision',
    icon: RotateCcw,
    title: 'AI Revision Planner',
    description:
      'Generates a quick review schedule for weak subjects before exams based on your progress.',
    color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400',
    tokenCost: 12,
  },
  {
    id: 'quiz',
    icon: FileQuestion,
    title: 'AI-Generated Quizzes',
    description:
      'Instantly creates a 5-question quick quiz on any topic you type for fast practice.',
    color:
      'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
    tokenCost: 10,
  },
  {
    id: 'interview',
    icon: Mic,
    title: 'AI Mock Interview',
    description:
      'Practice verbal interviews with an AI interviewer. Get feedback on communication skills.',
    color: 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400',
    tokenCost: 25,
    comingSoon: true,
  },
];

export default function AiTutorPage() {
  const dispatch = useDispatch();
  const {
    dailyTokensRemaining,
    dailyTokensTotal,
    tokenCostPerQuery,
    isPremium,
    chatHistory,
    isStreaming,
    activeView,
    usageHistory,
    quizActive,
    quizQuestions,
    quizTopic,
    quizAnswers,
    quizSubmitted,
  } = useSelector((state: RootState) => state.aiTutor);

  const [promptInput, setPromptInput] = useState('');
  const [pricingOpen, setPricingOpen] = useState(false);
  const [activeFeature, setLocalActiveFeature] = useState<string | null>(null);
  const [homeTab, setHomeTab] = useState<'features' | 'usage'>('features');
  const quizModalOpen = quizActive && quizQuestions.length > 0;
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isStreaming]);

  const handleSend = useCallback(
    (text?: string) => {
      const content = text || promptInput.trim();
      if (!content || isStreaming) return;
      if (dailyTokensRemaining < tokenCostPerQuery) {
        setPricingOpen(true);
        return;
      }

      dispatch(sendMessage(content));
      setPromptInput('');

      setTimeout(
        () => {
          const response = getMockResponse(content);
          dispatch(receiveResponse(response));
        },
        1500 + Math.random() * 1000
      );
    },
    [
      promptInput,
      isStreaming,
      dailyTokensRemaining,
      tokenCostPerQuery,
      dispatch,
    ]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleGenerateQuiz = useCallback(
    (topic: string) => {
      const cost = 10;
      if (dailyTokensRemaining < cost) {
        setPricingOpen(true);
        return;
      }
      dispatch(deductTokens(cost));
      dispatch(
        logTokenUsage({
          feature: 'AI Quiz',
          description: `Quiz on "${topic.slice(0, 50)}"`,
          tokenCost: cost,
        })
      );
      const questions = getQuizForTopic(topic);
      dispatch(startQuiz({ topic, questions }));
    },
    [dailyTokensRemaining, dispatch]
  );

  const handleFeatureUse = useCallback(
    (featureId: string, prompt: string) => {
      const card = featureCards.find((f) => f.id === featureId);
      if (!card || card.comingSoon) return;

      if (dailyTokensRemaining < card.tokenCost) {
        setPricingOpen(true);
        return;
      }

      dispatch(deductTokens(card.tokenCost));
      dispatch(
        logTokenUsage({
          feature: card.title,
          description: prompt.slice(0, 60),
          tokenCost: card.tokenCost,
        })
      );

      if (featureId === 'quiz') {
        handleGenerateQuiz(prompt);
      } else {
        dispatch(setActiveView('chat'));
        setLocalActiveFeature(null);
        dispatch(setActiveFeature(null));
        setPromptInput(prompt);
        setTimeout(() => {
          handleSend(prompt);
        }, 200);
      }
    },
    [dailyTokensRemaining, dispatch, handleGenerateQuiz, handleSend]
  );

  const tokenPercent = Math.round(
    (dailyTokensRemaining / dailyTokensTotal) * 100
  );
  const isLowTokens = tokenPercent <= 30;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900">
            <Bot size={22} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
              AI Tutor
            </h1>
            <p className="text-xs text-[rgb(var(--color-text-secondary))]">
              Powered by AI - Ask anything about your exam preparation
            </p>
          </div>
        </div>
        {activeView === 'chat' && (
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft size={14} />}
            onClick={() => {
              dispatch(setActiveView('home'));
              setLocalActiveFeature(null);
            }}
          >
            Back to Home
          </Button>
        )}
      </div>

      <TokenHeader
        remaining={dailyTokensRemaining}
        total={dailyTokensTotal}
        percent={tokenPercent}
        isLow={isLowTokens}
        isPremium={isPremium}
        costPerQuery={tokenCostPerQuery}
        onBuyTokens={() => setPricingOpen(true)}
      />

      {activeView === 'home' && !activeFeature && (
        <div className="space-y-6">
          <div className="flex gap-1 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-1">
            <button
              onClick={() => setHomeTab('features')}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all',
                homeTab === 'features'
                  ? 'bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))] shadow-sm'
                  : 'text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]'
              )}
            >
              <Sparkles size={12} />
              AI Features
            </button>
            <button
              onClick={() => setHomeTab('usage')}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all',
                homeTab === 'usage'
                  ? 'bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))] shadow-sm'
                  : 'text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]'
              )}
            >
              <History size={12} />
              Usage History
              {usageHistory.length > 0 && (
                <span className="ml-1 rounded-full bg-primary-100 px-1.5 py-0.5 text-[9px] font-bold text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                  {usageHistory.length}
                </span>
              )}
            </button>
          </div>

          {homeTab === 'features' && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {featureCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <button
                      key={card.id}
                      disabled={card.comingSoon}
                      onClick={() => {
                        if (card.comingSoon) return;
                        setLocalActiveFeature(card.id);
                        dispatch(setActiveFeature(card.id));
                      }}
                      className={cn(
                        'group relative rounded-xl border bg-[rgb(var(--color-surface))] p-5 text-left transition-all',
                        card.comingSoon
                          ? 'cursor-not-allowed border-[rgb(var(--color-border))] opacity-70'
                          : 'border-[rgb(var(--color-border))] hover:border-primary-300 hover:shadow-md dark:hover:border-primary-700'
                      )}
                    >
                      {card.comingSoon && (
                        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                          <Lock size={8} />
                          Coming Soon
                        </span>
                      )}
                      <div
                        className={cn(
                          'flex h-11 w-11 items-center justify-center rounded-xl',
                          card.color
                        )}
                      >
                        <Icon size={20} />
                      </div>
                      <h3 className="mt-4 text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                        {card.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-[rgb(var(--color-text-secondary))]">
                        {card.description}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[10px] font-medium text-[rgb(var(--color-text-muted))]">
                          <Coins size={10} />
                          {card.tokenCost} tokens per use
                        </span>
                        {!card.comingSoon && (
                          <span className="text-xs font-medium text-primary-500 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                            Try Now &rarr;
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-primary-500" />
                  <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                    Quick Chat
                  </h3>
                </div>
                <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
                  Ask any question about your exam preparation. The AI tutor is
                  here to help 24/7.
                </p>
                <Button
                  size="sm"
                  className="mt-3"
                  leftIcon={<MessageSquare size={14} />}
                  onClick={() => {
                    dispatch(setActiveView('chat'));
                    setTimeout(() => inputRef.current?.focus(), 100);
                  }}
                >
                  Start Chatting
                </Button>
              </div>

              <UsageStats
                costPerQuery={tokenCostPerQuery}
                remaining={dailyTokensRemaining}
              />
            </>
          )}

          {homeTab === 'usage' && <UsageHistory history={usageHistory} />}
        </div>
      )}

      {activeView === 'home' && activeFeature && (
        <FeatureDetail
          featureId={activeFeature}
          dailyTokensRemaining={dailyTokensRemaining}
          isStreaming={isStreaming}
          onUseFeature={(prompt) => handleFeatureUse(activeFeature, prompt)}
          onBack={() => {
            setLocalActiveFeature(null);
            dispatch(setActiveFeature(null));
          }}
        />
      )}

      {activeView === 'chat' && (
        <div className="space-y-4">
          <ChatHistory messages={chatHistory} isStreaming={isStreaming} />

          <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {quickPromptChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setPromptInput(chip);
                    handleSend(chip);
                  }}
                  disabled={
                    isStreaming || dailyTokensRemaining < tokenCostPerQuery
                  }
                  className="rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] px-3 py-1 text-[11px] font-medium text-[rgb(var(--color-text-secondary))] transition-all hover:border-primary-300 hover:text-primary-600 disabled:opacity-50 dark:hover:border-primary-700"
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    dailyTokensRemaining < tokenCostPerQuery
                      ? 'No tokens remaining. Buy more to continue.'
                      : 'Ask the AI Tutor anything...'
                  }
                  disabled={
                    isStreaming || dailyTokensRemaining < tokenCostPerQuery
                  }
                  className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-4 py-2.5 pr-12 text-sm text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-muted))] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={
                    !promptInput.trim() ||
                    isStreaming ||
                    dailyTokensRemaining < tokenCostPerQuery
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-primary-500 p-1.5 text-white transition-colors hover:bg-primary-600 disabled:opacity-40 disabled:hover:bg-primary-500"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] text-[rgb(var(--color-text-muted))]">
                <Coins size={10} />
                <span>Cost: {tokenCostPerQuery} Tokens per query</span>
              </div>
              {chatHistory.length > 0 && (
                <button
                  onClick={() => dispatch(clearChat())}
                  className="flex items-center gap-1 text-[10px] text-[rgb(var(--color-text-muted))] hover:text-danger-500"
                >
                  <Trash2 size={10} />
                  Clear chat
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {quizModalOpen && (
        <AiQuizModal
          topic={quizTopic}
          questions={quizQuestions}
          answers={quizAnswers}
          submitted={quizSubmitted}
          onSelect={(qId, optIdx) =>
            dispatch(
              answerQuizQuestion({ questionId: qId, optionIndex: optIdx })
            )
          }
          onSubmit={() => dispatch(submitQuiz())}
          onClose={() => {
            dispatch(closeQuiz());
          }}
        />
      )}

      {pricingOpen && (
        <PricingModal
          isPremium={isPremium}
          onBuy={(tokens) => {
            dispatch(buyTokenPack(tokens));
            setPricingOpen(false);
          }}
          onUpgrade={() => {
            dispatch(upgradeToPremium());
            setPricingOpen(false);
          }}
          onClose={() => setPricingOpen(false)}
        />
      )}
    </div>
  );
}

function TokenHeader({
  remaining,
  total,
  percent,
  isLow,
  isPremium,
  costPerQuery,
  onBuyTokens,
}: {
  remaining: number;
  total: number;
  percent: number;
  isLow: boolean;
  isPremium: boolean;
  costPerQuery: number;
  onBuyTokens: () => void;
}) {
  return (
    <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Coins
              size={18}
              className={cn(isLow ? 'text-danger-500' : 'text-primary-500')}
            />
            <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
              {isPremium
                ? 'Unlimited'
                : `${remaining} Free Tokens Remaining Today`}
            </h3>
            {isPremium && (
              <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                <Crown size={10} />
                Premium
              </span>
            )}
          </div>
          {!isPremium && (
            <div className="mt-3 max-w-md">
              <div className="flex items-center justify-between text-[10px] text-[rgb(var(--color-text-muted))]">
                <span>
                  {remaining} / {total} tokens
                </span>
                <span>{percent}% remaining</span>
              </div>
              <div className="relative mt-1 h-2 w-full overflow-hidden rounded-full bg-[rgb(var(--color-surface-elevated))]">
                <div
                  className={cn(
                    'absolute inset-y-0 left-0 rounded-full transition-all duration-500',
                    isLow
                      ? 'bg-danger-500'
                      : percent <= 60
                        ? 'bg-amber-500'
                        : 'bg-primary-500'
                  )}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )}
          <p className="mt-2 text-[11px] text-[rgb(var(--color-text-muted))]">
            {isPremium
              ? 'Enjoy unlimited AI queries with no token limits.'
              : `Each AI query costs ${costPerQuery} tokens. Resets daily at midnight.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isLow && !isPremium && (
            <Button
              size="sm"
              variant="outline"
              leftIcon={<TrendingDown size={14} />}
              onClick={onBuyTokens}
              className="border-danger-300 text-danger-600 hover:bg-danger-50 dark:border-danger-700 dark:text-danger-400 dark:hover:bg-danger-950"
            >
              Tokens Low!
            </Button>
          )}
          <Button
            size="sm"
            leftIcon={<CreditCard size={14} />}
            onClick={onBuyTokens}
          >
            {isPremium ? 'Manage Plan' : 'Buy Token Pack'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function UsageStats({
  costPerQuery,
  remaining,
}: {
  costPerQuery: number;
  remaining: number;
}) {
  const estimatedQueries = Math.floor(remaining / costPerQuery);

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4 text-center">
        <Clock size={18} className="mx-auto text-primary-500" />
        <p className="mt-2 text-lg font-bold text-[rgb(var(--color-text-primary))]">
          {estimatedQueries}
        </p>
        <p className="text-[10px] text-[rgb(var(--color-text-muted))]">
          Queries Left Today
        </p>
      </div>
      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4 text-center">
        <Coins size={18} className="mx-auto text-amber-500" />
        <p className="mt-2 text-lg font-bold text-[rgb(var(--color-text-primary))]">
          {costPerQuery}
        </p>
        <p className="text-[10px] text-[rgb(var(--color-text-muted))]">
          Tokens Per Query
        </p>
      </div>
      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4 text-center">
        <Zap size={18} className="mx-auto text-accent-500" />
        <p className="mt-2 text-lg font-bold text-[rgb(var(--color-text-primary))]">
          {remaining}
        </p>
        <p className="text-[10px] text-[rgb(var(--color-text-muted))]">
          Tokens Remaining
        </p>
      </div>
    </div>
  );
}

function UsageHistory({
  history,
}: {
  history: {
    id: string;
    feature: string;
    description: string;
    tokenCost: number;
    type: 'debit' | 'credit';
    timestamp: string;
  }[];
}) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] py-12">
        <History
          size={40}
          className="text-[rgb(var(--color-text-muted))] opacity-40"
        />
        <p className="mt-3 text-sm font-medium text-[rgb(var(--color-text-secondary))]">
          No usage yet
        </p>
        <p className="mt-1 text-xs text-[rgb(var(--color-text-muted))]">
          Your token usage history will appear here
        </p>
      </div>
    );
  }

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
      <div className="border-b border-[rgb(var(--color-border))] px-4 py-3">
        <div className="flex items-center gap-2">
          <ListChecks size={16} className="text-primary-500" />
          <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
            Token Usage History
          </h3>
        </div>
        <p className="mt-0.5 text-[11px] text-[rgb(var(--color-text-muted))]">
          Track all your AI feature token expenses and credits
        </p>
      </div>

      <div className="divide-y divide-[rgb(var(--color-border))]">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[rgb(var(--color-surface-elevated))]"
          >
            <div
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                entry.type === 'credit'
                  ? 'bg-accent-100 dark:bg-accent-900'
                  : 'bg-[rgb(var(--color-surface-elevated))]'
              )}
            >
              {entry.type === 'credit' ? (
                <ArrowRight
                  size={14}
                  className="text-accent-600 dark:text-accent-400 rotate-[-45deg]"
                />
              ) : (
                <Coins
                  size={14}
                  className="text-[rgb(var(--color-text-muted))]"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[rgb(var(--color-text-primary))]">
                {entry.feature}
              </p>
              <p className="truncate text-xs text-[rgb(var(--color-text-muted))]">
                {entry.description}
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-0.5">
              <span
                className={cn(
                  'text-xs font-bold',
                  entry.type === 'credit'
                    ? 'text-accent-600 dark:text-accent-400'
                    : 'text-danger-600 dark:text-danger-400'
                )}
              >
                {entry.type === 'credit' ? '+' : '-'}
                {entry.tokenCost}
              </span>
              <span className="text-[10px] text-[rgb(var(--color-text-muted))]">
                {formatTime(entry.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatHistory({
  messages,
  isStreaming,
}: {
  messages: { id: string; role: 'user' | 'assistant'; content: string }[];
  isStreaming: boolean;
}) {
  if (messages.length === 0 && !isStreaming) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] py-12">
        <Bot
          size={40}
          className="text-[rgb(var(--color-text-muted))] opacity-40"
        />
        <p className="mt-3 text-sm font-medium text-[rgb(var(--color-text-secondary))]">
          Start a conversation with the AI Tutor
        </p>
        <p className="mt-1 text-xs text-[rgb(var(--color-text-muted))]">
          Ask anything about your exam preparation
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[50vh] space-y-4 overflow-y-auto rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4 sm:p-5">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={cn(
            'flex gap-3',
            msg.role === 'user' ? 'justify-end' : 'justify-start'
          )}
        >
          {msg.role === 'assistant' && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
              <Bot
                size={16}
                className="text-primary-600 dark:text-primary-400"
              />
            </div>
          )}
          <div
            className={cn(
              'max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed',
              msg.role === 'user'
                ? 'bg-primary-500 text-white'
                : 'border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-primary))]'
            )}
          >
            <div className="whitespace-pre-wrap">{msg.content}</div>
          </div>
          {msg.role === 'user' && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgb(var(--color-surface-elevated))]">
              <User
                size={16}
                className="text-[rgb(var(--color-text-secondary))]"
              />
            </div>
          )}
        </div>
      ))}

      {isStreaming && (
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
            <Bot size={16} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary-400 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary-400 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary-400" />
              </div>
              <span className="text-xs text-[rgb(var(--color-text-muted))]">
                AI is thinking...
              </span>
            </div>
          </div>
        </div>
      )}

      <div ref={{ current: null } as React.RefObject<HTMLDivElement>} />
    </div>
  );
}

function FeatureDetail({
  featureId,
  dailyTokensRemaining,
  isStreaming,
  onUseFeature,
  onBack,
}: {
  featureId: string;
  dailyTokensRemaining: number;
  isStreaming: boolean;
  onUseFeature: (prompt: string) => void;
  onBack: () => void;
}) {
  const [input, setInput] = useState('');
  const feature = featureCards.find((f) => f.id === featureId);

  if (!feature) return null;

  const Icon = feature.icon;

  const placeholders: Record<string, string> = {
    explanation:
      'Paste an MCQ or concept here... e.g., "Explain the difference between fundamental rights and principles of policy"',
    planner:
      'Enter your exam date and subjects... e.g., "CSS 2026 exam in 4 months, need to cover English, GK, and Current Affairs"',
    flashcards:
      'Enter your weak topics... e.g., "Generate flashcards for Pakistan Affairs: constitutional amendments"',
    revision:
      'Enter your weak subjects... e.g., "Weak in Pakistan Affairs and English, exam in 2 weeks"',
    quiz: 'Enter a topic for a 5-question quiz... e.g., "Pakistan Constitutional Amendments" or "Verbal Reasoning"',
    interview:
      'Coming soon - AI Mock Interview will simulate real interview panels.',
  };

  return (
    <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-medium text-[rgb(var(--color-text-secondary))] hover:text-primary-500"
      >
        <ArrowLeft size={12} />
        Back to features
      </button>

      <div className="mt-4 flex items-center gap-3">
        <div
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-xl',
            feature.color
          )}
        >
          <Icon size={20} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
            {feature.title}
          </h3>
          <p className="text-[11px] text-[rgb(var(--color-text-muted))]">
            Costs {feature.tokenCost} tokens per use
          </p>
        </div>
      </div>

      {feature.comingSoon ? (
        <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] py-8">
          <Lock
            size={24}
            className="text-[rgb(var(--color-text-muted))] opacity-50"
          />
          <p className="mt-2 text-sm font-medium text-[rgb(var(--color-text-secondary))]">
            Coming Soon
          </p>
          <p className="mt-1 text-xs text-[rgb(var(--color-text-muted))]">
            This feature is under development and will be available soon.
          </p>
        </div>
      ) : (
        <div className="mt-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholders[featureId] || 'Enter your request...'}
            rows={3}
            className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 py-2.5 text-sm text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-muted))] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="flex items-center gap-1 text-[10px] text-[rgb(var(--color-text-muted))]">
              <Coins size={10} />
              {feature.tokenCost} tokens
            </span>
            <Button
              size="sm"
              leftIcon={<Send size={12} />}
              disabled={
                !input.trim() ||
                isStreaming ||
                dailyTokensRemaining < feature.tokenCost
              }
              onClick={() => {
                if (input.trim()) onUseFeature(input.trim());
              }}
            >
              {featureId === 'quiz' ? 'Generate Quiz' : 'Generate'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function AiQuizModal({
  topic,
  questions,
  answers,
  submitted,
  onSelect,
  onSubmit,
  onClose,
}: {
  topic: string;
  questions: QuizQuestion[];
  answers: Record<string, number>;
  submitted: boolean;
  onSelect: (questionId: string, optionIndex: number) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  const correctCount = submitted
    ? questions.filter((q) => answers[q.id] === q.correctAnswer).length
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] shadow-xl">
        <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <FileQuestion size={18} className="text-primary-500" />
              <h2 className="text-base font-bold text-[rgb(var(--color-text-primary))]">
                AI Quiz
              </h2>
            </div>
            <p className="mt-0.5 text-xs text-[rgb(var(--color-text-muted))]">
              Topic: {topic} &middot; {questions.length} questions
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-surface-elevated))]"
          >
            <XIcon size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {submitted && (
            <div className="mb-5 rounded-lg border border-accent-200 bg-accent-50/50 p-4 text-center dark:border-accent-800 dark:bg-accent-950/50">
              <p className="text-lg font-bold text-accent-600">
                {correctCount} / {questions.length} Correct
              </p>
              <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                {correctCount === questions.length
                  ? 'Perfect score! Excellent work!'
                  : `Accuracy: ${Math.round((correctCount / questions.length) * 100)}%`}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const selected = answers[q.id];
              const showResult = submitted;

              return (
                <div
                  key={q.id}
                  className={cn(
                    'rounded-xl border p-4 transition-all',
                    showResult && selected === q.correctAnswer
                      ? 'border-accent-300 bg-accent-50/30 dark:border-accent-700 dark:bg-accent-950/30'
                      : showResult && selected !== q.correctAnswer
                        ? 'border-danger-300 bg-danger-50/30 dark:border-danger-700 dark:bg-danger-950/30'
                        : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]'
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={cn(
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                        showResult && selected === q.correctAnswer
                          ? 'bg-accent-500 text-white'
                          : showResult && selected !== q.correctAnswer
                            ? 'bg-danger-500 text-white'
                            : 'bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-muted))]'
                      )}
                    >
                      {showResult ? (
                        selected === q.correctAnswer ? (
                          <Check size={12} />
                        ) : (
                          <XIcon size={12} />
                        )
                      ) : (
                        idx + 1
                      )}
                    </span>
                    <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                      {q.question}
                    </p>
                  </div>

                  <div className="mt-3 space-y-2 pl-8">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selected === optIdx;
                      const isCorrectOpt = optIdx === q.correctAnswer;

                      return (
                        <button
                          key={optIdx}
                          disabled={submitted}
                          onClick={() => onSelect(q.id, optIdx)}
                          className={cn(
                            'flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-all',
                            showResult && isCorrectOpt
                              ? 'border-accent-400 bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200'
                              : showResult && isSelected && !isCorrectOpt
                                ? 'border-danger-400 bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200'
                                : isSelected
                                  ? 'border-primary-400 bg-primary-50 text-primary-700 dark:bg-primary-950'
                                  : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] hover:border-primary-300'
                          )}
                        >
                          <span
                            className={cn(
                              'flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[8px] font-bold',
                              showResult && isCorrectOpt
                                ? 'bg-accent-500 text-white'
                                : showResult && isSelected && !isCorrectOpt
                                  ? 'bg-danger-500 text-white'
                                  : isSelected
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-muted))]'
                            )}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {showResult && (
                    <div className="mt-3 ml-8 rounded-lg border border-primary-200 bg-primary-50/50 px-3 py-2 dark:border-primary-800 dark:bg-primary-950/50">
                      <p className="text-[11px] font-semibold text-primary-600 dark:text-primary-400">
                        Explanation
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-[rgb(var(--color-text-secondary))]">
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-[rgb(var(--color-border))] px-5 py-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[rgb(var(--color-text-muted))]">
              {answeredCount}/{questions.length} answered
            </span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Close
              </Button>
              {!submitted ? (
                <Button
                  size="sm"
                  disabled={!allAnswered}
                  onClick={onSubmit}
                  leftIcon={<Check size={12} />}
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={onClose}
                  leftIcon={<ArrowRight size={12} />}
                >
                  Done
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PricingModal({
  isPremium,
  onBuy,
  onUpgrade,
  onClose,
}: {
  isPremium: boolean;
  onBuy: (tokens: number) => void;
  onUpgrade: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins size={20} className="text-primary-500" />
            <h2 className="text-lg font-bold text-[rgb(var(--color-text-primary))]">
              Token Packs & Premium
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-surface-elevated))]"
          >
            <XIcon size={18} />
          </button>
        </div>

        <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))]">
          Choose a token pack to continue using the AI Tutor, or upgrade to
          Premium for unlimited access.
        </p>

        <div className="mt-5 space-y-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                'relative flex items-center justify-between rounded-xl border p-4 transition-all',
                plan.id === 'premium' && isPremium
                  ? 'border-amber-300 bg-amber-50/50 dark:border-amber-700 dark:bg-amber-950/50'
                  : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] hover:border-primary-300 dark:hover:border-primary-700'
              )}
            >
              {plan.badge && (
                <span
                  className={cn(
                    'absolute -top-2.5 left-4 rounded-full px-2 py-0.5 text-[10px] font-bold',
                    plan.id === 'premium'
                      ? 'bg-amber-500 text-white'
                      : 'bg-primary-500 text-white'
                  )}
                >
                  {plan.badge}
                </span>
              )}

              <div>
                <h4 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                  {plan.name}
                </h4>
                <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                  {plan.tokens >= 9999
                    ? 'Unlimited queries'
                    : `${plan.tokens.toLocaleString()} tokens`}
                </p>
                <p className="mt-0.5 text-[10px] text-[rgb(var(--color-text-muted))]">
                  {plan.pricePerToken}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[rgb(var(--color-text-primary))]">
                  {plan.price}
                </span>
                {plan.id === 'premium' ? (
                  <Button
                    size="sm"
                    variant={isPremium ? 'ghost' : 'primary'}
                    disabled={isPremium}
                    leftIcon={
                      isPremium ? <Check size={12} /> : <Crown size={12} />
                    }
                    onClick={onUpgrade}
                  >
                    {isPremium ? 'Current Plan' : 'Upgrade'}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<CreditCard size={12} />}
                    onClick={() => onBuy(plan.tokens)}
                  >
                    Buy
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {isPremium && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/50">
            <div className="flex items-center gap-2">
              <Crown size={14} className="text-amber-500" />
              <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                You&apos;re on the Premium plan with unlimited AI queries.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
