import { useQuery } from "@tanstack/react-query";
import { authedRequest } from "@/core/api/authedRequest";
import { getRequiredStudentId } from "@/core/auth/session";
import { GradeRecordDto } from "@/types/dto";

export const gradesKeys = {
  byStudent: (studentId: number) => ["grades", "student", studentId] as const,
};

export function useStudentGradesQuery() {
  const studentId = getRequiredStudentId();
  return useQuery({
    queryKey: gradesKeys.byStudent(studentId),
    queryFn: () => authedRequest<GradeRecordDto[]>(`/students/${studentId}/grades`),
  });
}
