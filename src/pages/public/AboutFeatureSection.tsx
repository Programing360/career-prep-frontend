import React from 'react';
import {
  Target,
  Zap,
  TrendingUp,
  Bell,
  Bot,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import childrenImg from '../../assets/school-friends_1098-15925.avif';

interface FeatureItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    icon: Target,
    title: 'Targeted Syllabus Roadmaps',
    description: 'Chapter-by-chapter breaking down of entire exam syllabi.',
  },
  {
    icon: Zap,
    title: 'Topic-Level Practice & MCQs',
    description:
      'Focused practice questions mapped directly to specific topics.',
  },
  {
    icon: TrendingUp,
    title: 'Smart Performance Analytics',
    description:
      'Identify your weak areas automatically with detailed score histories.',
  },
  {
    icon: Bell,
    title: 'Live Exam Directory & Updates',
    description:
      'Stay updated with verified recruitment notifications and syllabus changes.',
  },
  {
    icon: Bot,
    title: 'AI-Powered Personalization',
    description:
      'Dynamic token-based study assistance tailored to your target exams.',
  },
];

interface AboutFeatureSectionProps {
  imageSrc?: string;
  imageAlt?: string;
  onCtaClick?: () => void;
}

export const AboutFeatureSection: React.FC<AboutFeatureSectionProps> = ({
  // _imageSrc = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
  imageAlt = 'Students preparing for competitive exams with MeritPrep',
  onCtaClick,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#FAF7FF] py-16 transition-colors duration-300 dark:bg-[#0F0A1C] sm:py-24">
      {/* Background Decorative Glows */}
      <div className="pointer-events-none absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-[#8B3DFF]/10 blur-3xl dark:bg-[#8B3DFF]/20" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl dark:bg-purple-900/20" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ─── Left Side: Image / Illustration (Shows first on mobile) ─── */}
          <div className="order-1 lg:col-span-5 lg:order-1">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Decorative Border Frame */}
              <div className="relative rounded-3xl  border-purple-200/80 bg-white/50 p-3 shadow-2xl shadow-purple-950/10 backdrop-blur-xl dark:border-purple-800/40 dark:bg-[#150E28]/60">
                <div className="group relative h-[360px] w-full overflow-hidden rounded-2xl sm:h-[460px]">
                  <img
                    src={childrenImg}
                    alt={imageAlt}
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle Image Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A1C]/60 via-transparent to-transparent opacity-60" />

                  {/* Trust Badge Floating Element */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-xl border border-white/20 bg-white/90 p-3.5 shadow-lg backdrop-blur-md dark:border-purple-500/30 dark:bg-[#150E28]/90">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#8B3DFF]/15 text-[#8B3DFF] dark:bg-purple-500/20 dark:text-purple-300">
                      <CheckCircle2 size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        100% Verified Content
                      </p>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-purple-300/70">
                        Mapped to FPSC, PPSC & CSS Syllabi
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Right Side: Information & Features Stack ─── */}
          <div className="order-2 space-y-6 lg:col-span-7 lg:order-2">
            {/* Small Badge/Subtitle */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#8B3DFF]/20 bg-[#F3E8FF] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#8B3DFF] dark:border-purple-500/30 dark:bg-purple-950/60 dark:text-purple-300">
                Why Choose MeritPrep
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl font-black font-heading tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl lg:leading-tight">
              Empowering Your Journey to{' '}
              <span className="bg-gradient-to-r from-[#8B3DFF] via-purple-600 to-cyan-500 bg-clip-text text-transparent dark:from-purple-400 dark:to-cyan-400">
                Competitive Exam Success
              </span>
            </h2>

            {/* Short Description */}
            <p className="text-base leading-relaxed text-slate-600 dark:text-purple-200/80 sm:text-lg">
              MeritPrep is Pakistan's premier digital platform tailored for
              aspirants preparing for CSS, PMS, FPSC, PPSC, and government
              recruitment exams. We combine dynamic syllabus roadmaps with
              targeted prep tools to maximize your score.
            </p>

            {/* Opportunities & Features List */}
            <div className="pt-2">
              <ul className="space-y-4">
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <li
                      key={idx}
                      className="group flex items-start gap-4 rounded-2xl border border-transparent p-2.5 transition-all duration-300 hover:border-purple-100 hover:bg-white/80 hover:shadow-md dark:hover:border-purple-900/40 dark:hover:bg-[#150E28]/50"
                    >
                      <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F3E8FF] text-[#8B3DFF] transition-colors duration-300 group-hover:bg-[#8B3DFF] group-hover:text-white dark:bg-purple-950/80 dark:text-purple-300 dark:group-hover:bg-purple-600 dark:group-hover:text-white">
                        <Icon size={20} />
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                          {feature.title}
                        </h3>
                        <p className="text-xs leading-relaxed text-slate-500 dark:text-purple-300/70 sm:text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Primary Call-To-Action (CTA) */}
            <div className="pt-4">
              <button
                onClick={onCtaClick}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-[#8B3DFF] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:bg-[#7424ED] hover:shadow-xl hover:shadow-purple-500/35 focus:outline-none focus:ring-2 focus:ring-[#8B3DFF] focus:ring-offset-2 dark:bg-purple-600 dark:hover:bg-purple-500 dark:focus:ring-offset-[#0F0A1C]"
              >
                <span>Get Started Free</span>
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutFeatureSection;
