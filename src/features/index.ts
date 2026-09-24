export {
  authReducer,
  setCredentials,
  logout,
  updateUserProgress,
  setLoading,
  hydrateFromStorage,
} from '../store/slices/authSlice';

export {
  practiceReducer,
  setSubject,
  setFilterMode,
  setCurrentIndex,
  goToNextQuestion,
  goToPreviousQuestion,
  answerQuestion,
  toggleBookmark,
  setNote,
  toggleExplanation,
  loadQuestions,
  resetPractice,
} from '../store/slices/practiceSlice';

export type { AnswerState, FilterMode } from '../store/slices/practiceSlice';

export {
  examAttemptReducer,
  initExam,
  selectOption,
  clearResponse,
  toggleMarkForReview,
  goToQuestion,
  tickTimer,
  setShowSubmitModal,
  submitExam,
  resetExam,
} from '../store/slices/examAttemptSlice';

export type {
  QuestionStatus,
  ExamResult,
} from '../store/slices/examAttemptSlice';

export {
  aiTutorReducer,
  sendMessage,
  receiveResponse,
  setStreaming,
  setActiveView,
  setActiveFeature,
  clearChat,
  logTokenUsage,
  buyTokenPack,
  upgradeToPremium,
  startQuiz,
  answerQuizQuestion,
  submitQuiz,
  closeQuiz,
} from '../store/slices/aiTutorSlice';

export type {
  ChatMessage,
  TokenUsageEntry,
  QuizQuestion,
  TutorView,
} from '../store/slices/aiTutorSlice';
