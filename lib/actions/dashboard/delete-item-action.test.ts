import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { deleteItemAction } from './delete-item-action';

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: vi.fn() } },
}));

vi.mock('@/lib/db', () => ({
  prisma: { item: { findFirst: vi.fn(), delete: vi.fn() } },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

const mockSession = { user: { id: 'user-1' } };

describe('deleteItemAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (headers as unknown as Mock).mockResolvedValue(new Headers());
  });

  it('returns Unauthorized when there is no session', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(null);

    const result = await deleteItemAction('item-1');

    expect(result).toEqual({
      success: false,
      data: null,
      message: 'Unauthorized',
    });
    expect(prisma.item.delete).not.toHaveBeenCalled();
  });

  it('returns "Item not found" when the item does not belong to the user', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    (prisma.item.findFirst as Mock).mockResolvedValue(null);

    const result = await deleteItemAction('item-1');

    expect(prisma.item.findFirst).toHaveBeenCalledWith({
      where: { id: 'item-1', userId: 'user-1' },
      select: { type: { select: { name: true } } },
    });
    expect(result).toEqual({
      success: false,
      data: null,
      message: 'Item not found',
    });
    expect(prisma.item.delete).not.toHaveBeenCalled();
  });

  it('deletes the item and revalidates its type page', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    (prisma.item.findFirst as Mock).mockResolvedValue({
      type: { name: 'snippet' },
    });
    (prisma.item.delete as Mock).mockResolvedValue({ id: 'item-1' });

    const result = await deleteItemAction('item-1');

    expect(prisma.item.delete).toHaveBeenCalledWith({
      where: { id: 'item-1' },
    });
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/items/snippet');
    expect(result).toEqual({
      success: true,
      data: null,
      message: 'Item deleted successfully',
    });
  });

  it('returns a generic error message when the delete throws', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    (prisma.item.findFirst as Mock).mockResolvedValue({
      type: { name: 'snippet' },
    });
    (prisma.item.delete as Mock).mockRejectedValue(new Error('DB exploded'));

    const result = await deleteItemAction('item-1');

    expect(result).toEqual({
      success: false,
      data: null,
      message: 'DB exploded',
    });
  });
});