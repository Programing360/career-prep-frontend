import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import GlobalSearch from '@/components/search/GlobalSearch';

export default function Hero() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-slate-50/50 dark:bg-[#0a1328] overflow-hidden py-10 lg:py-0">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-10 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

      {/* Hero Content Container */}
      <section className="relative w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left Column: Text & Search (AOS Animation: Bottom to Top) */}
            <div
              className="lg:col-span-7 space-y-6 sm:space-y-8"
              data-aos="fade-up"
            >
              {/* Badge */}
              <span className="inline-block rounded-full bg-blue-600/10 px-4 py-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400">
                Pakistan&apos;s #1 Govt Exam Prep Platform
              </span>

              {/* Heading */}
              <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl leading-[1.15]">
                Prepare for Pakistan&apos;s{' '}
                <span className="text-blue-600 dark:text-blue-500">
                  Government Exams
                </span>{' '}
                with{' '}
                <span className="relative inline-block">
                  Confidence
                  <svg
                    className="absolute -bottom-2 left-0 w-full text-amber-400/80"
                    viewBox="0 0 100 20"
                    fill="none"
                  >
                    <path
                      d="M5 15 Q 50 0, 95 15"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-2xl">
                A dedicated exam preparation platform —{' '}
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  not a jobs portal.
                </span>{' '}
                Excel in{' '}
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  FPSC, PPSC, NTS
                </span>
                , Armed Forces & Police exams with 25,000+ MCQs, AI-powered
                explanations, and realistic mock tests.
              </p>

              {/* GlobalSearch */}
              <div className="pt-2">
                <GlobalSearch data={[]} className="max-w-xl" />
              </div>

              {/* Social Proof */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex -space-x-2.5 overflow-hidden">
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                    alt="Student"
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                    alt="Student"
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                    alt="Student"
                  />
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white ring-2 ring-white dark:ring-slate-900">
                    50+
                  </div>
                </div>

                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    50,000+ students
                  </span>{' '}
                  are already preparing.{' '}
                  <Link
                    to={ROUTES.EXAMS}
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Join Free
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Column: Image & Floating Cards (AOS Animation: Left to Right) */}
            <div
              className="relative lg:col-span-5 flex justify-center items-center"
              data-aos="fade-left"
            >
              <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] lg:w-[420px] lg:h-[720px]">
                {/* Decorative Circle Background */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-100 to-teal-50/50 dark:from-emerald-950/40 dark:to-teal-900/20 -z-10 shadow-inner" />
                <div className="absolute -inset-4 rounded-full border border-emerald-500/10 -z-10 animate-pulse" />

                {/* Main Student PNG Image */}
                <img
                  src="https://i.ibb.co.com/xtZ0BNj5/pngtree-student-with-books-and-headphones-pointing-png-image-21037376-Photoroom.png"
                  alt="Student pointing"
                  className="h-full w-full object-cover object-top rounded-full drop-shadow-xl"
                />

                {/* Floating Badge 1 */}
                <div className="absolute top-6 -left-4 sm:-left-8 rounded-2xl bg-white/80 dark:bg-slate-900/80 p-3 sm:p-4 shadow-xl backdrop-blur-md border border-white/40 dark:border-slate-800 transition-transform hover:scale-105">
                  <p className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                    25K+
                  </p>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    MCQs Available
                  </p>
                </div>

                {/* Floating Badge 2 */}
                <div className="absolute top-12 -right-4 sm:-right-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 p-3 sm:p-4 shadow-xl backdrop-blur-md border border-white/40 dark:border-slate-800 transition-transform hover:scale-105">
                  <p className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                    500+
                  </p>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Mock Tests
                  </p>
                </div>

                {/* Floating Badge 3 */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-white/80 dark:bg-slate-900/80 px-5 py-3 shadow-xl backdrop-blur-md border border-white/40 dark:border-slate-800 transition-transform hover:scale-105">
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 inline-block mr-1">
                    89%
                  </p>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Success Rate Among Active Students
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
