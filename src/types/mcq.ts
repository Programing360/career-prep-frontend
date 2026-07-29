export interface MCQOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface MCQQuestion {
  id: string;
  question: string;
  imageUrl?: string;
  options: MCQOption[];
  explanation: string;
  topicId: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  formulaNotation?: string;
}

export interface MCQFilterState {
  topicId?: string;
  difficulty?: string;
  page: number;
}

export interface MCQUserProgress {
  answeredCount: number;
  correctCount: number;
  history: Record<string, { selectedOptionId: string; isCorrect: boolean }>;
}
