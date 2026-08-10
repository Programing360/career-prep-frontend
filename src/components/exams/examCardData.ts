import type { DirectoryExam } from '@/types';

export interface ExamCardData {
  id: string;
  slug: string;
  title: string;
  agency: string;
  agencyKey: string;
  grade: string;
  year: string;
  questionCount: number;
  category: string;
  sector: string;
  popularity: number;
  verified: boolean;
}

/** Map a backend DirectoryExam into the display shape used by ExamCard. */
export function mapDirectoryExamToExamCard(exam: DirectoryExam): ExamCardData {
  const yearCandidates = [
    exam.expectedExamDate,
    exam.applicationStartDate,
    exam.applicationDeadline,
    exam.audit.verifiedAt,
    exam.createdAt,
  ].filter((value): value is string => Boolean(value));

  const parsedYear = yearCandidates
    .map((value) => new Date(value).getFullYear())
    .find((year) => !Number.isNaN(year));

  return {
    id: exam._id,
    slug: exam.slug,
    title: exam.title,
    agency: exam.conductingAuthority,
    agencyKey: exam.conductingAuthority,
    grade: exam.bpsScale ? `BPS-${exam.bpsScale}` : 'BPS-N/A',
    year: parsedYear ? String(parsedYear) : '—',
    questionCount: exam.examPattern.totalMarks,
    category: exam.category,
    sector: exam.category,
    popularity: 0,
    verified: exam.audit.isVerified,
  };
}
