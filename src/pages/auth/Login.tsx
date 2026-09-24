import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/hooks/useToast';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { ROUTES } from '@/constants/routes';
import { loginSchema } from '@/utils/validationHelpers';
import type { LoginPayload } from '@/types';
import { loginUser } from '@/services';
import { isApiError } from '@/lib/axios';
import lottieLoginAnimation from '../../assets/Business meeting in office.svg';

export default function Login() {
  const { showToast } = useToast();
  const dispatch = useAppDispatch();
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
    // console.log(data);
    try {
      const res = await loginUser(data);
      // console.log(res, data);
      dispatch(setCredentials({ user: res.user, token: res.accessToken }));
      showToast('Welcome back!', 'success');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      // console.log(err);
      let errorMessage = 'Login failed. Please try again.';

      if (isApiError(err) && err.errors && err.errors.length > 0) {
        // Show all field-level validation errors from the backend
        errorMessage = err.errors.map((e) => e.message).join('\n');
      } else if (err instanceof Error && err.message) {
        errorMessage = err.message;
      }

      showToast(errorMessage, 'error');
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
        <div className="hidden flex-1 flex-col justify-between bg-gradient-to-b from-purple-500 to-indigo-600 dark:from-purple-900/80 dark:to-indigo-950 p-8 text-white md:flex">
          <div className="flex justify-center pt-6">
            <div className="relative flex  items-center justify-center rounded-full bg-indigo-300/30 dark:bg-purple-800/20 backdrop-blur-sm">
              {/* <GraduationCap size={120} className="text-white" strokeWidth={1.2} /> */}
              <img
                src={lottieLoginAnimation}
                alt="Login Animation"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
          <div className="px-4 pb-4 text-center">
            <p className="text-xs font-light tracking-wide text-purple-100 dark:text-purple-200/80">
              Sign in to continue your preparation and reach your goals.
            </p>
          </div>
        </div>

        {/* Right Side: Form Section */}
        <div className="relative flex flex-1 flex-col justify-between p-8 sm:p-12">
          {/* Top Pill / Badge */}
          <div className="self-end md:self-start">
            <span className="inline-block rounded-full bg-purple-500 dark:bg-purple-600/90 px-5 py-2 text-xs font-semibold tracking-wide text-white shadow-sm">
              Welcome back
            </span>
          </div>

          <div className="my-auto py-6">
            <h2 className="mb-6 text-xl font-bold text-purple-900 dark:text-purple-200 sm:text-2xl">
              Login your account
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
                className="border-b-2 border-t-0 border-x-0 border-purple-200 dark:border-purple-800/60 bg-transparent px-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-purple-600 dark:focus:border-purple-400 focus:ring-0"
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register('password')}
                className="border-b-2 border-t-0 border-x-0 border-purple-200 dark:border-purple-800/60 bg-transparent px-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-purple-600 dark:focus:border-purple-400 focus:ring-0"
              />

              <div className="pt-2 text-center">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-40 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-500 py-2.5 font-medium text-white transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 hover:brightness-110 active:scale-95"
                >
                  {isLoading ? <Spinner size={16} /> : 'Login'}
                </Button>
              </div>
            </form>

            {/* Additional Links */}
            <div className="mt-8 flex flex-col items-center gap-3 text-xs">
              <Link
                to={ROUTES.REGISTER}
                className="font-medium text-purple-400 dark:text-purple-300 transition-colors hover:text-purple-600 dark:hover:text-purple-200"
              >
                Create Account
              </Link>
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="font-medium text-purple-400 dark:text-purple-300 underline underline-offset-4 transition-colors hover:text-purple-600 dark:hover:text-purple-200"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
