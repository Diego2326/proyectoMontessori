import { useQuery } from "@tanstack/react-query";
import { authedRequest } from "@/core/api/authedRequest";
import { CalendarEventDto } from "@/types/dto";

export const calendarKeys = {
  global: ["calendar", "global"] as const,
  byCourse: (courseId: number) => ["calendar", "course", courseId] as const,
};

export function useCalendarQuery() {
  return useQuery({
    queryKey: calendarKeys.global,
    queryFn: () => authedRequest<CalendarEventDto[]>("/calendar"),
  });
}

export function useCourseCalendarQuery(courseId: number) {
  return useQuery({
    queryKey: calendarKeys.byCourse(courseId),
    queryFn: () => authedRequest<CalendarEventDto[]>(`/courses/${courseId}/calendar`),
    enabled: Number.isFinite(courseId),
  });
}
