import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { ClayCard } from "@/components/ClayCard";
import { FormField } from "@/components/FormField";
import { AppButton } from "@/components/AppButton";
import { formatDateTime } from "@/core/utils/date";
import { getErrorMessage } from "@/core/api/error";
import { useCourseDetailQuery } from "@/features/courses/hooks";
import { useCreateFeedCommentMutation, useFeedCommentsQuery } from "@/features/feed/hooks";
import { feedCommentSchema, FeedCommentFormValues } from "@/features/feed/schema";
import { useAppTheme } from "@/theme/ThemeProvider";

export default function FeedCommentsScreen() {
  const theme = useAppTheme();
  const params = useLocalSearchParams<{ postId: string; courseId?: string }>();
  const postId = Number(params.postId);
  const courseId = params.courseId ? Number(params.courseId) : undefined;
  const commentsQuery = useFeedCommentsQuery(postId);
  const commentMutation = useCreateFeedCommentMutation(postId, courseId);
  const courseQuery = useCourseDetailQuery(courseId ?? NaN);
  const canComment = courseQuery.data?.allowComments ?? true;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedCommentFormValues>({
    resolver: zodResolver(feedCommentSchema),
    defaultValues: { content: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!canComment) return;
    try {
      await commentMutation.mutateAsync(values);
      reset();
      Alert.alert("Listo", "Comentario enviado.");
      commentsQuery.refetch();
    } catch (error) {
      Alert.alert("No se pudo comentar", getErrorMessage(error));
    }
  });

  return (
    <AppScreen title="Comentarios" subtitle="Conversación del anuncio" refreshing={commentsQuery.isFetching} onRefresh={commentsQuery.refetch}>
      {commentsQuery.isLoading && <LoadingState />}
      {commentsQuery.error && <ErrorState error={commentsQuery.error} onRetry={commentsQuery.refetch} />}
      {!commentsQuery.isLoading && !commentsQuery.error && commentsQuery.data?.length === 0 && <EmptyState title="Sin comentarios aún" />}

      {commentsQuery.data?.map((comment) => (
        <ClayCard key={comment.id} style={styles.card}>
          <Text style={[styles.author, { color: theme.colors.text, fontFamily: theme.typography.title }]}>
            {comment.authorName ?? "Usuario"}
          </Text>
          <Text style={[styles.content, { color: theme.colors.text }]}>{comment.content}</Text>
          <Text style={[styles.meta, { color: theme.colors.textMuted }]}>{formatDateTime(comment.createdAt)}</Text>
        </ClayCard>
      ))}

      <View style={styles.form}>
        {!canComment && (
          <Text style={{ color: theme.colors.warning, fontSize: 12 }}>
            Los comentarios están deshabilitados en este curso.
          </Text>
        )}
        <Controller
          control={control}
          name="content"
          render={({ field }) => (
            <FormField
              label="Nuevo comentario"
              value={field.value}
              onChangeText={field.onChange}
              placeholder="Escribe tu comentario..."
              multiline
              error={errors.content?.message}
            />
          )}
        />
        <AppButton label="Enviar comentario" onPress={onSubmit} loading={commentMutation.isPending} disabled={!canComment} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 6,
  },
  author: {
    fontSize: 14,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
  },
  meta: {
    fontSize: 12,
  },
  form: {
    gap: 10,
    marginTop: 8,
  },
});
