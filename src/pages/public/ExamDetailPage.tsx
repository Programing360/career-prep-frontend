import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Calendar,
  Target,
  Clock,
  Award,
  Play,
  Heart,
  Star,
  LayoutGrid,
  BookOpen,
  FileText,
  Zap,
  Map,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import {
  getExamBySlug,
  getExamRoadmap,
  getExamSyllabus,
} from '@/services/examService';
import type { ExamRoadmapData, ExamSyllabusData } from '@/services/examService';
import {
  categoryColorMap,
  mapDirectoryExamToExamData,
  mapRoadmapDataToPhases,
  mapSyllabusSubjectsToExamData,
  type ExamData,
} from '@/components/exams/examDetailData';
import { LeaderboardCompactWidget } from '@/components/leaderboard/LeaderboardCompactWidget';

const OverviewTab = lazy(() =>
  import('@/components/exams/tabs/OverviewTab').then((m) => ({
    default: m.OverviewTab,
  }))
);
const SyllabusTab = lazy(() =>
  import('@/components/exams/tabs/SyllabusTab').then((m) => ({
    default: m.SyllabusTab,
  }))
);
const PastPapersTab = lazy(() =>
  import('@/components/exams/tabs/PastPapersTab').then((m) => ({
    default: m.PastPapersTab,
  }))
);
const MockTestTab = lazy(() =>
  import('@/components/exams/tabs/MockTestTab').then((m) => ({
    default: m.MockTestTab,
  }))
);
const RoadmapTab = lazy(() =>
  import('@/components/exams/tabs/RoadmapTab').then((m) => ({
    default: m.RoadmapTab,
  }))
);

type TabId = 'overview' | 'syllabus' | 'past-papers' | 'mock-test' | 'roadmap';

interface TabDef {
  id: TabId;
  label: string;
  icon: typeof LayoutGrid;
}

const TABS: TabDef[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'syllabus', label: 'Syllabus', icon: BookOpen },
  { id: 'past-papers', label: 'Past Papers', icon: FileText },
  { id: 'mock-test', label: 'Mock Test', icon: Zap },
  { id: 'roadmap', label: 'Roadmap', icon: Map },
];

function isValidTab(hash: string): hash is TabId {
  return TABS.some((t) => t.id === hash);
}

function TabSkeleton() {
  return (
    <div className="space-y-4 py-4">
      <div className="h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-4 w-72 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
          />
        ))}
      </div>
    </div>
  );
}

