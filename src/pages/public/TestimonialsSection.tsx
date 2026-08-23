import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  accentColor: string; // Left border stripe color
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Gabriel',
    role: 'CSS Aspirant',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    quote:
      "Thanks to MeritPrep clear explanations and supportive tutors, I passed my FPSC and provincial exams with flying colors! I couldn't have done it without them!",
    accentColor: 'bg-sky-400 dark:bg-sky-500',
  },
  {
    id: '2',
    name: 'Chisom',
    role: 'PPSC Candidate',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    quote:
      "The flexible learning schedule and clear explanations on MeritPrep have been amazing. It's been a huge help in preparing me for my exams!",
    accentColor: 'bg-[#8B3DFF] dark:bg-purple-500',
  },
  {
    id: '3',
    name: 'Francis',
    role: 'NTS Applicant',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
    quote:
      'MeritPrep engaging lessons and supportive AI tutors made learning easy for me. I now feel confident and ready to ace my exams!',
    accentColor: 'bg-sky-400 dark:bg-sky-500',
  },
];

export default function TestimonialsSection() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#FAF7FF] py-20 transition-colors duration-300 dark:bg-[#1c0131] sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* ─── Left Column: Header Text Content ─── */}
          <div
            className="space-y-6 lg:col-span-5"
            data-aos="fade-right"
            data-aos-delay="100"
          >
            <span className="text-sm font-bold uppercase tracking-wider text-[#8B3DFF] dark:text-purple-400">
              Testimonials
            </span>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
              What Students are <br className="hidden sm:inline" />
              saying about us
            </h2>

            <p className="text-base text-slate-600 dark:text-purple-200/70 sm:text-lg">
              "Success stories from students who excelled with MeritPrep. See
              how our platform helped them ace their FPSC, PPSC, and NTS exams!"
            </p>

            <div className="pt-2">
              <button className="group inline-flex items-center gap-2 rounded-xl border-2 border-slate-900/20 bg-transparent px-6 py-3 text-sm font-bold text-slate-800 transition-all hover:border-[#8B3DFF] hover:bg-[#8B3DFF] hover:text-white dark:border-purple-500/40 dark:text-purple-200 dark:hover:border-purple-500 dark:hover:bg-purple-600 dark:hover:text-white">
                Read More
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>

          {/* ─── Right Column: Stepped Testimonial Cards ─── */}
          <div className="space-y-6 lg:col-span-7">
            {testimonials.map((item, index) => {
              // Stepped Horizontal Margins ( matching your design layout )
              const marginStyles = [
                'lg:ml-12', // Top Card
                'lg:ml-0', // Middle Card (shifted left)
                'lg:ml-12', // Bottom Card
              ];

              return (
                <div
                  key={item.id}
                  data-aos="fade-left"
                  data-aos-delay={200 + index * 150}
                  className={`relative flex overflow-hidden rounded-2xl bg-white shadow-xl shadow-purple-950/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:bg-[#150E28] dark:border dark:border-purple-900/40 ${marginStyles[index % 3]}`}
                >
                  {/* Left Accent Bar */}
                  <div className={`w-2 shrink-0 ${item.accentColor}`} />

                  {/* Card Content Container */}
                  <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-6">
                    {/* Avatar with Circular Border */}
                    <div className="shrink-0">
                      <div className="relative h-20 w-20 rounded-full p-1 ring-2 ring-[#8B3DFF]/30 dark:ring-purple-500/40">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-1.5">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-400 dark:text-purple-300/50">
                        {item.role}
                      </p>
                      <p className="text-xs leading-relaxed text-slate-600 dark:text-purple-200/80 sm:text-sm">
                        "{item.quote}"
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
