import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCourseDetailQuery, useCourseModulesQuery } from "@/features/courses/hooks";
import { useCourseAssignmentsQuery } from "@/features/assignments/hooks";
import { useCourseFeedQuery } from "@/features/feed/hooks";
import { useCourseCalendarQuery } from "@/features/calendar/hooks";
import { useCourseStudentProgressQuery } from "@/features/progress/hooks";
import { CourseShell } from "@/components/CourseShell";
import { ClayCard } from "@/components/ClayCard";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { AppButton } from "@/components/AppButton";
import { formatDateTime } from "@/core/utils/date";
import { StatusPill } from "@/components/StatusPill";
import { useAppTheme } from "@/theme/ThemeProvider";
import { useResponsive } from "@/theme/useResponsive";
import { getReadableAccentColor } from "@/theme/colorUtils";

const QUICK_ACTIONS = [
  { key: "modules", label: "Módulos", icon: "layers", href: "modules" },
  { key: "assignments", label: "Tareas", icon: "create", href: "assignments" },
  { key: "feed", label: "Actividad", icon: "sparkles", href: "feed" },
  { key: "calendar", label: "Agenda", icon: "calendar", href: "calendar" },
  { key: "progress", label: "Progreso", icon: "stats-chart", href: "progress" },
] as const;

function InfoChip({ label, value }: { label: string; value: string | number }) {
  const theme = useAppTheme();

  return (
    <View style={[styles.infoChip, { backgroundColor: theme.colors.cardSoft, borderColor: theme.colors.border }]}>
      <Text style={[styles.infoLabel, { color: theme.colors.textSoft }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{value}</Text>
    </View>
  );
}

function QuickActionTile({
  label,
  icon,
  onPress,
  fullWidth,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  fullWidth: boolean;
}) {
  const theme = useAppTheme();
  const iconColor = getReadableAccentColor(theme.colors.primary, theme.colors.primarySoft, theme.colors.text);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickAction,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.borderStrong,
          opacity: pressed ? 0.88 : 1,
          width: fullWidth ? "100%" : "48.5%",
        },
      ]}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.primarySoft }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={[styles.quickActionLabel, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{label}</Text>
    </Pressable>
  );
}

function PreviewCard({
  eyebrow,
  title,
  detail,
  icon,
  onPress,
}: {
  eyebrow: string;
  title: string;
  detail?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  const theme = useAppTheme();
  const previewIconColor = getReadableAccentColor(theme.colors.primary, theme.colors.surfaceStrong, theme.colors.text);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.88 : 1 }]}>
      <ClayCard style={styles.previewCard}>
        <View style={styles.previewTop}>
          <View style={[styles.previewIcon, { backgroundColor: theme.colors.surfaceStrong }]}>
            <Ionicons name={icon} size={18} color={previewIconColor} />
          </View>
          <Text style={[styles.previewEyebrow, { color: theme.colors.primary }]}>{eyebrow}</Text>
        </View>
        <Text style={[styles.previewTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{title}</Text>
        {!!detail && (
          <Text numberOfLines={2} style={[styles.previewDetail, { color: theme.colors.textMuted }]}>
            {detail}
          </Text>
        )}
      </ClayCard>
    </Pressable>
  );
}

