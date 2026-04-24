import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/theme/ThemeProvider";

interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = "Cargando..." }: LoadingStateProps) {
  const theme = useAppTheme();
  return (
    <View style={styles.wrapper}>
      <ActivityIndicator color={theme.colors.primary} />
      <Text style={{ color: theme.colors.textMuted, fontFamily: theme.typography.body }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 24,
    alignItems: "center",
    gap: 8,
  },
});
