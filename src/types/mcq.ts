export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface MCQOption {
  id: string; // e.g. "a", "b", "c", "d"
  text: string; // Option content
  isCorrect?: boolean; // Used for frontend rendering / local practice validation
}

export interface MCQQuestion {
  _id: string; // Database ID
  question: string;
  questionText?: string; // Backend field name (also mapped to question)
  options: MCQOption[];
  explanation?: string; // Optional field
  topicId: string; // Foreign key to Taxonomy Topic
  chapterId?: string;
  subjectId?: string;
  difficulty: DifficultyLevel;
  marks?: number;
  negativeMarks?: number;
  tags?: string[];
  imageUrl?: string;
  formulaNotation?: string;
}

export interface MCQFilterState {
  topicId?: string;
  difficulty?: DifficultyLevel;
  page: number;
}

export interface MCQUserProgress {
  answeredCount: number;
  correctCount: number;
  history: Record<
    string,
    {
      selectedOptionId: string;
      isCorrect: boolean;
      correctOptionId?: string | null;
      explanation?: string;
    }
  >;
}

/** Standard submission answer payload for a single MCQ. */
export interface MCQSubmissionAnswer {
  questionId: string;
  selectedOptionId: string;
}

/** Standard submission payload containing a list of MCQ answers. */
export interface MCQSubmissionPayload {
  answers: MCQSubmissionAnswer[];
}
