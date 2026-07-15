import { useState } from 'react';
import { User, Lock, Bell, Palette, Globe, Shield, Trash2, ChevronRight, Moon, Sun } from 'lucide-react';

const SETTINGS_NAV = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security & Password', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'language', label: 'Language & Region', icon: Globe },
  { id: 'privacy', label: 'Privacy & Safety', icon: Shield },
  { id: 'danger', label: 'Danger Zone', icon: Trash2 },
];

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-primary' : 'bg-secondary/20'}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-5' : ''}`} />
    </button>
  );
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile');
  const [notifs, setNotifs] = useState({ email: true, push: true, sms: false, quiz: true, exam: true, community: false });
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-secondary">Settings</h2>
        <p className="text-secondary/70 mt-1">Manage your account preferences and configurations.</p>
      </div>

      <div className="flex gap-6">
        {/* Settings Nav */}
        <aside className="w-56 flex-shrink-0 hidden md:block">
          <nav className="space-y-1">
            {SETTINGS_NAV.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${activeSection === item.id ? 'bg-primary/10 text-primary' : 'text-secondary/70 hover:bg-secondary/5 hover:text-secondary'} ${item.id === 'danger' ? 'text-danger hover:text-danger hover:bg-danger/5' : ''}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Settings Content */}
        <div className="flex-1 min-w-0">
          {activeSection === 'profile' && (
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="font-semibold text-secondary text-lg border-b border-border/50 pb-4">Profile Information</h3>
              <div className="flex items-center gap-4 pb-4 border-b border-border/50">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" className="w-16 h-16 rounded-xl object-cover" alt="" />
                <div>
                  <button className="text-sm text-primary font-medium hover:underline">Change Photo</button>
                  <p className="text-xs text-secondary/50 mt-1">JPG, PNG up to 5MB</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[['Full Name', 'Ahmad Khan'], ['Email', 'ahmad.khan@email.com'], ['Phone', '+92 300 1234567'], ['City', 'Lahore, Punjab']].map(([label, val]) => (
                  <div key={label}>
                    <label className="block text-xs font-medium text-secondary/60 mb-1.5 uppercase tracking-wide">{label}</label>
                    <input defaultValue={val} className="w-full bg-secondary/5 border border-border/50 rounded-xl px-3 py-2.5 text-sm text-secondary focus:outline-none focus:ring-1 focus:ring-primary/50" />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-secondary/60 mb-1.5 uppercase tracking-wide">Bio</label>
                  <textarea defaultValue="CSS Aspirant | Public Service | Punjab" rows={3} className="w-full bg-secondary/5 border border-border/50 rounded-xl px-3 py-2.5 text-sm text-secondary focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none" />
                </div>
              </div>
              <div className="flex justify-end">
                <button className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">Save Changes</button>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-semibold text-secondary text-lg border-b border-border/50 pb-4">Notification Preferences</h3>
              {[
                { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
                { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
                { key: 'sms', label: 'SMS Alerts', desc: 'Important alerts via SMS' },
                { key: 'quiz', label: 'Daily Quiz Reminder', desc: 'Remind me to take daily quiz' },
                { key: 'exam', label: 'Exam Reminders', desc: 'Upcoming exam countdown alerts' },
                { key: 'community', label: 'Community Replies', desc: 'When someone replies to my posts' },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
                  <div>
                    <p className="font-medium text-secondary text-sm">{n.label}</p>
                    <p className="text-xs text-secondary/50">{n.desc}</p>
                  </div>
                  <ToggleSwitch enabled={notifs[n.key as keyof typeof notifs]} onChange={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key as keyof typeof notifs] }))} />
                </div>
              ))}
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-semibold text-secondary text-lg border-b border-border/50 pb-4">Appearance</h3>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-secondary text-sm">Dark Mode</p>
                  <p className="text-xs text-secondary/50">Toggle between light and dark theme</p>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-secondary/50" />
                  <ToggleSwitch enabled={darkMode} onChange={() => setDarkMode(d => !d)} />
                  <Moon className="w-4 h-4 text-secondary/50" />
                </div>
              </div>
              <div className="py-3">
                <p className="font-medium text-secondary text-sm mb-3">Color Theme</p>
                <div className="flex gap-3">
                  {['#2563EB', '#10B981', '#8B5CF6', '#F59E0B'].map(c => (
                    <button key={c} className="w-8 h-8 rounded-full border-2 border-white shadow hover:scale-110 transition-transform" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'danger' && (
            <div className="bg-card border border-danger/30 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-danger text-lg border-b border-danger/20 pb-4">Danger Zone</h3>
              <div className="space-y-4 mt-4">
                <div className="flex items-center justify-between p-4 bg-danger/5 rounded-xl border border-danger/20">
                  <div>
                    <p className="font-medium text-secondary">Delete Account</p>
                    <p className="text-xs text-secondary/60 mt-0.5">Permanently delete your account and all data. This cannot be undone.</p>
                  </div>
                  <button className="px-4 py-2 bg-danger text-white rounded-xl text-sm font-medium hover:bg-danger/90 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          )}

          {!['profile', 'notifications', 'appearance', 'danger'].includes(activeSection) && (
            <div className="bg-card border border-border/50 rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-3">
                <ChevronRight className="w-6 h-6 text-secondary/40" />
              </div>
              <p className="font-medium text-secondary">Coming Soon</p>
              <p className="text-sm text-secondary/50 mt-1">This settings section is under construction.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
