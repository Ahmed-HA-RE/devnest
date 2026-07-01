'use server';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const getCollectionsAction = async (search?: string) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return { success: false, data: null, message: 'Unauthorized' };
    }

    const collections = await prisma.collection.findMany({
      where: {
        userId: session.user.id,
        ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
      },
      select: { id: true, name: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return {
      success: true,
      data: collections,
      message: 'Collections fetched successfully',
    };
  } catch {
    return { success: false, data: null, message: 'Failed to fetch collections' };
  }
};
