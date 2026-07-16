import { useState } from 'react';
import { Search, Bell, Moon, Menu, ChevronDown, Command } from 'lucide-react';
import { useLocation, NavLink } from 'react-router-dom';

interface TopHeaderProps {
  onMobileMenuOpen: () => void;
}

const PATH_NAMES: Record<string, string> = {
  overview: 'Dashboard Overview',
  'my-learning': 'My Learning',
  practice: 'Practice MCQs',
  'mock-tests': 'Mock Tests',
  'study-planner': 'Study Planner',
  leaderboard: 'Leaderboard',
  community: 'Community',
  analytics: 'Analytics',
  profile: 'Profile',
  settings: 'Settings',
  help: 'Help Center',
};

export const TopHeader = ({ onMobileMenuOpen }: TopHeaderProps) => {
  const location = useLocation();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const pathKey = location.pathname.split('/').filter(Boolean).pop() || 'overview';
  const pageName = PATH_NAMES[pathKey] || pathKey;

  const NOTIFICATIONS = [
    { title: 'FPSC Inspector result published', time: '2m ago', unread: true },
    { title: 'Daily Quiz is now available!', time: '1h ago', unread: true },
    { title: 'New CSS mock test added', time: '3h ago', unread: false },
  ];

  return (
    <header className="h-16 bg-card/80 border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 backdrop-blur-lg">
      {/* Left: Mobile menu + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuOpen}
          className="p-2 text-secondary/60 hover:bg-secondary/10 rounded-lg transition-colors md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 text-xs text-secondary/50">
          <span>Dashboard</span>
          <span>/</span>
          <span className="text-secondary font-medium">{pageName}</span>
        </div>
        <h1 className="text-base font-semibold text-secondary sm:hidden">{pageName}</h1>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-sm px-4 hidden md:flex">
        <button className="w-full flex items-center gap-2 bg-secondary/5 border border-border/50 rounded-xl px-3 py-2 text-sm text-secondary/50 hover:border-primary/40 transition-colors">
          <Search className="w-3.5 h-3.5" />
          <span className="flex-1 text-left text-xs">Search everything...</span>
          <div className="flex items-center gap-0.5 bg-secondary/10 rounded px-1.5 py-0.5">
            <Command className="w-3 h-3" />
            <span className="text-xs">K</span>
          </div>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button className="p-2 text-secondary/60 hover:bg-secondary/10 rounded-lg transition-colors hidden sm:flex">
          <Moon className="w-[18px] h-[18px]" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifs(n => !n); setShowProfile(false); }}
            className="relative p-2 text-secondary/60 hover:bg-secondary/10 rounded-lg transition-colors"
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-danger" />
            </span>
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-card rounded-2xl shadow-xl border border-border/50 overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                <h4 className="font-semibold text-secondary text-sm">Notifications</h4>
                <button className="text-xs text-primary hover:underline">Mark all read</button>
              </div>
              <div className="divide-y divide-border/30">
                {NOTIFICATIONS.map((n, i) => (
                  <div key={i} className={`flex items-start gap-3 px-4 py-3 hover:bg-secondary/5 transition-colors ${n.unread ? 'bg-primary/5' : ''}`}>
                    {n.unread && <span className="mt-1.5 w-2 h-2 bg-primary rounded-full flex-shrink-0" />}
                    {!n.unread && <span className="mt-1.5 w-2 h-2 bg-transparent rounded-full flex-shrink-0" />}
                    <div>
                      <p className="text-xs text-secondary font-medium">{n.title}</p>
                      <p className="text-xs text-secondary/50 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-border mx-1 hidden sm:block" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(p => !p); setShowNotifs(false); }}
            className="flex items-center gap-2 hover:bg-secondary/5 rounded-xl px-2 py-1.5 transition-colors"
          >
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" className="w-7 h-7 rounded-lg object-cover" alt="" />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-secondary leading-tight">Ahmad Khan</p>
              <p className="text-xs text-secondary/50">Premium</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-secondary/50 hidden sm:block" />
          </button>
          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-2xl shadow-xl border border-border/50 overflow-hidden z-50">
              {[
                { label: 'Profile', to: '/dashboard/profile' },
                { label: 'Settings', to: '/dashboard/settings' },
                { label: 'Help', to: '/dashboard/help' },
              ].map(item => (
                <NavLink key={item.label} to={item.to} onClick={() => setShowProfile(false)} className="block px-4 py-2.5 text-sm text-secondary/70 hover:bg-secondary/5 hover:text-secondary transition-colors">
                  {item.label}
                </NavLink>
              ))}
              <div className="border-t border-border/50 mt-1" />
              <button className="w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-danger/5 transition-colors">Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
