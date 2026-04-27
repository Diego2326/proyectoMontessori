import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { ClayCard } from "@/components/ClayCard";
import { useStudentCoursesQuery } from "@/features/courses/hooks";
import { useStudentProgressQuery } from "@/features/progress/hooks";
import { useAppTheme } from "@/theme/ThemeProvider";

export default function ProgressScreen() {
  const theme = useAppTheme();
  const progressQuery = useStudentProgressQuery();
  const coursesQuery = useStudentCoursesQuery();

  return (
    <AppScreen
      title="Mi progreso"
      refreshing={progressQuery.isFetching || coursesQuery.isFetching}
      onRefresh={() => Promise.all([progressQuery.refetch(), coursesQuery.refetch()])}
      compactHeader
      showAppLabel={false}
    >
      {(progressQuery.isLoading || coursesQuery.isLoading) && <LoadingState />}
      {(progressQuery.error || coursesQuery.error) && <ErrorState error={progressQuery.error ?? coursesQuery.error} />}
      {!!progressQuery.data && (
        <ClayCard style={styles.card}>
          <Text style={[styles.percent, { color: theme.colors.primary, fontFamily: theme.typography.title }]}>
            {progressQuery.data.progressPercent}%
          </Text>
          <Text style={[styles.text, { color: theme.colors.textMuted }]}>
            Publicadas: {progressQuery.data.publishedAssignments}
          </Text>
          <Text style={[styles.text, { color: theme.colors.textMuted }]}>
            Entregadas: {progressQuery.data.submittedAssignments}
          </Text>
          <Text style={[styles.text, { color: theme.colors.textMuted }]}>
            Calificadas: {progressQuery.data.gradedAssignments}
          </Text>
        </ClayCard>
      )}

      {!coursesQuery.isLoading && !coursesQuery.error && coursesQuery.data?.length === 0 && (
        <EmptyState title="Sin materias" />
      )}
      {coursesQuery.data?.map((course) => (
        <TouchableOpacity key={course.id} onPress={() => router.push(`/(app)/courses/${course.id}/progress`)}>
          <ClayCard>
            <Text style={{ color: theme.colors.text, fontFamily: theme.typography.title }}>{course.name}</Text>
            <Text style={{ color: theme.colors.textMuted }}>{course.code}</Text>
          </ClayCard>
        </TouchableOpacity>
      ))}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 6,
  },
  percent: {
    fontSize: 36,
  },
  text: {
    fontSize: 14,
  },
});
