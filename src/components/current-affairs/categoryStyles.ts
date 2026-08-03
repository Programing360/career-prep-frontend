const CATEGORY_COLORS: Record<string, string> = {
  Pakistan: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  International:
    'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  Economy: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  'Science & Tech':
    'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300',
  Sports:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  'Important Days':
    'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
};

export function getCategoryClass(category: string): string {
  return (
    CATEGORY_COLORS[category] ??
    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  );
}
