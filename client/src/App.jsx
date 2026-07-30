import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import AIChatbot from './components/ai/AIChatbot';

// Lazy load pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const DashboardLayout = lazy(() => import('./components/layout/DashboardLayout'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const AttendancePage = lazy(() => import('./pages/attendance/AttendancePage'));
const CgpaPage = lazy(() => import('./pages/cgpa/CgpaPage'));
const PlannerPage = lazy(() => import('./pages/planner/PlannerPage'));
const CodingPage = lazy(() => import('./pages/coding/CodingPage'));
const PlacementPage = lazy(() => import('./pages/placement/PlacementPage'));

// New Phase 8 Pages
const AssistantPage = lazy(() => import('./pages/assistant/AssistantPage'));
const AnalyticsPage = lazy(() => import('./pages/analytics/AnalyticsPage'));
const RoadmapPage = lazy(() => import('./pages/roadmap/RoadmapPage'));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));

// Phase 9 Settings & About
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage'));
const AboutPage = lazy(() => import('./pages/about/AboutPage'));

// Phase 11 Roles
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));
const FacultyDashboard = lazy(() => import('./pages/faculty/FacultyDashboard'));

// Phase 12 Academics
const SubjectsPage = lazy(() => import('./pages/academics/SubjectsPage'));
const AttendanceManager = lazy(() => import('./pages/academics/AttendanceManager'));
const MarksManager = lazy(() => import('./pages/academics/MarksManager'));
const TimetablePage = lazy(() => import('./pages/academics/TimetablePage'));
const AssignmentsPage = lazy(() => import('./pages/academics/AssignmentsPage'));
const NoticeBoard = lazy(() => import('./pages/academics/NoticeBoard'));
const ResultsPage = lazy(() => import('./pages/academics/ResultsPage'));

// Phase 13 College Admin
const StudentManagement = lazy(() => import('./pages/admin/StudentManagement'));
const FacultyManagement = lazy(() => import('./pages/admin/FacultyManagement'));
const DepartmentCourseManager = lazy(() => import('./pages/admin/DepartmentCourseManager'));
const AcademicCalendar = lazy(() => import('./pages/admin/AcademicCalendar'));
const ReportsDashboard = lazy(() => import('./pages/admin/ReportsDashboard'));

// Phase 15 Enterprise
const FeeManagement = lazy(() => import('./pages/admin/FeeManagement'));
const ExamManagement = lazy(() => import('./pages/admin/ExamManagement'));
const AuditLogs = lazy(() => import('./pages/admin/AuditLogs'));
const FeePortal = lazy(() => import('./pages/student/FeePortal'));
const ResultPortal = lazy(() => import('./pages/student/ResultPortal'));

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );
}

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function AuthGatedChatbot() {
  const { user } = useAuth();
  if (!user) return null;
  return <AIChatbot />;
}

function RoleBasedRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;

  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'faculty') return <Navigate to="/faculty" replace />;
  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster position="top-right" />
          <ErrorBoundary>
          <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<RoleBasedRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Student Dashboard (Also accessible by Admin if needed) */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="cgpa" element={<CgpaPage />} />
              <Route path="planner" element={<PlannerPage />} />
              <Route path="coding" element={<CodingPage />} />
              <Route path="placement" element={<PlacementPage />} />
              <Route path="assistant" element={<AssistantPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="roadmap" element={<RoadmapPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="about" element={<AboutPage />} />

              {/* Phase 12 Academics (Student) */}
              <Route path="academics/subjects" element={<SubjectsPage />} />
              <Route path="academics/attendance" element={<AttendanceManager />} />
              <Route path="academics/marks" element={<MarksManager />} />
              <Route path="academics/timetable" element={<TimetablePage />} />
              <Route path="academics/assignments" element={<AssignmentsPage />} />
              <Route path="academics/notices" element={<NoticeBoard />} />
              <Route path="academics/results" element={<ResultPortal />} />
              
              {/* Phase 15 Student Portals */}
              <Route path="fees" element={<FeePortal />} />
            </Route>

            {/* Faculty Dashboard */}
            <Route path="/faculty" element={
              <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<FacultyDashboard />} />
              {/* Faculty specific routes can go here */}
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="about" element={<AboutPage />} />

              {/* Phase 12 Academics (Faculty) */}
              <Route path="academics/subjects" element={<SubjectsPage />} />
              <Route path="academics/attendance" element={<AttendanceManager />} />
              <Route path="academics/marks" element={<MarksManager />} />
              <Route path="academics/timetable" element={<TimetablePage />} />
              <Route path="academics/assignments" element={<AssignmentsPage />} />
              <Route path="academics/notices" element={<NoticeBoard />} />
              <Route path="academics/results" element={<ResultsPage />} />
            </Route>

            {/* Admin Dashboard */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsersPage />} />
              {/* Admin can also access basic pages */}
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="about" element={<AboutPage />} />

              {/* Phase 12 Academics (Admin) */}
              <Route path="academics/subjects" element={<SubjectsPage />} />
              <Route path="academics/attendance" element={<AttendanceManager />} />
              <Route path="academics/marks" element={<MarksManager />} />
              <Route path="academics/timetable" element={<TimetablePage />} />
              <Route path="academics/assignments" element={<AssignmentsPage />} />
              <Route path="academics/notices" element={<NoticeBoard />} />
              <Route path="academics/results" element={<ResultsPage />} />
              
              {/* Phase 13 College Admin */}
              <Route path="management/students" element={<StudentManagement />} />
              <Route path="management/faculty" element={<FacultyManagement />} />
              <Route path="management/departments" element={<DepartmentCourseManager />} />
              <Route path="management/calendar" element={<AcademicCalendar />} />
              <Route path="management/reports" element={<ReportsDashboard />} />
              
              {/* Phase 15 Enterprise */}
              <Route path="fees" element={<FeeManagement />} />
              <Route path="exams" element={<ExamManagement />} />
              <Route path="audit-logs" element={<AuditLogs />} />
            </Route>
            
            <Route path="*" element={<RoleBasedRedirect />} />
          </Routes>
          {/* Global AI Chatbot — only show when authenticated */}
          <AuthGatedChatbot />
        </Suspense>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
    </ThemeProvider>
  );
}
