import { z } from "zod";

export const submissionSchema = z
  .object({
    contentText: z.string().trim().optional(),
    attachmentUrl: z
      .string()
      .trim()
      .url("La URL adjunta no es válida")
      .optional()
      .or(z.literal("")),
  })
  .refine((values) => {
    const hasText = !!values.contentText?.trim();
    const hasUrl = !!values.attachmentUrl?.trim();
    return hasText || hasUrl;
  }, "Debes enviar texto, URL o ambos.");

export type SubmissionFormValues = z.infer<typeof submissionSchema>;
