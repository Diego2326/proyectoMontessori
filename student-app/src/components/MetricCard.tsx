import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/theme/ThemeProvider";
import { useResponsive } from "@/theme/useResponsive";
import { getReadableAccentColor } from "@/theme/colorUtils";
import { ClayCard } from "./ClayCard";

interface MetricCardProps {
  label: string;
  value: number | string;
  icon?: keyof typeof Ionicons.glyphMap;
  tone?: "primary" | "success" | "warning" | "accent";
}

export function MetricCard({ label, value, icon = "sparkles", tone = "primary" }: MetricCardProps) {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const palette = {
    primary: { bubble: theme.colors.primarySoft, icon: theme.colors.primary },
    success: { bubble: `${theme.colors.success}22`, icon: theme.colors.success },
    warning: { bubble: `${theme.colors.warning}24`, icon: theme.colors.warning },
    accent: { bubble: `${theme.colors.accent}24`, icon: theme.colors.accent },
  }[tone];
  const iconColor = getReadableAccentColor(palette.icon, palette.bubble, theme.colors.text);

  return (
    <ClayCard style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.iconBubble, { backgroundColor: palette.bubble }]}>
          <Ionicons name={icon} size={responsive.isTablet ? 20 : 18} color={iconColor} />
        </View>
        <View style={[styles.spark, { backgroundColor: palette.bubble }]} />
      </View>
      <Text
        style={[
          styles.value,
          {
            color: theme.colors.text,
            fontFamily: theme.typography.title,
            fontSize: responsive.isTablet ? 34 : 24,
          },
        ]}
      >
        {value}
      </Text>
      <Text style={[styles.label, { color: theme.colors.textMuted, fontSize: responsive.isTablet ? 14 : 13 }]}>{label}</Text>
    </ClayCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 120,
    justifyContent: "center",
    gap: 8,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  spark: {
    width: 40,
    height: 8,
    borderRadius: 999,
  },
  value: {
    fontSize: 24,
  },
  label: {
    marginTop: 6,
    fontSize: 13,
  },
});
