import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  StickyNote,
  Brain,
  Eye,
  EyeOff,
  Filter,
  AlertTriangle,
  Sparkles,
  XIcon,
  Loader2,
  Trophy,
  Zap,
  RotateCcw,
  LayoutDashboard,
  CheckCircle2,
  Target,
  TrendingUp,
  Send,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getMcqs,
  getTopics,
  submitMcqExamProgress,
} from '@/services/mcqService';
import { Button } from '@/components/ui/Button';
import { AdaptiveRevisionBanner } from '@/components/widgets/AdaptiveRevisionBanner';
import type { MCQ } from '@/types';
import type { RootState } from '@/store/store';
import type { FilterMode } from '@/store/slices/practiceSlice';
import {
  setFilterMode,
  toggleBookmark,
  setNote,
  toggleExplanation,
  answerQuestion,
  resetPractice,
} from '@/store/slices/practiceSlice';
import { updateUserProgress } from '@/store/slices/authSlice';
import { useAppSelector } from '@/store/hooks';
import { ROUTES } from '@/constants/routes';
import ArmyTestPracticePage from './ArmyTestPracticePage';

// ─── constants ─────────────────────────────────────────────────────────────
const ALL_SUBJECTS_TAB = { id: '__all__', label: 'All Subjects' };

const DEFAULT_SUBJECTS = [
  ALL_SUBJECTS_TAB,
  { id: 'verbal-reasoning', label: 'Verbal Reasoning' },
  { id: 'non-verbal', label: 'Non-Verbal' },
  { id: 'general-knowledge', label: 'General Knowledge' },
  { id: 'pakistan-affairs', label: 'Pakistan Affairs' },
  { id: 'english', label: 'English' },
  { id: 'everyday-science', label: 'Everyday Science' },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: 'bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300',
  medium:
    'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
  hard: 'bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300',
};

interface SubmitResult {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  scorePercentage: number;
  xpEarned: number;
}

// ─── PracticePage ──────────────────────────────────────────────────────────
export default function PracticePage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  // If the user navigated to the army-test category, show the dedicated page.
  if (category === 'army-test') {
    return <ArmyTestPracticePage />;
  }

  return <StandardPractice />;
}

