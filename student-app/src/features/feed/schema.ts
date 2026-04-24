import { z } from "zod";

export const feedCommentSchema = z.object({
  content: z.string().trim().min(1, "El comentario no puede estar vacío"),
});

export type FeedCommentFormValues = z.infer<typeof feedCommentSchema>;
