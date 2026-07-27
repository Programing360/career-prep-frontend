import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Lock, X, Sparkles, ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="relative w-full max-w-md animate-fade-in rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-[rgb(var(--color-text-muted))] transition-colors hover:text-[rgb(var(--color-text-primary))]"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900">
            <Lock
              size={28}
              className="text-primary-600 dark:text-primary-400"
            />
          </div>

          <h2 className="text-2xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
            Unlock Full Access
          </h2>
          <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))]">
            You have explored the free preview. Register now to access the
            complete question bank with detailed AI explanations.
          </p>
        </div>

        <div className="mt-6 space-y-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-4">
          {[
            {
              icon: Sparkles,
              text: 'Unlimited MCQ practice with AI explanations',
            },
            { icon: Shield, text: 'Full mock tests simulating real exams' },
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
          <Button fullWidth size="lg">
            <Link
              to={ROUTES.REGISTER}
              className="flex items-center justify-center gap-2"
            >
              Register for Free
              <ArrowRight size={16} />
            </Link>
          </Button>
          <p className="text-center text-xs text-[rgb(var(--color-text-muted))]">
            No credit card required. Start preparing in 30 seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
