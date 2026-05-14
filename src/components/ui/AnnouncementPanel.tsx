// src/components/admin/AnnouncementPanel.tsx
import { useState } from "react";
import { Megaphone, Bell } from "lucide-react";
import AddAnnouncementModal from "./AddAnnouncementModal";
import type { CreateAnnouncementPayload } from "../../hooks/useAnnouncement";

interface AnnouncementPanelProps {
  onSendAnnouncement: (payload: CreateAnnouncementPayload) => Promise<void>;
  isLoading?: boolean;
  lastAnnouncement?: { title: string; message: string } | null;
}

export default function AnnouncementPanel({
  onSendAnnouncement,
  isLoading,
  lastAnnouncement,
}: AnnouncementPanelProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [preview, setPreview] = useState(
    lastAnnouncement ?? {
      title: "System Update",
      message: "We are performing scheduled maintenance. Expect brief downtime tonight at 11PM.",
    }
  );

  const handleSubmit = async (payload: CreateAnnouncementPayload) => {
    await onSendAnnouncement(payload);
    // Update live preview dengan pesan terakhir
    setPreview({ title: payload.title, message: payload.message });
  };

  return (
    <>
      <div
        className="rounded-2xl p-5 flex flex-col gap-4"
        style={{ background: "var(--card)", boxShadow: "var(--boxShadow)" }}
      >
        <h3 className="font-semibold text-base" style={{ color: "var(--text)" }}>
          Post New Announcement
        </h3>

        <div className="flex gap-4 items-start">
          {/* Left: desc + button */}
          <div className="flex-1 flex flex-col gap-3">
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

          {/* Right: Mobile preview */}
          <div className="flex flex-col gap-2 items-center shrink-0">
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              Live Preview (Mobile View)
            </p>
            <div
              className="w-[140px] rounded-2xl border-4 overflow-hidden"
              style={{ borderColor: "var(--text-secondary)", background: "var(--bg)" }}
            >
              {/* Phone notch */}
              <div className="h-5 flex items-center justify-center" style={{ background: "var(--card)" }}>
                <div className="w-12 h-1.5 rounded-full" style={{ background: "var(--text-secondary)" }} />
              </div>

              {/* Notif card */}
              <div className="p-2">
                <div
                  className="rounded-xl p-2.5 flex flex-col gap-1"
                  style={{ background: "var(--blue-primary)" }}
                >
                  <div className="flex items-center gap-1.5">
                    <Bell size={10} className="text-white" />
                    <span className="text-white text-[9px] font-bold uppercase tracking-wide">
                      Spendly
                    </span>
                  </div>
                  <p className="text-white text-[9px] font-semibold leading-tight line-clamp-1">
                    {preview.title}
                  </p>
                  <p className="text-white/80 text-[8px] leading-tight line-clamp-3">
                    {preview.message}
                  </p>
                </div>
              </div>

              {/* Dummy app grid */}
              <div className="px-2 pb-2 grid grid-cols-4 gap-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-md"
                    style={{ background: "var(--border)" }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddAnnouncementModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </>
  );
}