import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { TopicOption } from '@/services/mcqService';

interface MCQFilterChipsProps {
  topics: TopicOption[];
  selectedTopicId: string | undefined;
  selectedDifficulty: string | undefined;
  onSelectTopic: (topicId: string | undefined) => void;
  onSelectDifficulty: (difficulty: string | undefined) => void;
}

const DIFFICULTIES = [
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' },
] as const;

const chipVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.15, delay: i * 0.03 },
  }),
};

export function MCQFilterChips({
  topics,
  selectedTopicId,
  selectedDifficulty,
  onSelectTopic,
  onSelectDifficulty,
}: MCQFilterChipsProps) {
  return (
    <div className="space-y-3">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
          Topics
        </p>
        <div className="flex flex-wrap gap-2">
          <motion.button
            custom={0}
            variants={chipVariants}
            initial="hidden"
            animate="show"
            type="button"
            onClick={() => onSelectTopic(undefined)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition-all focus-ring',
              !selectedTopicId
                ? 'border-primary-400 bg-primary-500 text-white dark:border-primary-600'
                : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-secondary))] hover:border-primary-300 hover:bg-primary-50 dark:hover:border-primary-700'
            )}
          >
            All Topics
          </motion.button>
          {topics.map((topic, i) => (
            <motion.button
              key={topic.id}
              custom={i + 1}
              variants={chipVariants}
              initial="hidden"
              animate="show"
              type="button"
              onClick={() =>
                onSelectTopic(
                  selectedTopicId === topic.id ? undefined : topic.id
                )
              }
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-medium transition-all focus-ring',
                selectedTopicId === topic.id
                  ? 'border-primary-400 bg-primary-500 text-white dark:border-primary-600'
                  : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-secondary))] hover:border-primary-300 hover:bg-primary-50 dark:hover:border-primary-700'
              )}
            >
              {topic.name}
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
          Difficulty
        </p>
        <div className="flex flex-wrap gap-2">
          <motion.button
            custom={0}
            variants={chipVariants}
            initial="hidden"
            animate="show"
            type="button"
            onClick={() => onSelectDifficulty(undefined)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition-all focus-ring',
              !selectedDifficulty
                ? 'border-primary-400 bg-primary-500 text-white dark:border-primary-600'
                : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-secondary))] hover:border-primary-300 hover:bg-primary-50 dark:hover:border-primary-700'
            )}
          >
            All Levels
          </motion.button>
          {DIFFICULTIES.map((diff, i) => {
            const isSelected = selectedDifficulty?.toLowerCase() === diff.value;
            return (
              <motion.button
                key={diff.value}
                custom={i + 1}
                variants={chipVariants}
                initial="hidden"
                animate="show"
                type="button"
                onClick={() =>
                  onSelectDifficulty(isSelected ? undefined : diff.value)
                }
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-medium transition-all focus-ring',
                  isSelected
                    ? diff.value === 'easy'
                      ? 'border-accent-400 bg-accent-500 text-white'
                      : diff.value === 'medium'
                        ? 'border-primary-400 bg-primary-500 text-white'
                        : 'border-danger-400 bg-danger-500 text-white'
                    : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-secondary))] hover:border-primary-300 hover:bg-primary-50 dark:hover:border-primary-700'
                )}
              >
                {diff.label}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
