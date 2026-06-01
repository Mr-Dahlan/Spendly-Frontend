// src/components/NotificationPanel.tsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
} from '../../hooks/useNotification';
import type { Notification } from '../../types/notification';

// ─── Bell Icon ────────────────────────────────
function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}

// ─── Trash Icon ───────────────────────────────
function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

// ─── Time formatter ───────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

// ─── Single notification row ──────────────────
function NotificationItem({
  notification,
  onRead,
  onDelete,
}: {
  notification: Notification;
  onRead: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div
      className={`
        group relative flex items-start gap-3 px-4 py-3
        transition-colors duration-150 cursor-pointer
        hover:bg-gray-50 dark:hover:bg-gray-800/60
        ${!notification.is_read ? 'bg-blue-50/40 dark:bg-blue-900/10' : ''}
      `}
      onClick={() => !notification.is_read && onRead(notification.notif_id)}
    >
      {/* Unread dot */}
      <span
        className={`
          mt-1.5 flex-shrink-0 w-2 h-2 rounded-full transition-opacity duration-200
          ${!notification.is_read ? 'bg-blue-500 opacity-100' : 'opacity-0'}
        `}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug ${
            !notification.is_read
              ? 'font-semibold text-text-primary'
              : 'font-normal text-text-secondary'
          }`}
        >
          {notification.title}
        </p>
        {notification.message && (
          <p className="text-xs text-text-tertiary mt-0.5 leading-relaxed line-clamp-2">
            {notification.message}
          </p>
        )}
        <p className="text-xs text-text-tertiary mt-1 opacity-70">{timeAgo(notification.created_at)}</p>
      </div>

      {/* Delete button — appears on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(notification.notif_id);
        }}
        aria-label="Delete notification"
        className="
          flex-shrink-0 opacity-0 group-hover:opacity-100
          p-1 rounded-md text-gray-400 hover:text-red-500
          hover:bg-red-50 dark:hover:bg-red-900/20
          transition-all duration-150
        "
      >
        <TrashIcon className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Empty state ──────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
        <BellIcon className="w-5 h-5 text-gray-400" />
      </div>
      <p className="text-sm font-medium text-text-secondary">All caught up!</p>
      <p className="text-xs text-text-tertiary mt-1">No notifications yet.</p>
    </div>
  );
}

// ─── Main component ───────────────────────────
export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { notifications, unreadCount, isLoading } = useNotifications();
  const { markAsRead } = useMarkAsRead();
  const { markAllAsRead, isLoading: isMarkingAll } = useMarkAllAsRead();
  const { deleteNotification } = useDeleteNotification();

  // ─── Close on outside click ───────────────────
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // ─── Close on Escape ──────────────────────────
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  return (
    <div ref={panelRef} className="relative flex items-center">
      {/* Bell button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
        aria-expanded={open}
        className={`
          relative p-1.5 rounded-full transition-all duration-200
          text-gray-500 dark:text-gray-400
          hover:bg-[var(--blue-primary)]
          hover:text-gray-700 dark:hover:text-gray-200
          ${open ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200' : ''}
        `}
      >
        <BellIcon className="w-5 h-5" />

        {/* Badge */}
        {unreadCount > 0 && (
          <span
            className="
              absolute -top-0.5 -right-0.5
              min-w-[16px] h-4 px-1
              flex items-center justify-center
              text-[10px] font-bold text-white
              bg-blue-500 rounded-full
              ring-2 ring-white dark:ring-gray-900
            "
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="
            absolute top-full right-0 mt-2 z-50
            rounded-2xl overflow-hidden
            bg-[var(--card)]
            border border-gray-100 dark:border-gray-700/50
            animate-in
          "
          style={{
            width: 'calc(85vw)',
            maxWidth: '320px',
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.14)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700/50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text-primary">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                disabled={isMarkingAll}
                className="
                  text-xs font-medium text-blue-500 hover:text-blue-600
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-150
                "
              >
                {isMarkingAll ? 'Marking...' : 'Mark all read'}
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[360px] overflow-y-auto overscroll-contain divide-y divide-gray-100 dark:divide-gray-700/40">
            {isLoading ? (
              // Skeleton loader
              <div className="px-4 py-3 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3 animate-pulse">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <EmptyState />
            ) : (
              notifications.map((notif) => (
                <NotificationItem
                  key={notif.notif_id}
                  notification={notif}
                  onRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700/50 text-center">
              <button
                onClick={() => {
                  setOpen(false);
                  navigate('/settings');
                }}
                className="text-xs font-medium text-text-tertiary hover:text-text-secondary transition-colors duration-150"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}