import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { assignmentStatusLabel } from "@/core/utils/status";
import { formatDateTime } from "@/core/utils/date";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { ClayCard } from "@/components/ClayCard";
import { StatusPill } from "@/components/StatusPill";
import { useCourseAssignmentsQuery, useMySubmissionQuery } from "@/features/assignments/hooks";
import { LmsAssignmentDto } from "@/types/dto";
import { useAppTheme } from "@/theme/ThemeProvider";

function AssignmentRow({ assignment, courseId }: { assignment: LmsAssignmentDto; courseId: number }) {
  const theme = useAppTheme();
  const submissionQuery = useMySubmissionQuery(assignment.id);
  const hasSubmission = !!submissionQuery.data;

  const statusLabel = assignmentStatusLabel(assignment, hasSubmission);
  const tone = statusLabel === "Entregada" ? "success" : statusLabel === "Cerrada" ? "danger" : "warning";

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/(app)/assignments/[assignmentId]",
          params: { assignmentId: assignment.id, courseId },
        })
      }
    >
      <ClayCard style={styles.card}>
        <View style={styles.head}>
          <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{assignment.title}</Text>
          <StatusPill label={statusLabel} tone={tone} />
        </View>
        <Text style={[styles.meta, { color: theme.colors.textMuted }]}>Entrega: {formatDateTime(assignment.dueAt)}</Text>
        <Text style={[styles.meta, { color: theme.colors.textMuted }]}>Puntaje máximo: {assignment.maxPoints}</Text>
        <Text style={[styles.meta, { color: theme.colors.textMuted }]}>
          Tardías: {assignment.allowLateSubmissions ? "Sí" : "No"}
        </Text>
      </ClayCard>
    </TouchableOpacity>
  );
}

export default function AssignmentListScreen() {
  const params = useLocalSearchParams<{ courseId: string }>();
  const courseId = Number(params.courseId);
  const { data, isLoading, isFetching, error, refetch } = useCourseAssignmentsQuery(courseId);

  return (
    <AppScreen title="Tareas del curso" subtitle="Estado de entrega y fechas clave." refreshing={isFetching} onRefresh={refetch}>
      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}
      {!isLoading && !error && data?.length === 0 && <EmptyState title="Sin tareas publicadas" />}
      {data?.map((assignment) => (
        <AssignmentRow key={assignment.id} assignment={assignment} courseId={courseId} />
      ))}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 6,
  },
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    fontSize: 16,
    flex: 1,
  },
  meta: {
    fontSize: 13,
  },
});
