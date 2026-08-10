import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { MailCheck, MailQuestion } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/hooks/useToast';
import { ROUTES } from '@/constants/routes';
import { emailSchema } from '@/utils/validationHelpers';
import { forgotPassword } from '@/services';
import lottieLoginAnimation from '../../assets/Login verification.svg';

const forgotSchema = z.object({ email: emailSchema });
type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPassword() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setIsLoading(true);
    try {
      await forgotPassword({ email: data.email });
      setSubmittedEmail(data.email);
      showToast('Reset link sent if the account exists', 'success');
    } catch (err) {
      showToast(
        err instanceof Error
          ? err.message
          : 'Could not send the reset link. Please try again.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900 p-4 sm:p-6 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex w-full max-w-4xl overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-transparent dark:border-purple-900/40 shadow-2xl transition-colors duration-300"
      >
        {/* Left Side: Illustration & Branding Section */}
        <div className="hidden flex-1 flex-col justify-between bg-gradient-to-b from-purple-500 to-indigo-600 dark:from-purple-900/80 dark:to-indigo-950 p-8 text-white md:flex">
          <div className="flex justify-center pt-6">
            <div className="relative flex items-center justify-center rounded-full bg-indigo-300/30 dark:bg-purple-800/20 backdrop-blur-sm">
              <img
                src={lottieLoginAnimation}
                alt="Password Reset"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
          <div className="px-4 pb-4 text-center">
            <p className="text-xs font-light tracking-wide text-purple-100 dark:text-purple-200/80">
              We will send you a link to reset your password.
            </p>
          </div>
        </div>

        {/* Right Side: Form Section */}
        <div className="relative flex flex-1 flex-col justify-between p-8 sm:p-12">
          <div className="self-end md:self-start">
            <span className="inline-block rounded-full bg-purple-500 dark:bg-purple-600/90 px-5 py-2 text-xs font-semibold tracking-wide text-white shadow-sm">
              Password Recovery
            </span>
          </div>

          <div className="my-auto py-6">
            {submittedEmail ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900">
                  <MailCheck
                    size={28}
                    className="text-purple-600 dark:text-purple-300"
                  />
                </div>
                <h2 className="mb-3 text-xl font-bold text-purple-900 dark:text-purple-200 sm:text-2xl">
                  Check your inbox
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  If an account exists for{' '}
                  <span className="font-semibold text-purple-700 dark:text-purple-300">
                    {submittedEmail}
                  </span>
                  , we sent a password reset link. Please check your email and
                  follow the instructions.
                </p>
                <div className="mt-8 text-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    Remembered your password?{' '}
                    <Link
                      to={ROUTES.LOGIN}
                      className="font-medium text-purple-500 dark:text-purple-300 underline underline-offset-4 transition-colors hover:text-purple-700 dark:hover:text-purple-200"
                    >
                      Back to Login
                    </Link>
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900">
                    <MailQuestion
                      size={20}
                      className="text-purple-600 dark:text-purple-300"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-purple-900 dark:text-purple-200 sm:text-2xl">
                    Forgot your password?
                  </h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <Input
                    label="Email address"
                    type="email"
                    placeholder="you@example.com"
                    error={errors.email?.message}
                    {...register('email')}
                    className="border-b-2 border-t-0 border-x-0 border-purple-200 dark:border-purple-800/60 bg-transparent px-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-purple-600 dark:focus:border-purple-400 focus:ring-0"
                  />

                  <div className="pt-2 text-center">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isLoading}
                      className="w-52 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-500 py-2.5 font-medium text-white transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 hover:brightness-110 active:scale-95"
                    >
                      {isLoading ? <Spinner size={16} /> : 'Send Reset Link'}
                    </Button>
                  </div>
                </form>

                <div className="mt-6 flex justify-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    Remembered your password?{' '}
                    <Link
                      to={ROUTES.LOGIN}
                      className="font-medium text-purple-500 dark:text-purple-300 underline underline-offset-4 transition-colors hover:text-purple-700 dark:hover:text-purple-200"
                    >
                      Back to Login
                    </Link>
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
