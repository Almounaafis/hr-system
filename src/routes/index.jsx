import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; // npm i jwt-decode

import DashboardLayout from '../layouts/DashboardLayout';
import useAuthStore from '../store/useAuthStore';
import CompaniesPage from '@/pages/CompaniesPage';
import CompanyHrsPage from '@/pages/CompanyHrsPage';
import CompanyManagersPage from '@/pages/CompanyManagersPage';
import RecruitmentPage from '@/pages/RecruitmentPage';
import ApplicationsPage from '@/pages/ApplicationsPage';
import InterviewsPage from '@/pages/InterviewsPage';
import TraineesPage from '@/pages/TraineesPage';
import CustodiesPage from '@/pages/CustodiesPage';

// Auth pages
const Login = lazy(() => import('@/features/auth/pages/Login'));
const Register = lazy(() => import('@/features/auth/pages/Register'));
const Verify = lazy(() => import('@/features/auth/pages/Verify'));
const Setup = lazy(() => import('@/features/auth/pages/Setup'));
const ForgotPassword = lazy(() => import('@/features/auth/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/features/auth/pages/ResetPassword'));
const HRInvitation = lazy(() => import('@/features/auth/pages/HRInvitation'));

// Dashboard pages
const Dashboard = lazy(() => import('../pages/Dashboard'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const Employees = lazy(() => import('../pages/Employees'));
const EmployeeAttendance = lazy(() => import('@/pages/EmployeeAttendance'));
const Attendance = lazy(() => import('../pages/Attendance'));
const Requests = lazy(() => import('../pages/Requests'));
const Payroll = lazy(() => import('../pages/Payroll'));
const Settings = lazy(() => import('../pages/Settings'));
const Networks = lazy(() => import('../pages/Networks'));
const Notifications = lazy(() => import('../pages/Notifications'));
const Profile = lazy(() => import('../pages/Profile'));
const NotFound = lazy(() => import('../pages/NotFound'));

const ADMIN_HOME = '/dashboard/admin';

function getRoleFromToken(token) {
  try {
    return jwtDecode(token)?.role ?? null;
  } catch {
    return null; // malformed token
  }
}

function ProtectedRoute({ children, allowedRoles }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();
  const token = Cookies.get('authTokenBasma');

  // 1) Must be logged in (store + cookie)
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2) Must have a valid role in the token
  const role = getRoleFromToken(token);
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // 3) Super admin is always kept inside /dashboard/admin
  if (role === 'super_admin' && !location.pathname.startsWith(ADMIN_HOME)) {
    return <Navigate to={ADMIN_HOME} replace />;
  }

  // 4) Route-level role restriction
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground animate-pulse">جاري التحميل...</p>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/auth/invite" element={<HRInvitation />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* hr + employee dashboard (super_admin gets bounced to /dashboard/admin) */}
            <Route path="dashboard" element={<Dashboard />} />
p
            {/* super_admin only */}
            <Route path="dashboard/admin" element={<ProtectedRoute allowedRoles={['super_admin']}> <AdminDashboard /> </ProtectedRoute>} />
            <Route path="dashboard/admin/companies" element={<ProtectedRoute allowedRoles={['super_admin']}> <CompaniesPage /> </ProtectedRoute>} />
            <Route path="dashboard/admin/settings" element={<ProtectedRoute allowedRoles={['super_admin']}> <Settings /> </ProtectedRoute>} />

            <Route path="employees" element={<Employees />} />
            <Route path="employee/attendance/:id" element={<EmployeeAttendance />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="requests" element={<Requests />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="settings" element={<Settings />} />
            <Route path="networks" element={<Networks />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="recruitment" element={<RecruitmentPage />} />
            {/* <Route path="applications" element={<ApplicationsPage />} /> */}
            {/* <Route path="interviews" element={<InterviewsPage />} /> */}
            <Route path="trainees" element={<TraineesPage />} />
            <Route path="custodies" element={<CustodiesPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}