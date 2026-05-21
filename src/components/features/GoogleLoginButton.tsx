import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // sesuaikan path

interface GoogleLoginButtonProps {
  onError?: (message: string) => void;
}

export default function GoogleLoginButton({ onError }: GoogleLoginButtonProps) {
  const { loginWithGoogle } = useAuth(); // ✅ ambil dari hook
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const user = await loginWithGoogle(tokenResponse.access_token);
        await navigate(user?.role === "admin" ? "/admin-panel" : "/dashboard");
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Login dengan Google gagal. Silakan coba lagi.";
        onError?.(message);
      } finally {
        setLoading(false);
      }
    },
    onError: () => onError?.("Login dengan Google dibatalkan atau gagal."),
  });

  return (
    <button
      type="button"
      onClick={() => handleGoogleLogin()}
      disabled={loading}
      className="w-full py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-150 flex items-center justify-center gap-3"
      style={{
        backgroundColor: "var(--bg)",
        border: "1px solid var(--border)",
        color: "var(--text)",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.7 : 1,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--blue-primary)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Menghubungkan...
        </>
      ) : (
        <>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-4z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.4-5.1l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.5 5C9.5 40.1 16.3 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.8 35.5 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/>
          </svg>
          Continue with Google
        </>
      )}
    </button>
  );
}