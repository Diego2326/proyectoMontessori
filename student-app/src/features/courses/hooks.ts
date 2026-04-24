import { useQuery } from "@tanstack/react-query";
import { authedRequest } from "@/core/api/authedRequest";
import { getRequiredStudentId } from "@/core/auth/session";
import { AcademicModuleDto, ContentResourceDto, CourseDto } from "@/types/dto";

export const courseKeys = {
  all: ["courses"] as const,
  detail: (courseId: number) => ["courses", courseId] as const,
  modules: (courseId: number) => ["courses", courseId, "modules"] as const,
  moduleDetail: (moduleId: number) => ["modules", moduleId] as const,
  resources: (moduleId: number) => ["modules", moduleId, "resources"] as const,
};

export function useStudentCoursesQuery() {
  const studentId = getRequiredStudentId();
  return useQuery({
    queryKey: [...courseKeys.all, studentId],
    queryFn: () => authedRequest<CourseDto[]>(`/students/${studentId}/courses`),
  });
}

export function useCourseDetailQuery(courseId: number) {
  return useQuery({
    queryKey: courseKeys.detail(courseId),
    queryFn: () => authedRequest<CourseDto>(`/courses/${courseId}`),
    enabled: Number.isFinite(courseId),
  });
}

export function useCourseModulesQuery(courseId: number) {
  return useQuery({
    queryKey: courseKeys.modules(courseId),
    queryFn: () => authedRequest<AcademicModuleDto[]>(`/courses/${courseId}/modules`),
    enabled: Number.isFinite(courseId),
  });
}

export function useModuleDetailQuery(moduleId: number) {
  return useQuery({
    queryKey: courseKeys.moduleDetail(moduleId),
    queryFn: () => authedRequest<AcademicModuleDto>(`/modules/${moduleId}`),
    enabled: Number.isFinite(moduleId),
  });
}

export function useModuleResourcesQuery(moduleId: number) {
  return useQuery({
    queryKey: courseKeys.resources(moduleId),
    queryFn: () => authedRequest<ContentResourceDto[]>(`/modules/${moduleId}/resources`),
    enabled: Number.isFinite(moduleId),
  });
}
