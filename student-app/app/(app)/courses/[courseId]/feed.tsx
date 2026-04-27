import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { CourseShell } from "@/components/CourseShell";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { ClayCard } from "@/components/ClayCard";
import { useCourseFeedQuery } from "@/features/feed/hooks";
import { formatDateTime } from "@/core/utils/date";
import { useAppTheme } from "@/theme/ThemeProvider";

export default function FeedScreen() {
  const params = useLocalSearchParams<{ courseId: string }>();
  const courseId = Number(params.courseId);
  const theme = useAppTheme();
  const feedQuery = useCourseFeedQuery(courseId);

  return (
    <CourseShell courseId={courseId} activeSection="feed" title="Actividad" refreshing={feedQuery.isFetching} onRefresh={feedQuery.refetch}>
      {feedQuery.isLoading && <LoadingState />}
      {feedQuery.error && <ErrorState error={feedQuery.error} onRetry={feedQuery.refetch} />}
      {!feedQuery.isLoading && !feedQuery.error && feedQuery.data?.length === 0 && <EmptyState title="Sin publicaciones" />}
      {feedQuery.data?.map((post) => (
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
            <Text numberOfLines={4} style={[styles.content, { color: theme.colors.text }]}>
              {post.content}
            </Text>
            <Text style={[styles.meta, { color: theme.colors.textMuted }]}>
              {post.authorName ?? "Docente"} · {formatDateTime(post.createdAt)}
            </Text>
          </ClayCard>
        </TouchableOpacity>
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
  content: {
    fontSize: 14,
    lineHeight: 20,
  },
  meta: {
    fontSize: 12,
  },
});
