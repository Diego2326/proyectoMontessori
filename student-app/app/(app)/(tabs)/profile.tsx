import React, { useMemo, useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, View } from "react-native";
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

export default function ProfileScreen() {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const {
    paletteId,
    preferredMode,
    palettes,
    colorSwatches,
    primaryColor,
    accentColor,
    setPalette,
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
          </ClayCard>

          <ClayCard style={styles.sideCard}>
            <Text style={[styles.cardTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Acciones</Text>
            <View style={styles.actions}>
              <AppButton label="Ver calificaciones" onPress={() => router.push("/(app)/grades")} variant="ghost" />
              <AppButton label="Ver progreso" onPress={() => router.push("/(app)/progress")} variant="ghost" />
              <AppButton
                label="Cerrar sesión"
                variant="danger"
                onPress={() => {
                  Alert.alert("Cerrar sesión", "¿Deseas salir de tu sesión?", [
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
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.colorSection}>
              <View style={styles.sectionHead}>
                <Text style={[styles.sectionLabel, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Color principal</Text>
                {!!primaryColor && (
                  <Pressable onPress={() => void setPrimaryColor(null)}>
                    <Text style={[styles.resetText, { color: theme.colors.primary }]}>Usar paleta</Text>
                  </Pressable>
                )}
              </View>
              <View style={styles.colorGrid}>
                {colorSwatches.map((swatch) => {
                  const active = primaryColor === swatch.value;
                  return (
                    <Pressable
                      key={`primary-${swatch.id}`}
                      onPress={() => void setPrimaryColor(swatch.value)}
                      style={[
                        styles.colorOption,
                        {
                          borderColor: active ? theme.colors.primary : theme.colors.border,
                          backgroundColor: active ? theme.colors.card : theme.colors.cardSoft,
                        },
                      ]}
                    >
                      <View style={[styles.colorDot, { backgroundColor: swatch.value }]}>
                        {active && <Ionicons name="checkmark" size={14} color={getReadableTextColor(swatch.value)} />}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
              {!!primaryContrast?.isLowContrast && (
                <View style={[styles.warningRow, { backgroundColor: `${theme.colors.warning}18`, borderColor: `${theme.colors.warning}44` }]}>
                  <Ionicons name="alert-circle" size={15} color={theme.colors.warning} />
                  <Text style={[styles.warningText, { color: theme.colors.text }]}>
                    Este color puede perder contraste en botones o estados.
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.colorSection}>
              <View style={styles.sectionHead}>
                <Text style={[styles.sectionLabel, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Color acento</Text>
                {!!accentColor && (
                  <Pressable onPress={() => void setAccentColor(null)}>
                    <Text style={[styles.resetText, { color: theme.colors.primary }]}>Usar paleta</Text>
                  </Pressable>
                )}
              </View>
              <View style={styles.colorGrid}>
                {colorSwatches.map((swatch) => {
                  const active = accentColor === swatch.value;
                  return (
                    <Pressable
                      key={`accent-${swatch.id}`}
                      onPress={() => void setAccentColor(swatch.value)}
                      style={[
                        styles.colorOption,
                        {
                          borderColor: active ? theme.colors.primary : theme.colors.border,
                          backgroundColor: active ? theme.colors.card : theme.colors.cardSoft,
                        },
                      ]}
                    >
                      <View style={[styles.colorDot, { backgroundColor: swatch.value }]}>
                        {active && <Ionicons name="checkmark" size={14} color={getReadableTextColor(swatch.value)} />}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
              {!!accentContrast?.isLowContrast && (
                <View style={[styles.warningRow, { backgroundColor: `${theme.colors.warning}18`, borderColor: `${theme.colors.warning}44` }]}>
                  <Ionicons name="alert-circle" size={15} color={theme.colors.warning} />
                  <Text style={[styles.warningText, { color: theme.colors.text }]}>
                    Este acento puede verse débil sobre algunos fondos.
                  </Text>
                </View>
              )}
            </View>

            {(primaryColor || accentColor) && (
              <AppButton label="Restablecer colores" variant="ghost" icon="refresh" onPress={() => void resetColorOverrides()} />
            )}
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  layout: {
    gap: 14,
  },
  card: {
    gap: 16,
  },
  sideColumn: {
    gap: 14,
    alignSelf: "stretch",
  },
  sideCard: {
    gap: 14,
  },
  cardTitle: {
    fontSize: 22,
  },
  field: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 18,
    lineHeight: 24,
  },
  actions: {
    gap: 10,
  },
  themeTrigger: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  themeTriggerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  themeTextWrap: {
    gap: 2,
  },
  themeModeText: {
    fontSize: 12,
  },
  modeRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  modeChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  paletteGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  paletteCard: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 20,
    padding: 12,
    gap: 8,
    position: "relative",
  },
  paletteTop: {
    gap: 10,
  },
  swatchRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "stretch",
  },
  swatchLarge: {
    width: 42,
    height: 42,
    borderRadius: 12,
  },
  previewMiniCol: {
    gap: 6,
  },
  swatchMini: {
    width: 24,
    height: 18,
    borderRadius: 7,
  },
  activeCheck: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  paletteName: {
    fontSize: 16,
  },
  colorSection: {
    gap: 10,
  },
  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  sectionLabel: {
    fontSize: 16,
  },
  resetText: {
    fontSize: 13,
    fontWeight: "700",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  warningRow: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
  modalRoot: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(12, 18, 28, 0.34)",
  },
  modalCard: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 18,
    gap: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
  },
});
