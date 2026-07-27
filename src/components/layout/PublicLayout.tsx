import type { ReactNode } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import Navbar from '@/components/layout/Navbar';

const footerLinks = [
  {
    title: 'Platform',
    links: [
      { label: 'About Us', to: ROUTES.ABOUT },
      { label: 'Contact', to: ROUTES.CONTACT },
      { label: 'Careers', to: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', to: '#' },
      { label: 'FAQs', to: ROUTES.FAQ },
      { label: 'Support', to: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '#' },
      { label: 'Terms of Service', to: '#' },
    ],
  },
];

interface PublicLayoutProps {
  children?: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 pt-16">{children ?? <Outlet />}</main>

      <footer className="border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <Link to={ROUTES.HOME} className="flex items-center gap-2">
                <GraduationCap size={24} className="text-primary-500" />
                <span className="text-lg font-bold font-heading text-[rgb(var(--color-text-primary))]">
                  MeritPrep
                </span>
              </Link>
              <p className="mt-3 text-sm text-[rgb(var(--color-text-secondary))]">
                Pakistan's leading platform for government test preparation.
              </p>
            </div>

            {footerLinks.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                  {group.title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-[rgb(var(--color-border))] pt-8 text-center text-sm text-[rgb(var(--color-text-muted))]">
            © {new Date().getFullYear()} MeritPrep Pakistan. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
