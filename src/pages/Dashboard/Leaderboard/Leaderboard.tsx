import { useState } from 'react';
import { TrendingUp, Search } from 'lucide-react';

const TOP_STUDENTS = [
  { rank: 1, name: 'Ayesha Siddiqui', xp: 9850, badge: '🏆', exam: 'CSS', avatar: 'https://i.pravatar.cc/150?u=1' },
  { rank: 2, name: 'Bilal Ahmed', xp: 8720, badge: '🥈', exam: 'FPSC', avatar: 'https://i.pravatar.cc/150?u=2' },
  { rank: 3, name: 'Fatima Malik', xp: 7640, badge: '🥉', exam: 'NTS', avatar: 'https://i.pravatar.cc/150?u=3' },
  { rank: 4, name: 'Ahmad Khan', xp: 6910, badge: '⭐', exam: 'PPSC', avatar: 'https://i.pravatar.cc/150?u=4' },
  { rank: 5, name: 'Sara Qureshi', xp: 6420, badge: '⭐', exam: 'CSS', avatar: 'https://i.pravatar.cc/150?u=5' },
  { rank: 6, name: 'Usman Tariq', xp: 5980, badge: '⭐', exam: 'MDCAT', avatar: 'https://i.pravatar.cc/150?u=6' },
  { rank: 7, name: 'Nadia Hussain', xp: 5210, badge: '⭐', exam: 'FIA', avatar: 'https://i.pravatar.cc/150?u=7' },
];

const PODIUM_HEIGHTS = ['h-32', 'h-24', 'h-20'];

const TABS = ['Global', 'Weekly', 'Monthly', 'Subject'] as const;

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<string>('Global');
  const top3 = TOP_STUDENTS.slice(0, 3);
  const rest = TOP_STUDENTS.slice(3);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-secondary">Leaderboard</h2>
          <p className="text-secondary/70 mt-1">See how you rank among top exam preparers in Pakistan.</p>
        </div>
        <div className="flex gap-2">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab ? 'bg-primary text-white' : 'bg-secondary/5 text-secondary/70 hover:bg-secondary/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-warning/5 border border-border/50 rounded-3xl p-8">
        <div className="flex items-end justify-center gap-6 mb-8">
          <div className="flex flex-col items-center gap-2">
            <img src={top3[1].avatar} alt={top3[1].name} className="w-16 h-16 rounded-full border-4 border-[#94A3B8] object-cover" />
            <p className="font-semibold text-secondary text-sm">{top3[1].name}</p>
            <p className="text-xs text-secondary/60">{top3[1].xp.toLocaleString()} XP</p>
            <div className={`w-20 ${PODIUM_HEIGHTS[1]} bg-[#94A3B8]/20 border-2 border-[#94A3B8] rounded-t-xl flex items-center justify-center`}>
              <span className="text-2xl">🥈</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <img src={top3[0].avatar} alt={top3[0].name} className="w-20 h-20 rounded-full border-4 border-[#F59E0B] object-cover" />
              <Crown className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 text-warning" />
            </div>
            <p className="font-bold text-secondary">{top3[0].name}</p>
            <p className="text-xs text-secondary/60">{top3[0].xp.toLocaleString()} XP</p>
            <div className={`w-20 ${PODIUM_HEIGHTS[0]} bg-[#F59E0B]/20 border-2 border-[#F59E0B] rounded-t-xl flex items-center justify-center`}>
              <span className="text-2xl">🏆</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src={top3[2].avatar} alt={top3[2].name} className="w-16 h-16 rounded-full border-4 border-[#CD7C2F] object-cover" />
            <p className="font-semibold text-secondary text-sm">{top3[2].name}</p>
            <p className="text-xs text-secondary/60">{top3[2].xp.toLocaleString()} XP</p>
            <div className={`w-20 ${PODIUM_HEIGHTS[2]} bg-[#CD7C2F]/20 border-2 border-[#CD7C2F] rounded-t-xl flex items-center justify-center`}>
              <span className="text-2xl">🥉</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h3 className="font-semibold text-secondary">Rankings</h3>
          <div className="relative">
            <Search className="w-4 h-4 text-secondary/50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search students..." className="bg-secondary/5 rounded-xl pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-secondary" />
          </div>
        </div>
        <div className="divide-y divide-border/50">
          {rest.map((student) => (
            <div key={student.rank} className={`flex items-center gap-4 px-6 py-4 hover:bg-secondary/5 transition-colors ${student.rank === 4 ? 'bg-primary/5 border-l-2 border-primary' : ''}`}>
              <span className="w-8 text-center font-bold text-secondary/50">#{student.rank}</span>
              <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-secondary">{student.name} {student.rank === 4 && <span className="text-xs text-primary font-medium ml-1">(You)</span>}</p>
                <p className="text-sm text-secondary/60">{student.exam}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-secondary">{student.xp.toLocaleString()} XP</p>
                <div className="flex items-center gap-1 justify-end mt-0.5">
                  <TrendingUp className="w-3 h-3 text-success" />
                  <span className="text-xs text-success">+120 this week</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Crown({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.219 2.568a1 1 0 0 1 1.562 0l2.58 3.096 3.52-1.76a1 1 0 0 1 1.436 1.124l-2 10A1 1 0 0 1 17.34 16H6.66a1 1 0 0 1-.977-.972l-2-10a1 1 0 0 1 1.437-1.124l3.52 1.76 2.58-3.096ZM6 18a1 1 0 0 0 0 2h12a1 1 0 0 0 0-2H6Z" />
    </svg>
  );
}
