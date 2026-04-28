import React from "react";
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { ActivityFeedCard } from "@/components/ActivityFeedCard";
import { ClayCard } from "@/components/ClayCard";
import { StatusPill } from "@/components/StatusPill";
import { StudentLogo } from "@/components/StudentLogo";
import { getCourseArtwork } from "@/features/courses/courseArtwork";
import { useStudentCoursesQuery } from "@/features/courses/hooks";
import { useHomeFeedQuery } from "@/features/home/hooks";
import { useAppTheme } from "@/theme/ThemeProvider";
import { useResponsive } from "@/theme/useResponsive";
import { CourseDto, HomeActivityDto } from "@/types/dto";

function estimateCardHeight(item: HomeActivityDto, isTablet: boolean) {
  const baseHeight = isTablet ? 194 : 182;
  const bodyBonus = item.body.length > 96 ? 34 : item.body.length > 64 ? 18 : 0;
  const attachmentBonus = (item.attachments?.filter((attachment) => attachment.type === "document").length ?? 0) > 0 ? 8 : 0;
  const actionBonus = item.actionLabel ? 8 : 0;

  return baseHeight + bodyBonus + attachmentBonus + actionBonus;
}

function CourseListItem({ course }: { course: CourseDto }) {
  const theme = useAppTheme();
  const artwork = getCourseArtwork(course, "card");

  return (
    <Pressable
      onPress={() => router.push(`/(app)/courses/${course.id}`)}
      style={({ pressed }) => [{ opacity: pressed ? 0.94 : 1 }, styles.courseItemWrap]}
    >
      <View style={[styles.courseCardShell, { borderColor: theme.colors.borderStrong, shadowColor: theme.colors.shadow }]}>
        <ImageBackground source={{ uri: artwork.imageUrl }} resizeMode="cover" style={styles.courseImageFill}>
          <LinearGradient
            colors={["rgba(10, 18, 28, 0.14)", "rgba(10, 18, 28, 0.28)", "rgba(10, 18, 28, 0.82)"]}
            locations={[0, 0.45, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.courseCard}
          >
            <View style={styles.courseTopRow}>
              <View style={[styles.courseIconBubble, { backgroundColor: "rgba(255,255,255,0.9)" }]}>
                <Ionicons name={artwork.icon} size={24} color={artwork.accent} />
              </View>
              <StatusPill label={course.status} tone="primary" />
            </View>

            <Text numberOfLines={2} style={[styles.courseName, { color: "#FFFFFF", fontFamily: theme.typography.title }]}>
              {course.name}
            </Text>
            <Text numberOfLines={1} style={[styles.courseCode, { color: "rgba(255,255,255,0.88)" }]}>
              {course.code}
            </Text>

            <View style={styles.courseTagsRow}>
              <View style={[styles.courseTag, styles.courseTagGlass]}>
                <Text style={[styles.courseTagText, { color: "#FFFFFF" }]}>Módulos</Text>
              </View>
              <View style={[styles.courseTag, styles.courseTagGlass]}>
                <Text style={[styles.courseTagText, { color: "#FFFFFF" }]}>Tareas</Text>
              </View>
              <View style={[styles.courseTag, styles.courseTagGlass]}>
                <Text style={[styles.courseTagText, { color: "#FFFFFF" }]}>Actividad</Text>
              </View>
            </View>

            <View style={styles.courseFooterRow}>
              <Text style={[styles.courseFooterText, { color: "#FFFFFF" }]}>Entrar</Text>
              <Ionicons name="arrow-forward-circle" size={22} color="#FFFFFF" />
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    </Pressable>
  );
}

export default function StudentDashboardScreen() {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const homeQuery = useHomeFeedQuery();
  const coursesQuery = useStudentCoursesQuery();
  const coursePanelMaxHeight = responsive.isTablet ? Math.max(320, responsive.height - 280) : undefined;

  const handleRefresh = () => {
    void Promise.all([homeQuery.refetch(), coursesQuery.refetch()]);
  };

  return (
    <AppScreen
      title="Para ti"
      refreshing={homeQuery.isFetching || coursesQuery.isFetching}
      onRefresh={handleRefresh}
      compactHeader
      showAppLabel={false}
    >
      <ClayCard style={styles.introCard}>
        <View style={[styles.introRow, { flexDirection: responsive.isTablet ? "row" : "column" }]}>
          <StudentLogo size={responsive.isTablet ? 60 : 54} />
          <View style={styles.introCopy}>
            <Text style={[styles.introTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>
              Un panel más limpio para seguir tus clases.
            </Text>
            <Text style={[styles.introBody, { color: theme.colors.textMuted }]}>
              Cursos a la vista y actividad reciente en una sola columna.
            </Text>
          </View>
        </View>
      </ClayCard>

      <View style={[styles.dashboardGrid, { flexDirection: responsive.isTablet ? "row" : "column" }]}>
        <View style={[styles.sidebar, responsive.isTablet ? styles.sidebarTablet : styles.sidebarMobile]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Cursos</Text>
            <Text style={[styles.sectionMeta, { color: theme.colors.textSoft }]}>{coursesQuery.data?.length ?? 0}</Text>
          </View>

          {coursesQuery.isLoading && <LoadingState />}
          {coursesQuery.error && <ErrorState error={coursesQuery.error} onRetry={coursesQuery.refetch} />}
          {!coursesQuery.isLoading && !coursesQuery.error && coursesQuery.data?.length === 0 && <EmptyState title="Sin materias" />}
          {!!coursesQuery.data?.length && (
            <ScrollView
              nestedScrollEnabled
              scrollEnabled={responsive.isTablet}
              showsVerticalScrollIndicator={responsive.isTablet}
              style={responsive.isTablet ? [styles.courseListScroll, { maxHeight: coursePanelMaxHeight }] : undefined}
              contentContainerStyle={styles.courseList}
            >
              {coursesQuery.data.map((course) => (
                <CourseListItem key={course.id} course={course} />
              ))}
            </ScrollView>
          )}
        </View>

        <View style={[styles.feedPanel, responsive.isTablet ? styles.feedPanelTablet : styles.feedPanelMobile]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Actividad reciente</Text>
            <Text style={[styles.sectionMeta, { color: theme.colors.textSoft }]}>{homeQuery.data?.length ?? 0}</Text>
          </View>

          {homeQuery.isLoading && <LoadingState />}
          {homeQuery.error && <ErrorState error={homeQuery.error} onRetry={homeQuery.refetch} />}
          {!homeQuery.isLoading && !homeQuery.error && homeQuery.data?.length === 0 && <EmptyState title="Sin actividad" />}

          {!!homeQuery.data?.length && (
            <View style={styles.feedColumn}>
              {homeQuery.data.map((item) => (
                <ActivityFeedCard
                  key={item.id}
                  item={item}
                  height={estimateCardHeight(item, responsive.isTablet)}
                  showImages={false}
                  onPress={item.actionHref ? () => router.push(item.actionHref as never) : undefined}
                />
              ))}
            </View>
          )}
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  introCard: {
    gap: 8,
    paddingVertical: 10,
  },
  introRow: {
    gap: 12,
    alignItems: "center",
  },
  introCopy: {
    flex: 1,
    gap: 4,
  },
  introTitle: {
    fontSize: 17,
    lineHeight: 22,
  },
  introBody: {
    fontSize: 13,
    lineHeight: 18,
  },
  dashboardGrid: {
    gap: 14,
    alignItems: "flex-start",
  },
  sidebar: {
    gap: 10,
  },
  sidebarTablet: {
    width: 320,
    flexShrink: 0,
  },
  sidebarMobile: {
    width: "100%",
  },
  feedPanel: {
    flex: 1,
    gap: 10,
  },
  feedPanelTablet: {
    minWidth: 0,
  },
  feedPanelMobile: {
    width: "100%",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
  },
  sectionMeta: {
    fontSize: 12,
    fontWeight: "700",
  },
  courseList: {
    gap: 10,
  },
  courseListScroll: {
    width: "100%",
  },
  courseItemWrap: {
    width: "100%",
  },
  courseCardShell: {
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
  courseImageFill: {
    minHeight: 212,
  },
  courseCard: {
    minHeight: 212,
    padding: 16,
    gap: 10,
  },
  courseTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  courseIconBubble: {
    width: 52,
    height: 52,
    borderRadius: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  courseName: {
    fontSize: 20,
    lineHeight: 24,
  },
  courseCode: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  courseTagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  courseTag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  courseTagGlass: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderColor: "rgba(255,255,255,0.22)",
  },
  courseTagText: {
    fontSize: 12,
    fontWeight: "700",
  },
  courseFooterRow: {
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  courseFooterText: {
    fontSize: 14,
    fontWeight: "700",
  },
  feedColumn: {
    gap: 12,
  },
});
