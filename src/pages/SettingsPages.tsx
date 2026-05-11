import { useAuth } from "../hooks/useAuth";

export default function Settings() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen min-w-screen flex transition-colors duration-300">

      <h1>Welcome {user?.name}</h1><br />
      <p>Halaman Settings</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
