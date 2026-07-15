import { useState } from 'react';
import { MessageSquare, ThumbsUp, Bookmark, Search, PlusCircle, TrendingUp, Tag, Filter } from 'lucide-react';

const CATEGORIES = ['All Topics', 'CSS', 'FPSC', 'PPSC', 'NTS', 'MDCAT', 'PMS', 'FIA'];

const POSTS = [
  {
    id: 1, title: 'Best strategy to prepare Current Affairs for CSS 2026?',
    author: 'Ayesha Siddiqui', avatar: 'https://i.pravatar.cc/150?u=1',
    category: 'CSS', time: '2h ago', replies: 24, likes: 87,
    tags: ['Current Affairs', 'Strategy', 'CSS'],
    excerpt: 'I have been preparing for CSS for 6 months. Looking for the most efficient way to cover current affairs...',
    pinned: true,
  },
  {
    id: 2, title: 'FPSC Inspector Investigation 2026 - Syllabus Analysis',
    author: 'Bilal Ahmed', avatar: 'https://i.pravatar.cc/150?u=2',
    category: 'FPSC', time: '5h ago', replies: 18, likes: 63,
    tags: ['FPSC', 'Syllabus'],
    excerpt: 'Sharing a detailed breakdown of the FPSC Inspector Investigation syllabus for 2026...',
    pinned: false,
  },
  {
    id: 3, title: 'How to solve MCQs faster? Speed vs Accuracy tips',
    author: 'Fatima Malik', avatar: 'https://i.pravatar.cc/150?u=3',
    category: 'NTS', time: '1d ago', replies: 42, likes: 115,
    tags: ['Tips', 'MCQ', 'Speed'],
    excerpt: 'After giving 10+ competitive exams, I want to share my personal tips for balancing speed and accuracy...',
    pinned: false,
  },
  {
    id: 4, title: 'PPSC 2026 Punjab Police ASI - Complete preparation guide',
    author: 'Ahmad Raza', avatar: 'https://i.pravatar.cc/150?u=6',
    category: 'PPSC', time: '2d ago', replies: 31, likes: 79,
    tags: ['PPSC', 'Police', 'Guide'],
    excerpt: 'A comprehensive guide for PPSC 2026 Punjab Police ASI written test preparation...',
    pinned: false,
  },
];

export default function Community() {
  const [activeCategory, setActiveCategory] = useState('All Topics');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = POSTS.filter(p =>
    (activeCategory === 'All Topics' || p.category === activeCategory) &&
    (p.title.toLowerCase().includes(searchQuery.toLowerCase()) || !searchQuery)
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-secondary">Community</h2>
          <p className="text-secondary/70 mt-1">Connect, discuss, and learn with fellow exam aspirants.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors text-sm shadow-sm">
          <PlusCircle className="w-4 h-4" />
          Ask a Question
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-secondary/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card border border-border/50 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-secondary"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border/50 rounded-xl text-sm text-secondary/70 hover:bg-secondary/5 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${activeCategory === cat ? 'bg-primary text-white shadow-sm' : 'bg-card border border-border/50 text-secondary/70 hover:border-primary/40'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts */}
          <div className="space-y-3">
            {filtered.map(post => (
              <div key={post.id} className={`bg-card border rounded-2xl p-5 hover:shadow-md transition-all group cursor-pointer ${post.pinned ? 'border-primary/30 bg-primary/5' : 'border-border/50'}`}>
                {post.pinned && (
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-3 inline-block">📌 Pinned</span>
                )}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-secondary group-hover:text-primary transition-colors text-base leading-snug">{post.title}</h3>
                    <p className="text-sm text-secondary/60 mt-1.5 line-clamp-2">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {post.tags.map(tag => (
                        <span key={tag} className="text-xs bg-secondary/5 text-secondary/70 px-2 py-0.5 rounded-full border border-border/50 flex items-center gap-1">
                          <Tag className="w-2.5 h-2.5" />{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
                  <div className="flex items-center gap-2">
                    <img src={post.avatar} alt={post.author} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-xs text-secondary/60 font-medium">{post.author}</span>
                    <span className="text-xs text-secondary/40">· {post.time}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-secondary/60">
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5" />{post.likes}
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <MessageSquare className="w-3.5 h-3.5" />{post.replies}
                    </button>
                    <button className="hover:text-primary transition-colors">
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-card border border-border/50 rounded-2xl p-4">
            <h4 className="font-semibold text-secondary mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" />Trending Topics</h4>
            <ul className="space-y-2 text-sm">
              {['CSS Essay Writing', 'FPSC 2026 Date', 'NTS GAT', 'PPSC Lecturer', 'Current Affairs Nov'].map((t, i) => (
                <li key={t} className="flex items-center gap-2 text-secondary/70 hover:text-primary cursor-pointer transition-colors">
                  <span className="text-secondary/30 font-mono text-xs">#{i + 1}</span>{t}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-card border border-border/50 rounded-2xl p-4">
            <h4 className="font-semibold text-secondary mb-3">Top Contributors</h4>
            <div className="space-y-3">
              {POSTS.slice(0, 3).map(p => (
                <div key={p.id} className="flex items-center gap-2">
                  <img src={p.avatar} alt={p.author} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-medium text-secondary">{p.author}</p>
                    <p className="text-xs text-secondary/50">{p.likes} reputation</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
