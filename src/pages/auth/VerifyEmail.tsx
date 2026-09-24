import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, MailCheck, RefreshCw } from 'lucide-react';
import { OtpInput } from '@/components/ui/OtpInput';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/hooks/useToast';
import { ROUTES } from '@/constants/routes';
import { resendOtp, verifyEmail } from '@/services';

const RESEND_COOLDOWN_SECONDS = 60;

function formatCountdown(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${String(remaining).padStart(2, '0')}`;
}

export default function VerifyEmail() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') ?? '';
  // const redirectTo = searchParams.get('redirect');

  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (!email) {
      navigate(ROUTES.REGISTER, { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const handleVerify = async () => {
    if (!email) return;
    if (otp.length !== 6) {
      showToast('Please enter the 6-digit verification code', 'error');
      return;
    }
    setIsVerifying(true);
    try {
      await verifyEmail({ email, otp });
      // const target =
      //   redirectTo && redirectTo.startsWith('/') ? redirectTo : ROUTES.LOGIN;
      showToast('Email verified successfully! Please sign in.', 'success');
      navigate(ROUTES.HOME, { replace: true });
    } catch (err) {
      showToast(
        err instanceof Error
          ? err.message
          : 'Verification failed. Please try again.',
        'error'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email || resendIn > 0 || isResending) return;
    setIsResending(true);
    try {
      const result = await resendOtp({ email });
      setResendIn(result.expiresInSeconds ?? RESEND_COOLDOWN_SECONDS);
      showToast(
        result.message || 'A new verification code has been sent',
        'success'
      );
    } catch (err) {
      showToast(
        err instanceof Error
          ? err.message
          : 'Could not resend the code. Please try again.',
        'error'
      );
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900">
            <MailCheck
              size={28}
              className="text-primary-600 dark:text-primary-400"
            />
          </div>
          <h1 className="text-2xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
            Verify your email
          </h1>
          <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
            We sent a 6-digit code to{' '}
            <span className="font-medium text-[rgb(var(--color-text-primary))]">
              {email}
            </span>
          </p>
        </div>

        <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 shadow-sm sm:p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify();
            }}
            className="space-y-6"
          >
            <OtpInput
              length={6}
              value={otp}
              onChange={setOtp}
              disabled={isVerifying}
              label="Verification code"
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              rightIcon={!isVerifying ? <ArrowRight size={16} /> : undefined}
            >
              {isVerifying ? <Spinner size={16} /> : 'Verify email'}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-1 text-sm text-[rgb(var(--color-text-secondary))]">
            <span>Did not receive the code?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || resendIn > 0}
              className="inline-flex items-center gap-1 font-semibold text-primary-600 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)] dark:text-primary-400"
            >
              {isResending ? <Spinner size={14} /> : <RefreshCw size={14} />}
              {resendIn > 0
                ? `Resend code in ${formatCountdown(resendIn)}`
                : 'Resend code'}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-[rgb(var(--color-text-secondary))]">
            Changed your mind?{' '}
            <Link
              to={ROUTES.REGISTER}
              className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              Create a new account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
