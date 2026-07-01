'use server';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Prisma } from '@/prisma/generated/prisma/client';

export type ItemDetail = Prisma.ItemGetPayload<{
  include: {
    type: { select: { name: true; color: true } };
    tags: { include: { tag: { select: { name: true } } } };
    collections: { select: { id: true; name: true } };
  };
}>;

export const getItemAction = async (itemId: string) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return { success: false, data: null, message: 'Unauthorized' };
    }

    const item = await prisma.item.findFirst({
      where: { id: itemId, userId: session.user.id },
      include: {
        type: { select: { name: true, color: true } },
        tags: { include: { tag: { select: { name: true } } } },
        collections: { select: { id: true, name: true } },
      },
    });

    if (!item) {
      return { success: false, data: null, message: 'Item not found' };
    }

    return { success: true, data: item, message: 'Item fetched successfully' };
  } catch {
    return { success: false, data: null, message: 'Failed to fetch item' };
  }
};