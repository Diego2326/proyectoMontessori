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

const stories = [
  { id: "story-1", label: "Mate", icon: "calculator", tone: "sky" },
  { id: "story-2", label: "Lab", icon: "flask", tone: "mint" },
  { id: "story-3", label: "Avisos", icon: "megaphone", tone: "berry" },
  { id: "story-4", label: "Mañana", icon: "sunny", tone: "sun" },
] as const;

export default function StudentDashboardScreen() {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const { data, isLoading, isFetching, error, refetch } = useHomeFeedQuery();

  const topItems = data?.slice(0, 2) ?? [];
  const feedItems = data?.slice(2) ?? [];

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

      {!!topItems.length && (
        <View style={[styles.highlightGrid, { flexDirection: responsive.isTablet ? "row" : "column" }]}>
          {topItems.map((item) => (
            <View key={item.id} style={[styles.highlightCell, responsive.isTablet && { width: topItems.length > 1 ? "49%" : "100%" }]}>
              <ActivityFeedCard item={item} onPress={item.actionHref ? () => router.push(item.actionHref as never) : undefined} />
            </View>
          ))}
        </View>
      )}

      <View style={styles.feedHeader}>
        <Text style={[styles.feedTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Actividad reciente</Text>
      </View>

      <View style={styles.feedList}>
        {feedItems.map((item) => (
          <ActivityFeedCard key={item.id} item={item} onPress={item.actionHref ? () => router.push(item.actionHref as never) : undefined} />
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
  highlightGrid: {
    gap: 12,
    justifyContent: "space-between",
  },
  highlightCell: {
    width: "100%",
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
  feedList: {
    gap: 10,
  },
});
