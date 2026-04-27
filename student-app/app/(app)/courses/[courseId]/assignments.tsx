import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { assignmentStatusLabel } from "@/core/utils/status";
import { formatDateTime } from "@/core/utils/date";
import { CourseShell } from "@/components/CourseShell";
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
        <Text style={[styles.meta, { color: theme.colors.textMuted }]}>Entrega {formatDateTime(assignment.dueAt)}</Text>
        <View style={styles.tags}>
          <View style={[styles.tag, { backgroundColor: theme.colors.cardSoft, borderColor: theme.colors.border }]}>
            <Text style={[styles.tagText, { color: theme.colors.textMuted }]}>{assignment.maxPoints} pts</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: theme.colors.cardSoft, borderColor: theme.colors.border }]}>
            <Text style={[styles.tagText, { color: theme.colors.textMuted }]}>
              {assignment.allowLateSubmissions ? "Acepta tardías" : "Sin tardías"}
            </Text>
          </View>
        </View>
      </ClayCard>
    </TouchableOpacity>
  );
}

export default function AssignmentListScreen() {
  const params = useLocalSearchParams<{ courseId: string }>();
  const courseId = Number(params.courseId);
  const { data, isLoading, isFetching, error, refetch } = useCourseAssignmentsQuery(courseId);
  const sortedAssignments = useMemo(
    () =>
      [...(data ?? [])].sort((left, right) => {
        if (!left.dueAt) return 1;
        if (!right.dueAt) return -1;
        return new Date(left.dueAt).getTime() - new Date(right.dueAt).getTime();
      }),
    [data],
  );

  return (
    <CourseShell courseId={courseId} activeSection="assignments" title="Tareas" refreshing={isFetching} onRefresh={refetch}>
      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}
      {!isLoading && !error && sortedAssignments.length === 0 && <EmptyState title="Sin tareas" />}
      {sortedAssignments.map((assignment) => (
        <AssignmentRow key={assignment.id} assignment={assignment} courseId={courseId} />
      ))}
    </CourseShell>
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
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
