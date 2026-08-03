import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/hooks/useToast';
import { ROUTES } from '@/constants/routes';
import { registerSchema } from '@/utils/validationHelpers';
import { registerUser } from '@/services';
import lotieAnimation from '../../assets/Study discussion.svg';

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = searchParams.get('redirect');

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
      passwordConfirm: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    console.log(data);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
      });

      const redirectQuery =
        redirectTo && redirectTo.startsWith('/')
          ? `&redirect=${encodeURIComponent(redirectTo)}`
          : '';
      showToast('Verification code sent to your email', 'success');
      navigate(
        `${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(
          data.email
        )}${redirectQuery}`,
        { replace: true }
      );
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900 p-4 sm:p-6 transition-colors duration-300">
      {/* Animated Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex w-full max-w-4xl overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-transparent dark:border-purple-900/40 shadow-2xl transition-colors duration-300"
      >
        {/* Left Side: Illustration & Branding Section */}
        <div className="hidden flex-1 flex-col  justify-between  bg-gradient-to-b from-purple-500 to-indigo-600 dark:from-purple-900/80 dark:to-indigo-950 p-8 text-white md:flex">
          <div className="flex w-full items-center  h-full justify-center pt-6">
            <div className="relative flex h-96 w-96 items-center justify-center rounded-full bg-indigo-300/30 dark:bg-purple-800/20 backdrop-blur-sm">
              <img
                src={lotieAnimation}
                alt="Illustration"
                className="h-66 w-11/12 object-contain"
              />
            </div>
          </div>
          <div className="px-4 pb-4 text-center">
            <p className="text-xs font-light tracking-wide text-purple-100 dark:text-purple-200/80">
              Start your government exam preparation today and achieve success.
            </p>
          </div>
        </div>

        {/* Right Side: Form Section */}
        <div className="relative flex flex-1 flex-col justify-between p-8 sm:p-12">
          {/* Top Pill / Badge */}
          <div className="self-end md:self-start">
            <span className="inline-block rounded-full bg-purple-500 dark:bg-purple-600/90 px-5 py-2 text-xs font-semibold tracking-wide text-white shadow-sm">
              Get Started
            </span>
          </div>

          <div className="my-auto py-4">
            <h2 className="mb-4 text-xl font-bold text-purple-900 dark:text-purple-200 sm:text-2xl">
              Create your account
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full name"
                placeholder="Enter your full name"
                error={errors.name?.message}
                {...register('name')}
                className="border-b-2 border-t-0 border-x-0 border-purple-200 dark:border-purple-800/60 bg-transparent px-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-purple-600 dark:focus:border-purple-400 focus:ring-0"
              />

              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
                className="border-b-2 border-t-0 border-x-0 border-purple-200 dark:border-purple-800/60 bg-transparent px-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-purple-600 dark:focus:border-purple-400 focus:ring-0"
              />

              <Input
                label="Phone number (optional)"
                type="tel"
                placeholder="+923001234567"
                error={errors.phone?.message}
                hint="Pakistani phone number format"
                {...register('phone')}
                className="border-b-2 border-t-0 border-x-0 border-purple-200 dark:border-purple-800/60 bg-transparent px-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-purple-600 dark:focus:border-purple-400 focus:ring-0"
              />

              <PasswordInput
                label="Password"
                placeholder="Create a strong password"
                error={errors.password?.message}
                {...register('password')}
                className="border-b-2 border-t-0 border-x-0 border-purple-200 dark:border-purple-800/60 bg-transparent px-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-purple-600 dark:focus:border-purple-400 focus:ring-0"
              />

              <PasswordInput
                label="Confirm password"
                placeholder="Re-enter your password"
                error={errors.passwordConfirm?.message}
                {...register('passwordConfirm')}
                className="border-b-2 border-t-0 border-x-0 border-purple-200 dark:border-purple-800/60 bg-transparent px-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-purple-600 dark:focus:border-purple-400 focus:ring-0"
              />

              <div className="pt-2 text-center">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-48 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-500 py-2.5 font-medium text-white transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 hover:brightness-110 active:scale-95"
                >
                  {isLoading ? <Spinner size={16} /> : 'Create Account'}
                </Button>
              </div>
            </form>

            <p className="mt-4 text-center text-[10px] text-slate-500 dark:text-slate-400">
              By creating an account, you agree to our{' '}
              <Link
                to="#"
                className="text-purple-500 dark:text-purple-400 underline underline-offset-2 hover:text-purple-700 dark:hover:text-purple-300"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                to="#"
                className="text-purple-500 dark:text-purple-400 underline underline-offset-2 hover:text-purple-700 dark:hover:text-purple-300"
              >
                Privacy Policy
              </Link>
              .
            </p>

            {/* Additional Links */}
            <div className="mt-4 flex justify-center text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                Already have an account?{' '}
                <Link
                  to={ROUTES.LOGIN}
                  className="font-medium text-purple-500 dark:text-purple-300 underline underline-offset-4 transition-colors hover:text-purple-700 dark:hover:text-purple-200"
                >
                  Sign in
                </Link>
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
