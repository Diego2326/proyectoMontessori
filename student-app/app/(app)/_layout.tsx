import React from "react";
import { Redirect, Stack } from "expo-router";
import { Text } from "react-native";
import { useAuthStore } from "@/core/auth/authStore";
import { AppScreen } from "@/components/AppScreen";
import { AppButton } from "@/components/AppButton";
import { LoadingState } from "@/components/LoadingState";
import { useAppTheme } from "@/theme/ThemeProvider";

function NonStudentBlocked() {
  const logout = useAuthStore((s) => s.logout);
  const theme = useAppTheme();
  return (
    <AppScreen title="App para alumnos" subtitle="Tu cuenta no tiene rol STUDENT." showGlobalTopBar={false}>
      <Text style={{ color: theme.colors.text, fontSize: 14, lineHeight: 20 }}>
        Esta aplicación móvil está pensada solo para estudiantes. Usa el portal correspondiente para tu rol.
      </Text>
      <AppButton label="Cerrar sesión" onPress={() => logout()} />
    </AppScreen>
  );
}

export default function AppLayout() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const isRestoring = useAuthStore((s) => s.isRestoring);

  if (isRestoring) {
    return (
      <AppScreen title="Cargando..." scroll={false} showGlobalTopBar={false}>
        <LoadingState label="Preparando tu cuenta..." />
      </AppScreen>
    );
  }

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  if (user && user.role !== "STUDENT") {
    return <NonStudentBlocked />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="courses/[courseId]" />
      <Stack.Screen name="courses/[courseId]/modules" />
      <Stack.Screen name="courses/[courseId]/modules/[moduleId]" />
      <Stack.Screen name="courses/[courseId]/assignments" />
      <Stack.Screen name="assignments/[assignmentId]" />
      <Stack.Screen name="assignments/[assignmentId]/submission" />
      <Stack.Screen name="grades" />
      <Stack.Screen name="courses/[courseId]/feed" />
      <Stack.Screen name="courses/[courseId]/calendar" />
      <Stack.Screen name="feed/[postId]/comments" />
      <Stack.Screen name="progress" />
      <Stack.Screen name="courses/[courseId]/progress" />
    </Stack>
  );
}
