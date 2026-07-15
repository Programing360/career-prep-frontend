import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap, Menu, X, ArrowRight, BookOpen, BarChart2, Target, Users,
  Star, CheckCircle, ChevronRight, Flame, Award, Shield, Globe,
  Clock, TrendingUp, Brain, Play,
} from 'lucide-react';

// ── Animated Counter ─────────────────────────────────────────────────────────
function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [end]);
  return <>{count.toLocaleString()}{suffix}</>;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const EXAMS = [
  { name: 'CSS', icon: '📜', mcqs: '12,400+', tests: 48, color: 'from-blue-500/10 to-blue-600/5', border: 'border-blue-500/20', badge: 'text-blue-600 bg-blue-50' },
  { name: 'FPSC', icon: '🏛️', mcqs: '8,200+', tests: 36, color: 'from-indigo-500/10 to-indigo-600/5', border: 'border-indigo-500/20', badge: 'text-indigo-600 bg-indigo-50' },
  { name: 'PPSC', icon: '⚖️', mcqs: '6,800+', tests: 30, color: 'from-violet-500/10 to-violet-600/5', border: 'border-violet-500/20', badge: 'text-violet-600 bg-violet-50' },
  { name: 'NTS', icon: '📋', mcqs: '9,500+', tests: 42, color: 'from-cyan-500/10 to-cyan-600/5', border: 'border-cyan-500/20', badge: 'text-cyan-600 bg-cyan-50' },
  { name: 'MDCAT', icon: '🩺', mcqs: '15,000+', tests: 60, color: 'from-emerald-500/10 to-emerald-600/5', border: 'border-emerald-500/20', badge: 'text-emerald-600 bg-emerald-50' },
  { name: 'PMS', icon: '📊', mcqs: '5,400+', tests: 24, color: 'from-orange-500/10 to-orange-600/5', border: 'border-orange-500/20', badge: 'text-orange-600 bg-orange-50' },
  { name: 'FIA', icon: '🔍', mcqs: '4,200+', tests: 18, color: 'from-rose-500/10 to-rose-600/5', border: 'border-rose-500/20', badge: 'text-rose-600 bg-rose-50' },
  { name: 'ASF', icon: '✈️', mcqs: '3,600+', tests: 15, color: 'from-sky-500/10 to-sky-600/5', border: 'border-sky-500/20', badge: 'text-sky-600 bg-sky-50' },
];

const FEATURES = [
  { icon: Brain, title: 'AI Study Assistant', desc: 'Get instant explanations, generate notes, and identify weak topics with our intelligent AI tutor.', color: 'text-primary bg-primary/10' },
  { icon: Target, title: 'Smart Mock Tests', desc: 'Full-length mock tests simulating real exam conditions with detailed performance analysis.', color: 'text-emerald-600 bg-emerald-50' },
  { icon: BarChart2, title: 'Deep Analytics', desc: 'Track your progress, accuracy, and rank predictions with beautiful interactive dashboards.', color: 'text-violet-600 bg-violet-50' },
  { icon: Flame, title: 'Gamification', desc: 'Stay motivated with XP points, daily streaks, badges, leaderboards, and achievement rewards.', color: 'text-orange-600 bg-orange-50' },
  { icon: Globe, title: 'Current Affairs', desc: 'Daily updated news, government circulars, and current affairs MCQs tailored for Pakistani exams.', color: 'text-cyan-600 bg-cyan-50' },
  { icon: Users, title: 'Community Forum', desc: 'Connect with 200,000+ students, share strategies, ask doubts, and grow together.', color: 'text-rose-600 bg-rose-50' },
];

