'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import {
  createCollectionSchema,
  type CreateCollectionSchema,
} from '@/schema/dashboard';

export const createCollectionAction = async (data: CreateCollectionSchema) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return { success: false, data: null, message: 'Unauthorized' };
    }

    const parsed = createCollectionSchema.safeParse(data);

    if (!parsed.success) {
      const message = parsed.error.issues
        .map((issue) => issue.message)
        .join(', ');
      return { success: false, data: null, message };
    }

    const { title, description } = parsed.data;
    const userId = session.user.id;

    const collection = await prisma.collection.create({
      data: { name: title, description, userId },
    });

    revalidatePath('/dashboard');

    return {
      success: true,
      data: collection,
      message: 'Collection created successfully',
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to create collection';
    return { success: false, data: null, message };
  }
};
