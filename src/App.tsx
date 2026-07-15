import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import Home from "./pages/Home/Home";

// Lazy load all pages
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

function App() {
  return (
    <div className="min-h-screen bg-background text-secondary font-sans antialiased">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home />} />

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

          {/* Catch-all */}
          <Route
            path="*"
            element={<Navigate to="/dashboard/overview" replace />}
          />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
