import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, MessageCircle, BookOpen, Video, Ticket, ExternalLink } from 'lucide-react';

const FAQS = [
  { q: 'How does PrepMaster AI work?', a: 'PrepMaster AI uses advanced AI algorithms to analyze your performance, identify weak areas, and create personalized study plans. It adapts to your learning pace and provides targeted practice to maximize your exam score.' },
  { q: 'Which exams does the platform support?', a: 'We support all major Pakistan government exams including CSS, FPSC, PPSC, NTS, PMS, FIA, ASF, MDCAT, and many more. Our content library is regularly updated to match the latest syllabus.' },
  { q: 'How do I upgrade to Premium?', a: 'Go to Subscription in the sidebar, choose a plan (Monthly/Yearly/Ultimate), and complete the payment via JazzCash, EasyPaisa, or credit card. Your account will be upgraded instantly.' },
  { q: 'Can I download notes and previous papers?', a: 'Yes! Premium members can download all notes, previous papers, and study materials in PDF format for offline use.' },
  { q: 'How accurate is the AI rank prediction?', a: 'Our AI rank prediction is based on your performance across 10,000+ past exam data points and has an 87% accuracy rate. It gives you a realistic estimate of your expected rank.' },
  { q: 'Is there a mobile app available?', a: 'A mobile app (iOS & Android) is coming soon. Currently, the platform is fully responsive and works perfectly on all devices through the browser.' },
];

const RESOURCES = [
  { title: 'Getting Started Guide', desc: 'Learn the basics of the platform', icon: BookOpen, link: '#' },
  { title: 'Video Tutorials', desc: 'Watch step-by-step walkthroughs', icon: Video, link: '#' },
  { title: 'Submit a Ticket', desc: 'Get help from our support team', icon: Ticket, link: '#' },
  { title: 'Community Forum', desc: 'Ask the student community', icon: MessageCircle, link: '#' },
];

export default function Help() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const filtered = FAQS.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || !search);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="text-center py-8 px-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl border border-primary/10">
        <h2 className="text-2xl font-bold text-secondary">How can we help you?</h2>
        <p className="text-secondary/60 mt-2 text-sm">Search our documentation or browse resources below.</p>
        <div className="relative max-w-md mx-auto mt-4">
          <Search className="w-4 h-4 text-secondary/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for help..."
            className="w-full bg-card border border-border/50 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm"
          />
        </div>
      </div>

      {/* Quick Resources */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {RESOURCES.map((r, i) => (
          <a key={i} href={r.link} className="bg-card border border-border/50 rounded-2xl p-5 hover:shadow-md transition-all group hover:border-primary/30 flex flex-col gap-3">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <r.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-secondary text-sm">{r.title}</p>
              <p className="text-xs text-secondary/60 mt-0.5">{r.desc}</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-secondary/30 group-hover:text-primary transition-colors mt-auto self-end" />
          </a>
        ))}
      </div>

      {/* FAQ */}
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border/50">
          <h3 className="font-semibold text-secondary text-lg">Frequently Asked Questions</h3>
          <p className="text-xs text-secondary/50 mt-1">{filtered.length} results found</p>
        </div>
        <div className="divide-y divide-border/30">
          {filtered.map((faq, i) => (
            <div key={i} className="overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-secondary/5 transition-colors"
              >
                <span className="font-medium text-secondary text-sm">{faq.q}</span>
                {openFaq === i ? <ChevronUp className="w-4 h-4 text-primary flex-shrink-0 ml-4" /> : <ChevronDown className="w-4 h-4 text-secondary/40 flex-shrink-0 ml-4" />}
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-sm text-secondary/70 leading-relaxed bg-secondary/5">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-secondary/60">No results found for "{search}"</p>
              <p className="text-sm text-secondary/40 mt-1">Try different keywords or contact support</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Support CTA */}
      <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white text-center">
        <h3 className="text-xl font-bold mb-2">Still need help?</h3>
        <p className="text-white/80 text-sm mb-4">Our support team is available 24/7 to assist you.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button className="px-5 py-2 bg-white text-primary rounded-xl text-sm font-semibold hover:bg-white/90 transition-colors">💬 Live Chat</button>
          <button className="px-5 py-2 bg-white/20 border border-white/30 text-white rounded-xl text-sm font-semibold hover:bg-white/30 transition-colors">📧 Email Support</button>
        </div>
      </div>
    </div>
  );
}
