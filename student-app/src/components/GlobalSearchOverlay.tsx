import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ClayCard } from "@/components/ClayCard";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { useStudentCoursesQuery } from "@/features/courses/hooks";
import { useHomeFeedQuery } from "@/features/home/hooks";
import { useAppTheme } from "@/theme/ThemeProvider";
import { useResponsive } from "@/theme/useResponsive";

interface GlobalSearchOverlayProps {
  visible: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  href: string;
}

const QUICK_LINKS: SearchResult[] = [
  { id: "quick-courses", title: "Cursos", subtitle: "Ir al listado de materias", eyebrow: "Acceso rapido", href: "/(app)/(tabs)/courses" },
  { id: "quick-calendar", title: "Agenda", subtitle: "Ver eventos y actividades", eyebrow: "Acceso rapido", href: "/(app)/(tabs)/calendar" },
  { id: "quick-notifications", title: "Avisos", subtitle: "Abrir notificaciones", eyebrow: "Acceso rapido", href: "/(app)/(tabs)/notifications" },
  { id: "quick-grades", title: "Notas", subtitle: "Abrir calificaciones", eyebrow: "Acceso rapido", href: "/(app)/grades" },
  { id: "quick-progress", title: "Progreso", subtitle: "Ver avance general", eyebrow: "Acceso rapido", href: "/(app)/progress" },
  { id: "quick-profile", title: "Perfil", subtitle: "Abrir ajustes y cuenta", eyebrow: "Acceso rapido", href: "/(app)/profile" },
];

function normalizeValue(value: string) {
  return value.trim().toLowerCase();
}

export function GlobalSearchOverlay({ visible, onClose }: GlobalSearchOverlayProps) {
  const theme = useAppTheme();
  const responsive = useResponsive();
  const coursesQuery = useStudentCoursesQuery();
  const homeQuery = useHomeFeedQuery();
  const [query, setQuery] = React.useState("");
  const deferredQuery = React.useDeferredValue(normalizeValue(query));

  React.useEffect(() => {
    if (!visible) {
      setQuery("");
    }
  }, [visible]);

  const openHref = (href: string) => {
    onClose();
    router.push(href as never);
  };

  const courseResults = React.useMemo(() => {
    if (!deferredQuery) return [] as SearchResult[];
    return (coursesQuery.data ?? [])
      .filter((course) => [course.name, course.code, course.description].some((value) => value?.toLowerCase().includes(deferredQuery)))
      .map((course) => ({
        id: `course-${course.id}`,
        title: course.name,
        subtitle: course.code,
        eyebrow: "Curso",
        href: `/(app)/courses/${course.id}`,
      }));
  }, [coursesQuery.data, deferredQuery]);

  const activityResults = React.useMemo(() => {
    if (!deferredQuery) return [] as SearchResult[];
    return (homeQuery.data ?? [])
      .filter((item) =>
        [item.title, item.body, item.courseName, item.moduleName, item.authorName].some((value) => value?.toLowerCase().includes(deferredQuery))
      )
      .filter((item) => Boolean(item.actionHref))
      .map((item) => ({
        id: item.id,
        title: item.title,
        subtitle: item.courseName ?? item.body,
        eyebrow:
          item.type === "assignment"
            ? "Tarea"
            : item.type === "material"
              ? "Material"
              : item.type === "event"
                ? "Evento"
                : item.type === "announcement"
                  ? "Publicacion"
                  : item.type === "grade"
                    ? "Revision"
                    : "Recordatorio",
        href: item.actionHref!,
      }));
  }, [deferredQuery, homeQuery.data]);

  const quickLinks = React.useMemo(() => {
    if (!deferredQuery) return QUICK_LINKS;
    return QUICK_LINKS.filter((item) => [item.title, item.subtitle, item.eyebrow].some((value) => value.toLowerCase().includes(deferredQuery)));
  }, [deferredQuery]);

  const hasQuery = deferredQuery.length > 0;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View
          style={[
            styles.modalCard,
            {
              backgroundColor: theme.colors.cardSoft,
              borderColor: theme.colors.borderStrong,
              width: responsive.isTablet ? 720 : "100%",
            },
          ]}
        >
          <View style={[styles.searchField, { backgroundColor: theme.colors.card, borderColor: theme.colors.borderStrong }]}>
            <Ionicons name="search" size={18} color={theme.colors.textSoft} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar cursos, tareas, avisos..."
              placeholderTextColor={theme.colors.textSoft}
              style={[styles.searchInput, { color: theme.colors.text }]}
              autoFocus
              returnKeyType="search"
            />
            {!!query && (
              <Pressable onPress={() => setQuery("")}>
                <Ionicons name="close-circle" size={18} color={theme.colors.textSoft} />
              </Pressable>
            )}
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={18} color={theme.colors.primary} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {(coursesQuery.isLoading || homeQuery.isLoading) && <LoadingState />}
            {(coursesQuery.error || homeQuery.error) && <ErrorState error={coursesQuery.error ?? homeQuery.error} />}

            {!coursesQuery.isLoading && !homeQuery.isLoading && !coursesQuery.error && !homeQuery.error && (
              <>
                {!hasQuery && (
                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Accesos</Text>
                    {quickLinks.map((item) => (
                      <Pressable key={item.id} onPress={() => openHref(item.href)}>
                        <ClayCard style={styles.resultCard}>
                          <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>{item.eyebrow}</Text>
                          <Text style={[styles.resultTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{item.title}</Text>
                          <Text style={[styles.resultSubtitle, { color: theme.colors.textMuted }]}>{item.subtitle}</Text>
                        </ClayCard>
                      </Pressable>
                    ))}
                  </View>
                )}

                {hasQuery && (
                  <>
                    {!!courseResults.length && (
                      <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Cursos</Text>
                        {courseResults.map((item) => (
                          <Pressable key={item.id} onPress={() => openHref(item.href)}>
                            <ClayCard style={styles.resultCard}>
                              <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>{item.eyebrow}</Text>
                              <Text style={[styles.resultTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{item.title}</Text>
                              <Text style={[styles.resultSubtitle, { color: theme.colors.textMuted }]}>{item.subtitle}</Text>
                            </ClayCard>
                          </Pressable>
                        ))}
                      </View>
                    )}

                    {!!activityResults.length && (
                      <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>Actividad</Text>
                        {activityResults.map((item) => (
                          <Pressable key={item.id} onPress={() => openHref(item.href)}>
                            <ClayCard style={styles.resultCard}>
                              <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>{item.eyebrow}</Text>
                              <Text style={[styles.resultTitle, { color: theme.colors.text, fontFamily: theme.typography.title }]}>{item.title}</Text>
                              <Text numberOfLines={2} style={[styles.resultSubtitle, { color: theme.colors.textMuted }]}>{item.subtitle}</Text>
                            </ClayCard>
                          </Pressable>
                        ))}
                      </View>
                    )}

                    {!courseResults.length && !activityResults.length && <EmptyState title="Sin resultados" subtitle={`No encontre coincidencias para "${query.trim()}".`} />}
                  </>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 18,
    paddingTop: 82,
    paddingBottom: 28,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 18, 28, 0.34)",
  },
  modalCard: {
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 26,
    padding: 14,
    gap: 14,
    maxHeight: "82%",
  },
  searchField: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  content: {
    gap: 12,
    paddingBottom: 8,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 20,
  },
  resultCard: {
    gap: 6,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  resultTitle: {
    fontSize: 16,
    lineHeight: 20,
  },
  resultSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
});
