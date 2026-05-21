import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService} from "../services/notifications";
import type { CreateAnnouncementPayload} from "../types/notification";

export function useSendAnnouncement() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, isSuccess, error } = useMutation({
    mutationFn: (payload: CreateAnnouncementPayload) => notificationService.send(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    sendAnnouncement: mutateAsync,
    isLoading: isPending,
    isSuccess,
    error,
  };
}