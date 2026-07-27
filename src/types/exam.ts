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
