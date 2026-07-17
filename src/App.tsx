import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const ComponentShowcase = lazy(() => import('@/pages/dev/ComponentShowcase'));

function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold text-primary-600">TestPrep</h1>
    </div>
  );
}

function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-semibold">Login</h1>
    </div>
  );
}

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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dev/components" element={<ComponentShowcase />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
