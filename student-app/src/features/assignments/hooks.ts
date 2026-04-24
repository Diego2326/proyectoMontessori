import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authedRequest } from "@/core/api/authedRequest";
import { ApiError } from "@/core/api/error";
import { isPastDate } from "@/core/utils/date";
import { courseKeys } from "@/features/courses/hooks";
import { CreateSubmissionRequest, LmsAssignmentDto, SubmissionDto } from "@/types/dto";

export const assignmentKeys = {
  byCourse: (courseId: number) => ["assignments", "course", courseId] as const,
  detailFromCourse: (courseId: number, assignmentId: number) =>
    ["assignments", "course", courseId, "detail", assignmentId] as const,
  mySubmission: (assignmentId: number) => ["assignments", assignmentId, "my-submission"] as const,
  submission: (submissionId: number) => ["submissions", submissionId] as const,
};

export function useCourseAssignmentsQuery(courseId: number) {
  return useQuery({
    queryKey: assignmentKeys.byCourse(courseId),
    queryFn: () => authedRequest<LmsAssignmentDto[]>(`/courses/${courseId}/assignments`),
    enabled: Number.isFinite(courseId),
  });
}

export function useAssignmentDetailFromCourseQuery(courseId: number, assignmentId: number) {
  return useQuery({
    queryKey: assignmentKeys.detailFromCourse(courseId, assignmentId),
    queryFn: async () => {
      const assignments = await authedRequest<LmsAssignmentDto[]>(`/courses/${courseId}/assignments`);
      const found = assignments.find((item) => item.id === assignmentId);
      if (!found) {
        throw new Error("No se encontró la tarea en este curso.");
      }
      return found;
    },
    enabled: Number.isFinite(assignmentId) && Number.isFinite(courseId),
  });
}

export function useMySubmissionQuery(assignmentId: number) {
  return useQuery({
    queryKey: assignmentKeys.mySubmission(assignmentId),
    queryFn: async () => {
      try {
        return await authedRequest<SubmissionDto>(`/assignments/${assignmentId}/my-submission`);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: Number.isFinite(assignmentId),
    retry: (failureCount, error) => !(error instanceof ApiError && error.status === 404) && failureCount < 1,
  });
}

export function useSubmissionQuery(submissionId: number) {
  return useQuery({
    queryKey: assignmentKeys.submission(submissionId),
    queryFn: () => authedRequest<SubmissionDto>(`/submissions/${submissionId}`),
    enabled: Number.isFinite(submissionId),
  });
}

export function canEditSubmission(assignment: LmsAssignmentDto | undefined) {
  if (!assignment) return false;
  if (!isPastDate(assignment.dueAt)) return true;
  return assignment.allowLateSubmissions;
}

export function useCreateSubmissionMutation(assignmentId: number, courseId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSubmissionRequest) =>
      authedRequest<SubmissionDto>(`/assignments/${assignmentId}/submissions`, {
        method: "POST",
        body: payload,
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: assignmentKeys.mySubmission(assignmentId) }),
        courseId
          ? queryClient.invalidateQueries({ queryKey: assignmentKeys.detailFromCourse(courseId, assignmentId) })
          : Promise.resolve(),
        courseId ? queryClient.invalidateQueries({ queryKey: assignmentKeys.byCourse(courseId) }) : Promise.resolve(),
      ]);
    },
  });
}

export function useUpdateSubmissionMutation(assignmentId: number, submissionId: number, courseId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSubmissionRequest) =>
      authedRequest<SubmissionDto>(`/submissions/${submissionId}`, {
        method: "PUT",
        body: payload,
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: assignmentKeys.mySubmission(assignmentId) }),
        queryClient.invalidateQueries({ queryKey: assignmentKeys.submission(submissionId) }),
        courseId
          ? queryClient.invalidateQueries({ queryKey: assignmentKeys.detailFromCourse(courseId, assignmentId) })
          : Promise.resolve(),
        courseId ? queryClient.invalidateQueries({ queryKey: assignmentKeys.byCourse(courseId) }) : Promise.resolve(),
        courseId ? queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) }) : Promise.resolve(),
      ]);
    },
  });
}
