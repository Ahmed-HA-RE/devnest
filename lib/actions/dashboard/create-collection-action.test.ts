import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { createCollectionAction } from './create-collection-action';

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: vi.fn() } },
}));

vi.mock('@/lib/db', () => ({
  prisma: { collection: { create: vi.fn() } },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

const mockSession = { user: { id: 'user-1' } };
const validData = {
  title: 'My Collection',
  description: 'A description that is long enough',
};

describe('createCollectionAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (headers as unknown as Mock).mockResolvedValue(new Headers());
  });

  it('returns Unauthorized when there is no session', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(null);

    const result = await createCollectionAction(validData);

    expect(result).toEqual({
      success: false,
      data: null,
      message: 'Unauthorized',
    });
    expect(prisma.collection.create).not.toHaveBeenCalled();
  });

  it('returns a validation error when title is too short', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);

    const result = await createCollectionAction({
      title: 'AB',
      description: 'A description that is long enough',
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain(
      'Collection title must be at least 3 characters',
    );
    expect(prisma.collection.create).not.toHaveBeenCalled();
  });

  it('returns a validation error when description is too short', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);

    const result = await createCollectionAction({
      title: 'My Collection',
      description: 'Too short',
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain(
      'Collection description must be at least 10 characters',
    );
    expect(prisma.collection.create).not.toHaveBeenCalled();
  });

  it('creates the collection and revalidates /dashboard on success', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    const created = { id: 'col-1', name: 'My Collection', description: 'A description that is long enough', userId: 'user-1' };
    (prisma.collection.create as Mock).mockResolvedValue(created);

    const result = await createCollectionAction(validData);

    expect(prisma.collection.create).toHaveBeenCalledWith({
      data: {
        name: 'My Collection',
        description: 'A description that is long enough',
        userId: 'user-1',
      },
    });
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard');
    expect(result).toEqual({
      success: true,
      data: created,
      message: 'Collection created successfully',
    });
  });

  it('returns an error message when the DB create throws', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    (prisma.collection.create as Mock).mockRejectedValue(
      new Error('DB connection failed'),
    );

    const result = await createCollectionAction(validData);

    expect(result).toEqual({
      success: false,
      data: null,
      message: 'DB connection failed',
    });
  });
});