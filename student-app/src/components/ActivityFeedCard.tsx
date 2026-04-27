import React from "react";
import { ImageBackground, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { HomeActivityDto } from "@/types/dto";
import { useAppTheme } from "@/theme/ThemeProvider";
import { useResponsive } from "@/theme/useResponsive";
import { formatDateTime } from "@/core/utils/date";
import { getReadableAccentColor, hexToRgba } from "@/theme/colorUtils";

interface ActivityFeedCardProps {
  item: HomeActivityDto;
  onPress?: () => void;
  height?: number;
}

function GlassPill({
  children,
  style,
  contentStyle,
  shape = "pill",
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  shape?: "pill" | "card";
}) {
  const theme = useAppTheme();
  const shapeStyle = shape === "card" ? styles.glassCard : styles.glassPill;
  const tintShapeStyle = shape === "card" ? styles.glassCardTint : styles.glassTint;

  return (
    <View style={[shapeStyle, style]}>
      <BlurView intensity={42} tint={theme.mode === "dark" ? "dark" : "light"} style={StyleSheet.absoluteFill} />
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: theme.mode === "dark" ? "rgba(17, 21, 30, 0.3)" : "rgba(255,255,255,0.14)",
            borderColor: theme.mode === "dark" ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.26)",
          },
          tintShapeStyle,
        ]}
      />
      <View style={[styles.glassContent, contentStyle]}>{children}</View>
    </View>
  );
}

