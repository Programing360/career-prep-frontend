import { motion } from 'framer-motion';
import { BookOpen, FileText, Lock, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { SourceTypeBadge } from './SourceTypeBadge';
import type { PastPaper } from '@/types/pastPaper';

export function PastPaperCard({
  paper,
  onPreview,
}: {
  paper: PastPaper;
  onPreview?: (id: string) => void;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: 'easeOut' },
        },
      }}
      className="group"
    >
      <div
        className={cn(
          'flex h-full flex-col rounded-xl border backdrop-blur-md transition-all duration-200',
          'border-white/20 bg-white/70 hover:shadow-lg dark:border-gray-800/50 dark:bg-gray-900/70'
        )}
      >
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-2">
            <SourceTypeBadge sourceType={paper.sourceType} />

            {paper.isLocked && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-400 dark:text-gray-500">
                <Lock size={12} />
                Locked
              </span>
            )}
          </div>

          <h3
            className={cn(
              'mt-3 text-base font-bold font-heading leading-snug',
              'text-gray-900 group-hover:text-primary-600',
              'dark:text-white dark:group-hover:text-primary-400'
            )}
          >
            {paper.title}
          </h3>

          <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span className="inline-flex items-center gap-1 rounded-md bg-gray-100/80 px-2 py-1 dark:bg-gray-800/80">
              <BookOpen size={11} />
              {paper.year}
            </span>
            <span className="inline-flex items-center rounded-md bg-gray-100/80 px-2 py-1 dark:bg-gray-800/80">
              {paper.subject}
            </span>
            <span className="inline-flex items-center rounded-md bg-gray-100/80 px-2 py-1 dark:bg-gray-800/80">
              <FileText size={11} />
              {paper.totalPages} pages
            </span>
            <span className="inline-flex items-center rounded-md bg-gray-100/80 px-2 py-1 dark:bg-gray-800/80">
              {paper.paperType}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200/60 px-5 py-3 dark:border-gray-800/60">
          <Button
            fullWidth
            variant="ghost"
            size="sm"
            leftIcon={paper.isLocked ? <Lock size={14} /> : <Eye size={14} />}
            disabled={paper.isLocked}
            onClick={() => onPreview?.(paper.id)}
            className={cn(
              'justify-between',
              !paper.isLocked &&
                'hover:text-primary-600 dark:hover:text-primary-400'
            )}
          >
            {paper.isLocked ? 'Unlock to Preview' : 'Preview Paper'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
