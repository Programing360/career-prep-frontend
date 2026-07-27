import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GraduationCap, User, Mail, Phone, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/hooks/useToast';
import { ROUTES } from '@/constants/routes';
import { registerSchema } from '@/utils/validationHelpers';

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      // Mock API call — replace with actual registration API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Register payload:', data);
      showToast('Account created successfully! Please log in.', 'success');
    } catch (err) {
      showToast(
        err instanceof Error
          ? err.message
          : 'Registration failed. Please try again.',
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
            Create your account
          </h1>
          <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
            Start your government exam preparation today
          </p>
        </div>

        <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full name"
              placeholder="Enter your full name"
              leftIcon={<User size={16} />}
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Phone number (optional)"
              type="tel"
              placeholder="+923001234567"
              leftIcon={<Phone size={16} />}
              error={errors.phone?.message}
              hint="Pakistani phone number format"
              {...register('phone')}
            />

            <PasswordInput
              label="Password"
              placeholder="Create a strong password"
              error={errors.password?.message}
              {...register('password')}
            />

            <PasswordInput
              label="Confirm password"
              placeholder="Re-enter your password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
              rightIcon={!isLoading ? <ArrowRight size={16} /> : undefined}
            >
              {isLoading ? <Spinner size={16} /> : 'Create account'}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-[rgb(var(--color-text-muted))]">
            By creating an account, you agree to our{' '}
            <Link
              to="#"
              className="text-primary-600 hover:underline dark:text-primary-400"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              to="#"
              className="text-primary-600 hover:underline dark:text-primary-400"
            >
              Privacy Policy
            </Link>
            .
          </p>

          <div className="mt-6 text-center text-sm text-[rgb(var(--color-text-secondary))]">
            Already have an account?{' '}
            <Link
              to={ROUTES.LOGIN}
              className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
