import React from "react";
import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useStudentCoursesQuery } from "@/features/courses/hooks";
import { getCourseArtwork } from "@/features/courses/courseArtwork";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { StatusPill } from "@/components/StatusPill";
import { useAppTheme } from "@/theme/ThemeProvider";
import { useResponsive } from "@/theme/useResponsive";

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
        {data?.map((course) => {
          const artwork = getCourseArtwork(course, "card");

          return (
            <Pressable
              key={course.id}
              onPress={() => router.push(`/(app)/courses/${course.id}`)}
              style={[styles.itemWrap, responsive.isTablet && { width: responsive.isLargeTablet ? "49%" : "100%" }]}
            >
              <View style={[styles.cardShell, { borderColor: theme.colors.borderStrong, shadowColor: theme.colors.shadow }]}>
                <ImageBackground source={{ uri: artwork.imageUrl }} resizeMode="cover" style={styles.imageFill}>
                  <LinearGradient
                    colors={["rgba(10, 18, 28, 0.14)", "rgba(10, 18, 28, 0.28)", "rgba(10, 18, 28, 0.82)"]}
                    locations={[0, 0.45, 1]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.card}
                  >
                    <View style={styles.topRow}>
                      <View style={[styles.iconBubble, { backgroundColor: "rgba(255,255,255,0.9)" }]}>
                        <Ionicons name={artwork.icon} size={30} color={artwork.accent} />
                      </View>
                      <StatusPill label={course.status} tone="primary" />
                    </View>

                    <Text style={[styles.name, { color: "#FFFFFF", fontFamily: theme.typography.title }]}>{course.name}</Text>
                    <Text style={[styles.code, { color: "rgba(255,255,255,0.88)" }]}>{course.code}</Text>

                    <View style={styles.tagsRow}>
                      <View style={[styles.tag, styles.tagGlass]}>
                        <Text style={[styles.tagText, { color: "#FFFFFF" }]}>Módulos</Text>
                      </View>
                      <View style={[styles.tag, styles.tagGlass]}>
                        <Text style={[styles.tagText, { color: "#FFFFFF" }]}>Tareas</Text>
                      </View>
                      <View style={[styles.tag, styles.tagGlass]}>
                        <Text style={[styles.tagText, { color: "#FFFFFF" }]}>Actividad</Text>
                      </View>
                    </View>

                    <View style={styles.footerRow}>
                      <Text style={[styles.footerText, { color: "#FFFFFF" }]}>Entrar</Text>
                      <Ionicons name="arrow-forward-circle" size={24} color="#FFFFFF" />
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </View>
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
  cardShell: {
    borderWidth: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 38,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  imageFill: {
    minHeight: 240,
  },
  card: {
    padding: 18,
    minHeight: 240,
    gap: 12,
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
  tagGlass: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderColor: "rgba(255,255,255,0.22)",
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
