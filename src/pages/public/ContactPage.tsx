import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  Phone,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { Link } from 'react-router-dom';

// 💜 PURPLE & GLASS THEME CONFIGURATION
const THEME = {
  // Brand / Accent colors
  accentText: 'text-purple-600 dark:text-purple-400',
  accentBg:
    'bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600 shadow-purple-500/25',
  accentRing:
    'focus:border-purple-500 focus:ring-purple-500/20 dark:focus:border-purple-400 dark:focus:ring-purple-400/20',

  // Background Glowing Ambient Orbs (Glass Enhancement)
  glowPrimary: 'bg-purple-600/20',
  glowSecondary: 'bg-fuchsia-600/20',
  glowTertiary: 'bg-indigo-600/20',

  // Contact Info Cards (Icon Badge Colors)
  badges: {
    email:
      'bg-purple-100/80 text-purple-600 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50',
    location:
      'bg-fuchsia-100/80 text-fuchsia-600 dark:bg-fuchsia-950/70 dark:text-fuchsia-300 border border-fuchsia-200/50 dark:border-fuchsia-800/50',
    time: 'bg-indigo-100/80 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50',
    phone:
      'bg-violet-100/80 text-violet-600 dark:bg-violet-950/70 dark:text-violet-300 border border-violet-200/50 dark:border-violet-800/50',
  },
};

