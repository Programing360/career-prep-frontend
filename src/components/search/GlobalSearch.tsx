import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Clock,
  FileText,
  ArrowRight,
  Trash2,
  Loader2,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { getPublicExams } from '@/services/examService';
import type { DirectoryExam } from '@/types';

// ─── Types ───────────────────────────────────────────────────────────────────

interface SearchResult {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
}

interface GlobalSearchProps {
  placeholder?: string;
  className?: string;
  limit?: number;
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function useRecentSearches(key: string, maxItems = 5) {
  const [searches, setSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const persist = useCallback(
    (items: string[]) => {
      localStorage.setItem(key, JSON.stringify(items));
    },
    [key]
  );

  const addSearch = useCallback(
    (term: string) => {
      setSearches((prev) => {
        const filtered = prev.filter((s) => s !== term);
        const updated = [term, ...filtered].slice(0, maxItems);
        persist(updated);
        return updated;
      });
    },
    [maxItems, persist]
  );

  const clearSearches = useCallback(() => {
    localStorage.removeItem(key);
    setSearches([]);
  }, [key]);

  return { searches, addSearch, clearSearches };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toSearchResult(exam: DirectoryExam): SearchResult {
  const categoryLabel = exam.category.replace(/_/g, ' / ').toUpperCase();
  return {
    id: exam._id,
    slug: exam.slug,
    title: exam.title,
    subtitle: `${categoryLabel} · ${exam.conductingAuthority}`,
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

const STORAGE_KEY = 'meritprep-recent-searches';

export default function GlobalSearch({
  placeholder = 'Search exams, subjects, topics…',
  className,
  limit = 5,
}: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [lastFetchedQuery, setLastFetchedQuery] = useState('');

  const debouncedQuery = useDebounce(query, 250);
  const { searches, addSearch, clearSearches } = useRecentSearches(STORAGE_KEY);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const trimmedQuery = debouncedQuery.trim();
  const isLoading =
    trimmedQuery.length > 0 && lastFetchedQuery !== trimmedQuery;

  // ── Fetch matching exams from the API ─────────────────────────────────────

  useEffect(() => {
    if (!trimmedQuery) return;

    let cancelled = false;

    getPublicExams({ search: trimmedQuery, limit })
      .then((response) => {
        if (cancelled) return;
        setResults(response.data.map(toSearchResult));
        setLastFetchedQuery(trimmedQuery);
      })
      .catch(() => {
        if (cancelled) return;
        setResults([]);
        setLastFetchedQuery(trimmedQuery);
      });

    return () => {
      cancelled = true;
    };
  }, [trimmedQuery, limit]);

  // ── Derived state ────────────────────────────────────────────────────────

  const showRecent = isOpen && trimmedQuery.length === 0 && searches.length > 0;
  const showLoading = isOpen && trimmedQuery.length > 0 && isLoading;
  const showResults =
    isOpen && trimmedQuery.length > 0 && !isLoading && results.length > 0;
  const showNoResults =
    isOpen && trimmedQuery.length > 0 && !isLoading && results.length === 0;

  // Total navigable items count
  const itemCount = useMemo(() => {
    if (showRecent) return searches.length;
    if (showResults) return results.length;
    return 0;
  }, [showRecent, showResults, searches.length, results.length]);

  // ── Scroll active item into view ─────────────────────────────────────────

  useEffect(() => {
    if (activeIndex >= 0) {
      const el = document.querySelector(`[data-search-item="${activeIndex}"]`);
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  // ── Close on outside click ───────────────────────────────────────────────

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ── Close on Escape ──────────────────────────────────────────────────────

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleSelect = useCallback(
    (result: SearchResult) => {
      if (query.trim()) addSearch(query.trim());
      setIsOpen(false);
      setQuery('');
      setActiveIndex(-1);
      navigate(`${ROUTES.EXAMS}/${result.slug}`);
    },
    [query, addSearch, navigate]
  );

  const handleRecentSelect = useCallback((term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent) => {
      if (!isOpen || itemCount === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) => (prev < itemCount - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : itemCount - 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (showRecent && activeIndex >= 0 && searches[activeIndex]) {
            handleRecentSelect(searches[activeIndex]);
          } else if (showResults && activeIndex >= 0 && results[activeIndex]) {
            handleSelect(results[activeIndex]);
          }
          break;
      }
    },
    [
      isOpen,
      itemCount,
      activeIndex,
      showRecent,
      showResults,
      searches,
      results,
      handleRecentSelect,
      handleSelect,
    ]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    inputRef.current?.focus();
  }, []);

  // ── Shared result item classes ───────────────────────────────────────────

  const itemClasses = cn(
    'flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors rounded-lg',
    'hover:bg-gray-100 dark:hover:bg-gray-800'
  );

  const activeItemClasses = 'bg-gray-100 dark:bg-gray-800';

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* ── Input ──────────────────────────────────────────────────────── */}
      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="global-search-listbox"
          aria-activedescendant={
            activeIndex >= 0 ? `search-item-${activeIndex}` : undefined
          }
          className={cn(
            'w-full rounded-lg py-2.5 pl-10 pr-10 text-sm',
            'bg-gray-100 text-gray-900 placeholder-gray-500',
            'transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20',
            'dark:bg-gray-800 dark:text-white dark:placeholder-gray-400',
            'dark:focus:bg-gray-700'
          )}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* ── Dropdown ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen &&
          (showRecent || showLoading || showResults || showNoResults) && (
            <motion.div
              id="global-search-listbox"
              role="listbox"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className={cn(
                'absolute left-0 right-0 top-full z-50 mt-2',
                'max-h-80 overflow-y-auto rounded-xl border p-1.5 shadow-xl',
                'border-white/20 bg-white/80 backdrop-blur-xl',
                'dark:border-gray-800/50 dark:bg-gray-900/80'
              )}
            >
              {/* ── Recent Searches ──────────────────────────────────────── */}
              {showRecent && (
                <>
                  <div className="flex items-center justify-between px-3 py-1.5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      Recent Searches
                    </p>
                    <button
                      onClick={clearSearches}
                      className="flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Trash2 size={12} />
                      Clear
                    </button>
                  </div>

                  {searches.map((term, i) => (
                    <button
                      key={term}
                      id={`search-item-${i}`}
                      data-search-item={i}
                      onClick={() => handleRecentSelect(term)}
                      onMouseEnter={() => setActiveIndex(i)}
                      role="option"
                      aria-selected={activeIndex === i}
                      className={cn(
                        itemClasses,
                        activeIndex === i && activeItemClasses
                      )}
                    >
                      <Clock
                        size={16}
                        className="shrink-0 text-gray-400 dark:text-gray-500"
                      />
                      <span className="truncate text-sm text-gray-700 dark:text-gray-300">
                        {term}
                      </span>
                    </button>
                  ))}
                </>
              )}

              {/* ── Loading ──────────────────────────────────────────────── */}
              {showLoading && (
                <div className="flex items-center justify-center gap-2 px-3 py-8 text-sm text-gray-500 dark:text-gray-400">
                  <Loader2 size={16} className="animate-spin" />
                  Searching exams…
                </div>
              )}

              {/* ── Exam Results ─────────────────────────────────────────── */}
              {showResults && (
                <Section header="Exams">
                  {results.map((result, idx) => (
                    <ResultItem
                      key={result.id}
                      result={result}
                      index={idx}
                      activeIndex={activeIndex}
                      icon={
                        <FileText
                          size={16}
                          className="shrink-0 text-primary-500"
                        />
                      }
                      onSelect={handleSelect}
                      onMouseEnter={setActiveIndex}
                    />
                  ))}
                </Section>
              )}

              {/* ── No Results ───────────────────────────────────────────── */}
              {showNoResults && (
                <div className="px-3 py-8 text-center">
                  <Search
                    size={36}
                    className="mx-auto text-gray-300 dark:text-gray-600"
                  />
                  <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    No results found
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    No exams match &ldquo;{query}&rdquo;
                  </p>
                  <Link
                    to={ROUTES.EXAMS}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className={cn(
                      'mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2',
                      'text-sm font-medium text-white transition-colors',
                      'bg-gray-900 hover:bg-gray-800',
                      'dark:bg-primary-600 dark:hover:bg-primary-700'
                    )}
                  >
                    Browse All Exams
                    <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Section({
  header,
  children,
}: {
  header: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-1 first:mt-0">
      <div className="px-3 py-1.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {header}
        </p>
      </div>
      {children}
    </div>
  );
}

function ResultItem({
  result,
  index,
  activeIndex,
  icon,
  onSelect,
  onMouseEnter,
}: {
  result: SearchResult;
  index: number;
  activeIndex: number;
  icon: React.ReactNode;
  onSelect: (result: SearchResult) => void;
  onMouseEnter: (index: number) => void;
}) {
  const isActive = activeIndex === index;

  return (
    <button
      id={`search-item-${index}`}
      data-search-item={index}
      onClick={() => onSelect(result)}
      onMouseEnter={() => onMouseEnter(index)}
      role="option"
      aria-selected={isActive}
      className={cn(
        'flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors rounded-lg',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        isActive && 'bg-gray-100 dark:bg-gray-800'
      )}
    >
      {icon}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
          {result.title}
        </p>
        <p className="truncate text-xs text-gray-500 dark:text-gray-400">
          {result.subtitle}
        </p>
      </div>
    </button>
  );
}
