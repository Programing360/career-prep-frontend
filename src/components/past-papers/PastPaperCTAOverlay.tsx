import { Link, useLocation } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

export function PastPaperCTAOverlay() {
  const location = useLocation();
  const registerPath = `${ROUTES.REGISTER}?redirect=${encodeURIComponent(location.pathname + location.search)}`;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-x-4 -top-20 h-28 bg-gradient-to-t from-white/90 to-transparent dark:from-gray-950/90" />
      <div className="relative rounded-xl border border-white/30 bg-white/70 p-6 backdrop-blur-xl backdrop-saturate-150 dark:border-gray-700/40 dark:bg-gray-900/70">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/50">
            <Lock size={22} className="text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Register to Unlock Full Document
          </h3>
          <p className="mt-1.5 max-w-sm text-sm text-gray-600 dark:text-gray-400">
            Get full access to all pages, detailed answer keys, and downloadable
            PDFs.
          </p>
          <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row">
            <Link to={registerPath}>
              <Button size="lg">
                Register for Free
                <ArrowRight size={16} className="ml-1.5" />
              </Button>
            </Link>
            <Link
              to={`${ROUTES.LOGIN}?redirect=${encodeURIComponent(location.pathname + location.search)}`}
              className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
