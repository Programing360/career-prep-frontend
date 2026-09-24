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
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { RootState } from '@/store/store';
import type { QuizQuestion } from '@/store/slices/aiTutorSlice';
import {
  sendMessage,
  receiveResponse,
  setChatError,
  setActiveView,
  setActiveFeature,
  clearChat,
  buyTokenPack,
  upgradeToPremium,
  logTokenUsage,
  startQuiz,
  answerQuizQuestion,
  submitQuiz,
  closeQuiz,
  setSessionId,
  setTokensRemaining,
} from '@/store/slices/aiTutorSlice';
import { chatWithTutor, explainMcq } from '@/services/aiApi';
import { Link } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const quickPromptChips = [
  'Explain the CSS Officer Selection Process',
  "Summarize Pakistan's 1973 Constitution",
  'Difference between Direct and Indirect Tax',
  'Tips for Verbal Reasoning MCQs',
];

/** Offline fallback quiz bank – shown when the quiz feature is triggered.
 *  A real `/ai-tutor/generate-quiz` endpoint does not exist yet, so we ship
 *  curated questions for the most common competitive exam topics.
 */
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
    tokenCost: 10,
  },
  {
    id: 'flashcards',
    icon: Layers,
    title: 'AI Flashcards Generator',
    description:
      'Create quick revision flashcards for your weak topics with spaced repetition scheduling.',
    color:
      'bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400',
    tokenCost: 10,
  },
  {
    id: 'revision',
    icon: RotateCcw,
    title: 'AI Revision Planner',
    description:
      'Generates a quick review schedule for weak subjects before exams based on your progress.',
    color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400',
    tokenCost: 10,
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

// ---------------------------------------------------------------------------
// Feature-specific system prompt prefixes sent to /ai-tutor/chat
// ---------------------------------------------------------------------------
const featurePromptPrefixes: Record<string, string> = {
  planner:
    '[AI Study Planner] Generate a detailed, day-by-day study plan for the following target: ',
  flashcards:
    '[AI Flashcards] Generate 10 concise flashcard Q&A pairs for the following topic: ',
  revision:
    '[AI Revision Planner] Create a focused revision schedule for the following weak areas: ',
  explanation:
    '[AI Explanation] Provide a thorough, exam-focused explanation for the following concept or MCQ: ',
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function AiTutorPage() {
  const dispatch = useDispatch();
  const {
    tokensRemaining,
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
    sessionId,
    chatError,
  } = useSelector((state: RootState) => state.aiTutor);

  // Read the real token balance from the authenticated user profile on mount
  const authUser = useSelector((state: RootState) => state.auth.user);

  const [promptInput, setPromptInput] = useState('');
  const [pricingOpen, setPricingOpen] = useState(false);
  const [activeFeature, setLocalActiveFeature] = useState<string | null>(null);
  const [homeTab, setHomeTab] = useState<'features' | 'usage'>('features');
  const quizModalOpen = quizActive && quizQuestions.length > 0;
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Seed token balance from user profile once on mount (avoids a dedicated fetch)
  useEffect(() => {
    if (tokensRemaining === null && authUser?.aiTokenBalance !== undefined) {
      dispatch(setTokensRemaining(authUser.aiTokenBalance));
    }
  }, [authUser, tokensRemaining, dispatch]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isStreaming]);

  // Resolved display tokens (fallback to 0 if not yet loaded)
  const displayTokens = tokensRemaining ?? authUser?.aiTokenBalance ?? 0;
  const tokenPercent = Math.round((displayTokens / 500) * 100);
  const isLowTokens = displayTokens > 0 && tokenPercent <= 30;
  const hasNoTokens = displayTokens <= 0 && tokensRemaining !== null;

  // ---------------------------------------------------------------------------
  // Chat send – calls real backend
  // ---------------------------------------------------------------------------
  const handleSend = useCallback(
    async (text?: string) => {
      const content = text || promptInput.trim();
      if (!content || isStreaming) return;

      if (!isPremium && displayTokens < tokenCostPerQuery) {
        setPricingOpen(true);
        return;
      }

      // Optimistically add user message
      dispatch(sendMessage(content));
      setPromptInput('');

      try {
        const data = await chatWithTutor({
          prompt: content,
          sessionId,
        });

        dispatch(
          receiveResponse({
            reply: data.reply,
            tokensRemaining: data.tokensRemaining,
          })
        );
        dispatch(setSessionId(data.sessionId));
        dispatch(
          logTokenUsage({
            feature: 'AI Chat',
            description: content.slice(0, 60),
            tokenCost: tokenCostPerQuery,
          })
        );
      } catch (err: unknown) {
        const error = err as { message?: string; status?: number };
        // 403 → out of tokens
        if (
          typeof error === 'object' &&
          error !== null &&
          (String(error.message).includes('403') ||
            String(error.message).toLowerCase().includes('insufficient') ||
            String(error.message).toLowerCase().includes('token'))
        ) {
          dispatch(
            setChatError(
              'You have run out of AI tokens. Please buy more to continue.'
            )
          );
          setPricingOpen(true);
        } else {
          dispatch(
            setChatError(
              error?.message ||
                'Failed to get a response. Please check your connection and try again.'
            )
          );
        }
      }
    },
    [
      promptInput,
      isStreaming,
      displayTokens,
      tokenCostPerQuery,
      isPremium,
      sessionId,
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

  // ---------------------------------------------------------------------------
  // Quiz generation – uses local bank (no quiz endpoint on backend yet)
  // ---------------------------------------------------------------------------
  const handleGenerateQuiz = useCallback(
    (topic: string) => {
      if (!isPremium && displayTokens < tokenCostPerQuery) {
        setPricingOpen(true);
        return;
      }

      // Log usage optimistically (tokens will be deducted via chatWithTutor below)
      dispatch(
        logTokenUsage({
          feature: 'AI Quiz',
          description: `Quiz on "${topic.slice(0, 50)}"`,
          tokenCost: tokenCostPerQuery,
        })
      );

      const questions = getQuizForTopic(topic);
      dispatch(startQuiz({ topic, questions }));

      // Also send the topic to the AI for a richer explanation (fires in background)
      void chatWithTutor({
        prompt: `[AI Quiz] Generate exam-style insight and tips for the topic: ${topic}`,
        sessionId,
      })
        .then((data) => {
          dispatch(setTokensRemaining(data.tokensRemaining));
          dispatch(setSessionId(data.sessionId));
        })
        .catch(() => {
          // Silently ignore – quiz UI already shown from local bank
        });
    },
    [displayTokens, tokenCostPerQuery, isPremium, sessionId, dispatch]
  );

  // ---------------------------------------------------------------------------
  // Feature use – routes through chatWithTutor with a prefix
  // ---------------------------------------------------------------------------
  const handleFeatureUse = useCallback(
    async (featureId: string, userInput: string) => {
      const card = featureCards.find((f) => f.id === featureId);
      if (!card || card.comingSoon) return;

      if (!isPremium && displayTokens < card.tokenCost) {
        setPricingOpen(true);
        return;
      }

      if (featureId === 'quiz') {
        handleGenerateQuiz(userInput);
        return;
      }

      // For explanation: detect MCQ pattern and try the dedicated endpoint first
      if (featureId === 'explanation') {
        const mcqPattern = /correct\s*answer\s*[:=]/i;
        if (mcqPattern.test(userInput)) {
          // User pasted a structured MCQ – call explain-mcq
          dispatch(setActiveView('chat'));
          setLocalActiveFeature(null);
          dispatch(setActiveFeature(null));
          dispatch(sendMessage(userInput));

          try {
            const data = await explainMcq({
              question: userInput,
              options: [],
              correctAnswer: '',
            });
            dispatch(
              receiveResponse({
                reply: data.explanation,
                tokensRemaining: data.tokensRemaining,
              })
            );
            dispatch(
              logTokenUsage({
                feature: card.title,
                description: userInput.slice(0, 60),
                tokenCost: card.tokenCost,
              })
            );
          } catch (err: unknown) {
            const error = err as { message?: string };
            dispatch(
              setChatError(error?.message || 'Explanation request failed.')
            );
          }
          return;
        }
      }

      // Generic path – prefix the prompt and route through chat
      const prefix = featurePromptPrefixes[featureId] || '';
      const fullPrompt = prefix + userInput;

      dispatch(setActiveView('chat'));
      setLocalActiveFeature(null);
      dispatch(setActiveFeature(null));
      dispatch(sendMessage(fullPrompt));

      try {
        const data = await chatWithTutor({ prompt: fullPrompt, sessionId });
        dispatch(
          receiveResponse({
            reply: data.reply,
            tokensRemaining: data.tokensRemaining,
          })
        );
        dispatch(setSessionId(data.sessionId));
        dispatch(
          logTokenUsage({
            feature: card.title,
            description: userInput.slice(0, 60),
            tokenCost: card.tokenCost,
          })
        );
      } catch (err: unknown) {
        const error = err as { message?: string };
        if (
          String(error?.message).toLowerCase().includes('insufficient') ||
          String(error?.message).toLowerCase().includes('token')
        ) {
          dispatch(
            setChatError('Insufficient tokens. Please buy more to continue.')
          );
          setPricingOpen(true);
        } else {
          dispatch(
            setChatError(
              error?.message || 'AI request failed. Please try again.'
            )
          );
        }
      }
    },
    [displayTokens, isPremium, sessionId, dispatch, handleGenerateQuiz]
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
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
              Powered by Google AI · Ask anything about your exam preparation
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
        remaining={displayTokens}
        total={500}
        percent={isPremium ? 100 : Math.min(tokenPercent, 100)}
        isLow={isLowTokens}
        hasNoTokens={hasNoTokens}
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
                        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary-100 px-2 py-0.5 text-[9px] font-bold text-primary-700 dark:bg-primary-900 dark:text-primary-300">
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
                remaining={displayTokens}
              />
            </>
          )}

          {homeTab === 'usage' && <UsageHistory history={usageHistory} />}
        </div>
      )}

      {activeView === 'home' && activeFeature && (
        <FeatureDetail
          featureId={activeFeature}
          tokensRemaining={displayTokens}
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
          <ChatHistory
            messages={chatHistory}
            isStreaming={isStreaming}
            chatError={chatError}
            onDismissError={() => dispatch(setChatError(null))}
          />

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
                    isStreaming ||
                    (!isPremium && displayTokens < tokenCostPerQuery)
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
                    !isPremium && displayTokens < tokenCostPerQuery
                      ? 'No tokens remaining. Buy more to continue.'
                      : 'Ask the AI Tutor anything...'
                  }
                  disabled={
                    isStreaming ||
                    (!isPremium && displayTokens < tokenCostPerQuery)
                  }
                  className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-4 py-2.5 pr-12 text-sm text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-muted))] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={
                    !promptInput.trim() ||
                    isStreaming ||
                    (!isPremium && displayTokens < tokenCostPerQuery)
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
          onClose={() => dispatch(closeQuiz())}
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

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TokenHeader({
  remaining,
  total,
  percent,
  isLow,
  hasNoTokens,
  isPremium,
  costPerQuery,
  onBuyTokens,
}: {
  remaining: number;
  total: number;
  percent: number;
  isLow: boolean;
  hasNoTokens: boolean;
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
              className={cn(
                isLow || hasNoTokens ? 'text-danger-500' : 'text-primary-500'
              )}
            />
            <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
              {isPremium
                ? 'Unlimited'
                : `${remaining.toLocaleString()} AI Tokens Remaining`}
            </h3>
            {isPremium && (
              <span className="flex items-center gap-1 rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-bold text-primary-700 dark:bg-primary-900 dark:text-primary-300">
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
                <span>{Math.min(percent, 100)}% remaining</span>
              </div>
              <div className="relative mt-1 h-2 w-full overflow-hidden rounded-full bg-[rgb(var(--color-surface-elevated))]">
                <div
                  className={cn(
                    'absolute inset-y-0 left-0 rounded-full transition-all duration-500',
                    hasNoTokens
                      ? 'bg-danger-500'
                      : isLow
                        ? 'bg-amber-500'
                        : 'bg-primary-500'
                  )}
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
              </div>
            </div>
          )}
          <p className="mt-2 text-[11px] text-[rgb(var(--color-text-muted))]">
            {isPremium
              ? 'Enjoy unlimited AI queries with no token limits.'
              : `Each AI query costs ${costPerQuery} tokens.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(isLow || hasNoTokens) && !isPremium && (
            <Button
              size="sm"
              variant="outline"
              leftIcon={<TrendingDown size={14} />}
              onClick={onBuyTokens}
              className="border-danger-300 text-danger-600 hover:bg-danger-50 dark:border-danger-700 dark:text-danger-400 dark:hover:bg-danger-950"
            >
              {hasNoTokens ? 'Out of Tokens!' : 'Tokens Low!'}
            </Button>
          )}
          <Button
            size="sm"
            leftIcon={<CreditCard size={14} />}
            // onClick={onBuyTokens}
          >
            {isPremium ? (
              'Manage Plan'
            ) : (
              <Link to={'/premium'}>
                <span>Buy Token Pack</span>
              </Link>
            )}
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
  const estimatedQueries =
    costPerQuery > 0 ? Math.floor(remaining / costPerQuery) : 0;

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4 text-center">
        <Clock size={18} className="mx-auto text-primary-500" />
        <p className="mt-2 text-lg font-bold text-[rgb(var(--color-text-primary))]">
          {estimatedQueries}
        </p>
        <p className="text-[10px] text-[rgb(var(--color-text-muted))]">
          Queries Left
        </p>
      </div>
      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4 text-center">
        <Coins size={18} className="mx-auto text-primary-500" />
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
  chatError,
  onDismissError,
}: {
  messages: { id: string; role: 'user' | 'assistant'; content: string }[];
  isStreaming: boolean;
  chatError: string | null;
  onDismissError: () => void;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  if (messages.length === 0 && !isStreaming && !chatError) {
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

      {chatError && (
        <div className="flex items-start gap-2 rounded-xl border border-danger-300 bg-danger-50 px-4 py-3 dark:border-danger-700 dark:bg-danger-950/40">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-danger-500" />
          <p className="flex-1 text-xs text-danger-700 dark:text-danger-300">
            {chatError}
          </p>
          <button
            onClick={onDismissError}
            className="shrink-0 text-danger-400 hover:text-danger-600"
          >
            <XIcon size={14} />
          </button>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}

function FeatureDetail({
  featureId,
  tokensRemaining,
  isStreaming,
  onUseFeature,
  onBack,
}: {
  featureId: string;
  tokensRemaining: number;
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
                tokensRemaining < feature.tokenCost
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
              Token Packs &amp; Premium
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
                  ? 'border-primary-300 bg-primary-50/50 dark:border-primary-700 dark:bg-primary-950/50'
                  : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] hover:border-primary-300 dark:hover:border-primary-700'
              )}
            >
              {plan.badge && (
                <span className="absolute -top-2.5 left-4 rounded-full bg-primary-500 px-2 py-0.5 text-[10px] font-bold text-white">
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
          <div className="mt-4 rounded-lg border border-primary-200 bg-primary-50/50 px-4 py-3 dark:border-primary-800 dark:bg-primary-950/50">
            <div className="flex items-center gap-2">
              <Crown size={14} className="text-primary-500" />
              <p className="text-xs font-medium text-primary-700 dark:text-primary-300">
                You're on the Premium plan with unlimited AI queries.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
