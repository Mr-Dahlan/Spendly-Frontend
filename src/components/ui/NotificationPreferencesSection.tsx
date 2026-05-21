// components/ui/NotificationPreferencesSection.tsx
import { useState } from "react";
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
} from "../../hooks/useNotification";
import type { Notification } from "../../types/notification";
import { useLenisPrevent } from "../../hooks/useLenisPrevent";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  return `${Math.floor(hrs / 24)} hari lalu`;
}

function NotificationItem({ notif }: { notif: Notification }) {
  const { markAsRead, isLoading: marking } = useMarkAsRead();
  const { deleteNotification, isLoading: deleting } = useDeleteNotification();

  return (
    <div
      className={`flex gap-3 p-4 rounded-xl border transition-all ${
        !notif.is_read
          ? "bg-blue-50 text-blue-600"
          : "bg-gray-50 border-transparent"
      }`}
    >
      {/* Dot */}
      <div className="mt-1.5 flex-shrink-0">
        <div
          className={`w-2 h-2 rounded-full ${
            !notif.is_read ? "bg-blue-500" : "bg-gray-300"
          }`}
        />
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-800 leading-snug">
            {notif.title}
          </span>
          <span className="text-[11px] text-gray-400 whitespace-nowrap flex-shrink-0">
            {timeAgo(notif.created_at)}
          </span>
        </div>

        <p className="text-[13px] text-gray-500 leading-relaxed mb-2.5">
          {notif.message}
        </p>

        <div className="flex gap-2">
          {!notif.is_read && (
            <button
              onClick={() => markAsRead(notif.notif_id)}
              disabled={marking}
              className="text-[12px] font-semibold px-2.5 py-1 rounded-md bg-violet-100 text-violet-600 hover:bg-violet-200 disabled:opacity-50 transition-colors"
            >
              Tandai dibaca
            </button>
          )}
          <button
            onClick={() => deleteNotification(notif.notif_id)}
            disabled={deleting}
            className="text-[12px] font-semibold px-2.5 py-1 rounded-md bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-50 transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonItem() {
  return (
    <div className="flex gap-3 p-4 rounded-xl bg-gray-50 border border-transparent animate-pulse">
      <div className="mt-1.5 w-2 h-2 rounded-full bg-gray-200 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-gray-200 rounded w-2/5" />
        <div className="h-3 bg-gray-200 rounded w-4/5" />
        <div className="h-3 bg-gray-200 rounded w-3/5" />
      </div>
    </div>
  );
}

export default function NotificationPreferencesSection() {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const scrollRef = useLenisPrevent<HTMLDivElement>();

  const { notifications, unreadCount, isLoading } = useNotifications(
    activeTab === "unread" ? { is_read: false } : {},
  );
  const { markAllAsRead, isLoading: markingAll } = useMarkAllAsRead();

  return (

	  <div className="bg-[var(--card)] rounded-2xl border border-gray-100 shadow-[var(--boxShadow)] p-6 mb-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600 flex-shrink-0">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        <h2 className="text-base font-bold text-[var(--text)]">
          Notification Preferences
        </h2>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 my-5" />

      {/* Notifikasi Admin — Tabs + List */}
      <div className="flex items-center justify-between mb-4">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {(["all", "unread"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-all ${
                activeTab === tab
                  ? "bg-white text-gray-800 font-semibold shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "all" ? "Semua" : "Belum Dibaca"}
              {tab === "unread" && unreadCount > 0 && (
                <span className="bg-violet-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Mark all */}
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            disabled={markingAll}
            className="text-[12px] font-semibold text-violet-600 hover:underline disabled:opacity-50"
          >
            {markingAll ? "Memproses..." : "Tandai semua dibaca"}
          </button>
        )}
      </div>

      {/* List */}
      <div
        ref={scrollRef}
        className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200"
      >
        {isLoading && (
          <>
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
          </>
        )}

        {!isLoading && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-2"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <p className="text-sm">Tidak ada notifikasi</p>
          </div>
        )}

        {!isLoading &&
          notifications.map((notif) => (
            <NotificationItem key={notif.notif_id} notif={notif} />
          ))}
      </div>
    </div>
  );
}