export function ActivityFeedCard({ item, onPress, height }: ActivityFeedCardProps) {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const cardHeight = height ?? (responsive.isTablet ? 292 : 242);

  const meta = {
    assignment: { icon: "create", tint: theme.colors.warning, bg: `${theme.colors.warning}22`, label: "Tarea" },
    material: { icon: "layers", tint: theme.colors.primary, bg: theme.colors.primarySoft, label: "Material" },
    event: { icon: "calendar", tint: theme.colors.accent, bg: `${theme.colors.accent}22`, label: "Evento" },
    announcement: { icon: "megaphone", tint: theme.colors.primary, bg: `${theme.colors.primary}18`, label: "Publicación" },
    grade: { icon: "ribbon", tint: theme.colors.success, bg: `${theme.colors.success}22`, label: "Revisión" },
    reminder: { icon: "notifications", tint: theme.colors.danger, bg: `${theme.colors.danger}18`, label: "Recordatorio" },
  }[item.type];
  const metaInk = getReadableAccentColor(meta.tint, meta.bg, theme.colors.text);
  const imageAttachment = item.attachments?.find((attachment) => attachment.type === "image");
  const documentCount = item.attachments?.filter((attachment) => attachment.type === "document").length ?? 0;
  const watermarkInk = theme.mode === "dark" ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.18)";
  const cardHeadline = imageAttachment?.title ?? item.title;
  const cardSubline = item.body && item.body !== cardHeadline ? item.body : undefined;
  const courseLabel =
    item.courseName && item.courseName !== cardHeadline && item.courseName !== cardSubline ? item.courseName : undefined;
  const authorLabel =
    item.authorName &&
    item.authorName !== item.courseName &&
    item.authorName !== cardHeadline &&
    item.authorName !== cardSubline
      ? item.authorName
      : undefined;
  const identityLabel = courseLabel ?? authorLabel;
  const fallbackPalette = {
    assignment: [hexToRgba(theme.colors.warning, 0.94), hexToRgba(theme.colors.accent, 0.88)],
    material: [hexToRgba(theme.colors.success, 0.94), hexToRgba(theme.colors.primary, 0.82)],
    event: [hexToRgba(theme.colors.accent, 0.92), hexToRgba(theme.colors.primary, 0.88)],
    announcement: [hexToRgba(theme.colors.primary, 0.94), hexToRgba(theme.colors.accent, 0.78)],
    grade: [hexToRgba(theme.colors.success, 0.94), hexToRgba(theme.colors.primary, 0.84)],
    reminder: [hexToRgba(theme.colors.danger, 0.94), hexToRgba(theme.colors.accent, 0.82)],
  } as const;

  const CardBackdrop = imageAttachment?.imageUrl ? ImageBackground : View;
  const cardBackdropProps = imageAttachment?.imageUrl ? { source: { uri: imageAttachment.imageUrl } } : {};

  return (
    <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => [{ opacity: pressed ? 0.94 : 1 }, styles.pressableWrap]}>
      <View
        style={[
          styles.cardShell,
          {
            borderColor: theme.colors.borderStrong,
            shadowColor: theme.colors.shadow,
            shadowOpacity: 0.14,
            shadowRadius: 18,
            elevation: 6,
            minHeight: cardHeight,
          },
        ]}
      >
        <CardBackdrop
          {...cardBackdropProps}
          style={styles.backdrop}
          {...(imageAttachment?.imageUrl ? { resizeMode: "cover" as const } : {})}
        >
          {imageAttachment?.imageUrl ? (
            <LinearGradient
              colors={["rgba(6, 12, 20, 0.16)", "rgba(8, 14, 24, 0.38)", "rgba(10, 16, 24, 0.86)"]}
              locations={[0, 0.38, 1]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.backdropOverlay}
            >
              <View style={styles.cardBody}>
                <View style={styles.topRow}>
                  <GlassPill style={styles.metaPill}>
                    <Ionicons name={meta.icon as keyof typeof Ionicons.glyphMap} size={13} color={metaInk} />
                    <Text style={[styles.metaLabel, { color: metaInk }]}>{meta.label}</Text>
                  </GlassPill>
                  <GlassPill style={styles.metaPill}>
                    <Text style={[styles.metaLabel, { color: "#FFFFFF" }]}>{formatDateTime(item.createdAt)}</Text>
                  </GlassPill>
                </View>

                <View style={styles.bottomStack}>
                  <GlassPill shape="card" style={styles.titlePill}>
                    <Text numberOfLines={3} style={[styles.title, { color: "#FFFFFF", fontFamily: theme.typography.title }]}>
                      {cardHeadline}
                    </Text>
                    {!!cardSubline && (
                      <Text numberOfLines={2} style={[styles.body, { color: "rgba(255,255,255,0.9)" }]}>
                        {cardSubline}
                      </Text>
                    )}
                  </GlassPill>

                  <View style={styles.bottomMetaRow}>
                    {!!identityLabel && (
                      <GlassPill style={styles.infoPill}>
                        <Text numberOfLines={1} style={[styles.infoText, { color: "#FFFFFF" }]}>
                          {identityLabel}
                        </Text>
                      </GlassPill>
                    )}
                    {!!documentCount && (
                      <GlassPill style={styles.infoPill}>
                        <Ionicons name="document-text" size={12} color="#FFFFFF" />
                        <Text style={[styles.infoText, { color: "#FFFFFF" }]}>
                          {documentCount} {documentCount === 1 ? "archivo" : "archivos"}
                        </Text>
                      </GlassPill>
                    )}
                  </View>

                  <View style={styles.socialRow}>
                    <GlassPill style={styles.socialPill}>
                      <Ionicons name="heart-outline" size={13} color="#FFFFFF" />
                      <Text style={[styles.socialText, { color: "#FFFFFF" }]}>{item.likes ?? 0}</Text>
                    </GlassPill>
                    <GlassPill style={styles.socialPill}>
                      <Ionicons name="chatbubble-ellipses-outline" size={13} color="#FFFFFF" />
                      <Text style={[styles.socialText, { color: "#FFFFFF" }]}>{item.comments ?? 0}</Text>
                    </GlassPill>
                    <GlassPill style={styles.socialPill}>
                      <Ionicons name="paper-plane-outline" size={13} color="#FFFFFF" />
                      <Text style={[styles.socialText, { color: "#FFFFFF" }]}>Compartir</Text>
                    </GlassPill>
                    {!!item.actionLabel && (
                      <GlassPill style={styles.socialPill}>
                        <Ionicons name="arrow-forward" size={13} color="#FFFFFF" />
                        <Text style={[styles.socialText, { color: "#FFFFFF" }]}>{item.actionLabel}</Text>
                      </GlassPill>
                    )}
                  </View>
                </View>
              </View>
            </LinearGradient>
          ) : (
            <LinearGradient colors={fallbackPalette[item.type]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.backdropOverlay}>
              <Ionicons
                name={meta.icon as keyof typeof Ionicons.glyphMap}
                size={96}
                color={watermarkInk}
                style={styles.watermarkIcon}
              />
              <View style={styles.cardBody}>
                <View style={styles.topRow}>
                  <GlassPill style={[styles.metaPill, styles.lightPill]}>
                    <Ionicons name={meta.icon as keyof typeof Ionicons.glyphMap} size={13} color="#FFFFFF" />
                    <Text style={[styles.metaLabel, { color: "#FFFFFF" }]}>{meta.label}</Text>
                  </GlassPill>
                  <GlassPill style={[styles.metaPill, styles.lightPill]}>
                    <Text style={[styles.metaLabel, { color: "#FFFFFF" }]}>{formatDateTime(item.createdAt)}</Text>
                  </GlassPill>
                </View>

                <View style={styles.bottomStack}>
                  <GlassPill shape="card" style={[styles.titlePill, styles.lightPill]}>
                    <Text numberOfLines={3} style={[styles.title, { color: "#FFFFFF", fontFamily: theme.typography.title }]}>
                      {cardHeadline}
                    </Text>
                    {!!cardSubline && (
                      <Text numberOfLines={2} style={[styles.body, { color: "rgba(255,255,255,0.92)" }]}>
                        {cardSubline}
                      </Text>
                    )}
                  </GlassPill>

                  <View style={styles.bottomMetaRow}>
                    {!!identityLabel && (
                      <GlassPill style={[styles.infoPill, styles.lightPill]}>
                        <Text numberOfLines={1} style={[styles.infoText, { color: "#FFFFFF" }]}>
                          {identityLabel}
                        </Text>
                      </GlassPill>
                    )}
                    {!!documentCount && (
                      <GlassPill style={[styles.infoPill, styles.lightPill]}>
                        <Ionicons name="document-text" size={12} color="#FFFFFF" />
                        <Text style={[styles.infoText, { color: "#FFFFFF" }]}>
                          {documentCount} {documentCount === 1 ? "archivo" : "archivos"}
                        </Text>
                      </GlassPill>
                    )}
                  </View>

                  <View style={styles.socialRow}>
                    <GlassPill style={[styles.socialPill, styles.lightPill]}>
                      <Ionicons name="heart-outline" size={13} color="#FFFFFF" />
                      <Text style={[styles.socialText, { color: "#FFFFFF" }]}>{item.likes ?? 0}</Text>
                    </GlassPill>
                    <GlassPill style={[styles.socialPill, styles.lightPill]}>
                      <Ionicons name="chatbubble-ellipses-outline" size={13} color="#FFFFFF" />
                      <Text style={[styles.socialText, { color: "#FFFFFF" }]}>{item.comments ?? 0}</Text>
                    </GlassPill>
                    <GlassPill style={[styles.socialPill, styles.lightPill]}>
                      <Ionicons name="paper-plane-outline" size={13} color="#FFFFFF" />
                      <Text style={[styles.socialText, { color: "#FFFFFF" }]}>Compartir</Text>
                    </GlassPill>
                    {!!item.actionLabel && (
                      <GlassPill style={[styles.socialPill, styles.lightPill]}>
                        <Ionicons name="arrow-forward" size={13} color="#FFFFFF" />
                        <Text style={[styles.socialText, { color: "#FFFFFF" }]}>{item.actionLabel}</Text>
                      </GlassPill>
                    )}
                  </View>
                </View>
              </View>
            </LinearGradient>
          )}
        </CardBackdrop>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressableWrap: {
    width: "100%",
  },
  cardShell: {
    borderWidth: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 34,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 10 },
  },
  backdrop: {
    flex: 1,
  },
  backdropOverlay: {
    flex: 1,
  },
  cardBody: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
    gap: 12,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  bottomStack: {
    gap: 8,
  },
  bottomMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  socialRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  glassPill: {
    alignSelf: "flex-start",
    overflow: "hidden",
    borderRadius: 999,
  },
  glassCard: {
    alignSelf: "stretch",
    overflow: "hidden",
    borderRadius: 20,
  },
  glassTint: {
    borderWidth: 1,
    borderRadius: 999,
  },
  glassCardTint: {
    borderWidth: 1,
    borderRadius: 20,
  },
  glassContent: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  metaPill: {
    maxWidth: "68%",
  },
  titlePill: {
    borderRadius: 20,
    alignSelf: "stretch",
  },
  infoPill: {
    maxWidth: "100%",
  },
  socialPill: {
    maxWidth: "100%",
  },
  lightPill: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: "800",
  },
  title: {
    width: "100%",
    fontSize: 18,
    lineHeight: 23,
    flexShrink: 1,
  },
  body: {
    width: "100%",
    fontSize: 12,
    lineHeight: 17,
    flexShrink: 1,
  },
  infoText: {
    fontSize: 11,
    fontWeight: "700",
    flexShrink: 1,
  },
  socialText: {
    fontSize: 11,
    fontWeight: "800",
  },
  watermarkIcon: {
    position: "absolute",
    top: 12,
    right: 10,
  },
});
