import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MCQExplanationPanelProps {
  explanation?: string;
  isRevealed: boolean;
}

export function MCQExplanationPanel({
  explanation,
  isRevealed,
}: MCQExplanationPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isRevealed) return null;
  if (!explanation) return null;

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-lg border px-4 py-3 text-left transition-all',
          isExpanded
            ? 'border-primary-200 bg-primary-50/50 dark:border-primary-800 dark:bg-primary-950/50'
            : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] hover:border-primary-200 hover:bg-primary-50/30 dark:hover:border-primary-800'
        )}
        aria-expanded={isExpanded}
        aria-controls="explanation-content"
      >
        <div className="flex items-center gap-2">
          <Brain size={16} className="shrink-0 text-primary-500" />
          <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
            AI Explanation
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp
            size={16}
            className="shrink-0 text-[rgb(var(--color-text-muted))]"
          />
        ) : (
          <ChevronDown
            size={16}
            className="shrink-0 text-[rgb(var(--color-text-muted))]"
          />
        )}
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id="explanation-content"
            key="explanation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border border-t-0 border-primary-200 bg-primary-50/30 px-4 py-3 dark:border-primary-800 dark:bg-primary-950/30 rounded-b-lg">
              <p className="text-sm leading-relaxed text-[rgb(var(--color-text-secondary))]">
                {explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
