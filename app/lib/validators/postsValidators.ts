import { z } from "zod";
export const createPostSchema = z.object({
  title: z.string().min(3).max(255),
  content: z.string().min(3),
  order: z.number().int(),
  statusId: z.string().uuid(),
  boardId: z.string().uuid(),
});

export type CreatePostSchemaType = z.infer<typeof createPostSchema>;
