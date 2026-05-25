// src/pages/AuthPages/ResetPasswordPages.tsx
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Icon from "../../assets/icons/icon.png";
import Coin from "../../assets/images/coin.png";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/reset-password`,
        {
          token,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }
      );
      setSuccess(res.data.message);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ open }: { open: boolean }) =>
    open ? (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </svg>
    ) : (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    );

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
          <img src={Icon} alt="Logo" className="h-14 w-auto" />
        </div>
        <div className="container mt-10 pl-20">
          <div className="flex flex-col gap-2 w-full pr-30">
            <h1 className="text-4xl font-bold">
              Set a new password and get back on track
            </h1>
            <h1>
              Choose a strong password to keep your account safe and secure.
            </h1>
          </div>
          <div className="pb-10 flex justify-start items-center mt-4">
            <div className="bg-[var(--card)] p-4 rounded-4xl shadow-lg">
              <img src={Coin} alt="Logo" className="h-65 w-auto" />
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center" />
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          © {year} Copyright
        </p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12">
        <div className="max-w-sm w-full mx-auto rounded-2xl p-6 shadow-lg shadow-black shadow-inner">

          {/* Heading */}
          <h1
            className="text-2xl font-semibold mb-1"
            style={{ color: "var(--text)", fontSize: "1.8rem" }}
          >
            Reset Password
          </h1>
          <p
            className="text-sm mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            Enter your new password below.
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
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {success && (
            <div
              className="flex items-start gap-3 text-sm rounded-lg px-4 py-3 mb-6"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--green-primary) 10%, transparent)",
                border:
                  "1px solid color-mix(in srgb, var(--green-primary) 30%, transparent)",
                color: "var(--green-primary)",
              }}
            >
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{success} Redirecting to login...</span>
            </div>
          )}

          {/* Form */}
          {!success && (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* New Password */}
              <div>
                <label
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: "var(--text)" }}
                >
                  NEW PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition-shadow pr-10"
                    style={{
                      backgroundColor: "var(--bg)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--blue-primary)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--border)")
                    }
                  />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-2 right-3 flex items-center cursor-pointer"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <EyeIcon open={showPassword} />
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: "var(--text)" }}
                >
                  CONFIRM NEW PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={showPasswordConfirmation ? "text" : "password"}
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition-shadow pr-10"
                    style={{
                      backgroundColor: "var(--bg)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--blue-primary)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--border)")
                    }
                  />
                  <div
                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                    className="absolute inset-y-2 right-3 flex items-center cursor-pointer"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <EyeIcon open={showPasswordConfirmation} />
                  </div>
                </div>
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
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}

          {/* Back to login */}
          <p
            className="text-sm mt-6"
            style={{ color: "var(--text-secondary)" }}
          >
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-medium underline underline-offset-2 text-blue-600 hover:text-blue-800"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}