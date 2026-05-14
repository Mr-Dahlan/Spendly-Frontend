// src/components/admin/AddAnnouncementModal.tsx
import { useState } from "react";
import { X, Send, Users, User, ChevronDown } from "lucide-react";
import type { CreateAnnouncementPayload } from "../../hooks/useAnnouncement";

interface AddAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateAnnouncementPayload) => Promise<void>;
  isLoading?: boolean;
}

type TargetMode = "everyone" | "specific";

export default function AddAnnouncementModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: AddAnnouncementModalProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetMode, setTargetMode] = useState<TargetMode>("everyone");
  const [userId, setUserId] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const isValid =
    title.trim() &&
    message.trim() &&
    (targetMode === "everyone" || (targetMode === "specific" && userId.trim() !== ""));

  const handleSubmit = async () => {
    if (!isValid) return;

    const payload: CreateAnnouncementPayload = {
      title: title.trim(),
      message: message.trim(),
      user_id: targetMode === "specific" ? Number(userId) : null,
    };

    await onSubmit(payload);
    // Reset
    setTitle("");
    setMessage("");
    setTargetMode("everyone");
    setUserId("");
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
            Add New Announcement
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity"
            style={{ background: "var(--bg)" }}
          >
            <X size={16} style={{ color: "var(--text-secondary)" }} />
          </button>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
            Announcement Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Scheduled Maintenance"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border"
            style={{ background: "var(--bg)", color: "var(--text)", borderColor: "var(--border)" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--blue-primary)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
            Content of Announcement
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="You can put new announcement content here"
            rows={5}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border resize-none"
            style={{ background: "var(--bg)", color: "var(--text)", borderColor: "var(--border)" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--blue-primary)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          />
        </div>

        {/* Target Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
            Send To
          </label>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full px-4 py-3 rounded-xl text-sm flex items-center justify-between border transition-all"
              style={{
                background: "var(--bg)",
                color: "var(--text)",
                borderColor: dropdownOpen ? "var(--blue-primary)" : "var(--border)",
              }}
            >
              <div className="flex items-center gap-2">
                {targetMode === "everyone" ? (
                  <Users size={16} style={{ color: "var(--blue-primary)" }} />
                ) : (
                  <User size={16} style={{ color: "var(--purple-primary)" }} />
                )}
                <span>{targetMode === "everyone" ? "Everyone" : "Specific User"}</span>
              </div>
              <ChevronDown
                size={16}
                style={{
                  color: "var(--text-secondary)",
                  transform: dropdownOpen ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                }}
              />
            </button>

            {dropdownOpen && (
              <div
                className="absolute top-full mt-1 w-full rounded-xl overflow-hidden z-10 border"
                style={{
                  background: "var(--card-secondery)",
                  borderColor: "var(--border)",
                  boxShadow: "var(--boxShadow)",
                }}
              >
                {/* Everyone */}
                <button
                  onClick={() => { setTargetMode("everyone"); setUserId(""); setDropdownOpen(false); }}
                  className="w-full px-4 py-3 text-sm text-left flex items-center gap-3 transition-colors hover:opacity-80"
                  style={{
                    background: targetMode === "everyone" ? "var(--blue-primary)" : "transparent",
                    color: targetMode === "everyone" ? "white" : "var(--text)",
                  }}
                >
                  <Users size={15} />
                  <div>
                    <p className="font-medium">Everyone</p>
                    <p className="text-xs opacity-70">Broadcast ke semua user</p>
                  </div>
                </button>

                {/* Specific */}
                <button
                  onClick={() => { setTargetMode("specific"); setDropdownOpen(false); }}
                  className="w-full px-4 py-3 text-sm text-left flex items-center gap-3 transition-colors hover:opacity-80"
                  style={{
                    background: targetMode === "specific" ? "var(--blue-primary)" : "transparent",
                    color: targetMode === "specific" ? "white" : "var(--text)",
                  }}
                >
                  <User size={15} />
                  <div>
                    <p className="font-medium">Specific User</p>
                    <p className="text-xs opacity-70">Kirim ke 1 user berdasarkan ID</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* User ID input — hanya muncul kalau mode specific */}
        {targetMode === "specific" && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
              User ID
            </label>
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Masukkan user_id target"
              min={1}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border"
              style={{ background: "var(--bg)", color: "var(--text)", borderColor: "var(--border)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--purple-primary)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Notifikasi hanya akan diterima oleh user dengan ID ini.
            </p>
          </div>
        )}

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
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
            className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "var(--blue-primary)", color: "white" }}
          >
            <Send size={15} />
            {isLoading ? "Sending..." : "Send Announcement"}
          </button>
        </div>
      </div>
    </div>
  );
}