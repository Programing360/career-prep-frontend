import { useState, useCallback } from 'react';
import {
  Bell,
  Calendar,
  TrendingUp,
  BookOpen,
  Smartphone,
  Moon,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';

interface NotificationPreferences {
  emailNotifications: boolean;
  inAppAlerts: boolean;
  dailyStudyReminders: boolean;
  weeklyProgressEmails: boolean;
  monthlySummaries: boolean;
  examUpdates: boolean;
}

interface SettingGroup {
  id: string;
  label: string;
  description: string;
  icon: typeof Bell;
  settings: {
    key: keyof NotificationPreferences;
    label: string;
    description: string;
  }[];
}

const settingGroups: SettingGroup[] = [
  {
    id: 'channels',
    label: 'Notification Channels',
    description: 'Choose how you want to receive notifications',
    icon: Bell,
    settings: [
      {
        key: 'emailNotifications',
        label: 'Email Notifications',
        description: 'Receive important updates via email',
      },
      {
        key: 'inAppAlerts',
        label: 'In-App Alerts',
        description: 'Show notifications inside the dashboard',
      },
    ],
  },
  {
    id: 'study',
    label: 'Study Reminders',
    description: 'Stay on track with your preparation schedule',
    icon: Calendar,
    settings: [
      {
        key: 'dailyStudyReminders',
        label: 'Daily Study Reminders',
        description: 'Get reminded to study every day at your preferred time',
      },
    ],
  },
  {
    id: 'progress',
    label: 'Progress & Reports',
    description: 'Track your improvement with periodic summaries',
    icon: TrendingUp,
    settings: [
      {
        key: 'weeklyProgressEmails',
        label: 'Weekly Progress Emails',
        description: 'Receive a detailed performance report every week',
      },
      {
        key: 'monthlySummaries',
        label: 'Monthly Summaries',
        description: 'Get a comprehensive monthly preparation summary',
      },
    ],
  },
  {
    id: 'exams',
    label: 'Exam Updates',
    description: 'Stay informed about followed exams',
    icon: BookOpen,
    settings: [
      {
        key: 'examUpdates',
        label: 'Exam-Specific Updates',
        description:
          'Notifications about syllabus changes, new content, and mock tests',
      },
    ],
  },
];

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotifications: true,
    inAppAlerts: true,
    dailyStudyReminders: true,
    weeklyProgressEmails: false,
    monthlySummaries: true,
    examUpdates: true,
  });
  const [saved, setSaved] = useState(false);

  const toggle = useCallback((key: keyof NotificationPreferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
          Notification Settings
        </h1>
        <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
          Customize how and when you receive notifications from MeritPrep
        </p>
      </div>

      <div className="space-y-4">
        {settingGroups.map((group) => {
          const Icon = group.icon;
          return (
            <div
              key={group.id}
              className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900">
                  <Icon
                    size={16}
                    className="text-primary-600 dark:text-primary-400"
                  />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                    {group.label}
                  </h2>
                  <p className="text-[10px] text-[rgb(var(--color-text-muted))]">
                    {group.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                {group.settings.map((setting) => (
                  <div
                    key={setting.key}
                    className="flex items-center justify-between gap-4 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-3.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                        {setting.label}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[rgb(var(--color-text-muted))]">
                        {setting.description}
                      </p>
                    </div>
                    <Switch
                      checked={preferences[setting.key]}
                      onChange={() => toggle(setting.key)}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-100 dark:bg-secondary-900">
          <Smartphone
            size={18}
            className="text-secondary-600 dark:text-secondary-400"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
            Push Notifications
          </p>
          <p className="text-[11px] text-[rgb(var(--color-text-muted))]">
            Browser push notifications are{' '}
            {Notification.permission === 'granted' ? 'enabled' : 'not enabled'}
          </p>
        </div>
        {Notification.permission === 'granted' ? (
          <span className="flex items-center gap-1 text-xs font-medium text-accent-600 dark:text-accent-400">
            <CheckCircle2 size={14} />
            Active
          </span>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => Notification.requestPermission()}
          >
            Enable
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900">
          <Moon size={18} className="text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
            Quiet Hours
          </p>
          <p className="text-[11px] text-[rgb(var(--color-text-muted))]">
            No notifications between 10:00 PM and 7:00 AM
          </p>
        </div>
        <Switch checked={true} onChange={() => {}} />
      </div>

      <div className="flex justify-end">
        <Button
          leftIcon={saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
          onClick={handleSave}
          variant={saved ? 'secondary' : 'primary'}
        >
          {saved ? 'Saved!' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
}
