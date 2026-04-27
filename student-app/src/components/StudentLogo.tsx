import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { useAppTheme } from "@/theme/ThemeProvider";

interface StudentLogoProps {
  size?: number;
  soft?: boolean;
}

export function StudentLogo({ size = 120, soft = true }: StudentLogoProps) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.shell,
        {
          width: size,
          height: size,
          borderRadius: size * 0.28,
          backgroundColor: soft ? theme.colors.cardSoft : "transparent",
          borderColor: theme.colors.borderStrong,
          shadowColor: theme.colors.shadow,
        },
      ]}
    >
      <View
        style={[
          styles.inner,
          {
            borderRadius: size * 0.22,
            backgroundColor: soft ? theme.colors.surface : theme.colors.cardSoft,
          },
        ]}
      >
        <Image
          source={require("@/../assets/logo-colegio.png")}
          resizeMode="contain"
          style={{ width: size * 0.78, height: size * 0.78 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 6,
  },
  inner: {
    width: "84%",
    height: "84%",
    alignItems: "center",
    justifyContent: "center",
  },
});
