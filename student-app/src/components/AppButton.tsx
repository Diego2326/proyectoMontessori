import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { useAppTheme } from "@/theme/ThemeProvider";

interface AppButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "ghost" | "danger";
  style?: ViewStyle;
}

export function AppButton({ label, onPress, loading, disabled, variant = "primary", style }: AppButtonProps) {
  const theme = useAppTheme();
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor:
            variant === "primary" ? theme.colors.primary : variant === "danger" ? theme.colors.danger : theme.colors.cardSoft,
          borderColor: variant === "ghost" ? theme.colors.border : "transparent",
          opacity: isDisabled ? 0.65 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "ghost" ? theme.colors.text : "#fff"} />
      ) : (
        <Text
          style={[
            styles.label,
            {
              color: variant === "ghost" ? theme.colors.text : "#fff",
              fontFamily: theme.typography.title,
            },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 15,
  },
});
