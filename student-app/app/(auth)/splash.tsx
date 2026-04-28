import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "@/core/auth/authStore";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { ClayCard } from "@/components/ClayCard";
import { StudentLogo } from "@/components/StudentLogo";
import { useAppTheme } from "@/theme/ThemeProvider";
import { useResponsive } from "@/theme/useResponsive";

export default function SplashScreen() {
  const theme = useAppTheme();
  const responsive = useResponsive();
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
    <AppScreen title="Bienvenido" scroll={false} compactHeader showAppLabel={false} showGlobalTopBar={false}>
      <View style={[styles.layout, { flexDirection: responsive.isTablet ? "row" : "column", gap: responsive.isTablet ? 20 : 14 }]}>
        <ClayCard style={[styles.brandCard, { flex: responsive.isTablet ? 1.2 : undefined }]}>
          <StudentLogo size={responsive.isTablet ? 188 : 144} />
          <Text style={[styles.brandTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Montessori Student</Text>
        </ClayCard>

        <ClayCard style={[styles.statusCard, { width: responsive.isTablet ? responsive.formMaxWidth : undefined }]}>
          <Text style={[styles.statusTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Inicializando</Text>
          <Text style={[styles.statusText, { color: theme.colors.textMuted }]}>Preparando tu inicio.</Text>
          <LoadingState label="Cargando sesión..." />
        </ClayCard>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
  brandCard: {
    justifyContent: "center",
    gap: 16,
  },
  brandTitle: {
    fontSize: 28,
    lineHeight: 34,
  },
  statusCard: {
    gap: 14,
    justifyContent: "center",
    alignSelf: "center",
  },
  statusTitle: {
    fontSize: 24,
  },
  statusText: {
    fontSize: 14,
    lineHeight: 21,
  },
});
