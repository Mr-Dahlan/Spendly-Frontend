import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
 
export default function AdminProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
 
  if (loading) return null; // atau spinner
 
  if (!user) return <Navigate to="/login" replace />;
 
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;
 
  return <>{children}</>;
}
 
