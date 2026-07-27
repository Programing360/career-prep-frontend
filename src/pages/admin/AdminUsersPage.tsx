import { useState, useMemo, useCallback } from 'react';
import {
  Search,
  Coins,
  Ban,
  CheckCircle,
  Eye,
  X,
  Plus,
  Minus,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';

type StudentStatus = 'active' | 'suspended';

interface Student {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  examsCompleted: number;
  tokens: number;
  status: StudentStatus;
}

const mockStudents: Student[] = [
  {
    id: 's1',
    name: 'Ahmad Raza',
    email: 'ahmad.raza@gmail.com',
    joinedDate: '2026-01-15',
    examsCompleted: 24,
    tokens: 450,
    status: 'active',
  },
  {
    id: 's2',
    name: 'Fatima Khan',
    email: 'fatima.k@outlook.com',
    joinedDate: '2025-11-03',
    examsCompleted: 38,
    tokens: 120,
    status: 'active',
  },
  {
    id: 's3',
    name: 'Hassan Ali',
    email: 'hassan.ali@yahoo.com',
    joinedDate: '2026-03-22',
    examsCompleted: 7,
    tokens: 0,
    status: 'suspended',
  },
  {
    id: 's4',
    name: 'Sara Malik',
    email: 'sara.malik@gmail.com',
    joinedDate: '2025-09-18',
    examsCompleted: 52,
    tokens: 800,
    status: 'active',
  },
  {
    id: 's5',
    name: 'Usman Tariq',
    email: 'usman.t@proton.me',
    joinedDate: '2026-05-07',
    examsCompleted: 3,
    tokens: 50,
    status: 'suspended',
  },
  {
    id: 's6',
    name: 'Ayesha Noor',
    email: 'ayesha.noor@gmail.com',
    joinedDate: '2026-02-11',
    examsCompleted: 19,
    tokens: 275,
    status: 'active',
  },
];

type FilterStatus = 'all' | StudentStatus;

interface TokenModalProps {
  student: Student;
  onClose: () => void;
  onConfirm: (studentId: string, amount: number) => void;
}

function AdjustTokenModal({ student, onClose, onConfirm }: TokenModalProps) {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const numericAmount = parseInt(amount, 10);
  const isAdd = numericAmount > 0;
  const newBalance =
    student.tokens + (isNaN(numericAmount) ? 0 : numericAmount);

  const handleSubmit = () => {
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
    onConfirm(student.id, numericAmount);
    onClose();
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
              {student.name}
            </p>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">
              {student.email}
            </p>
            <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
              Current Balance:{' '}
              <span className="font-semibold text-primary-500">
                {student.tokens} tokens
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
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: StudentStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
        status === 'active'
          ? 'bg-accent-50 text-accent-700 dark:bg-accent-950 dark:text-accent-300'
          : 'bg-danger-50 text-danger-700 dark:bg-danger-950 dark:text-danger-300'
      )}
    >
      {status === 'active' ? <CheckCircle size={12} /> : <Ban size={12} />}
      {status === 'active' ? 'Active' : 'Suspended'}
    </span>
  );
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [tokenModalStudent, setTokenModalStudent] = useState<Student | null>(
    null
  );

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [students, search, statusFilter]);

  const handleTokenConfirm = useCallback(
    (studentId: string, amount: number) => {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId ? { ...s, tokens: s.tokens + amount } : s
        )
      );
    },
    []
  );

  const handleToggleStatus = useCallback((studentId: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              status: s.status === 'active' ? 'suspended' : 'active',
            }
          : s
      )
    );
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
          User Management
        </h1>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Manage student accounts, tokens, and access status.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400"
          />
          <input
            type="text"
            placeholder="Search by name or email..."
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
                  : 'Suspended'}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgb(var(--color-border))]">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                  Exams Done
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
              {filteredStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-sm text-[rgb(var(--color-text-muted))]"
                  >
                    No students found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="transition-colors hover:bg-[rgb(var(--color-surface-elevated))]"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                          {student.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                          {student.name}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[rgb(var(--color-text-secondary))]">
                      {student.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[rgb(var(--color-text-muted))]">
                      {new Date(student.joinedDate).toLocaleDateString(
                        'en-US',
                        { month: 'short', day: 'numeric', year: 'numeric' }
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-[rgb(var(--color-text-primary))]">
                      {student.examsCompleted}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="flex items-center gap-1 text-sm font-medium text-primary-500">
                        <Coins size={14} />
                        {student.tokens}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <StatusBadge status={student.status} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setTokenModalStudent(student)}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary-500 transition-colors hover:bg-primary-50 dark:hover:bg-primary-950"
                          title="Edit Tokens"
                        >
                          <Coins size={14} />
                          Tokens
                        </button>
                        <button
                          onClick={() => handleToggleStatus(student.id)}
                          className={cn(
                            'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors',
                            student.status === 'active'
                              ? 'text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-950'
                              : 'text-accent-500 hover:bg-accent-50 dark:hover:bg-accent-950'
                          )}
                          title={
                            student.status === 'active'
                              ? 'Suspend'
                              : 'Unsuspend'
                          }
                        >
                          {student.status === 'active' ? (
                            <Ban size={14} />
                          ) : (
                            <CheckCircle size={14} />
                          )}
                          {student.status === 'active' ? 'Block' : 'Unblock'}
                        </button>
                        <button
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-[rgb(var(--color-surface-elevated))] hover:text-[rgb(var(--color-text-primary))]"
                          title="View Activity"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[rgb(var(--color-border))] px-6 py-3">
          <p className="text-xs text-[rgb(var(--color-text-muted))]">
            Showing {filteredStudents.length} of {students.length} students
          </p>
        </div>
      </div>

      {tokenModalStudent && (
        <AdjustTokenModal
          student={tokenModalStudent}
          onClose={() => setTokenModalStudent(null)}
          onConfirm={handleTokenConfirm}
        />
      )}
    </div>
  );
}
