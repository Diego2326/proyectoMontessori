import React from "react";
import { StyleSheet, Text } from "react-native";
import { useAppTheme } from "@/theme/ThemeProvider";
import { ClayCard } from "./ClayCard";

interface MetricCardProps {
  label: string;
  value: number | string;
}

export function MetricCard({ label, value }: MetricCardProps) {
  const theme = useAppTheme();
  return (
    <ClayCard style={styles.card}>
      <Text style={[styles.value, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{value}</Text>
      <Text style={[styles.label, { color: theme.colors.textMuted }]}>{label}</Text>
    </ClayCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 88,
    justifyContent: "center",
  },
  value: {
    fontSize: 24,
  },
  label: {
    marginTop: 6,
    fontSize: 13,
  },
});
