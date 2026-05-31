// pages/Settings.tsx
import { useState, useEffect } from "react";
import { useUser } from "../hooks/useUser";
import { useUnreadNotifications } from "../hooks/useNotification";

import AccountDetailsSection from "../components/ui/AccountDetailsSection";
import ChangePasswordSection from "../components/ui/ChangePasswordSection";
import NotificationPreferencesSection from "../components/ui/NotificationPreferencesSection";
import DangerZoneSection from "../components/ui/DangerZoneSection";

type Tab = "general" | "notifications";

function ProfileAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-violet-400 flex items-center justify-center text-white text-base font-bold flex-shrink-0 select-none">
      {initials}
    </div>
  );
}

const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: "general",
    label: "General",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
];

export default function Settings() {
  const { currentUser, fetchMe } = useUser();
  const { unreadCount } = useUnreadNotifications();
  const [activeTab, setActiveTab] = useState<Tab>("general");

  useEffect(() => {
    if (!currentUser) fetchMe();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] px-4 sm:px-6 py-8 font-sans">
      {/* Page Header */}
      <div className="mb-6 mt-4 sm:mt-0">
        <h1 className="text-2xl font-bold text-[var(--text)]">Account &amp; Preferences</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Manage your account profile, security, and notifications.</p>
      </div>

      {/* User Info Bar */}
      {currentUser && (
        <div className="flex items-center gap-4 bg-[var(--card)] border border-gray-100 rounded-2xl shadow-[var(--boxShadow)] px-5 py-4 mb-6">
          <ProfileAvatar name={currentUser.name} />
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[15px] font-bold text-[var(--text)] truncate">{currentUser.name}</span>
            <div className="flex items-center gap-2 text-sm text-gray-400 min-w-0">
              <span className="truncate">{currentUser.email}</span>
              <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                currentUser.role === "admin"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-violet-100 text-violet-600"
              }`}>
                {currentUser.role === "admin" ? "Admin" : "Member"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab bar — mobile only */}
      <div className="flex md:hidden gap-1 bg-[var(--card)] border border-gray-100 rounded-2xl shadow-[var(--boxShadow)] p-1.5 mb-4">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === item.id
                ? "bg-blue-50 text-blue-600"
                : "text-[var(--text-secondary)] hover:bg-gray-50"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.id === "notifications" && unreadCount > 0 && (
              <span className="bg-violet-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Layout */}
      <div className="flex gap-5 items-start">
        <aside className="hidden md:block w-48 flex-shrink-0 bg-[var(--card)] rounded-2xl border border-gray-100 shadow-[var(--boxShadow)] p-2 sticky top-8">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 last:mb-0 ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                  : "text-[var(--secondary)] hover:bg-gray-50 hover:text-gray-500"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.id === "notifications" && unreadCount > 0 && (
                <span className="ml-auto bg-violet-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {activeTab === "general" && (
            <>
              <AccountDetailsSection />
              <ChangePasswordSection />
              <DangerZoneSection />
            </>
          )}
          {activeTab === "notifications" && (
            <NotificationPreferencesSection />
          )}
        </main>
      </div>
    </div>
  );
}