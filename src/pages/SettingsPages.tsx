import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "../components/ui/ThemeToggle";

export default function Transactions() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen min-w-screen flex transition-colors duration-300">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <h1>Welcome {user?.name}</h1><br />
      <p>Halaman Transactions</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
