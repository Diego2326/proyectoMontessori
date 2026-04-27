import React, { PropsWithChildren } from "react";
import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { AppScreen } from "@/components/AppScreen";
import { ClayCard } from "@/components/ClayCard";
import { StudentLogo } from "@/components/StudentLogo";
import { StatusPill } from "@/components/StatusPill";
import { useCourseDetailQuery } from "@/features/courses/hooks";
import { getCourseArtwork } from "@/features/courses/courseArtwork";
import { useCourseStudentProgressQuery } from "@/features/progress/hooks";
import { useAppTheme } from "@/theme/ThemeProvider";
import { useResponsive } from "@/theme/useResponsive";
import { getReadableAccentColor } from "@/theme/colorUtils";

type CourseSectionKey = "overview" | "modules" | "assignments" | "feed" | "calendar" | "progress";

interface CourseShellProps extends PropsWithChildren {
  courseId: number;
  activeSection: CourseSectionKey;
  title: string;
  subtitle?: string;
  refreshing?: boolean;
  onRefresh?: () => void;
}

const SECTION_ITEMS: Array<{
  key: CourseSectionKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  buildHref: (courseId: number) => string;
}> = [
  { key: "overview", label: "Resumen", icon: "home", buildHref: (courseId) => `/(app)/courses/${courseId}` },
  { key: "modules", label: "Módulos", icon: "layers", buildHref: (courseId) => `/(app)/courses/${courseId}/modules` },
  { key: "assignments", label: "Tareas", icon: "create", buildHref: (courseId) => `/(app)/courses/${courseId}/assignments` },
  { key: "feed", label: "Actividad", icon: "sparkles", buildHref: (courseId) => `/(app)/courses/${courseId}/feed` },
  { key: "calendar", label: "Agenda", icon: "calendar", buildHref: (courseId) => `/(app)/courses/${courseId}/calendar` },
  { key: "progress", label: "Progreso", icon: "stats-chart", buildHref: (courseId) => `/(app)/courses/${courseId}/progress` },
];

