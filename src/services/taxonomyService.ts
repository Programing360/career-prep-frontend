import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

// ==========================================
// TYPES (mirror the backend taxonomy API)
// ==========================================

export const SUBJECT_CATEGORIES = [
  'general',
  'science',
  'law',
  'islamic',
  'current_affairs',
  'technical',
] as const;

export type SubjectCategory = (typeof SUBJECT_CATEGORIES)[number];

export const TOPIC_VERBAL_TYPES = [
  'verbal',
  'non_verbal',
  'analytical',
  'none',
] as const;

export type TopicVerbalType = (typeof TOPIC_VERBAL_TYPES)[number];

export interface TaxonomySubject {
  _id: string;
  title: string;
  code: string;
  description?: string;
  category: SubjectCategory;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaxonomyChapter {
  _id: string;
  subjectId?: string | { _id: string; title: string; code: string };
  title: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaxonomyTopic {
  _id: string;
  chapterId: string | { _id: string; title: string; order: number };
  subjectId: string | { _id: string; title: string; code: string };
  title: string;
  description?: string;
  isVerbalOrNonVerbal: TopicVerbalType;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaxonomyPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface TaxonomyListResponse<T> {
  success: boolean;
  message?: string;
  data: T[];
  meta: TaxonomyPagination;
}

interface TaxonomySingleResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface TaxonomyMessageResponse {
  success: boolean;
  message?: string;
}

export interface SubjectPayload {
  title: string;
  code: string;
  description?: string;
  category: SubjectCategory;
}

export interface ChapterPayload {
  subjectId: string;
  title: string;
  order?: number;
}

export interface TopicPayload {
  chapterId: string;
  title: string;
  description?: string;
  isVerbalOrNonVerbal?: TopicVerbalType;
}

export interface TopicFilters {
  chapterId?: string;
  subjectId?: string;
  isVerbalOrNonVerbal?: TopicVerbalType;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ChapterFilters {
  subjectId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface SubjectFilters {
  category?: SubjectCategory;
  search?: string;
  page?: number;
  limit?: number;
}

export interface TaxonomyTopicJoined extends TaxonomyTopic {
  chapter?: { _id: string; title: string; order: number };
  subject?: { _id: string; title: string; code: string };
}

/**
 * The taxonomy backend returns list pages shaped as
 * `{ success, message, data: { <key>: T[], total, page, pages } }` — i.e. the
 * list and pagination are nested inside `data`, and there is no `meta` field.
 * This normalizes that response into the `{ data: T[], meta }` contract used
 * by the rest of the app.
 */
function normalizeListResponse<T>(
  body: { success: boolean; message?: string; data: unknown },
  key: string,
  fallbackLimit = 50
): TaxonomyListResponse<T> {
  const raw = body.data;
  let items: T[] = [];
  let total = 0;
  let page = 1;
  let totalPages = 1;
  const limit = fallbackLimit;

  if (Array.isArray(raw)) {
    items = raw;
    total = items.length;
  } else if (raw && typeof raw === 'object') {
    const rec = raw as Record<string, unknown>;
    const nested = rec[key];
    if (Array.isArray(nested)) items = nested as T[];
    total = Number(rec.total) || items.length;
    page = Number(rec.page) || 1;
    totalPages = Number(rec.pages) || Math.ceil(total / limit) || 1;
  }

  return {
    success: body.success ?? true,
    message: body.message,
    data: items,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
}

// ==========================================
// SUBJECTS
// ==========================================

export async function getSubjects(
  params?: SubjectFilters
): Promise<TaxonomyListResponse<TaxonomySubject>> {
  const { data } = await api.get<{
    success: boolean;
    message?: string;
    data: unknown;
  }>(API_ENDPOINTS.TAXONOMY.SUBJECTS, { params });
  return normalizeListResponse<TaxonomySubject>(data, 'subjects');
}

export async function createSubject(
  payload: SubjectPayload
): Promise<TaxonomySingleResponse<TaxonomySubject>> {
  const { data } = await api.post<TaxonomySingleResponse<TaxonomySubject>>(
    API_ENDPOINTS.TAXONOMY.SUBJECTS,
    payload
  );
  return data;
}

export async function updateSubject(
  subjectId: string,
  payload: Partial<SubjectPayload>
): Promise<TaxonomySingleResponse<TaxonomySubject>> {
  const { data } = await api.patch<TaxonomySingleResponse<TaxonomySubject>>(
    API_ENDPOINTS.TAXONOMY.SUBJECT_BY_ID(subjectId),
    payload
  );
  return data;
}

export async function deleteSubject(
  subjectId: string
): Promise<TaxonomyMessageResponse> {
  const { data } = await api.delete<TaxonomyMessageResponse>(
    API_ENDPOINTS.TAXONOMY.SUBJECT_BY_ID(subjectId)
  );
  return data;
}

// ==========================================
// CHAPTERS
// ==========================================

export async function getChapters(
  params?: ChapterFilters
): Promise<TaxonomyListResponse<TaxonomyChapter>> {
  const { data } = await api.get<{
    success: boolean;
    message?: string;
    data: unknown;
  }>(API_ENDPOINTS.TAXONOMY.CHAPTERS, { params });
  return normalizeListResponse<TaxonomyChapter>(data, 'chapters');
}

export async function createChapter(
  payload: ChapterPayload
): Promise<TaxonomySingleResponse<TaxonomyChapter>> {
  const { data } = await api.post<TaxonomySingleResponse<TaxonomyChapter>>(
    API_ENDPOINTS.TAXONOMY.CHAPTERS,
    payload
  );
  return data;
}

export async function updateChapter(
  chapterId: string,
  payload: Partial<Omit<ChapterPayload, 'subjectId'>>
): Promise<TaxonomySingleResponse<TaxonomyChapter>> {
  const { data } = await api.patch<TaxonomySingleResponse<TaxonomyChapter>>(
    API_ENDPOINTS.TAXONOMY.CHAPTER_BY_ID(chapterId),
    payload
  );
  return data;
}

export async function deleteChapter(
  chapterId: string
): Promise<TaxonomyMessageResponse> {
  const { data } = await api.delete<TaxonomyMessageResponse>(
    API_ENDPOINTS.TAXONOMY.CHAPTER_BY_ID(chapterId)
  );
  return data;
}

// ==========================================
// TOPICS
// ==========================================

export async function getTopics(
  params?: TopicFilters
): Promise<TaxonomyListResponse<TaxonomyTopic>> {
  const { data } = await api.get<{
    success: boolean;
    message?: string;
    data: unknown;
  }>(API_ENDPOINTS.TAXONOMY.TOPICS, { params });
  return normalizeListResponse<TaxonomyTopic>(data, 'topics');
}

export async function createTopic(
  payload: TopicPayload
): Promise<TaxonomySingleResponse<TaxonomyTopic>> {
  const { data } = await api.post<TaxonomySingleResponse<TaxonomyTopic>>(
    API_ENDPOINTS.TAXONOMY.TOPICS,
    payload
  );
  return data;
}

export async function updateTopic(
  topicId: string,
  payload: Partial<Omit<TopicPayload, 'chapterId'>>
): Promise<TaxonomySingleResponse<TaxonomyTopic>> {
  const { data } = await api.patch<TaxonomySingleResponse<TaxonomyTopic>>(
    API_ENDPOINTS.TAXONOMY.TOPIC_BY_ID(topicId),
    payload
  );
  return data;
}

export async function deleteTopic(
  topicId: string
): Promise<TaxonomyMessageResponse> {
  const { data } = await api.delete<TaxonomyMessageResponse>(
    API_ENDPOINTS.TAXONOMY.TOPIC_BY_ID(topicId)
  );
  return data;
}