const TESTIMONIALS = [
  { name: 'Ayesha Siddiqui', role: 'CSS Qualifier 2025', avatar: 'https://i.pravatar.cc/150?u=t1', rating: 5, text: 'PrepMaster AI transformed my CSS preparation. The AI tutor explained every difficult concept, and the mock tests were incredibly realistic. I cleared CSS in my very first attempt!' },
  { name: 'Bilal Ahmed', role: 'FPSC Inspector', avatar: 'https://i.pravatar.cc/150?u=t2', rating: 5, text: 'The current affairs section and subject-wise MCQ practice made all the difference. I went from rank #450 to #28 in just 3 months. Absolutely worth every rupee.' },
  { name: 'Fatima Malik', role: 'PPSC Lecturer (Selected)', avatar: 'https://i.pravatar.cc/150?u=t3', rating: 5, text: 'The study planner kept me organized and the streak system kept me consistent. The community forum is amazing — real students sharing real strategies. Highly recommended!' },
];

const PLANS = [
  { name: 'Free', price: 0, period: '', color: 'border-border/50', badge: '', features: ['50 MCQs/day', '2 Mock Tests/month', 'Basic Analytics', 'Community Access', 'Daily Quiz'], notIncluded: ['AI Assistant', 'PDF Downloads', 'Video Lectures'] },
  { name: 'Premium', price: 999, period: '/month', color: 'border-primary ring-2 ring-primary/20', badge: '🔥 Most Popular', features: ['Unlimited MCQs', 'Unlimited Mock Tests', 'Full Analytics', 'AI Study Assistant', 'PDF Downloads', 'Video Lectures', 'Priority Support'], notIncluded: [] },
  { name: 'Ultimate', price: 7999, period: '/year', color: 'border-border/50', badge: '💎 Best Value', features: ['Everything in Premium', '1-on-1 Mentorship (2/mo)', 'Interview Preparation', 'Personalized Study Plan', 'Exam Alert Notifications', 'Offline Access'], notIncluded: [] },
];

