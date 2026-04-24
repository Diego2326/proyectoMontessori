import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useStudentCoursesQuery } from "@/features/courses/hooks";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { ClayCard } from "@/components/ClayCard";
import { StatusPill } from "@/components/StatusPill";
import { useAppTheme } from "@/theme/ThemeProvider";

export default function CoursesListScreen() {
  const theme = useAppTheme();
  const { data, isLoading, isFetching, error, refetch } = useStudentCoursesQuery();

  return (
    <AppScreen title="Mis cursos" subtitle="Selecciona un curso para ver módulos, tareas y feed." refreshing={isFetching} onRefresh={refetch}>
      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}
      {!isLoading && !error && data?.length === 0 && (
        <EmptyState title="No tienes cursos inscritos" subtitle="Cuando el colegio te asigne cursos, aparecerán aquí." />
      )}
      {data?.map((course) => (
        <TouchableOpacity key={course.id} onPress={() => router.push(`/(app)/courses/${course.id}`)}>
          <ClayCard style={styles.card}>
            <View style={styles.head}>
              <Text style={[styles.name, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{course.name}</Text>
              <StatusPill label={course.status} tone="primary" />
            </View>
            <Text style={[styles.code, { color: theme.colors.textMuted }]}>{course.code}</Text>
            {!!course.description && (
              <Text numberOfLines={2} style={[styles.description, { color: theme.colors.textMuted }]}>
                {course.description}
              </Text>
            )}
          </ClayCard>
        </TouchableOpacity>
      ))}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 4,
  },
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    alignItems: "center",
  },
  name: {
    fontSize: 17,
    flex: 1,
  },
  code: {
    fontSize: 13,
    fontWeight: "700",
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
});
