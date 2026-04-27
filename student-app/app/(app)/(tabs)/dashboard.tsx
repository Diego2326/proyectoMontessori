import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { ActivityFeedCard } from "@/components/ActivityFeedCard";
import { ClayCard } from "@/components/ClayCard";
import { StudentLogo } from "@/components/StudentLogo";
import { useAppTheme } from "@/theme/ThemeProvider";
import { useResponsive } from "@/theme/useResponsive";
import { useHomeFeedQuery } from "@/features/home/hooks";
import { HomeActivityDto } from "@/types/dto";

const stories = [
  { id: "story-1", label: "Mate", icon: "calculator", tone: "sky" },
  { id: "story-2", label: "Lab", icon: "flask", tone: "mint" },
  { id: "story-3", label: "Avisos", icon: "megaphone", tone: "berry" },
  { id: "story-4", label: "Mañana", icon: "sunny", tone: "sun" },
] as const;

interface MasonryEntry {
  item: HomeActivityDto;
  height: number;
}

function isSameCalendarDay(left: string, right: Date) {
  const value = new Date(left);

  return (
    value.getFullYear() === right.getFullYear() &&
    value.getMonth() === right.getMonth() &&
    value.getDate() === right.getDate()
  );
}

function estimateCardHeight(item: HomeActivityDto, index: number, isTablet: boolean) {
  const pattern = isTablet ? [318, 272, 296, 258] : [278, 232, 256, 218];
  const imageBonus = item.attachments?.some((attachment) => attachment.type === "image") ? 18 : -10;
  const bodyBonus = item.body.length > 80 ? 16 : item.body.length > 48 ? 8 : 0;
  const courseBonus = item.courseName ? 0 : -6;

  return pattern[index % pattern.length] + imageBonus + bodyBonus + courseBonus;
}

function buildMasonryColumns(items: HomeActivityDto[], isTablet: boolean) {
  const left: MasonryEntry[] = [];
  const right: MasonryEntry[] = [];
  let leftHeight = 0;
  let rightHeight = 0;

  items.forEach((item, index) => {
    const height = estimateCardHeight(item, index, isTablet);
    const entry = { item, height };

    if (leftHeight <= rightHeight) {
      left.push(entry);
      leftHeight += height + 16;
    } else {
      right.push(entry);
      rightHeight += height + 16;
    }
  });

  return [left, right] as const;
}

export default function StudentDashboardScreen() {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const { data, isLoading, isFetching, error, refetch } = useHomeFeedQuery();
  const today = React.useMemo(() => new Date(), []);
  const columns = React.useMemo(() => buildMasonryColumns(data ?? [], responsive.isTablet), [data, responsive.isTablet]);
  const featuredItems = React.useMemo(
    () =>
      (data ?? [])
        .filter((item) => item.type === "announcement" || (item.type === "event" && isSameCalendarDay(item.createdAt, today)))
        .slice(0, 8),
    [data, today],
  );

  return (
    <AppScreen
      title="Para ti"
      refreshing={isFetching}
      onRefresh={refetch}
      compactHeader
      showAppLabel={false}
    >
      <ClayCard style={styles.introCard}>
        <View style={[styles.introRow, { flexDirection: responsive.isTablet ? "row" : "column" }]}>
          <StudentLogo size={responsive.isTablet ? 64 : 58} />
          <View style={styles.introCopy}>
            <Text style={[styles.introTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>
              Lo nuevo de tus clases.
            </Text>
          </View>
        </View>
      </ClayCard>

      <View style={styles.storySection}>
        <View style={styles.storyHeader}>
          <Text style={[styles.storyTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Historias del día</Text>
          <Text style={[styles.storyHint, { color: theme.colors.textSoft }]}>destacados</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storyRail}>
          {stories.map((story) => (
            <View key={story.id} style={styles.storyItem}>
              <View
                style={[
                  styles.storyBubble,
                  {
                    backgroundColor:
                      story.tone === "sky"
                        ? theme.colors.primarySoft
                        : story.tone === "mint"
                          ? `${theme.colors.success}22`
                          : story.tone === "berry"
                            ? `${theme.colors.danger}16`
                            : `${theme.colors.accent}20`,
                  },
                ]}
              >
                <Ionicons name={story.icon} size={22} color={theme.colors.primary} />
              </View>
              <Text style={[styles.storyLabel, { color: theme.colors.text }]}>{story.label}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}
      {!isLoading && !error && data?.length === 0 && <EmptyState title="Sin actividad" />}

      {!!featuredItems.length && (
        <View style={styles.featuredSection}>
          <View style={styles.feedHeader}>
            <Text style={[styles.feedTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Destacados</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredRail}>
            {featuredItems.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.featuredCardWrap,
                  {
                    width: responsive.isTablet ? 344 : 286,
                  },
                ]}
              >
                <ActivityFeedCard
                  item={item}
                  height={responsive.isTablet ? (index % 2 === 0 ? 266 : 244) : 228}
                  onPress={item.actionHref ? () => router.push(item.actionHref as never) : undefined}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.feedHeader}>
        <Text style={[styles.feedTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Actividad reciente</Text>
      </View>

      <View style={styles.masonryRow}>
        {columns.map((column, columnIndex) => (
          <View key={`column-${columnIndex}`} style={styles.masonryColumn}>
            {column.map(({ item, height }) => (
              <ActivityFeedCard
                key={item.id}
                item={item}
                height={height}
                onPress={item.actionHref ? () => router.push(item.actionHref as never) : undefined}
              />
            ))}
          </View>
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  introCard: {
    gap: 8,
    paddingVertical: 8,
  },
  introRow: {
    gap: 12,
    alignItems: "center",
  },
  introCopy: {
    flex: 1,
  },
  introTitle: {
    fontSize: 17,
    lineHeight: 22,
  },
  feedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
  },
  feedTitle: {
    fontSize: 20,
  },
  feedHint: {
    fontSize: 12,
  },
  storySection: {
    gap: 10,
  },
  storyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  storyTitle: {
    fontSize: 18,
  },
  storyHint: {
    fontSize: 11,
    textTransform: "uppercase",
  },
  storyRail: {
    gap: 12,
    paddingRight: 10,
  },
  storyItem: {
    gap: 8,
    alignItems: "center",
    width: 76,
  },
  storyBubble: {
    width: 68,
    height: 68,
    borderRadius: 68,
    alignItems: "center",
    justifyContent: "center",
  },
  storyLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  featuredSection: {
    gap: 10,
  },
  featuredRail: {
    gap: 12,
    paddingRight: 8,
  },
  featuredCardWrap: {
    flexShrink: 0,
  },
  masonryRow: {
    flexDirection: "row",
    gap: 12,
  },
  masonryColumn: {
    flex: 1,
    gap: 16,
  },
});
