import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GlobalSearchOverlay } from "@/components/GlobalSearchOverlay";
import { StudentLogo } from "@/components/StudentLogo";
import { useNotificationsQuery } from "@/features/notifications/hooks";
import { useAppTheme } from "@/theme/ThemeProvider";
import { useResponsive } from "@/theme/useResponsive";
import { useProfile } from "@/features/profile/hooks";

interface GlobalTopBarProps {
  hideSearch?: boolean;
}

function buildInitials(email?: string) {
  if (!email) return "P";
  const value = email.split("@")[0]?.trim() ?? "";
  const [first = "", second = ""] = value.split(/[._-]+/);
  return `${first.charAt(0)}${second.charAt(0) || first.charAt(1) || ""}`.toUpperCase();
}

export function GlobalTopBar({ hideSearch = false }: GlobalTopBarProps) {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const user = useProfile();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const notificationsQuery = useNotificationsQuery();
  const unreadCount =
    notificationsQuery.data?.filter((item) => !item.readAt && item.status.toLowerCase() !== "read").length ?? 0;
  const topBarHeight = responsive.isTablet ? 88 : 78;
  const actionButtonSize = responsive.isTablet ? 56 : 52;
  const searchWidth = responsive.isTablet ? 238 : 172;
  const logoSize = responsive.isTablet ? 56 : 48;

  return (
    <>
      <View style={styles.wrap}>
        <View style={[styles.topRow, { minHeight: topBarHeight }]}>
          <View style={styles.brandRow}>
            <StudentLogo size={logoSize} />
            <View style={styles.brandCopy}>
              <Text numberOfLines={2} style={[styles.brandName, { color: theme.colors.text, fontFamily: theme.typography.title }]}>
                Colegio Bilingue Montessori Zacapa
              </Text>
            </View>
          </View>

          <View style={styles.actionsRow}>
            {!hideSearch && (
              <Pressable
                onPress={() => setSearchOpen(true)}
                style={({ pressed }) => [
                  styles.searchBarCompact,
                  {
                    width: searchWidth,
                    minHeight: actionButtonSize,
                    backgroundColor: theme.colors.cardSoft,
                    borderColor: theme.colors.borderStrong,
                    opacity: pressed ? 0.92 : 1,
                  },
                ]}
              >
                <Ionicons name="search" size={17} color={theme.colors.textSoft} />
                <Text numberOfLines={1} style={[styles.searchLabel, { color: theme.colors.textSoft }]}>
                  Buscar
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={() => router.push("/(app)/(tabs)/notifications")}
              style={({ pressed }) => [
                styles.iconButton,
                {
                  width: actionButtonSize,
                  height: actionButtonSize,
                  borderRadius: actionButtonSize,
                  backgroundColor: theme.colors.cardSoft,
                  borderColor: theme.colors.border,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <Ionicons name="notifications" size={20} color={theme.colors.primary} />
              {unreadCount > 0 && (
                <View style={[styles.badge, { backgroundColor: theme.colors.danger }]}>
                  <Text style={styles.badgeText}>{unreadCount > 9 ? "9+" : unreadCount}</Text>
                </View>
              )}
            </Pressable>

            <Pressable
              onPress={() => router.push("/(app)/profile")}
              style={({ pressed }) => [
                styles.iconButton,
                {
                  width: actionButtonSize,
                  height: actionButtonSize,
                  borderRadius: actionButtonSize,
                  backgroundColor: theme.colors.cardSoft,
                  borderColor: theme.colors.border,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <Text style={[styles.profileInitials, { color: theme.colors.primary }]}>{buildInitials(user?.email)}</Text>
            </Pressable>
          </View>
        </View>

      </View>
      {!hideSearch && <GlobalSearchOverlay visible={searchOpen} onClose={() => setSearchOpen(false)} />}
    </>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    paddingTop: 6,
    paddingBottom: 12,
    gap: 8,
  },
  topRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  brandCopy: {
    flex: 1,
  },
  brandName: {
    fontSize: 18,
    lineHeight: 22,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  iconButton: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  profileInitials: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  searchBarCompact: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  searchLabel: {
    fontSize: 15,
    fontWeight: "700",
  },
});
