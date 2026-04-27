import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { formatDateTime } from "@/core/utils/date";
import { assignmentStatusLabel } from "@/core/utils/status";
import { AppScreen } from "@/components/AppScreen";
import { CourseShell } from "@/components/CourseShell";
import { ClayCard } from "@/components/ClayCard";
import { AppButton } from "@/components/AppButton";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import {
  canEditSubmission,
  useAssignmentDetailFromCourseQuery,
  useMySubmissionQuery,
} from "@/features/assignments/hooks";
import { useStudentGradesQuery } from "@/features/grades/hooks";
import { useAppTheme } from "@/theme/ThemeProvider";
import { StatusPill } from "@/components/StatusPill";

export default function AssignmentDetailScreen() {
  const params = useLocalSearchParams<{ assignmentId: string; courseId?: string }>();
  const assignmentId = Number(params.assignmentId);
  const courseId = Number(params.courseId);
  const safeCourseId = Number.isFinite(courseId) ? courseId : NaN;
  const theme = useAppTheme();

  const assignmentQuery = useAssignmentDetailFromCourseQuery(safeCourseId, assignmentId);
  const submissionQuery = useMySubmissionQuery(assignmentId);
  const gradesQuery = useStudentGradesQuery();

  const hasSubmission = !!submissionQuery.data;
  const editable = canEditSubmission(assignmentQuery.data);
  const relatedGrade = gradesQuery.data?.find((grade) => grade.assignmentId === assignmentId);
  const statusLabel = assignmentQuery.data ? assignmentStatusLabel(assignmentQuery.data, hasSubmission) : "Pendiente";
  const statusTone = statusLabel === "Entregada" ? "success" : statusLabel === "Cerrada" ? "danger" : "warning";
  const screenContent = (
    <>
      {(assignmentQuery.isLoading || submissionQuery.isLoading) && <LoadingState />}
      {(assignmentQuery.error || submissionQuery.error) && (
        <ErrorState
          error={assignmentQuery.error ?? submissionQuery.error}
          onRetry={() => Promise.all([assignmentQuery.refetch(), submissionQuery.refetch(), gradesQuery.refetch()])}
        />
      )}
      {!Number.isFinite(courseId) && <EmptyState title="Abre esta tarea desde su materia" />}

      {!!assignmentQuery.data && Number.isFinite(courseId) && (
        <>
          <ClayCard style={styles.card}>
            <View style={styles.head}>
              <StatusPill label={statusLabel} tone={statusTone} />
              <Text style={[styles.metaStrong, { color: theme.colors.primary }]}>{assignmentQuery.data.maxPoints} pts</Text>
            </View>
            {!!assignmentQuery.data.description && <Text style={[styles.body, { color: theme.colors.text }]}>{assignmentQuery.data.description}</Text>}
            {!!assignmentQuery.data.instructions && (
              <Text style={[styles.body, { color: theme.colors.textMuted }]}>{assignmentQuery.data.instructions}</Text>
            )}
            <View style={styles.metaRow}>
              <Text style={[styles.meta, { color: theme.colors.textMuted }]}>Entrega {formatDateTime(assignmentQuery.data.dueAt)}</Text>
              <Text style={[styles.meta, { color: theme.colors.textMuted }]}>
                {assignmentQuery.data.allowLateSubmissions ? "Acepta tardías" : "Sin tardías"}
              </Text>
            </View>
          </ClayCard>

          <ClayCard style={styles.card}>
            <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Entrega</Text>
            {!hasSubmission && <Text style={{ color: theme.colors.textMuted }}>Sin entregar</Text>}
            {!!submissionQuery.data && (
              <>
                <Text style={{ color: theme.colors.textMuted }}>{submissionQuery.data.status}</Text>
                <Text style={{ color: theme.colors.textMuted }}>{formatDateTime(submissionQuery.data.submittedAt)}</Text>
                {!!submissionQuery.data.contentText && <Text style={{ color: theme.colors.text }}>{submissionQuery.data.contentText}</Text>}
                {!!submissionQuery.data.attachmentUrl && <Text style={{ color: theme.colors.primary }}>{submissionQuery.data.attachmentUrl}</Text>}
              </>
            )}
            <AppButton
              label={hasSubmission ? "Editar" : "Entregar"}
              onPress={() =>
                router.push({
                  pathname: "/(app)/assignments/[assignmentId]/submission",
                  params: { assignmentId, courseId, submissionId: submissionQuery.data?.id },
                })
              }
              disabled={!editable}
            />
            {!editable && <Text style={{ color: theme.colors.warning, fontSize: 12 }}>Ya cerró.</Text>}
          </ClayCard>

          <ClayCard style={styles.card}>
            <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Nota</Text>
            {!relatedGrade && <Text style={{ color: theme.colors.textMuted }}>Pendiente</Text>}
            {!!relatedGrade && (
              <View style={styles.gradeWrap}>
                <Text style={[styles.grade, { color: theme.colors.primary, fontFamily: theme.typography.title }]}>
                  {relatedGrade.score}
                </Text>
                <Text style={{ color: theme.colors.textMuted }}>{formatDateTime(relatedGrade.gradedAt)}</Text>
                {!!relatedGrade.feedback && <Text style={{ color: theme.colors.text }}>{relatedGrade.feedback}</Text>}
              </View>
            )}
          </ClayCard>
        </>
      )}
    </>
  );

  if (Number.isFinite(courseId)) {
    return (
      <CourseShell
        courseId={courseId}
        activeSection="assignments"
        title={assignmentQuery.data?.title ?? "Tarea"}
        refreshing={assignmentQuery.isFetching || submissionQuery.isFetching}
        onRefresh={() => Promise.all([assignmentQuery.refetch(), submissionQuery.refetch(), gradesQuery.refetch()])}
      >
        {screenContent}
      </CourseShell>
    );
  }

  return (
    <AppScreen
      title={assignmentQuery.data?.title ?? "Tarea"}
      refreshing={assignmentQuery.isFetching || submissionQuery.isFetching}
      onRefresh={() => Promise.all([assignmentQuery.refetch(), submissionQuery.refetch(), gradesQuery.refetch()])}
      compactHeader
      showAppLabel={false}
    >
      {screenContent}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
  },
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 16,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  metaRow: {
    gap: 4,
  },
  meta: {
    fontSize: 13,
  },
  metaStrong: {
    fontSize: 14,
    fontWeight: "800",
  },
  gradeWrap: {
    gap: 6,
  },
  grade: {
    fontSize: 30,
  },
});
