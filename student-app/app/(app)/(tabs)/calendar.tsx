import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCalendarQuery } from "@/features/calendar/hooks";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { ClayCard } from "@/components/ClayCard";
import { formatDate, formatDateTime } from "@/core/utils/date";
import { CalendarEventDto } from "@/types/dto";
import { useAppTheme } from "@/theme/ThemeProvider";

export default function CalendarScreen() {
  const theme = useAppTheme();
  const { data, isLoading, isFetching, error, refetch } = useCalendarQuery();
  const grouped = (data ?? []).reduce<Record<string, CalendarEventDto[]>>((acc, event) => {
    const key = event.startsAt ? event.startsAt.slice(0, 10) : "unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {});

  return (
    <AppScreen title="Calendario" subtitle="Eventos académicos globales y por curso." refreshing={isFetching} onRefresh={refetch}>
      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}
      {!isLoading && !error && data?.length === 0 && (
        <EmptyState title="Sin eventos programados" subtitle="Cuando haya actividades, las verás aquí." />
      )}
      {Object.entries(grouped).map(([date, events]) => (
        <View key={date} style={styles.group}>
          <Text style={[styles.groupTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{formatDate(date)}</Text>
          {events.map((event) => (
            <TouchableOpacity
              key={event.id}
              onPress={() => Alert.alert(event.title, `${event.description ?? "Sin descripción"}\n\n${formatDateTime(event.startsAt)} - ${formatDateTime(event.endsAt)}`)}
            >
              <ClayCard style={styles.eventCard}>
                <Text style={[styles.eventTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{event.title}</Text>
                <Text style={[styles.eventTime, { color: theme.colors.textMuted }]}>
                  {formatDateTime(event.startsAt)} - {formatDateTime(event.endsAt)}
                </Text>
                {!!event.courseId && <Text style={[styles.courseTag, { color: theme.colors.primary }]}>Curso #{event.courseId}</Text>}
              </ClayCard>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 8,
  },
  groupTitle: {
    fontSize: 17,
    marginTop: 6,
  },
  eventCard: {
    gap: 6,
  },
  eventTitle: {
    fontSize: 15,
  },
  eventTime: {
    fontSize: 13,
  },
  courseTag: {
    fontSize: 12,
    fontWeight: "700",
  },
});
