import { Users, ArrowUpRight, CreditCard, Server } from "lucide-react";

interface AdminStatsCardProps {
  totalUsers: number;
  userGrowth?: number;
  totalTransactions: string;
  transactionGrowth?: number;
  serverStatus: "online" | "offline" | "maintenance";
  serverUptime?: string;
}

export default function AdminStatsCard({
  totalUsers,
  userGrowth = 12,
  totalTransactions,
  transactionGrowth = 8.4,
  serverStatus = "online",
  serverUptime = "99.9%",
}: AdminStatsCardProps) {
  const statusColor = {
    online: "text-[var(--green-primary)]",
    offline: "text-[var(--red-primary)]",
    maintenance: "text-yellow-500",
  }[serverStatus];

  const statusDot = {
    online: "bg-[var(--green-primary)]",
    offline: "bg-[var(--red-primary)]",
    maintenance: "bg-yellow-500",
  }[serverStatus];

  const statusLabel = {
    online: "Online",
    offline: "Offline",
    maintenance: "Maintenance",
  }[serverStatus];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Total Users */}
      <div
        className="rounded-2xl p-5 flex flex-col gap-3"
        style={{
          background: "var(--card)",
          boxShadow: "var(--boxShadow)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            <Users size={16} />
            <span>Total Registered Users</span>
          </div>
          <span className="text-xs font-semibold text-[var(--green-primary)] flex items-center gap-0.5">
            +{userGrowth}% <ArrowUpRight size={12} />
          </span>
        </div>
        <p className="text-3xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
          {totalUsers.toLocaleString()}
        </p>
      </div>

      {/* Total Transactions */}
      <div
        className="rounded-2xl p-5 flex flex-col gap-3"
        style={{
          background: "var(--card)",
          boxShadow: "var(--boxShadow)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            <CreditCard size={16} />
            <span>Total Transactions</span>
          </div>
          <span className="text-xs font-semibold text-[var(--green-primary)] flex items-center gap-0.5">
            +{transactionGrowth}% <ArrowUpRight size={12} />
          </span>
        </div>
        <p className="text-3xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
          {totalTransactions}
        </p>
      </div>

      {/* Server Status */}
      <div
        className="rounded-2xl p-5 flex flex-col gap-3"
        style={{
          background: "var(--card)",
          boxShadow: "var(--boxShadow)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            <Server size={16} />
            <span>Server Status</span>
          </div>
          <span className={`text-xs font-semibold flex items-center gap-1 ${statusColor}`}>
            <span className={`inline-block w-2 h-2 rounded-full ${statusDot} animate-pulse`} />
            {statusLabel}
          </span>
        </div>
        <p className="text-3xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
          {serverUptime} <span className="text-lg font-medium" style={{ color: "var(--text-secondary)" }}>Uptime</span>
        </p>
      </div>
    </div>
  );
}