function SEOHead({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} | MeritPrep`;

    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute('content');
    metaDesc?.setAttribute('content', description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    const prevOgTitle = ogTitle?.getAttribute('content');
    ogTitle?.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    const prevOgDesc = ogDesc?.getAttribute('content');
    ogDesc?.setAttribute('content', description);

    return () => {
      document.title = prevTitle;
      metaDesc?.setAttribute('content', prevDesc ?? '');
      ogTitle?.setAttribute('content', prevOgTitle ?? '');
      ogDesc?.setAttribute('content', prevOgDesc ?? '');
    };
  }, [title, description]);

  return null;
}

function JsonLdScript({ exam }: { exam: ExamData }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: exam.title,
    description: exam.description,
    provider: {
      '@type': 'Organization',
      name: exam.agency,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      duration: `P${exam.duration}M`,
      courseWorkload: `${exam.totalQuestions} MCQs`,
    },
    occupationalCredentialAwarded: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'competitive exam',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function ExamDetailPage({
  slug,
  isPremiumView = false,
}: {
  slug: string;
  isPremiumView?: boolean;
}) {
  const [isFollowed, setIsFollowed] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    const hash = window.location.hash.replace('#', '');
    return isValidTab(hash) ? hash : 'overview';
  });
  const tabListRef = useRef<HTMLDivElement>(null);

  const [exam, setExam] = useState<ExamData | null>(null);
  const [syllabus, setSyllabus] = useState<ExamSyllabusData | null>(null);
  const [roadmap, setRoadmap] = useState<ExamRoadmapData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    getExamBySlug(slug)
      .then((res) => {
        if (!cancelled) setExam(mapDirectoryExamToExamData(res.data));
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load the exam details.'
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    getExamSyllabus(slug)
      .then((res) => {
        if (!cancelled) setSyllabus(res.data.syllabus);
      })
      .catch(() => {
        // No published syllabus for this exam yet — fall back to mock data.
      });
    getExamRoadmap(slug)
      .then((res) => {
        if (!cancelled) setRoadmap(res.data.roadmap);
      })
      .catch(() => {
        // No published roadmap for this exam yet — fall back to mock data.
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const resolvedError = !slug ? 'No exam specified.' : error;
  const loading = !exam && !resolvedError;
  const catColor =
    categoryColorMap[exam?.category ?? 'other'] ?? categoryColorMap.other;

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (isValidTab(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleTabChange = useCallback((tabId: TabId) => {
    setActiveTab(tabId);
    history.replaceState(null, '', `#${tabId}`);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIndex = TABS.findIndex((t) => t.id === activeTab);
      let nextIndex: number;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % TABS.length;
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIndex = TABS.length - 1;
      } else {
        return;
      }

      handleTabChange(TABS[nextIndex].id);

      const buttons =
        tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      buttons?.[nextIndex]?.focus();
    },
    [activeTab, handleTabChange]
  );

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="h-72 animate-pulse bg-gray-100 dark:bg-gray-800" />
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <TabSkeleton />
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md text-center">
          <BookOpen
            size={48}
            className="mx-auto text-gray-300 dark:text-gray-600"
          />
          <h1 className="mt-4 text-xl font-bold font-heading text-gray-900 dark:text-white">
            Exam not found
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {resolvedError || 'The requested exam could not be loaded.'}
          </p>
          <Link
            to={ROUTES.EXAMS}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700"
          >
            Browse All Exams
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab exam={exam} />;
      case 'syllabus':
        return (
          <SyllabusTab
            exam={exam}
            subjects={
              syllabus ? mapSyllabusSubjectsToExamData(syllabus) : undefined
            }
          />
        );
      case 'past-papers':
        return <PastPapersTab exam={exam} />;
      case 'mock-test':
        return <MockTestTab exam={exam} />;
      case 'roadmap':
        return (
          <RoadmapTab
            exam={exam}
            phases={roadmap ? mapRoadmapDataToPhases(roadmap) : undefined}
            title={roadmap?.title}
            strategySummary={roadmap?.overallStrategySummary}
          />
        );
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead title={exam.title} description={exam.description} />
      <JsonLdScript exam={exam} />

      {/* â”€â”€ Hero Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="relative overflow-hidden border-b border-white/20 bg-white/70 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-400/10 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Link
                to={ROUTES.EXAMS}
                className="hover:text-gray-700 dark:hover:text-gray-200"
              >
                Exams
              </Link>
              <ChevronRight size={12} />
              <span
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                  catColor
                )}
              >
                {exam.agency}
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              {exam.title}
            </h1>

            <p className="mt-3 max-w-3xl text-base text-gray-600 dark:text-gray-300 sm:text-lg">
              {exam.description}
            </p>

            {/* Quick Stats */}
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { icon: Calendar, label: `Target Year ${exam.year}` },
                {
                  icon: Target,
                  label: `${exam.totalQuestions.toLocaleString()} MCQs`,
                },
                { icon: Clock, label: `${exam.duration} min` },
                { icon: Award, label: `${exam.totalMarks} Marks` },
              ].map((stat) => (
                <span
                  key={stat.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/60 px-3 py-1.5 text-xs font-medium text-gray-700 backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-800/60 dark:text-gray-300"
                >
                  <stat.icon size={13} />
                  {stat.label}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to={ROUTES.PRACTICE}
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors',
                  'bg-gray-900 hover:bg-gray-800',
                  'dark:bg-primary-600 dark:hover:bg-primary-700'
                )}
              >
                <Play size={16} />
                Start Free Practice
              </Link>

              {isPremiumView && (
                <button
                  onClick={() => setIsFollowed(!isFollowed)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-medium transition-all',
                    isFollowed
                      ? 'border-primary-300 bg-primary-50 text-primary-700 dark:border-primary-700 dark:bg-primary-950 dark:text-primary-300'
                      : 'border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-primary-600'
                  )}
                >
                  <Heart
                    size={16}
                    className={isFollowed ? 'fill-current' : ''}
                  />
                  {isFollowed ? 'Following' : 'Follow Exam'}
                </button>
              )}

              <span className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <Star size={14} className="fill-primary-400 text-primary-400" />
                4.8 rating by 2,400+ students
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* â”€â”€ Sticky Tab Bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div
        ref={tabListRef}
        role="tablist"
        aria-label="Exam detail tabs"
        onKeyDown={handleKeyDown}
        className="sticky  z-30 border-b border-white/20 bg-white/70 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="-mb-px flex gap-1 overflow-x-auto md: overflow-hidden ">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const TabIcon = tab.icon;

              return (
                <button
                  key={tab.id}
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    'relative inline-flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors hover:bg-slate-500/30 rounded-sm transition-all duration-300',
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  )}
                >
                  <TabIcon size={15} />
                  {tab.label}

                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-x-0 -bottom-px h-0.5 bg-primary-500"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* â”€â”€ Tab Content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Suspense fallback={<TabSkeleton />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              role="tabpanel"
              id={`panel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
              tabIndex={0}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </div>

      {/* â”€â”€ Leaderboard Widget â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="mx-auto max-w-5xl px-4 pb-8 sm:px-6 lg:px-8">
        <LeaderboardCompactWidget examSlug={slug} examTitle={exam.title} />
      </div>

      {/* â”€â”€ Sticky Registration CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {/* Desktop: bottom-fixed banner */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 hidden lg:block">
        <div className="mx-auto max-w-5xl px-4 pb-4">
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5, ease: 'easeOut' }}
            className="pointer-events-auto relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-5 shadow-2xl dark:border-gray-700/50"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary-500/20 blur-3xl" />
            <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl" />

            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Award size={20} className="text-primary-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Unlock Full Preparation
                  </h4>
                  <p className="mt-0.5 max-w-md text-xs text-gray-400">
                    Access all {exam.totalQuestions.toLocaleString()}+ MCQs, AI
                    explanations, mock tests, and progress tracking.
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <div className="hidden items-center gap-3 text-[11px] text-gray-400 xl:flex">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={11} className="text-emerald-400" />
                    2,000+ MCQs
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={11} className="text-emerald-400" />
                    AI Explanations
                  </span>
                </div>
                <Link
                  to={ROUTES.REGISTER}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors',
                    'bg-white text-gray-900 hover:bg-gray-100',
                    'dark:bg-primary-600 dark:text-white dark:hover:bg-primary-700'
                  )}
                >
                  Get Started
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile: bottom-fixed sticky strip */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 lg:hidden">
        <div className="pointer-events-auto border-t border-white/20 bg-white/90 px-4 py-3 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/90">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                Unlock Full Preparation
              </p>
              <p className="truncate text-[11px] text-gray-500 dark:text-gray-400">
                All MCQs, mock tests & AI explanations
              </p>
            </div>
            <Link
              to={ROUTES.REGISTER}
              className={cn(
                'inline-flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                'bg-gray-900 text-white hover:bg-gray-800',
                'dark:bg-primary-600 dark:hover:bg-primary-700'
              )}
            >
              Get Started
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Spacer for mobile sticky CTA */}
      <div className="h-20 lg:hidden" />
      {/* Spacer for desktop sticky CTA */}
      <div className="hidden lg:block lg:h-24" />
    </div>
  );
}
