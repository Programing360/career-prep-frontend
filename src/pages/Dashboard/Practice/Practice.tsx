import { BookOpen, ArrowRight } from 'lucide-react';

const SUBJECTS = [
  { name: 'English Grammar', questions: 1250, difficulty: 'Medium' },
  { name: 'Current Affairs', questions: 840, difficulty: 'Hard' },
  { name: 'Everyday Science', questions: 500, difficulty: 'Easy' },
  { name: 'Islamic Studies', questions: 620, difficulty: 'Medium' },
];

export default function Practice() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-secondary">Practice MCQs</h2>
        <p className="text-secondary/70 mt-1">Master your subjects with our extensive MCQ database.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SUBJECTS.map((subject, i) => (
          <div key={i} className="bg-card shadow-sm border border-border/50 hover:border-primary/50 transition-colors cursor-pointer group rounded-2xl flex flex-col">
            <div className="p-5 flex flex-col items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="w-full">
                <h4 className="font-semibold text-secondary text-lg">{subject.name}</h4>
                <div className="flex justify-between items-center mt-2 text-sm text-secondary/60">
                  <span>{subject.questions} MCQs</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    subject.difficulty === 'Hard' ? 'bg-danger/10 text-danger' : 
                    subject.difficulty === 'Medium' ? 'bg-warning/10 text-warning' : 
                    'bg-success/10 text-success'
                  }`}>
                    {subject.difficulty}
                  </span>
                </div>
              </div>
              <button className="w-full mt-2 font-medium bg-primary/10 text-primary py-2 rounded-xl hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2">
                Start Practice
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
