import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useCourseDetailQuery, useCourseModulesQuery } from "@/features/courses/hooks";
import { useCourseAssignmentsQuery } from "@/features/assignments/hooks";
import { useCourseFeedQuery } from "@/features/feed/hooks";
import { useCourseCalendarQuery } from "@/features/calendar/hooks";
import { useCourseStudentProgressQuery } from "@/features/progress/hooks";
import { AppScreen } from "@/components/AppScreen";
import { ClayCard } from "@/components/ClayCard";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { AppButton } from "@/components/AppButton";
import { formatDateTime } from "@/core/utils/date";
import { StatusPill } from "@/components/StatusPill";
import { useAppTheme } from "@/theme/ThemeProvider";

const SEGMENTS = ["Resumen", "Módulos", "Tareas", "Feed", "Calendario", "Progreso"] as const;
type Segment = (typeof SEGMENTS)[number];

export default function CourseDetailScreen() {
  const theme = useAppTheme();
  const params = useLocalSearchParams<{ courseId: string }>();
  const courseId = Number(params.courseId);
  const [segment, setSegment] = useState<Segment>("Resumen");

  const courseQuery = useCourseDetailQuery(courseId);
  const modulesQuery = useCourseModulesQuery(courseId);
  const assignmentsQuery = useCourseAssignmentsQuery(courseId);
  const feedQuery = useCourseFeedQuery(courseId);
  const calendarQuery = useCourseCalendarQuery(courseId);
  const progressQuery = useCourseStudentProgressQuery(courseId);

  const refreshing = courseQuery.isFetching || modulesQuery.isFetching || assignmentsQuery.isFetching;
  const hasError = courseQuery.error || modulesQuery.error || assignmentsQuery.error;
  const isLoading = courseQuery.isLoading;

  const onRefresh = async () => {
    await Promise.all([
      courseQuery.refetch(),
      modulesQuery.refetch(),
      assignmentsQuery.refetch(),
      feedQuery.refetch(),
      calendarQuery.refetch(),
      progressQuery.refetch(),
    ]);
  };

  const content = useMemo(() => {
    if (segment === "Resumen") {
      return (
        <ClayCard style={styles.card}>
          <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.title }]}>
            {courseQuery.data?.name ?? "Curso"}
          </Text>
          <Text style={[styles.code, { color: theme.colors.textMuted }]}>{courseQuery.data?.code}</Text>
          {!!courseQuery.data?.description && (
            <Text style={[styles.body, { color: theme.colors.textMuted }]}>{courseQuery.data.description}</Text>
          )}
          <StatusPill label={courseQuery.data?.status ?? "N/A"} tone="primary" />
          <View style={styles.actions}>
            <AppButton label="Módulos" onPress={() => router.push(`/(app)/courses/${courseId}/modules`)} />
            <AppButton label="Tareas" onPress={() => router.push(`/(app)/courses/${courseId}/assignments`)} variant="ghost" />
            <AppButton label="Feed" onPress={() => router.push(`/(app)/courses/${courseId}/feed`)} variant="ghost" />
            <AppButton label="Progreso" onPress={() => router.push(`/(app)/courses/${courseId}/progress`)} />
          </View>
        </ClayCard>
      );
    }

    if (segment === "Módulos") {
      if (!modulesQuery.data?.length) return <EmptyState title="Sin módulos visibles" subtitle="Tu docente aún no ha publicado módulos." />;
      return (
        <>
          {modulesQuery.data.slice(0, 4).map((module) => (
            <TouchableOpacity key={module.id} onPress={() => router.push(`/(app)/courses/${courseId}/modules/${module.id}`)}>
              <ClayCard style={styles.card}>
                <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{module.title}</Text>
                {!!module.description && <Text style={[styles.body, { color: theme.colors.textMuted }]}>{module.description}</Text>}
              </ClayCard>
            </TouchableOpacity>
          ))}
          <AppButton label="Ver todos los módulos" onPress={() => router.push(`/(app)/courses/${courseId}/modules`)} variant="ghost" />
        </>
      );
    }

    if (segment === "Tareas") {
      if (!assignmentsQuery.data?.length) return <EmptyState title="Sin tareas" subtitle="No hay tareas publicadas por ahora." />;
      return (
        <>
          {assignmentsQuery.data.slice(0, 5).map((assignment) => (
            <TouchableOpacity
              key={assignment.id}
              onPress={() => router.push({ pathname: "/(app)/assignments/[assignmentId]", params: { assignmentId: assignment.id, courseId } })}
            >
              <ClayCard style={styles.card}>
                <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{assignment.title}</Text>
                <Text style={[styles.body, { color: theme.colors.textMuted }]}>
                  Entrega: {formatDateTime(assignment.dueAt)} | Máx: {assignment.maxPoints}
                </Text>
              </ClayCard>
            </TouchableOpacity>
          ))}
          <AppButton label="Ver listado completo de tareas" onPress={() => router.push(`/(app)/courses/${courseId}/assignments`)} variant="ghost" />
        </>
      );
    }

    if (segment === "Feed") {
      if (!feedQuery.data?.length) return <EmptyState title="Sin publicaciones" subtitle="No hay anuncios o publicaciones aún." />;
      return (
        <>
          {!courseQuery.data?.allowComments && (
            <Text style={[styles.notice, { color: theme.colors.warning }]}>Este curso no permite comentarios.</Text>
          )}
          {feedQuery.data.slice(0, 4).map((post) => (
            <TouchableOpacity
              key={post.id}
              onPress={() =>
                router.push({
                  pathname: "/(app)/feed/[postId]/comments",
                  params: { postId: post.id, courseId },
                })
              }
            >
              <ClayCard style={styles.card}>
                <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.title }]}>
                  {post.title ?? "Publicación"}
                </Text>
                <Text numberOfLines={3} style={[styles.body, { color: theme.colors.textMuted }]}>
                  {post.content}
                </Text>
              </ClayCard>
            </TouchableOpacity>
          ))}
          <AppButton label="Ir al feed completo" onPress={() => router.push(`/(app)/courses/${courseId}/feed`)} variant="ghost" />
        </>
      );
    }

    if (segment === "Calendario") {
      if (!calendarQuery.data?.length) return <EmptyState title="Sin eventos del curso" />;
      return (
        <>
          {calendarQuery.data.map((item) => (
            <ClayCard key={item.id} style={styles.card}>
              <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{item.title}</Text>
              {!!item.description && <Text style={[styles.body, { color: theme.colors.textMuted }]}>{item.description}</Text>}
              <Text style={[styles.body, { color: theme.colors.textMuted }]}>
                {formatDateTime(item.startsAt)} - {formatDateTime(item.endsAt)}
              </Text>
            </ClayCard>
          ))}
        </>
      );
    }

    if (!progressQuery.data) return <EmptyState title="Sin datos de progreso" />;
    return (
      <ClayCard style={styles.card}>
        <Text style={[styles.body, { color: theme.colors.textMuted }]}>
          Tareas publicadas: {progressQuery.data.publishedAssignments}
        </Text>
        <Text style={[styles.body, { color: theme.colors.textMuted }]}>
          Tareas entregadas: {progressQuery.data.submittedAssignments}
        </Text>
        <Text style={[styles.body, { color: theme.colors.textMuted }]}>
          Tareas calificadas: {progressQuery.data.gradedAssignments}
        </Text>
        <Text style={[styles.progress, { color: theme.colors.primary, fontFamily: theme.typography.title }]}>
          Progreso: {progressQuery.data.progressPercent}%
        </Text>
      </ClayCard>
    );
  }, [
    segment,
    theme.colors.text,
    theme.colors.textMuted,
    theme.colors.warning,
    theme.colors.primary,
    theme.typography.title,
    courseQuery.data,
    modulesQuery.data,
    assignmentsQuery.data,
    feedQuery.data,
    calendarQuery.data,
    progressQuery.data,
    courseId,
  ]);

  return (
    <AppScreen
      title={courseQuery.data?.name ?? "Detalle del curso"}
      subtitle="Resumen, módulos, tareas, feed, calendario y progreso."
      refreshing={refreshing}
      onRefresh={onRefresh}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.segmentContainer}>
        {SEGMENTS.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setSegment(item)}
            style={[
              styles.segmentButton,
              {
                borderColor: theme.colors.border,
                backgroundColor: segment === item ? theme.colors.primarySoft : theme.colors.cardSoft,
              },
            ]}
          >
            <Text
              style={{
                color: segment === item ? theme.colors.primary : theme.colors.textMuted,
                fontFamily: theme.typography.title,
                fontSize: 13,
              }}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading && <LoadingState />}
      {hasError && <ErrorState error={hasError} onRetry={onRefresh} />}
      {!isLoading && !hasError && content}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  segmentContainer: {
    gap: 8,
    paddingBottom: 8,
  },
  segmentButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  card: {
    gap: 8,
  },
  title: {
    fontSize: 16,
  },
  code: {
    fontSize: 13,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    gap: 8,
    marginTop: 6,
  },
  notice: {
    fontSize: 12,
  },
  progress: {
    fontSize: 20,
    marginTop: 8,
  },
});
