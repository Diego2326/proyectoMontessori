import React from "react";
import { Platform } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/theme/ThemeProvider";

export function OfflineBanner() {
  const theme = useAppTheme();
  const isOffline =
    Platform.OS === "web"
      ? typeof navigator !== "undefined" && navigator.onLine === false
      : false;

  if (!isOffline) return null;

  return (
    <View style={[styles.banner, { backgroundColor: theme.colors.warning }]}>
      <Text style={[styles.text, { color: "#2A1A00", fontFamily: theme.typography.title }]}>
        Estás sin conexión. Algunas acciones pueden fallar.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
  },
});
