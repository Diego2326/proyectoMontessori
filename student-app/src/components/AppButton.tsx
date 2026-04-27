import React from "react";
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/theme/ThemeProvider";
import { useResponsive } from "@/theme/useResponsive";
import { getReadableTextColor } from "@/theme/colorUtils";

interface AppButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "ghost" | "danger";
  style?: StyleProp<ViewStyle>;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function AppButton({ label, onPress, loading, disabled, variant = "primary", style, icon = "arrow-forward" }: AppButtonProps) {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const isDisabled = disabled || loading;
  const fillColor = variant === "primary" ? theme.colors.primary : variant === "danger" ? theme.colors.danger : theme.colors.cardSoft;
  const foregroundColor = variant === "ghost" ? theme.colors.text : getReadableTextColor(fillColor);

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: fillColor,
          borderColor: variant === "ghost" ? theme.colors.borderStrong : "transparent",
          opacity: isDisabled ? 0.65 : pressed ? 0.85 : 1,
          minHeight: responsive.isTablet ? 58 : 48,
          borderRadius: responsive.isTablet ? 20 : 16,
          paddingHorizontal: responsive.isTablet ? 22 : 16,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={foregroundColor} />
      ) : (
        <View style={styles.content}>
          <Text
            style={[
              styles.label,
              {
                color: foregroundColor,
                fontFamily: theme.typography.title,
                fontSize: responsive.isTablet ? 17 : 15,
              },
            ]}
          >
            {label}
          </Text>
          <Ionicons
            name={icon}
            size={responsive.isTablet ? 19 : 17}
            color={foregroundColor}
          />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 15,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
