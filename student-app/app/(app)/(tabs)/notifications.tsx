import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNotificationsQuery, useMarkNotificationReadMutation, useMarkAllNotificationsReadMutation } from "@/features/notifications/hooks";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { ClayCard } from "@/components/ClayCard";
import { AppButton } from "@/components/AppButton";
import { formatDateTime } from "@/core/utils/date";
import { useAppTheme } from "@/theme/ThemeProvider";
import { useResponsive } from "@/theme/useResponsive";

export default function NotificationsScreen() {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const { data, isLoading, isFetching, error, refetch } = useNotificationsQuery();
  const markRead = useMarkNotificationReadMutation();
  const markAll = useMarkAllNotificationsReadMutation();

  const unreadCount = data?.filter((item) => !item.readAt && item.status.toLowerCase() !== "read").length ?? 0;

  return (
    <AppScreen title="Avisos" refreshing={isFetching} onRefresh={refetch} compactHeader showAppLabel={false}>
      <ClayCard style={styles.bannerCard}>
        <View style={styles.bannerRow}>
          <View style={[styles.bannerIcon, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="mail-open" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.bannerCopy}>
            <Text style={[styles.bannerTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>
              Tienes {unreadCount} aviso{unreadCount === 1 ? "" : "s"} nuevo{unreadCount === 1 ? "" : "s"}
            </Text>
          </View>
        </View>
        <AppButton
          label="Marcar todo como leído"
          icon="checkmark-circle"
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
      </ClayCard>

      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}
      {!isLoading && !error && data?.length === 0 && <EmptyState title="Sin avisos" />}

      <View style={[styles.list, { flexDirection: responsive.isTablet ? "row" : "column", flexWrap: "wrap" }]}>
        {data?.map((notification) => {
          const unread = !notification.readAt && notification.status.toLowerCase() !== "read";
          return (
            <View key={notification.id} style={[styles.cardWrap, responsive.isTablet && { width: responsive.isLargeTablet ? "49%" : "100%" }]}>
              <ClayCard style={[styles.card, unread && { borderColor: theme.colors.primary }]}>
                <View style={styles.cardTop}>
                  <View style={[styles.noteBadge, { backgroundColor: unread ? theme.colors.primarySoft : theme.colors.surface }]}>
                    <Ionicons name={unread ? "notifications" : "mail-open"} size={18} color={theme.colors.primary} />
                  </View>
                  <Text style={[styles.date, { color: theme.colors.textSoft }]}>{formatDateTime(notification.createdAt)}</Text>
                </View>
                <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.title }]}>
                  {notification.title}
                </Text>
                <Text style={[styles.message, { color: theme.colors.textMuted }]}>{notification.message}</Text>
                {unread ? (
                  <AppButton
                    label="Ya lo leí"
                    icon="checkmark"
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
                ) : (
                  <Text style={[styles.readText, { color: theme.colors.textSoft }]}>Ya revisado</Text>
                )}
              </ClayCard>
            </View>
          );
        })}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  bannerCard: {
    gap: 12,
  },
  bannerRow: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  bannerIcon: {
    width: 54,
    height: 54,
    borderRadius: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerCopy: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 22,
  },
  list: {
    gap: 12,
    justifyContent: "space-between",
  },
  cardWrap: {
    width: "100%",
  },
  card: {
    gap: 10,
    minHeight: 220,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noteBadge: {
    width: 40,
    height: 40,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 19,
    lineHeight: 24,
  },
  date: {
    fontSize: 11,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
  readText: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: "auto",
  },
});
