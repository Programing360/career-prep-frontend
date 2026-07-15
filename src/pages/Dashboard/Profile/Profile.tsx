import { useState } from 'react';
import { Camera, Edit2, Award, BookOpen, Target, Clock, Star, Download, Shield } from 'lucide-react';

const ACHIEVEMENTS = [
  { icon: '🔥', name: '12-Day Streak', desc: 'Studied for 12 days in a row', earned: true },
  { icon: '🏆', name: 'Top Performer', desc: 'Ranked in top 100 globally', earned: true },
  { icon: '⚡', name: 'Speed Reader', desc: 'Completed a test in record time', earned: true },
  { icon: '📚', name: '1000 MCQs', desc: 'Solved 1000+ practice questions', earned: true },
  { icon: '🎯', name: 'Perfect Score', desc: 'Score 100% on any mock test', earned: false },
  { icon: '👑', name: '30-Day Streak', desc: 'Study for 30 consecutive days', earned: false },
];

const STATS = [
  { label: 'Study Hours', value: '142h', icon: Clock },
  { label: 'MCQs Solved', value: '2,840', icon: Target },
  { label: 'Tests Taken', value: '24', icon: BookOpen },
  { label: 'Rank', value: '#42', icon: Star },
];

const CERTS = [
  { name: 'CSS Preparation Pro', date: 'Jul 2026', level: 'Advanced' },
  { name: 'NTS Expert', date: 'Jun 2026', level: 'Intermediate' },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState('overview');
  const tabs = ['overview', 'achievements', 'certificates', 'activity'];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Cover Banner */}
      <div className="relative">
        <div className="h-40 rounded-2xl bg-gradient-to-r from-primary via-accent to-primary/60 overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="absolute -bottom-12 left-6 flex items-end gap-4">
          <div className="relative">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Ahmad Khan" className="w-24 h-24 rounded-2xl border-4 border-card object-cover shadow-lg" />
            <button className="absolute -bottom-1 -right-1 p-1.5 bg-primary text-white rounded-full shadow-md hover:bg-primary/90 transition-colors">
              <Camera className="w-3 h-3" />
            </button>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <button className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-white/30 px-3 py-1.5 rounded-xl text-sm font-medium text-secondary hover:bg-card transition-colors shadow-sm">
            <Edit2 className="w-3.5 h-3.5" />Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-10 pl-2">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-bold text-secondary">Ahmad Khan</h2>
              <span className="bg-warning/10 text-warning text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Shield className="w-3 h-3" />Premium
              </span>
            </div>
            <p className="text-secondary/60 mt-1 text-sm">CSS Aspirant · Punjab, Pakistan</p>
            <p className="text-secondary/70 text-sm mt-2 max-w-md">
              Passionate about public service. Preparing for CSS 2027. Love reading, history, and current affairs.
            </p>
          </div>
          <div className="flex gap-6 text-center">
            <div><p className="text-xl font-bold text-secondary">2,840</p><p className="text-xs text-secondary/50">MCQs</p></div>
            <div><p className="text-xl font-bold text-secondary">24</p><p className="text-xs text-secondary/50">Tests</p></div>
            <div><p className="text-xl font-bold text-secondary">#42</p><p className="text-xs text-secondary/50">Rank</p></div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <div key={i} className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow text-center">
            <s.icon className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xl font-bold text-secondary">{s.value}</p>
            <p className="text-xs text-secondary/60">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary/5 rounded-xl p-1 w-fit">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-card shadow-sm text-primary' : 'text-secondary/60 hover:text-secondary'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map((a, i) => (
            <div key={i} className={`bg-card border rounded-2xl p-4 flex items-start gap-4 transition-all ${a.earned ? 'border-warning/30 bg-warning/5' : 'border-border/50 opacity-60 grayscale'}`}>
              <span className="text-3xl">{a.icon}</span>
              <div>
                <p className="font-semibold text-secondary">{a.name}</p>
                <p className="text-xs text-secondary/60 mt-0.5">{a.desc}</p>
                {a.earned && <span className="text-xs text-success font-medium mt-1 inline-block">✓ Earned</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'certificates' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CERTS.map((c, i) => (
            <div key={i} className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-2xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-secondary">{c.name}</p>
                  <p className="text-sm text-secondary/60">{c.level} · {c.date}</p>
                </div>
              </div>
              <button className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-secondary mb-3">Recent Activity</h3>
            <div className="space-y-3">
              {['Completed FPSC Mock Test', 'Solved 50 English MCQs', 'Read Current Affairs', 'Achieved 12-Day Streak'].map((a, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-secondary/70">{a}</span>
                  <span className="text-secondary/40 text-xs ml-auto">{i + 1}d ago</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-secondary mb-3">Subject Progress</h3>
            <div className="space-y-3">
              {[
                { name: 'English', progress: 85 },
                { name: 'Pakistan Affairs', progress: 72 },
                { name: 'Islamic Studies', progress: 90 },
                { name: 'General Science', progress: 58 },
              ].map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-secondary/70">{s.name}</span>
                    <span className="font-medium text-secondary">{s.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary/10 rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: `${s.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
