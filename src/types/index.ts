export type {
  UserRole,
  User,
  StudentProgress,
  Badge,
  Streak,
  RegisterInput,
  RegisterResponse,
  LoginInput,
  LoginResponse,
  VerifyOtpInput,
  ResendOtpInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  AuthMeResponse,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from './auth';

export type {
  Exam,
  ExamCategory,
  Subject,
  Eligibility,
  ExamPattern,
  ExamSection,
  ExamAttempt,
  MCQ,
  ConductingAuthority,
  JurisdictionCategory,
  Province,
  ExamEligibility,
  ExamPatternSchema,
  ExamSelectionStage,
  ExamAudit,
  DirectorySubjectRef,
  DirectoryExam,
} from './exam';

export type {
  SubscriptionTier,
  SubscriptionPlan,
  PlanLimits,
  TokenPack,
  PaymentMethod,
  PaymentPayload,
  PaymentResponse,
} from './premium';

export type {
  MCQOption,
  MCQQuestion,
  MCQFilterState,
  MCQUserProgress,
} from './mcq';

export type { SourceType, PastPaper, PastPaperFilterState } from './pastPaper';

export type {
  CurrentAffairsItem,
  CurrentAffairsFilter,
} from './currentAffairs';

export type {
  DailyQuizOption,
  DailyQuizQuestion,
  DailyQuiz,
  DailyQuizAttempt,
} from './dailyQuiz';

export type {
  LeaderboardTimeWindow,
  LeaderboardEntry,
  LeaderboardFilter,
  LeaderboardPaginatedResponse,
  LeaderboardExamOption,
} from './leaderboard';

export type {
  TestType,
  QuestionType,
  MockTestStatus,
  ApiResponse,
  MockOption,
  MockQuestion,
  UserAnswer,
  MockTestSession,
  SubjectBreakdown,
  MockTestResult,
  MockTestStartRequest,
  MockTestSubmitRequest,
  MockTestSessionDetail,
} from './mockTest';
