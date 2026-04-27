import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCalendarQuery } from "@/features/calendar/hooks";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { ClayCard } from "@/components/ClayCard";
import { formatDate, formatDateTime } from "@/core/utils/date";
import { CalendarEventDto } from "@/types/dto";
import { useAppTheme } from "@/theme/ThemeProvider";
import { useResponsive } from "@/theme/useResponsive";
import { getReadableAccentColor } from "@/theme/colorUtils";

export default function CalendarScreen() {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const dayInk = getReadableAccentColor(theme.colors.primary, theme.colors.surfaceStrong, theme.colors.text);
  const timeInk = getReadableAccentColor(theme.colors.primary, theme.colors.primarySoft, theme.colors.text);
  const { data, isLoading, isFetching, error, refetch } = useCalendarQuery();
  const grouped = (data ?? []).reduce<Record<string, CalendarEventDto[]>>((acc, event) => {
    const key = event.startsAt ? event.startsAt.slice(0, 10) : "unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {});

  return (
    <AppScreen title="Agenda" refreshing={isFetching} onRefresh={refetch} compactHeader showAppLabel={false}>
      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}
      {!isLoading && !error && data?.length === 0 && <EmptyState title="Sin eventos" />}

      {Object.entries(grouped).map(([date, events]) => (
        <View key={date} style={styles.group}>
          <View style={styles.dayHeader}>
            <View style={[styles.dayBubble, { backgroundColor: theme.colors.surfaceStrong }]}>
              <Ionicons name="sunny" size={18} color={dayInk} />
            </View>
            <Text style={[styles.groupTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{formatDate(date)}</Text>
          </View>

          <View style={styles.timeline}>
            <View style={[styles.rail, { backgroundColor: theme.colors.borderStrong }]} />
            <View style={[styles.eventsWrap, { flexDirection: responsive.isTablet ? "row" : "column", flexWrap: "wrap" }]}>
              {events.map((event) => (
                <View key={event.id} style={[styles.eventItem, responsive.isTablet && { width: responsive.isLargeTablet ? "49%" : "100%" }]}>
                  <ClayCard style={styles.eventCard}>
                    <View style={styles.eventTop}>
                      <View style={[styles.timeBubble, { backgroundColor: theme.colors.primarySoft }]}>
                        <Ionicons name="time" size={16} color={timeInk} />
                        <Text style={[styles.timeText, { color: timeInk }]}>{formatDateTime(event.startsAt)}</Text>
                      </View>
                    </View>
                    <Text style={[styles.eventTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{event.title}</Text>
                    {!!event.description && <Text style={[styles.eventBody, { color: theme.colors.textMuted }]}>{event.description}</Text>}
                    {!!event.courseId && <Text style={[styles.courseTag, { color: theme.colors.accent }]}>Curso #{event.courseId}</Text>}
                    <Text
                      onPress={() =>
                        Alert.alert(event.title, `${event.description ?? "Sin descripción"}\n\n${formatDateTime(event.startsAt)} - ${formatDateTime(event.endsAt)}`)
                      }
                      style={[styles.link, { color: theme.colors.primary }]}
                    >
                      Ver más
                    </Text>
                  </ClayCard>
                </View>
              ))}
            </View>
          </View>
        </View>
      ))}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 10,
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dayBubble: {
    width: 42,
    height: 42,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  groupTitle: {
    fontSize: 24,
  },
  timeline: {
    flexDirection: "row",
    gap: 14,
  },
  rail: {
    width: 4,
    borderRadius: 4,
  },
  eventsWrap: {
    flex: 1,
    gap: 12,
    justifyContent: "space-between",
  },
  eventItem: {
    width: "100%",
  },
  eventCard: {
    gap: 10,
    minHeight: 190,
  },
  eventTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeBubble: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  timeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  eventTitle: {
    fontSize: 20,
    lineHeight: 26,
  },
  eventBody: {
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
  courseTag: {
    fontSize: 13,
    fontWeight: "700",
  },
  link: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: "auto",
  },
});
