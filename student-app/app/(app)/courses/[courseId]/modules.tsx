import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { CourseShell } from "@/components/CourseShell";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { ClayCard } from "@/components/ClayCard";
import { useCourseModulesQuery } from "@/features/courses/hooks";
import { useAppTheme } from "@/theme/ThemeProvider";

export default function CourseModulesScreen() {
  const params = useLocalSearchParams<{ courseId: string }>();
  const courseId = Number(params.courseId);
  const theme = useAppTheme();
  const { data, isLoading, isFetching, error, refetch } = useCourseModulesQuery(courseId);
  const sortedModules = [...(data ?? [])].sort((left, right) => left.position - right.position);

  return (
    <CourseShell courseId={courseId} activeSection="modules" title="Módulos" refreshing={isFetching} onRefresh={refetch}>
      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}
      {!isLoading && !error && sortedModules.length === 0 && <EmptyState title="Sin módulos" />}
      {sortedModules.map((module) => (
        <TouchableOpacity key={module.id} onPress={() => router.push(`/(app)/courses/${courseId}/modules/${module.id}`)}>
          <ClayCard style={styles.card}>
            <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>Módulo {module.position}</Text>
            <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{module.title}</Text>
            {!!module.description && (
              <Text numberOfLines={2} style={[styles.description, { color: theme.colors.textMuted }]}>
                {module.description}
              </Text>
            )}
          </ClayCard>
        </TouchableOpacity>
      ))}
    </CourseShell>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 6,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});
