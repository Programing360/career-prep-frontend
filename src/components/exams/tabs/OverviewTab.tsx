import { motion } from 'framer-motion';
import {
  GraduationCap,
  Users,
  CheckCircle2,
  MapPin,
  Scale,
  BadgeCheck,
  Ruler,
  Activity,
  HeartPulse,
  Dumbbell,
} from 'lucide-react';
import type { ExamData } from '@/components/exams/examDetailData';

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

export function OverviewTab({ exam }: { exam: ExamData }) {
  const hasPhysicalDetail = !!exam.eligibility.physicalStandardsDetail;

  const baseCards = [
    {
      icon: GraduationCap,
      title: 'Education',
      value: exam.eligibility.education,
    },
    {
      icon: Users,
      title: 'Age Limit',
      value: exam.eligibility.ageLimit
        ? `${exam.eligibility.ageLimit.min} – ${exam.eligibility.ageLimit.max} years`
        : 'No age limit',
    },
    {
      icon: CheckCircle2,
      title: 'Experience',
      value: exam.eligibility.experience || 'Not required',
    },
    {
      icon: MapPin,
      title: 'Domicile',
      value: exam.eligibility.domicile?.join(', ') || 'All Pakistan',
    },
    {
      icon: Scale,
      title: 'Negative Marking',
      value: exam.pattern.negativeMarking
        ? `Yes (-${exam.pattern.negativeMarksPerWrong} per wrong)`
        : 'No negative marking',
    },
  ];

  const ps = exam.eligibility.physicalStandardsDetail;
  const physicalCards = ps
    ? [
        { icon: Ruler, title: 'Height (Male)', value: ps.heightMale },
        { icon: Ruler, title: 'Height (Female)', value: ps.heightFemale },
        { icon: Activity, title: 'Chest', value: ps.chest },
        { icon: HeartPulse, title: 'Medical', value: ps.medical },
        { icon: Dumbbell, title: 'Physical Test', value: ps.physicalTest },
      ].filter((c) => !!c.value)
    : [];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      {/* Verified Badge */}
      {exam.verifiedOrganization && (
        <motion.div
          variants={fadeInUp}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
        >
          <BadgeCheck size={16} className="text-emerald-500" />
          Verified from {exam.verifiedOrganization} official notification on{' '}
          {exam.verifiedDate}
        </motion.div>
      )}

      <motion.h3
        variants={fadeInUp}
        className="mb-2 text-lg font-bold font-heading text-gray-900 dark:text-white"
      >
        Exam Overview & Eligibility
      </motion.h3>
      <motion.p
        variants={fadeInUp}
        className="mb-6 text-sm text-gray-500 dark:text-gray-400"
      >
        Check if you meet the criteria before applying.
      </motion.p>

      {/* Base Eligibility Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {baseCards.map((item) => (
          <motion.div
            key={item.title}
            variants={fadeInUp}
            className="rounded-xl border border-white/20 bg-white/70 p-5 backdrop-blur-md transition-all hover:shadow-lg dark:border-gray-800/50 dark:bg-gray-900/70"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <item.icon
                  size={17}
                  className="text-gray-600 dark:text-gray-400"
                />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                {item.title}
              </h4>
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Conditional Physical Standards Section */}
      {hasPhysicalDetail && (
        <motion.div variants={fadeInUp} className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <Dumbbell size={18} className="text-primary-500" />
            <h4 className="text-base font-bold font-heading text-gray-900 dark:text-white">
              Physical Standards & Requirements
            </h4>
          </div>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Mandatory physical requirements for this uniformed forces position.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {physicalCards.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                className="rounded-xl border border-white/20 bg-white/70 p-5 backdrop-blur-md transition-all hover:shadow-lg dark:border-gray-800/50 dark:bg-gray-900/70"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <item.icon
                      size={17}
                      className="text-gray-600 dark:text-gray-400"
                    />
                  </div>
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h5>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {item.value}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Fallback: simple physical standards text if no detail breakdown */}
      {!hasPhysicalDetail && exam.eligibility.physicalStandards && (
        <motion.div variants={fadeInUp} className="mt-8">
          <div className="rounded-xl border border-white/20 bg-white/70 p-5 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <Dumbbell
                  size={17}
                  className="text-gray-600 dark:text-gray-400"
                />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Physical Standards
              </h4>
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {exam.eligibility.physicalStandards}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
