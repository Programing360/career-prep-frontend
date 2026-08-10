import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import GlobalSearch from '@/components/search/GlobalSearch';

export default function Hero() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#FAF7FF] dark:bg-[#0F0A1C] overflow-hidden py-16 lg:py-0 transition-colors duration-300">
      {/* Background Decorative Soft Purple Glows */}
      <div className="absolute top-1/4 left-10 h-80 w-80 rounded-full bg-[#8B3DFF]/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-[28rem] w-[28rem] rounded-full bg-[#7424ED]/10 blur-[140px] pointer-events-none dark:bg-[#8B3DFF]/20" />

      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b3dff0a_1px,transparent_1px),linear-gradient(to_bottom,#8b3dff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Hero Content Container */}
      <section className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left Column: Text & Search */}
            <div
              className="lg:col-span-7 space-y-6 sm:space-y-8"
              data-aos="fade-up"
            >
              {/* Badge */}
              <span className="inline-flex items-center gap-2 rounded-full border border-[#8B3DFF]/20 bg-[#F3E8FF] dark:bg-purple-950/60 px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#8B3DFF] dark:text-purple-300 shadow-sm backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#8B3DFF] animate-pulse" />
                Pakistan's #1 Govt Exam Prep Platform
              </span>

              {/* Heading */}
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl leading-[1.15]">
                Prepare for Pakistan's{' '}
                <span className="text-[#8B3DFF] dark:text-purple-400">
                  Government Exams
                </span>{' '}
                with{' '}
                <span className="relative inline-block text-[#8B3DFF] dark:text-purple-300">
                  Confidence
                  <svg
                    className="absolute -bottom-2 left-0 w-full text-[#8B3DFF]/40 dark:text-purple-400/50"
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
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-purple-200/80 font-medium max-w-2xl leading-relaxed">
                A dedicated exam preparation platform —{' '}
                <span className="font-semibold text-gray-900 dark:text-white">
                  not a jobs portal.
                </span>{' '}
                Excel in{' '}
                <span className="text-[#8B3DFF] dark:text-purple-300 font-semibold">
                  FPSC, PPSC, NTS
                </span>
                , Armed Forces & Police exams with 25,000+ MCQs, AI-powered
                explanations, and realistic mock tests.
              </p>

              {/* GlobalSearch */}
              <div className="pt-2">
                <GlobalSearch className="max-w-xl shadow-lg shadow-purple-950/5" />
              </div>

              {/* Social Proof */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex -space-x-2.5 overflow-hidden">
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-[#FAF7FF] dark:ring-[#0F0A1C] object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                    alt="Student"
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-[#FAF7FF] dark:ring-[#0F0A1C] object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                    alt="Student"
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-[#FAF7FF] dark:ring-[#0F0A1C] object-cover"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                    alt="Student"
                  />
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8B3DFF] text-xs font-bold text-white ring-2 ring-[#FAF7FF] dark:ring-[#0F0A1C] shadow-sm">
                    50+
                  </div>
                </div>

                <p className="text-sm font-medium text-gray-600 dark:text-purple-200/70">
                  <span className="font-bold text-gray-900 dark:text-white">
                    50,000+ students
                  </span>{' '}
                  are already preparing.{' '}
                  <Link
                    to={ROUTES.EXAMS}
                    className="text-[#8B3DFF] dark:text-purple-300 font-semibold hover:underline"
                  >
                    Join Free
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Column: Image & Floating Cards */}
            <div
              className="relative lg:col-span-5 flex justify-center items-center"
              data-aos="fade-left"
            >
              <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] lg:w-[420px] lg:h-[720px]">
                {/* Decorative Soft Purple Backdrop Shapes */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#F3E8FF] to-[#FAF7FF] dark:from-purple-950/50 dark:to-[#0F0A1C] -z-10 shadow-2xl shadow-purple-500/10" />
                <div className="absolute -inset-4 rounded-full border border-[#8B3DFF]/20 -z-10 animate-pulse" />

                {/* Main Student Image */}
                <img
                  src="https://i.ibb.co.com/xtZ0BNj5/pngtree-student-with-books-and-headphones-pointing-png-image-21037376-Photoroom.png"
                  alt="Student pointing"
                  className="h-full w-full object-cover object-top rounded-full drop-shadow-2xl"
                />

                {/* Floating Badge 1 */}
                <div className="absolute top-6 -left-4 sm:-left-8 rounded-2xl bg-white/80 dark:bg-[#0F0A1C]/80 p-3 sm:p-4 shadow-xl backdrop-blur-xl border border-purple-100/60 dark:border-purple-900/50 transition-transform hover:scale-105">
                  <p className="text-sm font-extrabold text-[#8B3DFF] dark:text-purple-300">
                    25K+
                  </p>
                  <p className="text-xs font-medium text-gray-600 dark:text-purple-200/70">
                    MCQs Available
                  </p>
                </div>

                {/* Floating Badge 2 */}
                <div className="absolute top-12 -right-4 sm:-right-6 rounded-2xl bg-white/80 dark:bg-[#0F0A1C]/80 p-3 sm:p-4 shadow-xl backdrop-blur-xl border border-purple-100/60 dark:border-purple-900/50 transition-transform hover:scale-105">
                  <p className="text-sm font-extrabold text-[#8B3DFF] dark:text-purple-300">
                    500+
                  </p>
                  <p className="text-xs font-medium text-gray-600 dark:text-purple-200/70">
                    Mock Tests
                  </p>
                </div>

                {/* Floating Badge 3 */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-white/80 dark:bg-[#0F0A1C]/80 px-5 py-3 shadow-xl backdrop-blur-xl border border-purple-100/60 dark:border-purple-900/50 transition-transform hover:scale-105">
                  <p className="text-xs font-bold text-[#8B3DFF] dark:text-purple-300 inline-block mr-1">
                    89%
                  </p>
                  <span className="text-xs font-medium text-gray-700 dark:text-purple-100">
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
