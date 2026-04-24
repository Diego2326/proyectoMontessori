import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { ClayCard } from "@/components/ClayCard";
import { useCourseModulesQuery } from "@/features/courses/hooks";
import { useAppTheme } from "@/theme/ThemeProvider";

export default function CourseModulesScreen() {
  const params = useLocalSearchParams<{ courseId: string }>();
  const courseId = Number(params.courseId);
  const theme = useAppTheme();
  const { data, isLoading, isFetching, error, refetch } = useCourseModulesQuery(courseId);

  return (
    <AppScreen title="Módulos del curso" subtitle="Solo verás módulos habilitados para ti." refreshing={isFetching} onRefresh={refetch}>
      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}
      {!isLoading && !error && data?.length === 0 && <EmptyState title="Sin módulos disponibles" />}
      {data?.map((module) => (
        <TouchableOpacity key={module.id} onPress={() => router.push(`/(app)/courses/${courseId}/modules/${module.id}`)}>
          <ClayCard style={styles.card}>
            <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{module.title}</Text>
            {!!module.description && <Text style={[styles.description, { color: theme.colors.textMuted }]}>{module.description}</Text>}
          </ClayCard>
        </TouchableOpacity>
      ))}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 6,
  },
  title: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});
