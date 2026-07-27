import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface ScoreEntry {
  date: string;
  label: string;
  score: number;
}

const mockScores: ScoreEntry[] = [
  { date: '2026-07-17', label: 'Jul 17', score: 62 },
  { date: '2026-07-18', label: 'Jul 18', score: 71 },
  { date: '2026-07-19', label: 'Jul 19', score: 68 },
  { date: '2026-07-20', label: 'Jul 20', score: 82 },
  { date: '2026-07-21', label: 'Jul 21', score: 75 },
  { date: '2026-07-22', label: 'Jul 22', score: 88 },
  { date: '2026-07-23', label: 'Jul 23', score: 85 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: ScoreEntry }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-[rgb(var(--color-text-muted))]">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold text-primary-500">
        {payload[0].value}%
      </p>
    </div>
  );
}

export default function ScoreTrendChart() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const average = useMemo(() => {
    const sum = mockScores.reduce((acc, s) => acc + s.score, 0);
    return Math.round(sum / mockScores.length);
  }, []);

  const trend = useMemo(() => {
    const first = mockScores[0].score;
    const last = mockScores[mockScores.length - 1].score;
    return last - first;
  }, []);

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
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-950">
            <BarChart3 size={20} className="text-primary-500" />
          </div>
          <div>
            <h3 className="font-semibold font-heading text-[rgb(var(--color-text-primary))]">
              Score Trend
            </h3>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">
              Last 7 mock tests
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700 dark:bg-violet-950 dark:text-violet-300">
          <TrendingUp size={12} />
          {trend > 0 ? '+' : ''}
          {trend}%
        </div>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <div>
          <p className="text-2xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
            {average}%
          </p>
          <p className="text-xs text-[rgb(var(--color-text-muted))]">
            Average Score
          </p>
        </div>
        <div className="h-8 w-px bg-[rgb(var(--color-border))]" />
        <div>
          <p className="text-2xl font-bold font-heading text-accent-500">
            {Math.max(...mockScores.map((s) => s.score))}%
          </p>
          <p className="text-xs text-[rgb(var(--color-text-muted))]">
            Best Score
          </p>
        </div>
        <div className="h-8 w-px bg-[rgb(var(--color-border))]" />
        <div>
          <p className="text-2xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
            {mockScores.length}
          </p>
          <p className="text-xs text-[rgb(var(--color-text-muted))]">
            Tests Taken
          </p>
        </div>
      </div>

      <div className="mt-5 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={mockScores}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridColor}
              vertical={false}
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: textColor }}
              dy={8}
            />
            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: textColor }}
              dx={-8}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fill="url(#scoreGradient)"
              dot={{
                r: 4,
                fill: '#3b82f6',
                stroke: isDark ? '#1e293b' : '#ffffff',
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: '#3b82f6',
                stroke: isDark ? '#1e293b' : '#ffffff',
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-center gap-1 text-xs text-[rgb(var(--color-text-muted))]">
        <span className="inline-block h-2 w-2 rounded-full bg-primary-500" />
        Score percentage across recent mock tests
      </div>
    </div>
  );
}
