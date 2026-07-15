import { Play } from 'lucide-react';

const COURSES = [
  { id: 1, title: 'CSS Complete Guide', progress: 85, image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60' },
  { id: 2, title: 'Pakistan Affairs 2026', progress: 42, image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop&q=60' },
  { id: 3, title: 'General Science Ability', progress: 12, image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&auto=format&fit=crop&q=60' },
];

export default function MyLearning() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-secondary">My Learning</h2>
        <p className="text-secondary/70 mt-1">Pick up where you left off and complete your goals.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-secondary">Continue Learning</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map(course => (
            <div key={course.id} className="bg-card shadow-sm border border-border/50 rounded-2xl hover:shadow-lg transition-all group overflow-hidden flex flex-col">
              <div className="relative aspect-video overflow-hidden">
                <img src={course.image} alt={course.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button className="bg-primary text-white p-3 rounded-full scale-0 group-hover:scale-100 transition-transform delay-100 shadow-lg">
                    <Play className="fill-white w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-4 pb-2">
                <h4 className="font-semibold text-secondary">{course.title}</h4>
              </div>
              <div className="flex-col items-start gap-2 px-4 pb-4 pt-0 mt-auto">
                <div className="flex justify-between w-full text-sm mb-2">
                  <span className="text-secondary/60">Progress</span>
                  <span className="font-medium text-primary">{course.progress}%</span>
                </div>
                <div className="w-full bg-secondary/10 rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: `${course.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
