import React, { useMemo, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/core/auth/authStore";
import { AppScreen } from "@/components/AppScreen";
import { ClayCard } from "@/components/ClayCard";
import { AppButton } from "@/components/AppButton";
import { formatDateTime } from "@/core/utils/date";
import { useAppTheme, useThemeController } from "@/theme/ThemeProvider";
import { useResponsive } from "@/theme/useResponsive";
import { assessThemeColorContrast, getReadableTextColor } from "@/theme/colorUtils";
import { getBackgroundDecorPreviewShapes } from "@/theme/backgroundDecor";

export default function ProfileScreen() {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const {
    paletteId,
    preferredMode,
    palettes,
    backgroundDecorId,
    backgroundDecors,
    colorSwatches,
    primaryColor,
    accentColor,
    setPalette,
    setBackgroundDecor,
    setPreferredMode,
    setPrimaryColor,
    setAccentColor,
    resetColorOverrides,
  } = useThemeController();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  const activePalette = useMemo(() => palettes.find((palette) => palette.id === paletteId) ?? palettes[0], [paletteId, palettes]);
  const primaryContrast = useMemo(
    () => (primaryColor ? assessThemeColorContrast(primaryColor, theme.colors.cardSoft) : null),
    [primaryColor, theme.colors.cardSoft],
  );
  const accentContrast = useMemo(
    () => (accentColor ? assessThemeColorContrast(accentColor, theme.colors.cardSoft) : null),
    [accentColor, theme.colors.cardSoft],
  );

  const doLogout = async () => {
    await logout();
    queryClient.clear();
    router.replace("/(auth)/login");
  };

  return (
    <AppScreen title="Mi perfil" compactHeader showAppLabel={false}>
      <View style={[styles.layout, { flexDirection: responsive.isTablet ? "row" : "column" }]}>
        <ClayCard style={[styles.card, { flex: responsive.isTablet ? 1 : undefined }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Cuenta</Text>
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.textSoft }]}>Correo</Text>
            <Text style={[styles.value, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{user?.email ?? "-"}</Text>
          </View>
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.textSoft }]}>Rol</Text>
            <Text style={[styles.value, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{user?.role ?? "-"}</Text>
          </View>
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.textSoft }]}>Creado</Text>
            <Text style={[styles.value, { color: theme.colors.text, fontFamily: theme.typography.title }]}>
              {formatDateTime(user?.createdAt)}
            </Text>
          </View>
        </ClayCard>

        <View style={[styles.sideColumn, { width: responsive.isTablet ? 360 : undefined }]}>
          <ClayCard style={styles.sideCard}>
            <Text style={[styles.cardTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Apariencia</Text>
            <Pressable
              onPress={() => setThemeMenuOpen(true)}
              style={[styles.themeTrigger, { backgroundColor: theme.colors.cardSoft, borderColor: theme.colors.border }]}
            >
              <View style={styles.themeTriggerLeft}>
                <View style={styles.swatchRow}>
                  <View style={[styles.swatchLarge, { backgroundColor: theme.colors.bgSecondary }]} />
                  <View style={styles.previewMiniCol}>
                    <View style={[styles.swatchMini, { backgroundColor: theme.colors.primary }]} />
                    <View style={[styles.swatchMini, { backgroundColor: theme.colors.accent }]} />
                  </View>
                </View>
                <View style={styles.themeTextWrap}>
                  <Text style={[styles.paletteName, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{activePalette.name}</Text>
                  <Text style={[styles.themeModeText, { color: theme.colors.textMuted }]}>
                    {preferredMode === "system" ? "Sistema" : preferredMode === "light" ? "Claro" : "Oscuro"}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-down" size={18} color={theme.colors.primary} />
            </Pressable>

            <View style={styles.inlineBackgroundSection}>
              <View style={styles.sectionHead}>
                <Text style={[styles.sectionLabel, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Fondo</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.backgroundRail}>
                {backgroundDecors.map((decor) => {
                  const active = backgroundDecorId === decor.meta.id;
                  const previewShapes = getBackgroundDecorPreviewShapes(theme, decor.meta.id);
                  return (
                    <Pressable
                      key={decor.meta.id}
                      onPress={() => void setBackgroundDecor(decor.meta.id)}
                      style={[
                        styles.backgroundInlineCard,
                        {
                          backgroundColor: active ? theme.colors.card : theme.colors.cardSoft,
                          borderColor: active ? theme.colors.primary : theme.colors.border,
                        },
                      ]}
                    >
                      <View style={[styles.backgroundPreview, { backgroundColor: theme.colors.bgSecondary }]}>
                        {previewShapes.map((shape, index) => (
                          <View
                            key={`${decor.meta.id}-${index}`}
                            style={[
                              shape.kind === "circle"
                                ? styles.previewCircle
                                : shape.kind === "capsule"
                                  ? styles.previewCapsule
                                  : shape.kind === "rounded"
                                    ? styles.previewRounded
                                    : shape.kind === "ring"
                                      ? styles.previewRing
                                      : shape.kind === "diamond"
                                        ? styles.previewDiamond
                                        : styles.previewIconWrap,
                              {
                                width: shape.size,
                                height: shape.kind === "capsule" ? Math.round(shape.size * 0.52) : shape.size,
                                top: typeof shape.top === "number" ? shape.top : undefined,
                                left: typeof shape.left === "number" ? shape.left : undefined,
                                borderRadius:
                                  shape.kind === "circle" || shape.kind === "ring" || shape.kind === "capsule"
                                    ? shape.size
                                    : Math.round(shape.size * 0.24),
                                backgroundColor:
                                  shape.kind === "ring" || shape.kind === "icon" ? "transparent" : shape.color,
                                borderColor: shape.kind === "ring" ? shape.color : "transparent",
                                borderWidth: shape.kind === "ring" ? Math.max(4, Math.round(shape.size * 0.08)) : 0,
                                transform: shape.rotation ? [{ rotate: `${shape.rotation}deg` }] : undefined,
                              },
                            ]}
                          >
                            {shape.kind === "icon" && shape.icon && (
                              <Ionicons name={shape.icon} size={shape.iconSize ?? Math.round(shape.size * 0.52)} color={shape.color} />
                            )}
                          </View>
                        ))}
                      </View>
                      <Text style={[styles.backgroundName, { color: theme.colors.text, fontFamily: theme.typography.title }]}>
                        {decor.meta.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          </ClayCard>

          <ClayCard style={styles.sideCard}>
            <Text style={[styles.cardTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Acciones</Text>
            <View style={styles.actions}>
              <AppButton label="Ver calificaciones" onPress={() => router.push("/(app)/grades")} variant="ghost" />
              <AppButton label="Ver progreso" onPress={() => router.push("/(app)/progress")} variant="ghost" />
              <AppButton
                label="Cerrar sesion"
                variant="danger"
                onPress={() => {
                  Alert.alert("Cerrar sesion", "¿Deseas salir de tu sesion?", [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Salir", style: "destructive", onPress: () => doLogout() },
                  ]);
                }}
              />
            </View>
          </ClayCard>
        </View>
      </View>

      <Modal visible={themeMenuOpen} transparent animationType="fade" onRequestClose={() => setThemeMenuOpen(false)}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.modalBackdrop} onPress={() => setThemeMenuOpen(false)} />
          <View style={[styles.modalCard, { backgroundColor: theme.colors.cardSoft, borderColor: theme.colors.borderStrong }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.cardTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Cambiar tema</Text>
              <Pressable onPress={() => setThemeMenuOpen(false)} style={[styles.closeButton, { backgroundColor: theme.colors.surface }]}>
                <Ionicons name="close" size={18} color={theme.colors.primary} />
              </Pressable>
            </View>

            <View style={styles.modeRow}>
              {[
                { id: "system", label: "Sistema", icon: "phone-portrait" },
                { id: "light", label: "Claro", icon: "sunny" },
                { id: "dark", label: "Oscuro", icon: "moon" },
              ].map((option) => {
                const active = preferredMode === option.id;
                return (
                  <Pressable
                    key={option.id}
                    onPress={() => setPreferredMode(option.id as "system" | "light" | "dark")}
                    style={[
                      styles.modeChip,
                      {
                        backgroundColor: active ? theme.colors.surface : theme.colors.card,
                        borderColor: active ? theme.colors.primary : theme.colors.border,
                      },
                    ]}
                  >
                    <Ionicons name={option.icon as keyof typeof Ionicons.glyphMap} size={15} color={active ? theme.colors.primary : theme.colors.textMuted} />
                    <Text style={{ color: active ? theme.colors.primary : theme.colors.text, fontWeight: "700" }}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.paletteGrid}>
              {palettes.map((palette) => {
                const active = paletteId === palette.id;
                return (
                  <Pressable
                    key={palette.id}
                    onPress={() => {
                      void setPalette(palette.id);
                      setThemeMenuOpen(false);
                    }}
                    style={[
                      styles.paletteCard,
                      {
                        backgroundColor: active ? theme.colors.card : theme.colors.cardSoft,
                        borderColor: active ? theme.colors.primary : theme.colors.border,
                      },
                    ]}
                  >
                    <View style={styles.paletteTop}>
                      <View style={styles.swatchRow}>
                        <View style={[styles.swatchLarge, { backgroundColor: palette.preview.bg }]} />
                        <View style={styles.previewMiniCol}>
                          <View style={[styles.swatchMini, { backgroundColor: palette.preview.primary }]} />
                          <View style={[styles.swatchMini, { backgroundColor: palette.preview.accent }]} />
                        </View>
                      </View>
                      {active && (
                        <View style={[styles.activeCheck, { backgroundColor: theme.colors.primary }]}>
                          <Ionicons name="checkmark" size={14} color={getReadableTextColor(theme.colors.primary)} />
                        </View>
                      )}
                    </View>
                    <Text style={[styles.paletteName, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{palette.name}</Text>
                    <Text style={[styles.paletteDescription, { color: theme.colors.textMuted }]}>{palette.description}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.customColorSection}>
              <View style={styles.sectionHead}>
                <Text style={[styles.sectionLabel, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Acentos rapidos</Text>
                {(primaryColor || accentColor) && (
                  <Pressable onPress={() => resetColorOverrides()}>
                    <Text style={[styles.resetText, { color: theme.colors.primary }]}>Reiniciar</Text>
                  </Pressable>
                )}
              </View>
              <Text style={[styles.sectionHint, { color: theme.colors.textMuted }]}>
                Elige un primario y un secundario para personalizar el tema actual.
              </Text>

              <View style={styles.swatchSection}>
                <Text style={[styles.swatchLabel, { color: theme.colors.text }]}>Color principal</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.swatchRail}>
                  {colorSwatches.map((swatch) => {
                    const active = primaryColor === swatch.value;
                    const feedback = assessThemeColorContrast(swatch.value, theme.colors.cardSoft);
                    return (
                      <Pressable
                        key={`primary-${swatch.id}`}
                        onPress={() => setPrimaryColor(active ? null : swatch.value)}
                        style={[styles.colorChip, { borderColor: active ? theme.colors.primary : theme.colors.border }]}
                      >
                        <View style={[styles.colorDot, { backgroundColor: swatch.value }]} />
                        <Text style={[styles.colorName, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{swatch.name}</Text>
                        <Text style={[styles.contrastNote, { color: feedback.isLowContrast ? theme.colors.warning : theme.colors.success }]}>
                          {feedback.isLowContrast ? "Ajustar" : "OK"}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
                {!!primaryColor && !!primaryContrast && (
                  <Text style={[styles.contrastHelper, { color: primaryContrast.isLowContrast ? theme.colors.warning : theme.colors.success }]}>
                    Contraste sobre tarjeta: {primaryContrast.surfaceContrast.toFixed(2)}:1
                  </Text>
                )}
              </View>

              <View style={styles.swatchSection}>
                <Text style={[styles.swatchLabel, { color: theme.colors.text }]}>Color secundario</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.swatchRail}>
                  {colorSwatches.map((swatch) => {
                    const active = accentColor === swatch.value;
                    const feedback = assessThemeColorContrast(swatch.value, theme.colors.cardSoft);
                    return (
                      <Pressable
                        key={`accent-${swatch.id}`}
                        onPress={() => setAccentColor(active ? null : swatch.value)}
                        style={[styles.colorChip, { borderColor: active ? theme.colors.primary : theme.colors.border }]}
                      >
                        <View style={[styles.colorDot, { backgroundColor: swatch.value }]} />
                        <Text style={[styles.colorName, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{swatch.name}</Text>
                        <Text style={[styles.contrastNote, { color: feedback.isLowContrast ? theme.colors.warning : theme.colors.success }]}>
                          {feedback.isLowContrast ? "Ajustar" : "OK"}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
                {!!accentColor && !!accentContrast && (
                  <Text style={[styles.contrastHelper, { color: accentContrast.isLowContrast ? theme.colors.warning : theme.colors.success }]}>
                    Contraste sobre tarjeta: {accentContrast.surfaceContrast.toFixed(2)}:1
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  layout: {
    gap: 12,
  },
  card: {
    gap: 12,
  },
  sideColumn: {
    gap: 12,
  },
  sideCard: {
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
  },
  field: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    fontWeight: "700",
  },
  value: {
    fontSize: 15,
    lineHeight: 20,
  },
  actions: {
    gap: 10,
  },
  themeTrigger: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  themeTriggerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  themeTextWrap: {
    flex: 1,
    gap: 2,
  },
  themeModeText: {
    fontSize: 12,
  },
  inlineBackgroundSection: {
    gap: 8,
  },
  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  sectionLabel: {
    fontSize: 15,
  },
  backgroundRail: {
    gap: 10,
    paddingRight: 10,
  },
  backgroundInlineCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 10,
    width: 132,
    gap: 8,
  },
  backgroundPreview: {
    height: 84,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
  },
  previewCircle: {
    position: "absolute",
  },
  previewCapsule: {
    position: "absolute",
  },
  previewRounded: {
    position: "absolute",
  },
  previewRing: {
    position: "absolute",
  },
  previewDiamond: {
    position: "absolute",
  },
  previewIconWrap: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundName: {
    fontSize: 13,
  },
  modalRoot: {
    flex: 1,
    justifyContent: "center",
    padding: 18,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 18, 28, 0.28)",
  },
  modalCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    gap: 16,
    maxHeight: "84%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  modeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  modeChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  paletteGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  paletteCard: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    gap: 8,
  },
  paletteTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  swatchRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  swatchLarge: {
    width: 42,
    height: 42,
    borderRadius: 14,
  },
  previewMiniCol: {
    gap: 5,
  },
  swatchMini: {
    width: 18,
    height: 18,
    borderRadius: 6,
  },
  activeCheck: {
    width: 22,
    height: 22,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  paletteName: {
    fontSize: 14,
  },
  paletteDescription: {
    fontSize: 12,
    lineHeight: 17,
  },
  customColorSection: {
    gap: 10,
  },
  sectionHint: {
    fontSize: 12,
    lineHeight: 17,
  },
  resetText: {
    fontSize: 12,
    fontWeight: "700",
  },
  swatchSection: {
    gap: 8,
  },
  swatchLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
  swatchRail: {
    gap: 10,
    paddingRight: 10,
  },
  colorChip: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
    gap: 6,
    width: 88,
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 28,
  },
  colorName: {
    fontSize: 12,
  },
  contrastNote: {
    fontSize: 11,
    fontWeight: "700",
  },
  contrastHelper: {
    fontSize: 11,
    fontWeight: "700",
  },
});
