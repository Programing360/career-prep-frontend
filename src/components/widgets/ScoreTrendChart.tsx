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
import { TrendingUp, TrendingDown, BarChart3, Minus } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export interface ScoreEntry {
  date: string;
  label: string;
  score: number;
  examSlug?: string;
}

interface ScoreTrendChartProps {
  data?: ScoreEntry[];
  isLoading?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: ScoreEntry }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const score = payload[0].value;
  const grade =
    score >= 80
      ? 'Excellent'
      : score >= 60
        ? 'Good'
        : score >= 40
          ? 'Fair'
          : 'Needs Work';

  return (
    <div className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-[rgb(var(--color-text-muted))]">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold text-primary-500">{score}%</p>
      <p className="text-[10px] text-[rgb(var(--color-text-muted))]">{grade}</p>
    </div>
  );
}

/** Skeleton pulse row */
function SkeletonBar({ w }: { w: string }) {
  return (
    <div
      className="h-full animate-pulse rounded-md bg-[rgb(var(--color-surface-elevated))]"
      style={{ width: w }}
    />
  );
}

export default function ScoreTrendChart({
  data,
  isLoading = false,
}: ScoreTrendChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const scores = useMemo(() => (data && data.length > 0 ? data : []), [data]);
  const hasData = scores.length > 0;

  const average = useMemo(() => {
    if (!hasData) return 0;
    return Math.round(
      scores.reduce((acc, s) => acc + s.score, 0) / scores.length
    );
  }, [scores, hasData]);

  const best = useMemo(() => {
    if (!hasData) return 0;
    return Math.max(...scores.map((s) => s.score));
  }, [scores, hasData]);

  const trend = useMemo(() => {
    if (scores.length < 2) return 0;
    return scores[scores.length - 1].score - scores[0].score;
  }, [scores]);

  const gridColor = isDark
    ? 'rgba(51, 65, 85, 0.5)'
    : 'rgba(226, 232, 240, 0.8)';
  const textColor = isDark
    ? 'rgba(148, 163, 184, 1)'
    : 'rgba(100, 116, 139, 1)';

  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor =
    trend > 0
      ? 'bg-accent-50 text-accent-700 dark:bg-accent-950 dark:text-accent-300'
      : trend < 0
        ? 'bg-danger-50 text-danger-700 dark:bg-danger-950 dark:text-danger-300'
        : 'bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-muted))]';

  return (
    <div className="rounded-xl border border-[rgb(var(--color-border))] shadow-lg bg-[rgb(var(--color-surface))] p-6 transition-colors hover:border-primary-200 dark:hover:border-primary-800">
      {/* Header */}
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
              {isLoading
                ? 'Loading…'
                : hasData
                  ? `Last ${scores.length} attempts`
                  : 'No attempts yet'}
            </p>
          </div>
        </div>

        {/* Trend badge */}
        <div
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${trendColor}`}
        >
          <TrendIcon size={12} />
          {trend > 0 ? '+' : ''}
          {trend}%
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-5 flex items-center gap-4">
        {isLoading ? (
          <>
            <div className="h-8 w-16 animate-pulse rounded-md bg-[rgb(var(--color-surface-elevated))]" />
            <div className="h-8 w-px bg-[rgb(var(--color-border))]" />
            <div className="h-8 w-16 animate-pulse rounded-md bg-[rgb(var(--color-surface-elevated))]" />
            <div className="h-8 w-px bg-[rgb(var(--color-border))]" />
            <div className="h-8 w-10 animate-pulse rounded-md bg-[rgb(var(--color-surface-elevated))]" />
          </>
        ) : (
          <>
            <div>
              <p className="text-2xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
                {hasData ? `${average}%` : '—'}
              </p>
              <p className="text-xs text-[rgb(var(--color-text-muted))]">
                Average Score
              </p>
            </div>
            <div className="h-8 w-px bg-[rgb(var(--color-border))]" />
            <div>
              <p className="text-2xl font-bold font-heading text-accent-500">
                {hasData ? `${best}%` : '—'}
              </p>
              <p className="text-xs text-[rgb(var(--color-text-muted))]">
                Best Score
              </p>
            </div>
            <div className="h-8 w-px bg-[rgb(var(--color-border))]" />
            <div>
              <p className="text-2xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
                {scores.length}
              </p>
              <p className="text-xs text-[rgb(var(--color-text-muted))]">
                Tests Taken
              </p>
            </div>
          </>
        )}
      </div>

      {/* Chart area */}
      <div className="mt-5 h-64">
        {isLoading ? (
          /* Skeleton chart */
          <div className="flex h-full items-end gap-2 pb-6">
            {[60, 75, 55, 80, 70, 85, 65].map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full animate-pulse rounded-t-md bg-[rgb(var(--color-surface-elevated))]"
                  style={{ height: `${h}%` }}
                />
                <SkeletonBar w="100%" />
              </div>
            ))}
          </div>
        ) : !hasData ? (
          /* Empty state */
          <div className="flex h-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-950">
              <BarChart3 size={22} className="text-primary-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                No test data yet
              </p>
              <p className="mt-0.5 text-xs text-[rgb(var(--color-text-muted))]">
                Complete a practice session to see your score trend here.
              </p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={scores}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7E22CE" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#7E22CE" stopOpacity={0} />
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
                stroke="#7E22CE"
                strokeWidth={2.5}
                fill="url(#scoreGradient)"
                dot={{
                  r: 4,
                  fill: '#7E22CE',
                  stroke: isDark ? '#1e293b' : '#ffffff',
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: '#7E22CE',
                  stroke: isDark ? '#1e293b' : '#ffffff',
                  strokeWidth: 3,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer legend */}
      <div className="mt-3 flex items-center justify-center gap-1 text-xs text-[rgb(var(--color-text-muted))]">
        <span className="inline-block h-2 w-2 rounded-full bg-primary-500" />
        {hasData
          ? 'Score % across your recent practice attempts'
          : 'Score percentage across recent mock tests'}
      </div>
    </div>
  );
}
