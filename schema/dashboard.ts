import { z } from 'zod';

export const editTypeSchema = z.object({
  title: z
    .string({ error: 'Invalid Title' })
    .trim()
    .min(1, 'Title is required'),
  description: z.string().trim().nullable().optional(),
  content: z.string().trim().nullable().optional(),
  url: z.string().trim().nullable().optional().refine(
    (value) => !value || z.url().safeParse(value).success,
    { message: 'Invalid URL' },
  ),
  language: z.string().trim().nullable().optional(),
  tags: z.array(z.string().trim().min(1, 'Tag cannot be empty')),
});

export type EditTypeSchema = z.infer<typeof editTypeSchema>;