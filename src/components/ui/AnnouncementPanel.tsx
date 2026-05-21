// src/components/admin/AnnouncementPanel.tsx
import { useState } from "react";
import {
  Megaphone,
  LogIn,
  UserPlus,
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  FileBarChart2,
  Settings,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import AddAnnouncementModal from "./AddAnnouncementModal";
import type { CreateAnnouncementPayload } from "../../types/notification";
import type { User } from "../../types/users";

interface AnnouncementPanelProps {
  onSendAnnouncement: (payload: CreateAnnouncementPayload) => Promise<void>;
  isLoading?: boolean;
  lastAnnouncement?: { title: string; message: string } | null;
  users: User[];
  onFetchUsers: () => Promise<void>;
}

const USER_PAGES = [
  { label: "Login",        icon: LogIn,           href: "/login" },
  { label: "Register",     icon: UserPlus,        href: "/register" },
  { label: "Dashboard",    icon: LayoutDashboard, href: "/dashboard" },
  { label: "Transactions", icon: ArrowLeftRight,  href: "/transactions" },
  { label: "Budgets",      icon: PieChart,        href: "/budgets" },
  { label: "Reports",      icon: FileBarChart2,   href: "/reports" },
  { label: "Settings",     icon: Settings,        href: "/settings" },
];

export default function AnnouncementPanel({
  onSendAnnouncement,
  isLoading,
  lastAnnouncement,
  users,
  onFetchUsers,
}: AnnouncementPanelProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [lastSent, setLastSent] = useState<{ title: string; message: string } | null>(
    lastAnnouncement ?? null
  );

  const handleSubmit = async (payload: CreateAnnouncementPayload) => {
    await onSendAnnouncement(payload);
    setLastSent({ title: payload.title, message: payload.message });
  };

  return (
    <>
      <div
        className="rounded-2xl p-5 flex flex-col gap-4"
        style={{ background: "var(--card)", boxShadow: "var(--boxShadow)" }}
      >
        {/* Header */}
        <h3
          className="font-semibold text-base"
          style={{ color: "var(--text)" }}
        >
          Post New Announcement
        </h3>

        {/* Description + Publish button */}
        <div className="flex flex-col gap-3">
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Broadcast ke semua user atau kirim ke user tertentu berdasarkan ID.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
            style={{ background: "var(--blue-primary)", color: "white" }}
          >
            <Megaphone size={16} />
            Publish Announcement
          </button>
        </div>

        {/* Last sent indicator */}
        {lastSent && (
          <div
            className="flex items-start gap-2.5 rounded-xl px-3 py-2.5"
            style={{ background: "var(--bg)" }}
          >
            <CheckCircle2
              size={14}
              className="shrink-0 mt-0.5"
              style={{ color: "var(--green, #22c55e)" }}
            />
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              <span className="font-semibold" style={{ color: "var(--text)" }}>
                {lastSent.title}
              </span>{" "}
              — {lastSent.message}
            </p>
          </div>
        )}

        {/* Divider */}
        <div
          className="w-full h-px"
          style={{ background: "var(--border)" }}
        />

        {/* Navigation grid */}
        <div className="flex flex-col gap-2.5">
          <p
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-secondary)" }}
          >
            Preview halaman user
          </p>
          <div className="grid grid-cols-4 gap-2">
            {USER_PAGES.map(({ label, icon: Icon, href }) => (
              <Link
                key={href}
                to={href}
                className="flex flex-col items-center gap-1.5 rounded-xl py-3 px-2 transition-all hover:opacity-80 active:scale-95 group"
                style={{ background: "var(--bg)" }}
              >
                <div className="relative">
                  <Icon size={18} style={{ color: "var(--blue-primary)" }} />
                  <ExternalLink
                    size={8}
                    className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "var(--text-secondary)" }}
                  />
                </div>
                <span
                  className="text-[11px] text-center leading-tight"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <AddAnnouncementModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        users={users}
        onFetchUsers={onFetchUsers}
      />
    </>
  );
}