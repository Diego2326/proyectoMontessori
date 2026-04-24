import { useQuery } from "@tanstack/react-query";
import { authedRequest } from "@/core/api/authedRequest";
import { StudentDashboardDto } from "@/types/dto";

export const dashboardKeys = {
  summary: ["dashboard", "student-summary"] as const,
};

export function useStudentDashboardQuery() {
  return useQuery({
    queryKey: dashboardKeys.summary,
    queryFn: () => authedRequest<StudentDashboardDto>("/dashboard/student"),
  });
}
