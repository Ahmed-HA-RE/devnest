import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import type { EditTypeSchema } from '@/schema/dashboard';
import { updateItemAction } from './update-item-action';

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: vi.fn() } },
}));

vi.mock('@/lib/db', () => ({
  prisma: { $transaction: vi.fn() },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

const mockSession = { user: { id: 'user-1' } };

const baseInput: EditTypeSchema = {
  title: 'Updated title',
  description: null,
  content: null,
  url: null,
  language: null,
  tags: ['react', 'hooks'],
};

describe('updateItemAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (headers as unknown as Mock).mockResolvedValue(new Headers());
  });

  it('returns Unauthorized when there is no session', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(null);

    const result = await updateItemAction('item-1', baseInput);

    expect(result).toEqual({
      success: false,
      data: null,
      message: 'Unauthorized',
    });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('returns comma-joined validation messages for invalid input', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);

    const result = await updateItemAction('item-1', {
      ...baseInput,
      title: '   ',
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe('Title is required');
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('returns "Item not found" when the ownership check fails inside the transaction', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    (prisma.$transaction as Mock).mockImplementation(async (callback) => {
      const tx = { item: { findFirst: vi.fn().mockResolvedValue(null) } };
      return callback(tx);
    });

    const result = await updateItemAction('item-1', baseInput);

    expect(result).toEqual({
      success: false,
      data: null,
      message: 'Item not found',
    });
  });

  it('creates only missing tags, replaces ItemTag links, and updates the item', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);

    const tx = {
      item: {
        findFirst: vi.fn().mockResolvedValue({ type: { name: 'snippet' } }),
        update: vi.fn().mockResolvedValue({ id: 'item-1' }),
      },
      tag: {
        findMany: vi.fn().mockResolvedValue([{ id: 'tag-react', name: 'react' }]),
        createMany: vi.fn().mockResolvedValue({ count: 1 }),
      },
      itemTag: { deleteMany: vi.fn().mockResolvedValue({ count: 2 }) },
    };
    (prisma.$transaction as Mock).mockImplementation((callback) =>
      callback(tx),
    );

    const result = await updateItemAction('item-1', baseInput);

    expect(tx.tag.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1', name: { in: baseInput.tags } },
    });
    expect(tx.tag.createMany).toHaveBeenCalledTimes(1);
    const createdTags = (tx.tag.createMany as Mock).mock.calls[0][0].data;
    expect(createdTags).toEqual([
      { id: expect.any(String), name: 'hooks', userId: 'user-1' },
    ]);
    const newTagId = createdTags[0].id;

    expect(tx.itemTag.deleteMany).toHaveBeenCalledWith({
      where: { itemId: 'item-1' },
    });
    expect(tx.item.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'item-1' },
        data: expect.objectContaining({
          title: baseInput.title,
          tags: { create: [{ tagId: 'tag-react' }, { tagId: newTagId }] },
        }),
      }),
    );
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/items/snippet');
    expect(result.success).toBe(true);
  });

  it('skips tag.createMany when every tag already exists', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);

    const tx = {
      item: {
        findFirst: vi.fn().mockResolvedValue({ type: { name: 'snippet' } }),
        update: vi.fn().mockResolvedValue({ id: 'item-1' }),
      },
      tag: {
        findMany: vi.fn().mockResolvedValue([
          { id: 'tag-react', name: 'react' },
          { id: 'tag-hooks', name: 'hooks' },
        ]),
        createMany: vi.fn(),
      },
      itemTag: { deleteMany: vi.fn().mockResolvedValue({ count: 0 }) },
    };
    (prisma.$transaction as Mock).mockImplementation((callback) =>
      callback(tx),
    );

    await updateItemAction('item-1', baseInput);

    expect(tx.tag.createMany).not.toHaveBeenCalled();
  });

  it('returns a generic error message when the transaction throws', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    (prisma.$transaction as Mock).mockRejectedValue(new Error('DB exploded'));

    const result = await updateItemAction('item-1', baseInput);

    expect(result).toEqual({
      success: false,
      data: null,
      message: 'DB exploded',
    });
  });
});