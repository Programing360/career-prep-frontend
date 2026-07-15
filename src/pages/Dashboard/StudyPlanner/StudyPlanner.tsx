import { useState } from 'react';
import { CheckCircle2, Circle, Calendar, Clock, Target, Flame } from 'lucide-react';



const TASKS = [
  { id: 1, text: 'Read Current Affairs (30 min)', done: true, subject: 'Current Affairs' },
  { id: 2, text: 'Practice 50 English MCQs', done: true, subject: 'English' },
  { id: 3, text: 'Watch Pakistan History lecture', done: false, subject: 'Pak Affairs' },
  { id: 4, text: 'Complete Daily Quiz', done: false, subject: 'Daily Quiz' },
  { id: 5, text: 'Revise Islamic Studies notes', done: false, subject: 'Islamic Studies' },
];

const WEEKLY_PLAN = [
  { day: 'Mon', subject: 'English & Grammar', hours: 3, done: true },
  { day: 'Tue', subject: 'Pakistan Affairs', hours: 3, done: true },
  { day: 'Wed', subject: 'Islamic Studies', hours: 2.5, done: false },
  { day: 'Thu', subject: 'General Knowledge', hours: 3, done: false },
  { day: 'Fri', subject: 'Current Affairs', hours: 2, done: false },
  { day: 'Sat', subject: 'Mock Test Practice', hours: 4, done: false },
  { day: 'Sun', subject: 'Revision & Review', hours: 3.5, done: false },
];

const HEATMAP_DATA = Array.from({ length: 7 * 10 }, () => ({
  intensity: Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0,
}));

const INTENSITY_COLORS = ['bg-secondary/10', 'bg-primary/20', 'bg-primary/40', 'bg-primary/70', 'bg-primary'];

export default function StudyPlanner() {
  const [tasks, setTasks] = useState(TASKS);
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [timeLeft] = useState(25 * 60);

  const toggleTask = (id: number) => setTasks(t => t.map(task => task.id === id ? { ...task, done: !task.done } : task));
  const completedCount = tasks.filter(t => t.done).length;

  const formatTime = (secs: number) => `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-secondary">Study Planner</h2>
        <p className="text-secondary/70 mt-1">Organize your preparation schedule and track your daily goals.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Tasks */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-secondary">Today's Tasks</h3>
                <p className="text-xs text-secondary/50">{completedCount}/{tasks.length} completed</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-secondary/10 rounded-full h-1.5">
                  <div className="bg-success h-1.5 rounded-full transition-all" style={{ width: `${(completedCount / tasks.length) * 100}%` }} />
                </div>
                <span className="text-xs font-medium text-success">{Math.round((completedCount / tasks.length) * 100)}%</span>
              </div>
            </div>
            <div className="space-y-2">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${task.done ? 'bg-success/5 border border-success/20' : 'bg-secondary/5 border border-border/50 hover:border-primary/30'}`}
                >
                  {task.done
                    ? <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    : <Circle className="w-5 h-5 text-secondary/40 flex-shrink-0" />
                  }
                  <span className={`text-sm flex-1 ${task.done ? 'line-through text-secondary/50' : 'text-secondary'}`}>{task.text}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${task.done ? 'bg-success/10 text-success' : 'bg-secondary/10 text-secondary/60'}`}>{task.subject}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Weekly Plan */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-secondary mb-4">Weekly Study Plan</h3>
            <div className="space-y-2">
              {WEEKLY_PLAN.map((day, i) => (
                <div key={i} className={`flex items-center gap-4 p-3 rounded-xl transition-all ${day.done ? 'bg-success/5 border border-success/20' : 'border border-border/50 hover:bg-secondary/5'}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${day.done ? 'bg-success text-white' : 'bg-secondary/10 text-secondary/70'}`}>
                    {day.day}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm ${day.done ? 'text-secondary/60 line-through' : 'text-secondary'}`}>{day.subject}</p>
                    <p className="text-xs text-secondary/50">{day.hours}h planned</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${day.done ? 'bg-success' : 'bg-secondary/20'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Study Heatmap */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-secondary">Study Heatmap</h3>
              <span className="text-xs text-secondary/50">Last 10 weeks</span>
            </div>
            <div className="grid grid-cols-10 gap-1">
              {HEATMAP_DATA.map((cell, i) => (
                <div key={i} title={`${cell.intensity}h studied`} className={`aspect-square rounded-sm ${INTENSITY_COLORS[cell.intensity]} cursor-pointer hover:ring-1 ring-primary/50 transition-all`} />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-secondary/50">Less</span>
              {INTENSITY_COLORS.map((c, i) => <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />)}
              <span className="text-xs text-secondary/50">More</span>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Pomodoro Timer */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6 text-center shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-secondary">Pomodoro Timer</h3>
            </div>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#2563EB" strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - timeLeft / (25 * 60))}`}
                  strokeLinecap="round" className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-secondary font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>
            <button
              onClick={() => setPomodoroActive(!pomodoroActive)}
              className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${pomodoroActive ? 'bg-danger text-white hover:bg-danger/90' : 'bg-primary text-white hover:bg-primary/90'}`}
            >
              {pomodoroActive ? '⏸ Pause' : '▶ Start Focus'}
            </button>
            <p className="text-xs text-secondary/50 mt-2">25 min work · 5 min break</p>
          </div>

          {/* Upcoming Exams */}
          <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-secondary mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />Upcoming Exams
            </h3>
            <div className="space-y-3">
              {[
                { name: 'FPSC Inspector', date: 'Oct 24, 2026', days: 14, prep: 65 },
                { name: 'CSS Screening', date: 'Nov 15, 2026', days: 36, prep: 40 },
              ].map((exam, i) => (
                <div key={i} className="p-3 bg-secondary/5 rounded-xl border border-border/50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-secondary text-sm">{exam.name}</p>
                      <p className="text-xs text-secondary/50">{exam.date}</p>
                    </div>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{exam.days}d</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-secondary/10 rounded-full h-1">
                      <div className="bg-primary h-1 rounded-full" style={{ width: `${exam.prep}%` }} />
                    </div>
                    <span className="text-xs text-secondary/60">{exam.prep}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-secondary mb-3">This Week's Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Study Hours', value: '18.5h', icon: Clock, color: 'text-primary' },
                { label: 'Day Streak', value: '12 🔥', icon: Flame, color: 'text-warning' },
                { label: 'MCQs Done', value: '578', icon: Target, color: 'text-success' },
                { label: 'Weekly XP', value: '2,340', icon: Target, color: 'text-accent' },
              ].map((s, i) => (
                <div key={i} className="bg-secondary/5 rounded-xl p-3 text-center">
                  <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-secondary/60 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
