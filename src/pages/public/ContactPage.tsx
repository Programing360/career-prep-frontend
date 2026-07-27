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
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { Link } from 'react-router-dom';

const glassCard =
  'backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border border-white/20 dark:border-gray-800/50 shadow-xl shadow-black/5';

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
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
  },
  {
    icon: MapPin,
    title: 'Location',
    detail: 'Lahore, Punjab, Pakistan',
    subtext: 'Serving students nationwide',
    color:
      'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400',
  },
  {
    icon: Clock,
    title: 'Response Time',
    detail: 'Within 24 Hours',
    subtext: 'Mon – Sat, 9 AM – 6 PM',
    color:
      'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
  },
  {
    icon: Phone,
    title: 'Phone',
    detail: '+92 300 1234567',
    subtext: 'Available during business hours',
    color:
      'bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400',
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
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-50/50 px-4 py-24 dark:bg-[#0a1328] sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-10 top-20 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-20 right-10 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

        <motion.div
          className="relative mx-auto max-w-3xl text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/50"
          >
            <MessageSquare
              size={32}
              className="text-blue-600 dark:text-blue-400"
            />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl"
          >
            Get in{' '}
            <span className="text-blue-600 dark:text-blue-400">Touch</span>
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
      <section className="bg-white px-4 py-16 dark:bg-slate-900 sm:px-6 lg:px-8">
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
                className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
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
                      className={`${glassCard} flex items-start gap-4 rounded-2xl p-5 transition-colors hover:border-blue-300/50 dark:hover:border-blue-700/50`}
                    >
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.color}`}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {item.title}
                        </p>
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
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        Send us a Message
                      </h3>

                      {/* Name */}
                      <div className="relative">
                        <label
                          htmlFor="name"
                          className={`absolute left-4 transition-all ${
                            focusedField === 'name' || formData.name
                              ? 'top-2 text-xs font-medium text-blue-600 dark:text-blue-400'
                              : 'top-3.5 text-sm text-slate-400 dark:text-slate-500'
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
                          className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 pb-2 pt-7 text-sm text-slate-900 backdrop-blur-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
                        />
                      </div>

                      {/* Email */}
                      <div className="relative">
                        <label
                          htmlFor="email"
                          className={`absolute left-4 transition-all ${
                            focusedField === 'email' || formData.email
                              ? 'top-2 text-xs font-medium text-blue-600 dark:text-blue-400'
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
                          className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 pb-2 pt-7 text-sm text-slate-900 backdrop-blur-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
                        />
                      </div>

                      {/* Subject */}
                      <div className="relative">
                        <label
                          htmlFor="subject"
                          className={`absolute left-4 transition-all ${
                            focusedField === 'subject' || formData.subject
                              ? 'top-2 text-xs font-medium text-blue-600 dark:text-blue-400'
                              : 'top-3.5 text-sm text-slate-400 dark:text-slate-500'
                          }`}
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
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-white/50 px-4 pb-2 pt-7 text-sm text-slate-900 backdrop-blur-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
                        >
                          <option value="">Select a topic</option>
                          <option value="general">General Inquiry</option>
                          <option value="support">Technical Support</option>
                          <option value="feedback">Feedback</option>
                          <option value="partnership">Partnership</option>
                          <option value="bug">Report a Bug</option>
                          <option value="content">Content Correction</option>
                        </select>
                      </div>

                      {/* Message */}
                      <div className="relative">
                        <label
                          htmlFor="message"
                          className={`absolute left-4 transition-all ${
                            focusedField === 'message' || formData.message
                              ? 'top-2 text-xs font-medium text-blue-600 dark:text-blue-400'
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
                          className="w-full resize-none rounded-xl border border-slate-200 bg-white/50 px-4 pb-2 pt-7 text-sm text-slate-900 backdrop-blur-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
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
                          className="bg-gray-900 text-white shadow-md transition-all hover:bg-gray-800 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-100"
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
                        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50"
                      >
                        <CheckCircle2
                          size={40}
                          className="text-emerald-600 dark:text-emerald-400"
                        />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Message Sent!
                      </h3>
                      <p className="mt-3 max-w-sm text-slate-600 dark:text-slate-300">
                        Thank you for reaching out. We'll get back to you within
                        24 hours.
                      </p>
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({
                            name: '',
                            email: '',
                            subject: '',
                            message: '',
                          });
                        }}
                        className="mt-6 text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
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

      {/* CTA */}
      <section className="bg-slate-50/50 px-4 py-20 dark:bg-[#0a1328] sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className={`${glassCard} mx-auto max-w-3xl rounded-3xl p-10 text-center sm:p-14`}
        >
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Looking for Quick Answers?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-slate-600 dark:text-slate-300">
            Check our FAQ page for instant answers to the most common questions.
          </p>
          <div className="mt-8">
            <Link to={ROUTES.FAQ}>
              <Button
                size="lg"
                className="bg-gray-900 text-white shadow-md transition-all hover:bg-gray-800 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-100"
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
