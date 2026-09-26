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
  FolderTree,
  Map,
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
  { label: 'Syllabus Taxonomy', to: ROUTES.ADMIN_TAXONOMY, icon: FolderTree },
  { label: 'Syllabus & Roadmap', to: ROUTES.ADMIN_SYLLABUS, icon: Map },
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
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
        <Link
          to={ROUTES.HOME}
          onClick={onNavigate}
          className="flex items-center gap-2 overflow-hidden"
        >
          <GraduationCap
            size={24}
            className="shrink-0 text-indigo-600 dark:text-indigo-400"
          />
          {!collapsed && (
            <span className="font-heading text-lg font-bold text-slate-900 dark:text-white">
              MeritPrep
            </span>
          )}
        </Link>
        {!collapsed && (
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
            Admin
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4 bg-[#221f4a] text-white">
        {adminSidebarLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm  transition-colors',
                active
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-600/15 dark:text-indigo-400 border-r-4 border-blue-600 transition-all duration-75'
                  : ' hover:bg-[#ffffff48] hover:text-white dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100'
              )}
              title={collapsed ? link.label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
        <button
          onClick={() => {
            logout();
            onNavigate();
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
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
        'flex flex-col border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-900',
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
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <SidebarWrapper collapsed={collapsed} className="hidden lg:flex">
        <SidebarInner collapsed={collapsed} onNavigate={() => {}} />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden border-t border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 lg:block"
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
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm dark:bg-black/70"
            onClick={() => setMobileOpen(false)}
          />
          <SidebarWrapper
            collapsed={false}
            className="absolute left-0 top-0 h-full shadow-xl"
          >
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
              <Link
                to={ROUTES.ADMIN_DASHBOARD}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2"
              >
                <GraduationCap
                  size={24}
                  className="text-indigo-600 dark:text-indigo-400"
                />
                <span className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                  MeritPrep
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
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
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                142 Online
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                <BookOpen size={12} />8 Active Exams
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                <Settings size={12} />3 Pending Reviews
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="hidden items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 sm:flex"
            >
              <Eye size={16} />
              Switch to Student View
            </button>

            <button
              onClick={toggleTheme}
              className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-3 dark:border-slate-800">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.role === 'admin'
                    ? 'Admin'
                    : user?.role === 'moderator'
                      ? 'Moderator'
                      : 'User'}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main
          className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 dark:bg-slate-950"
          data-lenis-prevent
        >
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
