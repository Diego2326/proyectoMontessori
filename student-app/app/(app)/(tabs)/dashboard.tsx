import React from "react";
import { ImageBackground, LayoutChangeEvent, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { ActivityFeedCard } from "@/components/ActivityFeedCard";
import { StatusPill } from "@/components/StatusPill";
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
  const actionBonus = 0;

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
  const [coursesPanelWidth, setCoursesPanelWidth] = React.useState(0);
  const showSideBySide = responsive.isTablet && responsive.width > responsive.height;
  const panelMaxHeight = showSideBySide ? Math.max(320, responsive.height - 280) : undefined;
  const courseGridGap = 12;
  const minimumCourseCardWidth = showSideBySide ? 248 : 220;
  const courseColumns = React.useMemo(() => {
    if (!coursesPanelWidth) return 1;
    return Math.max(1, Math.min(4, Math.floor((coursesPanelWidth + courseGridGap) / (minimumCourseCardWidth + courseGridGap))));
  }, [courseGridGap, coursesPanelWidth, minimumCourseCardWidth]);
  const courseItemWidth = React.useMemo(() => {
    if (!coursesPanelWidth) return undefined;
    return (coursesPanelWidth - courseGridGap * (courseColumns - 1)) / courseColumns;
  }, [courseColumns, courseGridGap, coursesPanelWidth]);

  const handleRefresh = () => {
    void Promise.all([homeQuery.refetch(), coursesQuery.refetch()]);
  };

  const handleCoursesPanelLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      const nextWidth = Math.round(event.nativeEvent.layout.width);
      setCoursesPanelWidth((current) => (current === nextWidth ? current : nextWidth));
    },
    [],
  );

  return (
    <AppScreen
      title=""
      refreshing={homeQuery.isFetching || coursesQuery.isFetching}
      onRefresh={handleRefresh}
      scroll={!showSideBySide}
      compactHeader
      showAppLabel={false}
      fullWidth
    >
      <View style={[styles.screenLayout, showSideBySide && styles.screenLayoutExpanded]}>
        <View style={[styles.dashboardGrid, { flexDirection: showSideBySide ? "row" : "column" }, showSideBySide && styles.dashboardGridExpanded]}>
          <View
            onLayout={handleCoursesPanelLayout}
            style={[styles.coursesPanel, showSideBySide ? styles.coursesPanelTablet : styles.coursesPanelMobile]}
          >
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Cursos</Text>
              <Text style={[styles.sectionMeta, { color: theme.colors.textSoft }]}>
                {coursesQuery.data?.length ?? 0} · {courseColumns} col
              </Text>
            </View>

            {coursesQuery.isLoading && <LoadingState />}
            {coursesQuery.error && <ErrorState error={coursesQuery.error} onRetry={coursesQuery.refetch} />}
            {!coursesQuery.isLoading && !coursesQuery.error && coursesQuery.data?.length === 0 && <EmptyState title="Sin materias" />}
            {!!coursesQuery.data?.length &&
              (showSideBySide ? (
                <ScrollView
                  nestedScrollEnabled
                  showsVerticalScrollIndicator
                  style={[styles.panelScroll, { maxHeight: panelMaxHeight }]}
                  contentContainerStyle={[styles.courseGrid, { gap: courseGridGap }]}
                >
                  {coursesQuery.data.map((course) => (
                    <View
                      key={course.id}
                      style={[
                        styles.courseGridItem,
                        courseItemWidth ? { width: courseItemWidth } : styles.courseGridItemFull,
                      ]}
                    >
                      <CourseListItem course={course} />
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View style={[styles.courseGrid, { gap: courseGridGap }]}>
                  {coursesQuery.data.map((course) => (
                    <View
                      key={course.id}
                      style={[
                        styles.courseGridItem,
                        courseItemWidth ? { width: courseItemWidth } : styles.courseGridItemFull,
                      ]}
                    >
                      <CourseListItem course={course} />
                    </View>
                  ))}
                </View>
              ))}
          </View>

          <View style={[styles.activityPanel, showSideBySide ? styles.activityPanelTablet : styles.activityPanelMobile]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Actividad reciente</Text>
              <Text style={[styles.sectionMeta, { color: theme.colors.textSoft }]}>{homeQuery.data?.length ?? 0}</Text>
            </View>

            {homeQuery.isLoading && <LoadingState />}
            {homeQuery.error && <ErrorState error={homeQuery.error} onRetry={homeQuery.refetch} />}
            {!homeQuery.isLoading && !homeQuery.error && homeQuery.data?.length === 0 && <EmptyState title="Sin actividad" />}

            {!!homeQuery.data?.length &&
              (showSideBySide ? (
              <ScrollView
                showsVerticalScrollIndicator
                style={[styles.panelScroll, { maxHeight: panelMaxHeight }]}
                contentContainerStyle={styles.feedColumn}
              >
                {homeQuery.data.map((item) => (
                  <ActivityFeedCard
                    key={item.id}
                    item={item}
                    height={estimateCardHeight(item, responsive.isTablet)}
                    showImages={false}
                    onCommentsPress={item.commentHref ? () => router.push(item.commentHref as never) : undefined}
                    onPress={item.actionHref ? () => router.push(item.actionHref as never) : undefined}
                  />
                ))}
              </ScrollView>
              ) : (
              <View style={styles.feedColumn}>
                {homeQuery.data.map((item) => (
                  <ActivityFeedCard
                    key={item.id}
                    item={item}
                    height={estimateCardHeight(item, responsive.isTablet)}
                    showImages={false}
                    onCommentsPress={item.commentHref ? () => router.push(item.commentHref as never) : undefined}
                    onPress={item.actionHref ? () => router.push(item.actionHref as never) : undefined}
                  />
                ))}
              </View>
              ))}
          </View>
        
      </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screenLayout: {
    width: "100%",
    gap: 14,
  },
  screenLayoutExpanded: {
    flex: 1,
  },
  dashboardGrid: {
    width: "100%",
    gap: 14,
    alignItems: "stretch",
  },
  dashboardGridExpanded: {
    flex: 1,
  },
  coursesPanel: {
    gap: 10,
  },
  coursesPanelTablet: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
  },
  coursesPanelMobile: {
    width: "100%",
  },
  activityPanel: {
    gap: 10,
  },
  activityPanelTablet: {
    width: 320,
    flexShrink: 0,
  },
  activityPanelMobile: {
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
  panelScroll: {
    width: "100%",
  },
  courseGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  courseGridItem: {
    flexShrink: 0,
  },
  courseGridItemFull: {
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
