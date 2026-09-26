import { useState, type ReactNode } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Target,
  Bot,
  BarChart3,
  Crown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Sun,
  Moon,
  Settings,
  Eye,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { ROUTES } from '@/constants/routes';
import { NotificationDropdown } from './NotificationDropdown';

const sidebarLinks = [
  { label: 'Dashboard', to: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'My Exams', to: ROUTES.EXAMS, icon: BookOpen },
  { label: 'MCQ Practice', to: ROUTES.PRACTICE, icon: Target },
  { label: 'AI Tutor', to: ROUTES.AI_TUTOR, icon: Bot },
  { label: 'Analytics', to: ROUTES.ANALYTICS, icon: BarChart3 },
  { label: 'Premium', to: ROUTES.PREMIUM, icon: Crown },
  { label: 'Profile', to: ROUTES.PROFILE, icon: User },
  { label: 'Settings', to: ROUTES.SETTINGS, icon: Settings },
];

interface SidebarInnerProps {
  collapsed: boolean;
  onNavigate: () => void;
}

function SidebarInner({ collapsed, onNavigate }: SidebarInnerProps) {
  const location = useLocation();

  const { logout } = useAuth();
  const isActive = (path: string) =>
    path === ROUTES.EXAMS
      ? location.pathname.startsWith(path)
      : location.pathname === path;

  return (
    <>
      <div className="flex h-16 items-center justify-between border-b border-[rgb(var(--color-border))] px-4">
        <Link
          to={ROUTES.HOME}
          onClick={onNavigate}
          className="flex items-center gap-2 overflow-hidden"
        >
          <GraduationCap size={24} className="shrink-0 text-primary-500" />
          {!collapsed && (
            <span className="text-lg font-bold font-heading text-white">
              MeritPrep
            </span>
          )}
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
                active
                  ? 'bg-primary-50 text-primary-600 dark:bg-white dark:text-primary-700'
                  : 'text-white hover:bg-[#ffffff50] hover:text-white'
              )}
              title={collapsed ? link.label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border- p-3">
        <button
          onClick={() => {
            logout();
            onNavigate();
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-danger-50 hover:text-danger-600"
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );
}

interface SidebarWrapperProps {
  collapsed: boolean;
  className?: string;
  children: ReactNode;
}

function SidebarWrapper({
  collapsed,
  className,
  children,
}: SidebarWrapperProps) {
  return (
    <aside
      className={cn(
        'flex flex-col border-r border-[#221f4a] bg-[#221f4a] transition-all duration-300',
        collapsed ? 'w-[68px]' : 'w-64',
        className
      )}
    >
      {children}
    </aside>
  );
}

export function DashboardLayout({ children }: { children?: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const admin = user?.role === 'admin';

  return (
    <div className="flex h-screen overflow-hidden ">
      <SidebarWrapper collapsed={collapsed} className="hidden lg:flex">
        <SidebarInner collapsed={collapsed} onNavigate={() => {}} />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden border-t border-[rgb(var(--color-border))] p-2 text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-elevated))] lg:block"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <ChevronRight size={18} className="mx-auto" />
          ) : (
            <ChevronLeft size={18} className="mx-auto" />
          )}
        </button>
      </SidebarWrapper>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <SidebarWrapper
            collapsed={false}
            className="absolute left-0 top-0 h-full"
          >
            <div className="flex h-16 items-center justify-between border-b border-[rgb(var(--color-border))] px-4">
              <Link
                to={ROUTES.DASHBOARD}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2"
              >
                <GraduationCap size={24} className="text-primary-500" />
                <span className="text-lg font-bold font-heading text-[rgb(var(--color-text-primary))]">
                  MeritPrep
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-1 text-[rgb(var(--color-text-secondary))]"
              >
                <X size={18} />
              </button>
            </div>
            <SidebarInner
              collapsed={false}
              onNavigate={() => setMobileOpen(false)}
            />
          </SidebarWrapper>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-[rgb(var(--color-border))] bg-[#221f4a] px-4 sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-2 text-[rgb(var(--color-text-secondary))] lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <div>
              {admin && (
                <button
                  onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
                  className="hidden items-center gap-2 rounded-lg shadow-lg bg-[#5c66ab] text-white px-3 py-1.5 text-sm font-medium text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-[rgb(var(--color-surface-elevated))] hover:text-[rgb(var(--color-text-primary))] sm:flex"
                >
                  <Eye size={16} />
                  Switch to Admin Dashboard
                </button>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="rounded-md p-2 text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-[rgb(var(--color-surface-elevated))]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <NotificationDropdown />

            <div className="flex items-center gap-3 border-l border-[rgb(var(--color-border))] pl-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-white">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-white">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main
          className="flex-1 overflow-y-auto p-4 sm:p-6 dark:bg-[#141131]"
          data-lenis-prevent
        >
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
