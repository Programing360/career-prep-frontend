/**
 * Centralized API Endpoint Definitions
 * Strictly aligned with backend Express router mounts and Zod validation routes.
 */

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: (token: string) => `/auth/reset-password/${token}`,
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_OTP: '/auth/resend-otp',
    ADMIN_DASHBOARD: '/auth/admin-dashboard',
  },
  MOCK_TEST: {
    START: (examSlug: string) => `/mock-tests/${examSlug}/start`,
    HEARTBEAT: (sessionId: string) =>
      `/mock-tests/session/${sessionId}/heartbeat`,
    SUBMIT: (sessionId: string) => `/mock-tests/session/${sessionId}/submit`,
    GET_SESSION: (sessionId: string) => `/mock-tests/session/${sessionId}`,
  },
  MCQS: {
    BASE: '/mcqs',
    TOPICS: '/mcqs/topics',
    SUBMIT: '/mcqs/submit',
    BY_ID: (id: string) => `/mcqs/${id}`,
  },
  MCQ_PRACTICE: {
    PROGRESS: (examSlug: string) => `/mcq-practice/progress/${examSlug}`,
    ANSWER: (examSlug: string) => `/mcq-practice/progress/${examSlug}/answer`,
    SUBMIT: (examSlug: string) => `/mcq-practice/progress/${examSlug}/submit`,
    RESET: (examSlug: string) => `/mcq-practice/progress/${examSlug}/reset`,
    USER_STATS: '/mcq-practice/progress/user-stats',
  },

  EXAMS: {
    BASE: '/exams',
    BY_SLUG: (slug: string) => `/exams/${slug}`,
    QUESTIONS_BY_SLUG: (slug: string) => `/exams/${slug}/questions`,
    SYLLABUS_BY_SLUG: (slug: string) => `/exams/${slug}/syllabus`,
    ROADMAP_BY_SLUG: (slug: string) => `/exams/${slug}/roadmap`,
    ADMIN_QUEUE: '/exams/admin/queue',
    ADMIN_VERIFY: (id: string) => `/exams/admin/${id}/verify`,
    ADMIN_SYLLABUS: (examId: string) => `/exams/admin/${examId}/syllabus`,
    ADMIN_ROADMAP: (examId: string) => `/exams/admin/${examId}/roadmap`,
    BY_ID: (id: string) => `/exams/${id}`,
  },

  TAXONOMY: {
    SUBJECTS: '/taxonomy/subjects',
    SUBJECT_BY_ID: (id: string) => `/taxonomy/subjects/${id}`,
    CHAPTERS: '/taxonomy/chapters',
    CHAPTER_BY_ID: (id: string) => `/taxonomy/chapters/${id}`,
    TOPICS: '/taxonomy/topics',
    TOPIC_BY_ID: (id: string) => `/taxonomy/topics/${id}`,
  },

  ADMIN_USERS: {
    BASE: '/admin/users',
    BY_ID: (id: string) => `/admin/users/${id}`,
    ROLE: (id: string) => `/admin/users/${id}/role`,
    BAN: (id: string) => `/admin/users/${id}/ban`,
    RESET_PASSWORD: (id: string) => `/admin/users/${id}/reset-password`,
    SUBSCRIPTION: (id: string) => `/admin/users/${id}/subscription`,
    PREFERENCES: (id: string) => `/admin/users/${id}/preferences`,
    HISTORY: (id: string) => `/admin/users/${id}/history`,
  },

  INVITATIONS: {
    BASE: '/invitations',
    VERIFY: (token: string) => `/invitations/verify/${token}`,
    ACCEPT: '/invitations/accept',
  },
} as const;
