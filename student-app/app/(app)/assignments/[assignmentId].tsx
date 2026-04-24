import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { formatDateTime } from "@/core/utils/date";
import { AppScreen } from "@/components/AppScreen";
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

  return (
    <AppScreen
      title={assignmentQuery.data?.title ?? "Detalle de tarea"}
      subtitle="Revisa instrucciones, fechas y tu entrega."
      refreshing={assignmentQuery.isFetching || submissionQuery.isFetching}
      onRefresh={() => Promise.all([assignmentQuery.refetch(), submissionQuery.refetch(), gradesQuery.refetch()])}
    >
      {(assignmentQuery.isLoading || submissionQuery.isLoading) && <LoadingState />}
      {(assignmentQuery.error || submissionQuery.error) && (
        <ErrorState
          error={assignmentQuery.error ?? submissionQuery.error}
          onRetry={() => Promise.all([assignmentQuery.refetch(), submissionQuery.refetch(), gradesQuery.refetch()])}
        />
      )}
      {!Number.isFinite(courseId) && (
        <EmptyState title="Falta contexto del curso" subtitle="Abre la tarea desde la lista del curso para continuar." />
      )}

      {!!assignmentQuery.data && Number.isFinite(courseId) && (
        <>
          <ClayCard style={styles.card}>
            {!!assignmentQuery.data.description && <Text style={[styles.body, { color: theme.colors.text }]}>{assignmentQuery.data.description}</Text>}
            {!!assignmentQuery.data.instructions && (
              <Text style={[styles.body, { color: theme.colors.textMuted }]}>Instrucciones: {assignmentQuery.data.instructions}</Text>
            )}
            <Text style={[styles.body, { color: theme.colors.textMuted }]}>Entrega: {formatDateTime(assignmentQuery.data.dueAt)}</Text>
            <Text style={[styles.body, { color: theme.colors.textMuted }]}>Puntaje máximo: {assignmentQuery.data.maxPoints}</Text>
            <Text style={[styles.body, { color: theme.colors.textMuted }]}>
              Tardías: {assignmentQuery.data.allowLateSubmissions ? "Permitidas" : "No permitidas"}
            </Text>
          </ClayCard>

          <ClayCard style={styles.card}>
            <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Mi entrega</Text>
            {!hasSubmission && <Text style={{ color: theme.colors.textMuted }}>Aún no has enviado esta tarea.</Text>}
            {!!submissionQuery.data && (
              <>
                <Text style={{ color: theme.colors.textMuted }}>Estado: {submissionQuery.data.status}</Text>
                <Text style={{ color: theme.colors.textMuted }}>Enviada: {formatDateTime(submissionQuery.data.submittedAt)}</Text>
                {!!submissionQuery.data.contentText && <Text style={{ color: theme.colors.text }}>{submissionQuery.data.contentText}</Text>}
                {!!submissionQuery.data.attachmentUrl && <Text style={{ color: theme.colors.primary }}>{submissionQuery.data.attachmentUrl}</Text>}
              </>
            )}
            <AppButton
              label={hasSubmission ? "Editar entrega" : "Crear entrega"}
              onPress={() =>
                router.push({
                  pathname: "/(app)/assignments/[assignmentId]/submission",
                  params: { assignmentId, courseId, submissionId: submissionQuery.data?.id },
                })
              }
              disabled={!editable}
            />
            {!editable && (
              <Text style={{ color: theme.colors.warning, fontSize: 12 }}>
                La tarea está cerrada y no admite más ediciones según su configuración.
              </Text>
            )}
          </ClayCard>

          <ClayCard style={styles.card}>
            <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Calificación</Text>
            {!relatedGrade && <Text style={{ color: theme.colors.textMuted }}>Aún no ha sido calificada.</Text>}
            {!!relatedGrade && (
              <View style={styles.gradeWrap}>
                <Text style={[styles.grade, { color: theme.colors.primary, fontFamily: theme.typography.title }]}>
                  {relatedGrade.score}
                </Text>
                <Text style={{ color: theme.colors.textMuted }}>Calificada: {formatDateTime(relatedGrade.gradedAt)}</Text>
                {!!relatedGrade.feedback && <Text style={{ color: theme.colors.text }}>{relatedGrade.feedback}</Text>}
              </View>
            )}
          </ClayCard>
        </>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
  },
  title: {
    fontSize: 16,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  gradeWrap: {
    gap: 6,
  },
  grade: {
    fontSize: 30,
  },
});
