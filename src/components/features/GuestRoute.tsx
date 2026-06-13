import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function GuestRoute({ children }: any) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;

  // ✅ sudah login → arahkan sesuai role
  if (user) return <Navigate to={user.role === "admin" ? "/admin-panel" : "/dashboard"} replace />;

  return children;
}