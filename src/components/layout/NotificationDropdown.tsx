import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  X,
  BookOpen,
  TrendingUp,
  Clock,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';

type NotificationType =
  'exam_alert' | 'study_reminder' | 'progress_summary' | 'followed_exam';

type NotificationTab = 'all' | 'unread' | 'exam_alerts';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  href?: string;
}

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'study_reminder',
    title: 'Daily Study Reminder',
    message:
      "You haven't practiced today yet. Keep your streak alive — attempt 10 MCQs now!",
    timestamp: '10 min ago',
    read: false,
    href: ROUTES.PRACTICE,
  },
  {
    id: 'n2',
    type: 'exam_alert',
    title: 'New Exam Content Added',
    message:
      'CSS Preliminary 2026 — 35 new MCQs added to Pakistan Affairs section.',
    timestamp: '1 hour ago',
    read: false,
    href: ROUTES.EXAMS,
  },
  {
    id: 'n3',
    type: 'progress_summary',
    title: 'Weekly Progress Summary',
    message:
      'Your weekly report is ready! You scored 74% average across 12 practice sessions.',
    timestamp: '3 hours ago',
    read: false,
    href: ROUTES.ANALYTICS,
  },
  {
    id: 'n4',
    type: 'followed_exam',
    title: 'Followed Exam Update',
    message:
      'FPSC Section Officer exam pattern has been updated with new marking scheme.',
    timestamp: 'Yesterday',
    read: true,
    href: ROUTES.EXAMS,
  },
  {
    id: 'n5',
    type: 'study_reminder',
    title: 'Study Streak at Risk!',
    message:
      "You're 1 session away from losing your 5-day streak. Practice now to keep it!",
    timestamp: 'Yesterday',
    read: true,
    href: ROUTES.PRACTICE,
  },
  {
    id: 'n6',
    type: 'exam_alert',
    title: 'Mock Test Available',
    message:
      'New CSS English Essay mock test #15 is now available. Duration: 3 hours.',
    timestamp: '2 days ago',
    read: true,
    href: ROUTES.EXAMS,
  },
  {
    id: 'n7',
    type: 'followed_exam',
    title: 'PPSC Syllabus Update',
    message:
      'General Knowledge section for PPSC has been revised for 2026 examinations.',
    timestamp: '3 days ago',
    read: true,
    href: ROUTES.EXAMS,
  },
];

const typeIcons: Record<NotificationType, typeof Bell> = {
  study_reminder: Clock,
  exam_alert: BookOpen,
  progress_summary: TrendingUp,
  followed_exam: AlertCircle,
};

const typeColors: Record<NotificationType, string> = {
  study_reminder:
    'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400',
  exam_alert:
    'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400',
  progress_summary:
    'bg-accent-100 text-accent-600 dark:bg-accent-900 dark:text-accent-400',
  followed_exam:
    'bg-violet-100 text-violet-600 dark:bg-violet-900 dark:text-violet-400',
};

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NotificationTab>('all');
  const [notifications, setNotifications] = useState(mockNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'exam_alerts')
      return n.type === 'exam_alert' || n.type === 'followed_exam';
    return true;
  });

  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const handleClearAll = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'relative rounded-md p-2 transition-colors',
          open
            ? 'bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400'
            : 'text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-elevated))]'
        )}
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-500 px-1 text-[9px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[380px] max-h-[520px] overflow-hidden rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] shadow-2xl">
          <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] px-4 py-3">
            <h3 className="text-sm font-bold font-heading text-[rgb(var(--color-text-primary))]">
              Notifications
            </h3>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium text-primary-500 transition-colors hover:bg-primary-50 dark:hover:bg-primary-950"
                >
                  <CheckCheck size={12} />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-surface-elevated))]"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="flex border-b border-[rgb(var(--color-border))]">
            {[
              { id: 'all' as NotificationTab, label: 'All' },
              { id: 'unread' as NotificationTab, label: 'Unread' },
              { id: 'exam_alerts' as NotificationTab, label: 'Exam Alerts' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 py-2.5 text-xs font-medium transition-colors',
                  activeTab === tab.id
                    ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text-secondary))]'
                )}
              >
                {tab.label}
                {tab.id === 'unread' && unreadCount > 0 && (
                  <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-500 px-1 text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="max-h-[340px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <Check size={32} className="text-accent-400" />
                <p className="mt-2 text-sm font-medium text-[rgb(var(--color-text-primary))]">
                  All caught up!
                </p>
                <p className="text-xs text-[rgb(var(--color-text-muted))]">
                  No new notifications to show.
                </p>
              </div>
            ) : (
              filtered.map((n) => {
                const Icon = typeIcons[n.type];
                return (
                  <div
                    key={n.id}
                    className={cn(
                      'flex gap-3 border-b border-[rgb(var(--color-border))] px-4 py-3 transition-colors last:border-0',
                      !n.read && 'bg-primary-50/50 dark:bg-primary-950/30'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                        typeColors[n.type]
                      )}
                    >
                      <Icon size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            'text-xs font-semibold',
                            !n.read
                              ? 'text-[rgb(var(--color-text-primary))]'
                              : 'text-[rgb(var(--color-text-secondary))]'
                          )}
                        >
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-[rgb(var(--color-text-muted))]">
                        {n.message}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[10px] text-[rgb(var(--color-text-muted))]">
                          <Calendar size={10} />
                          {n.timestamp}
                        </span>
                        {!n.read && (
                          <button
                            onClick={() => handleMarkAsRead(n.id)}
                            className="flex items-center gap-0.5 text-[10px] font-medium text-primary-500 hover:text-primary-600"
                          >
                            <Check size={10} />
                            Mark read
                          </button>
                        )}
                        {n.href && (
                          <Link
                            to={n.href}
                            onClick={() => setOpen(false)}
                            className="text-[10px] font-medium text-primary-500 hover:text-primary-600"
                          >
                            View
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex border-t border-[rgb(var(--color-border))]">
            <button
              onClick={handleClearAll}
              className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium text-[rgb(var(--color-text-muted))] transition-colors hover:bg-[rgb(var(--color-surface-elevated))] hover:text-danger-500"
            >
              <Trash2 size={11} />
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
