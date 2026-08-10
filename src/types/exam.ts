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

export interface MCQ {
  id: string;
  examId: string;
  subjectId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
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
  'federal' | 'provincial' | 'armed_forces' | 'testing_service';

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

/** Single exam profile as returned by the Exam Directory API (mirror of IExam) */
export interface DirectoryExam {
  _id: string;
  title: string;
  slug: string;
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
