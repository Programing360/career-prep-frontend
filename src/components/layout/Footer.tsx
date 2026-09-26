import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { GraduationCap, ArrowUp, Send } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { FaFacebook, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

// ─── Component ───────────────────────────────────────────────────────────────

const defaultFooterLinks: Array<{
  title: string;
  links: Array<{ label: string; to: string }>;
}> = [
  {
    title: 'Platform',
    links: [
      { label: 'Home', to: ROUTES.HOME },
      { label: 'Exams', to: ROUTES.EXAMS },
      { label: 'Subjects', to: ROUTES.SUBJECTS },
      { label: 'Dashboard', to: ROUTES.DASHBOARD },
      { label: 'AI Tutor', to: ROUTES.AI_TUTOR },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'About Us', to: ROUTES.ABOUT },
      { label: 'FAQ', to: ROUTES.FAQ },
      { label: 'Contact', to: ROUTES.CONTACT },
      { label: 'Premium', to: ROUTES.PREMIUM },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '#' },
      { label: 'Terms of Service', to: '#' },
      { label: 'Cookie Policy', to: '#' },
    ],
  },
];

export default function Footer({
  footerLinks = defaultFooterLinks,
}: {
  footerLinks?: Array<{
    title: string;
    links: Array<{ label: string; to: string }>;
  }>;
}) {
  const lenis = useLenis();
  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative overflow-hidden border-t border-[#8B3DFF]/15 rounded-t-3xl bg-gradient-to-b from-[#a1a2e6] to-[#a671e3] backdrop-blur-xl dark:border-purple-900/40 dark:from-[#714c95] dark:to-[#25146d] ">
      {/* Background Ambient Glow Effects using extracted soft purple */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#8B3DFF]/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[#8B3DFF]/15 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 gap-10 lg:grid-cols-12"
        >
          {/* ── Brand & Overview (Col 1-4) ────────────────────────── */}
          <motion.div className="space-y-4 lg:col-span-4">
            <Link
              to={ROUTES.HOME}
              className="group inline-flex items-center gap-2.5 transition-transform duration-200 active:scale-95"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3E8FF] text-[#8B3DFF] transition-all duration-300 group-hover:rotate-12 group-hover:bg-[#8B3DFF] group-hover:text-white dark:bg-purple-950/60 dark:text-purple-300">
                <GraduationCap size={26} />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight text-gray-900 transition-colors group-hover:text-[#8B3DFF] dark:text-white dark:group-hover:text-purple-300">
                MeritPrep
              </span>
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-gray-600 dark:text-purple-200/70">
              Pakistan's leading platform for government test preparation.
              Master MCQs with interactive practice, AI insights, and mock
              tests.
            </p>

            {/* Newsletter Input */}
            <div className="pt-2">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#7E22CE] dark:text-purple-300">
                Subscribe to updates
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex max-w-sm gap-2"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={cn(
                    'w-full rounded-xl border px-3.5 py-2 text-sm outline-none transition-all duration-200',
                    'border-purple-200/60 bg-white/80 text-gray-900 placeholder:text-purple-400/60 focus:border-[#8B3DFF] focus:ring-2 focus:ring-[#8B3DFF]/20',
                    'dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-white dark:placeholder:text-purple-400/50 dark:focus:border-[#8B3DFF]'
                  )}
                />
                <button
                  type="submit"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8B3DFF] text-white shadow-md shadow-purple-500/20 transition-all duration-200 hover:bg-[#7424ED] hover:shadow-lg hover:shadow-purple-500/30 active:scale-95 dark:bg-[#8B3DFF] dark:hover:bg-[#7424ED]"
                  aria-label="Subscribe"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>

          {/* ── Dynamic Nav Links Groups (Col 5-12) ────────────────── */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
            {footerLinks.map((group) => (
              <motion.div key={group.title} className="space-y-4">
                <h3 className="text-sm font-bold tracking-wider uppercase text-[#7E22CE] dark:text-purple-300">
                  {group.title}
                </h3>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className={cn(
                          'group inline-flex items-center text-sm text-gray-600 transition-all duration-200 hover:translate-x-1.5 hover:text-[#8B3DFF]',
                          'dark:text-purple-200/70 dark:hover:text-purple-300'
                        )}
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 bg-[#8B3DFF] transition-all duration-200 group-hover:w-full dark:bg-purple-400" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Bottom Bar & Back to Top ──────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-purple-100 pt-8 sm:flex-row dark:border-purple-950"
        >
          {/* Copyright */}
          <p className="text-center text-xs text-white dark:text-purple-300/60 sm:text-left">
            © {new Date().getFullYear()} MeritPrep Pakistan. All rights
            reserved.
          </p>

          {/* Social Icons & Back to top button */}
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {[
                { icon: FaTwitter, href: '#' },
                { icon: FaLinkedin, href: '#' },
                { icon: FaFacebook, href: '#' },
                { icon: FaGithub, href: '#' },
              ].map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F3E8FF]/60 text-[#8B3DFF] transition-all duration-200 hover:bg-[#8B3DFF] hover:text-white dark:bg-purple-950/60 dark:text-purple-300 dark:hover:bg-[#8B3DFF] dark:hover:text-white"
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>

            <div className="h-4 w-px bg-purple-200 dark:bg-purple-900" />

            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              className="group flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3E8FF] text-[#8B3DFF] transition-all duration-200 hover:bg-[#8B3DFF] hover:text-white active:scale-95 dark:bg-purple-950/80 dark:text-purple-300 dark:hover:bg-[#8B3DFF] dark:hover:text-white"
              title="Back to Top"
            >
              <ArrowUp
                size={18}
                className="transition-transform duration-200 group-hover:-translate-y-0.5"
              />
            </button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
