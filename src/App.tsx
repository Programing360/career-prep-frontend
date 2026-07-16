import React, { Suspense, Component } from "react";
import type { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import Home from "./pages/Home/Home";
import Login from "./Auth/login";
import Register from "./Auth/register";
import OtpVerification from "./Auth/OtpVerification";
import Onboarding from "./Auth/Onboarding";

const Overview = React.lazy(
  () => import("@/pages/Dashboard/Overview/Overview"),
);
const MyLearning = React.lazy(
  () => import("@/pages/Dashboard/MyLearning/MyLearning"),
);
const Practice = React.lazy(
  () => import("@/pages/Dashboard/Practice/Practice"),
);
const MockTests = React.lazy(
  () => import("@/pages/Dashboard/MockTests/MockTests"),
);
const StudyPlanner = React.lazy(
  () => import("@/pages/Dashboard/StudyPlanner/StudyPlanner"),
);
const Leaderboard = React.lazy(
  () => import("@/pages/Dashboard/Leaderboard/Leaderboard"),
);
const Community = React.lazy(
  () => import("@/pages/Dashboard/Community/Community"),
);
const Analytics = React.lazy(
  () => import("@/pages/Dashboard/Analytics/Analytics"),
);
const Profile = React.lazy(() => import("@/pages/Dashboard/Profile/Profile"));
const Settings = React.lazy(
  () => import("@/pages/Dashboard/Settings/Settings"),
);
const Help = React.lazy(() => import("@/pages/Dashboard/Help/Help"));

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-secondary mb-2">
              Something went wrong
            </h1>
            <p className="text-secondary/60 mb-4">
              Failed to load this page.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function PageLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-secondary/10 rounded-xl w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-secondary/10 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 h-80 bg-secondary/10 rounded-2xl" />
        <div className="space-y-4">
          <div className="h-36 bg-secondary/10 rounded-2xl" />
          <div className="h-36 bg-secondary/10 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-secondary mb-2">Page not found</p>
        <p className="text-secondary/60 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <a
          href="/"
          className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors text-sm font-medium"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-background text-secondary font-sans antialiased">
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<OtpVerification />} />
            <Route path="/onboarding" element={<Onboarding />} />

            <Route path="/dashboard" element={<ProtectedRoute />}>
              <Route
                index
                element={<Navigate to="/dashboard/overview" replace />}
              />
              <Route path="overview" element={<Overview />} />
              <Route path="my-learning" element={<MyLearning />} />
              <Route path="practice" element={<Practice />} />
              <Route path="mock-tests" element={<MockTests />} />
              <Route path="study-planner" element={<StudyPlanner />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="community" element={<Community />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="help" element={<Help />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;
