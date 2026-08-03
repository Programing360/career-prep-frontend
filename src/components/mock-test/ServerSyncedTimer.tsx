import { useEffect, useRef, useState } from 'react';
import { Clock, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { syncTestTimer } from '@/services/mockTestService';

interface ServerSyncedTimerProps {
  sessionId: string;
  expiresAt: string;
  isActive: boolean;
  onExpire: () => void;
  pollIntervalMs?: number;
}

const LOW_TIME_THRESHOLD_SECONDS = 120;
const DEFAULT_POLL_INTERVAL_MS = 15000;

function formatTime(totalSeconds: number): string {
  const seconds = Math.max(0, Math.ceil(totalSeconds));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  // console.log(h,m,s);
  if (h > 0) {
    return [h, m, s].map((n) => n.toString().padStart(2, '0')).join(':');
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Counts down to the server-provided expiry timestamp and keeps the client in
 * sync with the authoritative server timer via periodic heartbeat polls.
 * - Auto-submits (via onExpire) when the local countdown reaches zero.
 * - Detects server-side expiry through the heartbeat and triggers onExpire.
 * - Tolerates dropped heartbeats (keeps counting locally, shows offline state,
 *   and re-syncs on the next poll or when the connection returns).
 */
export function ServerSyncedTimer({
  sessionId,
  expiresAt,
  isActive,
  onExpire,
  pollIntervalMs = DEFAULT_POLL_INTERVAL_MS,
}: ServerSyncedTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    const expiresAtMs = new Date(expiresAt).getTime();
    return Math.max(0, Math.ceil((expiresAtMs - Date.now()) / 1000));
  });
  const [isOffline, setIsOffline] = useState(false);

  const onExpireRef = useRef(onExpire);
  const expiredRef = useRef(false);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!isActive) return;
    expiredRef.current = false;
    const expiresAtMs = new Date(expiresAt).getTime();
    const tick = () => {
      const remaining = Math.max(
        0,
        Math.ceil((expiresAtMs - Date.now()) / 1000)
      );
      setRemainingSeconds(remaining);
      if (remaining <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpireRef.current();
      }
    };
    const first = setTimeout(tick, 0);
    const interval = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [isActive, expiresAt]);

  useEffect(() => {
    if (!isActive) return;
    const sync = async () => {
      try {
        const syncResult = await syncTestTimer(sessionId);
        setIsOffline(false);
        if (syncResult.expired && !expiredRef.current) {
          expiredRef.current = true;
          onExpireRef.current();
        }
      } catch {
        setIsOffline(true);
      }
    };
    const first = setTimeout(() => {
      void sync();
    }, 0);
    const interval = setInterval(() => {
      void sync();
    }, pollIntervalMs);
    const handleOnline = () => {
      void sync();
    };
    window.addEventListener('online', handleOnline);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
    };
  }, [isActive, sessionId, pollIntervalMs]);

  const isExpiredNow = remainingSeconds <= 0;
  const isLow = remainingSeconds <= LOW_TIME_THRESHOLD_SECONDS && !isExpiredNow;

  return (
    <div
      aria-live="polite"
      className={cn(
        'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-mono font-bold transition-colors',
        isExpiredNow
          ? 'bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300'
          : isLow
            ? 'animate-pulse bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300'
            : 'bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-primary))]'
      )}
    >
      <Clock size={14} aria-hidden="true" />
      {formatTime(remainingSeconds)}
      {isOffline && (
        <span className="ml-1 inline-flex items-center gap-1 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900 dark:text-amber-300">
          <WifiOff size={10} aria-hidden="true" />
          Offline
        </span>
      )}
    </div>
  );
}
