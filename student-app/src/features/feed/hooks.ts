import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authedRequest } from "@/core/api/authedRequest";
import { CreateFeedCommentRequest, FeedCommentDto, FeedPostDto } from "@/types/dto";

export const feedKeys = {
  byCourse: (courseId: number) => ["feed", "course", courseId] as const,
  comments: (postId: number) => ["feed", "post", postId, "comments"] as const,
};

export function useCourseFeedQuery(courseId: number) {
  return useQuery({
    queryKey: feedKeys.byCourse(courseId),
    queryFn: () => authedRequest<FeedPostDto[]>(`/courses/${courseId}/feed`),
    enabled: Number.isFinite(courseId),
  });
}

export function useFeedCommentsQuery(postId: number) {
  return useQuery({
    queryKey: feedKeys.comments(postId),
    queryFn: () => authedRequest<FeedCommentDto[]>(`/feed/${postId}/comments`),
    enabled: Number.isFinite(postId),
  });
}

export function useCreateFeedCommentMutation(postId: number, courseId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFeedCommentRequest) =>
      authedRequest<FeedCommentDto>(`/feed/${postId}/comments`, {
        method: "POST",
        body: payload,
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: feedKeys.comments(postId) }),
        courseId ? queryClient.invalidateQueries({ queryKey: feedKeys.byCourse(courseId) }) : Promise.resolve(),
      ]);
    },
  });
}
