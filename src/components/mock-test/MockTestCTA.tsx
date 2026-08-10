import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  FileText,
  Sparkles,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';

const BENEFITS = [
  { icon: ClipboardCheck, label: '100+ Full Mock Tests' },
  { icon: FileText, label: 'Detailed Solutions & Explanations' },
  { icon: BarChart3, label: 'National Percentile Ranking' },
];

/**
 * High-converting registration banner shown at the bottom of the mock test
 * results page. Carries the current location through a `redirect` query
 * parameter so the user returns here after registering.
 */
export function MockTestCTA() {
  const location = useLocation();
  const redirectTo = `${location.pathname}${location.search}`;
  const registerHref = `${ROUTES.REGISTER}?redirect=${encodeURIComponent(redirectTo)}`;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-primary-200/60 bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 p-6 shadow-xl sm:p-8 dark:border-primary-800/60">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-accent-500/20 blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-primary-400" aria-hidden="true" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-primary-300">
            Limited free preview
          </span>
        </div>

        <h3 className="mt-2 text-xl font-bold font-heading text-white sm:text-2xl">
          Register to Unlock Full-Length Mock Tests &amp; Detailed Explanations
        </h3>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-300">
          Turn this demo into complete exam preparation â€” timed full-length
          tests, step-by-step solutions, and national-level ranking.
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <li
                key={benefit.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-gray-200 backdrop-blur-sm"
              >
                <Icon
                  size={12}
                  className="text-accent-400"
                  aria-hidden="true"
                />
                {benefit.label}
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            to={registerHref}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-gray-900 shadow-lg transition-colors hover:bg-gray-100 focus-ring dark:bg-primary-500 dark:text-white dark:hover:bg-primary-400"
          >
            Register Now for Free
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <span className="text-xs text-gray-400">
            No credit card required Â· Instant access
          </span>
        </div>
      </div>
    </section>
  );
}
