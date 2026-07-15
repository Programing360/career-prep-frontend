import { useState } from 'react';
import { ChevronRight, Play, BarChart2, Search } from 'lucide-react';

const TESTS = [
  { id: 1, name: 'CSS Screening Test 2026', subject: 'CSS', questions: 100, duration: 120, difficulty: 'Hard', attempts: 2420, status: 'available', score: null },
  { id: 2, name: 'FPSC Inspector Test', subject: 'FPSC', questions: 80, duration: 90, difficulty: 'Medium', attempts: 1890, status: 'completed', score: 78 },
  { id: 3, name: 'NTS GAT General', subject: 'NTS', questions: 60, duration: 60, difficulty: 'Easy', attempts: 3200, status: 'available', score: null },
  { id: 4, name: 'PPSC Lecturer English', subject: 'PPSC', questions: 100, duration: 120, difficulty: 'Hard', attempts: 980, status: 'completed', score: 82 },
  { id: 5, name: 'MDCAT Biology Mock', subject: 'MDCAT', questions: 50, duration: 45, difficulty: 'Medium', attempts: 1540, status: 'available', score: null },
  { id: 6, name: 'PMS Prelims 2026', subject: 'PMS', questions: 120, duration: 150, difficulty: 'Hard', attempts: 670, status: 'available', score: null },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: 'bg-success/10 text-success',
  Medium: 'bg-warning/10 text-warning',
  Hard: 'bg-danger/10 text-danger',
};

const RESULTS = [
  { test: 'FPSC Inspector Test', date: 'Jul 10, 2026', score: 78, accuracy: '78%', rank: '#124', time: '88 min', status: 'Pass' },
  { test: 'PPSC Lecturer English', date: 'Jul 5, 2026', score: 82, accuracy: '82%', rank: '#89', time: '110 min', status: 'Pass' },
];

export default function MockTests() {
  const [activeTab, setActiveTab] = useState<'available' | 'results'>('available');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-secondary">Mock Tests</h2>
          <p className="text-secondary/70 mt-1">Simulate real exam conditions with full-length mock tests.</p>
        </div>
        <div className="flex gap-2 bg-secondary/5 rounded-xl p-1">
          {(['available', 'results'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-card shadow-sm text-primary' : 'text-secondary/60 hover:text-secondary'}`}>
              {tab === 'available' ? 'Available Tests' : 'My Results'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'available' ? (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="w-4 h-4 text-secondary/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search tests..." className="w-full bg-card border border-border/50 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-secondary" />
            </div>
            <select className="bg-card border border-border/50 rounded-xl px-3 py-2 text-sm text-secondary focus:outline-none focus:ring-1 focus:ring-primary/50">
              <option>All Exams</option>
              <option>CSS</option><option>FPSC</option><option>NTS</option><option>PPSC</option>
            </select>
            <select className="bg-card border border-border/50 rounded-xl px-3 py-2 text-sm text-secondary focus:outline-none focus:ring-1 focus:ring-primary/50">
              <option>All Difficulty</option>
              <option>Easy</option><option>Medium</option><option>Hard</option>
            </select>
          </div>

          {/* Test Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {TESTS.map(test => (
              <div key={test.id} className={`bg-card border rounded-2xl p-5 hover:shadow-md transition-all flex flex-col gap-4 ${test.status === 'completed' ? 'border-success/30 bg-success/5' : 'border-border/50 hover:border-primary/30'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{test.subject}</span>
                    <h4 className="font-semibold text-secondary mt-2 text-sm leading-snug">{test.name}</h4>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${DIFFICULTY_COLORS[test.difficulty]}`}>{test.difficulty}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-secondary/5 rounded-lg p-2">
                    <p className="text-sm font-bold text-secondary">{test.questions}</p>
                    <p className="text-xs text-secondary/50">Questions</p>
                  </div>
                  <div className="bg-secondary/5 rounded-lg p-2">
                    <p className="text-sm font-bold text-secondary">{test.duration}m</p>
                    <p className="text-xs text-secondary/50">Duration</p>
                  </div>
                  <div className="bg-secondary/5 rounded-lg p-2">
                    <p className="text-sm font-bold text-secondary">{(test.attempts / 1000).toFixed(1)}k</p>
                    <p className="text-xs text-secondary/50">Attempts</p>
                  </div>
                </div>
                {test.status === 'completed' ? (
                  <div className="flex gap-2 mt-auto">
                    <button className="flex-1 py-2 rounded-xl bg-secondary/5 text-secondary/70 text-sm font-medium hover:bg-secondary/10 transition-colors flex items-center justify-center gap-1.5">
                      <BarChart2 className="w-4 h-4" />Analysis
                    </button>
                    <div className="flex-1 py-2 rounded-xl bg-success/10 text-success text-sm font-bold text-center flex items-center justify-center">
                      Score: {test.score}%
                    </div>
                  </div>
                ) : (
                  <button className="w-full mt-auto py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <Play className="w-4 h-4 fill-white" />Start Test
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border/50">
            <h3 className="font-semibold text-secondary">Test History & Results</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/5 text-secondary/60 uppercase text-xs">
                <tr>
                  {['Test Name', 'Date', 'Score', 'Accuracy', 'Rank', 'Time', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {RESULTS.map((r, i) => (
                  <tr key={i} className="hover:bg-secondary/5 transition-colors">
                    <td className="px-4 py-3 font-medium text-secondary">{r.test}</td>
                    <td className="px-4 py-3 text-secondary/60">{r.date}</td>
                    <td className="px-4 py-3"><span className="font-bold text-secondary">{r.score}%</span></td>
                    <td className="px-4 py-3 text-secondary/70">{r.accuracy}</td>
                    <td className="px-4 py-3 text-primary font-medium">{r.rank}</td>
                    <td className="px-4 py-3 text-secondary/70">{r.time}</td>
                    <td className="px-4 py-3"><span className="bg-success/10 text-success text-xs px-2 py-0.5 rounded-full font-medium">{r.status}</span></td>
                    <td className="px-4 py-3">
                      <button className="flex items-center gap-1 text-primary hover:underline text-xs font-medium">
                        Analysis <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
