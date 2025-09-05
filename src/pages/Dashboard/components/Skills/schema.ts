import { z } from 'zod';

export const skillsSectionSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
});

export const skillSchema = z.object({
  name: z
    .string()
    .min(2, 'Skill name must be at least 2 characters')
    .max(50, 'Skill name must be less than 50 characters'),
  icon: z
    .any()
    .refine(
      (files) => files instanceof FileList || !files,
      'Icon must be a valid file'
    )
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'].includes(
          files[0]?.type
        ),
      'Only PNG, JPEG, WEBP, and SVG files are allowed'
    )
    .refine(
      (files) =>
        !files || files.length === 0 || files[0]?.size <= 1 * 1024 * 1024,
      'Max file size is 1MB'
    ),
});

export type SkillsSectionFormData = z.infer<typeof skillsSectionSchema>;
export type SkillFormData = z.infer<typeof skillSchema>;
