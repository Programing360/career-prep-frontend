export interface DailyQuizOption {
  id: string;
  text: string;
}

export interface DailyQuizQuestion {
  id: string;
  text: string;
  options: DailyQuizOption[];
  correctAnswerId: string;
  explanation: string;
}

export interface DailyQuiz {
  id: string;
  quizDate: string;
  title: string;
  category: string;
  questions: DailyQuizQuestion[];
}

export interface DailyQuizAttempt {
  quizId: string;
  score: number;
  totalQuestions: number;
  answers: Record<string, string>;
  completedAt: string;
}
