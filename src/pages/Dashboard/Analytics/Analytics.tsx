import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Legend } from 'recharts';
import { TrendingUp, Target, Award, Clock } from 'lucide-react';

const weeklyData = [
  { day: 'Mon', hours: 2, mcqs: 45 },
  { day: 'Tue', hours: 3, mcqs: 72 },
  { day: 'Wed', hours: 2.5, mcqs: 58 },
  { day: 'Thu', hours: 4, mcqs: 95 },
  { day: 'Fri', hours: 3.5, mcqs: 80 },
  { day: 'Sat', hours: 5, mcqs: 120 },
  { day: 'Sun', hours: 4.5, mcqs: 108 },
];

const subjectData = [
  { subject: 'English', A: 85, fullMark: 100 },
  { subject: 'Pak Affairs', A: 70, fullMark: 100 },
  { subject: 'Islamic St.', A: 90, fullMark: 100 },
  { subject: 'Math', A: 55, fullMark: 100 },
  { subject: 'GK', A: 78, fullMark: 100 },
  { subject: 'Science', A: 65, fullMark: 100 },
];

const rankData = [
  { month: 'Jan', rank: 120 },
  { month: 'Feb', rank: 95 },
  { month: 'Mar', rank: 80 },
  { month: 'Apr', rank: 68 },
  { month: 'May', rank: 55 },
  { month: 'Jun', rank: 42 },
];

const STATS = [
  { label: 'Average Accuracy', value: '78.4%', icon: Target, color: 'text-success', bg: 'bg-success/10' },
  { label: 'Total Study Hours', value: '142h', icon: Clock, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Tests Completed', value: '24', icon: Award, color: 'text-warning', bg: 'bg-warning/10' },
  { label: 'Rank Improvement', value: '+78', icon: TrendingUp, color: 'text-accent', bg: 'bg-accent/10' },
];

export default function Analytics() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-secondary">Performance Analytics</h2>
        <p className="text-secondary/70 mt-1">Deep insights into your study patterns and exam performance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <div key={i} className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${s.bg} ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-secondary/60">{s.label}</p>
                <p className="text-xl font-bold text-secondary">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Study Hours */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-secondary mb-1">Weekly Study Hours & MCQs</h3>
          <p className="text-xs text-secondary/50 mb-4">Hours studied and MCQs solved per day</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barSize={8} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="day" stroke="#94A3B8" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" stroke="#94A3B8" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#94A3B8" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.07)', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Bar yAxisId="left" dataKey="hours" fill="#2563EB" radius={[4, 4, 0, 0]} name="Hours" />
                <Bar yAxisId="right" dataKey="mcqs" fill="#10B981" radius={[4, 4, 0, 0]} name="MCQs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Radar */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-secondary mb-1">Subject Proficiency</h3>
          <p className="text-xs text-secondary/50 mb-4">Your accuracy across all subjects</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={subjectData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
                <Radar name="Accuracy" dataKey="A" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} strokeWidth={2} dot={{ r: 3, fill: '#2563EB' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rank Progression */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm lg:col-span-2">
          <h3 className="font-semibold text-secondary mb-1">Rank Progression</h3>
          <p className="text-xs text-secondary/50 mb-4">Your global rank improvement over the last 6 months (lower is better)</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rankData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="month" stroke="#94A3B8" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis reversed stroke="#94A3B8" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.07)', fontSize: '12px' }} formatter={(v) => [`#${v}`, 'Rank']} />
                <Line type="monotone" dataKey="rank" stroke="#2563EB" strokeWidth={3} dot={{ r: 5, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
