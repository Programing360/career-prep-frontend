import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, RefreshCcw } from 'lucide-react';
import { ExamCard, type ExamCardData } from '@/components/exams/ExamCard';
import {
  ExamFilters,
  type ExamFiltersState,
  type Jurisdiction,
  type PostGrade,
  type SortOption,
} from '@/components/exams/ExamFilters';
import { CurrentAffairsCompactWidget } from '@/components/current-affairs/CurrentAffairsCompactWidget';
import { DailyQuizCompactWidget } from '@/components/daily-quiz/DailyQuizCompactWidget';

const initialFilters: ExamFiltersState = {
  search: '',
  jurisdiction: 'all',
  postGrade: 'all',
  sector: 'all',
  sort: 'popularity',
};

const MOCK_EXAMS: ExamCardData[] = [
  {
    id: '1',
    slug: 'fpsc-css-2026',
    title: 'CSS (Central Superior Services) 2026',
    agency: 'FPSC',
    agencyKey: 'FPSC',
    grade: 'BPS-17',
    year: '2026',
    questionCount: 1200,
    category: 'competitive',
    sector: 'competitive',
    popularity: 98,
    verified: true,
  },
  {
    id: '2',
    slug: 'fpsc-assistant-director',
    title: 'Assistant Director (BS-17)',
    agency: 'FPSC',
    agencyKey: 'FPSC',
    grade: 'BPS-17',
    year: '2026',
    questionCount: 200,
    category: 'general',
    sector: 'general-recruitment',
    popularity: 85,
    verified: true,
  },
  {
    id: '3',
    slug: 'ppsc-english-lecturer',
    title: 'Lecturer English (BS-17)',
    agency: 'PPSC',
    agencyKey: 'PPSC',
    grade: 'BPS-17',
    year: '2026',
    questionCount: 100,
    category: 'general',
    sector: 'general-recruitment',
    popularity: 78,
    verified: true,
  },
  {
    id: '4',
    slug: 'ppsc-inspector-police',
    title: 'Inspector Police (BS-17)',
    agency: 'PPSC',
    agencyKey: 'PPSC',
    grade: 'BPS-17',
    year: '2026',
    questionCount: 100,
    category: 'general',
    sector: 'uniformed-forces',
    popularity: 92,
    verified: true,
  },
  {
    id: '5',
    slug: 'kppsc-pts-16',
    title: 'Provincial Management Service PMS-16',
    agency: 'KPPSC',
    agencyKey: 'KPPSC',
    grade: 'BPS-16',
    year: '2026',
    questionCount: 150,
    category: 'competitive',
    sector: 'competitive',
    popularity: 72,
    verified: true,
  },
  {
    id: '6',
    slug: 'bpsc-assistant',
    title: 'Assistant (BS-16)',
    agency: 'BPSC',
    agencyKey: 'BPSC',
    grade: 'BPS-16',
    year: '2025',
    questionCount: 120,
    category: 'general',
    sector: 'general-recruitment',
    popularity: 65,
    verified: false,
  },
  {
    id: '7',
    slug: 'spsc-sub-inspector',
    title: 'Sub-Inspector (BS-14)',
    agency: 'SPSC',
    agencyKey: 'SPSC',
    grade: 'BPS-14',
    year: '2026',
    questionCount: 80,
    category: 'general',
    sector: 'uniformed-forces',
    popularity: 70,
    verified: false,
  },
  {
    id: '8',
    slug: 'nts-gat-general',
    title: 'NTS GAT General 2026',
    agency: 'NTS',
    agencyKey: 'NTS',
    grade: 'BPS-17',
    year: '2026',
    questionCount: 100,
    category: 'general',
    sector: 'general-recruitment',
    popularity: 88,
    verified: true,
  },
  {
    id: '9',
    slug: 'nts-gat-subject',
    title: 'NTS GAT Subject 2026',
    agency: 'NTS',
    agencyKey: 'NTS',
    grade: 'BPS-17',
    year: '2026',
    questionCount: 100,
    category: 'competitive',
    sector: 'competitive',
    popularity: 74,
    verified: true,
  },
  {
    id: '10',
    slug: 'ots-technical-officer',
    title: 'Technical Officer (BS-17)',
    agency: 'OTS',
    agencyKey: 'OTS',
    grade: 'BPS-17',
    year: '2026',
    questionCount: 80,
    category: 'technical',
    sector: 'technical',
    popularity: 55,
    verified: false,
  },
  {
    id: '11',
    slug: 'pts-armed-forces-graduate',
    title: 'Armed Forces Graduate Assessment',
    agency: 'PTS',
    agencyKey: 'PTS',
    grade: 'BPS-16',
    year: '2026',
    questionCount: 150,
    category: 'general',
    sector: 'armed-forces',
    popularity: 80,
    verified: true,
  },
  {
    id: '12',
    slug: 'etea-cts-2026',
    title: 'Combined Testing Service CTS',
    agency: 'ETEA',
    agencyKey: 'ETEA',
    grade: 'BPS-14',
    year: '2026',
    questionCount: 90,
    category: 'general',
    sector: 'general-recruitment',
    popularity: 60,
    verified: false,
  },
  {
    id: '13',
    slug: 'fpsc-css-pms-preliminary',
    title: 'CSS/PMS Preliminary Screening Test',
    agency: 'FPSC',
    agencyKey: 'FPSC',
    grade: 'BPS-17',
    year: '2026',
    questionCount: 200,
    category: 'competitive',
    sector: 'competitive',
    popularity: 95,
    verified: true,
  },
  {
    id: '14',
    slug: 'ppsc-scientific-officer',
    title: 'Scientific Officer (BS-17)',
    agency: 'PPSC',
    agencyKey: 'PPSC',
    grade: 'BPS-17',
    year: '2026',
    questionCount: 100,
    category: 'technical',
    sector: 'technical',
    popularity: 50,
    verified: true,
  },
  {
    id: '15',
    slug: 'kppsc-steno-typist',
    title: 'Steno Typist (BS-14)',
    agency: 'KPPSC',
    agencyKey: 'KPPSC',
    grade: 'BPS-14',
    year: '2025',
    questionCount: 80,
    category: 'general',
    sector: 'general-recruitment',
    popularity: 42,
    verified: false,
  },
  {
    id: '16',
    slug: 'nts-ople-2026',
    title: 'NTS Overseas Pakistanis Lateral Entry',
    agency: 'NTS',
    agencyKey: 'NTS',
    grade: 'BPS-17',
    year: '2026',
    questionCount: 100,
    category: 'general',
    sector: 'general-recruitment',
    popularity: 38,
    verified: true,
  },
  {
    id: '17',
    slug: 'fpse-educator-14',
    title: 'Educator (BS-14)',
    agency: 'FPSC',
    agencyKey: 'FPSC',
    grade: 'BPS-14',
    year: '2026',
    questionCount: 80,
    category: 'general',
    sector: 'general-recruitment',
    popularity: 68,
    verified: true,
  },
  {
    id: '18',
    slug: 'ppsc-assistant-director',
    title: 'Assistant Director Planning (BS-17)',
    agency: 'PPSC',
    agencyKey: 'PPSC',
    grade: 'BPS-17',
    year: '2026',
    questionCount: 100,
    category: 'technical',
    sector: 'technical',
    popularity: 45,
    verified: true,
  },
  {
    id: '19',
    slug: 'spsc-junior-clerk',
    title: 'Junior Clerk (BS-11)',
    agency: 'SPSC',
    agencyKey: 'SPSC',
    grade: 'BPS-11',
    year: '2025',
    questionCount: 80,
    category: 'general',
    sector: 'general-recruitment',
    popularity: 52,
    verified: false,
  },
  {
    id: '20',
    slug: 'nts-seho-screening',
    title: 'NTS SEHO Screening Test',
    agency: 'NTS',
    agencyKey: 'NTS',
    grade: 'BPS-15',
    year: '2026',
    questionCount: 100,
    category: 'general',
    sector: 'general-recruitment',
    popularity: 48,
    verified: true,
  },
];