// 🔮 Enhanced Glassmorphism CSS Class
const glassCard =
  'backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-purple-500/20 shadow-2xl shadow-purple-950/5 dark:shadow-purple-950/20';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const contactDetails = [
  {
    icon: Mail,
    title: 'Email Us',
    detail: 'support@meritprep.com',
    subtext: 'We respond within 24 hours',
    color: THEME.badges.email,
  },
  {
    icon: MapPin,
    title: 'Location',
    detail: 'Lahore, Punjab, Pakistan',
    subtext: 'Serving students nationwide',
    color: THEME.badges.location,
  },
  {
    icon: Clock,
    title: 'Response Time',
    detail: 'Within 24 Hours',
    subtext: 'Mon – Sat, 9 AM – 6 PM',
    color: THEME.badges.time,
  },
  {
    icon: Phone,
    title: 'Phone',
    detail: '+92 300 1234567',
    subtext: 'Available during business hours',
    color: THEME.badges.phone,
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors">
      {/* 🔮 Background Ambient Glass Orbs */}
      <div
        className={`pointer-events-none absolute -top-10 -left-10 h-96 w-96 rounded-full ${THEME.glowPrimary} blur-3xl`}
      />
      <div
        className={`pointer-events-none absolute top-1/3 -right-20 h-96 w-96 rounded-full ${THEME.glowSecondary} blur-3xl`}
      />
      <div
        className={`pointer-events-none absolute -bottom-10 left-1/4 h-96 w-96 rounded-full ${THEME.glowTertiary} blur-3xl`}
      />

      {/* Hero Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <motion.div
          className="relative mx-auto max-w-3xl text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${THEME.badges.email}`}
          >
            <MessageSquare size={32} />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="text-4xl font-black tracking-tight sm:text-5xl"
          >
            Get in <span className={THEME.accentText}>Touch</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="mx-auto mt-4 max-w-xl text-slate-600 dark:text-slate-300"
          >
            Have a question, suggestion, or need help? We'd love to hear from
            you. Our team is ready to assist.
          </motion.p>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-5">
            {/* Left: Contact Details */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-5 lg:col-span-2"
            >
              <motion.h2
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold tracking-tight"
              >
                Contact Information
              </motion.h2>
              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="text-sm text-slate-600 dark:text-slate-300"
              >
                Reach out through any of the channels below, or fill out the
                form and we'll get back to you.
              </motion.p>

              <div className="space-y-4">
                {contactDetails.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      variants={fadeUp}
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className={`${glassCard} flex items-start gap-4 rounded-2xl p-5 transition-all hover:border-purple-300/80 dark:hover:border-purple-500/50`}
                    >
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.color}`}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className="mt-0.5 text-sm font-medium text-slate-700 dark:text-slate-200">
                          {item.detail}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          {item.subtext}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Right: Contact Form */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className={`${glassCard} rounded-3xl p-6 sm:p-8`}>
                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      <h3 className="text-xl font-bold">Send us a Message</h3>

                      {/* Name */}
                      <div className="relative">
                        <label
                          htmlFor="name"
                          className={`pointer-events-none absolute left-4 transition-all ${
                            focusedField === 'name' || formData.name
                              ? `top-2 text-xs font-semibold ${THEME.accentText}`
                              : 'top-3.5 text-sm text-slate-400 dark:text-slate-500 '
                          }`}
                        >
                          Full Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full rounded-xl border border-white/50 bg-white/40 px-4 pb-2 pt-7 text-sm  transition-all outline-none dark:border-purple-500/20 dark:bg-slate-900/40 ${THEME.accentRing}`}
                        />
                      </div>

                      {/* Email */}
                      <div className="relative">
                        <label
                          htmlFor="email"
                          className={`pointer-events-none absolute left-4 transition-all ${
                            focusedField === 'email' || formData.email
                              ? `top-2 text-xs font-semibold ${THEME.accentText}`
                              : 'top-3.5 text-sm text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          Email Address
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full rounded-xl border border-white/50 bg-white/40 px-4 pb-2 pt-7 text-sm  transition-all outline-none dark:border-purple-500/20 dark:bg-slate-900/40 ${THEME.accentRing}`}
                        />
                      </div>

                      {/* Subject */}
                      <div className="relative">
                        <label
                          htmlFor="subject"
                          className={`pointer-events-none absolute left-4 top-2 text-xs font-semibold ${THEME.accentText}`}
                        >
                          Subject
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('subject')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full appearance-none rounded-xl border border-white/50 bg-white/40 px-4 pb-2 pt-7 text-sm  transition-all outline-none dark:border-purple-500/20 dark:bg-slate-900/40 ${THEME.accentRing}`}
                        >
                          <option value="" disabled hidden>
                            Select a topic
                          </option>
                          <option
                            value="general"
                            className="bg-slate-50 dark:bg-slate-900"
                          >
                            General Inquiry
                          </option>
                          <option
                            value="support"
                            className="bg-slate-50 dark:bg-slate-900"
                          >
                            Technical Support
                          </option>
                          <option
                            value="feedback"
                            className="bg-slate-50 dark:bg-slate-900"
                          >
                            Feedback
                          </option>
                          <option
                            value="partnership"
                            className="bg-slate-50 dark:bg-slate-900"
                          >
                            Partnership
                          </option>
                          <option
                            value="bug"
                            className="bg-slate-50 dark:bg-slate-900"
                          >
                            Report a Bug
                          </option>
                          <option
                            value="content"
                            className="bg-slate-50 dark:bg-slate-900"
                          >
                            Content Correction
                          </option>
                        </select>
                        <ChevronDown
                          size={16}
                          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-purple-400"
                        />
                      </div>

                      {/* Message */}
                      <div className="relative">
                        <label
                          htmlFor="message"
                          className={`pointer-events-none absolute left-4 transition-all ${
                            focusedField === 'message' || formData.message
                              ? `top-2 text-xs font-semibold ${THEME.accentText}`
                              : 'top-3.5 text-sm text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          Your Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('message')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full resize-none rounded-xl border border-white/50 bg-white/40 px-4 pb-2 pt-7 text-sm transition-all outline-none dark:border-purple-500/20 dark:bg-slate-900/40 ${THEME.accentRing}`}
                        />
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          size="lg"
                          fullWidth
                          className={`shadow-lg transition-all ${THEME.accentBg}`}
                        >
                          <Send size={16} />
                          Send Message
                        </Button>
                      </motion.div>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.2,
                          type: 'spring',
                          stiffness: 200,
                        }}
                        className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full ${THEME.badges.email}`}
                      >
                        <CheckCircle2 size={40} />
                      </motion.div>
                      <h3 className="text-2xl font-bold">Message Sent!</h3>
                      <p className="mt-3 max-w-sm text-slate-600 dark:text-slate-300">
                        Thank you for reaching out. We'll get back to you within
                        24 hours.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({
                            name: '',
                            email: '',
                            subject: '',
                            message: '',
                          });
                        }}
                        className={`mt-6 text-sm font-semibold hover:underline ${THEME.accentText}`}
                      >
                        Send another message
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className={`${glassCard} mx-auto max-w-3xl rounded-3xl p-10 text-center sm:p-14`}
        >
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Looking for Quick Answers?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-slate-600 dark:text-slate-300">
            Check our FAQ page for instant answers to the most common questions.
          </p>
          <div className="mt-8">
            <Link to={ROUTES.FAQ}>
              <Button
                size="lg"
                className={`shadow-lg transition-all ${THEME.accentBg}`}
              >
                Visit FAQ
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
