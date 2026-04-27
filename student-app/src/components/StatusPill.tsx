import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/theme/ThemeProvider";
import { useResponsive } from "@/theme/useResponsive";
import { getReadableAccentColor } from "@/theme/colorUtils";

interface StatusPillProps {
  label: string;
  tone?: "primary" | "success" | "warning" | "danger" | "neutral";
}

export function StatusPill({ label, tone = "neutral" }: StatusPillProps) {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const palette = {
    primary: { bg: theme.colors.primarySoft, text: getReadableAccentColor(theme.colors.primary, theme.colors.primarySoft, theme.colors.text) },
    success: { bg: `${theme.colors.success}22`, text: getReadableAccentColor(theme.colors.success, `${theme.colors.success}22`, theme.colors.text) },
    warning: { bg: `${theme.colors.warning}26`, text: getReadableAccentColor(theme.colors.warning, `${theme.colors.warning}26`, theme.colors.text) },
    danger: { bg: `${theme.colors.danger}26`, text: getReadableAccentColor(theme.colors.danger, `${theme.colors.danger}26`, theme.colors.text) },
    neutral: { bg: theme.colors.cardSoft, text: theme.colors.textMuted },
  }[tone];

  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: palette.bg,
          borderColor: theme.colors.borderStrong,
          paddingHorizontal: responsive.isTablet ? 12 : 10,
          paddingVertical: responsive.isTablet ? 6 : 4,
        },
      ]}
    >
      <Text style={[styles.text, { color: palette.text, fontSize: responsive.isTablet ? 13 : 12 }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
  },
});
