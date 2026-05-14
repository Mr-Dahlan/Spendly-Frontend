// src/hooks/useAnnouncement.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import type { Notification } from "../types/notification";

// ─── Payload & Response ───────────────────────────────────────────────────────
export interface CreateAnnouncementPayload {
  title: string;
  message: string;
  /**
   * Kosongkan / null  → broadcast ke SEMUA user (backend handle)
   * Isi dengan number → kirim ke 1 user spesifik berdasarkan user_id
   */
  user_id?: number | null;
}

export interface CreateAnnouncementResponse {
  success: boolean;
  message: string;
  data?: Notification | Notification[];
}

// ─── Service ──────────────────────────────────────────────────────────────────
const announcementService = {
  /**
   * POST /notifications/send
   * Body dikirim:
   *   { title, message }            → broadcast (user_id tidak dikirim)
   *   { title, message, user_id }   → ke 1 user spesifik
   */
  send: async (payload: CreateAnnouncementPayload): Promise<CreateAnnouncementResponse> => {
    const body: Record<string, unknown> = {
      title: payload.title,
      message: payload.message,
    };

    // Hanya include user_id jika ada (spesifik user)
    if (payload.user_id != null) {
      body.user_id = payload.user_id;
    }

    // ─── DEBUG LOGGING ──────────────────────────────────────────────────────
    console.log(
      "[useAnnouncement] Sending to POST /admin/notifications/send:",
      JSON.stringify(body, null, 2)
    );

    try {
      const { data } = await axiosInstance.post<CreateAnnouncementResponse>("/admin/notifications/send", body);

      console.log("[useAnnouncement] Response:", data);

      if (!data.success) {
        console.warn("[useAnnouncement] Backend returned success=false:", data.message);
      }

      return data;
    } catch (error) {
      console.error("[useAnnouncement] Request failed:", error);
      throw error;
    }
  },
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useSendAnnouncement() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, isSuccess, error } = useMutation({
    mutationFn: (payload: CreateAnnouncementPayload) => announcementService.send(payload),
    onSuccess: (data) => {
      console.log("[useSendAnnouncement] Success! Invalidating notifications query");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (err) => {
      console.error("[useSendAnnouncement] Error:", err);
    },
  });

  return {
    sendAnnouncement: mutateAsync, // (payload: CreateAnnouncementPayload) => Promise<CreateAnnouncementResponse>
    isLoading: isPending,
    isSuccess,
    error,
  };
}