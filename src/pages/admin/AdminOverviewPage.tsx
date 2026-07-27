import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileCheck,
  DollarSign,
  Coins,
  Plus,
  Gift,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Clock,
  ChevronRight,
  X,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';

import { ROUTES } from '@/constants/routes';

interface MetricCard {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: typeof Users;
  iconBg: string;
  iconColor: string;
}

interface StudentActivity {
  id: string;
  studentName: string;
  examTaken: string;
  score: number;
  date: string;
}

const metrics: MetricCard[] = [
  {
    label: 'Total Students',
    value: '12,847',
    change: '+12.5%',
    changeType: 'positive',
    icon: Users,
    iconBg: 'bg-primary-50 dark:bg-primary-950',
    iconColor: 'text-primary-500',
  },
  {
    label: 'Active Exams Today',
    value: '1,234',
    change: '+8.2%',
    changeType: 'positive',
    icon: FileCheck,
    iconBg: 'bg-accent-50 dark:bg-accent-950',
    iconColor: 'text-accent-500',
  },
  {
    label: 'Total Revenue',
    value: '$48,560',
    change: '+23.1%',
    changeType: 'positive',
    icon: DollarSign,
    iconBg: 'bg-amber-50 dark:bg-amber-950',
    iconColor: 'text-amber-500',
  },
  {
    label: 'Tokens Consumed',
    value: '89,420',
    change: '-3.4%',
    changeType: 'negative',
    icon: Coins,
    iconBg: 'bg-violet-50 dark:bg-violet-950',
    iconColor: 'text-violet-500',
  },
];

const recentActivity: StudentActivity[] = [
  {
    id: '1',
    studentName: 'Ahmad Raza',
    examTaken: 'CSS Written Exam 2026',
    score: 87,
    date: '2 min ago',
  },
  {
    id: '2',
    studentName: 'Fatima Khan',
    examTaken: 'GK Mock Test #14',
    score: 92,
    date: '15 min ago',
  },
  {
    id: '3',
    studentName: 'Hassan Ali',
    examTaken: 'PPSC Past Paper 2024',
    score: 74,
    date: '32 min ago',
  },
  {
    id: '4',
    studentName: 'Sara Malik',
    examTaken: 'Reasoning & IQ Practice',
    score: 81,
    date: '1 hour ago',
  },
  {
    id: '5',
    studentName: 'Usman Tariq',
    examTaken: 'English Essay & Precis',
    score: 68,
    date: '2 hours ago',
  },
  {
    id: '6',
    studentName: 'Ayesha Noor',
    examTaken: 'Accounting Fundamentals',
    score: 95,
    date: '3 hours ago',
  },
];

const studentOptions = [
  { label: 'Ahmad Raza', value: 's1' },
  { label: 'Fatima Khan', value: 's2' },
  { label: 'Hassan Ali', value: 's3' },
  { label: 'Sara Malik', value: 's4' },
  { label: 'Usman Tariq', value: 's5' },
  { label: 'Ayesha Noor', value: 's6' },
];

interface GrantBonusModalProps {
  onClose: () => void;
  onConfirm: (studentId: string, amount: number, reason: string) => void;
}

function GrantBonusModal({ onClose, onConfirm }: GrantBonusModalProps) {
  const [studentId, setStudentId] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const numericAmount = parseInt(amount, 10);
  const selectedStudent = studentOptions.find((s) => s.value === studentId);

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
    onClose();
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
            options={studentOptions}
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
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700"
            onClick={handleSubmit}
          >
            Confirm Grant
          </Button>
        </div>
      </div>
    </div>
  );
}

function MetricCardComponent({ metric }: { metric: MetricCard }) {
  const Icon = metric.icon;

  return (
    <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 transition-colors hover:border-primary-200 dark:hover:border-primary-800">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${metric.iconBg}`}
        >
          <Icon size={20} className={metric.iconColor} />
        </div>
        <div
          className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
            metric.changeType === 'positive'
              ? 'bg-accent-50 text-accent-700 dark:bg-accent-950 dark:text-accent-300'
              : metric.changeType === 'negative'
                ? 'bg-danger-50 text-danger-700 dark:bg-danger-950 dark:text-danger-300'
                : 'bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-muted))]'
          }`}
        >
          {metric.changeType === 'positive' ? (
            <TrendingUp size={12} />
          ) : metric.changeType === 'negative' ? (
            <TrendingDown size={12} />
          ) : null}
          {metric.change}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-2xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
          {metric.value}
        </p>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          {metric.label}
        </p>
      </div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? 'bg-accent-50 text-accent-700 dark:bg-accent-950 dark:text-accent-300'
      : score >= 60
        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
        : 'bg-danger-50 text-danger-700 dark:bg-danger-950 dark:text-danger-300';

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${color}`}
    >
      {score}%
    </span>
  );
}

export default function AdminOverviewPage() {
  const [grantModalOpen, setGrantModalOpen] = useState(false);

  const handleGrantBonus = (
    studentId: string,
    amount: number,
    reason: string
  ) => {
    console.log(
      `Granted ${amount} tokens to student ${studentId}. Reason: ${reason}`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
            Overview of platform performance and student activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to={`${ROUTES.ADMIN_EXAMS}/new`}>
            <Button
              variant="primary"
              className="bg-gray-400 dark:bg-primary-600"
              leftIcon={<Plus size={16} />}
            >
              Add New Exam
            </Button>
          </Link>
          <Button
            variant="outline"
            leftIcon={<Gift size={16} />}
            onClick={() => setGrantModalOpen(true)}
          >
            Grant Bonus Tokens
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCardComponent key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
        <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] px-6 py-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-primary-500" />
            <h2 className="font-semibold font-heading text-[rgb(var(--color-text-primary))]">
              Recent Student Activity
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgb(var(--color-border))]">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                  Exam Taken
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgb(var(--color-border))]">
              {recentActivity.map((activity) => (
                <tr
                  key={activity.id}
                  className="transition-colors hover:bg-[rgb(var(--color-surface-elevated))]"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                        {activity.studentName.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                        {activity.studentName}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-[rgb(var(--color-text-secondary))]">
                    {activity.examTaken}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <ScoreBadge score={activity.score} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-[rgb(var(--color-text-muted))]">
                    {activity.date}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary-500 transition-colors hover:bg-primary-50 dark:hover:bg-primary-950">
                      View
                      <ArrowUpRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {grantModalOpen && (
        <GrantBonusModal
          onClose={() => setGrantModalOpen(false)}
          onConfirm={handleGrantBonus}
        />
      )}
    </div>
  );
}
