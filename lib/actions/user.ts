'use server';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import type { SetUserPassSchema } from '@/schema/user';

export const setPasswordAction = async ({
  newPassword,
}: SetUserPassSchema) => {
  try {
    await auth.api.setPassword({
      body: { newPassword },
      headers: await headers(),
    });

    return { success: true, message: 'Password set successfully' };
  } catch {
    return { success: false, message: 'Failed to set password' };
  }
};