export function CourseShell({
  courseId,
  activeSection,
  title,
  subtitle,
  refreshing,
  onRefresh,
  children,
}: CourseShellProps) {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const courseQuery = useCourseDetailQuery(courseId);
  const progressQuery = useCourseStudentProgressQuery(courseId);
  const activeNavInk = getReadableAccentColor(theme.colors.primary, theme.colors.primarySoft, theme.colors.text);
  const activeBubbleInk = getReadableAccentColor(theme.colors.primary, theme.colors.surfaceStrong, theme.colors.text);
  const artwork = getCourseArtwork(courseQuery.data ?? { id: courseId }, "hero");

  return (
    <AppScreen
      title={title}
      subtitle={subtitle ?? courseQuery.data?.name}
      refreshing={refreshing}
      onRefresh={onRefresh}
      compactHeader
      showAppLabel={false}
    >
      <View style={[styles.layout, { flexDirection: responsive.isTablet ? "row" : "column", gap: responsive.isTablet ? 18 : 12 }]}>
        <View style={[styles.sidebarWrap, responsive.isTablet && { width: responsive.isLargeTablet ? 320 : 288 }]}>
          <ClayCard style={styles.sidebar}>
            <Pressable
              onPress={() => router.replace("/(app)/(tabs)/courses")}
              style={({ pressed }) => [
                styles.backToCourses,
                {
                  backgroundColor: theme.colors.cardSoft,
                  borderColor: theme.colors.border,
                  opacity: pressed ? 0.88 : 1,
                },
              ]}
            >
              <Ionicons name="grid" size={16} color={theme.colors.primary} />
              <Text style={[styles.backToCoursesLabel, { color: theme.colors.text }]}>Todas las materias</Text>
            </Pressable>

            <View style={[styles.courseHeroFrame, { borderColor: theme.colors.borderStrong }]}>
              <ImageBackground source={{ uri: artwork.imageUrl }} resizeMode="cover" style={styles.courseHero}>
                <LinearGradient
                  colors={["rgba(10, 18, 28, 0.12)", "rgba(10, 18, 28, 0.34)", "rgba(10, 18, 28, 0.82)"]}
                  locations={[0, 0.45, 1]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.courseHeroOverlay}
                >
                  <View style={styles.courseHeroTop}>
                    <View style={styles.courseLogoBubble}>
                      <StudentLogo size={responsive.isTablet ? 62 : 54} />
                    </View>
                    <StatusPill label={courseQuery.data?.status ?? "Activo"} tone="primary" />
                  </View>
                  <View style={styles.courseHeroCopy}>
                    <Text style={[styles.courseName, { color: "#FFFFFF", fontFamily: theme.typography.title }]}>
                      {courseQuery.data?.name ?? "Materia"}
                    </Text>
                    <Text style={[styles.courseCode, { color: "rgba(255,255,255,0.86)" }]}>{courseQuery.data?.code ?? "Curso"}</Text>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </View>

            <View style={styles.metricRow}>
              <View style={[styles.metricCard, { backgroundColor: theme.colors.cardSoft, borderColor: theme.colors.border }]}>
                <Text style={[styles.metricValue, { color: theme.colors.text, fontFamily: theme.typography.title }]}>
                  {progressQuery.data ? `${progressQuery.data.progressPercent}%` : "-"}
                </Text>
                <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>avance</Text>
              </View>
              <View style={[styles.metricCard, { backgroundColor: theme.colors.cardSoft, borderColor: theme.colors.border }]}>
                <Text style={[styles.metricValue, { color: theme.colors.text, fontFamily: theme.typography.title }]}>
                  {progressQuery.data?.submittedAssignments ?? "-"}
                </Text>
                <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>entregadas</Text>
              </View>
            </View>

            <View style={styles.navGroup}>
              {SECTION_ITEMS.map((item) => {
                const active = item.key === activeSection;
                return (
                  <Pressable
                    key={item.key}
                    onPress={() => router.replace(item.buildHref(courseId) as never)}
                    style={({ pressed }) => [
                      styles.navItem,
                      {
                        backgroundColor: active ? theme.colors.primarySoft : theme.colors.cardSoft,
                        borderColor: active ? theme.colors.primary : theme.colors.border,
                        opacity: pressed ? 0.88 : 1,
                      },
                    ]}
                  >
                    <View style={[styles.navIcon, { backgroundColor: active ? theme.colors.surfaceStrong : theme.colors.surface }]}>
                      <Ionicons name={item.icon} size={18} color={active ? activeBubbleInk : theme.colors.primary} />
                    </View>
                    <Text style={[styles.navLabel, { color: active ? activeNavInk : theme.colors.text, fontFamily: theme.typography.title }]}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ClayCard>
        </View>

        <View style={styles.main}>{children}</View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  layout: {
    alignItems: "flex-start",
  },
  sidebarWrap: {
    width: "100%",
  },
  sidebar: {
    gap: 14,
  },
  backToCourses: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
  },
  backToCoursesLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
  courseHeroFrame: {
    borderWidth: 1,
    borderRadius: 26,
    overflow: "hidden",
  },
  courseHero: {
    minHeight: 196,
  },
  courseHeroOverlay: {
    flex: 1,
    gap: 10,
    justifyContent: "space-between",
    padding: 14,
  },
  courseLogoBubble: {
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: 999,
    padding: 6,
    alignSelf: "flex-start",
  },
  courseHeroTop: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  courseHeroCopy: {
    gap: 4,
  },
  courseName: {
    fontSize: 22,
    lineHeight: 28,
  },
  courseCode: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  metricRow: {
    flexDirection: "row",
    gap: 10,
  },
  metricCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 2,
  },
  metricValue: {
    fontSize: 20,
  },
  metricLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    fontWeight: "700",
  },
  navGroup: {
    gap: 10,
  },
  navItem: {
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  navIcon: {
    width: 38,
    height: 38,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  navLabel: {
    fontSize: 16,
  },
  main: {
    flex: 1,
    width: "100%",
    gap: 12,
  },
});
