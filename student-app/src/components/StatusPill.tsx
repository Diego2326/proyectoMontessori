import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/theme/ThemeProvider";

interface StatusPillProps {
  label: string;
  tone?: "primary" | "success" | "warning" | "danger" | "neutral";
}

export function StatusPill({ label, tone = "neutral" }: StatusPillProps) {
  const theme = useAppTheme();
  const palette = {
    primary: { bg: theme.colors.primarySoft, text: theme.colors.primary },
    success: { bg: `${theme.colors.success}22`, text: theme.colors.success },
    warning: { bg: `${theme.colors.warning}26`, text: theme.colors.warning },
    danger: { bg: `${theme.colors.danger}26`, text: theme.colors.danger },
    neutral: { bg: theme.colors.cardSoft, text: theme.colors.textMuted },
  }[tone];

  return (
    <View style={[styles.pill, { backgroundColor: palette.bg, borderColor: theme.colors.border }]}>
      <Text style={[styles.text, { color: palette.text }]}>{label}</Text>
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
