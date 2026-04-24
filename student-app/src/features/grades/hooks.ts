import { useQuery } from "@tanstack/react-query";
import { authedRequest } from "@/core/api/authedRequest";
import { getOptionalStudentId } from "@/core/auth/session";
import { GradeRecordDto } from "@/types/dto";

export const gradesKeys = {
  byStudent: (studentId: number | null) => ["grades", "student", studentId] as const,
};

export function useStudentGradesQuery() {
  const studentId = getOptionalStudentId();
  return useQuery({
    queryKey: gradesKeys.byStudent(studentId),
    queryFn: () => authedRequest<GradeRecordDto[]>(`/students/${studentId}/grades`),
    enabled: Number.isFinite(studentId),
  });
}
