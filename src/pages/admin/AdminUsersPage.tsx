import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Search,
  Coins,
  Ban,
  CheckCircle,
  X,
  Plus,
  Minus,
  Filter,
  KeyRound,
  Eye,
  UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import {
  getUsers,
  updateUserRole,
  banUser,
  unbanUser,
  resetUserPassword,
  updateUserSubscription,
  type AdminUser,
  type GetUsersParams,
} from '@/services/adminService';
import { sendInvitation } from '@/services/invitationService';
import type { UserRole } from '@/types/auth';
import { UserDetailModal } from './UserDetailModal';

type FilterStatus = 'all' | 'active' | 'suspended';

interface AdjustTokenModalProps {
  student: AdminUser;
  onClose: () => void;
  onConfirm: (studentId: string, amount: number) => Promise<void>;
  isSubmitting: boolean;
}

function AdjustTokenModal({
  student,
  onClose,
  onConfirm,
  isSubmitting,
}: AdjustTokenModalProps) {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const numericAmount = parseInt(amount, 10);
  const isAdd = numericAmount > 0;
  const newBalance =
    student.aiTokenBalance + (isNaN(numericAmount) ? 0 : numericAmount);

  const handleSubmit = async () => {
    if (!amount || isNaN(numericAmount) || numericAmount === 0) {
      setError('Enter a valid amount (positive to add, negative to deduct).');
      return;
    }
    if (newBalance < 0) {
      setError('Deduction exceeds current balance.');
      return;
    }
    if (!reason.trim()) {
      setError('Please provide a reason.');
      return;
    }
    setError('');
    await onConfirm(student._id, numericAmount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] shadow-xl">
        <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] px-6 py-4">
          <div className="flex items-center gap-2">
            <Coins size={18} className="text-primary-500" />
            <h2 className="font-semibold font-heading text-[rgb(var(--color-text-primary))]">
              Adjust Tokens
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
          <div className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-3">
            <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
              {student.name ?? student.email}
            </p>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">
              {student.email}
            </p>
            <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
              Current Balance:{' '}
              <span className="font-semibold text-primary-500">
                {student.aiTokenBalance} tokens
              </span>
            </p>
          </div>

          <Input
            label="Token Amount"
            type="number"
            placeholder="+100 or -50"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError('');
            }}
            leftIcon={
              numericAmount >= 0 ? (
                <Plus size={16} className="text-accent-500" />
              ) : (
                <Minus size={16} className="text-danger-500" />
              )
            }
          />

          {amount && !isNaN(numericAmount) && numericAmount !== 0 && (
            <div
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium',
                isAdd
                  ? 'bg-accent-50 text-accent-700 dark:bg-accent-950 dark:text-accent-300'
                  : 'bg-danger-50 text-danger-700 dark:bg-danger-950 dark:text-danger-300'
              )}
            >
              {isAdd ? 'Adding' : 'Deducting'} {Math.abs(numericAmount)} tokens
              &mdash; New Balance:{' '}
              <span className="font-bold">{newBalance}</span>
            </div>
          )}

          <Textarea
            label="Reason"
            placeholder="e.g. Bonus reward, Refund, Manual correction"
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
            variant="primary"
            size="sm"
            onClick={() => void handleSubmit()}
            isLoading={isSubmitting}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}

interface BanModalProps {
  student: AdminUser;
  onClose: () => void;
  onConfirm: (studentId: string, reason: string) => Promise<void>;
  isSubmitting: boolean;
}

function BanModal({
  student,
  onClose,
  onConfirm,
  isSubmitting,
}: BanModalProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (reason.trim().length < 3) {
      setError('Reason must be at least 3 characters long.');
      return;
    }
    setError('');
    await onConfirm(student._id, reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] shadow-xl">
        <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] px-6 py-4">
          <div className="flex items-center gap-2">
            <Ban size={18} className="text-danger-500" />
            <h2 className="font-semibold font-heading text-[rgb(var(--color-text-primary))]">
              Block User
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
          <div className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-3">
            <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
              {student.name ?? student.email}
            </p>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">
              {student.email}
            </p>
          </div>

          <Textarea
            label="Ban Reason"
            required
            placeholder="e.g. Abusive behavior in forum"
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
            className="bg-danger-600 text-white hover:bg-danger-700"
            onClick={() => void handleSubmit()}
            isLoading={isSubmitting}
          >
            Block User
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ResetPasswordModalProps {
  student: AdminUser;
  onClose: () => void;
  onConfirm: (studentId: string, newPassword: string) => Promise<void>;
  isSubmitting: boolean;
}

