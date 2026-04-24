import React from "react";
import { StyleSheet, Text } from "react-native";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { ClayCard } from "@/components/ClayCard";
import { useStudentGradesQuery } from "@/features/grades/hooks";
import { formatDateTime } from "@/core/utils/date";
import { useAppTheme } from "@/theme/ThemeProvider";

export default function GradesScreen() {
  const theme = useAppTheme();
  const { data, isLoading, isFetching, error, refetch } = useStudentGradesQuery();

  return (
    <AppScreen title="Calificaciones" subtitle="Notas y retroalimentación recibidas." refreshing={isFetching} onRefresh={refetch}>
      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}
      {!isLoading && !error && data?.length === 0 && <EmptyState title="Sin calificaciones aún" />}
      {data?.map((grade) => (
        <ClayCard key={grade.id} style={styles.card}>
          <Text style={[styles.score, { color: theme.colors.primary, fontFamily: theme.typography.title }]}>{grade.score}</Text>
          <Text style={[styles.text, { color: theme.colors.textMuted }]}>Tarea #{grade.assignmentId}</Text>
          <Text style={[styles.text, { color: theme.colors.textMuted }]}>Calificada: {formatDateTime(grade.gradedAt)}</Text>
          {!!grade.feedback && <Text style={[styles.feedback, { color: theme.colors.text }]}>{grade.feedback}</Text>}
        </ClayCard>
      ))}
      <Text style={[styles.note, { color: theme.colors.textMuted }]}>
        El backend actual entrega notas por alumno; el desglose por curso depende de relacionar tareas disponibles por curso.
      </Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 6,
  },
  score: {
    fontSize: 34,
    lineHeight: 38,
  },
  text: {
    fontSize: 13,
  },
  feedback: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  note: {
    fontSize: 12,
    marginTop: 8,
  },
});
