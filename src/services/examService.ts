import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import api from '@/lib/axios';
import type { DirectoryExam } from '@/types';

// ==========================================
// TYPES (mirror the backend exam API contracts)
// ==========================================

/** Query params accepted by GET /exams */
export interface ExamListParams {
  page?: number;
  limit?: number;
  search?: string;
  authority?: string;
  province?: string;
  category?: string;
  bps?: number;
  sort?: string;
}

/** Pagination envelope returned by the backend */
export interface ExamPagination {
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

export interface ExamListResponse {
  success: boolean;
  message?: string;
  data: DirectoryExam[];
  meta: ExamPagination;
}

export interface ExamDetailResponse {
  success: boolean;
  message?: string;
  data: DirectoryExam;
}

// ==========================================
// SYLLABUS & ROADMAP CONTRACTS
// (mirror GET /exams/:slug/syllabus and /roadmap)
// ==========================================

export interface ExamSyllabusSubjectBreakdown {
  subjectId: string;
  isCompulsory: boolean;
  marks: number;
  weightagePercentage: number;
  specificTopics: string[];
  customNotes?: string;
}

export interface JoinedSubjectRef {
  _id: string;
  title: string;
  code: string;
  category: string;
}

export interface JoinedTopicRef {
  _id: string;
  title: string;
  subjectId: string;
  isVerbalOrNonVerbal?: 'verbal' | 'non_verbal' | 'analytical' | 'none';
}

export interface ExamSyllabusData {
  _id?: string;
  examId?: string;
  versionNumber: number;
  isActive?: boolean;
  effectiveFrom: string;
  totalPapers: number;
  physicalStandards?: Array<{
    gender: 'male' | 'female' | 'other';
    minHeightInches: number;
    chestUnexpandedInches?: number;
    chestExpandedInches?: number;
    eyeSightStandard?: string;
    runningTestRequirement?: string;
  }>;
  sourceDocumentUrl?: string;
  subjectsBreakdown: ExamSyllabusSubjectBreakdown[];
  joinedSubjects?: JoinedSubjectRef[];
  joinedTopics?: JoinedTopicRef[];
}

export interface ExamRoadmapPhaseData {
  phaseNumber: number;
  title: string;
  durationWeeks: number;
  targetSubjectIds: string[];
  recommendedBooks: Array<{
    title: string;
    author?: string;
    isOfficialHEC: boolean;
  }>;
  weeklyStrategyNotes: string;
  highPriorityTopics: string[];
}

export interface ExamRoadmapData {
  _id?: string;
  title: string;
  overallStrategySummary: string;
  totalEstimatedWeeks: number;
  phases: ExamRoadmapPhaseData[];
  isPublished: boolean;
  author?: { _id: string; name: string; role: string };
}

export interface ExamSyllabusResponse {
  success: boolean;
  message?: string;
  data: {
    exam: {
      _id: string;
      title: string;
      slug: string;
      conductingAuthority: string;
    };
    syllabus: ExamSyllabusData;
  };
}

export interface ExamRoadmapResponse {
  success: boolean;
  message?: string;
  data: {
    exam: { _id: string; title: string; slug: string };
    roadmap: ExamRoadmapData;
  };
}

/**
 * Body payload for POST /exams/admin/:examId/syllabus.
 * Mirrors the backend createSyllabusSchema.
 */
export interface PublishSyllabusPayload {
  effectiveFrom: string;
  totalPapers: number;
  sourceDocumentUrl: string;
  extractedTextRaw?: string;
  subjectsBreakdown: Array<{
    subjectId: string;
    isCompulsory: boolean;
    marks: number;
    weightagePercentage: number;
    specificTopics?: string[];
    customNotes?: string;
  }>;
  physicalStandards?: Array<{
    gender: 'male' | 'female' | 'other';
    minHeightInches?: number;
    chestUnexpandedInches?: number;
    chestExpandedInches?: number;
    runningTestRequirement?: string;
  }>;
}

/**
 * Body payload for POST /exams/admin/:examId/roadmap.
 * Mirrors the backend createRoadmapBodySchema.
 */
export interface PublishRoadmapPayload {
  syllabusVersionId: string;
  title: string;
  overallStrategySummary: string;
  totalEstimatedWeeks: number;
  phases: Array<{
    phaseNumber: number;
    title: string;
    durationWeeks: number;
    targetSubjectIds?: string[];
    recommendedBooks?: Array<{
      title: string;
      author?: string;
      isOfficialHEC: boolean;
    }>;
    weeklyStrategyNotes: string;
    highPriorityTopics?: string[];
  }>;
  isPublished?: boolean;
}

export interface PublishSyllabusResponse {
  success: boolean;
  message?: string;
  data: {
    _id: string;
    versionNumber: number;
    isActive: boolean;
  };
}

export interface PublishRoadmapResponse {
  success: boolean;
  message?: string;
  data: {
    _id: string;
    title: string;
    totalEstimatedWeeks: number;
    isPublished: boolean;
  };
}

interface ApiSuccessResponse {
  success: boolean;
  message?: string;
}

/**
 * Partial body payload for PATCH /exams/:id.
 * Mirrors the backend UpdateExamSchema (CreateExamSchema.partial()).
 */
export interface UpdateExamPayload {
  title?: string;
  slug?: string;
  conductingAuthority?: string;
  category?:
    | 'federal'
    | 'provincial'
    | 'armed-forces'
    | 'armed_forces'
    | 'banking'
    | 'testing_service'
    | 'others';
  province?: string;
  bpsScale?: number;
  departmentName?: string;
  advertisementNumber?: string;
  applicationStartDate?: string;
  applicationDeadline?: string;
  expectedExamDate?: string;
  eligibility?: {
    minAge?: number;
    maxAge?: number;
    ageRelaxationYears?: number;
    qualificationRequired?: string;
    minimumGradeOrCgpa?: string;
    allowedGender?: 'male' | 'female' | 'both' | 'transgender';
    eligibleDomiciles?: string[];
  };
  examPattern?: {
    totalMarks?: number;
    durationMinutes?: number;
    negativeMarking?: boolean;
    negativeMarkingValue?: number;
    format?: 'mcq' | 'descriptive' | 'hybrid';
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
}

// ==========================================
// PUBLIC API METHODS
// ==========================================

/**
 * Fetch the public catalog of verified government recruitment exams.
 * GET /api/v1/exams
 */
export async function getPublicExams(
  params?: ExamListParams
): Promise<ExamListResponse> {
  const { data } = await api.get<ExamListResponse>(API_ENDPOINTS.EXAMS.BASE, {
    params,
  });
  return data;
}

/**
 * Fetch a single verified exam profile by slug (with subject mapping).
 * GET /api/v1/exams/:slug
 */
export async function getExamBySlug(slug: string): Promise<ExamDetailResponse> {
  const { data } = await api.get<ExamDetailResponse>(
    API_ENDPOINTS.EXAMS.BY_SLUG(encodeURIComponent(slug))
  );
  return data;
}

/**
 * Fetch the active, verified syllabus for an exam.
 * GET /api/v1/exams/:slug/syllabus
 * Returns null when the endpoint returns 404 (no syllabus published yet).
 */
export async function getExamSyllabus(
  slug: string
): Promise<ExamSyllabusResponse | null> {
  const { data, status } = await api.get<ExamSyllabusResponse>(
    API_ENDPOINTS.EXAMS.SYLLABUS_BY_SLUG(encodeURIComponent(slug)),
    { validateStatus: () => true }
  );
  if (status === 404) return null;
  return data;
}

/**
 * Fetch the published preparation roadmap for an exam.
 * GET /api/v1/exams/:slug/roadmap
 * Returns null when the endpoint returns 404 (no roadmap published yet).
 */
export async function getExamRoadmap(
  slug: string
): Promise<ExamRoadmapResponse | null> {
  const { data, status } = await api.get<ExamRoadmapResponse>(
    API_ENDPOINTS.EXAMS.ROADMAP_BY_SLUG(encodeURIComponent(slug)),
    { validateStatus: () => true }
  );
  if (status === 404) return null;
  return data;
}

// ==========================================
// ADMIN API METHODS
// ==========================================

/**
 * Manually update an exam profile (Admin).
 * PATCH /api/v1/exams/:id
 */
export async function updateExam(
  examId: string,
  payload: UpdateExamPayload
): Promise<ExamDetailResponse> {
  const { data } = await api.patch<ExamDetailResponse>(
    API_ENDPOINTS.EXAMS.BY_ID(examId),
    payload
  );
  return data;
}

/**
 * Delete or archive an exam profile (Admin).
 * DELETE /api/v1/exams/:id
 */
export async function deleteExam(examId: string): Promise<ApiSuccessResponse> {
  const { data } = await api.delete<ApiSuccessResponse>(
    API_ENDPOINTS.EXAMS.BY_ID(examId)
  );
  return data;
}

/**
 * Fetch unverified / scraped exams waiting for admin review.
 * GET /api/v1/exams/admin/queue
 */
export async function getStagedExamsQueue(params?: {
  page?: number;
  limit?: number;
}): Promise<ExamListResponse> {
  const { data } = await api.get<ExamListResponse>(
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
export async function verifyStagedExam(
  examId: string,
  overrides?: Record<string, unknown>
): Promise<ExamDetailResponse> {
  const { data } = await api.patch<ExamDetailResponse>(
    API_ENDPOINTS.EXAMS.ADMIN_VERIFY(examId),
    { overrides: overrides ?? {} }
  );
  return data;
}

/**
 * Publish a new active syllabus version for an exam (Admin/Moderator).
 * POST /api/v1/exams/admin/:examId/syllabus
 */
export async function publishSyllabusVersion(
  examId: string,
  payload: PublishSyllabusPayload
): Promise<PublishSyllabusResponse> {
  const { data } = await api.post<PublishSyllabusResponse>(
    API_ENDPOINTS.EXAMS.ADMIN_SYLLABUS(examId),
    payload
  );
  return data;
}

/**
 * Create and publish a preparation roadmap for an exam (Admin/Moderator).
 * POST /api/v1/exams/admin/:examId/roadmap
 */
export async function publishExamRoadmap(
  examId: string,
  payload: PublishRoadmapPayload
): Promise<PublishRoadmapResponse> {
  const { data } = await api.post<PublishRoadmapResponse>(
    API_ENDPOINTS.EXAMS.ADMIN_ROADMAP(examId),
    payload
  );
  return data;
}
