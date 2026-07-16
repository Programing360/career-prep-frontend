import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Clock, Target, ChevronRight, ChevronLeft,
  Zap, CheckCircle2,
} from 'lucide-react';
import { useAuth } from './AuthContext';

const EXAMS = [
  { id: 'css', name: 'CSS', icon: '📜' },
  { id: 'fpsc', name: 'FPSC', icon: '🏛️' },
  { id: 'ppsc', name: 'PPSC', icon: '⚖️' },
  { id: 'nts', name: 'NTS', icon: '📋' },
  { id: 'mdcat', name: 'MDCAT', icon: '🩺' },
  { id: 'pms', name: 'PMS', icon: '📊' },
  { id: 'fia', name: 'FIA', icon: '🔍' },
  { id: 'asf', name: 'ASF', icon: '✈️' },
];

const PREP_LEVELS = [
  { id: 'beginner', label: 'Beginner', desc: 'Just starting out', icon: '🌱' },
  { id: 'intermediate', label: 'Intermediate', desc: 'Have some foundation', icon: '📖' },
  { id: 'advanced', label: 'Advanced', desc: 'Ready for mock tests', icon: '🎯' },
];

const STUDY_HOURS = [
  { id: 1, label: '1 hour', desc: 'Casual' },
  { id: 2, label: '2 hours', desc: 'Regular' },
  { id: 3, label: '3 hours', desc: 'Serious' },
  { id: 4, label: '4+ hours', desc: 'Intensive' },
];

export default function Onboarding() {
  const { completeOnboarding, user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [prepLevel, setPrepLevel] = useState('');
  const [studyHours, setStudyHours] = useState(0);

  const toggleExam = (id: string) => {
    setSelectedExams(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const canNext = () => {
    if (step === 0) return selectedExams.length > 0;
    if (step === 1) return prepLevel !== '';
    if (step === 2) return studyHours > 0;
    return true;
  };

  const handleFinish = () => {
    completeOnboarding({ targetExams: selectedExams, prepLevel, studyHoursPerDay: studyHours });
    navigate('/dashboard/overview');
  };

  const stepIcons = [BookOpen, Target, Clock];
  const stepTitles = ['Target Exams', 'Preparation Level', 'Daily Study Time'];
  const StepIcon = stepIcons[step];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-secondary text-xl">PrepMaster<span className="text-primary">AI</span></span>
          </div>
          <h1 className="text-2xl font-bold text-secondary">Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!</h1>
          <p className="text-secondary/60 mt-2 text-sm">Let's personalize your study plan</p>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            {[0, 1, 2].map(i => (
              <div key={i} className="flex-1 flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                  i < step ? 'bg-success text-white' : i === step ? 'bg-primary text-white' : 'bg-secondary/10 text-secondary/40'
                }`}>
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                {i < 2 && <div className={`flex-1 h-0.5 rounded-full ${i < step ? 'bg-success' : 'bg-secondary/10'}`} />}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-5">
            <StepIcon className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-secondary">{stepTitles[step]}</h2>
          </div>

          {step === 0 && (
            <div className="grid grid-cols-2 gap-3">
              {EXAMS.map(exam => (
                <button
                  key={exam.id}
                  onClick={() => toggleExam(exam.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
                    selectedExams.includes(exam.id)
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border/50 hover:border-primary/30 hover:bg-secondary/5'
                  }`}
                >
                  <span className="text-2xl">{exam.icon}</span>
                  <div>
                    <p className="font-semibold text-secondary text-sm">{exam.name}</p>
                    {selectedExams.includes(exam.id) && (
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              {PREP_LEVELS.map(level => (
                <button
                  key={level.id}
                  onClick={() => setPrepLevel(level.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    prepLevel === level.id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border/50 hover:border-primary/30 hover:bg-secondary/5'
                  }`}
                >
                  <span className="text-3xl">{level.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-secondary">{level.label}</p>
                    <p className="text-sm text-secondary/60">{level.desc}</p>
                  </div>
                  {prepLevel === level.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-3">
              {STUDY_HOURS.map(h => (
                <button
                  key={h.id}
                  onClick={() => setStudyHours(h.id)}
                  className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all ${
                    studyHours === h.id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border/50 hover:border-primary/30 hover:bg-secondary/5'
                  }`}
                >
                  <Clock className={`w-6 h-6 ${studyHours === h.id ? 'text-primary' : 'text-secondary/40'}`} />
                  <p className="font-semibold text-secondary">{h.label}</p>
                  <p className="text-xs text-secondary/60">{h.desc}</p>
                  {studyHours === h.id && <CheckCircle2 className="w-4 h-4 text-primary" />}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 mt-6">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-secondary/60 hover:text-secondary border border-border/50 rounded-xl hover:bg-secondary/5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            <button
              onClick={step === 2 ? handleFinish : () => setStep(s => s + 1)}
              disabled={!canNext()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 shadow-sm"
            >
              {step === 2 ? 'Start Learning' : 'Continue'}
              {step < 2 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={() => navigate('/dashboard/overview')}
            className="w-full mt-3 text-center text-xs text-secondary/40 hover:text-secondary/60 py-2"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
