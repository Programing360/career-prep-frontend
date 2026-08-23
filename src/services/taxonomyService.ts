import api from '@/lib/axios';

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
  subjectId: string | { _id: string; title: string; code: string };
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
  pages: number;
}

interface TaxonomyListResponse<T> {
  success: boolean;
  message?: string;
  data: {
    total: number;
    page: number;
    pages: number;
  } & Partial<Record<string, T[]>>;
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

// ==========================================
// SUBJECTS
// ==========================================

export async function getSubjects(
  params?: SubjectFilters
): Promise<TaxonomyListResponse<TaxonomySubject>> {
  const { data } = await api.get<TaxonomyListResponse<TaxonomySubject>>(
    '/taxonomy/subjects',
    { params }
  );
  return data;
}

export async function createSubject(
  payload: SubjectPayload
): Promise<TaxonomySingleResponse<TaxonomySubject>> {
  const { data } = await api.post<TaxonomySingleResponse<TaxonomySubject>>(
    '/taxonomy/subjects',
    payload
  );
  return data;
}

export async function updateSubject(
  subjectId: string,
  payload: Partial<SubjectPayload>
): Promise<TaxonomySingleResponse<TaxonomySubject>> {
  const { data } = await api.patch<TaxonomySingleResponse<TaxonomySubject>>(
    `/taxonomy/subjects/${subjectId}`,
    payload
  );
  return data;
}

export async function deleteSubject(
  subjectId: string
): Promise<TaxonomyMessageResponse> {
  const { data } = await api.delete<TaxonomyMessageResponse>(
    `/taxonomy/subjects/${subjectId}`
  );
  return data;
}

// ==========================================
// CHAPTERS
// ==========================================

export async function getChapters(
  params?: ChapterFilters
): Promise<TaxonomyListResponse<TaxonomyChapter>> {
  const { data } = await api.get<TaxonomyListResponse<TaxonomyChapter>>(
    '/taxonomy/chapters',
    { params }
  );
  // console.log(params, data);
  return data;
}

export async function createChapter(
  payload: ChapterPayload
): Promise<TaxonomySingleResponse<TaxonomyChapter>> {
  const { data } = await api.post<TaxonomySingleResponse<TaxonomyChapter>>(
    '/taxonomy/chapters',
    payload
  );
  return data;
}

export async function updateChapter(
  chapterId: string,
  payload: Partial<Omit<ChapterPayload, 'subjectId'>>
): Promise<TaxonomySingleResponse<TaxonomyChapter>> {
  const { data } = await api.patch<TaxonomySingleResponse<TaxonomyChapter>>(
    `/taxonomy/chapters/${chapterId}`,
    payload
  );
  return data;
}

export async function deleteChapter(
  chapterId: string
): Promise<TaxonomyMessageResponse> {
  const { data } = await api.delete<TaxonomyMessageResponse>(
    `/taxonomy/chapters/${chapterId}`
  );
  return data;
}

// ==========================================
// TOPICS
// ==========================================

export async function getTopics(
  params?: TopicFilters
): Promise<TaxonomyListResponse<TaxonomyTopic>> {
  const { data } = await api.get<TaxonomyListResponse<TaxonomyTopic>>(
    '/taxonomy/topics',
    { params }
  );
  return data;
}

export async function createTopic(
  payload: TopicPayload
): Promise<TaxonomySingleResponse<TaxonomyTopic>> {
  const { data } = await api.post<TaxonomySingleResponse<TaxonomyTopic>>(
    '/taxonomy/topics',
    payload
  );
  return data;
}

export async function updateTopic(
  topicId: string,
  payload: Partial<Omit<TopicPayload, 'chapterId'>>
): Promise<TaxonomySingleResponse<TaxonomyTopic>> {
  const { data } = await api.patch<TaxonomySingleResponse<TaxonomyTopic>>(
    `/taxonomy/topics/${topicId}`,
    payload
  );
  return data;
}

export async function deleteTopic(
  topicId: string
): Promise<TaxonomyMessageResponse> {
  const { data } = await api.delete<TaxonomyMessageResponse>(
    `/taxonomy/topics/${topicId}`
  );
  return data;
}
