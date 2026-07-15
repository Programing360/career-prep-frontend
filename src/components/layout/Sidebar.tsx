import { Link, NavLink } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, PenTool, ClipboardList, Calendar,
  Award, Users, BarChart2, Settings, HelpCircle, LogOut, X,
  ChevronLeft, ChevronRight, Zap, Shield
} from 'lucide-react';
import clsx from 'clsx';

const MENU_ITEMS = [
  { name: 'Overview', path: '/dashboard/overview', icon: LayoutDashboard },
  { name: 'My Learning', path: '/dashboard/my-learning', icon: BookOpen },
  { name: 'Practice MCQs', path: '/dashboard/practice', icon: PenTool },
  { name: 'Mock Tests', path: '/dashboard/mock-tests', icon: ClipboardList },
  { name: 'Study Planner', path: '/dashboard/study-planner', icon: Calendar },
  { name: 'Leaderboard', path: '/dashboard/leaderboard', icon: Award },
  { name: 'Community', path: '/dashboard/community', icon: Users },
  { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart2 },
];

const BOTTOM_MENU_ITEMS = [
  { name: 'Profile', path: '/dashboard/profile', icon: Settings },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  { name: 'Help Center', path: '/dashboard/help', icon: HelpCircle },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar = ({ collapsed = false, onToggle, mobileOpen, onMobileClose }: SidebarProps) => {
  const navLink = (item: typeof MENU_ITEMS[0]) => (
    <NavLink
      key={item.name}
      to={item.path}
      onClick={onMobileClose}
      title={collapsed ? item.name : undefined}
      className={({ isActive }) => clsx(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
        collapsed ? "justify-center" : "",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-secondary/60 hover:bg-secondary/5 hover:text-secondary"
      )}
    >
      <item.icon className="w-5 h-5 flex-shrink-0" />
      {!collapsed && <span>{item.name}</span>}
      {collapsed && (
        <span className="absolute left-full ml-2 px-2 py-1 bg-secondary text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap transition-opacity z-50">
          {item.name}
        </span>
      )}
    </NavLink>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full bg-card border-r border-border overflow-hidden">
      {/* Logo */}
      <div className={clsx("h-16 flex items-center border-b border-border/50 flex-shrink-0", collapsed ? "justify-center px-4" : "px-5 justify-between")}>
        {!collapsed && (
          <Link to={'/'}>
            <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-secondary text-base">PrepMaster<span className="text-primary">AI</span></span>
          </div>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
        )}
        {onToggle && (
          <button onClick={onToggle} className="p-1 hover:bg-secondary/10 rounded-lg transition-colors text-secondary/50 hover:text-secondary hidden md:flex">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
        {onMobileClose && (
          <button onClick={onMobileClose} className="p-1 hover:bg-secondary/10 rounded-lg transition-colors text-secondary/50 md:hidden">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        <p className={clsx("text-xs font-semibold text-secondary/40 uppercase tracking-widest mb-2", collapsed ? "hidden" : "px-3")}>Main</p>
        {MENU_ITEMS.map(navLink)}

        <div className="h-px bg-border my-3 mx-2" />

        <p className={clsx("text-xs font-semibold text-secondary/40 uppercase tracking-widest mb-2", collapsed ? "hidden" : "px-3")}>Account</p>
        {BOTTOM_MENU_ITEMS.map(navLink)}
      </nav>

      {/* User Card */}
      {!collapsed && (
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/5 transition-colors cursor-pointer">
            <div className="relative flex-shrink-0">
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" className="w-9 h-9 rounded-xl object-cover" alt="Ahmad Khan" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-card rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-secondary flex items-center gap-1.5">
                Ahmad Khan
                <span className="text-xs bg-warning/10 text-warning px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                  <Shield className="w-2.5 h-2.5" />Pro
                </span>
              </p>
              <p className="text-xs text-secondary/50">⚡ 9,240 XP · Rank #42</p>
            </div>
          </div>
          <div className="mt-1">
            <div className="flex justify-between text-xs text-secondary/50 mb-1 px-1">
              <span>Level 8</span>
              <span>68% to Lv.9</span>
            </div>
            <div className="w-full bg-secondary/10 rounded-full h-1">
              <div className="bg-gradient-to-r from-primary to-accent h-1 rounded-full" style={{ width: '68%' }} />
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 py-2 mt-3 text-sm text-danger hover:bg-danger/10 rounded-xl transition-colors font-medium">
            <LogOut className="w-4 h-4" />Logout
          </button>
        </div>
      )}

      {collapsed && (
        <div className="p-3 border-t border-border flex flex-col items-center gap-2">
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" className="w-8 h-8 rounded-xl object-cover" alt="" />
          <button className="text-danger hover:bg-danger/10 p-1.5 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={clsx(
        "hidden md:flex flex-col h-full flex-shrink-0 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}>
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="absolute left-0 top-0 h-full w-64 z-10">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
