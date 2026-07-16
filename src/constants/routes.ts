export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  EXAMS: '/exams',
  EXAM_DETAIL: '/exams/:id',
  EXAM_ATTEMPT: '/exams/:id/attempt',
  EXAM_RESULT: '/exams/:id/result',
  PRACTICE: '/practice',
  PRACTICE_QUESTION: '/practice/:id',
  RESULTS: '/results',
  SETTINGS: '/settings',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  NOT_FOUND: '*',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
