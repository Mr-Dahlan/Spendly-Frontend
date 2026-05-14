// src/components/admin/SystemActivityLog.tsx
import { ShieldAlert, Flame, MoreVertical, ExternalLink } from "lucide-react";
import type { AdminLog } from "../../types/adminlog";

interface SystemActivityLogProps {
  logs: AdminLog[];
  isLoading?: boolean;
  onViewAll?: () => void;
}

const actionIcon = (action: string) => {
  const a = action.toLowerCase();
  if (a.includes("reset") || a.includes("password")) return <ShieldAlert size={14} className="text-[var(--blue-primary)]" />;
  if (a.includes("firewall") || a.includes("rule")) return <Flame size={14} className="text-orange-500" />;
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

export default function SystemActivityLog({ logs, isLoading, onViewAll }: SystemActivityLogProps) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: "var(--card)", boxShadow: "var(--boxShadow)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base" style={{ color: "var(--text)" }}>
          System Activity Log
        </h3>
        <button className="text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">
          <MoreVertical size={18} />
        </button>
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
            <div key={log.log_id} className="flex gap-3 items-start">
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
  );
}