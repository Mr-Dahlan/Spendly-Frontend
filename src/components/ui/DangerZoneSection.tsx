// components/ui/DangerZoneSection.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { useAuth } from "../../hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";
import { alert } from "../../utils/Alert";

type ModalType = "delete" | "logout";

interface ConfirmModalProps {
  type: ModalType;
  onConfirm: (password?: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}

function ConfirmModal({ type, onConfirm, onCancel, isLoading }: ConfirmModalProps) {
  const isDelete = type === "delete";
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (isDelete) {
      if (!password.trim()) {
        setError("Password wajib diisi.");
        return;
      }
      onConfirm(password);
    } else {
      onConfirm();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-white dark:bg-[var(--card)] rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>

        <h3 className="text-lg font-bold text-gray-800 dark:text-[var(--text)] mb-2">
          {isDelete ? "Delete Account" : "Logout Account"}
        </h3>

        {isDelete ? (
          <>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">
              Are you sure you want to delete this account?{" "}
              <span className="font-semibold text-gray-700 dark:text-[var(--text)]">
                This action cannot be undone.
              </span>
            </p>

            {/* Password Input */}
            <div className="mb-5 text-left">
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1.5">
                Confirm Password
              </label>
              <div className={`flex items-center rounded-xl border ${error ? "border-red-400" : "border-gray-200"} bg-gray-50 dark:bg-[var(--bg-secondary)] px-3 py-2.5`}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                  placeholder="Enter your password"
                  className="flex-1 bg-transparent text-sm outline-none text-gray-800 dark:text-[var(--text)] placeholder-gray-400"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && (
                <p className="mt-1.5 text-xs text-red-500">{error}</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500 mb-6">
            You are about to log out of your account.
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || (isDelete && !password.trim())}
            className="flex-1 px-5 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
          >
            {isLoading ? (
              <span>Proccessing...</span>
            ) : isDelete ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14H6L5 6"/>
                  <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
                </svg>
                Delete
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DangerZoneSection() {
  const { deleteUser } = useUser();
  const navigate = useNavigate();
  const [modal, setModal] = useState<ModalType | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const { user, logout } = useAuth();

  const handleDelete = async (password?: string) => {
  const userId = (user as any)?.user_id ?? (user as any)?.id;
  if (!userId || !password) return;

  setActionLoading(true);
  try {
    await deleteUser(userId, password);
    await logout();
    alert.toast.success("Account Deleted Successfully.");
    navigate("/login");
  } catch (err: any) {
    const msg = "Wrong password.";
    alert.error("Fail to Delete Account", msg);
  } finally {
    setActionLoading(false);
    setModal(null);
  }
};

  const handleLogout = async () => {
  setActionLoading(true);
  try {
    await logout();
    alert.toast.success("Successfully logged out.");
    navigate("/login", { replace: true });
  } catch (err: any) {
    alert.error("Failed Logout", "Something went wrong.");
  } finally {
    setActionLoading(false);
    setModal(null);
  }
};

  return (
    <>
      <div className="bg-red-50 rounded-2xl border border-red-100 p-6 mb-4 shadow-[var(--boxShadow)]">
        <h2 className="text-[15px] font-bold text-red-600 mb-1.5">Danger Zone</h2>
        <p className="text-[13px] text-gray-500 mb-5">
          Once you delete your account, there is no going back. Please be certain.
        </p>

        {/* Error dari server */}
        {deleteError && (
          <p className="mb-3 text-xs text-red-500 font-medium">{deleteError}</p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => { setDeleteError(""); setModal("delete"); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
            </svg>
            Delete Account
          </button>

          <button
            onClick={() => setModal("logout")}
            className="flex items-center gap-2 px-4 py-2.5 bg-transparent border border-red-400 text-red-500 hover:bg-red-100 text-sm font-semibold rounded-lg transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout Account
          </button>
        </div>
      </div>

      {modal && (
        <ConfirmModal
          type={modal}
          onConfirm={modal === "delete" ? handleDelete : handleLogout}
          onCancel={() => { setModal(null); setDeleteError(""); }}
          isLoading={actionLoading}
        />
      )}
    </>
  );
}