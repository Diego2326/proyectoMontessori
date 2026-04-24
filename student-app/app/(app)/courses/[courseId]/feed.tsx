import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { ClayCard } from "@/components/ClayCard";
import { useCourseDetailQuery } from "@/features/courses/hooks";
import { useCourseFeedQuery } from "@/features/feed/hooks";
import { formatDateTime } from "@/core/utils/date";
import { useAppTheme } from "@/theme/ThemeProvider";

export default function FeedScreen() {
  const params = useLocalSearchParams<{ courseId: string }>();
  const courseId = Number(params.courseId);
  const theme = useAppTheme();
  const feedQuery = useCourseFeedQuery(courseId);
  const courseQuery = useCourseDetailQuery(courseId);

  return (
    <AppScreen
      title="Feed del curso"
      subtitle={courseQuery.data?.allowComments ? "Publicaciones y comentarios activos." : "Publicaciones activas sin comentarios."}
      refreshing={feedQuery.isFetching}
      onRefresh={feedQuery.refetch}
    >
      {feedQuery.isLoading && <LoadingState />}
      {feedQuery.error && <ErrorState error={feedQuery.error} onRetry={feedQuery.refetch} />}
      {!feedQuery.isLoading && !feedQuery.error && feedQuery.data?.length === 0 && <EmptyState title="Sin publicaciones por ahora" />}
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
            <Text style={[styles.content, { color: theme.colors.text }]}>{post.content}</Text>
            <Text style={[styles.meta, { color: theme.colors.textMuted }]}>
              {post.authorName ?? "Docente"} · {formatDateTime(post.createdAt)}
            </Text>
          </ClayCard>
        </TouchableOpacity>
      ))}
    </AppScreen>
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
