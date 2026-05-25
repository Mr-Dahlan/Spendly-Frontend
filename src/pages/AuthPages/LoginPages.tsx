// src/pages/Login.tsx
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import GoogleLoginButton from "../../components/features/GoogleLoginButton";

import Checkbox from "../../components/ui/Checkbox";
import Icon from "../../assets/icons/icon.png";
import Coin from "../../assets/images/coin.png";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      // console.log("loggedInUser:", loggedInUser);
      // console.log("role:", loggedInUser?.role);
      await navigate(
        loggedInUser?.role === "admin" ? "/admin-panel" : "/dashboard",
      );
    } catch (err: any) {
      const message =
        err.response?.data?.error?.data?.[0] ||
        err.response?.data?.message ||
        "Email atau password salah. Silakan coba lagi.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const year = new Date().getFullYear();

  return (
    <div
      className="min-h-screen min-w-screen flex scrollbar-hide transition-colors duration-300"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 transition-colors duration-300"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <div className="flex items-center gap-2 absolute top-4 left-8">
          <img src={Icon} alt="Logo" className="h-14 w-auto " />
        </div>
        <div className="contaner mt-10 pl-20">
          <div className="flex flex-col gap-2 w-full pr-30">
            <h1 className="text-4xl font-bold">
              Master your wealth with elegence
            </h1>
            <h1>
              Experience finansial clarity throughout tactile design and
              inteligent insights.
            </h1>
          </div>
          <div className="pb-10 flex justify-start items-center mt-4">
            <div className="bg-[var(--card)] p-4 rounded-4xl shadow-lg">
              <img src={Coin} alt="Logo" className="h-65 w-auto " />
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center" />
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          © {year} Copyright
        </p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 ">
        <div className="max-w-sm w-full mx-auto  rounded-2xl p-6 shadow-lg shadow-black shadow-inner ">
          {/* Heading */}
          <h1
            className="text-2xl font-semibold mb-1"
            style={{ color: "var(--text)", fontSize: "1.8rem" }}
          >
            Welcome Back
          </h1>
          <p
            className="text-sm mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            Please enter your details to sign in.
          </p>

          {/* Error Banner */}
          {error && (
            <div
              className="flex items-start gap-3 text-sm rounded-lg px-4 py-3 mb-6"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--red-primary) 10%, transparent)",
                border:
                  "1px solid color-mix(in srgb, var(--red-primary) 30%, transparent)",
                color: "var(--red-primary)",
              }}
            >
              <svg
                className="w-4 h-4 mt-0.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5 ">
            {/* Email */}
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--text)" }}
              >
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                required
                autoComplete="email"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition-shadow"
                style={{
                  backgroundColor: "var(--bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--blue-primary)")
                }
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label
                  className="block text-xs font-medium"
                  style={{ color: "var(--text)" }}
                >
                  PASSWORD
                </label>
                {/* ✅ Tag <a> yang sudah diperbaiki */}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition-shadow pr-10"
                  style={{
                    backgroundColor: "var(--bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--blue-primary)")
                  }
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-2 right-3 flex items-center cursor-pointer"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {showPassword ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-between items-center">
              <div className="w-auto flex flex-row items-center">
                <Checkbox />
                <label
                  style={{ color: "var(--text)" }}
                  className="text-xs ml-2"
                >
                  {" "}
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-xs cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-sm font-medium rounded-lg transition-colors duration-150 flex items-center justify-center gap-2 hover:bg-blue-900"
              style={{
                backgroundColor: loading
                  ? "var(--border)"
                  : "var(--blue-button)",
                color: "#ffffff",
                cursor: "pointer",
              }}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Loading...
                </>
              ) : (
                "Login"
              )}
            </button>

            <p className="flex items-center justify-center text-[10px] opacity-70 text-[var(--text)]">
              OR CONTINUE WITH
            </p>

            <GoogleLoginButton onError={(msg) => setError(msg)} />

            <p
              className="text-sm mb-8"
              style={{ color: "var(--text-secondary)" }}
            >
              Don't have an acoount?{" "}
              <Link
                to="/register"
                className="font-medium underline underline-offset-2 text-blue-600 hover:text-blue-800 "
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
