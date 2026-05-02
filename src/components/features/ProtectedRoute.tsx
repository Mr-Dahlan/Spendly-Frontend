import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ children }: any) {
  const { user, loading } = useAuth();

  // ⏳ tunggu cek /me selesai
  if (loading) return <div>Loading...</div>;

  // ❌ belum login → tendang ke login
  if (!user) return <Navigate to="/login" replace />;

  // ✅ sudah login → lanjut
  return children;
}
