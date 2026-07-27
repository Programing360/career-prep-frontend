import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Target, TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface SubjectData {
  subject: string;
  accuracy: number;
  shortLabel: string;
}

const mockSubjects: SubjectData[] = [
  { subject: 'English', accuracy: 87, shortLabel: 'ENG' },
  { subject: 'General Knowledge', accuracy: 72, shortLabel: 'GK' },
  { subject: 'Mathematics', accuracy: 65, shortLabel: 'MATH' },
  { subject: 'Science', accuracy: 91, shortLabel: 'SCI' },
  { subject: 'Reasoning', accuracy: 78, shortLabel: 'RSN' },
  { subject: 'Current Affairs', accuracy: 83, shortLabel: 'CA' },
];

const barColors = [
  '#3b82f6',
  '#22c55e',
  '#f59e0b',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: SubjectData }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const accuracy = payload[0].value;
  const grade =
    accuracy >= 85
      ? 'Excellent'
      : accuracy >= 70
        ? 'Good'
        : accuracy >= 55
          ? 'Fair'
          : 'Needs Work';

  return (
    <div className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-[rgb(var(--color-text-muted))]">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold text-primary-500">
        {accuracy}% accuracy
      </p>
      <p className="text-[10px] text-[rgb(var(--color-text-muted))]">{grade}</p>
    </div>
  );
}

interface CustomBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  payload?: SubjectData;
}

function RoundedBar(props: CustomBarProps) {
  const { x = 0, y = 0, width = 0, height = 0, fill } = props;
  const radius = Math.min(6, width / 2);

  if (height <= 0) return null;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={radius}
        ry={radius}
        fill={fill}
      />
    </g>
  );
}

export default function SubjectBreakdownChart() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const average = useMemo(() => {
    const sum = mockSubjects.reduce((acc, s) => acc + s.accuracy, 0);
    return Math.round(sum / mockSubjects.length);
  }, []);

  const strongest = useMemo(
    () => mockSubjects.reduce((a, b) => (a.accuracy > b.accuracy ? a : b)),
    []
  );

  const weakest = useMemo(
    () => mockSubjects.reduce((a, b) => (a.accuracy < b.accuracy ? a : b)),
    []
  );

  const gridColor = isDark
    ? 'rgba(51, 65, 85, 0.5)'
    : 'rgba(226, 232, 240, 0.8)';
  const textColor = isDark
    ? 'rgba(148, 163, 184, 1)'
    : 'rgba(100, 116, 139, 1)';

  return (
    <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 transition-colors hover:border-primary-200 dark:hover:border-primary-800">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-50 dark:bg-accent-950">
            <Target size={20} className="text-accent-500" />
          </div>
          <div>
            <h3 className="font-semibold font-heading text-[rgb(var(--color-text-primary))]">
              Subject Breakdown
            </h3>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">
              Accuracy by subject
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-accent-50 px-2.5 py-1 text-xs font-medium text-accent-700 dark:bg-accent-950 dark:text-accent-300">
          <Target size={12} />
          {average}% avg
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-3">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={14} className="text-accent-500" />
            <span className="text-xs font-medium text-[rgb(var(--color-text-muted))]">
              Strongest
            </span>
          </div>
          <p className="mt-1 text-sm font-bold text-[rgb(var(--color-text-primary))]">
            {strongest.subject}
          </p>
          <p className="text-xs text-accent-500">{strongest.accuracy}%</p>
        </div>
        <div className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-3">
          <div className="flex items-center gap-1.5">
            <TrendingDown size={14} className="text-amber-500" />
            <span className="text-xs font-medium text-[rgb(var(--color-text-muted))]">
              Needs Focus
            </span>
          </div>
          <p className="mt-1 text-sm font-bold text-[rgb(var(--color-text-primary))]">
            {weakest.subject}
          </p>
          <p className="text-xs text-amber-500">{weakest.accuracy}%</p>
        </div>
      </div>

      <div className="mt-5 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={mockSubjects}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            barCategoryGap="20%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridColor}
              vertical={false}
            />
            <XAxis
              dataKey="shortLabel"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: textColor }}
              dy={8}
            />
            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: textColor }}
              dx={-8}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="accuracy" shape={<RoundedBar />} maxBarSize={40}>
              {mockSubjects.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={barColors[index % barColors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        {mockSubjects.map((subject, index) => (
          <div key={subject.subject} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: barColors[index % barColors.length] }}
            />
            <span className="text-[11px] text-[rgb(var(--color-text-muted))]">
              {subject.subject}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {mockSubjects.map((subject, index) => (
          <div
            key={subject.subject}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-2.5 py-1.5',
              subject.accuracy >= 85
                ? 'border-accent-200 bg-accent-50 dark:border-accent-800 dark:bg-accent-950'
                : subject.accuracy >= 70
                  ? 'border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-950'
                  : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950'
            )}
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: barColors[index % barColors.length] }}
            />
            <span className="text-[11px] font-medium text-[rgb(var(--color-text-primary))]">
              {subject.shortLabel}
            </span>
            <span
              className={cn(
                'ml-auto text-[11px] font-bold',
                subject.accuracy >= 85
                  ? 'text-accent-600 dark:text-accent-400'
                  : subject.accuracy >= 70
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-amber-600 dark:text-amber-400'
              )}
            >
              {subject.accuracy}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
