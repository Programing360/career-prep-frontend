import { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { AdaptiveRevisionBanner } from '@/components/widgets/AdaptiveRevisionBanner';
import type { MCQ } from '@/types';
import type { RootState } from '@/store/store';
import type { FilterMode } from '@/store/slices/practiceSlice';
import {
  setSubject,
  setFilterMode,
  goToNextQuestion,
  goToPreviousQuestion,
  answerQuestion,
  toggleBookmark,
  setNote,
  toggleExplanation,
} from '@/store/slices/practiceSlice';

const subjects = [
  { id: 'verbal-reasoning', label: 'Verbal Reasoning' },
  { id: 'non-verbal', label: 'Non-Verbal' },
  { id: 'general-knowledge', label: 'General Knowledge' },
  { id: 'pakistan-affairs', label: 'Pakistan Affairs' },
  { id: 'english', label: 'English' },
  { id: 'everyday-science', label: 'Everyday Science' },
];

const mockQuestions: MCQ[] = [
  {
    id: 'pq-1',
    examId: 'practice',
    subjectId: 'verbal-reasoning',
    question: 'Find the odd one out: Apple, Mango, Potato, Banana',
    options: ['Apple', 'Mango', 'Potato', 'Banana'],
    correctAnswer: 2,
    explanation:
      'Apple, Mango, and Banana are all fruits. Potato is a vegetable, making it the odd one out.',
    difficulty: 'easy',
  },
  {
    id: 'pq-2',
    examId: 'practice',
    subjectId: 'verbal-reasoning',
    question:
      'If in a certain code language, COMPUTER is written as DNPQVUFS, how is MACHINE written in that code?',
    options: ['NBDIJOF', 'NBIFJOG', 'NBDIJOG', 'NBDIOJF'],
    correctAnswer: 0,
    explanation:
      'Each letter is shifted forward by 1 position in the alphabet: C+1=D, O+1=P, M+1=N, etc. So MACHINE becomes NBDIJOF.',
    difficulty: 'medium',
  },
  {
    id: 'pq-3',
    examId: 'practice',
    subjectId: 'verbal-reasoning',
    question:
      'A is the brother of B. C is the daughter of B. D is the brother of C. How is A related to D?',
    options: ['Uncle', 'Father', 'Brother', 'Grandfather'],
    correctAnswer: 0,
    explanation:
      "B is D's parent (since C is B's daughter and D is C's brother). A is B's brother, so A is D's uncle.",
    difficulty: 'medium',
  },
  {
    id: 'pq-4',
    examId: 'practice',
    subjectId: 'general-knowledge',
    question: 'Which planet is known as the "Red Planet"?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 1,
    explanation:
      'Mars is called the Red Planet because of iron oxide (rust) on its surface, giving it a reddish appearance.',
    difficulty: 'easy',
  },
  {
    id: 'pq-5',
    examId: 'practice',
    subjectId: 'general-knowledge',
    question: 'What is the largest ocean on Earth?',
    options: [
      'Atlantic Ocean',
      'Indian Ocean',
      'Pacific Ocean',
      'Arctic Ocean',
    ],
    correctAnswer: 2,
    explanation:
      'The Pacific Ocean is the largest and deepest ocean, covering more than 60 million square miles.',
    difficulty: 'easy',
  },
  {
    id: 'pq-6',
    examId: 'practice',
    subjectId: 'pakistan-affairs',
    question: 'In which year did Pakistan become a republic?',
    options: ['1947', '1956', '1962', '1973'],
    correctAnswer: 1,
    explanation:
      'Pakistan became a republic on March 23, 1956, when the first Constitution was adopted, changing the country from a dominion to a republic.',
    difficulty: 'easy',
  },
  {
    id: 'pq-7',
    examId: 'practice',
    subjectId: 'pakistan-affairs',
    question: 'Who was the first Governor-General of Pakistan?',
    options: [
      'Liaquat Ali Khan',
      'Muhammad Ali Jinnah',
      'Khawaja Nazimuddin',
      'Ghulam Muhammad',
    ],
    correctAnswer: 1,
    explanation:
      'Muhammad Ali Jinnah (Quaid-e-Azam) served as the first Governor-General of Pakistan from August 14, 1947 until his death on September 11, 1948.',
    difficulty: 'easy',
  },
  {
    id: 'pq-8',
    examId: 'practice',
    subjectId: 'english',
    question: 'Choose the correctly spelled word:',
    options: ['Accomodation', 'Accommodation', 'Acomodation', 'Accommadation'],
    correctAnswer: 1,
    explanation:
      '"Accommodation" is the correct spelling. It has double "c" and double "m".',
    difficulty: 'easy',
  },
  {
    id: 'pq-9',
    examId: 'practice',
    subjectId: 'english',
    question: 'Identify the synonym of "Benevolent":',
    options: ['Malevolent', 'Kind', 'Cruel', 'Hostile'],
    correctAnswer: 1,
    explanation:
      '"Benevolent" means well-meaning, kindly, and generous. "Kind" is the closest synonym.',
    difficulty: 'medium',
  },
  {
    id: 'pq-10',
    examId: 'practice',
    subjectId: 'everyday-science',
    question: 'What is the chemical formula for water?',
    options: ['H2O', 'CO2', 'NaCl', 'O2'],
    correctAnswer: 0,
    explanation:
      'Water is composed of two hydrogen atoms and one oxygen atom, giving it the chemical formula H2O.',
    difficulty: 'easy',
  },
  {
    id: 'pq-11',
    examId: 'practice',
    subjectId: 'non-verbal',
    question:
      'In a series of shapes: Circle, Square, Triangle, Circle, Square, ___. What comes next?',
    options: ['Circle', 'Square', 'Triangle', 'Rectangle'],
    correctAnswer: 2,
    explanation:
      'The pattern repeats every three shapes: Circle, Square, Triangle. After the second Square, the next shape is Triangle.',
    difficulty: 'easy',
  },
  {
    id: 'pq-12',
    examId: 'practice',
    subjectId: 'general-knowledge',
    question: 'Which is the smallest continent by area?',
    options: ['Europe', 'Antarctica', 'Australia', 'South America'],
    correctAnswer: 2,
    explanation:
      'Australia is the smallest continent by land area, at approximately 7.7 million square kilometers.',
    difficulty: 'easy',
  },
];

const difficultyColors: Record<string, string> = {
  easy: 'bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300',
  medium:
    'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
  hard: 'bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300',
};

export default function PracticePage() {
  const dispatch = useDispatch();
  const {
    selectedSubject,
    filterMode,
    currentIndex,
    answers,
    bookmarks,
    notes,
    showExplanation,
  } = useSelector((state: RootState) => state.practice);

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteTargetId, setNoteTargetId] = useState<string | null>(null);

  const filteredQuestions = useMemo(() => {
    let qs = mockQuestions.filter((q) => q.subjectId === selectedSubject);

    if (filterMode === 'bookmarked') {
      qs = qs.filter((q) => bookmarks.includes(q.id));
    } else if (filterMode === 'weak') {
      qs = qs.filter((q) => {
        const ans = answers[q.id];
        return ans && !ans.isCorrect;
      });
    }

    return qs;
  }, [selectedSubject, filterMode, bookmarks, answers]);

  const totalForSubject = useMemo(
    () => mockQuestions.filter((q) => q.subjectId === selectedSubject).length,
    [selectedSubject]
  );

  const bookmarkCount = useMemo(
    () =>
      mockQuestions.filter(
        (q) => q.subjectId === selectedSubject && bookmarks.includes(q.id)
      ).length,
    [selectedSubject, bookmarks]
  );

  const weakCount = useMemo(
    () =>
      mockQuestions.filter(
        (q) =>
          q.subjectId === selectedSubject &&
          answers[q.id] &&
          !answers[q.id].isCorrect
      ).length,
    [selectedSubject, answers]
  );

  const currentQuestion = filteredQuestions[currentIndex];

  const handleAnswer = useCallback(
    (selectedIndex: number) => {
      if (!currentQuestion || answers[currentQuestion.id]) return;
      dispatch(
        answerQuestion({
          questionId: currentQuestion.id,
          selectedIndex,
          correctAnswer: currentQuestion.correctAnswer,
        })
      );
    },
    [currentQuestion, answers, dispatch]
  );

  const handleOpenNote = useCallback(() => {
    if (!currentQuestion) return;
    setNoteTargetId(currentQuestion.id);
    setNoteText(notes[currentQuestion.id] || '');
    setNoteModalOpen(true);
  }, [currentQuestion, notes]);

  const handleSaveNote = useCallback(() => {
    if (noteTargetId) {
      dispatch(setNote({ questionId: noteTargetId, note: noteText }));
    }
    setNoteModalOpen(false);
    setNoteTargetId(null);
    setNoteText('');
  }, [noteTargetId, noteText, dispatch]);

  if (filteredQuestions.length === 0) {
    return (
      <div className="space-y-6">
        <SubjectTabs
          subjects={subjects}
          selected={selectedSubject}
          onSelect={(id) => dispatch(setSubject(id))}
        />
        <FilterBar
          filterMode={filterMode}
          allCount={totalForSubject}
          weakCount={weakCount}
          bookmarkCount={bookmarkCount}
          onFilterChange={(mode) => dispatch(setFilterMode(mode))}
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
                : 'No questions available for this subject.'}
          </p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const answer = answers[currentQuestion.id];
  const isRevealed = !!answer;
  const isBookmarked = bookmarks.includes(currentQuestion.id);
  const explanationVisible = showExplanation[currentQuestion.id];
  const hasNote = !!notes[currentQuestion.id];

  return (
    <div className="space-y-6">
      <SubjectTabs
        subjects={subjects}
        selected={selectedSubject}
        onSelect={(id) => dispatch(setSubject(id))}
      />

      <FilterBar
        filterMode={filterMode}
        allCount={totalForSubject}
        weakCount={weakCount}
        bookmarkCount={bookmarkCount}
        onFilterChange={(mode) => dispatch(setFilterMode(mode))}
      />

      <AdaptiveRevisionBanner />

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
                currentIndex + 1
              )}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[rgb(var(--color-text-muted))]">
                  Question {currentIndex + 1} of {filteredQuestions.length}
                </span>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase',
                    difficultyColors[currentQuestion.difficulty]
                  )}
                >
                  {currentQuestion.difficulty}
                </span>
              </div>
              <p className="mt-2 text-[15px] font-medium leading-relaxed text-[rgb(var(--color-text-primary))]">
                {currentQuestion.question}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={() => dispatch(toggleBookmark(currentQuestion.id))}
              className={cn(
                'rounded-lg p-2 transition-colors',
                isBookmarked
                  ? 'text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950'
                  : 'text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-surface-elevated))] hover:text-[rgb(var(--color-text-primary))]'
              )}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
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
                  : 'text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-surface-elevated))] hover:text-[rgb(var(--color-text-primary))]'
              )}
              title={hasNote ? 'Edit note' : 'Add note'}
            >
              <StickyNote size={18} className={hasNote ? 'fill-current' : ''} />
            </button>
          </div>
        </div>

        {hasNote && (
          <div className="mt-3 ml-11 rounded-lg border border-primary-200 bg-primary-50/50 px-3 py-2 dark:border-primary-800 dark:bg-primary-950/50">
            <p className="text-xs font-medium text-primary-600 dark:text-primary-400">
              Your Note:
            </p>
            <p className="mt-0.5 text-sm text-[rgb(var(--color-text-secondary))]">
              {notes[currentQuestion.id]}
            </p>
          </div>
        )}

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {currentQuestion.options.map((option, optIndex) => {
            const isOptionSelected =
              isRevealed && answer.selectedIndex === optIndex;
            const isCorrectOption = optIndex === currentQuestion.correctAnswer;
            const showAsCorrect = isRevealed && isCorrectOption;
            const showAsWrong = isOptionSelected && !answer.isCorrect;

            return (
              <button
                key={optIndex}
                disabled={isRevealed}
                onClick={() => handleAnswer(optIndex)}
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
                <span className="flex-1">{option}</span>
              </button>
            );
          })}
        </div>

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
                  <Check size={16} />
                  Correct! Well done.
                </>
              ) : (
                <>
                  <X size={16} />
                  Incorrect. The correct answer is{' '}
                  <span className="font-bold">
                    {String.fromCharCode(65 + currentQuestion.correctAnswer)}.{' '}
                    {currentQuestion.options[currentQuestion.correctAnswer]}
                  </span>
                </>
              )}
            </div>

            {currentQuestion.explanation && (
              <div>
                <button
                  onClick={() =>
                    dispatch(toggleExplanation(currentQuestion.id))
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

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          leftIcon={<ChevronLeft size={16} />}
          disabled={currentIndex === 0}
          onClick={() => dispatch(goToPreviousQuestion())}
        >
          Previous
        </Button>

        <span className="text-sm font-medium text-[rgb(var(--color-text-muted))]">
          {currentIndex + 1} / {filteredQuestions.length}
        </span>

        <Button
          rightIcon={<ChevronRight size={16} />}
          disabled={currentIndex === filteredQuestions.length - 1}
          onClick={() => dispatch(goToNextQuestion())}
        >
          Next
        </Button>
      </div>

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
              placeholder="Write your personal notes about this question..."
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

function SubjectTabs({
  subjects: subs,
  selected,
  onSelect,
}: {
  subjects: { id: string; label: string }[];
  selected: string;
  onSelect: (id: string) => void;
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
        {subs.map((sub) => (
          <button
            key={sub.id}
            onClick={() => onSelect(sub.id)}
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
    <div className="flex gap-2">
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
