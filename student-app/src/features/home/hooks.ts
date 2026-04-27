import { useQuery } from "@tanstack/react-query";
import { authedRequest } from "@/core/api/authedRequest";
import { getOptionalStudentId } from "@/core/auth/session";
import {
  AcademicModuleDto,
  CalendarEventDto,
  ContentResourceDto,
  CourseDto,
  FeedPostDto,
  GradeRecordDto,
  HomeActivityAttachmentDto,
  HomeActivityDto,
  LmsAssignmentDto,
  NotificationDto,
} from "@/types/dto";

export const homeKeys = {
  feed: (studentId: number | null) => ["home", "feed", studentId] as const,
};

function buildNotificationActivity(item: NotificationDto): HomeActivityDto {
  const type =
    item.type === "ASSIGNMENT"
      ? "assignment"
      : item.type === "GRADE"
        ? "grade"
        : item.type === "REMINDER"
          ? "reminder"
          : "announcement";

  return {
    id: `notification-${item.id}`,
    type,
    title: item.title,
    body: item.message,
    createdAt: item.createdAt,
    authorName: "Campus Montessori",
    authorRole: "Sistema",
    likes: 0,
    comments: 0,
  };
}

function buildImageAttachment(id: string, title: string, previewTone: HomeActivityAttachmentDto["previewTone"]): HomeActivityAttachmentDto {
  return {
    id,
    type: "image",
    title,
    subtitle: "Vista previa",
    previewTone,
  };
}

function buildDocumentAttachment(
  id: string,
  title: string,
  fileLabel: string,
  previewTone: HomeActivityAttachmentDto["previewTone"]
): HomeActivityAttachmentDto {
  return {
    id,
    type: "document",
    title,
    subtitle: "Documento adjunto",
    fileLabel,
    previewTone,
  };
}

export function useHomeFeedQuery() {
  const studentId = getOptionalStudentId();

  return useQuery({
    queryKey: homeKeys.feed(studentId),
    enabled: Number.isFinite(studentId),
    queryFn: async () => {
      const [courses, notifications, calendar, grades] = await Promise.all([
        authedRequest<CourseDto[]>(`/students/${studentId}/courses`),
        authedRequest<NotificationDto[]>("/notifications"),
        authedRequest<CalendarEventDto[]>("/calendar"),
        authedRequest<GradeRecordDto[]>(`/students/${studentId}/grades`),
      ]);

      const byCourse = await Promise.all(
        courses.map(async (course) => {
          const [feed, assignments, modules] = await Promise.all([
            authedRequest<FeedPostDto[]>(`/courses/${course.id}/feed`),
            authedRequest<LmsAssignmentDto[]>(`/courses/${course.id}/assignments`),
            authedRequest<AcademicModuleDto[]>(`/courses/${course.id}/modules`),
          ]);

          const resourcesPerModule = await Promise.all(
            modules.map(async (module) => ({
              module,
              resources: await authedRequest<ContentResourceDto[]>(`/modules/${module.id}/resources`),
            }))
          );

          return { course, feed, assignments, modules, resourcesPerModule };
        })
      );

      const activities: HomeActivityDto[] = [];

      notifications.forEach((item) => {
        activities.push(buildNotificationActivity(item));
      });

      grades.forEach((grade) => {
        activities.push({
          id: `grade-${grade.id}`,
          type: "grade",
          title: `Tu tarea #${grade.assignmentId} ya fue revisada`,
          body: grade.feedback ? `Recibiste ${grade.score} puntos. ${grade.feedback}` : `Recibiste ${grade.score} puntos.`,
          createdAt: grade.gradedAt,
          authorName: "Prof. del curso",
          authorRole: "Docente",
          actionLabel: "Ver notas",
          actionHref: "/(app)/grades",
          likes: 3,
          comments: 1,
          attachments: [buildDocumentAttachment(`grade-file-${grade.id}`, "Rúbrica y retroalimentación", "PDF", "mint")],
        });
      });

      calendar.forEach((event) => {
        const course = courses.find((item) => item.id === event.courseId);
        activities.push({
          id: `event-${event.id}`,
          type: "event",
          title: event.title,
          body: event.description ?? "Tienes una actividad programada.",
          createdAt: event.startsAt,
          authorName: course ? course.name : "Agenda del cole",
          authorRole: course ? "Curso" : "Colegio",
          courseId: event.courseId,
          courseName: course?.name,
          actionLabel: "Abrir agenda",
          actionHref: "/(app)/(tabs)/calendar",
          likes: 8,
          comments: 0,
          attachments: [buildImageAttachment(`event-${event.id}-poster`, "Afiche de la actividad", "sun")],
        });
      });

      byCourse.forEach(({ course, feed, assignments, resourcesPerModule }) => {
        feed.forEach((post) => {
          activities.push({
            id: `feed-${post.id}`,
            type: "announcement",
            title: post.title ?? `Nueva publicación en ${course.name}`,
            body: post.content,
            createdAt: post.createdAt,
            authorName: post.authorName ?? "Docente",
            authorRole: "Docente",
            courseId: course.id,
            courseName: course.name,
            actionLabel: "Ver curso",
            actionHref: `/(app)/courses/${course.id}`,
            likes: 14,
            comments: 4,
            attachments: [buildImageAttachment(`feed-${post.id}-cover`, `Foto para ${course.name}`, "sky")],
          });
        });

        assignments.forEach((assignment) => {
          activities.push({
            id: `assignment-${assignment.id}`,
            type: "assignment",
            title: `Nueva tarea en ${course.name}`,
            body: assignment.title,
            createdAt: assignment.publishedAt ?? assignment.dueAt ?? course.updatedAt,
            authorName: course.name,
            authorRole: "Clase",
            courseId: course.id,
            courseName: course.name,
            actionLabel: "Abrir tarea",
            actionHref: `/(app)/courses/${course.id}`,
            likes: 11,
            comments: 2,
            attachments: [
              buildDocumentAttachment(`assignment-${assignment.id}-guide`, "Guía de trabajo", "DOC", "berry"),
              buildDocumentAttachment(`assignment-${assignment.id}-rubric`, "Rúbrica", "PDF", "sun"),
            ],
          });
        });

        resourcesPerModule.forEach(({ module, resources }) => {
          resources.forEach((resource) => {
            activities.push({
              id: `resource-${resource.id}`,
              type: "material",
              title: `Nuevo material en ${course.name}`,
              body: resource.title,
              createdAt: course.updatedAt,
              authorName: course.name,
              authorRole: "Módulo",
              courseId: course.id,
              courseName: course.name,
              moduleName: module.title,
              actionLabel: "Ver clase",
              actionHref: `/(app)/courses/${course.id}`,
              likes: 7,
              comments: 1,
              attachments: [
                buildImageAttachment(`resource-${resource.id}-preview`, "Portada del material", "mint"),
                buildDocumentAttachment(
                  `resource-${resource.id}-file`,
                  resource.title,
                  resource.resourceType,
                  "sky"
                ),
              ],
            });
          });
        });
      });

      return activities
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 24);
    },
  });
}
