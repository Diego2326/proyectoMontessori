import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/theme/ThemeProvider";

interface EmptyStateProps {
  title: string;
  subtitle?: string;
}

export function EmptyState({ title, subtitle }: EmptyStateProps) {
  const theme = useAppTheme();
  return (
    <View style={[styles.wrapper, { borderColor: theme.colors.border, backgroundColor: theme.colors.cardSoft }]}>
      <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{title}</Text>
      {!!subtitle && <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  title: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
});