function StandardPractice() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  // Redux: bookmarks, notes, explanations & answers
  const { filterMode, answers, bookmarks, notes, showExplanation } =
    useSelector((state: RootState) => state.practice);

  // ── subjects / topics ──────────────────────────────────────────────────
  const [subjectsList, setSubjectsList] = useState(DEFAULT_SUBJECTS);
  const [selectedSubject, setSelectedSubject] = useState(ALL_SUBJECTS_TAB.id);
  const [selectedSubjectLabel, setSelectedSubjectLabel] = useState(
    ALL_SUBJECTS_TAB.label
  );

  useEffect(() => {
    let cancelled = false;
    getTopics()
      .then((topics) => {
        if (cancelled || topics.length === 0) return;
        // Prepend the "All Subjects" tab so users can see all MCQs
        const list = [
          ALL_SUBJECTS_TAB,
          ...topics.map((t) => ({ id: t.id, label: t.name })),
        ];
        setSubjectsList(list);
        // Keep 'All Subjects' selected by default
        setSelectedSubject(ALL_SUBJECTS_TAB.id);
        setSelectedSubjectLabel(ALL_SUBJECTS_TAB.label);
      })
      .catch(() => {
        /* keep defaults */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // ── questions ──────────────────────────────────────────────────────────
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── submission state ───────────────────────────────────────────────────
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submitFiredRef = useRef(false);

  // ── local navigation ───────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);

  // ── notes modal ────────────────────────────────────────────────────────
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteTargetId, setNoteTargetId] = useState<string | null>(null);

  // Fetch MCQs whenever subject changes
  useEffect(() => {
    let cancelled = false;
    submitFiredRef.current = false;
    dispatch(resetPractice());

    // Build filter: if '__all__' or a slug-style id use topicId for text search;
    // if it looks like a MongoDB ObjectId, use subjectId for direct match.
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(selectedSubject);
    const filters =
      selectedSubject === ALL_SUBJECTS_TAB.id
        ? { limit: 50 } // no filter — return all active MCQs
        : isObjectId
          ? { subjectId: selectedSubject, limit: 50 } // explicit subject match
          : { topicId: selectedSubject, limit: 50 }; // text/slug based fallback

    Promise.resolve()
      .then(() => {
        if (cancelled) return;
        setLoading(true);
        setError(null);
        setCurrentIndex(0);
        setSubmitted(false);
        setSubmitResult(null);
        setSubmitError(null);
        return getMcqs(filters);
      })
      .then((res) => {
        if (cancelled) return;
        setQuestions(res?.data ?? []);
      })
      .catch((err) => {
        if (cancelled) return;
        setQuestions([]);
        setError(
          err instanceof Error ? err.message : 'Failed to load questions.'
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedSubject, dispatch]);

  // ── derived / filtered questions ───────────────────────────────────────
  const filteredQuestions = useMemo(() => {
    if (filterMode === 'bookmarked')
      return questions.filter((q) => bookmarks.includes(q._id));
    if (filterMode === 'weak')
      return questions.filter(
        (q) => answers[q._id] && !answers[q._id].isCorrect
      );
    return questions;
  }, [questions, filterMode, bookmarks, answers]);

  const totalForSubject = questions.length;
  const bookmarkCount = useMemo(
    () => questions.filter((q) => bookmarks.includes(q._id)).length,
    [questions, bookmarks]
  );
  const weakCount = useMemo(
    () =>
      questions.filter((q) => answers[q._id] && !answers[q._id].isCorrect)
        .length,
    [questions, answers]
  );

  // Completion detection — all filtered questions answered
  const answeredCount = useMemo(
    () => filteredQuestions.filter((q) => !!answers[q._id]).length,
    [filteredQuestions, answers]
  );
  const allAnswered =
    filteredQuestions.length > 0 && answeredCount >= filteredQuestions.length;
  const correctCount = useMemo(
    () => filteredQuestions.filter((q) => answers[q._id]?.isCorrect).length,
    [filteredQuestions, answers]
  );

  // Clamp index
  const safeIndex = Math.min(
    currentIndex,
    Math.max(0, filteredQuestions.length - 1)
  );
  const currentQuestion = filteredQuestions[safeIndex];

  // ── submit handler ─────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (submitting || submitted) return;
    setSubmitting(true);
    setSubmitError(null);

    const payload = filteredQuestions
      .filter((q) => answers[q._id])
      .map((q) => ({
        questionId: q._id,
        selectedOptionId: answers[q._id].selectedOptionId,
      }));

    try {
      // Build a clean URL-safe slug for this practice session.
      // - '__all__'  → 'all'
      // - ObjectId   → slug from the subject label (e.g. "Verbal Reasoning" → "verbal-reasoning")
      // - slug text  → use as-is (already URL-safe)
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(selectedSubject);
      const slugBase =
        selectedSubject === ALL_SUBJECTS_TAB.id
          ? 'all'
          : isObjectId
            ? selectedSubjectLabel
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '')
            : selectedSubject.replace(/[^a-z0-9-]+/g, '-');
      const practiceSlug = `subject-practice-${slugBase}`;
      const res = await submitMcqExamProgress(practiceSlug, payload);

      const result: SubmitResult = {
        totalQuestions: res?.totalQuestions ?? payload.length,
        correctAnswers: res?.correctAnswers ?? correctCount,
        incorrectAnswers:
          res?.incorrectAnswers ?? payload.length - correctCount,
        scorePercentage:
          res?.scorePercentage ??
          Math.round((correctCount / Math.max(1, payload.length)) * 100),
        xpEarned: res?.xpEarned ?? correctCount * 10,
      };

      console.log(correctCount);

      setSubmitResult(result);
      setSubmitted(true);

      // Update Redux + localStorage
      if (isAuthenticated) {
        dispatch(
          updateUserProgress({
            xp: result.xpEarned,
            readinessScore: result.scorePercentage,
          })
        );
      }
    } catch {
      // Even if API fails, show local results
      const localResult: SubmitResult = {
        totalQuestions: payload.length,
        correctAnswers: correctCount,
        incorrectAnswers: payload.length - correctCount,
        scorePercentage: Math.round(
          (correctCount / Math.max(1, payload.length)) * 100
        ),
        xpEarned: correctCount * 10,
      };
      setSubmitResult(localResult);
      setSubmitted(true);
      setSubmitError(
        'Could not save to server, but your local results are shown below.'
      );
      dispatch(
        updateUserProgress({
          xp: localResult.xpEarned,
          readinessScore: localResult.scorePercentage,
        })
      );
    } finally {
      setSubmitting(false);
    }
  }, [
    submitting,
    submitted,
    filteredQuestions,
    answers,
    selectedSubject,
    selectedSubjectLabel,
    correctCount,
    isAuthenticated,
    dispatch,
  ]);

  // ── re-exam handler ────────────────────────────────────────────────────
  const handleReExam = useCallback(() => {
    setSubmitted(false);
    setSubmitResult(null);
    setSubmitError(null);
    setCurrentIndex(0);
    submitFiredRef.current = false;
    dispatch(resetPractice());
  }, [dispatch]);

  // ── navigation ─────────────────────────────────────────────────────────
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, filteredQuestions.length - 1));
  }, [filteredQuestions.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleSubjectSelect = useCallback((id: string, label: string) => {
    setSelectedSubject(id);
    setSelectedSubjectLabel(label);
  }, []);

  // ── notes handlers ─────────────────────────────────────────────────────
  const handleOpenNote = useCallback(() => {
    if (!currentQuestion) return;
    setNoteTargetId(currentQuestion._id);
    setNoteText(notes[currentQuestion._id] || '');
    setNoteModalOpen(true);
  }, [currentQuestion, notes]);

  const handleSaveNote = useCallback(() => {
    if (noteTargetId)
      dispatch(setNote({ questionId: noteTargetId, note: noteText }));
    setNoteModalOpen(false);
    setNoteTargetId(null);
    setNoteText('');
  }, [noteTargetId, noteText, dispatch]);

  // ── loading / error states ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <SubjectTabs
          subjects={subjectsList}
          selected={selectedSubject}
          onSelect={handleSubjectSelect}
        />
        <div className="flex flex-col items-center justify-center rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] py-20">
          <Loader2 size={32} className="animate-spin text-primary-500" />
          <p className="mt-4 text-sm text-[rgb(var(--color-text-muted))]">
            Loading questions…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <SubjectTabs
          subjects={subjectsList}
          selected={selectedSubject}
          onSelect={handleSubjectSelect}
        />
        <div className="flex flex-col items-center justify-center rounded-xl border border-danger-200 bg-danger-50/40 py-16 text-center dark:border-danger-800">
          <p className="text-sm text-[rgb(var(--color-text-secondary))]">
            {error}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => setError(null)}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (filteredQuestions.length === 0) {
    return (
      <div className="space-y-6">
        <SubjectTabs
          subjects={subjectsList}
          selected={selectedSubject}
          onSelect={handleSubjectSelect}
        />
        <FilterBar
          filterMode={filterMode}
          allCount={totalForSubject}
          weakCount={weakCount}
          bookmarkCount={bookmarkCount}
          onFilterChange={(mode) => {
            dispatch(setFilterMode(mode));
            setCurrentIndex(0);
          }}
        />
        <div className="flex flex-col items-center justify-center rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] py-16">
          <Filter
            size={40}
            className="text-[rgb(var(--color-text-muted))] opacity-40"
          />
          <p className="mt-4 text-lg font-semibold text-[rgb(var(--color-text-primary))]">
            No questions found
          </p>
          <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
            {filterMode === 'bookmarked'
              ? "You haven't bookmarked any questions in this subject yet."
              : filterMode === 'weak'
                ? 'No weak topics found. Keep practicing!'
                : 'No questions available for this subject yet.'}
          </p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const answer = answers[currentQuestion._id];
  const isRevealed = !!answer;
  const isBookmarked = bookmarks.includes(currentQuestion._id);
  const explanationVisible = showExplanation[currentQuestion._id];
  const hasNote = !!notes[currentQuestion._id];

  return (
    <div className="space-y-6">
      {/* Subject tabs */}
      <SubjectTabs
        subjects={subjectsList}
        selected={selectedSubject}
        onSelect={handleSubjectSelect}
      />

      {/* Filter bar */}
      <FilterBar
        filterMode={filterMode}
        allCount={totalForSubject}
        weakCount={weakCount}
        bookmarkCount={bookmarkCount}
        onFilterChange={(mode) => {
          dispatch(setFilterMode(mode));
          setCurrentIndex(0);
        }}
      />

      <AdaptiveRevisionBanner />

      {/* Progress overview strip */}
      <div className="flex items-center justify-between rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-4 py-2.5">
        <span className="text-xs font-medium text-[rgb(var(--color-text-muted))]">
          <span className="font-bold text-primary-500">{answeredCount}</span> /{' '}
          {filteredQuestions.length} answered
        </span>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-accent-600 dark:text-accent-400">
            <Check size={12} /> {correctCount} correct
          </span>
          <span className="flex items-center gap-1 text-danger-600 dark:text-danger-400">
            <X size={12} /> {answeredCount - correctCount} wrong
          </span>
        </div>
        {allAnswered && !submitted && (
          <span className="animate-pulse text-xs font-semibold text-primary-500">
            ✓ All done — submit below!
          </span>
        )}
      </div>

      {/* Question card */}
      <div
        className={cn(
          'rounded-xl border p-6 transition-all',
          isRevealed && answer.isCorrect
            ? 'border-accent-300 bg-accent-50/30 dark:border-accent-700 dark:bg-accent-950/30'
            : isRevealed && !answer.isCorrect
              ? 'border-danger-300 bg-danger-50/30 dark:border-danger-700 dark:bg-danger-950/30'
              : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]'
        )}
      >
        {/* Question header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                isRevealed && answer.isCorrect
                  ? 'bg-accent-500 text-white'
                  : isRevealed && !answer.isCorrect
                    ? 'bg-danger-500 text-white'
                    : 'bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-secondary))]'
              )}
            >
              {isRevealed ? (
                answer.isCorrect ? (
                  <Check size={16} />
                ) : (
                  <X size={16} />
                )
              ) : (
                safeIndex + 1
              )}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[rgb(var(--color-text-muted))]">
                  Question {safeIndex + 1} of {filteredQuestions.length}
                </span>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase',
                    DIFFICULTY_COLORS[currentQuestion.difficulty] ?? ''
                  )}
                >
                  {currentQuestion.difficulty}
                </span>
              </div>
              <p className="mt-2 text-[15px] font-medium leading-relaxed text-[rgb(var(--color-text-primary))]">
                {currentQuestion.questionText ?? currentQuestion.question}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={() => dispatch(toggleBookmark(currentQuestion._id))}
              className={cn(
                'rounded-lg p-2 transition-colors',
                isBookmarked
                  ? 'text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950'
                  : 'text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-surface-elevated))]'
              )}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
            >
              {isBookmarked ? (
                <BookmarkCheck size={18} className="fill-current" />
              ) : (
                <Bookmark size={18} />
              )}
            </button>
            <button
              onClick={handleOpenNote}
              className={cn(
                'rounded-lg p-2 transition-colors',
                hasNote
                  ? 'text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950'
                  : 'text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-surface-elevated))]'
              )}
              title={hasNote ? 'Edit note' : 'Add note'}
            >
              <StickyNote size={18} className={hasNote ? 'fill-current' : ''} />
            </button>
          </div>
        </div>

        {/* Note preview */}
        {hasNote && (
          <div className="mt-3 ml-11 rounded-lg border border-primary-200 bg-primary-50/50 px-3 py-2 dark:border-primary-800 dark:bg-primary-950/50">
            <p className="text-xs font-medium text-primary-600 dark:text-primary-400">
              Your Note:
            </p>
            <p className="mt-0.5 text-sm text-[rgb(var(--color-text-secondary))]">
              {notes[currentQuestion._id]}
            </p>
          </div>
        )}

        {/* Options */}
        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {currentQuestion.options.map((option, optIndex) => {
            const isOptionSelected =
              isRevealed && answer.selectedOptionId === option.id;
            const isCorrectOption = !!option.isCorrect;
            const showAsCorrect = isRevealed && isCorrectOption;
            const showAsWrong = isOptionSelected && !answer.isCorrect;

            return (
              <button
                key={option.id}
                disabled={isRevealed}
                onClick={() => {
                  if (!currentQuestion || answers[currentQuestion._id]) return;
                  dispatch(
                    answerQuestion({
                      questionId: currentQuestion._id,
                      optionId: option.id,
                      isCorrect: !!option.isCorrect,
                    })
                  );
                }}
                className={cn(
                  'flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all',
                  showAsCorrect
                    ? 'border-accent-400 bg-accent-100 text-accent-800 dark:border-accent-600 dark:bg-accent-900 dark:text-accent-200'
                    : showAsWrong
                      ? 'border-danger-400 bg-danger-100 text-danger-800 dark:border-danger-600 dark:bg-danger-900 dark:text-danger-200'
                      : isRevealed
                        ? 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] opacity-50'
                        : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] hover:border-primary-300 hover:bg-primary-50 dark:hover:border-primary-700 dark:hover:bg-primary-950'
                )}
              >
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                    showAsCorrect
                      ? 'bg-accent-500 text-white'
                      : showAsWrong
                        ? 'bg-danger-500 text-white'
                        : 'bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-muted))]'
                  )}
                >
                  {showAsCorrect ? (
                    <Check size={12} />
                  ) : showAsWrong ? (
                    <X size={12} />
                  ) : (
                    String.fromCharCode(65 + optIndex)
                  )}
                </span>
                <span className="flex-1">{option.text}</span>
              </button>
            );
          })}
        </div>

        {/* Result + explanation */}
        {isRevealed && (
          <div className="mt-5 space-y-3">
            <div
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium',
                answer.isCorrect
                  ? 'bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200'
                  : 'bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200'
              )}
            >
              {answer.isCorrect ? (
                <>
                  <Check size={16} /> Correct! Well done.
                </>
              ) : (
                <>
                  <X size={16} /> Incorrect. The correct answer is{' '}
                  <span className="font-bold">
                    {(() => {
                      const idx = currentQuestion.options.findIndex(
                        (o) => o.isCorrect
                      );
                      return `${String.fromCharCode(65 + idx)}. ${currentQuestion.options[idx]?.text ?? ''}`;
                    })()}
                  </span>
                </>
              )}
            </div>
            {currentQuestion.explanation && (
              <div>
                <button
                  onClick={() =>
                    dispatch(toggleExplanation(currentQuestion._id))
                  }
                  className="flex items-center gap-1.5 text-sm font-medium text-primary-500 hover:text-primary-600"
                >
                  {explanationVisible ? (
                    <EyeOff size={14} />
                  ) : (
                    <Eye size={14} />
                  )}
                  {explanationVisible ? 'Hide' : 'Show'} Explanation
                </button>
                {explanationVisible && (
                  <div className="mt-2 rounded-lg border border-primary-200 bg-primary-50/50 p-4 dark:border-primary-800 dark:bg-primary-950/50">
                    <div className="flex items-start gap-2">
                      <Brain
                        size={16}
                        className="mt-0.5 shrink-0 text-primary-500"
                      />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                          Explanation
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-[rgb(var(--color-text-secondary))]">
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          leftIcon={<ChevronLeft size={16} />}
          disabled={safeIndex === 0}
          onClick={goToPrev}
        >
          Previous
        </Button>
        <span className="text-sm font-medium text-[rgb(var(--color-text-muted))]">
          {safeIndex + 1} / {filteredQuestions.length}
        </span>
        <Button
          rightIcon={<ChevronRight size={16} />}
          disabled={safeIndex >= filteredQuestions.length - 1}
          onClick={goToNext}
        >
          Next
        </Button>
      </div>

      {/* ── Submit / Results panel ─────────────────────────────────────── */}
      <AnimatePresence>
        {allAnswered && !submitted && (
          <motion.div
            key="submit-banner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.35 }}
            className="rounded-xl border-2 border-primary-400 bg-gradient-to-br from-primary-50 to-violet-50 p-6 text-center shadow-lg dark:border-primary-700 dark:from-primary-950/60 dark:to-violet-950/60"
          >
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
              <CheckCircle2
                size={28}
                className="text-primary-600 dark:text-primary-300"
              />
            </div>
            <h3 className="text-xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
              All {filteredQuestions.length} Questions Answered!
            </h3>
            <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
              You got{' '}
              <span className="font-semibold text-accent-600 dark:text-accent-400">
                {correctCount}
              </span>{' '}
              correct out of{' '}
              <span className="font-semibold">{filteredQuestions.length}</span>.
              Submit to save your progress to your profile.
            </p>
            <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={submitting}
                leftIcon={
                  submitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )
                }
                className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 shadow-md"
              >
                {submitting ? 'Submitting…' : 'Submit & Save Results'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleReExam}
                leftIcon={<RotateCcw size={18} />}
                className="w-full sm:w-auto"
              >
                Re-Exam (Start Over)
              </Button>
            </div>
          </motion.div>
        )}

        {submitted && submitResult && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 180 }}
            className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 shadow-xl"
          >
            {/* Header */}
            <div className="text-center">
              <div
                className={cn(
                  'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full',
                  submitResult.scorePercentage >= 70
                    ? 'bg-accent-100 dark:bg-accent-900'
                    : submitResult.scorePercentage >= 40
                      ? 'bg-primary-100 dark:bg-primary-900'
                      : 'bg-danger-100 dark:bg-danger-900'
                )}
              >
                <Trophy
                  size={32}
                  className={cn(
                    submitResult.scorePercentage >= 70
                      ? 'text-accent-600 dark:text-accent-300'
                      : submitResult.scorePercentage >= 40
                        ? 'text-primary-600 dark:text-primary-300'
                        : 'text-danger-600 dark:text-danger-300'
                  )}
                />
              </div>
              <h3 className="text-2xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
                {submitResult.scorePercentage >= 70
                  ? '🎉 Great Work!'
                  : submitResult.scorePercentage >= 40
                    ? '📈 Keep It Up!'
                    : '💪 Keep Practicing!'}
              </h3>
              <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
                Subject:{' '}
                <span className="font-semibold">{selectedSubjectLabel}</span>
              </p>
            </div>

            {/* Score ring */}
            <div className="my-6 flex justify-center">
              <div className="relative h-36 w-36">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    strokeWidth="10"
                    className="stroke-[rgb(var(--color-surface-elevated))]"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 52}
                    strokeDashoffset={
                      2 *
                      Math.PI *
                      52 *
                      (1 - submitResult.scorePercentage / 100)
                    }
                    className={cn(
                      'transition-all duration-1000',
                      submitResult.scorePercentage >= 70
                        ? 'stroke-accent-500'
                        : submitResult.scorePercentage >= 40
                          ? 'stroke-primary-500'
                          : 'stroke-danger-500'
                    )}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className={cn(
                      'text-3xl font-bold font-heading',
                      submitResult.scorePercentage >= 70
                        ? 'text-accent-600 dark:text-accent-400'
                        : submitResult.scorePercentage >= 40
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-danger-600 dark:text-danger-400'
                    )}
                  >
                    {submitResult.scorePercentage}%
                  </span>
                  <span className="text-xs text-[rgb(var(--color-text-muted))]">
                    Score
                  </span>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                {
                  icon: Target,
                  label: 'Total',
                  value: submitResult.totalQuestions,
                  color: 'text-primary-500',
                  bg: 'bg-primary-50 dark:bg-primary-950',
                },
                {
                  icon: CheckCircle2,
                  label: 'Correct',
                  value: submitResult.correctAnswers,
                  color: 'text-accent-600',
                  bg: 'bg-accent-50 dark:bg-accent-950',
                },
                {
                  icon: X,
                  label: 'Wrong',
                  value: submitResult.incorrectAnswers,
                  color: 'text-danger-600',
                  bg: 'bg-danger-50 dark:bg-danger-950',
                },
                {
                  icon: Zap,
                  label: 'XP Earned',
                  value: `+${submitResult.xpEarned}`,
                  color: 'text-violet-600',
                  bg: 'bg-violet-50 dark:bg-violet-950',
                },
              ].map(({ icon: Icon, label, value, color, bg }) => (
                <div
                  key={label}
                  className={cn('rounded-lg p-3 text-center', bg)}
                >
                  <Icon size={20} className={cn('mx-auto mb-1', color)} />
                  <p className="text-lg font-bold text-[rgb(var(--color-text-primary))]">
                    {value}
                  </p>
                  <p className="text-xs text-[rgb(var(--color-text-muted))]">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Readiness bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-[rgb(var(--color-text-muted))] mb-1">
                <span className="flex items-center gap-1">
                  <TrendingUp size={12} /> Readiness Score Updated
                </span>
                <span className="font-semibold text-primary-500">
                  {submitResult.scorePercentage}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[rgb(var(--color-surface-elevated))]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary-500 to-violet-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${submitResult.scorePercentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                />
              </div>
            </div>

            {submitError && (
              <p className="mt-3 text-center text-xs text-[rgb(var(--color-text-muted))]">
                ⚠️ {submitError}
              </p>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                onClick={handleReExam}
                leftIcon={<RotateCcw size={18} />}
                className="w-full sm:w-auto"
              >
                Re-Exam (Same Subject)
              </Button>
              <Link
                to={ROUTES.DASHBOARD}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-5 py-2.5 text-sm font-semibold text-[rgb(var(--color-text-primary))] shadow-sm transition-colors hover:bg-[rgb(var(--color-surface-elevated))] sm:w-auto"
              >
                <LayoutDashboard size={16} />
                View Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Note modal */}
      {noteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
                {hasNote ? 'Edit Note' : 'Add Note'}
              </h3>
              <button
                onClick={() => {
                  setNoteModalOpen(false);
                  setNoteTargetId(null);
                  setNoteText('');
                }}
                className="rounded-md p-1 text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-surface-elevated))]"
              >
                <XIcon size={18} />
              </button>
            </div>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write your personal notes about this question…"
              rows={4}
              className="mt-4 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 py-2.5 text-sm text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-muted))] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setNoteModalOpen(false);
                  setNoteTargetId(null);
                  setNoteText('');
                }}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveNote}>
                Save Note
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SubjectTabs ───────────────────────────────────────────────────────────
function SubjectTabs({
  subjects,
  selected,
  onSelect,
}: {
  subjects: { id: string; label: string }[];
  selected: string;
  onSelect: (id: string, label: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} className="text-primary-500" />
        <h2 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
          Select Subject
        </h2>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {subjects.map((sub) => (
          <button
            key={sub.id}
            onClick={() => onSelect(sub.id, sub.label)}
            className={cn(
              'shrink-0 rounded-lg border px-4 py-2 text-sm font-medium transition-all',
              selected === sub.id
                ? 'border-primary-500 bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400'
                : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-secondary))] hover:border-primary-300 hover:text-primary-600 dark:hover:border-primary-700'
            )}
          >
            {sub.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── FilterBar ─────────────────────────────────────────────────────────────
function FilterBar({
  filterMode,
  allCount,
  weakCount,
  bookmarkCount,
  onFilterChange,
}: {
  filterMode: FilterMode;
  allCount: number;
  weakCount: number;
  bookmarkCount: number;
  onFilterChange: (mode: FilterMode) => void;
}) {
  const filters: {
    id: FilterMode;
    label: string;
    count: number;
    icon: typeof Filter;
  }[] = [
    { id: 'all', label: 'All Questions', count: allCount, icon: Filter },
    { id: 'weak', label: 'Weak Topics', count: weakCount, icon: AlertTriangle },
    {
      id: 'bookmarked',
      label: 'Bookmarked',
      count: bookmarkCount,
      icon: Bookmark,
    },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((f) => {
        const Icon = f.icon;
        return (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
              filterMode === f.id
                ? 'border-primary-500 bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400'
                : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-secondary))] hover:border-primary-300 dark:hover:border-primary-700'
            )}
          >
            <Icon size={12} />
            {f.label}
            <span
              className={cn(
                'ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none',
                filterMode === f.id
                  ? 'bg-primary-200 text-primary-700 dark:bg-primary-800 dark:text-primary-300'
                  : 'bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-muted))]'
              )}
            >
              {f.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
