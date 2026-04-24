import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "@/core/auth/authStore";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { useAppTheme } from "@/theme/ThemeProvider";

export default function SplashScreen() {
  const theme = useAppTheme();
  const token = useAuthStore((s) => s.token);
  const isRestoring = useAuthStore((s) => s.isRestoring);

  useEffect(() => {
    if (isRestoring) return;
    if (token) {
      router.replace("/(app)/(tabs)/dashboard");
      return;
    }
    router.replace("/(auth)/login");
  }, [token, isRestoring]);

  return (
    <AppScreen title="Montessori LMS" subtitle="Preparando tu experiencia..." scroll={false}>
      <View style={[styles.logo, { borderColor: theme.colors.primarySoft, backgroundColor: theme.colors.cardSoft }]}>
        <Text style={{ color: theme.colors.primary, fontFamily: theme.typography.title }}>M</Text>
      </View>
      <Text style={[styles.caption, { color: theme.colors.textMuted }]}>Campus estudiantil móvil</Text>
      <LoadingState label="Cargando sesión..." />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignSelf: "center",
    marginTop: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  caption: {
    textAlign: "center",
    fontSize: 14,
  },
});
