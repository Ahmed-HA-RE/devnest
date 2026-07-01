import { z } from 'zod';

export const editTypeSchema = z.object({
  title: z
    .string({ error: 'Invalid Title' })
    .trim()
    .min(1, 'Title is required'),
  description: z.string().trim().nullable().optional(),
  content: z.string().trim().nullable().optional(),
  url: z
    .string()
    .trim()
    .nullable()
    .optional()
    .refine((value) => !value || z.url().safeParse(value).success, {
      message: 'Invalid URL',
    }),
  language: z.string().trim().nullable().optional(),
  fileUrl: z.string().trim().nullable().optional(),
  fileName: z.string().trim().nullable().optional(),
  fileSize: z.number().nullable().optional(),
  tags: z.array(z.string().trim().min(1, 'Tag cannot be empty')),
});

export type EditTypeSchema = z.infer<typeof editTypeSchema>;

export const createTypeSchema = editTypeSchema
  .extend({
    type: z.enum(
      ['snippet', 'command', 'prompt', 'note', 'link', 'file', 'image'],
      { error: 'Invalid type' },
    ),
  })
  .refine((data) => data.type !== 'link' || !!data.url?.trim(), {
    message: 'URL is required',
    path: ['url'],
  })
  .refine(
    (data) =>
      !['file', 'image'].includes(data.type) || !!data.fileUrl?.trim(),
    {
      message: 'File is required',
      path: ['fileUrl'],
    },
  );

export type CreateTypeSchema = z.infer<typeof createTypeSchema>;

export const createCollectionSchema = z.object({
  title: z
    .string()
    .min(3, 'Collection title must be at least 3 characters')
    .trim(),
  description: z
    .string()
    .min(10, 'Collection description must be at least 10 characters')
    .trim(),
});

export type CreateCollectionSchema = z.infer<typeof createCollectionSchema>;