const NAV_LINKS = ['Exams', 'Features', 'Pricing', 'Community'];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">

      {/* ── Navbar ────────────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-lg border-b border-border/50 shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[#0F172A] text-lg">PrepMaster<span className="text-primary">AI</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-sm font-medium text-[#0F172A]/70 hover:text-primary transition-colors">
                {link}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/dashboard/overview" className="text-sm font-medium text-[#0F172A]/70 hover:text-primary transition-colors px-3 py-2">
              Sign In
            </Link>
            <Link to="/dashboard/overview" className="text-sm font-semibold bg-primary text-white px-4 py-2 rounded-xl hover:bg-[#1D4ED8] transition-colors shadow-sm">
              Start Free →
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(o => !o)} className="md:hidden p-2 rounded-lg hover:bg-secondary/10 transition-colors">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-border/50 shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {NAV_LINKS.map(link => (
                <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-[#0F172A]/70 hover:text-primary transition-colors">
                  {link}
                </a>
              ))}
              <div className="pt-2 border-t border-border/50 space-y-2">
                <Link to="/dashboard/overview" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-2.5 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-[#1D4ED8] transition-colors">
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero Section ──────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 px-4 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-accent/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-emerald-400/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Announcement pill */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            🎉 Now with AI-Powered Study Assistant — Try it free!
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F172A] leading-tight tracking-tight">
            Prepare Smarter.{' '}
            <span className="relative inline-block">
              <span className="text-primary">Crack Government</span>
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 8" fill="none">
                <path d="M2 6C50 2 100 2 150 4C200 6 250 6 298 2" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
              </svg>
            </span>{' '}
            Exams Faster.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg text-[#0F172A]/60 max-w-2xl mx-auto leading-relaxed">
            Pakistan's #1 AI-powered preparation platform for CSS, FPSC, PPSC, NTS, PMS, MDCAT, and 10+ government exams. Trusted by <strong className="text-[#0F172A]">200,000+</strong> students.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link
              to="/dashboard/overview"
              className="flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-2xl hover:bg-[#1D4ED8] transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 text-sm"
            >
              <Zap className="w-4 h-4" />
              Start Learning — It's Free
            </Link>
            <button className="flex items-center gap-2 bg-white border border-border text-[#0F172A]/80 font-semibold px-6 py-3 rounded-2xl hover:bg-secondary/5 hover:border-primary/40 transition-all text-sm shadow-sm">
              <Play className="w-4 h-4 fill-primary text-primary" />
              Watch Demo
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-xs text-[#0F172A]/50">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" />No credit card needed</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" />Free forever plan available</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" />Cancel anytime</span>
          </div>

          {/* Hero Dashboard Preview */}
          <div className="mt-14 relative mx-auto max-w-4xl">
            <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] to-transparent z-10 pointer-events-none" style={{ top: '60%' }} />
            <div className="bg-white rounded-3xl border border-border/50 shadow-2xl shadow-[#0F172A]/8 overflow-hidden">
              <div className="h-9 bg-[#F8FAFC] border-b border-border/50 flex items-center gap-2 px-4">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-xs text-[#0F172A]/40 ml-2 font-mono">prepmaster.ai/dashboard</span>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-5 bg-[#0F172A]/10 rounded-lg w-48" />
                    <div className="h-3 bg-[#0F172A]/5 rounded w-64 mt-2" />
                  </div>
                  <div className="flex gap-2">
                    {['bg-primary', 'bg-emerald-500', 'bg-warning'].map((c, i) => (
                      <div key={i} className={`h-8 w-24 ${c} rounded-xl opacity-20`} />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {['#2563EB', '#10B981', '#F59E0B', '#8B5CF6'].map((c, i) => (
                    <div key={i} className="rounded-2xl border border-border/50 p-3 bg-white shadow-sm flex flex-col gap-2">
                      <div className="w-8 h-8 rounded-xl" style={{ backgroundColor: `${c}20` }} />
                      <div className="h-6 rounded-lg w-12" style={{ backgroundColor: `${c}30` }} />
                      <div className="h-2 rounded bg-[#0F172A]/5 w-full" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 h-36 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border border-border/50" />
                  <div className="space-y-2">
                    <div className="h-17 bg-[#F8FAFC] rounded-2xl border border-border/50 p-3">
                      <div className="h-2 bg-[#0F172A]/10 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-primary/20 rounded w-full" />
                    </div>
                    <div className="h-17 bg-[#F8FAFC] rounded-2xl border border-border/50 p-3">
                      <div className="h-2 bg-[#0F172A]/10 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-emerald-500/20 rounded w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Section ─────────────────────────────────────────────────────── */}
      <section className="py-12 border-y border-border/50 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              { value: 200000, suffix: '+', label: 'Students' },
              { value: 75000, suffix: '+', label: 'MCQs' },
              { value: 500, suffix: '+', label: 'Mock Tests' },
              { value: 12000, suffix: '+', label: 'Selections' },
              { value: 8500, suffix: '+', label: 'Daily Active' },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-3xl font-bold text-[#0F172A]"><Counter end={s.value} suffix={s.suffix} /></p>
                <p className="text-sm text-[#0F172A]/50 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Exams Section ─────────────────────────────────────────────────────── */}
      <section id="exams" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">All Exams Covered</p>
            <h2 className="text-3xl font-bold text-[#0F172A]">Prepare for Every Government Exam</h2>
            <p className="text-[#0F172A]/60 mt-3 max-w-xl mx-auto text-sm">Complete syllabus coverage, updated MCQ banks, and realistic mock tests for all major Pakistan competitive exams.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {EXAMS.map((exam) => (
              <Link
                key={exam.name}
                to="/dashboard/practice"
                className={`group bg-gradient-to-br ${exam.color} border ${exam.border} rounded-2xl p-5 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer`}
              >
                <div className="text-3xl mb-3">{exam.icon}</div>
                <h3 className="font-bold text-[#0F172A] text-lg">{exam.name}</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-[#0F172A]/60 flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3" />{exam.mcqs} MCQs
                  </p>
                  <p className="text-xs text-[#0F172A]/60 flex items-center gap-1.5">
                    <Target className="w-3 h-3" />{exam.tests} Mock Tests
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${exam.badge}`}>Start Prep</span>
                  <ChevronRight className="w-4 h-4 text-[#0F172A]/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ──────────────────────────────────────────────────── */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">Everything You Need</p>
            <h2 className="text-3xl font-bold text-[#0F172A]">A Complete Exam Preparation Ecosystem</h2>
            <p className="text-[#0F172A]/60 mt-3 max-w-xl mx-auto text-sm">From AI-powered tutoring to gamified learning — we've built every tool to maximize your chances of success.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-[#F8FAFC] border border-border/50 rounded-2xl p-6 hover:shadow-md transition-all hover:border-primary/20 group">
                <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#0F172A] text-base">{f.title}</h3>
                <p className="text-[#0F172A]/60 text-sm mt-2 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">Success Stories</p>
            <h2 className="text-3xl font-bold text-[#0F172A]">Students Who Cracked It</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-warning text-warning" />)}
                </div>
                <p className="text-[#0F172A]/70 text-sm leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-[#0F172A] text-sm">{t.name}</p>
                    <p className="text-xs text-emerald-600 font-medium">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">Simple Pricing</p>
            <h2 className="text-3xl font-bold text-[#0F172A]">Invest in Your Future</h2>
            <p className="text-[#0F172A]/60 mt-3 max-w-md mx-auto text-sm">Less than a cup of tea per day — to crack your dream government job.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {PLANS.map((plan, i) => (
              <div key={i} className={`bg-[#F8FAFC] border-2 ${plan.color} rounded-2xl p-6 relative ${i === 1 ? 'shadow-xl shadow-primary/10 bg-white scale-105' : ''}`}>
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </span>
                )}
                <h3 className="font-bold text-[#0F172A] text-lg">{plan.name}</h3>
                <div className="mt-3 mb-5">
                  <span className="text-3xl font-bold text-[#0F172A]">
                    {plan.price === 0 ? 'Free' : `₨${plan.price.toLocaleString()}`}
                  </span>
                  <span className="text-[#0F172A]/50 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-[#0F172A]/80">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />{f}
                    </li>
                  ))}
                  {plan.notIncluded.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-[#0F172A]/30 line-through">
                      <X className="w-4 h-4 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/dashboard/overview"
                  className={`block w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-all ${i === 1 ? 'bg-primary text-white hover:bg-[#1D4ED8] shadow-sm' : 'bg-secondary/5 text-[#0F172A] hover:bg-secondary/10 border border-border'}`}
                >
                  {plan.price === 0 ? 'Start Free' : 'Get Started'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-gradient-to-br from-[#0F172A] to-[#1e3a8a] rounded-3xl p-10 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <p className="text-4xl mb-4">🚀</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Ready to crack your dream government exam?</h2>
              <p className="text-white/60 mt-3 text-sm max-w-md mx-auto">Join 200,000+ students who chose the smarter way to prepare. Your selection story starts today.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
                <Link
                  to="/dashboard/overview"
                  className="flex items-center justify-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-2xl hover:bg-white/90 transition-all shadow-lg text-sm"
                >
                  <Zap className="w-4 h-4" />Start Free Today
                </Link>
                <Link
                  to="/dashboard/mock-tests"
                  className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-2xl hover:bg-white/20 transition-all text-sm"
                >
                  Take Free Mock Test <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0F172A] text-white/60 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-8 border-b border-white/10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-white">PrepMaster<span className="text-primary">AI</span></span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">Pakistan's most advanced government exam preparation platform. Powered by AI.</p>
              <div className="flex gap-3 mt-4">
                
                {/* {[faTwitter, Facebook, faYoutube, faInstagram].map((Icon, i) => (
                  <button key={i} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary/50 transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                ))} */}
              </div>
            </div>

            {/* Links */}
            {[
              { title: 'Exams', links: ['CSS', 'FPSC', 'PPSC', 'NTS', 'MDCAT', 'PMS'] },
              { title: 'Resources', links: ['MCQ Practice', 'Mock Tests', 'Current Affairs', 'Video Lectures', 'Previous Papers'] },
              { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Privacy Policy', 'Terms of Service'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-semibold text-sm mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(l => <li key={l}><a href="#" className="text-xs hover:text-white transition-colors">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-3 text-xs">
            <p>© 2026 PrepMaster AI. All rights reserved.</p>
            <p>Made with ❤️ for Pakistan's exam aspirants</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
