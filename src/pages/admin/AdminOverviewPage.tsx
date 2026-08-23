import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  Ban,
  Coins,
  Plus,
  Gift,
  TrendingUp,
  Clock,
  ChevronRight,
  ArrowUpRight,
  X,
  CheckCircle,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import { ROUTES } from '@/constants/routes';
import {
  getUsers,
  getExamsQueue,
  getAdminDashboardWelcome,
  updateUserSubscription,
  type AdminUser,
} from '@/services/adminService';

interface MetricCard {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'neutral';
  icon: typeof Users;
  iconBg: string;
  iconColor: string;
}

function MetricCardComponent({ metric }: { metric: MetricCard }) {
  const Icon = metric.icon;

  return (
    <div className="rounded-xl shadow-lg  bg-[#221f4a] p-6 transition-colors hover:border-primary-200 dark:hover:border-primary-800">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${metric.iconBg}`}
        >
          <Icon size={20} className={metric.iconColor} />
        </div>
        <div
          className={cn(
            'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
            metric.changeType === 'positive'
              ? 'bg-accent-50 text-accent-700 dark:bg-accent-950 dark:text-accent-300'
              : 'bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-muted))]'
          )}
        >
          {metric.changeType === 'positive' && <TrendingUp size={12} />}
          {metric.change}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-2xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
          {metric.value}
        </p>
        <p className="mt-1 text-sm text-white font-semibold">{metric.label}</p>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: AdminUser['role'] }) {
  const styles = {
    admin:
      'bg-danger-50 text-danger-700 dark:bg-danger-950 dark:text-danger-300',
    moderator:
      'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300',
    user: 'bg-secondary-100 text-secondary-600 dark:bg-secondary-800 dark:text-secondary-300',
  } as const;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold capitalize',
        styles[role]
      )}
    >
      <Shield size={12} />
      {role}
    </span>
  );
}

function SkeletonRow() {
  return (
    <div className="animate-pulse space-y-3 p-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[rgb(var(--color-surface-elevated))]" />
          <div className="h-3 flex-1 rounded bg-[rgb(var(--color-surface-elevated))]" />
        </div>
      ))}
    </div>
  );
}

interface GrantBonusModalProps {
  options: { label: string; value: string }[];
  onClose: () => void;
  onConfirm: (studentId: string, amount: number, reason: string) => void;
  isSubmitting?: boolean;
}

function GrantBonusModal({
  options,
  onClose,
  onConfirm,
  isSubmitting = false,
}: GrantBonusModalProps) {
  const [studentId, setStudentId] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const numericAmount = parseInt(amount, 10);
  const selectedStudent = options.find((s) => s.value === studentId);

  const handleSubmit = () => {
    if (!studentId) {
      setError('Select a student.');
      return;
    }
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setError('Enter a valid positive token amount.');
      return;
    }
    if (!reason.trim()) {
      setError('Please provide a reason.');
      return;
    }
    setError('');
    onConfirm(studentId, numericAmount, reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] shadow-xl">
        <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] px-6 py-4">
          <div className="flex items-center gap-2">
            <Gift size={18} className="text-primary-500" />
            <h2 className="font-semibold font-heading text-[rgb(var(--color-text-primary))]">
              Grant Bonus Tokens
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-[rgb(var(--color-surface-elevated))]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <Select
            label="Select Student"
            required
            options={options}
            placeholder="Choose a student"
            value={studentId}
            onChange={(e) => {
              setStudentId(e.target.value);
              setError('');
            }}
          />

          <Input
            label="Token Amount"
            required
            type="number"
            placeholder="e.g. 100"
            leftIcon={<Coins size={16} className="text-primary-500" />}
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError('');
            }}
          />

          {amount && !isNaN(numericAmount) && numericAmount > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-accent-50 px-3 py-2 text-xs font-medium text-accent-700 dark:bg-accent-950 dark:text-accent-300">
              <CheckCircle size={14} />
              Granting {numericAmount} tokens
              {selectedStudent ? ` to ${selectedStudent.label}` : ''}
            </div>
          )}

          <Textarea
            label="Reason"
            required
            placeholder="e.g. Bonus reward, Campaign promotion, Referral bonus"
            rows={2}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError('');
            }}
          />

          {error && (
            <p className="text-xs font-medium text-danger-500">{error}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[rgb(var(--color-border))] px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700"
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            Confirm Grant
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminOverviewPage() {
  const { showToast } = useToast();

  const [welcome, setWelcome] = useState('');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pendingVerifications, setPendingVerifications] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [grantModalOpen, setGrantModalOpen] = useState(false);
  const [grantSubmitting, setGrantSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');

    const [welcomeRes, usersRes, queueRes] = await Promise.allSettled([
      getAdminDashboardWelcome(),
      getUsers({ page: 1, limit: 100 }),
      getExamsQueue({ page: 1, limit: 100 }),
    ]);

    if (welcomeRes.status === 'fulfilled') {
      setWelcome(welcomeRes.value.message ?? '');
    }

    if (usersRes.status === 'fulfilled') {
      setUsers(usersRes.value.data ?? []);
      setTotalUsers(
        usersRes.value.pagination?.total ?? usersRes.value.data?.length ?? 0
      );
    } else {
      setError((prev) =>
        prev ? `${prev} Failed to load users.` : 'Failed to load users.'
      );
    }

    if (queueRes.status === 'fulfilled') {
      setPendingVerifications(queueRes.value.data?.length ?? 0);
    }

    if (
      welcomeRes.status === 'rejected' &&
      usersRes.status === 'rejected' &&
      queueRes.status === 'rejected'
    ) {
      setError('Failed to load dashboard data. Please try again.');
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      void loadData();
    }, 0);
    return () => clearTimeout(t);
  }, [loadData]);

  const metrics = useMemo<MetricCard[]>(() => {
    const staffCount = users.filter(
      (u) => u.role === 'admin' || u.role === 'moderator'
    ).length;
    const bannedCount = users.filter((u) => u.isBanned).length;

    return [
      {
        label: 'Total Users',
        value: totalUsers.toLocaleString(),
        change: 'Live',
        changeType: 'positive' as const,
        icon: Users,
        iconBg: 'bg-primary-50 dark:bg-primary-950',
        iconColor: 'text-primary-500',
      },
      {
        label: 'Staff (Admin + Moderator)',
        value: staffCount.toLocaleString(),
        change: 'From loaded list',
        changeType: 'neutral' as const,
        icon: ShieldCheck,
        iconBg: 'bg-accent-50 dark:bg-accent-950',
        iconColor: 'text-accent-500',
      },
      {
        label: 'Banned Accounts',
        value: bannedCount.toLocaleString(),
        change: 'From loaded list',
        changeType: 'neutral' as const,
        icon: Ban,
        iconBg: 'bg-danger-50 dark:bg-danger-950',
        iconColor: 'text-danger-500',
      },
      {
        label: 'Pending Exam Verifications',
        value: pendingVerifications.toLocaleString(),
        change: 'Staging queue',
        changeType: 'neutral' as const,
        icon: Coins,
        iconBg: 'bg-violet-50 dark:bg-violet-950',
        iconColor: 'text-violet-500',
      },
    ];
  }, [totalUsers, users, pendingVerifications]);

  const studentOptions = useMemo(
    () =>
      users
        .filter((u) => u.role === 'user')
        .map((u) => ({
          label: u.name ? `${u.name} (${u.email})` : u.email,
          value: u._id,
        })),
    [users]
  );

  const recentUsers = useMemo(() => users.slice(0, 6), [users]);

  const handleGrantBonus = useCallback(
    async (studentId: string, amount: number, reason: string) => {
      setGrantSubmitting(true);
      try {
        const student = users.find((u) => u._id === studentId);
        const currentBalance = student?.aiTokenBalance ?? 0;
        await updateUserSubscription(studentId, {
          aiTokenBalance: Math.max(currentBalance + amount, 0),
        });
        showToast(
          `Granted ${amount} tokens to ${student?.email ?? studentId}. Reason: ${reason}`,
          'success'
        );
        setUsers((prev) =>
          prev.map((u) =>
            u._id === studentId
              ? { ...u, aiTokenBalance: Math.max(u.aiTokenBalance + amount, 0) }
              : u
          )
        );
        setGrantModalOpen(false);
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : 'Failed to grant bonus tokens.',
          'error'
        );
      } finally {
        setGrantSubmitting(false);
      }
    },
    [users, showToast]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-300">
            {welcome ||
              'Overview of platform performance and student activity.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to={ROUTES.ADMIN_EXAMS_NEW}>
            <Button
              variant="primary"
              className="bg-[#18153a] dark:bg-primary-600 dark:hover:bg-[#16133a]"
              leftIcon={<Plus size={16} />}
            >
              Add New Exam
            </Button>
          </Link>
          <Button
            variant="outline"
            leftIcon={<Gift size={16} />}
            onClick={() => setGrantModalOpen(true)}
            className="bg-white dark:hover:text-white"
            disabled={studentOptions.length === 0}
            title={
              studentOptions.length === 0
                ? 'No regular users loaded yet.'
                : undefined
            }
          >
            Grant Bonus Tokens
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700 dark:border-danger-900 dark:bg-danger-950 dark:text-danger-300">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={() => void loadData()}>
            Retry
          </Button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[132px] animate-pulse rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCardComponent key={metric.label} metric={metric} />
          ))}
        </div>
      )}

      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
        <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] px-6 py-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-primary-500" />
            <h2 className="font-semibold font-heading text-[rgb(var(--color-text-primary))]">
              Recently Joined Users
            </h2>
          </div>
          <Link
            to={ROUTES.ADMIN_USERS}
            className="flex items-center gap-1 text-xs font-medium text-primary-500 transition-colors hover:text-primary-600"
          >
            View All
            <ChevronRight size={14} />
          </Link>
        </div>

        {loading ? (
          <SkeletonRow />
        ) : recentUsers.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-[rgb(var(--color-text-muted))]">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgb(var(--color-border))]">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgb(var(--color-border))]">
                {recentUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="transition-colors hover:bg-[rgb(var(--color-surface-elevated))]"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                          {(user.name ?? user.email).charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                          {user.name ?? '—'}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[rgb(var(--color-text-secondary))]">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[rgb(var(--color-text-muted))]">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <button
                        onClick={() => setGrantModalOpen(true)}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary-500 transition-colors hover:bg-primary-50 dark:hover:bg-primary-950"
                      >
                        View
                        <ArrowUpRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {grantModalOpen && (
        <GrantBonusModal
          options={studentOptions}
          isSubmitting={grantSubmitting}
          onClose={() => {
            if (!grantSubmitting) setGrantModalOpen(false);
          }}
          onConfirm={handleGrantBonus}
        />
      )}
    </div>
  );
}
