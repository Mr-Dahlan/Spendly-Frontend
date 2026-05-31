// src/components/admin/AddAnnouncementModal.tsx
import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { X, Send, Users, User, Search, Check, Loader2 } from "lucide-react";
import type { CreateAnnouncementPayload } from "../../types/notification";
import type { User as UserType } from "../../types/users";
import { useLenisPrevent } from '../../hooks/useLenisPrevent';

interface AddAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateAnnouncementPayload) => Promise<void>;
  isLoading?: boolean;
  users: UserType[];
  onFetchUsers: () => Promise<void>;
}

export default function AddAnnouncementModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  users,
  onFetchUsers,
}: AddAnnouncementModalProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const scrollRef = useLenisPrevent<HTMLDivElement>();

  useEffect(() => {
    if (isOpen && users.length === 0) {
      setIsFetchingUsers(true);
      onFetchUsers().finally(() => setIsFetchingUsers(false));
    }
  }, [isOpen]);

  // Filter user berdasarkan search
  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [users, search]);

  if (!isOpen) return null;

  const isValid =
    title.trim() &&
    message.trim();

  const toggleUser = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredUsers.length && filteredUsers.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredUsers.map((u) => u.user_id)));
    }
  };

  const handleSubmit = async () => {
    if (!isValid || isLoading) return;

    if (selectedIds.size === 0) {
      await onSubmit({ title: title.trim(), message: message.trim(), user_id: null });
    } else {
      for (const id of Array.from(selectedIds)) {
        await onSubmit({ title: title.trim(), message: message.trim(), user_id: id });
      }
    }

    // Reset state
    setTitle("");
    setMessage("");
    setSelectedIds(new Set());
    setSearch("");
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(10px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-7xl flex flex-col"
        style={{
          height: "92vh",
          background: "var(--card)",
          boxShadow: "var(--boxShadow)",
          borderRadius: "36px",
          overflow: "hidden",
        }}
      >
        {/* ── HEADER ── */}
        <div className="flex items-center justify-between px-8 pt-3 pb-1 flex-shrink-0">
          <div>
            <h2
              className="text-3xl font-bold tracking-tight"
              style={{ color: "var(--text)" }}
            >
              Create Announcement
            </h2>
            <p className="text-base mt-3" style={{ color: "var(--text-secondary)" }}>
              Send announcements globally or only to selected users.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-14 h-14 rounded-3xl flex items-center justify-center transition-all hover:scale-95 flex-shrink-0"
            style={{ background: "var(--bg)" }}
          >
            <X size={20} style={{ color: "var(--text-secondary)" }} />
          </button>
        </div>

        <div
          className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_520px] py-2"
          style={{ overflow: "hidden" }}
        >
          {/* ── LEFT ── */}
          <div className="flex flex-col gap-6 p-8 pt-2 overflow-y-auto">
            {/* Title */}
            <div className="flex flex-col gap-3">
              <label
                className="text-xs uppercase tracking-[0.3em] font-semibold"
                style={{ color: "var(--text-secondary)" }}
              >
                Announcement Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Scheduled Maintenance"
                className="w-full px-6 py-3 rounded-3xl text-base outline-none"
                style={{ background: "var(--bg)", color: "var(--text)" }}
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-3 flex-1">
              <label
                className="text-xs uppercase tracking-[0.3em] font-semibold"
                style={{ color: "var(--text-secondary)" }}
              >
                Announcement Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your announcement here..."
                className="flex-1 min-h-[140px] px-6 py-2 rounded-3xl text-base outline-none resize-none"
                style={{ background: "var(--bg)", color: "var(--text)" }}
              />
            </div>

            {/* Info chip */}
            <div
              className="rounded-3xl p-3 flex items-center gap-3 flex-shrink-0"
              style={{
                background:
                  selectedIds.size > 0 ? "var(--blue-primary)14" : "var(--bg)",
              }}
            >
              <div
                className="w-12 h-8 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background:
                    selectedIds.size > 0
                      ? "var(--blue-primary)22"
                      : "var(--card-secondery)",
                }}
              >
                {selectedIds.size > 0 ? (
                  <User size={20} style={{ color: "var(--blue-primary)" }} />
                ) : (
                  <Users size={20} style={{ color: "var(--text-secondary)" }} />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-base" style={{ color: "var(--text)" }}>
                  {selectedIds.size > 0
                    ? `${selectedIds.size} Users Selected`
                    : "No Users Selected"}
                </h4>
                <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                  {selectedIds.size > 0
                    ? "Announcement will only be sent to selected users."
                    : "Announcement will be broadcast to all users."}
                </p>
              </div>
            </div>
          </div>

          <div
            className="flex flex-col rounded-2xl mr-6"
            style={{
              background: "var(--card-secondery)",
              overflow: "hidden",       
              height: "100% ",
            }}
          >
            {/* Search header — tidak ikut scroll */}
            <div className="px-5 pt-5 pb-3 flex-shrink-0">
              <div
                className="flex items-center gap-3 px-4 py-2.5 rounded-2xl"
                style={{ background: "var(--bg)" }}
              >
                <Search size={15} style={{ color: "var(--text-secondary)" }} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name or email..."
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: "var(--text)" }}
                />
                {isFetchingUsers && (
                  <Loader2
                    size={14}
                    className="animate-spin"
                    style={{ color: "var(--text-secondary)" }}
                  />
                )}
              </div>

              <div className="flex items-center justify-between mt-3 px-1">
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {selectedIds.size} selected
                </span>
                <button
                  onClick={toggleAll}
                  className="text-xs font-medium hover:opacity-70 transition-opacity"
                  style={{ color: "var(--blue-primary)" }}
                >
                  {selectedIds.size === filteredUsers.length && filteredUsers.length > 0
                    ? "Unselect All"
                    : "Select All"}
                </button>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 min-h-0 overflow-y-auto px-4 pb-4"
              style={{ scrollbarWidth: "thin" }}
            >
              <div className="flex flex-col gap-1">
                {filteredUsers.map((u) => {
                  const checked = selectedIds.has(u.user_id);
                  return (
                    <button
                      key={u.user_id}
                      onClick={() => toggleUser(u.user_id)}
                      className="w-full rounded-2xl px-3 py-2.5 flex items-center gap-3 transition-all text-left"
                      style={{
                        background: checked
                          ? "var(--blue-primary)14"
                          : "transparent",
                      }}
                    >
                      {/* Checkbox */}
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
                        style={{
                          background: checked
                            ? "var(--blue-primary)"
                            : "var(--bg)",
                        }}
                      >
                        {checked && (
                          <Check size={11} color="white" strokeWidth={3} />
                        )}
                      </div>

                      {/* Avatar */}
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all"
                        style={{
                          background: checked
                            ? "var(--blue-primary)"
                            : "var(--bg)",
                          color: checked ? "white" : "var(--text-secondary)",
                        }}
                      >
                        {u.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-semibold text-sm truncate leading-tight"
                          style={{ color: "var(--text)" }}
                        >
                          {u.name}
                        </p>
                        <p
                          className="text-xs truncate mt-0.5"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {u.email}
                        </p>
                      </div>

                      {/* Status badge */}
                      <div
                        className="px-2 py-1 rounded-lg text-xs font-medium flex-shrink-0"
                        style={{
                          background: u.status
                            ? "var(--green-primary)20"
                            : "var(--red-primary)20",
                          color: u.status
                            ? "var(--green-primary)"
                            : "var(--red-primary)",
                        }}
                      >
                        {u.status ? "Active" : "Inactive"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div
          className="px-8 py-2 flex items-center justify-end gap-4 flex-shrink-0"
        >
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-3xl text-base font-medium transition-all hover:opacity-80"
            style={{ background: "var(--bg)", color: "var(--text-secondary)" }}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
            className="px-4 py-2 rounded-3xl text-base font-semibold flex items-center gap-3 transition-all disabled:opacity-50 hover:opacity-90 active:scale-95"
            style={{ background: "var(--blue-primary)", color: "white" }}
          >
            <Send size={18} />
            {isLoading
              ? "Sending..."
              : selectedIds.size > 0
              ? `Send to ${selectedIds.size} Users`
              : "Send to All Users"}
          </button>
        </div>
      </div>
    </div>,
    document.body   
  );
}