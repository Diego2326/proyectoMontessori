import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useStudentDashboardQuery } from "@/features/dashboard/hooks";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { MetricCard } from "@/components/MetricCard";
import { AppButton } from "@/components/AppButton";
import { ClayCard } from "@/components/ClayCard";
import { useAppTheme } from "@/theme/ThemeProvider";

export default function StudentDashboardScreen() {
  const theme = useAppTheme();
  const { data, isLoading, isFetching, error, refetch } = useStudentDashboardQuery();

  return (
    <AppScreen
      title="Hola, estudiante"
      subtitle="Tu resumen académico del día."
      refreshing={isFetching}
      onRefresh={refetch}
    >
      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}
      {!isLoading && !error && !data && <EmptyState title="Sin datos de dashboard" subtitle="Reintenta en unos minutos." />}
      {!!data && (
        <>
          <View style={styles.metricsRow}>
            <MetricCard label="Cursos" value={data.enrolledCourses} />
            <MetricCard label="Pendientes" value={data.pendingAssignments} />
          </View>
          <View style={styles.metricsRow}>
            <MetricCard label="Calificadas" value={data.gradedAssignments} />
            <MetricCard label="No leídas" value={data.unreadNotifications} />
          </View>
          <ClayCard>
            <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Atajos</Text>
            <View style={styles.quickGrid}>
              <AppButton label="Mis cursos" onPress={() => router.push("/(app)/(tabs)/courses")} />
              <AppButton label="Tareas y notas" onPress={() => router.push("/(app)/grades")} variant="ghost" />
              <AppButton label="Notificaciones" onPress={() => router.push("/(app)/(tabs)/notifications")} variant="ghost" />
              <AppButton label="Mi progreso" onPress={() => router.push("/(app)/progress")} />
              <AppButton label="Calendario" onPress={() => router.push("/(app)/(tabs)/calendar")} variant="ghost" />
            </View>
          </ClayCard>
        </>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  metricsRow: {
    flexDirection: "row",
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  quickGrid: {
    gap: 8,
  },
});
