import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import ExamDetailPage from '@/pages/public/ExamDetailPage';

export default function ExamDetailWrapper() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();

  if (slug === 'army-test') {
    return <Navigate to="/practice?category=army-test" replace />;
  }

  if (isAuthenticated) {
    return (
      <DashboardLayout>
        <ExamDetailPage key={slug} slug={slug ?? ''} isPremiumView />
      </DashboardLayout>
    );
  }

  return (
    <PublicLayout>
      <ExamDetailPage key={slug} slug={slug ?? ''} isPremiumView={false} />
    </PublicLayout>
  );
}
