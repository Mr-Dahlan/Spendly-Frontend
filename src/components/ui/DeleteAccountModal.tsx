// src/components/admin/DeleteAccountModal.tsx
import {  Trash2, TriangleAlert } from "lucide-react";
import type { User } from "../../types/users";

interface DeleteAccountModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: (userId: number) => Promise<void>;
  isLoading?: boolean;
}

export default function DeleteAccountModal({
  isOpen,
  user,
  onClose,
  onConfirm,
  isLoading,
}: DeleteAccountModalProps) {
  if (!isOpen || !user) return null;

  const handleConfirm = async () => {
    await onConfirm(user.user_id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-5 shadow-2xl text-center"
        style={{ background: "var(--card-secondery)" }}
      >
        {/* Warning icon */}
        <div className="flex justify-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(220, 38, 38, 0.1)" }}
          >
            <TriangleAlert size={28} className="text-[var(--red-primary)]" />
          </div>
        </div>

        {/* Title & description */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
            Delete Account
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Are you sure you want to delete this account?{" "}
            <span className="font-medium text-[var(--red-primary)]">This action cannot be undone.</span>
          </p>
        </div>

        {/* User info */}
        <div
          className="flex items-center gap-3 p-3 rounded-xl border text-left"
          style={{ borderColor: "var(--border)", background: "var(--bg)" }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{ background: "var(--blue-primary)", color: "white" }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
              {user.name}
            </p>
            <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
              {user.email}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-medium border transition-colors hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)", background: "transparent" }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 active:scale-95"
            style={{ background: "var(--red-primary)", color: "white" }}
          >
            <Trash2 size={15} />
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}