// components/ui/ChangePasswordSection.tsx
import { useState } from "react";
import { useUser } from "../../hooks/useUser";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
}

function PasswordField({ label, value, onChange, show, onToggle }: PasswordFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          className="w-full px-3.5 py-2.5 pr-10 bg-gray-50 border border-transparent rounded-lg text-sm text-gray-800 outline-none focus:border-violet-500 focus:bg-violet-50 transition-all placeholder:text-gray-400"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <EyeIcon open={show} />
        </button>
      </div>
    </div>
  );
}

export default function ChangePasswordSection() {
  const { updateMe, isLoading, error, clearError } = useUser();

  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const toggle = (field: keyof typeof show) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleUpdate = async () => {
    setLocalError(null);
    clearError();
    setSuccess(false);

    if (!current || !newPass || !confirm) {
      setLocalError("Semua field harus diisi.");
      return;
    }
    if (newPass.length < 8) {
      setLocalError("Password baru minimal 8 karakter.");
      return;
    }
    if (newPass !== confirm) {
      setLocalError("Konfirmasi password tidak cocok.");
      return;
    }

    try {
      await updateMe({ password: newPass, password_confirmation: confirm });
      setSuccess(true);
      setCurrent(""); setNewPass(""); setConfirm("");
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      // error dari context
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600 flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h2 className="text-base font-bold text-gray-800">Change Password</h2>
      </div>

      {/* Current Password */}
      <PasswordField
        label="Current Password"
        value={current}
        onChange={setCurrent}
        show={show.current}
        onToggle={() => toggle("current")}
      />

      {/* New + Confirm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <PasswordField
          label="New Password"
          value={newPass}
          onChange={setNewPass}
          show={show.new}
          onToggle={() => toggle("new")}
        />
        <PasswordField
          label="Confirm New Password"
          value={confirm}
          onChange={setConfirm}
          show={show.confirm}
          onToggle={() => toggle("confirm")}
        />
      </div>

      {/* Feedback */}
      {(error || localError) && (
        <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {localError ?? error}
        </p>
      )}
      {success && (
        <p className="mt-3 text-sm text-green-600 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
          ✓ Password berhasil diperbarui.
        </p>
      )}

      <div className="flex justify-end mt-5">
        <button
          onClick={handleUpdate}
          disabled={isLoading}
          className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {isLoading ? "Memperbarui..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}