import { BookOpen, Target, Flame, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', hours: 2 },
  { name: 'Tue', hours: 3 },
  { name: 'Wed', hours: 2.5 },
  { name: 'Thu', hours: 4 },
  { name: 'Fri', hours: 3.5 },
  { name: 'Sat', hours: 5 },
  { name: 'Sun', hours: 4.5 },
];

const STATS = [
  { title: "Study Hours", value: "24.5h", icon: BookOpen, color: "text-primary" },
  { title: "Completed MCQs", value: "1,240", icon: Target, color: "text-success" },
  { title: "Current Streak", value: "12 Days", icon: Flame, color: "text-warning" },
  { title: "Current Rank", value: "#42", icon: TrendingUp, color: "text-accent" },
];

export default function Overview() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-secondary">Good Morning 👋</h2>
          <p className="text-secondary/70 mt-1">"Success is not final, failure is not fatal: it is the courage to continue that counts."</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <div key={i} className="bg-card shadow-sm border border-border/50 hover:shadow-md transition-shadow rounded-2xl">
            <div className="flex flex-row items-center gap-4 p-4">
              <div className={`p-3 rounded-xl bg-secondary/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-secondary/60 font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-secondary">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 bg-card shadow-sm border border-border/50 rounded-2xl">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-secondary mb-4">Study Performance</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <Line type="monotone" dataKey="hours" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <CartesianGrid stroke="#E2E8F0" strokeDasharray="5 5" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card shadow-sm border border-border/50 rounded-2xl">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-secondary mb-4">Daily Goal</h3>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-secondary/70">2.5 / 4 Hours</span>
                <span className="font-medium text-primary">62%</span>
              </div>
              <div className="w-full bg-secondary/10 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '62%' }} />
              </div>
            </div>
          </div>
          
          <div className="bg-card shadow-sm border border-border/50 rounded-2xl">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-secondary mb-4">Upcoming Exams</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/5 border border-border/50 hover:bg-secondary/10 transition-colors">
                  <div>
                    <p className="font-medium text-secondary">FPSC Inspector</p>
                    <p className="text-xs text-secondary/60">Oct 24, 2026</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-bold">14 Days</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/5 border border-border/50 hover:bg-secondary/10 transition-colors">
                  <div>
                    <p className="font-medium text-secondary">CSS Screening</p>
                    <p className="text-xs text-secondary/60">Nov 15, 2026</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-bold">36 Days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
