import React from "react";
import { StyleSheet, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { ClayCard } from "@/components/ClayCard";
import { useCourseDetailQuery } from "@/features/courses/hooks";
import { useCourseStudentProgressQuery } from "@/features/progress/hooks";
import { useAppTheme } from "@/theme/ThemeProvider";

export default function CourseProgressDetailScreen() {
  const theme = useAppTheme();
  const params = useLocalSearchParams<{ courseId: string }>();
  const courseId = Number(params.courseId);
  const progressQuery = useCourseStudentProgressQuery(courseId);
  const courseQuery = useCourseDetailQuery(courseId);

  return (
    <AppScreen
      title="Progreso por curso"
      subtitle={courseQuery.data?.name ?? "Detalle de avance"}
      refreshing={progressQuery.isFetching}
      onRefresh={progressQuery.refetch}
    >
      {(progressQuery.isLoading || courseQuery.isLoading) && <LoadingState />}
      {(progressQuery.error || courseQuery.error) && <ErrorState error={progressQuery.error ?? courseQuery.error} />}

      {!!progressQuery.data && (
        <ClayCard style={styles.card}>
          <Text style={[styles.percent, { color: theme.colors.primary, fontFamily: theme.typography.title }]}>
            {progressQuery.data.progressPercent}%
          </Text>
          <Text style={[styles.text, { color: theme.colors.textMuted }]}>
            Tareas publicadas: {progressQuery.data.publishedAssignments}
          </Text>
          <Text style={[styles.text, { color: theme.colors.textMuted }]}>
            Tareas entregadas: {progressQuery.data.submittedAssignments}
          </Text>
          <Text style={[styles.text, { color: theme.colors.textMuted }]}>
            Tareas calificadas: {progressQuery.data.gradedAssignments}
          </Text>
        </ClayCard>
      )}
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
