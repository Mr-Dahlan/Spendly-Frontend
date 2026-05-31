import {
  Users,
  UserCheck,
  UserX,
  Activity,
} from "lucide-react";

interface AdminStatsCardProps {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  totalActivities: number;
}
  
interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background: "var(--card)",
        boxShadow: "var(--boxShadow)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        {icon}
        <span>{title}</span>
      </div>

      {/* Value */}
      <div className="flex flex-col">
        <p
          className="text-3xl font-bold tracking-tight"
          style={{ color: "var(--text)" }}
        >
          {value.toLocaleString()}
        </p>

        <span
          className="text-sm mt-1"
          style={{ color: "var(--text-secondary)" }}
        >
          {subtitle}
        </span>
      </div>
    </div>
  );
}

export default function AdminStatsCard({
  totalUsers,
  activeUsers,
  suspendedUsers,
  totalActivities,
}: AdminStatsCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Total Users */}
      <StatCard
        title="Total Users"
        value={totalUsers}
        subtitle="Registered accounts"
        icon={<Users size={16} />}
      />

      {/* Active Users */}
      <StatCard
        title="Active Users"
        value={activeUsers}
        subtitle="Currently active accounts"
        icon={
          <UserCheck
            size={16}
            className="text-[var(--green-primary)]"
          />
        }
      />

      {/* Suspended Users */}
      <StatCard
        title="Suspended Users"
        value={suspendedUsers}
        subtitle="Blocked or restricted users"
        icon={
          <UserX
            size={16}
            className="text-[var(--red-primary)]"
          />
        }
      />

      {/* Activities */}
      <StatCard
        title="System Activities"
        value={totalActivities}
        subtitle="Recent admin activities"
        icon={
          <Activity
            size={16}
            className="text-[var(--blue-primary)]"
          />
        }
      />
    </div>
  );
}