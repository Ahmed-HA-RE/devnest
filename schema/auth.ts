import { z } from 'zod';

export const authSchema = z
  .object({
    userName: z
      .string({ error: 'Invalid Name' })
      .min(3, 'Name must be at least 3 characters')
      .max(50, 'Name must not exceed 50 characters'),
    email: z.email({ error: 'Email is required' }),
    password: z
      .string({ error: 'Invalid Password' })
      .min(6, 'Use at least 6 characters for your password.'),
    confirmPassword: z
      .string({ error: 'Invalid Password' })
      .min(6, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type AuthSchema = z.infer<typeof authSchema>;
