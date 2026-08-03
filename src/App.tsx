import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminProtectedRoute } from '@/components/auth/AdminProtectedRoute';

import { ROUTES } from '@/constants/routes';
import TestMCQPage from './pages/TestMCQPage';

const ComponentShowcase = lazy(() => import('@/pages/dev/ComponentShowcase'));
const Home = lazy(() => import('@/pages/public/Home'));
const ExamDetailWrapper = lazy(() => import('@/pages/exams/ExamDetailWrapper'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const VerifyEmail = lazy(() => import('@/pages/auth/VerifyEmail'));
const DashboardHome = lazy(() => import('@/pages/dashboard/DashboardHome'));
const PracticePage = lazy(() => import('@/pages/dashboard/PracticePage'));
const AiTutorPage = lazy(() => import('@/pages/dashboard/AiTutorPage'));
const ExamAttemptPage = lazy(() => import('@/pages/exams/ExamAttemptPage'));
const ExamResultPage = lazy(() => import('@/pages/exams/ExamResultPage'));
const AnalyticsPage = lazy(() => import('@/pages/dashboard/AnalyticsPage'));
const PremiumPage = lazy(() => import('@/pages/dashboard/PremiumPage'));
const SettingsPage = lazy(() => import('@/pages/dashboard/SettingsPage'));
const ProfilePage = lazy(() => import('@/pages/dashboard/ProfilePage'));
const AdminOverviewPage = lazy(() => import('@/pages/admin/AdminOverviewPage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));
const AdminExamsPage = lazy(() => import('@/pages/admin/AdminExamsPage'));
const AdminTokenSettingsPage = lazy(
  () => import('@/pages/admin/AdminTokenSettingsPage')
);
const CreateExamPage = lazy(() => import('@/pages/admin/CreateExamPage'));
const ExamCategoriesPage = lazy(
  () => import('@/pages/public/ExamCategoriesPage')
);
const AboutPage = lazy(() => import('@/pages/public/AboutPage'));
const FAQPage = lazy(() => import('@/pages/public/FAQPage'));
const ContactPage = lazy(() => import('@/pages/public/ContactPage'));
const SubjectsLibrary = lazy(() => import('@/pages/public/SubjectsLibrary'));
const MockTestRunnerPage = lazy(
  () => import('@/pages/public/MockTestRunnerPage')
);
const CurrentAffairsPage = lazy(
  () => import('@/pages/public/CurrentAffairsPage')
);
const DailyQuizPage = lazy(() => import('@/pages/public/DailyQuizPage'));
const LeaderboardPage = lazy(() => import('@/pages/public/LeaderboardPage'));

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-semibold">404 — Page Not Found</h1>
    </div>
  );
}

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      }
    >
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmail />} />
          <Route path={ROUTES.EXAMS} element={<ExamCategoriesPage />} />
          <Route path={ROUTES.SUBJECTS} element={<SubjectsLibrary />} />
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />
          <Route path={ROUTES.FAQ} element={<FAQPage />} />
          <Route path={ROUTES.CONTACT} element={<ContactPage />} />
          <Route
            path={ROUTES.CURRENT_AFFAIRS}
            element={<CurrentAffairsPage />}
          />
          <Route path={ROUTES.DAILY_QUIZ} element={<DailyQuizPage />} />
          <Route path={ROUTES.LEADERBOARD} element={<LeaderboardPage />} />
          <Route path="/test-mcq" element={<TestMCQPage />} />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.PRACTICE} element={<PracticePage />} />
            <Route path={ROUTES.AI_TUTOR} element={<AiTutorPage />} />
            <Route path={ROUTES.ANALYTICS} element={<AnalyticsPage />} />
            <Route path={ROUTES.PREMIUM} element={<PremiumPage />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path={ROUTES.EXAM_DETAIL} element={<ExamDetailWrapper />} />

        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.EXAM_ATTEMPT} element={<ExamAttemptPage />} />
          <Route path={ROUTES.EXAM_RESULT} element={<ExamResultPage />} />
        </Route>

        <Route
          path={ROUTES.MOCK_TEST_RUNNER}
          element={<MockTestRunnerPage />}
        />

        <Route element={<AdminLayout />}>
          <Route element={<AdminProtectedRoute />}>
            <Route
              path={ROUTES.ADMIN_DASHBOARD}
              element={<AdminOverviewPage />}
            />
            <Route path={ROUTES.ADMIN_USERS} element={<AdminUsersPage />} />
            <Route path={ROUTES.ADMIN_EXAMS} element={<AdminExamsPage />} />
            <Route path={ROUTES.ADMIN_EXAMS_NEW} element={<CreateExamPage />} />
            <Route
              path={ROUTES.ADMIN_AI_TOKENS}
              element={<AdminTokenSettingsPage />}
            />
          </Route>
        </Route>

        <Route path="/dev/components" element={<ComponentShowcase />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
