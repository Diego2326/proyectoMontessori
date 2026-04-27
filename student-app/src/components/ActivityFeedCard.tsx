import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { HomeActivityAttachmentDto, HomeActivityDto } from "@/types/dto";
import { useAppTheme } from "@/theme/ThemeProvider";
import { useResponsive } from "@/theme/useResponsive";
import { formatDateTime } from "@/core/utils/date";
import { getReadableAccentColor } from "@/theme/colorUtils";

interface ActivityFeedCardProps {
  item: HomeActivityDto;
  onPress?: () => void;
}

const attachmentPalette: Record<NonNullable<HomeActivityAttachmentDto["previewTone"]>, readonly [string, string]> = {
  sky: ["#DDEBFF", "#F8FBFF"],
  sun: ["#FFE8BB", "#FFF8EA"],
  mint: ["#D9F7E5", "#F7FFF9"],
  berry: ["#F8DCEA", "#FFF7FA"],
};

export function ActivityFeedCard({ item, onPress }: ActivityFeedCardProps) {
  const theme = useAppTheme();
  const responsive = useResponsive();

  const meta = {
    assignment: { icon: "create", tint: theme.colors.warning, bg: `${theme.colors.warning}22`, label: "Tarea" },
    material: { icon: "layers", tint: theme.colors.primary, bg: theme.colors.primarySoft, label: "Material" },
    event: { icon: "calendar", tint: theme.colors.accent, bg: `${theme.colors.accent}22`, label: "Evento" },
    announcement: { icon: "megaphone", tint: theme.colors.primary, bg: `${theme.colors.primary}18`, label: "Publicación" },
    grade: { icon: "ribbon", tint: theme.colors.success, bg: `${theme.colors.success}22`, label: "Revisión" },
    reminder: { icon: "notifications", tint: theme.colors.danger, bg: `${theme.colors.danger}18`, label: "Recordatorio" },
  }[item.type];
  const metaInk = getReadableAccentColor(meta.tint, meta.bg, theme.colors.text);
  const imageBadgeInk = getReadableAccentColor(theme.colors.primary, theme.colors.cardSoft, theme.colors.text);

  const initials = (item.authorName ?? item.courseName ?? "MS")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => [{ opacity: pressed ? 0.95 : 1 }]}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.cardSoft,
            borderColor: theme.colors.border,
            shadowColor: theme.colors.shadow,
            padding: responsive.isTablet ? 18 : 14,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={[styles.avatar, { backgroundColor: meta.bg }]}>
            <Text style={[styles.avatarText, { color: metaInk }]}>{initials}</Text>
          </View>
          <View style={styles.headerBody}>
            <View style={styles.headerTop}>
              <Text style={[styles.author, { color: theme.colors.text, fontFamily: theme.typography.title }]}>
                {item.authorName ?? item.courseName ?? "Campus Montessori"}
              </Text>
              <Text style={[styles.time, { color: theme.colors.textSoft }]}>{formatDateTime(item.createdAt)}</Text>
            </View>
            <View style={styles.headerMeta}>
              <View style={[styles.typePill, { backgroundColor: meta.bg }]}>
                <Ionicons name={meta.icon as keyof typeof Ionicons.glyphMap} size={14} color={metaInk} />
                <Text style={[styles.typeLabel, { color: metaInk }]}>{meta.label}</Text>
              </View>
              {!!item.courseName && <Text style={[styles.course, { color: theme.colors.textSoft }]}>{item.courseName}</Text>}
            </View>
          </View>
        </View>

        <View style={styles.contentBlock}>
          <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{item.title}</Text>
          <Text style={[styles.content, { color: theme.colors.textMuted }]}>{item.body}</Text>
        </View>

        {!!item.attachments?.length && (
          <View style={styles.attachments}>
            {item.attachments.map((attachment) =>
              attachment.type === "image" ? (
                <LinearGradient
                  key={attachment.id}
                  colors={attachmentPalette[attachment.previewTone ?? "sky"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.imageMock, { borderColor: theme.colors.borderStrong }]}
                >
                  <View style={[styles.imageBadge, { backgroundColor: theme.colors.cardSoft }]}>
                    <Ionicons name="image" size={16} color={imageBadgeInk} />
                    <Text style={[styles.imageBadgeText, { color: imageBadgeInk }]}>foto</Text>
                  </View>
                  <Text style={[styles.imageTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{attachment.title}</Text>
                  <Text style={[styles.imageSubtitle, { color: theme.colors.textMuted }]}>{attachment.subtitle}</Text>
                </LinearGradient>
              ) : (
                <View key={attachment.id} style={[styles.docCard, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}>
                  <View style={[styles.docIcon, { backgroundColor: theme.colors.surface }]}>
                    <Ionicons name="document-text" size={18} color={theme.colors.primary} />
                  </View>
                  <View style={styles.docBody}>
                    <Text style={[styles.docTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{attachment.title}</Text>
                    <Text style={[styles.docSubtitle, { color: theme.colors.textMuted }]}>
                      {attachment.fileLabel ?? "Archivo"}{attachment.subtitle ? ` • ${attachment.subtitle}` : ""}
                    </Text>
                  </View>
                  <Ionicons name="arrow-down-circle" size={22} color={theme.colors.primary} />
                </View>
              )
            )}
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.socialRow}>
            <View style={styles.socialItem}>
              <Ionicons name="heart-outline" size={18} color={theme.colors.textMuted} />
              <Text style={[styles.socialText, { color: theme.colors.textMuted }]}>{item.likes ?? 0}</Text>
            </View>
            <View style={styles.socialItem}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color={theme.colors.textMuted} />
              <Text style={[styles.socialText, { color: theme.colors.textMuted }]}>{item.comments ?? 0}</Text>
            </View>
            <View style={styles.socialItem}>
              <Ionicons name="paper-plane-outline" size={18} color={theme.colors.textMuted} />
              <Text style={[styles.socialText, { color: theme.colors.textMuted }]}>Compartir</Text>
            </View>
          </View>
          {!!item.actionLabel && (
            <View style={styles.ctaRow}>
              <Text style={[styles.cta, { color: theme.colors.primary }]}>{item.actionLabel}</Text>
              <Ionicons name="arrow-forward" size={16} color={theme.colors.primary} />
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 32,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
    gap: 14,
  },
  headerRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "800",
  },
  headerBody: {
    flex: 1,
    gap: 4,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
  },
  author: {
    fontSize: 16,
    flex: 1,
  },
  time: {
    fontSize: 11,
  },
  headerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  typePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  typeLabel: {
    fontSize: 11,
    fontWeight: "800",
  },
  course: {
    fontSize: 12,
  },
  contentBlock: {
    gap: 6,
  },
  title: {
    fontSize: 19,
    lineHeight: 24,
  },
  content: {
    fontSize: 14,
    lineHeight: 21,
  },
  attachments: {
    gap: 10,
  },
  imageMock: {
    minHeight: 188,
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    justifyContent: "flex-end",
    gap: 6,
  },
  imageBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  imageBadgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  imageTitle: {
    fontSize: 20,
    lineHeight: 25,
  },
  imageSubtitle: {
    fontSize: 13,
  },
  docCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  docIcon: {
    width: 40,
    height: 40,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  docBody: {
    flex: 1,
    gap: 2,
  },
  docTitle: {
    fontSize: 15,
  },
  docSubtitle: {
    fontSize: 12,
  },
  footer: {
    gap: 10,
  },
  socialRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  socialItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  socialText: {
    fontSize: 12,
    fontWeight: "700",
  },
  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cta: {
    fontSize: 13,
    fontWeight: "800",
  },
});
