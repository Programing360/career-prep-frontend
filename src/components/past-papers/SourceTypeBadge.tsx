import type { SourceType } from '@/types/pastPaper';
import { ShieldCheck, Award, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const sourceTypeConfig: Record<
  SourceType,
  {
    label: string;
    tooltip: string;
    Icon: typeof ShieldCheck;
    containerClass: string;
    textClass: string;
  }
> = {
  official: {
    label: 'Official',
    tooltip: 'Authentic past paper sourced from the official examining body.',
    Icon: ShieldCheck,
    containerClass: 'bg-emerald-100 dark:bg-emerald-900/50',
    textClass: 'text-emerald-700 dark:text-emerald-300',
  },
  licensed: {
    label: 'Licensed',
    tooltip:
      'Reproduced with permission from authorized third-party publishers.',
    Icon: Award,
    containerClass: 'bg-sky-100 dark:bg-sky-900/50',
    textClass: 'text-sky-700 dark:text-sky-300',
  },
  practice_equivalent: {
    label: 'Practice Equivalent',
    tooltip:
      'Expert-crafted practice set designed to mirror the real exam pattern.',
    Icon: FileText,
    containerClass: 'bg-amber-100 dark:bg-amber-900/50',
    textClass: 'text-amber-700 dark:text-amber-300',
  },
};

export function SourceTypeBadge({
  sourceType,
  showTooltip = true,
}: {
  sourceType: SourceType;
  showTooltip?: boolean;
}) {
  const config = sourceTypeConfig[sourceType];
  const { Icon, label, tooltip, containerClass, textClass } = config;

  return (
    <span
      title={showTooltip ? tooltip : undefined}
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide',
        containerClass,
        textClass
      )}
    >
      <Icon size={12} />
      {label}
    </span>
  );
}

export function SourceTypeExplanation({
  sourceType,
}: {
  sourceType: SourceType;
}) {
  const config = sourceTypeConfig[sourceType];
  return (
    <p className="text-xs text-gray-500 dark:text-gray-400">{config.tooltip}</p>
  );
}
