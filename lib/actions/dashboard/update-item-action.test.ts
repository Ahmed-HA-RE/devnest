import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { deleteCloudinaryFile, extractPublicId } from '@/lib/cloudinary';
import { prisma } from '@/lib/db';
import type { EditTypeSchema } from '@/schema/dashboard';
import { updateItemAction } from './update-item-action';

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: vi.fn() } },
}));

vi.mock('@/lib/db', () => ({
  prisma: { $transaction: vi.fn() },
}));

vi.mock('@/lib/cloudinary', () => ({
  deleteCloudinaryFile: vi.fn().mockResolvedValue(undefined),
  extractPublicId: vi.fn((url: string) => `extracted:${url}`),
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
  fileUrl: null,
  fileName: null,
  fileSize: null,
  tags: ['react', 'hooks'],
  collectionIds: [],
};

const makeTextTx = () => ({
  item: {
    findFirst: vi
      .fn()
      .mockResolvedValue({ type: { name: 'snippet' }, fileUrl: null }),
    update: vi.fn().mockResolvedValue({ id: 'item-1' }),
  },
  tag: {
    findMany: vi.fn().mockResolvedValue([{ id: 'tag-react', name: 'react' }]),
    createMany: vi.fn().mockResolvedValue({ count: 1 }),
  },
  itemTag: { deleteMany: vi.fn().mockResolvedValue({ count: 2 }) },
});

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
    const tx = makeTextTx();
    (prisma.$transaction as Mock).mockImplementation((callback) => callback(tx));

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

  it('replaces collections via set when collectionIds are provided', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    const tx = makeTextTx();
    (prisma.$transaction as Mock).mockImplementation((callback) => callback(tx));

    await updateItemAction('item-1', { ...baseInput, collectionIds: ['col-1', 'col-2'] });

    expect(tx.item.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          collections: { set: [{ id: 'col-1' }, { id: 'col-2' }] },
        }),
      }),
    );
  });

  it('skips tag.createMany when every tag already exists', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    const tx = {
      ...makeTextTx(),
      tag: {
        findMany: vi.fn().mockResolvedValue([
          { id: 'tag-react', name: 'react' },
          { id: 'tag-hooks', name: 'hooks' },
        ]),
        createMany: vi.fn(),
      },
    };
    (prisma.$transaction as Mock).mockImplementation((callback) => callback(tx));

    await updateItemAction('item-1', baseInput);

    expect(tx.tag.createMany).not.toHaveBeenCalled();
  });

  it('deletes old Cloudinary file when a file item is updated with a new fileUrl', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    const oldUrl = 'https://res.cloudinary.com/test/raw/upload/v1/devnest/files/old.pdf';
    const newUrl = 'https://res.cloudinary.com/test/raw/upload/v1/devnest/files/new.pdf';

    const tx = {
      item: {
        findFirst: vi.fn().mockResolvedValue({
          type: { name: 'file' },
          fileUrl: oldUrl,
        }),
        update: vi.fn().mockResolvedValue({ id: 'item-1' }),
      },
      tag: {
        findMany: vi.fn().mockResolvedValue([]),
        createMany: vi.fn(),
      },
      itemTag: { deleteMany: vi.fn() },
    };
    (prisma.$transaction as Mock).mockImplementation((callback) => callback(tx));

    await updateItemAction('item-1', {
      ...baseInput,
      fileUrl: newUrl,
      fileName: 'new.pdf',
      fileSize: 204800,
      tags: [],
    });

    expect(extractPublicId).toHaveBeenCalledWith(oldUrl);
    expect(deleteCloudinaryFile).toHaveBeenCalledWith(
      `extracted:${oldUrl}`,
      'raw',
    );
  });

  it('deletes old Cloudinary file with resource_type "image" for image items', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    const oldUrl = 'https://res.cloudinary.com/test/image/upload/v1/devnest/old.jpg';
    const newUrl = 'https://res.cloudinary.com/test/image/upload/v1/devnest/new.jpg';

    const tx = {
      item: {
        findFirst: vi.fn().mockResolvedValue({
          type: { name: 'image' },
          fileUrl: oldUrl,
        }),
        update: vi.fn().mockResolvedValue({ id: 'item-1' }),
      },
      tag: {
        findMany: vi.fn().mockResolvedValue([]),
        createMany: vi.fn(),
      },
      itemTag: { deleteMany: vi.fn() },
    };
    (prisma.$transaction as Mock).mockImplementation((callback) => callback(tx));

    await updateItemAction('item-1', {
      ...baseInput,
      fileUrl: newUrl,
      fileName: 'new.jpg',
      fileSize: 512000,
      tags: [],
    });

    expect(deleteCloudinaryFile).toHaveBeenCalledWith(expect.any(String), 'image');
  });

  it('does not call Cloudinary when fileUrl is unchanged', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    const sameUrl = 'https://res.cloudinary.com/test/raw/upload/v1/devnest/files/same.pdf';

    const tx = {
      item: {
        findFirst: vi.fn().mockResolvedValue({
          type: { name: 'file' },
          fileUrl: sameUrl,
        }),
        update: vi.fn().mockResolvedValue({ id: 'item-1' }),
      },
      tag: { findMany: vi.fn().mockResolvedValue([]), createMany: vi.fn() },
      itemTag: { deleteMany: vi.fn() },
    };
    (prisma.$transaction as Mock).mockImplementation((callback) => callback(tx));

    await updateItemAction('item-1', {
      ...baseInput,
      fileUrl: sameUrl,
      tags: [],
    });

    expect(deleteCloudinaryFile).not.toHaveBeenCalled();
  });

  it('succeeds even when the old Cloudinary file deletion fails (non-fatal)', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    const tx = {
      item: {
        findFirst: vi.fn().mockResolvedValue({
          type: { name: 'file' },
          fileUrl: 'https://res.cloudinary.com/test/raw/upload/v1/devnest/old.pdf',
        }),
        update: vi.fn().mockResolvedValue({ id: 'item-1' }),
      },
      tag: { findMany: vi.fn().mockResolvedValue([]), createMany: vi.fn() },
      itemTag: { deleteMany: vi.fn() },
    };
    (prisma.$transaction as Mock).mockImplementation((callback) => callback(tx));
    (deleteCloudinaryFile as Mock).mockRejectedValue(new Error('Cloudinary down'));

    const result = await updateItemAction('item-1', {
      ...baseInput,
      fileUrl: 'https://res.cloudinary.com/test/raw/upload/v1/devnest/new.pdf',
      tags: [],
    });

    expect(result.success).toBe(true);
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