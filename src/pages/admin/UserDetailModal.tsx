import { useEffect, useState } from 'react';
import {
  X,
  Mail,
  Phone,
  Shield,
  Calendar,
  Coins,
  Target,
  TrendingUp,
  Award,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import {
  getUserById,
  getUserLearningHistory,
  updateUserPreferences,
  type AdminUser,
  type UserLearningHistory,
} from '@/services/adminService';
import { getPublicExams } from '@/services/examService';
import type { DirectoryExam } from '@/types';

interface UserDetailModalProps {
  user: AdminUser;
  onClose: () => void;
  onPreferencesUpdated: (userId: string, targetExams: string[]) => void;
}

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Mail;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-950">
        <Icon size={15} className="text-primary-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-[rgb(var(--color-text-muted))]">
          {label}
        </p>
        <div className="text-sm text-[rgb(var(--color-text-primary))]">
          {children}
        </div>
      </div>
    </div>
  );
}

function SubscriptionCard({ user }: { user: AdminUser }) {
  const plan = user.subscriptionPlan;
  return (
    <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coins size={16} className="text-primary-500" />
          <h3 className="text-sm font-semibold font-heading text-[rgb(var(--color-text-primary))]">
            Subscription
          </h3>
        </div>
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-[11px] font-semibold',
            user.subscriptionStatus === 'active'
              ? 'bg-accent-50 text-accent-700 dark:bg-accent-950 dark:text-accent-300'
              : user.subscriptionStatus === 'expired'
                ? 'bg-danger-50 text-danger-700 dark:bg-danger-950 dark:text-danger-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
          )}
        >
          {user.subscriptionStatus}
        </span>
      </div>
      <div className="mt-3 space-y-1.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-[rgb(var(--color-text-muted))]">Plan</span>
          <span className="font-medium text-[rgb(var(--color-text-primary))]">
            {plan?.name ?? 'Free'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[rgb(var(--color-text-muted))]">AI Tokens</span>
          <span className="font-medium text-primary-500">
            {user.aiTokenBalance}
          </span>
        </div>
        {plan?.price != null && (
          <div className="flex items-center justify-between">
            <span className="text-[rgb(var(--color-text-muted))]">Price</span>
            <span className="font-medium text-[rgb(var(--color-text-primary))]">
              {plan.price} / {plan.billingCycle ?? 'cycle'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryCard({
  history,
  loading,
}: {
  history: UserLearningHistory | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-4">
        <div className="h-4 w-32 animate-pulse rounded bg-[rgb(var(--color-surface))]" />
        <div className="h-3 w-full animate-pulse rounded bg-[rgb(var(--color-surface))]" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-[rgb(var(--color-surface))]" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-4">
      <div className="flex items-center gap-2">
        <TrendingUp size={16} className="text-primary-500" />
        <h3 className="text-sm font-semibold font-heading text-[rgb(var(--color-text-primary))]">
          Learning History
        </h3>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-[rgb(var(--color-surface))] p-3">
          <p className="text-xs text-[rgb(var(--color-text-muted))]">
            Tests Taken
          </p>
          <p className="mt-0.5 text-lg font-bold text-[rgb(var(--color-text-primary))]">
            {history?.totalTestsTaken ?? 0}
          </p>
        </div>
        <div className="rounded-lg bg-[rgb(var(--color-surface))] p-3">
          <p className="text-xs text-[rgb(var(--color-text-muted))]">
            Avg Score
          </p>
          <p className="mt-0.5 text-lg font-bold text-primary-500">
            {history?.averageScorePercentage ?? 0}%
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-[rgb(var(--color-text-muted))]">
          <Award size={13} />
          Weak Topics
        </p>
        {!history || history.weakTopics.length === 0 ? (
          <p className="text-xs text-[rgb(var(--color-text-muted))]">
            No weak topics identified yet.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {history.weakTopics.map((topic) => (
              <span
                key={topic}
                className="rounded-md bg-danger-50 px-2 py-0.5 text-[11px] font-medium text-danger-600 dark:bg-danger-950 dark:text-danger-300"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-[rgb(var(--color-text-muted))]">
          <BookOpen size={13} />
          Recent Attempts
        </p>
        {!history || history.recentAttempts.length === 0 ? (
          <p className="text-xs text-[rgb(var(--color-text-muted))]">
            No attempts recorded yet.
          </p>
        ) : (
          <div className="space-y-2">
            {history.recentAttempts.map((attempt, i) => (
              <div
                key={attempt._id ?? i}
                className="flex items-center justify-between rounded-lg bg-[rgb(var(--color-surface))] px-3 py-2 text-sm"
              >
                <span className="truncate text-[rgb(var(--color-text-primary))]">
                  {attempt.examTitle ?? 'Practice test'}
                </span>
                <span className="shrink-0 font-medium text-primary-500">
                  {attempt.percentage != null
                    ? `${attempt.percentage}%`
                    : attempt.score != null
                      ? `${attempt.score}/${attempt.totalMarks}`
                      : '—'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function UserDetailModal({
  user,
  onClose,
  onPreferencesUpdated,
}: UserDetailModalProps) {
  const { showToast } = useToast();
  const [detail, setDetail] = useState<AdminUser | null>(null);
  const [history, setHistory] = useState<UserLearningHistory | null>(null);
  const [exams, setExams] = useState<DirectoryExam[]>([]);
  const [selectedExams, setSelectedExams] = useState<string[]>(
    user.targetExams?.map((e) => e._id) ?? []
  );
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([
      getUserById(user._id),
      getUserLearningHistory(user._id),
      getPublicExams({ limit: 100 }),
    ]).then(([detailRes, historyRes, examsRes]) => {
      if (cancelled) return;
      if (detailRes.status === 'fulfilled') {
        setDetail(detailRes.value.data);
        setSelectedExams(
          detailRes.value.data.targetExams?.map((e) => e._id) ?? []
        );
      } else {
        setDetail(user);
      }
      if (historyRes.status === 'fulfilled') {
        setHistory(historyRes.value.data);
      }
      if (examsRes.status === 'fulfilled') {
        setExams(examsRes.value.data ?? []);
      }
      setLoading(false);
      setHistoryLoading(false);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user._id]);

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      await updateUserPreferences(user._id, { targetExams: selectedExams });
      onPreferencesUpdated(user._id, selectedExams);
      showToast('Target exam preferences updated.', 'success');
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to update preferences.',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  const examOptions = exams.map((exam) => ({
    label: exam.title,
    value: exam._id,
  }));

  const display = detail ?? user;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] shadow-xl">
        <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] px-6 py-4">
          <div>
            <h2 className="font-semibold font-heading text-[rgb(var(--color-text-primary))]">
              User Details
            </h2>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">
              {user.email}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-[rgb(var(--color-surface-elevated))]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Spinner size={24} />
            </div>
          ) : (
            <div className="space-y-5">
              {/* Identity */}
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                  {(display.name ?? display.email).charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-bold text-[rgb(var(--color-text-primary))]">
                    {display.name ?? '—'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-[rgb(var(--color-text-muted))]">
                    <span className="inline-flex items-center gap-1">
                      <Shield size={12} className="text-primary-500" />
                      {display.role}
                    </span>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 font-semibold',
                        !display.isBanned
                          ? 'bg-accent-50 text-accent-700 dark:bg-accent-950 dark:text-accent-300'
                          : 'bg-danger-50 text-danger-700 dark:bg-danger-950 dark:text-danger-300'
                      )}
                    >
                      {display.isBanned ? 'Blocked' : 'Active'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact / meta grid */}
              <div className="grid gap-3 sm:grid-cols-2">
                <DetailRow icon={Mail} label="Email">
                  {display.email}
                </DetailRow>
                <DetailRow icon={Phone} label="Phone">
                  {display.phone || '—'}
                </DetailRow>
                <DetailRow icon={Calendar} label="Joined">
                  {display.createdAt
                    ? new Date(display.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : '—'}
                </DetailRow>
                <DetailRow icon={Shield} label="Email Verified">
                  {display.isEmailVerified ? 'Yes' : 'No'}
                </DetailRow>
              </div>

              {/* Subscription */}
              <SubscriptionCard user={display} />

              {/* Preferences */}
              <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-4">
                <div className="flex items-center gap-2">
                  <Target size={16} className="text-primary-500" />
                  <h3 className="text-sm font-semibold font-heading text-[rgb(var(--color-text-primary))]">
                    Target Exams
                  </h3>
                </div>
                <p className="mt-1 text-xs text-[rgb(var(--color-text-muted))]">
                  Select the exams this candidate is preparing for.
                </p>
                <div className="mt-3">
                  <MultiSelect
                    options={examOptions}
                    value={selectedExams}
                    onChange={setSelectedExams}
                    placeholder="Select target exams..."
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => void handleSavePreferences()}
                    isLoading={saving}
                    disabled={saving}
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>

              {/* Learning History */}
              <HistoryCard history={history} loading={historyLoading} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
