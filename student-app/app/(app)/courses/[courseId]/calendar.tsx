import React from "react";
import { StyleSheet, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { CourseShell } from "@/components/CourseShell";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { ClayCard } from "@/components/ClayCard";
import { useCourseCalendarQuery } from "@/features/calendar/hooks";
import { formatDateTime } from "@/core/utils/date";
import { useAppTheme } from "@/theme/ThemeProvider";

export default function CourseCalendarScreen() {
  const params = useLocalSearchParams<{ courseId: string }>();
  const courseId = Number(params.courseId);
  const theme = useAppTheme();
  const { data, isLoading, isFetching, error, refetch } = useCourseCalendarQuery(courseId);
  const sortedEvents = [...(data ?? [])].sort((left, right) => new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime());

  return (
    <CourseShell courseId={courseId} activeSection="calendar" title="Agenda" refreshing={isFetching} onRefresh={refetch}>
      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}
      {!isLoading && !error && sortedEvents.length === 0 && <EmptyState title="Sin eventos" />}

      {sortedEvents.map((event) => (
        <ClayCard key={event.id} style={styles.card}>
          <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{event.title}</Text>
          {!!event.description && <Text style={[styles.body, { color: theme.colors.textMuted }]}>{event.description}</Text>}
          <Text style={[styles.meta, { color: theme.colors.primary }]}>{formatDateTime(event.startsAt)}</Text>
          <Text style={[styles.body, { color: theme.colors.textMuted }]}>{formatDateTime(event.endsAt)}</Text>
        </ClayCard>
      ))}
    </CourseShell>
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
  meta: {
    fontSize: 13,
    fontWeight: "800",
  },
});
