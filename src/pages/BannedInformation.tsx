// src/pages/BannedInformation.tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotification';
import { alert } from '../utils/Alert';

import {
  ShieldX, Ban, AlertCircle, Calendar,
  UserX, Clock, Headset, Mail, MessageCircle,
  LogOut, ChevronRight
} from 'lucide-react';

export default function BannedInformation() {
  const {  logout } = useAuth();
  const navigate = useNavigate();
  const { notifications, isLoading } = useNotifications();

  // Cari notifikasi banned dari admin
  const bannedNotif = notifications.find((n) =>
    n.title.toLowerCase().includes('ban')
  );

  const banReason  = bannedNotif?.message ?? bannedNotif?.title ?? 'No reason provided by admin.';
  const bannedDate = bannedNotif
    ? new Date(bannedNotif.created_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : '-';

  const handleLogout = async () => {
    const confirmed = await alert.confirm({
          title: "Logout?",
          text: "Kamu akan keluar dari sesi ini.",
          confirmText: "Ya, Logout",
          cancelText: "Batal",
          danger: true,
        });
    
        if (confirmed) {
          logout();
          navigate("/login");
        }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6 bg-[var(--bg)] min-h-screen">

      {/* Badge */}
      <span className="inline-flex items-center gap-2 bg-red-50 text-red-600 text-xs font-medium px-4 py-1.5 rounded-full border border-red-200">
        <ShieldX size={13} />
        Account Banned
      </span>

      {/* Icon */}
      <div className="w-18 h-18 rounded-full bg-red-50 border border-red-200 flex items-center justify-center p-5">
        <Ban size={32} className="text-red-600" />
      </div>

      {/* Title */}
      <div className="text-center flex flex-col items-center gap-2">
        <h1 className="text-xl font-medium text-[var(--text)]">Your account has been banned</h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-sm leading-relaxed">
          Your access to Spendly features has been restricted. Please review the information below and contact admin for further assistance.
        </p>
      </div>

      {/* Ban Details */}
      <div className="w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
        <p className="text-xs font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
          <AlertCircle size={14} /> Ban reason
        </p>

        {/* Reason box — skeleton saat loading */}
        <div className="bg-[var(--bg)] rounded-lg p-3 border-l-4 border-red-500 min-h-[48px]">
          {isLoading ? (
            <div className="h-4 w-3/4 bg-[var(--border)] rounded animate-pulse" />
          ) : (
            <p className="text-sm text-[var(--text)] leading-relaxed">{banReason}</p>
          )}
        </div>

        <div className="mt-3 space-y-2">
          {[
            {
              icon: <Calendar size={14} />,
              label: 'Banned date',
              value: isLoading ? '...' : bannedDate,
            },
            {
              icon: <UserX size={14} />,
              label: 'Banned by',
              value: 'Spendly Admin',
            },
            {
              icon: <Clock size={14} />,
              label: 'Status',
              value: 'Banned',
              danger: true,
            },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0"
            >
              <span className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
                {row.icon}{row.label}
              </span>
              <span className={`text-xs font-medium ${row.danger ? 'text-red-500' : 'text-[var(--text)]'}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Admin */}
      <div className="w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
        <p className="text-xs font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
          <Headset size={14} /> Contact admin
        </p>
        {[
          {
            icon: <Mail size={16} className="text-blue-500" />,
            bg: 'bg-blue-50',
            label: 'Email',
            value: 'admin@spendly.id',
          },
          {
            icon: <MessageCircle size={16} className="text-green-500" />,
            bg: 'bg-green-50',
            label: 'WhatsApp',
            value: '+62 812-3456-7890',
          },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 py-2.5 border-b border-[var(--border)] last:border-0 cursor-pointer hover:opacity-70 transition"
          >
            <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
              {item.icon}
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">{item.label}</p>
              <p className="text-sm font-medium text-[var(--text)]">{item.value}</p>
            </div>
            <ChevronRight size={14} className="text-[var(--text-secondary)] ml-auto" />
          </div>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full max-w-md flex items-center justify-center gap-2 py-3 rounded-lg bg-red-50 text-red-600 border border-red-200 text-sm font-medium hover:opacity-80 transition"
      >
        <LogOut size={16} />
        Logout from this account
      </button>

      <p className="text-xs text-[var(--text-secondary)] text-center max-w-sm">
        If you believe this is a mistake, please contact admin with your email and account ID.
      </p>

    </div>
  );
}