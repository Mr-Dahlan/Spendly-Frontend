// src/pages/AdminPage.tsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUser } from "../hooks/useUser";
import { useAdminLogs } from "../hooks/useAdminLog";
import { useSendAnnouncement } from "../hooks/useAnnouncement";

import type { CreateAnnouncementPayload } from "../types/notification";

import AdminStatsCard from "../components/ui/AdminStatsCard";
import SystemActivityLog from "../components/ui/SystemActivityLog";
import AnnouncementPanel from "../components/ui/AnnouncementPanel";
import UserManagementTable from "../components/ui/UserManagementTable";

export default function AdminPage() {
  const navigate = useNavigate();

  const {
    users,
    isLoading: usersLoading,
    fetchAllUsers,
    updateUserStatus,
    updateUserRole,
    deleteUserByAdmin,
  } = useUser();

  const {
    logs,
    isLoading: logsLoading,
    refetch: refetchLogs,
  } = useAdminLogs();

  const {
    sendAnnouncement,
    isLoading: announcementLoading,
  } = useSendAnnouncement();

  const [isBanning, setIsBanning] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const stats = useMemo(() => {
    const activeUsers = users.filter((user) => user.status === true).length;
    const suspendedUsers = users.filter((user) => user.status === false).length;

    return {
      totalUsers: users.length,
      activeUsers,
      suspendedUsers,
      totalActivities: logs.length,
    };
  }, [users, logs]);


  // Suspend user
  const handleBanUser = async (userId: number, reason: string) => {
    setIsBanning(true);
    try {
      await updateUserStatus(userId, false);
      await sendAnnouncement({
        title: "Akun Anda Ditangguhkan",
        message: reason,
        user_id: userId,
      });
      await refetchLogs();
    } finally {
      setIsBanning(false);
    }
  };

  // Activate user
  const handleActivateUser = async (userId: number) => {
    await updateUserStatus(userId, true);
    await refetchLogs();
  };

  // Promote user to admin
  const handleMakeAdmin = async (userId: number) => {
    await updateUserRole(userId, "admin");
    await refetchLogs();
  };

  // Delete user
  const handleDeleteUser = async (userId: number) => {
    setIsDeleting(true);
    try {
      await deleteUserByAdmin(userId);
      await refetchLogs();
    } finally {
      setIsDeleting(false);
    }
  };

  // Send announcement
  const handleSendAnnouncement = async (payload: CreateAnnouncementPayload) => {
    await sendAnnouncement(payload);
  };

  return (
    <main
      className="flex-1 overflow-y-auto p-6 flex flex-col gap-6"
      style={{ background: "var(--bg)" }}
    >
      {/* Dashboard Stats */}
      <AdminStatsCard
        totalUsers={stats.totalUsers}
        activeUsers={stats.activeUsers}
        suspendedUsers={stats.suspendedUsers}
        totalActivities={stats.totalActivities}
      />

      {/* Logs + Announcement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemActivityLog
          logs={logs}
          isLoading={logsLoading}
          onViewAll={() => navigate("/admin-logs")}
        />

        <AnnouncementPanel
          onSendAnnouncement={handleSendAnnouncement}
          isLoading={announcementLoading}
          users={users}
          onFetchUsers={fetchAllUsers}
        />
      </div>

      {/* User Management */}
      <UserManagementTable
        users={users}
        isLoading={usersLoading}
        onBanUser={handleBanUser}
        onActivateUser={handleActivateUser}
        onMakeAdmin={handleMakeAdmin}
        onDeleteUser={handleDeleteUser}
        isBanning={isBanning}
        isDeleting={isDeleting}
      />
    </main>
  );
}