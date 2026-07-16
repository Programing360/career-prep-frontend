import { useState, useEffect, useRef } from 'react';
import { Outlet, Navigate, Link, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/Auth/AuthContext';

export const ProtectedRoute = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !user.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-card/80 border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 text-secondary/60 hover:bg-secondary/10 rounded-lg transition-colors md:hidden"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h1 className="text-base font-semibold text-secondary">
              {user?.name ? `Welcome, ${user.name.split(' ')[0]}` : 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3" ref={menuRef}>
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(m => !m)}
                className="flex items-center gap-2 hover:bg-secondary/5 rounded-xl px-2 py-1.5 transition-colors"
              >
                <img
                  src={user?.avatar || 'https://i.pravatar.cc/150?u=default'}
                  alt={user?.name || 'User'}
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-secondary leading-tight">{user?.name}</p>
                  <p className="text-xs text-secondary/50">{user?.email}</p>
                </div>
                <svg className="w-3.5 h-3.5 text-secondary/50 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-card rounded-2xl shadow-xl border border-border/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-border/50">
                    <p className="text-sm font-semibold text-secondary">{user?.name}</p>
                    <p className="text-xs text-secondary/50">{user?.email}</p>
                  </div>
                  <div className="py-1.5">
                    {[
                      { label: 'Dashboard', path: '/dashboard/overview', icon: '📊' },
                      { label: 'My Profile', path: '/dashboard/profile', icon: '👤' },
                      { label: 'Settings', path: '/dashboard/settings', icon: '⚙️' },
                      { label: 'Study Planner', path: '/dashboard/study-planner', icon: '📅' },
                      { label: 'Leaderboard', path: '/dashboard/leaderboard', icon: '🏆' },
                      { label: 'Help Center', path: '/dashboard/help', icon: '❓' },
                    ].map(item => (
                      <Link
                        key={item.label}
                        to={item.path}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-secondary/70 hover:bg-secondary/5 hover:text-secondary transition-colors"
                      >
                        <span>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-border/50 py-1.5">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-danger hover:bg-danger/5 transition-colors"
                    >
                      <span>🚪</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
