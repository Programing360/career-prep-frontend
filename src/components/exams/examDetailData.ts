import type { DirectoryExam } from '@/types';
import type { ExamRoadmapData, ExamSyllabusData } from '@/services/examService';

export interface SubTopic {
  name: string;
  mcqWeightage?: number;
}

export interface SubjectTopic {
  name: string;
  mcqWeightage?: number;
  subtopics?: SubTopic[];
}

export interface PhysicalStandardsDetail {
  heightMale?: string;
  heightFemale?: string;
  chest?: string;
  medical?: string;
  physicalTest?: string;
}

export interface ExamData {
  id: string;
  slug: string;
  title: string;
  category: string;
  agency: string;
  year: string;
  description: string;
  totalQuestions: number;
  duration: number;
  passingMarks: number;
  totalMarks: number;
  verifiedOrganization?: string;
  verifiedDate?: string;
  eligibility: {
    education: string;
    ageLimit?: { min: number; max: number };
    experience?: string;
    domicile?: string[];
    physicalStandards?: string;
    physicalStandardsDetail?: PhysicalStandardsDetail;
  };
  subjects: {
    id: string;
    name: string;
    weightage: number;
    topics: (string | SubjectTopic)[];
  }[];
  pattern: {
    type: 'mcq' | 'subjective' | 'both';
    sections: {
      name: string;
      questionCount: number;
      marksPerQuestion: number;
      timeLimit?: number;
    }[];
    negativeMarking: boolean;
    negativeMarksPerWrong?: number;
  };
}

export interface SamplePastPaper {
  id: string;
  year: string;
  title: string;
  paperCode: string;
  questionCount: number;
  isFree: boolean;
}

export interface RoadmapPhase {
  id: string;
  phase: string;
  title: string;
  duration: string;
  topics: string[];
  status: 'upcoming' | 'in-progress' | 'completed';
}

export const categoryColorMap: Record<string, string> = {
  fpsc: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
  ppsc: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  nts: 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
  kppsc: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
  bpsc: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
  spsc: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export function getTopicName(topic: string | SubjectTopic): string {
  return typeof topic === 'string' ? topic : topic.name;
}

export function getTopicWeightage(
  topic: string | SubjectTopic
): number | undefined {
  return typeof topic === 'object' ? topic.mcqWeightage : undefined;
}

export function getTopicSubtopics(
  topic: string | SubjectTopic
): SubTopic[] | undefined {
  return typeof topic === 'object' ? topic.subtopics : undefined;
}

// ==========================================
// SYLLABUS & ROADMAP API → UI MAPPING
// ==========================================

/**
 * Map the backend syllabus payload (subjectsBreakdown + joined subject/topic
 * references) into the `ExamData.subjects` shape consumed by the tabs.
 */
export function mapSyllabusSubjectsToExamData(
  syllabus: ExamSyllabusData
): ExamData['subjects'] {
  const subjectIndex = new Map(
    (syllabus.joinedSubjects ?? []).map((s) => [s._id, s])
  );
  const topicIndex = new Map(
    (syllabus.joinedTopics ?? []).map((t) => [t._id, t])
  );

  return (syllabus.subjectsBreakdown ?? []).map((sb, index) => {
    const joinedSubject = subjectIndex.get(sb.subjectId);
    const topics: (string | SubjectTopic)[] = (sb.specificTopics ?? [])
      .map((topicId) => topicIndex.get(topicId)?.title)
      .filter((title): title is string => Boolean(title));

    return {
      id: sb.subjectId || String(index),
      name: joinedSubject?.title ?? `Subject ${index + 1}`,
      weightage: sb.marks ?? sb.weightagePercentage ?? 0,
      topics,
    };
  });
}

/**
 * Map the backend roadmap payload into the `RoadmapPhase` shape consumed by
 * the roadmap tab. Backend phases have no completion status, so they default
 * to "upcoming".
 */
export function mapRoadmapDataToPhases(
  roadmap: ExamRoadmapData
): RoadmapPhase[] {
  return (roadmap.phases ?? []).map((phase) => ({
    id: `phase-${phase.phaseNumber}`,
    phase: `Phase ${phase.phaseNumber}`,
    title: phase.title,
    duration: `${phase.durationWeeks} weeks`,
    topics: [],
    status: 'upcoming',
  }));
}

// ==========================================
// EXAM DIRECTORY → ExamData MAPPING
// ==========================================

function examYear(exam: DirectoryExam): string {
  const candidates = [
    exam.expectedExamDate,
    exam.applicationStartDate,
    exam.applicationDeadline,
    exam.audit.verifiedAt,
    exam.createdAt,
  ];
  for (const value of candidates) {
    if (!value) continue;
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return String(parsed.getFullYear());
  }
  return String(new Date().getFullYear());
}

function examDescription(exam: DirectoryExam): string {
  if (exam.departmentName && exam.bpsScale) {
    return `${exam.conductingAuthority} is conducting ${exam.title} (BPS-${exam.bpsScale}) for ${exam.departmentName}. Check the official notification for the latest application timeline and eligibility details.`;
  }
  if (exam.departmentName) {
    return `${exam.conductingAuthority} is conducting ${exam.title} for ${exam.departmentName}. Check the official notification for the latest application timeline and eligibility details.`;
  }
  return `${exam.title} is a competitive exam conducted by ${exam.conductingAuthority}. Check the official notification for the latest application timeline and eligibility details.`;
}

/**
 * Map a backend Exam Directory profile (DirectoryExam) into the ExamData
 * shape consumed by the exam detail tabs.
 */
export function mapDirectoryExamToExamData(exam: DirectoryExam): ExamData {
  const {
    totalMarks,
    durationMinutes,
    negativeMarking,
    negativeMarkingValue,
    format,
    passingPercentage,
  } = exam.examPattern;
  const passingMarks = passingPercentage
    ? Math.round((totalMarks * passingPercentage) / 100)
    : Math.round(totalMarks * 0.5);

  const subjects = (exam.subjects ?? []).map((subject, index, arr) => ({
    id: subject._id || subject.code || String(index),
    name: subject.title,
    weightage:
      arr.length > 0 ? Math.round(totalMarks / arr.length) : totalMarks,
    topics: [] as (string | SubjectTopic)[],
  }));

  return {
    id: exam._id,
    slug: exam.slug,
    title: exam.title,
    category: exam.conductingAuthority.toLowerCase(),
    agency: exam.conductingAuthority,
    year: examYear(exam),
    description: examDescription(exam),
    totalQuestions: totalMarks,
    duration: durationMinutes,
    passingMarks,
    totalMarks,
    verifiedOrganization: exam.audit.isVerified
      ? exam.conductingAuthority
      : undefined,
    verifiedDate: exam.audit.verifiedAt
      ? new Date(exam.audit.verifiedAt).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        })
      : undefined,
    eligibility: {
      education: exam.eligibility.qualificationRequired,
      ageLimit: {
        min: exam.eligibility.minAge,
        max: exam.eligibility.maxAge,
      },
      domicile: exam.eligibility.eligibleDomiciles,
    },
    subjects,
    pattern: {
      type:
        format === 'mcq'
          ? 'mcq'
          : format === 'descriptive'
            ? 'subjective'
            : 'both',
      sections: [
        {
          name:
            format === 'mcq'
              ? 'MCQ Section'
              : format === 'descriptive'
                ? 'Descriptive Section'
                : 'Hybrid Paper',
          questionCount: totalMarks,
          marksPerQuestion: 1,
          timeLimit: durationMinutes,
        },
      ],
      negativeMarking,
      negativeMarksPerWrong: negativeMarkingValue,
    },
  };
}
