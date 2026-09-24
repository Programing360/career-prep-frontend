import type { MCQQuestion } from './mcq';

/**
 * Canonical MCQ schema. Previously this file declared a conflicting local
 * `MCQ` interface; it now reuses the shared type from `./mcq` so every module
 * (practice, exam-attempt, mock-test) speaks the same vocabulary.
 */
export type MCQ = MCQQuestion;

export interface Exam {
  id: string;
  title: string;
  category: ExamCategory;
  subjects: Subject[];
  eligibility: Eligibility;
  syllabus: string[];
  pattern: ExamPattern;
  isFollowed: boolean;
  description?: string;
  totalQuestions: number;
  duration: number;
  passingMarks: number;
  totalMarks: number;
  createdAt: string;
  updatedAt: string;
}

export type ExamCategory = 'css' | 'pcs' | 'fpsc' | 'ppsc' | 'nts' | 'other';

export interface Subject {
  id: string;
  name: string;
  weightage: number;
  topics: string[];
}

export interface Eligibility {
  education: string;
  ageLimit?: { min: number; max: number };
  experience?: string;
  domicile?: string[];
}

export interface ExamPattern {
  type: 'mcq' | 'subjective' | 'both';
  sections: ExamSection[];
  negativeMarking: boolean;
  negativeMarksPerWrong?: number;
}

export interface ExamSection {
  name: string;
  questionCount: number;
  marksPerQuestion: number;
  timeLimit?: number;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  score?: number;
  status: 'in_progress' | 'completed' | 'abandoned';
}

// ==========================================
// EXAM DIRECTORY CONTRACT
// Mirrors the backend IExam schema (careerprep-backend/src/modules/exam/exam.interface.ts)
// ==========================================

export type ConductingAuthority =
  | 'FPSC'
  | 'PPSC'
  | 'KPPSC'
  | 'SPSC'
  | 'BPSC'
  | 'AJKPSC'
  | 'GBPSC'
  | 'NTS'
  | 'PTS'
  | 'OTS'
  | 'ETEA'
  | 'STS'
  | 'PAK_ARMY'
  | 'PAK_NAVY'
  | 'PAK_AIR_FORCE'
  | 'POLICE'
  | 'OTHER';

export type JurisdictionCategory =
  | 'federal'
  | 'provincial'
  | 'armed_forces'
  | 'armed-forces'
  | 'banking'
  | 'testing_service'
  | 'others';

export type Province =
  | 'Federal'
  | 'Punjab'
  | 'KPK'
  | 'Sindh'
  | 'Balochistan'
  | 'AJK'
  | 'Gilgit-Baltistan'
  | 'Nationwide';

export interface ExamEligibility {
  minAge: number;
  maxAge: number;
  ageRelaxationYears?: number;
  qualificationRequired: string;
  minimumGradeOrCgpa?: string;
  allowedGender: 'male' | 'female' | 'both' | 'transgender';
  eligibleDomiciles: Province[];
}

export interface ExamPatternSchema {
  totalMarks: number;
  durationMinutes: number;
  negativeMarking: boolean;
  negativeMarkingValue?: number;
  format: 'mcq' | 'descriptive' | 'hybrid';
  passingPercentage?: number;
}

export interface ExamSelectionStage {
  stageNumber: number;
  title: string;
  description?: string;
  isEliminationStage: boolean;
}

export interface ExamAudit {
  sourceUrl: string;
  isScraped: boolean;
  isVerified: boolean;
  verifiedBy?: string;
  updatedBy?: string;
  verifiedAt?: string | null;
  lastScrapedAt?: string | null;
  officialNotificationUrl?: string;
}

/** Minimal subject ref returned by the backend $lookup on GET /exams/:slug */
export interface DirectorySubjectRef {
  _id: string;
  title: string;
  code?: string;
  icon?: string;
}

// ==========================================
// ADMIN EXAM CREATION & MCQ MANAGEMENT
// ==========================================

export interface AdminMCQOption {
  optionId: string; // e.g., "A", "B", "C", "D"
  optionText: string;
  isCorrect: boolean;
}

export interface AdminQuestion {
  questionId: string;
  questionText: string;
  explanation?: string;
  marks: number;
  subjectTag?: string;
  options: AdminMCQOption[];
}

export interface AdminSelectionStageDraft {
  stageNumber: number;
  title: string;
  description: string;
  isEliminationStage: boolean;
}

export interface AdminExamDetails {
  title: string;
  slug: string;
  conductingAuthority: string;
  category: string;
  province: string;
  bpsScale: string;
  departmentName: string;
  advertisementNumber: string;
  applicationStartDate: string;
  applicationDeadline: string;
  expectedExamDate: string;
  minAge: string;
  maxAge: string;
  ageRelaxationYears: string;
  qualificationRequired: string;
  minimumGradeOrCgpa: string;
  allowedGender: string;
  eligibleDomiciles: string;
  totalMarks: string;
  durationMinutes: string;
  negativeMarking: string;
  negativeMarkingValue: string;
  passingPercentage: string;
  format: string;
  selectionProcess: AdminSelectionStageDraft[];
  categoryRef: string;
  targetSubjects: string[];
  sourceUrl: string;
  officialNotificationUrl: string;
  imageUrl: string;
  questions?: AdminQuestion[];
}

/** Single exam profile as returned by the Exam Directory API (mirror of IExam) */
export interface DirectoryExam {
  _id: string;
  title: string;
  slug: string;
  imageUrl: string;
  conductingAuthority: ConductingAuthority;
  category: JurisdictionCategory;
  province: Province;
  bpsScale?: number;
  departmentName?: string;
  advertisementNumber?: string;
  applicationStartDate?: string | null;
  applicationDeadline?: string | null;
  expectedExamDate?: string | null;
  eligibility: ExamEligibility;
  examPattern: ExamPatternSchema;
  selectionProcess?: ExamSelectionStage[];
  categoryRef?: string;
  targetSubjects?: string[];
  subjects?: DirectorySubjectRef[];
  trustVerification?: {
    authority: ConductingAuthority;
    verifiedAt?: string | null;
    sourceUrl?: string;
    officialLink?: string;
  };
  isActive: boolean;
  audit: ExamAudit;
  createdAt?: string;
  updatedAt?: string;
}