function ResetPasswordModal({
  student,
  onClose,
  onConfirm,
  isSubmitting,
}: ResetPasswordModalProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    await onConfirm(student._id, newPassword);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] shadow-xl">
        <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] px-6 py-4">
          <div className="flex items-center gap-2">
            <KeyRound size={18} className="text-primary-500" />
            <h2 className="font-semibold font-heading text-[rgb(var(--color-text-primary))]">
              Reset Password
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
          <div className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-3">
            <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
              {student.name ?? student.email}
            </p>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">
              {student.email}
            </p>
            <p className="mt-1 text-xs text-danger-500">
              All active sessions will be revoked.
            </p>
          </div>

          <Input
            label="New Password"
            required
            type="password"
            placeholder="Min. 8 characters"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setError('');
            }}
          />

          <Input
            label="Confirm Password"
            required
            type="password"
            placeholder="Re-enter the new password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
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
            onClick={() => void handleSubmit()}
            isLoading={isSubmitting}
          >
            Reset Password
          </Button>
        </div>
      </div>
    </div>
  );
}

interface InviteStaffModalProps {
  onClose: () => void;
  onInvited: () => void;
}

const STAFF_ROLE_OPTIONS = [
  { label: 'Moderator', value: 'moderator' },
  { label: 'Admin', value: 'admin' },
];

function InviteStaffModal({ onClose, onInvited }: InviteStaffModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'moderator'>('moderator');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteLink, setInviteLink] = useState('');

  const handleSubmit = async () => {
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const res = await sendInvitation({ email: email.trim(), role });
      if (res.devInviteUrl) {
        setInviteLink(res.devInviteUrl);
      } else {
        onInvited();
        onClose();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to send the invitation. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] shadow-xl">
        <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] px-6 py-4">
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-primary-500" />
            <h2 className="font-semibold font-heading text-[rgb(var(--color-text-primary))]">
              Invite Staff
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-[rgb(var(--color-surface-elevated))]"
          >
            <X size={18} />
          </button>
        </div>

        {inviteLink ? (
          <div className="space-y-4 px-6 py-5">
            <div className="rounded-lg border border-accent-200 bg-accent-50 p-3 text-xs text-accent-700 dark:border-accent-900 dark:bg-accent-950 dark:text-accent-300">
              Invitation email sent. Development link (valid 24h):
            </div>
            <a
              href={inviteLink}
              target="_blank"
              rel="noreferrer"
              className="block break-all rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] px-3 py-2 text-xs text-primary-500 hover:underline"
            >
              {inviteLink}
            </a>
            <div className="flex justify-end">
              <Button size="sm" variant="primary" onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4 px-6 py-5">
              <Input
                label="Email address"
                type="email"
                placeholder="new.staff@careerportal.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
              />

              <Select
                label="Role"
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as 'admin' | 'moderator')
                }
                options={STAFF_ROLE_OPTIONS}
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
                variant="primary"
                size="sm"
                onClick={() => void handleSubmit()}
                isLoading={isSubmitting}
              >
                Send Invitation
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ isBanned }: { isBanned: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
        !isBanned
          ? 'bg-accent-50 text-accent-700 dark:bg-accent-950 dark:text-accent-300'
          : 'bg-danger-50 text-danger-700 dark:bg-danger-950 dark:text-danger-300'
      )}
    >
      {!isBanned ? <CheckCircle size={12} /> : <Ban size={12} />}
      {!isBanned ? 'Active' : 'Blocked'}
    </span>
  );
}

const ROLE_OPTIONS: { label: string; value: UserRole }[] = [
  { label: 'User', value: 'user' },
  { label: 'Moderator', value: 'moderator' },
  { label: 'Admin', value: 'admin' },
];

