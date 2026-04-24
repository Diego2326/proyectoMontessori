import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useNotificationsQuery, useMarkNotificationReadMutation, useMarkAllNotificationsReadMutation } from "@/features/notifications/hooks";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { ClayCard } from "@/components/ClayCard";
import { AppButton } from "@/components/AppButton";
import { formatDateTime } from "@/core/utils/date";
import { useAppTheme } from "@/theme/ThemeProvider";

export default function NotificationsScreen() {
  const theme = useAppTheme();
  const { data, isLoading, isFetching, error, refetch } = useNotificationsQuery();
  const markRead = useMarkNotificationReadMutation();
  const markAll = useMarkAllNotificationsReadMutation();

  const unreadCount = data?.filter((item) => !item.readAt && item.status.toLowerCase() !== "read").length ?? 0;

  return (
    <AppScreen
      title="Notificaciones"
      subtitle={`Tienes ${unreadCount} sin leer`}
      refreshing={isFetching}
      onRefresh={refetch}
    >
      <AppButton
        label="Marcar todas como leídas"
        onPress={async () => {
          try {
            await markAll.mutateAsync();
            Alert.alert("Listo", "Todas las notificaciones se marcaron como leídas.");
          } catch {
            Alert.alert("Error", "No se pudo marcar todo como leído.");
          }
        }}
        loading={markAll.isPending}
        disabled={unreadCount === 0}
        variant="ghost"
      />

      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}
      {!isLoading && !error && data?.length === 0 && <EmptyState title="Sin notificaciones" subtitle="Todo al día." />}
      {data?.map((notification) => {
        const unread = !notification.readAt && notification.status.toLowerCase() !== "read";
        return (
          <ClayCard key={notification.id} style={[styles.card, unread && { borderColor: theme.colors.primary }]}>
            <View style={styles.row}>
              <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.title }]}>
                {notification.title}
              </Text>
              <Text style={[styles.date, { color: theme.colors.textMuted }]}>{formatDateTime(notification.createdAt)}</Text>
            </View>
            <Text style={[styles.message, { color: theme.colors.textMuted }]}>{notification.message}</Text>
            {unread && (
              <AppButton
                label="Marcar como leída"
                variant="primary"
                loading={markRead.isPending}
                onPress={async () => {
                  try {
                    await markRead.mutateAsync(notification.id);
                    Alert.alert("Listo", "Notificación marcada como leída.");
                  } catch {
                    Alert.alert("Error", "No se pudo actualizar la notificación.");
                  }
                }}
              />
            )}
          </ClayCard>
        );
      })}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  title: {
    fontSize: 15,
    flex: 1,
  },
  date: {
    fontSize: 11,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
});
