import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQueries } from "@tanstack/react-query";
import { AppScreen } from "@/components/AppScreen";
import { ClayCard } from "@/components/ClayCard";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { StatusPill } from "@/components/StatusPill";
import { authedRequest } from "@/core/api/authedRequest";
import { ApiError } from "@/core/api/error";
import { formatDateTime } from "@/core/utils/date";
import { assignmentKeys } from "@/features/assignments/hooks";
import { useStudentCoursesQuery } from "@/features/courses/hooks";
import { useAppTheme } from "@/theme/ThemeProvider";
import { LmsAssignmentDto, SubmissionDto } from "@/types/dto";

export default function TasksScreen() {
  const theme = useAppTheme();
  const coursesQuery = useStudentCoursesQuery();
  const courses = coursesQuery.data ?? [];
  const assignmentQueries = useQueries({
    queries: courses.map((course) => ({
      queryKey: assignmentKeys.byCourse(course.id),
      queryFn: () => authedRequest<LmsAssignmentDto[]>(`/courses/${course.id}/assignments`),
      enabled: Number.isFinite(course.id),
    })),
  });

  const assignments = React.useMemo(
    () =>
      assignmentQueries.flatMap((query, index) =>
        (query.data ?? []).map((assignment) => ({
          assignment,
          course: courses[index],
        }))
      ),
    [assignmentQueries, courses]
  );

  const submissionQueries = useQueries({
    queries: assignments.map(({ assignment }) => ({
      queryKey: assignmentKeys.mySubmission(assignment.id),
      queryFn: async () => {
        try {
          return await authedRequest<SubmissionDto>(`/assignments/${assignment.id}/my-submission`);
        } catch (error) {
          if (error instanceof ApiError && error.status === 404) {
            return null;
          }
          throw error;
        }
      },
      enabled: Number.isFinite(assignment.id),
      retry: (failureCount: number, error: Error) => !(error instanceof ApiError && error.status === 404) && failureCount < 1,
    })),
  });

  const pendingTasks = React.useMemo(
    () =>
      assignments
        .filter(({ assignment }, index) => {
          const submission = submissionQueries[index]?.data;
          const isClosed = assignment.status.toLowerCase() === "closed";
          return !submission && !isClosed;
        })
        .sort((left, right) => {
          const leftTime = left.assignment.dueAt ? new Date(left.assignment.dueAt).getTime() : Number.MAX_SAFE_INTEGER;
          const rightTime = right.assignment.dueAt ? new Date(right.assignment.dueAt).getTime() : Number.MAX_SAFE_INTEGER;
          return leftTime - rightTime;
        }),
    [assignments, submissionQueries]
  );

  const isLoading = coursesQuery.isLoading || assignmentQueries.some((query) => query.isLoading);
  const isFetching = coursesQuery.isFetching || assignmentQueries.some((query) => query.isFetching) || submissionQueries.some((query) => query.isFetching);
  const error = coursesQuery.error ?? assignmentQueries.find((query) => query.error)?.error ?? submissionQueries.find((query) => query.error)?.error;

  return (
    <AppScreen
      title="Tareas"
      subtitle="Pendientes de entregar"
      refreshing={isFetching}
      onRefresh={() =>
        Promise.all([
          coursesQuery.refetch(),
          ...assignmentQueries.map((query) => query.refetch()),
          ...submissionQueries.map((query) => query.refetch()),
        ])
      }
      compactHeader
      showAppLabel={false}
    >
      <ClayCard style={styles.bannerCard}>
        <View style={styles.bannerRow}>
          <View style={[styles.bannerIcon, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="create" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.bannerCopy}>
            <Text style={[styles.bannerTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>
              {pendingTasks.length} tarea{pendingTasks.length === 1 ? "" : "s"} pendiente{pendingTasks.length === 1 ? "" : "s"}
            </Text>
            <Text style={[styles.bannerSubtitle, { color: theme.colors.textMuted }]}>Ordenadas por fecha de entrega.</Text>
          </View>
        </View>
      </ClayCard>

      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={() => Promise.all([coursesQuery.refetch(), ...assignmentQueries.map((query) => query.refetch())])} />}
      {!isLoading && !error && pendingTasks.length === 0 && <EmptyState title="Sin tareas pendientes" subtitle="Todo lo publicado ya fue entregado." />}

      <View style={styles.list}>
        {pendingTasks.map(({ assignment, course }) => (
          <Pressable
            key={assignment.id}
            onPress={() =>
              router.push({
                pathname: "/(app)/assignments/[assignmentId]",
                params: { assignmentId: assignment.id, courseId: course.id },
              })
            }
          >
            <ClayCard style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.cardHeading}>
                  <Text style={[styles.courseName, { color: theme.colors.primary }]}>{course.name}</Text>
                  <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{assignment.title}</Text>
                </View>
                <StatusPill label={assignment.allowLateSubmissions ? "Acepta tardías" : "Sin tardías"} tone="warning" />
              </View>

              {!!assignment.description && (
                <Text numberOfLines={2} style={[styles.description, { color: theme.colors.textMuted }]}>
                  {assignment.description}
                </Text>
              )}

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={16} color={theme.colors.textSoft} />
                  <Text style={[styles.metaText, { color: theme.colors.textSoft }]}>Entrega {formatDateTime(assignment.dueAt)}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="ribbon-outline" size={16} color={theme.colors.textSoft} />
                  <Text style={[styles.metaText, { color: theme.colors.textSoft }]}>{assignment.maxPoints} pts</Text>
                </View>
              </View>
            </ClayCard>
          </Pressable>
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  bannerCard: {
    gap: 12,
  },
  bannerRow: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  bannerIcon: {
    width: 54,
    height: 54,
    borderRadius: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerCopy: {
    flex: 1,
    gap: 2,
  },
  bannerTitle: {
    fontSize: 22,
  },
  bannerSubtitle: {
    fontSize: 13,
  },
  list: {
    gap: 12,
  },
  card: {
    gap: 10,
  },
  cardTop: {
    gap: 10,
  },
  cardHeading: {
    gap: 4,
  },
  courseName: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 18,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 13,
  },
});
