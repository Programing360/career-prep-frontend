import { useState, useCallback } from 'react';
import {
  Coins,
  Sparkles,
  Brain,
  Calendar,
  FileCheck,
  Gift,
  LogIn,
  Flame,
  Plus,
  Pencil,
  Trash2,
  X,
  CheckCircle,
  Ban,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';

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

const initialCostSettings: CostSetting[] = [
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

const initialBonusSettings: BonusSetting[] = [
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

const initialPackages: TokenPackage[] = [
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

interface PackageModalProps {
  pkg: TokenPackage | null;
  onClose: () => void;
  onSave: (pkg: TokenPackage) => void;
}

function PackageModal({ pkg, onClose, onSave }: PackageModalProps) {
  const [name, setName] = useState(pkg?.name ?? '');
  const [tokens, setTokens] = useState(pkg?.tokens?.toString() ?? '');
  const [price, setPrice] = useState(pkg?.price?.toString() ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!pkg;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Package name is required.';
    if (!tokens || parseInt(tokens) <= 0)
      errs.tokens = 'Enter a valid token amount.';
    if (!price || parseFloat(price) <= 0) errs.price = 'Enter a valid price.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      id: pkg?.id ?? `p${Date.now()}`,
      name: name.trim(),
      tokens: parseInt(tokens),
      price: parseFloat(price),
      status: pkg?.status ?? 'active',
    });
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
              {isEditing ? 'Edit Package' : 'Add New Package'}
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
          <Input
            label="Package Name"
            required
            placeholder="e.g. Starter Pack"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((p) => ({ ...p, name: '' }));
            }}
            error={errors.name}
          />

          <Input
            label="Tokens Granted"
            required
            type="number"
            placeholder="e.g. 500"
            leftIcon={<Coins size={16} className="text-primary-500" />}
            value={tokens}
            onChange={(e) => {
              setTokens(e.target.value);
              setErrors((p) => ({ ...p, tokens: '' }));
            }}
            error={errors.tokens}
          />

          <Input
            label="Price ($)"
            required
            type="number"
            placeholder="e.g. 9.99"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              setErrors((p) => ({ ...p, price: '' }));
            }}
            error={errors.price}
          />
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
            {isEditing ? 'Save Changes' : 'Add Package'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SettingCard({
  icon: Icon,
  label,
  description,
  value,
  onChange,
  suffix,
}: {
  icon: typeof Coins;
  label: string;
  description: string;
  value: number;
  onChange: (val: number) => void;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4 transition-colors hover:border-[rgb(var(--color-border-hover))]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-950">
        <Icon size={20} className="text-primary-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
          {label}
        </p>
        <p className="text-xs text-[rgb(var(--color-text-muted))]">
          {description}
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="h-9 w-20 rounded-md border border-[rgb(var(--color-border))] bg-transparent px-3 text-center text-sm font-medium text-[rgb(var(--color-text-primary))] transition-colors hover:border-[rgb(var(--color-border-hover))] focus-ring"
        />
        {suffix && (
          <span className="text-xs font-medium text-[rgb(var(--color-text-muted))]">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export default function AdminTokenSettingsPage() {
  const { showToast } = useToast();

  const [costSettings, setCostSettings] =
    useState<CostSetting[]>(initialCostSettings);
  const [bonusSettings, setBonusSettings] =
    useState<BonusSetting[]>(initialBonusSettings);
  const [packages, setPackages] = useState<TokenPackage[]>(initialPackages);

  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TokenPackage | null>(
    null
  );

  const updateCost = useCallback((id: string, tokens: number) => {
    setCostSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, tokens } : s))
    );
  }, []);

  const updateBonus = useCallback((id: string, value: number) => {
    setBonusSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, value } : s))
    );
  }, []);

  const handleSaveCostSettings = () => {
    showToast('Token cost settings saved successfully.', 'success');
  };

  const handleSaveBonusSettings = () => {
    showToast('Bonus configuration saved successfully.', 'success');
  };

  const handleSavePackage = useCallback(
    (pkg: TokenPackage) => {
      setPackages((prev) => {
        const idx = prev.findIndex((p) => p.id === pkg.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = pkg;
          return next;
        }
        return [...prev, pkg];
      });
      showToast(
        editingPackage ? 'Package updated.' : 'Package added.',
        'success'
      );
    },
    [editingPackage, showToast]
  );

  const handleDeletePackage = useCallback(
    (packageId: string) => {
      setPackages((prev) => prev.filter((p) => p.id !== packageId));
      showToast('Package removed.', 'info');
    },
    [showToast]
  );

  const handleTogglePackageStatus = useCallback((packageId: string) => {
    setPackages((prev) =>
      prev.map((p) =>
        p.id === packageId
          ? { ...p, status: p.status === 'active' ? 'disabled' : 'active' }
          : p
      )
    );
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
          Token Economy & System Settings
        </h1>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Configure token costs, bonuses, and top-up packages.
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold font-heading text-[rgb(var(--color-text-primary))]">
              AI Feature Token Costs
            </h2>
            <p className="text-sm text-[rgb(var(--color-text-muted))]">
              Set how many tokens are deducted per feature use.
            </p>
          </div>
          <Button
            size="sm"
            leftIcon={<Save size={16} />}
            className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700"
            onClick={handleSaveCostSettings}
          >
            Save Cost Settings
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {costSettings.map((setting) => (
            <SettingCard
              key={setting.id}
              icon={setting.icon}
              label={setting.label}
              description={setting.description}
              value={setting.tokens}
              onChange={(val) => updateCost(setting.id, val)}
              suffix="tokens"
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold font-heading text-[rgb(var(--color-text-primary))]">
              New User & Daily Bonus
            </h2>
            <p className="text-sm text-[rgb(var(--color-text-muted))]">
              Configure sign-up rewards and daily engagement bonuses.
            </p>
          </div>
          <Button
            size="sm"
            className="bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-secondary-800 dark:text-secondary-200 dark:hover:bg-secondary-700"
            leftIcon={<Save size={16} />}
            onClick={handleSaveBonusSettings}
          >
            Save Bonus Settings
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {bonusSettings.map((setting) => (
            <SettingCard
              key={setting.id}
              icon={setting.icon}
              label={setting.label}
              description={setting.description}
              value={setting.value}
              onChange={(val) => updateBonus(setting.id, val)}
              suffix={setting.id === 'streak' ? 'x' : 'tokens'}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold font-heading text-[rgb(var(--color-text-primary))]">
              Token Top-Up Packages
            </h2>
            <p className="text-sm text-[rgb(var(--color-text-muted))]">
              Manage purchasable token packs available in the store.
            </p>
          </div>
          <Button
            size="sm"
            leftIcon={<Plus size={16} />}
            className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700"
            onClick={() => {
              setEditingPackage(null);
              setPackageModalOpen(true);
            }}
          >
            Add New Package
          </Button>
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
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgb(var(--color-border))]">
                {packages.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-sm text-[rgb(var(--color-text-muted))]"
                    >
                      No packages configured yet.
                    </td>
                  </tr>
                ) : (
                  packages.map((pkg) => (
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
                          {pkg.status === 'active' ? (
                            <CheckCircle size={12} />
                          ) : (
                            <Ban size={12} />
                          )}
                          {pkg.status === 'active' ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingPackage(pkg);
                              setPackageModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary-500 transition-colors hover:bg-primary-50 dark:hover:bg-primary-950"
                            title="Edit Package"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleTogglePackageStatus(pkg.id)}
                            className={cn(
                              'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors',
                              pkg.status === 'active'
                                ? 'text-secondary-500 hover:bg-secondary-50 dark:hover:bg-secondary-900'
                                : 'text-accent-500 hover:bg-accent-50 dark:hover:bg-accent-950'
                            )}
                            title={
                              pkg.status === 'active'
                                ? 'Disable Package'
                                : 'Enable Package'
                            }
                          >
                            {pkg.status === 'active' ? (
                              <Ban size={14} />
                            ) : (
                              <CheckCircle size={14} />
                            )}
                            {pkg.status === 'active' ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            onClick={() => handleDeletePackage(pkg.id)}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-danger-500 transition-colors hover:bg-danger-50 dark:hover:bg-danger-950"
                            title="Delete Package"
                          >
                            <Trash2 size={14} />
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
              {packages.filter((p) => p.status === 'active').length} active of{' '}
              {packages.length} total packages
            </p>
          </div>
        </div>
      </section>

      {packageModalOpen && (
        <PackageModal
          pkg={editingPackage}
          onClose={() => {
            setPackageModalOpen(false);
            setEditingPackage(null);
          }}
          onSave={handleSavePackage}
        />
      )}
    </div>
  );
}