export default function CourseDetailScreen() {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const params = useLocalSearchParams<{ courseId: string }>();
  const courseId = Number(params.courseId);

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

  const sortedModules = useMemo(
    () => [...(modulesQuery.data ?? [])].sort((left, right) => left.position - right.position),
    [modulesQuery.data],
  );
  const sortedAssignments = useMemo(
    () =>
      [...(assignmentsQuery.data ?? [])].sort((left, right) => {
        if (!left.dueAt) return 1;
        if (!right.dueAt) return -1;
        return new Date(left.dueAt).getTime() - new Date(right.dueAt).getTime();
      }),
    [assignmentsQuery.data],
  );
  const sortedEvents = useMemo(
    () =>
      [...(calendarQuery.data ?? [])].sort((left, right) => new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime()),
    [calendarQuery.data],
  );
  const sortedPosts = useMemo(
    () =>
      [...(feedQuery.data ?? [])].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()),
    [feedQuery.data],
  );

  const nextModule = sortedModules[0];
  const nextAssignment = sortedAssignments[0];
  const nextEvent = sortedEvents[0];
  const latestPost = sortedPosts[0];
  const kickerInk = getReadableAccentColor(theme.colors.primary, theme.colors.primarySoft, theme.colors.text);

  return (
    <CourseShell
      courseId={courseId}
      activeSection="overview"
      title={courseQuery.data?.name ?? "Materia"}
      subtitle={courseQuery.data?.code}
      refreshing={refreshing}
      onRefresh={onRefresh}
    >
      {isLoading && <LoadingState />}
      {hasError && <ErrorState error={hasError} onRetry={onRefresh} />}

      {!isLoading && !hasError && (
        <>
          <ClayCard style={styles.heroCard}>
            <View style={styles.heroTop}>
              <View style={[styles.kicker, { backgroundColor: theme.colors.primarySoft }]}>
                <Ionicons name="sparkles" size={16} color={kickerInk} />
                <Text style={[styles.kickerText, { color: kickerInk }]}>Ahora en esta materia</Text>
              </View>
              <StatusPill label={courseQuery.data?.status ?? "Activo"} tone="primary" />
            </View>

            {!!courseQuery.data?.description && (
              <Text numberOfLines={2} style={[styles.body, { color: theme.colors.textMuted }]}>
                {courseQuery.data.description}
              </Text>
            )}

            <View style={styles.infoRow}>
              <InfoChip label="Módulos" value={sortedModules.length} />
              <InfoChip label="Tareas" value={sortedAssignments.length} />
              <InfoChip label="Avance" value={progressQuery.data ? `${progressQuery.data.progressPercent}%` : "-"} />
            </View>
          </ClayCard>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Entrar rápido</Text>
            <View style={styles.quickActionsWrap}>
              {QUICK_ACTIONS.map((action) => (
                <QuickActionTile
                  key={action.key}
                  label={action.label}
                  icon={action.icon}
                  fullWidth={responsive.isLargeTablet && action.key === "progress"}
                  onPress={() => router.push(`/(app)/courses/${courseId}/${action.href}`)}
                />
              ))}
            </View>
          </View>

          {(nextAssignment || nextModule || nextEvent || latestPost) && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Sigue por aquí</Text>
              <View style={[styles.previewGrid, { flexDirection: responsive.isTablet ? "row" : "column", flexWrap: "wrap" }]}>
                {!!nextAssignment && (
                  <View style={[styles.previewWrap, responsive.isTablet && { width: responsive.isLargeTablet ? "49%" : "100%" }]}>
                    <PreviewCard
                      eyebrow="Tarea"
                      title={nextAssignment.title}
                      detail={`Entrega ${formatDateTime(nextAssignment.dueAt)}`}
                      icon="create"
                      onPress={() =>
                        router.push({
                          pathname: "/(app)/assignments/[assignmentId]",
                          params: { assignmentId: nextAssignment.id, courseId },
                        })
                      }
                    />
                  </View>
                )}

                {!!nextModule && (
                  <View style={[styles.previewWrap, responsive.isTablet && { width: responsive.isLargeTablet ? "49%" : "100%" }]}>
                    <PreviewCard
                      eyebrow={`Módulo ${nextModule.position}`}
                      title={nextModule.title}
                      detail={nextModule.description}
                      icon="layers"
                      onPress={() => router.push(`/(app)/courses/${courseId}/modules/${nextModule.id}`)}
                    />
                  </View>
                )}

                {!!nextEvent && (
                  <View style={[styles.previewWrap, responsive.isTablet && { width: responsive.isLargeTablet ? "49%" : "100%" }]}>
                    <PreviewCard
                      eyebrow="Agenda"
                      title={nextEvent.title}
                      detail={formatDateTime(nextEvent.startsAt)}
                      icon="calendar"
                      onPress={() => router.push(`/(app)/courses/${courseId}/calendar`)}
                    />
                  </View>
                )}

                {!!latestPost && (
                  <View style={[styles.previewWrap, responsive.isTablet && { width: responsive.isLargeTablet ? "49%" : "100%" }]}>
                    <PreviewCard
                      eyebrow={courseQuery.data?.allowComments ? "Actividad" : "Aviso"}
                      title={latestPost.title ?? "Publicación"}
                      detail={latestPost.content}
                      icon="sparkles"
                      onPress={() =>
                        router.push({
                          pathname: "/(app)/feed/[postId]/comments",
                          params: { postId: latestPost.id, courseId },
                        })
                      }
                    />
                  </View>
                )}
              </View>
            </View>
          )}

          {!!sortedAssignments.length && (
            <View style={styles.section}>
              <View style={styles.sectionHead}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Próximas tareas</Text>
                <AppButton
                  label="Ver todas"
                  icon="arrow-forward"
                  variant="ghost"
                  style={styles.inlineButton}
                  onPress={() => router.push(`/(app)/courses/${courseId}/assignments`)}
                />
              </View>
              {sortedAssignments.slice(0, 3).map((assignment) => (
                <Pressable
                  key={assignment.id}
                  onPress={() =>
                    router.push({
                      pathname: "/(app)/assignments/[assignmentId]",
                      params: { assignmentId: assignment.id, courseId },
                    })
                  }
                  style={({ pressed }) => [{ opacity: pressed ? 0.88 : 1 }]}
                >
                  <ClayCard style={styles.listCard}>
                    <Text style={[styles.listTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{assignment.title}</Text>
                    <Text style={[styles.listMeta, { color: theme.colors.textMuted }]}>
                      {formatDateTime(assignment.dueAt)} · {assignment.maxPoints} pts
                    </Text>
                  </ClayCard>
                </Pressable>
              ))}
            </View>
          )}

          {!!sortedModules.length && (
            <View style={styles.section}>
              <View style={styles.sectionHead}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Módulos</Text>
                <AppButton
                  label="Abrir"
                  icon="arrow-forward"
                  variant="ghost"
                  style={styles.inlineButton}
                  onPress={() => router.push(`/(app)/courses/${courseId}/modules`)}
                />
              </View>
              {sortedModules.slice(0, 3).map((module) => (
                <Pressable
                  key={module.id}
                  onPress={() => router.push(`/(app)/courses/${courseId}/modules/${module.id}`)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.88 : 1 }]}
                >
                  <ClayCard style={styles.listCard}>
                    <Text style={[styles.previewEyebrow, { color: theme.colors.primary }]}>Módulo {module.position}</Text>
                    <Text style={[styles.listTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{module.title}</Text>
                  </ClayCard>
                </Pressable>
              ))}
            </View>
          )}

          {!sortedAssignments.length && !sortedModules.length && !sortedPosts.length && !sortedEvents.length && <EmptyState title="Sin movimiento" />}
        </>
      )}
    </CourseShell>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    gap: 14,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  kicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  kickerText: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  code: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  infoChip: {
    minWidth: 104,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 2,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 18,
  },
  section: {
    gap: 10,
  },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 24,
  },
  quickActionsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  quickAction: {
    width: "48.5%",
    minHeight: 112,
    borderWidth: 1,
    borderRadius: 22,
    padding: 14,
    justifyContent: "space-between",
  },
  quickActionIcon: {
    width: 42,
    height: 42,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionLabel: {
    fontSize: 17,
  },
  previewGrid: {
    gap: 12,
    justifyContent: "space-between",
  },
  previewWrap: {
    width: "100%",
  },
  previewCard: {
    gap: 8,
  },
  previewTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  previewIcon: {
    width: 32,
    height: 32,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  previewEyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  previewTitle: {
    fontSize: 17,
    lineHeight: 22,
  },
  previewDetail: {
    fontSize: 14,
    lineHeight: 20,
  },
  listCard: {
    gap: 6,
  },
  listTitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  listMeta: {
    fontSize: 13,
  },
  inlineButton: {
    minHeight: 42,
    paddingHorizontal: 14,
  },
});
