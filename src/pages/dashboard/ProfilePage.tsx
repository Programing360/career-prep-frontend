import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Award,
  Flame,
  Target,
  Trophy,
  Zap,
  Pencil,
  Check,
  X,
  BadgeCheck,
  BookOpen,
  Star,
  Sparkles,
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  accentClass,
}: {
  icon: typeof Award;
  label: string;
  value: string | number;
  subtext?: string;
  accentClass: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        'rounded-xl border p-5 backdrop-blur-md transition-all hover:shadow-md',
        'border-white/20 bg-white/70 dark:border-gray-800/50 dark:bg-gray-900/70'
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg',
            accentClass
          )}
        >
          <Icon size={20} />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
      {subtext && (
        <p className="mt-2 text-[11px] text-gray-400 dark:text-gray-500">
          {subtext}
        </p>
      )}
    </motion.div>
  );
}

function BadgeCard({
  badge,
}: {
  badge: { name: string; icon: string; description: string; earnedAt: string };
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="group flex items-center gap-3 rounded-xl border border-white/20 bg-white/70 p-4 backdrop-blur-md transition-all hover:shadow-md dark:border-gray-800/50 dark:bg-gray-900/70"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-xl dark:bg-primary-900/50">
        {badge.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {badge.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {badge.description}
        </p>
        <p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">
          Earned {new Date(badge.earnedAt).toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
}

export default function ProfilePage() {
  const { user, progress } = useAppSelector((state) => state.auth);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
  });

  const handleSave = () => {
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
    });
    setEditing(false);
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      })
    : 'N/A';

  const roleLabel =
    user?.role === 'admin'
      ? 'Admin'
      : user?.role === 'moderator'
        ? 'Moderator'
        : 'User';

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-4xl"
    >
      {/* Page Header */}
      <motion.div variants={fadeUp} className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Profile
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your personal information and view your achievements.
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        variants={fadeUp}
        className={cn(
          'relative overflow-hidden rounded-2xl border p-6 sm:p-8',
          'border-white/20 bg-white/70 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70'
        )}
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative flex flex-col items-center gap-6 sm:flex-row">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-3xl font-bold text-white shadow-lg">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span
              className={cn(
                'absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-white dark:border-gray-900',
                user?.role === 'user' ? 'bg-primary-500' : 'bg-primary-500'
              )}
            >
              <BadgeCheck size={14} />
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {user?.name || 'User'}
              </h2>
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide',
                  user?.role === 'user'
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                    : 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                )}
              >
                <Shield size={10} />
                {roleLabel}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-gray-500 sm:justify-start dark:text-gray-400">
              <span className="inline-flex items-center gap-1.5">
                <Mail size={13} />
                {user?.email || 'N/A'}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={13} />
                Joined {memberSince}
              </span>
              {user?.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone size={13} />
                  {user.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={fadeUp}
        className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4"
      >
        <StatCard
          icon={Zap}
          label="Total XP"
          value={progress?.xp ?? 0}
          subtext={`Level ${Math.floor((progress?.xp ?? 0) / 100) + 1}`}
          accentClass="bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400"
        />
        <StatCard
          icon={Award}
          label="Coins"
          value={progress?.coins ?? 0}
          accentClass="bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400"
        />
        <StatCard
          icon={Flame}
          label="Day Streak"
          value={progress?.streak?.current ?? 0}
          subtext={`Best: ${progress?.streak?.longest ?? 0} days`}
          accentClass="bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400"
        />
        <StatCard
          icon={Target}
          label="Readiness"
          value={`${progress?.readinessScore ?? 0}%`}
          accentClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400"
        />
      </motion.div>

      {/* Badges Section */}
      {progress?.badges && progress.badges.length > 0 && (
        <motion.div variants={fadeUp} className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <Trophy size={18} className="text-primary-500" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Badges & Achievements
            </h3>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
              {progress.badges.length}
            </span>
          </div>
          <div className="space-y-3">
            {progress.badges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Personal Information */}
      <motion.div
        variants={fadeUp}
        className={cn(
          'mt-8 rounded-2xl border p-6',
          'border-white/20 bg-white/70 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70'
        )}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User size={18} className="text-gray-500 dark:text-gray-400" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Personal Information
            </h3>
          </div>
          {!editing ? (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Pencil size={14} />}
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<X size={14} />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Check size={14} />}
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            disabled={!editing}
            leftIcon={<User size={15} />}
          />
          <Input
            label="Email Address"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            disabled={!editing}
            leftIcon={<Mail size={15} />}
          />
          <Input
            label="Phone Number"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            disabled={!editing}
            leftIcon={<Phone size={15} />}
          />
          <Input
            label="Member Since"
            value={memberSince}
            disabled
            leftIcon={<Calendar size={15} />}
          />
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        variants={fadeUp}
        className={cn(
          'mt-8 rounded-2xl border p-6',
          'border-white/20 bg-white/70 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70'
        )}
      >
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-gray-500 dark:text-gray-400" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Quick Links
          </h3>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: BarChart3Icon,
              label: 'View Analytics',
              description: 'Track your performance',
            },
            {
              icon: BookOpen,
              label: 'Practice MCQs',
              description: 'Continue your practice',
            },
            {
              icon: Star,
              label: 'Go Premium',
              description: 'Unlock all features',
            },
          ].map((link) => (
            <button
              key={link.label}
              className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/50 p-4 text-left transition-all hover:shadow-md dark:border-gray-800/50 dark:bg-gray-900/50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <link.icon
                  size={16}
                  className="text-gray-600 dark:text-gray-400"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {link.label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {link.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function BarChart3Icon(props: React.ComponentProps<typeof Award>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M7 16v-3" />
      <path d="M12 16v-7" />
      <path d="M17 16v-5" />
    </svg>
  );
}
