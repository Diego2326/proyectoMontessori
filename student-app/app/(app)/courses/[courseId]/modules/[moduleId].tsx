import React from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { ClayCard } from "@/components/ClayCard";
import { useModuleDetailQuery, useModuleResourcesQuery } from "@/features/courses/hooks";
import { AppButton } from "@/components/AppButton";
import { useAppTheme } from "@/theme/ThemeProvider";

export default function ModuleDetailScreen() {
  const params = useLocalSearchParams<{ moduleId: string }>();
  const moduleId = Number(params.moduleId);
  const theme = useAppTheme();
  const moduleQuery = useModuleDetailQuery(moduleId);
  const resourcesQuery = useModuleResourcesQuery(moduleId);

  return (
    <AppScreen
      title={moduleQuery.data?.title ?? "Detalle de módulo"}
      subtitle="Recursos de aprendizaje"
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
              <Text style={{ color: theme.colors.textMuted }}>{moduleQuery.data.description}</Text>
            </ClayCard>
          )}
          {!resourcesQuery.data?.length && <EmptyState title="Sin recursos en este módulo" />}
          {resourcesQuery.data?.map((resource) => (
            <ClayCard key={resource.id} style={styles.card}>
              <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{resource.title}</Text>
              {!!resource.description && <Text style={[styles.description, { color: theme.colors.textMuted }]}>{resource.description}</Text>}
              <Text style={[styles.meta, { color: theme.colors.primary }]}>Tipo: {resource.resourceType}</Text>
              {!!resource.contentText && (
                <View style={[styles.textReader, { borderColor: theme.colors.border, backgroundColor: theme.colors.cardSoft }]}>
                  <Text style={{ color: theme.colors.text }}>{resource.contentText}</Text>
                </View>
              )}
              {!!resource.contentUrl && (
                <AppButton label="Abrir recurso externo" onPress={() => Linking.openURL(resource.contentUrl!)} variant="ghost" />
              )}
            </ClayCard>
          ))}
        </>
      )}
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
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  meta: {
    fontSize: 12,
    fontWeight: "700",
  },
  textReader: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },
});
