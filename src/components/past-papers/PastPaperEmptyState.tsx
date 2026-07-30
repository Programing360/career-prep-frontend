import { FileSearch } from 'lucide-react';

export function PastPaperEmptyState({ examName }: { examName?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300/60 bg-white/40 px-6 py-16 text-center dark:border-gray-700/50 dark:bg-gray-900/40">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <FileSearch size={32} className="text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
        No Past Papers Yet
      </h3>
      <p className="mt-2 max-w-sm text-sm text-gray-600 dark:text-gray-400">
        {examName
          ? `Past papers for ${examName} are being added — check back soon.`
          : 'Papers for this exam are being added — check back soon.'}
      </p>
    </div>
  );
}
