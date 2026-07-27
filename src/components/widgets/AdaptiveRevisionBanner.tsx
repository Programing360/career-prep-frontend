import { useState, useMemo, useCallback } from 'react';
import {
  RefreshCcw,
  Brain,
  Clock,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface MissedQuestion {
  id: string;
  question: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  originalAttemptDate: string;
  daysSinceAttempt: number;
  timesIncorrect: number;
}

const mockMissedQuestions: MissedQuestion[] = [
  {
    id: 'rev-1',
    question:
      'Which article of Pakistan Constitution deals with fundamental rights?',
    subject: 'Pakistan Affairs',
    difficulty: 'medium',
    originalAttemptDate: '2026-07-16',
    daysSinceAttempt: 5,
    timesIncorrect: 2,
  },
  {
    id: 'rev-2',
    question: 'Find the next number: 2, 6, 12, 20, 30, ___',
    subject: 'Verbal Reasoning',
    difficulty: 'hard',
    originalAttemptDate: '2026-07-18',
    daysSinceAttempt: 3,
    timesIncorrect: 1,
  },
  {
    id: 'rev-3',
    question: 'Which hormone is responsible for regulating blood sugar levels?',
    subject: 'Everyday Science',
    difficulty: 'easy',
    originalAttemptDate: '2026-07-17',
    daysSinceAttempt: 4,
    timesIncorrect: 1,
  },
];

const difficultyColors: Record<string, string> = {
  easy: 'bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  hard: 'bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300',
};

export function AdaptiveRevisionBanner() {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const revisionQuestions = useMemo(() => mockMissedQuestions, []);

  const groupedBySubject = useMemo(() => {
    const groups: Record<string, MissedQuestion[]> = {};
    revisionQuestions.forEach((q) => {
      if (!groups[q.subject]) groups[q.subject] = [];
      groups[q.subject].push(q);
    });
    return groups;
  }, [revisionQuestions]);

  const handleStartRevision = useCallback(() => {
    setExpanded(true);
  }, []);

  if (dismissed) return null;

  if (!expanded) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-accent-200 bg-gradient-to-r from-accent-50/60 to-primary-50/40 p-4 dark:border-accent-800 dark:from-accent-950/40 dark:to-primary-950/30">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-100 dark:bg-accent-900">
          <RefreshCcw
            size={18}
            className="text-accent-600 dark:text-accent-400"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[rgb(var(--color-text-primary))]">
              Spaced Repetition Available
            </h3>
            <span className="flex items-center gap-1 rounded-full bg-accent-100 px-2 py-0.5 text-[9px] font-bold text-accent-700 dark:bg-accent-900 dark:text-accent-300">
              <Brain size={10} />
              {revisionQuestions.length} questions
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-[rgb(var(--color-text-muted))]">
            {revisionQuestions.length} previously incorrect questions are due
            for review based on spaced repetition.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            size="sm"
            onClick={handleStartRevision}
            leftIcon={<Sparkles size={12} />}
          >
            Review Now
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="rounded-md p-1 text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text-primary))]"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-accent-200 bg-[rgb(var(--color-surface))] p-5 dark:border-accent-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RefreshCcw size={16} className="text-accent-500" />
          <h3 className="text-sm font-bold font-heading text-[rgb(var(--color-text-primary))]">
            Adaptive Revision Engine
          </h3>
        </div>
        <button
          onClick={() => setExpanded(false)}
          className="text-xs font-medium text-primary-500 hover:text-primary-600"
        >
          Collapse
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {Object.entries(groupedBySubject).map(([subject, questions]) => (
          <div key={subject}>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-semibold text-[rgb(var(--color-text-secondary))]">
                {subject}
              </h4>
              <span className="rounded-full bg-[rgb(var(--color-surface-elevated))] px-2 py-0.5 text-[9px] font-bold text-[rgb(var(--color-text-muted))]">
                {questions.length} due
              </span>
            </div>

            <div className="mt-2 space-y-2">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="flex items-center gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-3 transition-colors hover:border-primary-300 dark:hover:border-primary-700"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900">
                    <Brain
                      size={14}
                      className="text-primary-600 dark:text-primary-400"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-[rgb(var(--color-text-primary))]">
                      {q.question}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[9px] font-semibold',
                          difficultyColors[q.difficulty]
                        )}
                      >
                        {q.difficulty}
                      </span>
                      <span className="flex items-center gap-0.5 text-[9px] text-[rgb(var(--color-text-muted))]">
                        <Clock size={9} />
                        {q.daysSinceAttempt}d ago
                      </span>
                      {q.timesIncorrect > 1 && (
                        <span className="flex items-center gap-0.5 text-[9px] text-danger-500">
                          <AlertTriangle size={9} />
                          Missed {q.timesIncorrect}x
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight
                    size={14}
                    className="shrink-0 text-[rgb(var(--color-text-muted))]"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Button size="sm" leftIcon={<RefreshCcw size={12} />}>
          Start Revision Session
        </Button>
        <p className="text-[10px] text-[rgb(var(--color-text-muted))]">
          Questions are ordered by optimal spaced repetition timing
        </p>
      </div>
    </div>
  );
}
