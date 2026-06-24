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

export const signInSchema = z.object({
  email: authSchema.shape.email,
  password: authSchema.shape.password,
  rememberMe: z.boolean().default(false),
});

export type SignInSchema = z.input<typeof signInSchema>;

export const emailVerificationSchema = z.object({
  otp: z
    .string({ error: 'Invalid OTP' })
    .min(6, 'Please enter the OTP that was sent to your email')
    .max(6, 'OTP code must not exceed 6 characters'),
});

export type EmailVerificationSchema = z.infer<typeof emailVerificationSchema>;

export const forgotPasswordSchema = z.object({
  email: authSchema.shape.email,
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
