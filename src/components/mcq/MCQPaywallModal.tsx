import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, ArrowRight, Shield, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

interface MCQPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  answeredCount: number;
}

export function MCQPaywallModal({
  isOpen,
  onClose,
  answeredCount,
}: MCQPaywallModalProps) {
  const navigate = useNavigate();
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    setTimeout(() => closeButtonRef.current?.focus(), 100);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleRegister = useCallback(() => {
    const currentPath = `${window.location.pathname}${window.location.hash}`;
    navigate(
      `${ROUTES.REGISTER}?redirectTo=${encodeURIComponent(currentPath)}`
    );
  }, [navigate]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="paywall-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="relative w-full max-w-md animate-fade-in rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-8 shadow-2xl">
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-[rgb(var(--color-text-muted))] transition-colors hover:text-[rgb(var(--color-text-primary))]"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800">
            <Trophy
              size={28}
              className="text-primary-600 dark:text-primary-400"
            />
          </div>

          <h2
            id="paywall-title"
            className="text-2xl font-bold font-heading text-[rgb(var(--color-text-primary))]"
          >
            Great Progress!
          </h2>
          <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))]">
            You've completed{' '}
            <span className="font-semibold text-primary-600 dark:text-primary-400">
              {answeredCount} free preview questions
            </span>{' '}
            — Register to access{' '}
            <span className="font-semibold">2,000+ full question bank</span>{' '}
            with detailed AI explanations.
          </p>
        </div>

        <div className="mt-6 space-y-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-4">
          {[
            {
              icon: Sparkles,
              text: 'Unlimited MCQ practice with AI explanations',
            },
            {
              icon: Shield,
              text: 'Full mock tests simulating real exams',
            },
            {
              icon: ArrowRight,
              text: 'Track progress with analytics dashboard',
            },
          ].map((feature) => (
            <div key={feature.text} className="flex items-start gap-3">
              <feature.icon
                size={16}
                className="mt-0.5 shrink-0 text-primary-500"
              />
              <span className="text-sm text-[rgb(var(--color-text-secondary))]">
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <Button fullWidth size="lg" onClick={handleRegister}>
            <span className="flex items-center justify-center gap-2">
              Register for Free
              <ArrowRight size={16} />
            </span>
          </Button>
          <p className="text-center text-xs text-[rgb(var(--color-text-muted))]">
            No credit card required. Start preparing in 30 seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
