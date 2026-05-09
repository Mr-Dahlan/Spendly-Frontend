// import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../ui/Sidebar"; // sesuaikan path import kamu


interface LayoutProviderProps {
    children: React.ReactNode
}
export default function LayoutProvider({ children }: LayoutProviderProps) {
  // const navigate = useNavigate();
  // const location = useLocation();

  // Ambil nama halaman aktif dari path saat ini
  // contoh: "/transactions" → "transactions"
  // const activePage = location.pathname.replace("/", "") || "dashboard";

  // const handleNavigate = (page:string) => {
    // navigate(page === "dashboard" ? "/" : `/${page}`);
  // };

  // const handleLogout = () => {
    // Tambahkan logic logout kamu di sini
    // contoh: clearToken(), lalu redirect ke login
    // navigate("/login");
  // };
return (
  <div className="flex h-screen overflow-hidden">
    <Sidebar />
    <main className="flex-1 overflow-y-auto">
      {children}
    </main>
  </div>
);
}