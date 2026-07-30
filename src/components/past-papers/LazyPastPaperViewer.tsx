import { lazy, Suspense } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import type { PastPaper } from '@/types/pastPaper';

const PastPaperViewerModal = lazy(() => import('./PastPaperViewerModal'));

interface LazyPastPaperViewerProps {
  paper: PastPaper;
  onClose: () => void;
}

export function LazyPastPaperViewer({
  paper,
  onClose,
}: LazyPastPaperViewerProps) {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-8 dark:bg-gray-900">
            <Spinner size={32} />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading document viewer...
            </p>
          </div>
        </div>
      }
    >
      <PastPaperViewerModal paper={paper} onClose={onClose} />
    </Suspense>
  );
}
