import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth Pages
import Login from "../pages/AuthPages/LoginPages";
import Register from "../pages/AuthPages/RegisterPages";

import ForgotPassword from "../pages/AuthPages/ForgotPasswordPages";
import ResetPassword from "../pages/AuthPages/ResetPasswordPages";

// Protected Pages
import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/TransactionsPages";
import Raport from "../pages/RaportsPages";
import Budgets from "../pages/BudgetsPages";
import Settings from "../pages/SettingsPages";

// Banned Information
import BannedInformation from "../pages/BannedInformation";

// Admin Pages
import AdminPanel from "../pages/AdminPanelPages";
import AdminLogs from "../pages/AdminLogsPages";

// Guards & Layout
import ProtectedRoute from "../components/features/ProtectedRoute";
import GuestRoute from "../components/features/GuestRoute";
import LayoutProvider from "../components/layouts/layoutProvider";
import AdminProvider from "../components/features/AdminProvider";
import BannedProvider from "../components/features/BannedProvider";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── GUEST ONLY ─────────────────────────────────────── */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <GuestRoute>
              <ForgotPassword />
            </GuestRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <GuestRoute>
              <ResetPassword />
            </GuestRoute>
          }
        />

        {/* ── PROTECTED (dengan Sidebar Layout) ──────────────── */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <BannedProvider>
                <LayoutProvider>
                  <Dashboard />
                </LayoutProvider>
              </BannedProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-panel"
          element={
            <ProtectedRoute>
              <AdminProvider>
                <BannedProvider>
                  <LayoutProvider>
                    <AdminPanel />
                  </LayoutProvider>
                </BannedProvider>
              </AdminProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-logs"
          element={
            <ProtectedRoute>
              <AdminProvider>
                <BannedProvider>
                  <LayoutProvider>
                    <AdminLogs />
                  </LayoutProvider>
                </BannedProvider>
              </AdminProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <BannedProvider>
                <LayoutProvider>
                  <Transactions />
                </LayoutProvider>
              </BannedProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <BannedProvider>
                <LayoutProvider>
                  <Raport />
                </LayoutProvider>
              </BannedProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/budgets"
          element={
            <ProtectedRoute>
              <BannedProvider>
                <LayoutProvider>
                  <Budgets />
                </LayoutProvider>
              </BannedProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <LayoutProvider>
                <Settings />
              </LayoutProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="banned-information"
          element={
            <ProtectedRoute>
              <LayoutProvider>
                <BannedInformation />
              </LayoutProvider>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
