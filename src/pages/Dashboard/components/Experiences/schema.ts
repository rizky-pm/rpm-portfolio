import { z } from 'zod';

export const experienceFormSchema = z.object({
  description: z.string().min(1).max(999),
});

export const experienceListFormSchema = z.object({
  employer: z
    .string()
    .min(1, 'Employer name is required')
    .max(100, 'Employer name must be less than 100 characters'),

  role: z
    .string()
    .min(1, 'Role is required')
    .max(100, 'Role must be less than 100 characters'),

  start_date: z.date({ error: 'A start date is required.' }),
  end_date: z.date().optional(),

  employment_type: z.enum(
    ['Intern', 'Contract', 'Full-time', 'Part-time', 'Freelance'],
    {
      error: 'Employment type is required',
    }
  ),

  location: z
    .string()
    .min(1, 'Location is required')
    .max(100, 'Location must be less than 100 characters'),

  description: z.string().superRefine((val, ctx) => {
    const stripped = val.replace(/<[^>]*>/g, '').trim(); // Remove HTML tags for validation only
    if (stripped.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Work description is required',
      });
    }
  }),
});

export type ExperienceListFormType = z.infer<typeof experienceListFormSchema>;
export type ExperienceFormSchemaType = z.infer<typeof experienceFormSchema>;
