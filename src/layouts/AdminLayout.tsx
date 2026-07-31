import { useState, type ReactNode } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Coins,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Sun,
  Moon,
  Eye,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { ROUTES } from '@/constants/routes';

const adminSidebarLinks = [
  {
    label: 'Dashboard Overview',
    to: ROUTES.ADMIN_DASHBOARD,
    icon: LayoutDashboard,
  },
  { label: 'User Management', to: ROUTES.ADMIN_USERS, icon: Users },
  { label: 'Exam & Question Bank', to: ROUTES.ADMIN_EXAMS, icon: BookOpen },
  { label: 'Token Settings', to: ROUTES.ADMIN_AI_TOKENS, icon: Coins },
];

interface SidebarInnerProps {
  collapsed: boolean;
  onNavigate: () => void;
}

function SidebarInner({ collapsed, onNavigate }: SidebarInnerProps) {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    if (path === ROUTES.ADMIN_DASHBOARD) {
      return location.pathname === ROUTES.ADMIN_DASHBOARD;
    }
    return location.pathname.startsWith(path);
  };

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
            <span className="text-lg font-bold font-heading text-[rgb(var(--color-text-primary))]">
              MeritPrep
            </span>
          )}
        </Link>
        {!collapsed && (
          <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-700 dark:bg-primary-900 dark:text-primary-300">
            Admin
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {adminSidebarLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400'
                  : 'text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-elevated))] hover:text-[rgb(var(--color-text-primary))]'
              )}
              title={collapsed ? link.label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[rgb(var(--color-border))] p-3">
        <button
          onClick={() => {
            logout();
            onNavigate();
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-danger-50 hover:text-danger-600 dark:hover:bg-danger-950"
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
        'flex flex-col border-r border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] transition-all duration-300',
        collapsed ? 'w-[68px]' : 'w-64',
        className
      )}
    >
      {children}
    </aside>
  );
}

export function AdminLayout({ children }: { children?: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden bg-[hsl(var(--background))] bg-slate-400/30">
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
                to={ROUTES.ADMIN_DASHBOARD}
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
        <header className="flex h-16 items-center justify-between border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-md p-2 text-[rgb(var(--color-text-secondary))] lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            <div className="hidden items-center gap-4 sm:flex">
              <div className="flex items-center gap-1.5 rounded-lg bg-accent-50 px-2.5 py-1 text-xs font-medium text-accent-700 dark:bg-accent-950 dark:text-accent-300">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                142 Online
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                <BookOpen size={12} />8 Active Exams
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                <Settings size={12} />3 Pending Reviews
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="hidden items-center gap-2 rounded-lg border border-[rgb(var(--color-border))] px-3 py-1.5 text-sm font-medium text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-[rgb(var(--color-surface-elevated))] hover:text-[rgb(var(--color-text-primary))] sm:flex"
            >
              <Eye size={16} />
              Switch to Student View
            </button>

            <button
              onClick={toggleTheme}
              className="rounded-md p-2 text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-[rgb(var(--color-surface-elevated))]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="flex items-center gap-3 border-l border-[rgb(var(--color-border))] pl-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-xs text-[rgb(var(--color-text-muted))]">
                  {user?.role === 'super_admin'
                    ? 'Super Admin'
                    : 'Content Manager'}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
