import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Cookies from "js-cookie";

import DashboardLayout from "../layouts/DashboardLayout";
import useAuthStore from "../store/useAuthStore";
import EmployeeAttendance from "@/pages/EmployeeAttendance";

// Lazy Pages
const Login = lazy(() => import("../pages/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Employees = lazy(() => import("../pages/Employees"));
const Attendance = lazy(() => import("../pages/Attendance"));
const Requests = lazy(() => import("../pages/Requests"));
const Payroll = lazy(() => import("../pages/Payroll"));
const Settings = lazy(() => import("../pages/Settings"));
const Notifications = lazy(() => import("../pages/Notifications"));
const Profile = lazy(() => import("../pages/Profile"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Register = lazy(() => import("../pages/Register"));
const Verify = lazy(() => import("../pages/Verify"));
const Setup = lazy(() => import("../pages/Setup"));
const HRInvitation = lazy(() => import("../pages/HRInvitation"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const cookieExists = !!Cookies.get('authTokenBasma');

  // 🔒 Security: check BOTH store state AND actual cookie
  if (!isAuthenticated || !cookieExists) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Loading fallback
function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
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
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="employee/attendance/:id" element={<EmployeeAttendance />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="requests" element={<Requests />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="settings" element={<Settings />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />

          </Route>

          <Route path="*" element={<NotFound />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/auth/invite" element={<HRInvitation />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}