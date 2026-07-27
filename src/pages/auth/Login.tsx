import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GraduationCap, Mail, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { ROUTES } from '@/constants/routes';
import { loginSchema } from '@/utils/validationHelpers';
import type { LoginPayload } from '@/types';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo =
    (location.state as { from?: string })?.from || ROUTES.DASHBOARD;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginPayload) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      showToast('Welcome back!', 'success');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Login failed. Please try again.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900">
            <GraduationCap
              size={28}
              className="text-primary-600 dark:text-primary-400"
            />
          </div>
          <h1 className="text-2xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
            Sign in to continue your preparation
          </p>
        </div>

        <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[rgb(var(--color-text-secondary))]">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[rgb(var(--color-border))] text-primary-500 focus:ring-primary-500"
                />
                Remember me
              </label>
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
              rightIcon={!isLoading ? <ArrowRight size={16} /> : undefined}
            >
              {isLoading ? <Spinner size={16} /> : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[rgb(var(--color-text-secondary))]">
            Do not have an account?{' '}
            <Link
              to={ROUTES.REGISTER}
              className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              Create one now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
