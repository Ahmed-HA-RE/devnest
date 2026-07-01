import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCollectionsAction } from './get-collections-action';

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: vi.fn() } },
}));

vi.mock('@/lib/db', () => ({
  prisma: { collection: { findMany: vi.fn() } },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn(),
}));

const mockSession = { user: { id: 'user-1' } };
const mockCollections = [
  { id: 'col-1', name: 'AI Workflows' },
  { id: 'col-2', name: 'React Patterns' },
];

describe('getCollectionsAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (headers as unknown as Mock).mockResolvedValue(new Headers());
  });

  it('returns Unauthorized when there is no session', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(null);

    const result = await getCollectionsAction();

    expect(result).toEqual({
      success: false,
      data: null,
      message: 'Unauthorized',
    });
    expect(prisma.collection.findMany).not.toHaveBeenCalled();
  });

  it('returns the latest 10 collections when no search term is given', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    (prisma.collection.findMany as Mock).mockResolvedValue(mockCollections);

    const result = await getCollectionsAction();

    expect(prisma.collection.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      select: { id: true, name: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    expect(result).toEqual({
      success: true,
      data: mockCollections,
      message: 'Collections fetched successfully',
    });
  });

  it('filters collections by name when a search term is provided', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    (prisma.collection.findMany as Mock).mockResolvedValue([mockCollections[0]]);

    const result = await getCollectionsAction('AI');

    expect(prisma.collection.findMany).toHaveBeenCalledWith({
      where: {
        userId: 'user-1',
        name: { contains: 'AI', mode: 'insensitive' },
      },
      select: { id: true, name: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.data![0].name).toBe('AI Workflows');
  });

  it('returns an error message when the DB throws', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    (prisma.collection.findMany as Mock).mockRejectedValue(new Error('DB down'));

    const result = await getCollectionsAction();

    expect(result).toEqual({
      success: false,
      data: null,
      message: 'Failed to fetch collections',
    });
  });
});
