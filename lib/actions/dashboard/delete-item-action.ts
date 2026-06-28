'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const deleteItemAction = async (itemId: string) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return { success: false, data: null, message: 'Unauthorized' };
    }

    const existingItem = await prisma.item.findFirst({
      where: { id: itemId, userId: session.user.id },
      select: { type: { select: { name: true } } },
    });

    if (!existingItem) {
      return { success: false, data: null, message: 'Item not found' };
    }

    await prisma.item.delete({ where: { id: itemId } });

    revalidatePath(`/dashboard/items/${existingItem.type.name}`);

    return {
      success: true,
      data: null,
      message: 'Item deleted successfully',
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to delete item';
    return { success: false, data: null, message };
  }
};