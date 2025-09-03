import { z } from 'zod';

export const formSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type formSchemaType = z.infer<typeof formSchema>;
