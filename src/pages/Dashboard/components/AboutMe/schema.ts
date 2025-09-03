import { z } from 'zod';

export const aboutMeFormSchema = z.object({
  title: z.string().min(1).max(50),
  description: z.string().min(1).max(999),
});

export type aboutMeFormSchemaType = z.infer<typeof aboutMeFormSchema>;
