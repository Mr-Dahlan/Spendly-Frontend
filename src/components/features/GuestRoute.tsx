import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function GuestRoute({ children }: any) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // ✅ sudah login → lempar ke dashboard
  if (user) return <Navigate to="/dashboard" replace />;

  return children;
}
