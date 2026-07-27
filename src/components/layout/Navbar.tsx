import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Menu,
  X,
  Sun,
  Moon,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  BookOpen,
  Shield,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types';

// ─── Constants ───────────────────────────────────────────────────────────────

const navLinks = [
  { label: 'Home', to: ROUTES.HOME },
  { label: 'Exams', to: ROUTES.EXAMS },
  { label: 'Practice', to: ROUTES.PRACTICE },
  { label: 'About', to: ROUTES.ABOUT },
  { label: 'Contact', to: ROUTES.CONTACT },
  { label: 'FAQ', to: ROUTES.FAQ },
];

const studentMenuItems = [
  { label: 'Profile', to: ROUTES.PROFILE, icon: User },
  { label: 'Dashboard', to: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'My Exams', to: ROUTES.EXAMS, icon: BookOpen },
];

const adminMenuItems = [
  { label: 'Admin Dashboard', to: ROUTES.ADMIN_DASHBOARD, icon: Shield },
  { label: 'Admin Profile', to: '/admin/profile', icon: User },
  { label: 'Settings', to: ROUTES.ADMIN_AI_TOKENS, icon: Settings },
];

const ADMIN_ROLES: UserRole[] = ['admin', 'super_admin', 'content_manager'];

// ─── Scroll Hook ─────────────────────────────────────────────────────────────

function useScrollDirection() {
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up');
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          setAtTop(y < 10);
          setScrollDir(y > lastY ? 'down' : 'up');
          lastY = y;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { scrollDir, atTop };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { scrollDir, atTop } = useScrollDirection();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = user ? ADMIN_ROLES.includes(user.role) : false;
  const menuItems = isAdmin ? adminMenuItems : studentMenuItems;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate(ROUTES.HOME);
  }, [logout, navigate]);

  const closeMobile = useCallback(() => setMobileMenuOpen(false), []);

  const isActive = useCallback(
    (to: string) =>
      to === '/'
        ? pathname === '/'
        : pathname === to || pathname.startsWith(to + '/'),
    [pathname]
  );

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <motion.header
      animate={{
        y: scrollDir === 'down' && !atTop ? '-100%' : '0%',
      }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        'fixed inset-x-0 top-0 z-50',
        'border-b border-white/20 bg-white/70 shadow-sm backdrop-blur-md',
        'dark:border-gray-800/50 dark:bg-gray-900/70'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ── Logo ──────────────────────────────────────────────────── */}
        <Link to={ROUTES.HOME} className="flex items-center gap-2">
          <GraduationCap size={28} className="text-primary-500" />
          <span className="text-xl font-bold font-heading text-gray-900 dark:text-white">
            MeritPrep
          </span>
        </Link>

        {/* ── Desktop Nav Links ─────────────────────────────────────── */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className="relative rounded-md px-3 py-2 text-sm font-medium"
              >
                {active && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-md bg-primary-500/10"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <span
                  className={cn(
                    'relative z-10 transition-colors',
                    active
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  )}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* ── Desktop Right Actions ─────────────────────────────────── */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full',
              'bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200',
              'dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            )}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === 'dark' ? (
                <motion.span
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun size={18} />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon size={18} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {isAuthenticated && user ? (
            /* ── Avatar Dropdown ──────────────────────────────────── */
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className={cn(
                  'flex items-center gap-2 rounded-full p-0.5 transition-colors',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  dropdownOpen && 'bg-gray-100 dark:bg-gray-800'
                )}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-white dark:ring-gray-900"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-sm font-semibold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <ChevronDown
                  size={14}
                  className={cn(
                    'text-gray-500 transition-transform dark:text-gray-400',
                    dropdownOpen && 'rotate-180'
                  )}
                />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className={cn(
                      'absolute right-0 mt-2 w-64 origin-top-right',
                      'rounded-xl border p-1.5 shadow-xl',
                      'border-white/20 bg-white/80 backdrop-blur-xl',
                      'dark:border-gray-800/50 dark:bg-gray-900/80'
                    )}
                  >
                    {/* User Info Header */}
                    <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="my-1 h-px bg-gray-200/50 dark:bg-gray-700/50" />

                    {/* Menu Items */}
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setDropdownOpen(false)}
                          className={cn(
                            'flex items-center gap-2.5 rounded-lg px-3 py-2',
                            'text-sm font-medium text-gray-700 transition-colors',
                            'hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                          )}
                        >
                          <Icon
                            size={16}
                            className="text-gray-400 dark:text-gray-500"
                          />
                          {item.label}
                        </Link>
                      );
                    })}

                    <div className="my-1 h-px bg-gray-200/50 dark:bg-gray-700/50" />

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className={cn(
                        'flex w-full items-center gap-2.5 rounded-lg px-3 py-2',
                        'text-sm font-medium text-red-600 transition-colors',
                        'hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50'
                      )}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* ── Login Button ──────────────────────────────────────── */
            <Link
              to={ROUTES.LOGIN}
              className={cn(
                'inline-flex items-center justify-center rounded-md px-4 py-2',
                'text-sm font-medium text-white transition-colors',
                'bg-gray-900 hover:bg-gray-800',
                'dark:bg-primary-600 dark:hover:bg-primary-700'
              )}
            >
              Login
            </Link>
          )}
        </div>

        {/* ── Mobile Controls ────────────────────────────────────────── */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full',
              'bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200',
              'dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            )}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full',
              'bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200',
              'dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            )}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'border-t md:hidden',
              'border-white/20 bg-white/80 backdrop-blur-xl',
              'dark:border-gray-800/50 dark:bg-gray-900/80'
            )}
          >
            <div className="space-y-1 px-4 py-4">
              {/* Nav Links */}
              {navLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={closeMobile}
                    className={cn(
                      'block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="my-2 h-px bg-gray-200/50 dark:bg-gray-700/50" />

              {isAuthenticated && user ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Menu Items */}
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={closeMobile}
                        className={cn(
                          'flex items-center gap-2.5 rounded-lg px-3 py-2.5',
                          'text-sm font-medium text-gray-700 transition-colors',
                          'hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                        )}
                      >
                        <Icon
                          size={16}
                          className="text-gray-400 dark:text-gray-500"
                        />
                        {item.label}
                      </Link>
                    );
                  })}

                  <div className="my-2 h-px bg-gray-200/50 dark:bg-gray-700/50" />

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5',
                      'text-sm font-medium text-red-600 transition-colors',
                      'hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50'
                    )}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                /* Login */
                <Link
                  to={ROUTES.LOGIN}
                  onClick={closeMobile}
                  className={cn(
                    'block rounded-lg px-4 py-2.5 text-center text-sm font-medium',
                    'text-white transition-colors',
                    'bg-gray-900 hover:bg-gray-800',
                    'dark:bg-primary-600 dark:hover:bg-primary-700'
                  )}
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
