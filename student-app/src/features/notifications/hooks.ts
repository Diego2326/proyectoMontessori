import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authedRequest } from "@/core/api/authedRequest";
import { dashboardKeys } from "@/features/dashboard/hooks";
import { NotificationDto } from "@/types/dto";

export const notificationKeys = {
  all: ["notifications"] as const,
};

export function useNotificationsQuery() {
  return useQuery({
    queryKey: notificationKeys.all,
    queryFn: () => authedRequest<NotificationDto[]>("/notifications"),
  });
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      authedRequest(`/notifications/${id}/read`, {
        method: "PATCH",
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
        queryClient.invalidateQueries({ queryKey: dashboardKeys.summary }),
      ]);
    },
  });
}

export function useMarkAllNotificationsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      authedRequest("/notifications/read-all", {
        method: "PATCH",
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
        queryClient.invalidateQueries({ queryKey: dashboardKeys.summary }),
      ]);
    },
  });
}