export default function AdminUsersPage() {
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [tokenModalStudent, setTokenModalStudent] = useState<AdminUser | null>(
    null
  );
  const [banModalStudent, setBanModalStudent] = useState<AdminUser | null>(
    null
  );
  const [resetModalStudent, setResetModalStudent] = useState<AdminUser | null>(
    null
  );
  const [detailModalStudent, setDetailModalStudent] =
    useState<AdminUser | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: GetUsersParams = { page: 1, limit: 100 };
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'all') {
        params.isBanned = statusFilter === 'suspended' ? 'true' : 'false';
      }
      const res = await getUsers(params);
      setUsers(res.data ?? []);
      setTotalUsers(res.pagination?.total ?? res.data?.length ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      void fetchUsers();
    }, 400);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [fetchUsers]);

  const handleRoleChange = useCallback(
    async (userId: string, role: UserRole) => {
      setBusyUserId(userId);
      try {
        await updateUserRole(userId, role);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role } : u))
        );
        showToast(`Role updated to ${role}.`, 'success');
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : 'Failed to update role.',
          'error'
        );
        void fetchUsers();
      } finally {
        setBusyUserId(null);
      }
    },
    [showToast, fetchUsers]
  );

  const handleBanConfirm = useCallback(
    async (studentId: string, reason: string) => {
      setBusyUserId(studentId);
      try {
        await banUser(studentId, reason);
        setUsers((prev) =>
          prev.map((u) =>
            u._id === studentId
              ? { ...u, isBanned: true, banReason: reason }
              : u
          )
        );
        setBanModalStudent(null);
        showToast('User account has been banned.', 'success');
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : 'Failed to ban user.',
          'error'
        );
      } finally {
        setBusyUserId(null);
      }
    },
    [showToast]
  );

  const handleUnban = useCallback(
    async (studentId: string) => {
      setBusyUserId(studentId);
      try {
        await unbanUser(studentId);
        setUsers((prev) =>
          prev.map((u) =>
            u._id === studentId
              ? { ...u, isBanned: false, banReason: undefined }
              : u
          )
        );
        showToast('User ban lifted.', 'success');
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : 'Failed to lift ban.',
          'error'
        );
      } finally {
        setBusyUserId(null);
      }
    },
    [showToast]
  );

  const handleResetPassword = useCallback(
    async (studentId: string, newPassword: string) => {
      setBusyUserId(studentId);
      try {
        await resetUserPassword(studentId, newPassword);
        setResetModalStudent(null);
        showToast('Password reset successfully. Sessions revoked.', 'success');
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : 'Failed to reset password.',
          'error'
        );
      } finally {
        setBusyUserId(null);
      }
    },
    [showToast]
  );

  const handleTokenConfirm = useCallback(
    async (studentId: string, amount: number) => {
      setBusyUserId(studentId);
      try {
        const student = users.find((u) => u._id === studentId);
        const newBalance = Math.max((student?.aiTokenBalance ?? 0) + amount, 0);
        await updateUserSubscription(studentId, { aiTokenBalance: newBalance });
        setUsers((prev) =>
          prev.map((u) =>
            u._id === studentId ? { ...u, aiTokenBalance: newBalance } : u
          )
        );
        setTokenModalStudent(null);
        showToast('Token balance updated.', 'success');
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : 'Failed to update tokens.',
          'error'
        );
      } finally {
        setBusyUserId(null);
      }
    },
    [users, showToast]
  );

  const handlePreferencesUpdated = useCallback(
    (userId: string, targetExams: string[]) => {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId
            ? { ...u, targetExams: targetExams.map((id) => ({ _id: id })) }
            : u
        )
      );
    },
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
          User Management
        </h1>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Manage accounts, roles, tokens, and access status.
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          variant="primary"
          size="sm"
          leftIcon={<UserPlus size={14} />}
          onClick={() => setShowInviteModal(true)}
        >
          Invite Staff
        </Button>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700 dark:border-danger-900 dark:bg-danger-950 dark:text-danger-300">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={() => void fetchUsers()}>
            Retry
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400"
          />
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-md border border-[rgb(var(--color-border))] bg-transparent pl-9 pr-3 text-sm text-[rgb(var(--color-text-primary))] placeholder:text-secondary-400 transition-colors hover:border-[rgb(var(--color-border-hover))] focus-ring"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-[rgb(var(--color-text-muted))]" />
          {(['all', 'active', 'suspended'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                statusFilter === status
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400'
                  : 'text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-elevated))]'
              )}
            >
              {status === 'all'
                ? 'All'
                : status === 'active'
                  ? 'Active'
                  : 'Blocked'}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
        {loading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-10 animate-pulse rounded-md bg-[rgb(var(--color-surface-elevated))]"
              />
            ))}
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
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                    Tokens
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgb(var(--color-border))]">
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-sm text-[rgb(var(--color-text-muted))]"
                    >
                      No users found matching your filters.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
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
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[rgb(var(--color-text-muted))]">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )
                          : '—'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <select
                          value={user.role}
                          disabled={busyUserId === user._id}
                          onChange={(e) =>
                            void handleRoleChange(
                              user._id,
                              e.target.value as UserRole
                            )
                          }
                          className="h-8 rounded-md border border-[rgb(var(--color-border))] bg-transparent px-2 text-xs font-medium text-[rgb(var(--color-text-primary))] transition-colors hover:border-[rgb(var(--color-border-hover))] focus-ring disabled:opacity-50"
                        >
                          {ROLE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="flex items-center gap-1 text-sm font-medium text-primary-500">
                          <Coins size={14} />
                          {user.aiTokenBalance}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <StatusBadge isBanned={user.isBanned} />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setDetailModalStudent(user)}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-[rgb(var(--color-surface-elevated))] hover:text-[rgb(var(--color-text-primary))]"
                            title="View Details"
                          >
                            <Eye size={14} />
                            View
                          </button>
                          <button
                            onClick={() => setTokenModalStudent(user)}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary-500 transition-colors hover:bg-primary-50 dark:hover:bg-primary-950"
                            title="Edit Tokens"
                          >
                            <Coins size={14} />
                            Tokens
                          </button>
                          <button
                            onClick={() => setResetModalStudent(user)}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-[rgb(var(--color-surface-elevated))] hover:text-[rgb(var(--color-text-primary))]"
                            title="Reset Password"
                          >
                            <KeyRound size={14} />
                          </button>
                          {user.isBanned ? (
                            <button
                              onClick={() => void handleUnban(user._id)}
                              disabled={busyUserId === user._id}
                              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-accent-500 transition-colors hover:bg-accent-50 dark:hover:bg-accent-950 disabled:opacity-50"
                              title="Unblock"
                            >
                              <CheckCircle size={14} />
                              Unblock
                            </button>
                          ) : (
                            <button
                              onClick={() => setBanModalStudent(user)}
                              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-danger-500 transition-colors hover:bg-danger-50 dark:hover:bg-danger-950"
                              title="Block"
                            >
                              <Ban size={14} />
                              Block
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-[rgb(var(--color-border))] px-6 py-3">
          <p className="text-xs text-[rgb(var(--color-text-muted))]">
            Showing {users.length} of {totalUsers} users
          </p>
        </div>
      </div>

      {tokenModalStudent && (
        <AdjustTokenModal
          student={tokenModalStudent}
          isSubmitting={busyUserId === tokenModalStudent._id}
          onClose={() => setTokenModalStudent(null)}
          onConfirm={handleTokenConfirm}
        />
      )}

      {banModalStudent && (
        <BanModal
          student={banModalStudent}
          isSubmitting={busyUserId === banModalStudent._id}
          onClose={() => setBanModalStudent(null)}
          onConfirm={handleBanConfirm}
        />
      )}

      {resetModalStudent && (
        <ResetPasswordModal
          student={resetModalStudent}
          isSubmitting={busyUserId === resetModalStudent._id}
          onClose={() => setResetModalStudent(null)}
          onConfirm={handleResetPassword}
        />
      )}

      {detailModalStudent && (
        <UserDetailModal
          user={detailModalStudent}
          onClose={() => setDetailModalStudent(null)}
          onPreferencesUpdated={handlePreferencesUpdated}
        />
      )}

      {showInviteModal && (
        <InviteStaffModal
          onClose={() => setShowInviteModal(false)}
          onInvited={() => {
            showToast('Invitation email sent.', 'success');
            setShowInviteModal(false);
            void fetchUsers();
          }}
        />
      )}
    </div>
  );
}