function SkeletonCard() {
  return (
    <div className="flex h-full flex-col rounded-xl border backdrop-blur-md border-white/20 bg-white/70 dark:border-gray-800/50 dark:bg-gray-900/70">
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between">
          <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-14 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-1 h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-3 flex gap-2">
          <div className="h-6 w-14 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
          <div className="h-6 w-12 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
          <div className="h-6 w-10 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
      <div className="border-t border-[rgb(var(--color-border))] px-5 py-3">
        <div className="h-8 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}

export default function ExamCategoriesPage() {
  const [filters, setFilters] = useState<ExamFiltersState>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const handleFilterChange = useCallback((next: ExamFiltersState) => {
    setFilters(next);
  }, []);

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase();

    const result = MOCK_EXAMS.filter((exam) => {
      if (
        q &&
        !exam.title.toLowerCase().includes(q) &&
        !exam.agency.toLowerCase().includes(q)
      ) {
        return false;
      }

      if (filters.jurisdiction !== 'all') {
        const matchesJurisdiction: Record<Jurisdiction, boolean> = {
          all: true,
          federal: exam.agencyKey === 'FPSC',
          provincial: ['PPSC', 'KPPSC', 'BPSC', 'SPSC'].includes(
            exam.agencyKey
          ),
          'testing-services': ['NTS', 'OTS', 'PTS', 'ETEA'].includes(
            exam.agencyKey
          ),
          'armed-forces':
            exam.sector === 'armed-forces' ||
            exam.sector === 'uniformed-forces',
        };
        if (!matchesJurisdiction[filters.jurisdiction]) return false;
      }

      if (filters.postGrade !== 'all') {
        const gradeMap: Record<PostGrade, string> = {
          all: '',
          'bps-11': 'BPS-11',
          'bps-12': 'BPS-12',
          'bps-13': 'BPS-13',
          'bps-14': 'BPS-14',
          'bps-15': 'BPS-15',
          'bps-16': 'BPS-16',
          'bps-17': 'BPS-17',
        };
        if (exam.grade !== gradeMap[filters.postGrade]) return false;
      }

      if (filters.sector !== 'all' && exam.sector !== filters.sector) {
        return false;
      }

      return true;
    });

    const sortFns: Record<
      SortOption,
      (a: ExamCardData, b: ExamCardData) => number
    > = {
      popularity: (a, b) => b.popularity - a.popularity,
      latest: (a, b) => Number(b.year) - Number(a.year),
      'a-z': (a, b) => a.title.localeCompare(b.title),
    };

    result.sort(sortFns[filters.sort]);
    return result;
  }, [filters]);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden border-b border-white/20 bg-white/70 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-400/10 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              Exam Categories
            </h1>
            <p className="mt-3 max-w-2xl text-base text-gray-600 dark:text-gray-300 sm:text-lg">
              Browse all available government exams across federal, provincial,
              and testing services. Filter by jurisdiction, grade, and sector.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/60 px-3 py-1.5 font-medium backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-800/60">
                {MOCK_EXAMS.length} Exams Available
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/60 px-3 py-1.5 font-medium backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-800/60">
                {MOCK_EXAMS.filter((e) => e.verified).length} Verified
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 pb-8 lg:grid-cols-3">
          <DailyQuizCompactWidget className="lg:col-span-1" />
          <CurrentAffairsCompactWidget className="lg:col-span-2" />
        </div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <ExamFilters
              filters={filters}
              onChange={handleFilterChange}
              resultCount={filtered.length}
              totalCount={MOCK_EXAMS.length}
            />
          </motion.div>

          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center rounded-xl border border-white/20 bg-white/70 py-20 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70"
            >
              <BookOpen
                size={44}
                className="text-[rgb(var(--color-text-muted))] opacity-40"
              />
              <p className="mt-4 text-lg font-semibold text-[rgb(var(--color-text-primary))]">
                No Exams Found
              </p>
              <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
                No exams match your current filters. Try broadening your
                criteria.
              </p>
              <button
                onClick={() => setFilters(initialFilters)}
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-primary-500 bg-primary-50 px-4 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-100 dark:bg-primary-950 dark:text-primary-300 dark:hover:bg-primary-900"
              >
                <RefreshCcw size={14} />
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`${filters.jurisdiction}-${filters.postGrade}-${filters.sector}-${filters.sort}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((exam) => (
                  <ExamCard key={exam.id} exam={exam} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
