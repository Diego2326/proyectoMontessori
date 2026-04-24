import { useQuery } from "@tanstack/react-query";
import { authedRequest } from "@/core/api/authedRequest";
import { getRequiredStudentId } from "@/core/auth/session";
import { StudentProgressDto } from "@/types/dto";

export const progressKeys = {
  byStudent: (studentId: number) => ["progress", "student", studentId] as const,
  byCourse: (courseId: number, studentId: number) => ["progress", "course", courseId, "student", studentId] as const,
};

export function useStudentProgressQuery() {
  const studentId = getRequiredStudentId();
  return useQuery({
    queryKey: progressKeys.byStudent(studentId),
    queryFn: () => authedRequest<StudentProgressDto>(`/students/${studentId}/progress`),
  });
}

export function useCourseStudentProgressQuery(courseId: number) {
  const studentId = getRequiredStudentId();
  return useQuery({
    queryKey: progressKeys.byCourse(courseId, studentId),
    queryFn: () => authedRequest<StudentProgressDto>(`/courses/${courseId}/students/${studentId}/progress`),
    enabled: Number.isFinite(courseId),
  });
}
