import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { getErrorMessage } from "@/core/api/error";
import { useAppTheme } from "@/theme/ThemeProvider";
import { AppButton } from "./AppButton";

interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const theme = useAppTheme();
  return (
    <View style={[styles.wrapper, { borderColor: theme.colors.danger, backgroundColor: theme.colors.cardSoft }]}>
      <Text style={[styles.title, { color: theme.colors.danger, fontFamily: theme.typography.title }]}>Algo salió mal</Text>
      <Text style={[styles.message, { color: theme.colors.text }]}>{getErrorMessage(error)}</Text>
      {!!onRetry && <AppButton label="Reintentar" onPress={onRetry} variant="ghost" />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  title: {
    fontSize: 16,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
});
