// src/pages/Register.tsx
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import ThemeToggle from "../../components/ui/ThemeToggle";
import Icon from "../../assets/icons/icon.png";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirmation) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, passwordConfirmation);
      navigate("/dashboard");
    } catch (err: any) {
      const message =
        err.response?.data?.errors?.email?.[0] ||
        err.response?.data?.errors?.password?.[0] ||
        err.response?.data?.errors?.name?.[0] ||
        err.response?.data?.message ||
        "Gagal mendaftar. Silakan coba lagi.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const passwordMatch =
    passwordConfirmation.length > 0 && password === passwordConfirmation;
  const passwordMismatch =
    passwordConfirmation.length > 0 && password !== passwordConfirmation;

  const inputStyle = {
    backgroundColor: "var(--bg)",
    border: "1px solid var(--border)",
    color: "var(--text)",
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = "var(--blue-primary)");
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = "var(--border)");

  return (
    <div
      className="min-h-screen min-w-screen flex scrollbar-hide transition-colors duration-300"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 transition-colors duration-300"
        style={{
          backgroundColor: "var(--card)",
          borderRight: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-2">
          <img src={Icon} alt="Logo" className="h-14 w-auto" />
        </div>
        <div className="flex-1 flex items-center justify-center" />
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          © 2026 Aplikasi Kamu
        </p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 py-12">
        {/* Logo mobile */}
        <div className="flex items-center gap-2 mb-10 lg:hidden">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
        </div>

        <div className="max-w-sm w-full mx-auto rounded-2xl p-6 shadow-lg shadow-black shadow-inner">
          {/* Heading */}
          <h1
            className="text-2xl font-semibold mb-1"
            style={{ color: "var(--text)", fontSize: "2rem" }}
          >
            Buat Akun Baru
          </h1>

          <p className="text-xs pb-8">Fill in the ditails to get started</p>

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
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Nama Lengkap */}
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--text)" }}
              >
                NAMA LENGKAP
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                autoComplete="name"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition-shadow"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

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
                placeholder="nama@email.com"
                required
                autoComplete="email"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition-shadow"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Password & Konfirmasi — satu baris */}
            <div className="flex gap-3">
              {/* Password */}
              <div className="flex-1 min-w-0">
                <label
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: "var(--text)" }}
                >
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 karakter"
                    required
                    autoComplete="new-password"
                    className="w-full px-2.5 py-2 text-xs rounded-lg outline-none transition-shadow pr-8"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Konfirmasi Password */}
              <div className="flex-1 min-w-0">
                <label
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: "var(--text)" }}
                >
                  KONFIRMASI
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="Ulangi password"
                    required
                    autoComplete="new-password"
                    className="w-full px-2.5 py-2 text-xs rounded-lg outline-none transition-shadow pr-8"
                    style={{
                      ...inputStyle,
                      ...(passwordMismatch
                        ? { borderColor: "var(--red-primary)" }
                        : passwordMatch
                        ? { borderColor: "var(--green-primary, #22c55e)" }
                        : {}),
                    }}
                    onFocus={handleFocus}
                    onBlur={(e) => {
                      if (passwordMismatch) {
                        e.target.style.borderColor = "var(--red-primary)";
                      } else if (passwordMatch) {
                        e.target.style.borderColor = "var(--green-primary, #22c55e)";
                      } else {
                        e.target.style.borderColor = "var(--border)";
                      }
                    }}
                  />
                  <div
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {showConfirm ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Inline feedback */}
                {passwordMatch && (
                  <p className="mt-1 text-xs flex items-center gap-1" style={{ color: "var(--green-primary, #22c55e)" }}>
                    <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Cocok
                  </p>
                )}
                {passwordMismatch && (
                  <p className="mt-1 text-xs flex items-center gap-1" style={{ color: "var(--red-primary)" }}>
                    <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Tidak cocok
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-sm font-medium rounded-lg transition-colors duration-150 flex items-center justify-center gap-2 hover:bg-blue-900"
              style={{
                backgroundColor: loading ? "var(--border)" : "var(--blue-button)",
                color: "#ffffff",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Mendaftarkan...
                </>
              ) : (
                "Buat Akun"
              )}
            </button>

            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="font-medium underline underline-offset-2 text-blue-600 hover:text-blue-800"
              >
                Masuk di sini
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}