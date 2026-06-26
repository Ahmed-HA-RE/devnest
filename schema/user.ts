import { z } from 'zod';
import { authSchema } from './auth';

export const setUserPassSchema = z
  .object({
    newPassword: authSchema.shape.password,
    confirmPassword: authSchema.shape.password,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type SetUserPassSchema = z.infer<typeof setUserPassSchema>;

export const changeUserPassSchema = z
  .object({
    currentPassword: authSchema.shape.password,
    newPassword: authSchema.shape.password,
    confirmPassword: authSchema.shape.password,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type ChangeUserPassSchema = z.infer<typeof changeUserPassSchema>;

export const updateUsernameSchema = z.object({
  userName: authSchema.shape.userName,
});

export type UpdateUsernameSchema = z.infer<typeof updateUsernameSchema>;