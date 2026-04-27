import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useStudentCoursesQuery } from "@/features/courses/hooks";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { StatusPill } from "@/components/StatusPill";
import { useAppTheme } from "@/theme/ThemeProvider";
import { useResponsive } from "@/theme/useResponsive";

const palettes = [
  ["#DDECFF", "#F7FBFF"],
  ["#FFE7BC", "#FFF8EA"],
  ["#D7F6E7", "#F7FFF9"],
  ["#F8DBE9", "#FFF5F9"],
] as const;

const icons: Array<keyof typeof Ionicons.glyphMap> = ["calculator", "flask", "book", "planet"];

export default function CoursesListScreen() {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const { data, isLoading, isFetching, error, refetch } = useStudentCoursesQuery();

  return (
    <AppScreen title="Materias" refreshing={isFetching} onRefresh={refetch} compactHeader showAppLabel={false}>
      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={refetch} />}
      {!isLoading && !error && data?.length === 0 && <EmptyState title="Sin materias" />}

      <View style={[styles.grid, { flexDirection: responsive.isTablet ? "row" : "column", flexWrap: "wrap" }]}>
        {data?.map((course, index) => {
          const palette = palettes[index % palettes.length];
          const icon = icons[index % icons.length];

          return (
            <Pressable
              key={course.id}
              onPress={() => router.push(`/(app)/courses/${course.id}`)}
              style={[styles.itemWrap, responsive.isTablet && { width: responsive.isLargeTablet ? "49%" : "100%" }]}
            >
              <LinearGradient
                colors={palette}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.card, { borderColor: theme.colors.borderStrong }]}
              >
                <View style={styles.topRow}>
                  <View style={[styles.iconBubble, { backgroundColor: theme.colors.cardSoft }]}>
                    <Ionicons name={icon} size={30} color={theme.colors.primary} />
                  </View>
                  <StatusPill label={course.status} tone="primary" />
                </View>

                <Text style={[styles.name, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{course.name}</Text>
                <Text style={[styles.code, { color: theme.colors.primary }]}>{course.code}</Text>

                <View style={styles.tagsRow}>
                  <View style={[styles.tag, { backgroundColor: theme.colors.cardSoft, borderColor: theme.colors.border }]}>
                    <Text style={[styles.tagText, { color: theme.colors.textMuted }]}>Módulos</Text>
                  </View>
                  <View style={[styles.tag, { backgroundColor: theme.colors.cardSoft, borderColor: theme.colors.border }]}>
                    <Text style={[styles.tagText, { color: theme.colors.textMuted }]}>Tareas</Text>
                  </View>
                  <View style={[styles.tag, { backgroundColor: theme.colors.cardSoft, borderColor: theme.colors.border }]}>
                    <Text style={[styles.tagText, { color: theme.colors.textMuted }]}>Actividad</Text>
                  </View>
                </View>

                <View style={styles.footerRow}>
                  <Text style={[styles.footerText, { color: theme.colors.text }]}>Entrar</Text>
                  <Ionicons name="arrow-forward-circle" size={24} color={theme.colors.primary} />
                </View>
              </LinearGradient>
            </Pressable>
          );
        })}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 14,
    justifyContent: "space-between",
  },
  itemWrap: {
    width: "100%",
  },
  card: {
    borderWidth: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 38,
    padding: 18,
    minHeight: 240,
    gap: 12,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconBubble: {
    width: 64,
    height: 64,
    borderRadius: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 24,
    lineHeight: 30,
  },
  code: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 2,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "700",
  },
  footerRow: {
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
