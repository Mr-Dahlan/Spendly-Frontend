// src/components/admin/SystemActivityLog.tsx
import { useState, useEffect } from "react";
import {
  ShieldAlert,
  Flame,
  ExternalLink,
  Eye,
  X,
  User,
  Target,
  Clock,
  Tag,
  FileText,
} from "lucide-react";
import type { AdminLog } from "../../types/adminlog";
import { useUser } from "../../hooks/useUser";

interface SystemActivityLogProps {
  logs: AdminLog[];
  isLoading?: boolean;
  onViewAll?: () => void;
}

const actionIcon = (action: string) => {
  const a = action.toLowerCase();
  if (a.includes("reset") || a.includes("password"))
    return <ShieldAlert size={14} className="text-[var(--blue-primary)]" />;
  if (a.includes("firewall") || a.includes("rule"))
    return <Flame size={14} className="text-orange-500" />;
  return <ShieldAlert size={14} className="text-[var(--text-secondary)]" />;
};

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} days ago`;
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getInitials = (name?: string) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function SystemActivityLog({
  logs,
  isLoading,
  onViewAll,
}: SystemActivityLogProps) {
  const { users, fetchAllUsers } = useUser();
  const [selectedLog, setSelectedLog] = useState<AdminLog | null>(null);

  // Pastikan users ter-fetch
  useEffect(() => {
    if (users.length === 0) {
      fetchAllUsers();
    }
  }, [fetchAllUsers, users.length]);

  const getUserById = (id: number | string) =>
    users.find((u) => u.user_id === Number(id));

  return (
    <>
      <div
        className="rounded-2xl p-5 flex flex-col gap-4"
        style={{ background: "var(--card)", boxShadow: "var(--boxShadow)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base" style={{ color: "var(--text)" }}>
            System Activity Log
          </h3>
        </div>

        {/* Log list */}
        <div className="flex flex-col gap-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 items-start animate-pulse">
                <div className="w-7 h-7 rounded-full bg-[var(--bg)] shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-3/4 rounded bg-[var(--bg)]" />
                  <div className="h-2.5 w-1/2 rounded bg-[var(--bg)]" />
                </div>
              </div>
            ))
          ) : logs.length === 0 ? (
            <p className="text-sm text-center py-4" style={{ color: "var(--text-secondary)" }}>
              Tidak ada log aktivitas.
            </p>
          ) : (
            logs.slice(0, 5).map((log) => (
              <div key={log.log_id} className="flex gap-3 items-start group">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "var(--bg)" }}
                >
                  {actionIcon(log.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>
                    {log.action}
                  </p>
                  <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                    {log.description}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                    {timeAgo(log.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedLog(log)}
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
                  style={{ background: "var(--bg)", color: "var(--text-secondary)" }}
                  title="Lihat detail"
                >
                  <Eye size={13} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* View All */}
        <button
          onClick={onViewAll}
          className="w-full mt-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-colors hover:opacity-80"
          style={{ background: "var(--bg)", color: "var(--text-secondary)" }}
        >
          <ExternalLink size={14} />
          View All Logs
        </button>
      </div>

      {/* Detail Modal */}
      {selectedLog && (() => {
        const admin = getUserById(selectedLog.admin_id);
        const targetUser = getUserById(selectedLog.target_user_id);

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={() => setSelectedLog(null)}
          >
            <div
              className="w-full max-w-md rounded-2xl p-5 flex flex-col gap-4"
              style={{ background: "var(--card)", boxShadow: "var(--boxShadow)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "var(--bg)" }}
                  >
                    {actionIcon(selectedLog.action)}
                  </div>
                  <h4 className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                    Detail Log
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:opacity-80"
                  style={{ background: "var(--bg)", color: "var(--text-secondary)" }}
                >
                  <X size={14} />
                </button>
              </div>

              <div className="w-full h-px" style={{ background: "var(--border)" }} />

              {/* Action, Description, Waktu */}
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2.5">
                  <Tag size={14} className="mt-0.5 shrink-0" style={{ color: "var(--blue-primary)" }} />
                  <div>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Action</p>
                    <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
                      {selectedLog.action}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <FileText size={14} className="mt-0.5 shrink-0" style={{ color: "var(--blue-primary)" }} />
                  <div>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Description</p>
                    <p className="text-sm" style={{ color: "var(--text)" }}>
                      {selectedLog.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock size={14} className="mt-0.5 shrink-0" style={{ color: "var(--blue-primary)" }} />
                  <div>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Waktu</p>
                    <p className="text-sm" style={{ color: "var(--text)" }}>
                      {formatDate(selectedLog.created_at)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full h-px" style={{ background: "var(--border)" }} />

              {/* Admin & Target User */}
              <div className="flex flex-col gap-3">
                {/* Admin */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                    style={{ background: "var(--blue-primary)", color: "white" }}
                  >
                    {admin ? getInitials(admin.name) : <User size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Admin</p>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{ background: "var(--blue-primary)", color: "white", opacity: 0.85 }}
                      >
                        {admin?.role ?? "admin"}
                      </span>
                    </div>
                    <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>
                      {admin?.name ?? `ID: ${selectedLog.admin_id}`}
                    </p>
                    <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                      {admin?.email ?? "-"}
                    </p>
                  </div>
                </div>

                {/* Target User */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                    style={{
                      background: "var(--bg)",
                      color: "var(--text-secondary)",
                      border: "1.5px solid var(--border)",
                    }}
                  >
                    {targetUser ? getInitials(targetUser.name) : <Target size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Target User</p>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{
                          background: targetUser?.status ? "#22c55e22" : "#ef444422",
                          color: targetUser?.status ? "#16a34a" : "#dc2626",
                        }}
                      >
                        {targetUser?.status ? "aktif" : "nonaktif"}
                      </span>
                    </div>
                    <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>
                      {targetUser?.name ?? `ID: ${selectedLog.target_user_id}`}
                    </p>
                    <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                      {targetUser?.email ?? "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}