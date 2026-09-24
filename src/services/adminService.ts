import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import type { UserRole } from '@/types/auth';
import type { AdminQuestion } from '@/types/exam';

// ==========================================
// TYPES (mirror the backend API contracts)
// ==========================================

/** Query params accepted by GET /admin/users */
export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  isBanned?: 'true' | 'false';
  subscriptionStatus?: 'free' | 'active' | 'expired';
  targetExam?: string;
}

/** Pagination envelope returned by the backend */
export interface AdminPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** A single user as returned by the admin aggregation pipeline */
export interface AdminUser {
  _id: string;
  email: string;
  role: UserRole;
  name?: string;
  phone?: string;
  avatar?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  isBanned: boolean;
  banReason?: string;
  bannedAt?: string | null;
  isLocked?: boolean;
  failedLoginAttempts?: number;
  subscriptionStatus: 'free' | 'active' | 'expired';
  subscriptionPlan?: {
    _id: string;
    name?: string;
    price?: number;
    billingCycle?: string;
    aiTokenLimit?: number;
  } | null;
  aiTokenBalance: number;
  targetExams?: Array<{
    _id: string;
    title?: string;
    category?: string;
    province?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetUsersResponse {
  success: boolean;
  data: AdminUser[];
  pagination: AdminPagination;
}

/** Payload for PATCH /admin/users/:id/role */
export interface UpdateUserRolePayload {
  role: UserRole;
}

/** Payload for PATCH /admin/users/:id/subscription */
export interface UpdateSubscriptionPayload {
  subscriptionStatus?: 'free' | 'active' | 'expired';
  subscriptionPlanId?: string;
  aiTokenBalance?: number;
}

/** Complete profile for a single user (GET /admin/users/:id) */
export interface AdminUserDetail extends AdminUser {
  failedLoginAttempts?: number;
  isLocked?: boolean;
  subscriptionPlan?: {
    _id: string;
    name?: string;
    price?: number;
    billingCycle?: string;
    aiTokenLimit?: number;
  } | null;
  targetExams?: Array<{
    _id: string;
    title?: string;
    category?: string;
    province?: string;
  }>;
}

/** Candidate learning history (GET /admin/users/:id/history) */
export interface UserLearningHistory {
  userId: string;
  email: string;
  totalTestsTaken: number;
  averageScorePercentage: number;
  weakTopics: string[];
  recentAttempts: Array<{
    _id?: string;
    examId?: string;
    examTitle?: string;
    score?: number;
    totalMarks?: number;
    percentage?: number;
    takenAt?: string;
  }>;
}

/** Payload for PATCH /admin/users/:id/preferences */
export interface UpdateUserPreferencesPayload {
  targetExams: string[];
}

/** A single unverified exam as returned by GET /exams/admin/queue */
export interface QueueExam {
  _id: string;
  title: string;
  slug: string;
  conductingAuthority: string;
  category: string;
  province: string;
  bpsScale?: number;
  departmentName?: string;
  advertisementNumber?: string;
  applicationStartDate?: string | null;
  applicationDeadline?: string | null;
  expectedExamDate?: string | null;
  eligibility?: {
    minAge: number;
    maxAge: number;
    qualificationRequired: string;
    allowedGender: string;
    eligibleDomiciles: string[];
  };
  examPattern?: {
    totalMarks: number;
    durationMinutes: number;
    negativeMarking: boolean;
    format: string;
  };
  isActive: boolean;
  audit: {
    sourceUrl?: string;
    isScraped: boolean;
    isVerified: boolean;
    verifiedBy?: string;
    verifiedAt?: string | null;
    officialNotificationUrl?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface GetExamsQueueResponse {
  success: boolean;
  message?: string;
  data: QueueExam[];
  meta: AdminPagination;
}

/** Payload for POST /exams (CreateExamSchema from the backend) */
export interface CreateExamPayload {
  title: string;
  slug: string;
  conductingAuthority: string;
  category:
    | 'federal'
    | 'provincial'
    | 'armed-forces'
    | 'armed_forces'
    | 'banking'
    | 'testing_service'
    | 'others';
  province: string;
  bpsScale: number;
  departmentName: string;
  advertisementNumber?: string;
  applicationStartDate?: string;
  applicationDeadline?: string;
  expectedExamDate?: string;
  eligibility: {
    minAge: number;
    maxAge: number;
    ageRelaxationYears?: number;
    qualificationRequired: string;
    minimumGradeOrCgpa?: string;
    allowedGender: 'male' | 'female' | 'both' | 'transgender';
    eligibleDomiciles: string[];
  };
  examPattern: {
    totalMarks: number;
    durationMinutes: number;
    negativeMarking: boolean;
    negativeMarkingValue?: number;
    format: 'mcq' | 'descriptive' | 'hybrid';
    passingPercentage?: number;
  };
  selectionProcess?: Array<{
    stageNumber: number;
    title: string;
    description?: string;
    isEliminationStage?: boolean;
  }>;
  categoryRef?: string;
  targetSubjects?: string[];
  sourceUrl?: string;
  officialNotificationUrl?: string;
  imageUrl?: string;
}

interface ApiSuccessResponse {
  success: boolean;
  message?: string;
}

// ==========================================
// ADMIN API METHODS
// ==========================================

/**
 * List users with pagination, search, and role/ban/subscription filters.
 * GET /api/v1/admin/users
 */
export async function getUsers(
  params?: GetUsersParams
): Promise<GetUsersResponse> {
  const { data } = await api.get<GetUsersResponse>(
    API_ENDPOINTS.ADMIN_USERS.BASE,
    { params }
  );
  return data;
}

/**
 * Update a user's role.
 * PATCH /api/v1/admin/users/:id/role
 */
export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<ApiSuccessResponse> {
  const { data } = await api.patch<ApiSuccessResponse>(
    API_ENDPOINTS.ADMIN_USERS.ROLE(userId),
    { role }
  );
  return data;
}

/**
 * Ban a user account with an optional reason.
 * PATCH /api/v1/admin/users/:id/ban
 */
export async function banUser(
  userId: string,
  reason?: string
): Promise<ApiSuccessResponse> {
  const { data } = await api.patch<ApiSuccessResponse>(
    API_ENDPOINTS.ADMIN_USERS.BAN(userId),
    { isBanned: true, banReason: reason }
  );
  return data;
}

/**
 * Lift an active ban.
 * PATCH /api/v1/admin/users/:id/ban
 */
export async function unbanUser(userId: string): Promise<ApiSuccessResponse> {
  const { data } = await api.patch<ApiSuccessResponse>(
    API_ENDPOINTS.ADMIN_USERS.BAN(userId),
    { isBanned: false }
  );
  return data;
}

/**
 * Admin-forced password reset. The backend exposes this as POST (not PATCH).
 * POST /api/v1/admin/users/:id/reset-password
 */
export async function resetUserPassword(
  userId: string,
  newPassword: string
): Promise<ApiSuccessResponse> {
  const { data } = await api.post<ApiSuccessResponse>(
    API_ENDPOINTS.ADMIN_USERS.RESET_PASSWORD(userId),
    { newPassword }
  );
  return data;
}

/**
 * Manage a user's subscription plan, status, and AI token balance.
 * PATCH /api/v1/admin/users/:id/subscription
 */
export async function updateUserSubscription(
  userId: string,
  payload: UpdateSubscriptionPayload
): Promise<ApiSuccessResponse> {
  const { data } = await api.patch<ApiSuccessResponse>(
    API_ENDPOINTS.ADMIN_USERS.SUBSCRIPTION(userId),
    payload
  );
  return data;
}

/**
 * Fetch the complete profile for a single user.
 * GET /api/v1/admin/users/:id
 */
export async function getUserById(
  userId: string
): Promise<{ success: boolean; data: AdminUserDetail }> {
  const { data } = await api.get<{ success: boolean; data: AdminUserDetail }>(
    API_ENDPOINTS.ADMIN_USERS.BY_ID(userId)
  );
  return data;
}

/**
 * Fetch a candidate's practice history, test scores, and weak topics.
 * GET /api/v1/admin/users/:id/history
 */
export async function getUserLearningHistory(
  userId: string
): Promise<{ success: boolean; data: UserLearningHistory }> {
  const { data } = await api.get<{
    success: boolean;
    data: UserLearningHistory;
  }>(API_ENDPOINTS.ADMIN_USERS.HISTORY(userId));
  return data;
}

/**
 * Update a candidate's target exam preferences.
 * PATCH /api/v1/admin/users/:id/preferences
 */
export async function updateUserPreferences(
  userId: string,
  payload: UpdateUserPreferencesPayload
): Promise<ApiSuccessResponse> {
  const { data } = await api.patch<ApiSuccessResponse>(
    API_ENDPOINTS.ADMIN_USERS.PREFERENCES(userId),
    payload
  );
  return data;
}

/**
 * Fetch unverified exams waiting for admin review.
 * GET /api/v1/exams/admin/queue
 */
export async function getExamsQueue(params?: {
  page?: number;
  limit?: number;
}): Promise<GetExamsQueueResponse> {
  const { data } = await api.get<GetExamsQueueResponse>(
    API_ENDPOINTS.EXAMS.ADMIN_QUEUE,
    {
      params,
    }
  );
  return data;
}

/**
 * Verify and publish a staged/unverified exam.
 * PATCH /api/v1/exams/admin/:id/verify
 */
export async function verifyExam(
  examId: string,
  overrides?: Record<string, unknown>
): Promise<ApiSuccessResponse> {
  const { data } = await api.patch<ApiSuccessResponse>(
    API_ENDPOINTS.EXAMS.ADMIN_VERIFY(examId),
    { overrides: overrides ?? {} }
  );
  return data;
}

/**
 * Manually create a new exam profile (auto-verified).
 * POST /api/v1/exams
 */
export async function createExam(
  payload: CreateExamPayload
): Promise<ApiSuccessResponse> {
  const { data } = await api.post<ApiSuccessResponse>(
    API_ENDPOINTS.EXAMS.BASE,
    payload
  );
  return data;
}

/**
 * Fetch the admin dashboard welcome/status message.
 * GET /api/v1/auth/admin-dashboard
 */
export async function getAdminDashboardWelcome(): Promise<
  ApiSuccessResponse & { data?: unknown }
> {
  const { data } = await api.get(API_ENDPOINTS.AUTH.ADMIN_DASHBOARD);
  return data;
}

// ==========================================
// EXAM MCQ MANAGEMENT
// ==========================================

/** Payload for POST /exams/:slug/questions */
export interface PostQuestionsPayload {
  questions: Omit<AdminQuestion, 'questionId'>[];
}

/**
 * Bulk-save MCQs for an exam.
 * POST /api/v1/exams/:slug/questions
 */
export async function postExamQuestions(
  slug: string,
  payload: PostQuestionsPayload
): Promise<ApiSuccessResponse> {
  const { data } = await api.post<ApiSuccessResponse>(
    API_ENDPOINTS.EXAMS.QUESTIONS_BY_SLUG(slug),
    payload
  );
  return data;
}
