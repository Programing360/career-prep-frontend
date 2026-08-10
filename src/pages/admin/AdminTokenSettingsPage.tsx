import {
  Coins,
  Sparkles,
  Brain,
  Calendar,
  FileCheck,
  Gift,
  LogIn,
  Flame,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CostSetting {
  id: string;
  label: string;
  description: string;
  icon: typeof Coins;
  tokens: number;
}

interface BonusSetting {
  id: string;
  label: string;
  description: string;
  icon: typeof Coins;
  value: number;
}

interface TokenPackage {
  id: string;
  name: string;
  tokens: number;
  price: number;
  status: 'active' | 'disabled';
}

const costSettings: CostSetting[] = [
  {
    id: 'explanation',
    label: 'AI Question Explanation',
    description: 'Deducted per explanation request on any MCQ',
    icon: Brain,
    tokens: 10,
  },
  {
    id: 'flashcards',
    label: 'AI Flashcard Generator',
    description: 'Deducted per flashcard deck generation session',
    icon: Sparkles,
    tokens: 20,
  },
  {
    id: 'planner',
    label: 'AI Study Planner',
    description: 'Deducted per personalized study plan creation',
    icon: Calendar,
    tokens: 30,
  },
  {
    id: 'mockExam',
    label: 'Mock Exam Attempt Fee',
    description: 'Deducted each time a full mock exam is started',
    icon: FileCheck,
    tokens: 50,
  },
];

const bonusSettings: BonusSetting[] = [
  {
    id: 'signup',
    label: 'Sign-Up Free Tokens',
    description: 'One-time bonus credited on new account registration',
    icon: Gift,
    value: 100,
  },
  {
    id: 'daily',
    label: 'Daily Login Reward',
    description: 'Tokens credited each day a user opens the app',
    icon: LogIn,
    value: 10,
  },
  {
    id: 'streak',
    label: 'Streak Bonus Multiplier',
    description: 'Multiplier applied to daily reward after 7+ day streaks',
    icon: Flame,
    value: 1.5,
  },
];

const packages: TokenPackage[] = [
  {
    id: 'p1',
    name: 'Starter Pack',
    tokens: 100,
    price: 2.99,
    status: 'active',
  },
  { id: 'p2', name: 'Value Pack', tokens: 500, price: 9.99, status: 'active' },
  { id: 'p3', name: 'Pro Pack', tokens: 1200, price: 19.99, status: 'active' },
  {
    id: 'p4',
    name: 'Unlimited Monthly',
    tokens: 3000,
    price: 39.99,
    status: 'disabled',
  },
];

function SettingValue({ value, suffix }: { value: number; suffix?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-9 rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] px-3 text-sm font-medium text-[rgb(var(--color-text-primary))]">
        {value}
      </span>
      {suffix && (
        <span className="text-xs font-medium text-[rgb(var(--color-text-muted))]">
          {suffix}
        </span>
      )}
    </div>
  );
}

function ReadOnlySettingCard({
  icon: Icon,
  label,
  description,
  value,
  suffix,
}: {
  icon: typeof Coins;
  label: string;
  description: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-950">
        <Icon size={20} className="text-primary-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
          {label}
        </p>
        <p className="text-xs text-[rgb(var(--color-text-muted))]">
          {description}
        </p>
      </div>
      <SettingValue value={value} suffix={suffix} />
    </div>
  );
}

export default function AdminTokenSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
          Token Economy & System Settings
        </h1>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          View token costs, bonuses, and top-up packages.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-accent-200 bg-accent-50 px-4 py-3 text-sm text-accent-800 dark:border-accent-900 dark:bg-accent-950 dark:text-accent-200">
        <Info size={18} className="mt-0.5 shrink-0" />
        <p>
          These values are configured server-side. No API endpoint is available
          yet for editing global token pricing, so this view is read-only.
        </p>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold font-heading text-[rgb(var(--color-text-primary))]">
            AI Feature Token Costs
          </h2>
          <p className="text-sm text-[rgb(var(--color-text-muted))]">
            Tokens deducted per feature use.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {costSettings.map((setting) => (
            <ReadOnlySettingCard
              key={setting.id}
              icon={setting.icon}
              label={setting.label}
              description={setting.description}
              value={setting.tokens}
              suffix="tokens"
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold font-heading text-[rgb(var(--color-text-primary))]">
            New User & Daily Bonus
          </h2>
          <p className="text-sm text-[rgb(var(--color-text-muted))]">
            Sign-up rewards and daily engagement bonuses.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {bonusSettings.map((setting) => (
            <ReadOnlySettingCard
              key={setting.id}
              icon={setting.icon}
              label={setting.label}
              description={setting.description}
              value={setting.value}
              suffix={setting.id === 'streak' ? 'x' : 'tokens'}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold font-heading text-[rgb(var(--color-text-primary))]">
            Token Top-Up Packages
          </h2>
          <p className="text-sm text-[rgb(var(--color-text-muted))]">
            Purchasable token packs available in the store.
          </p>
        </div>

        <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgb(var(--color-border))]">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                    Package Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                    Tokens Granted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgb(var(--color-border))]">
                {packages.map((pkg) => (
                  <tr
                    key={pkg.id}
                    className="transition-colors hover:bg-[rgb(var(--color-surface-elevated))]"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                        {pkg.name}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-500">
                        <Coins size={14} />
                        {pkg.tokens.toLocaleString()}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-[rgb(var(--color-text-primary))]">
                      ${pkg.price.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
                          pkg.status === 'active'
                            ? 'bg-accent-50 text-accent-700 dark:bg-accent-950 dark:text-accent-300'
                            : 'bg-secondary-100 text-secondary-600 dark:bg-secondary-800 dark:text-secondary-300'
                        )}
                      >
                        {pkg.status === 'active' ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-[rgb(var(--color-border))] px-6 py-3">
            <p className="text-xs text-[rgb(var(--color-text-muted))]">
              {packages.filter((p) => p.status === 'active').length} active of{' '}
              {packages.length} total packages
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
