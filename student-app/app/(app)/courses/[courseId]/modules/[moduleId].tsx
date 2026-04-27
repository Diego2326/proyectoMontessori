import React from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CourseShell } from "@/components/CourseShell";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { ClayCard } from "@/components/ClayCard";
import { useModuleDetailQuery, useModuleResourcesQuery } from "@/features/courses/hooks";
import { AppButton } from "@/components/AppButton";
import { useAppTheme } from "@/theme/ThemeProvider";

function resourceIcon(resourceType?: string): keyof typeof Ionicons.glyphMap {
  const value = resourceType?.toLowerCase() ?? "";
  if (value.includes("video")) return "videocam";
  if (value.includes("link")) return "link";
  if (value.includes("pdf") || value.includes("doc")) return "document-text";
  return "book";
}

export default function ModuleDetailScreen() {
  const params = useLocalSearchParams<{ courseId: string; moduleId: string }>();
  const courseId = Number(params.courseId);
  const moduleId = Number(params.moduleId);
  const theme = useAppTheme();
  const moduleQuery = useModuleDetailQuery(moduleId);
  const resourcesQuery = useModuleResourcesQuery(moduleId);

  return (
    <CourseShell
      courseId={courseId}
      activeSection="modules"
      title={moduleQuery.data?.title ?? "Detalle de módulo"}
      refreshing={moduleQuery.isFetching || resourcesQuery.isFetching}
      onRefresh={() => Promise.all([moduleQuery.refetch(), resourcesQuery.refetch()])}
    >
      {(moduleQuery.isLoading || resourcesQuery.isLoading) && <LoadingState />}
      {(moduleQuery.error || resourcesQuery.error) && (
        <ErrorState error={moduleQuery.error ?? resourcesQuery.error} onRetry={() => Promise.all([moduleQuery.refetch(), resourcesQuery.refetch()])} />
      )}

      {!moduleQuery.isLoading && !resourcesQuery.isLoading && (
        <>
          {!!moduleQuery.data?.description && (
            <ClayCard>
              <Text style={[styles.description, { color: theme.colors.textMuted }]}>{moduleQuery.data.description}</Text>
            </ClayCard>
          )}
          {!resourcesQuery.data?.length && <EmptyState title="Sin recursos" />}
          {resourcesQuery.data?.map((resource) => (
            <ClayCard key={resource.id} style={styles.card}>
              <View style={styles.head}>
                <View style={[styles.iconBubble, { backgroundColor: theme.colors.primarySoft }]}>
                  <Ionicons name={resourceIcon(resource.resourceType)} size={18} color={theme.colors.primary} />
                </View>
                <View style={styles.headCopy}>
                  <Text style={[styles.meta, { color: theme.colors.primary }]}>{resource.resourceType}</Text>
                  <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{resource.title}</Text>
                </View>
              </View>
              {!!resource.description && (
                <Text numberOfLines={2} style={[styles.description, { color: theme.colors.textMuted }]}>
                  {resource.description}
                </Text>
              )}
              {!!resource.contentText && (
                <View style={[styles.textReader, { borderColor: theme.colors.border, backgroundColor: theme.colors.cardSoft }]}>
                  <Text numberOfLines={6} style={{ color: theme.colors.text }}>
                    {resource.contentText}
                  </Text>
                </View>
              )}
              {!!resource.contentUrl && (
                <AppButton label="Abrir" icon="open-outline" onPress={() => Linking.openURL(resource.contentUrl!)} variant="ghost" />
              )}
            </ClayCard>
          ))}
        </>
      )}
    </CourseShell>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
  },
  head: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  iconBubble: {
    width: 42,
    height: 42,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  headCopy: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  meta: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  textReader: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },
});
