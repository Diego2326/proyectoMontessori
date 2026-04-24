import React from "react";
import { Alert, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/core/auth/authStore";
import { AppScreen } from "@/components/AppScreen";
import { ClayCard } from "@/components/ClayCard";
import { AppButton } from "@/components/AppButton";
import { formatDateTime } from "@/core/utils/date";
import { useAppTheme } from "@/theme/ThemeProvider";

export default function ProfileScreen() {
  const theme = useAppTheme();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const doLogout = async () => {
    await logout();
    queryClient.clear();
    router.replace("/(auth)/login");
  };

  return (
    <AppScreen title="Mi perfil" subtitle="Información de tu cuenta de estudiante.">
      <ClayCard style={styles.card}>
        <Text style={[styles.label, { color: theme.colors.textMuted }]}>Correo</Text>
        <Text style={[styles.value, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{user?.email ?? "-"}</Text>
        <Text style={[styles.label, { color: theme.colors.textMuted }]}>Rol</Text>
        <Text style={[styles.value, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{user?.role ?? "-"}</Text>
        <Text style={[styles.label, { color: theme.colors.textMuted }]}>Creado</Text>
        <Text style={[styles.value, { color: theme.colors.text, fontFamily: theme.typography.title }]}>
          {formatDateTime(user?.createdAt)}
        </Text>
      </ClayCard>
      <AppButton label="Ver calificaciones" onPress={() => router.push("/(app)/grades")} variant="ghost" />
      <AppButton label="Ver progreso" onPress={() => router.push("/(app)/progress")} variant="ghost" />
      <AppButton
        label="Cerrar sesión"
        variant="danger"
        onPress={() => {
          Alert.alert("Cerrar sesión", "¿Deseas salir de tu sesión?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Salir", style: "destructive", onPress: () => doLogout() },
          ]);
        }}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 6,
  },
  label: {
    fontSize: 12,
  },
  value: {
    fontSize: 16,
    marginBottom: 4,
  },
});
