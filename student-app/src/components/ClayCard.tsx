import React, { PropsWithChildren } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { useAppTheme } from "@/theme/ThemeProvider";
import { useResponsive } from "@/theme/useResponsive";

interface ClayCardProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}

export function ClayCard({ children, style }: ClayCardProps) {
  const theme = useAppTheme();
  const responsive = useResponsive();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.borderStrong,
          shadowColor: theme.colors.shadow,
          borderTopLeftRadius: responsive.isTablet ? 30 : 24,
          borderTopRightRadius: responsive.isTablet ? 30 : 24,
          borderBottomLeftRadius: responsive.isTablet ? 24 : 18,
          borderBottomRightRadius: responsive.isTablet ? 36 : 28,
          padding: responsive.isTablet ? 20 : 14,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 14,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 26,
    elevation: 5,
  },
});
