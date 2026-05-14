// src/pages/AdminPage.tsx
import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";
import { useAdminLogs } from "../hooks/useAdminLog";
import { useSendAnnouncement } from "../hooks/useAnnouncement";
import type { CreateAnnouncementPayload } from "../hooks/useAnnouncement";
import AdminStatsCard from "../components/ui/AdminStatsCard";
import SystemActivityLog from "../components/ui/SystemActivityLog";
import AnnouncementPanel from "../components/ui/AnnouncementPanel";
import UserManagementTable from "../components/ui/UserManagementTable";

export default function AdminPage() {
  // ── Hooks ──────────────────────────────────────────────────────────────────
  const {
    users,
    isLoading: usersLoading,
    fetchAllUsers,
    adminUpdateUser,
    deleteUser,
  } = useUser();

  const { logs, isLoading: logsLoading } = useAdminLogs();
  const { sendAnnouncement, isLoading: announcementLoading } = useSendAnnouncement();

  const [isBanning, setIsBanning] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  /** Ban: set status false + kirim notifikasi ke user ybs */
  const handleBanUser = async (userId: number, reason: string) => {
    setIsBanning(true);
    try {
      await adminUpdateUser(userId, { status: false });
      await sendAnnouncement({
        title: "Akun Anda Ditangguhkan",
        message: reason,
        user_id: userId, // kirim hanya ke user yang di-ban
      });
    } finally {
      setIsBanning(false);
    }
  };

  /** Delete user */
  const handleDeleteUser = async (userId: number) => {
    setIsDeleting(true);
    try {
      await deleteUser(userId);
    } finally {
      setIsDeleting(false);
    }
  };

  /** Kirim announcement — broadcast atau spesifik (user_id dari modal) */
  const handleSendAnnouncement = async (payload: CreateAnnouncementPayload) => {
    await sendAnnouncement(payload);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <main
      className="flex-1 overflow-y-auto p-6 flex flex-col gap-6"
      style={{ background: "var(--bg)" }}
    >
      {/* Stats */}
      <AdminStatsCard
        totalUsers={users.length}
        userGrowth={12}
        totalTransactions="IDR 1.2M"
        transactionGrowth={8.4}
        serverStatus="online"
        serverUptime="99.9%"
      />

      {/* Activity Log + Announcement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemActivityLog
          logs={logs}
          isLoading={logsLoading}
          onViewAll={() => console.log("Navigate to full log page")}
        />
        <AnnouncementPanel
          onSendAnnouncement={handleSendAnnouncement}
          isLoading={announcementLoading}
        />
      </div>

      {/* User Management */}
      <UserManagementTable
        users={users}
        isLoading={usersLoading}
        onBanUser={handleBanUser}
        onDeleteUser={handleDeleteUser}
        isBanning={isBanning}
        isDeleting={isDeleting}
        onViewUser={(user) => console.log("View user:", user)}
        onAddAdmin={() => console.log("Open add admin modal")}
      />
    </main>
  );
}