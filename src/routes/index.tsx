import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth Pages
import Login from "../pages/AuthPages/LoginPages";
import Register from "../pages/AuthPages/RegisterPages";

// Protected Pages
import Dashboard from "../pages/Dashboard";
// import Transactions from "../pages/Transactions";
// import Raport from "../pages/Raport";
// import Budgets from "../pages/Budgets";
// import Settings from "../pages/Settings";

// Admin Pages
import AdminPanel from "../pages/AdminPanelPages";

// Guards & Layout
import ProtectedRoute from "../components/features/ProtectedRoute";
import GuestRoute from "../components/features/GuestRoute";
import LayoutProvider from "../components/layouts/layoutProvider";
import AdminProvider from "../components/features/AdminProvider";

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

        {/* ── PROTECTED (dengan Sidebar Layout) ──────────────── */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <LayoutProvider>
                <Dashboard />
              </LayoutProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-panel"
          element={
            <ProtectedRoute>
              <AdminProvider>
              <LayoutProvider>
                <AdminPanel />
              </LayoutProvider>
              </AdminProvider>
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <LayoutProvider>
                <Transactions />
              </LayoutProvider>
            </ProtectedRoute>
          }
        /> */}

        {/* <Route
          path="/raport"
          element={
            <ProtectedRoute>
              <LayoutProvider>
                <Raport />
              </LayoutProvider>
            </ProtectedRoute>
          }
        /> */}

        {/* <Route
          path="/budgets"
          element={
            <ProtectedRoute>
              <LayoutProvider>
                <Budgets />
              </LayoutProvider>
            </ProtectedRoute>
          }
        /> */}

        {/* <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <LayoutProvider>
                <Settings />
              </LayoutProvider>
            </ProtectedRoute>
          }
        /> */}

      </Routes>
    </BrowserRouter>
  );
}