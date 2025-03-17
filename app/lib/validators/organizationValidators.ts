import { z } from "zod";
export const createOrganizationSchema = z.object({
  name: z.string().min(3).max(255),
});

export type CreateOrganizationSchemaType = z.infer<
  typeof createOrganizationSchema
>;
