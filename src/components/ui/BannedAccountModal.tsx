// src/components/admin/BannedAccountModal.tsx
import { useState } from "react";
import { X, ShieldOff } from "lucide-react";
import type { User } from "../../types/users";

interface BannedAccountModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: (userId: number, reason: string) => Promise<void>;
  isLoading?: boolean;
}

export default function BannedAccountModal({
  isOpen,
  user,
  onClose,
  onConfirm,
  isLoading,
}: BannedAccountModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen || !user) return null;

  const handleConfirm = async () => {
    if (!reason.trim()) return;
    await onConfirm(user.user_id, reason);
    setReason("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-5 shadow-2xl"
        style={{ background: "var(--card-secondery)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
            Banned Account
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:opacity-70"
            style={{ background: "var(--bg)" }}
          >
            <X size={16} style={{ color: "var(--text-secondary)" }} />
          </button>
        </div>

        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
            Full Name
          </label>
          <div
            className="px-4 py-3 rounded-xl flex items-center gap-3 border"
            style={{ background: "var(--bg)", borderColor: "var(--border)" }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
              style={{ background: "var(--blue-primary)", color: "white" }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm" style={{ color: "var(--text)" }}>{user.name}</span>
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
            Email Address
          </label>
          <div
            className="px-4 py-3 rounded-xl flex items-center gap-3 border"
            style={{ background: "var(--bg)", borderColor: "var(--border)" }}
          >
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>✉</span>
            <span className="text-sm" style={{ color: "var(--text)" }}>{user.email}</span>
          </div>
        </div>

        {/* Reason */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
            Content of Announcement
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Put reason why you banned this account"
            rows={4}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border resize-none"
            style={{
              background: "var(--bg)",
              color: "var(--text)",
              borderColor: "var(--border)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--red-primary)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-1">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-medium border transition-colors hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)", background: "transparent" }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reason.trim() || isLoading}
            className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 active:scale-95"
            style={{ background: "var(--blue-primary)", color: "white" }}
          >
            <ShieldOff size={15} />
            {isLoading ? "Banning..." : "Banned Account"}
          </button>
        </div>
      </div>
    </div>
  );
}