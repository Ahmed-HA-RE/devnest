import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import type { CreateTypeSchema } from '@/schema/dashboard';
import { createTypeAction } from './create-type-action';

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

const baseInput: CreateTypeSchema = {
  type: 'snippet',
  title: 'New snippet',
  description: null,
  content: 'console.log(1)',
  url: null,
  language: 'typescript',
  fileUrl: null,
  fileName: null,
  fileSize: null,
  tags: ['react', 'hooks'],
  collectionIds: [],
};

const makeTx = (overrides: Record<string, unknown> = {}) => ({
  itemType: {
    findFirst: vi.fn().mockResolvedValue({ id: 'type-snippet' }),
  },
  tag: {
    findMany: vi.fn().mockResolvedValue([{ id: 'tag-react', name: 'react' }]),
    createMany: vi.fn().mockResolvedValue({ count: 1 }),
  },
  item: {
    create: vi.fn().mockResolvedValue({ id: 'item-1' }),
  },
  ...overrides,
});

describe('createTypeAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (headers as unknown as Mock).mockResolvedValue(new Headers());
  });

  it('returns Unauthorized when there is no session', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(null);

    const result = await createTypeAction(baseInput);

    expect(result).toEqual({
      success: false,
      data: null,
      message: 'Unauthorized',
    });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('returns comma-joined validation messages for invalid input', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);

    const result = await createTypeAction({ ...baseInput, title: '   ' });

    expect(result.success).toBe(false);
    expect(result.message).toBe('Title is required');
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('returns a validation error when type is link without a URL', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);

    const result = await createTypeAction({
      ...baseInput,
      type: 'link',
      url: null,
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe('URL is required');
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('returns a validation error when type is file without a fileUrl', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);

    const result = await createTypeAction({
      ...baseInput,
      type: 'file',
      fileUrl: null,
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe('File is required');
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('returns a validation error when type is image without a fileUrl', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);

    const result = await createTypeAction({
      ...baseInput,
      type: 'image',
      fileUrl: null,
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe('File is required');
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('returns "Item type not found" when the type lookup fails inside the transaction', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    (prisma.$transaction as Mock).mockImplementation(async (callback) => {
      const tx = { itemType: { findFirst: vi.fn().mockResolvedValue(null) } };
      return callback(tx);
    });

    const result = await createTypeAction(baseInput);

    expect(result).toEqual({
      success: false,
      data: null,
      message: 'Item type not found',
    });
  });

  it('creates a text item with contentType "text" and no fileUrl', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    const tx = makeTx();
    (prisma.$transaction as Mock).mockImplementation((callback) => callback(tx));

    await createTypeAction(baseInput);

    expect(tx.item.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          contentType: 'text',
          fileUrl: null,
          fileName: null,
          fileSize: null,
        }),
      }),
    );
  });

  it('creates a file item with contentType "file" and stores fileUrl/fileName/fileSize', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    const tx = makeTx({
      itemType: {
        findFirst: vi.fn().mockResolvedValue({ id: 'type-file' }),
      },
    });
    (prisma.$transaction as Mock).mockImplementation((callback) => callback(tx));

    const result = await createTypeAction({
      ...baseInput,
      type: 'file',
      content: null,
      language: null,
      fileUrl: 'https://res.cloudinary.com/test/raw/upload/v1/devnest/files/uuid.pdf',
      fileName: 'report.pdf',
      fileSize: 102400,
    });

    expect(tx.item.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          contentType: 'file',
          content: null,
          fileUrl: 'https://res.cloudinary.com/test/raw/upload/v1/devnest/files/uuid.pdf',
          fileName: 'report.pdf',
          fileSize: 102400,
        }),
      }),
    );
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/items/file');
    expect(result.success).toBe(true);
  });

  it('creates an image item with contentType "file"', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    const tx = makeTx({
      itemType: {
        findFirst: vi.fn().mockResolvedValue({ id: 'type-image' }),
      },
    });
    (prisma.$transaction as Mock).mockImplementation((callback) => callback(tx));

    await createTypeAction({
      ...baseInput,
      type: 'image',
      content: null,
      language: null,
      fileUrl: 'https://res.cloudinary.com/test/image/upload/v1/devnest/uuid.jpg',
      fileName: 'photo.jpg',
      fileSize: 512000,
    });

    expect(tx.item.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ contentType: 'file' }),
      }),
    );
  });

  it('creates only missing tags and the item, then revalidates', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    const tx = makeTx();
    (prisma.$transaction as Mock).mockImplementation((callback) => callback(tx));

    const result = await createTypeAction(baseInput);

    expect(tx.itemType.findFirst).toHaveBeenCalledWith({
      where: { name: 'snippet', OR: [{ isSystem: true }, { userId: 'user-1' }] },
    });
    expect(tx.tag.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1', name: { in: baseInput.tags } },
    });
    expect(tx.tag.createMany).toHaveBeenCalledTimes(1);
    const createdTags = (tx.tag.createMany as Mock).mock.calls[0][0].data;
    expect(createdTags).toEqual([
      { id: expect.any(String), name: 'hooks', userId: 'user-1' },
    ]);
    const newTagId = createdTags[0].id;

    expect(tx.item.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: baseInput.title,
          typeId: 'type-snippet',
          contentType: 'text',
          tags: { create: [{ tagId: 'tag-react' }, { tagId: newTagId }] },
        }),
      }),
    );
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard');
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/items/snippet');
    expect(result.success).toBe(true);
  });

  it('connects the specified collections when collectionIds are provided', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    const tx = makeTx();
    (prisma.$transaction as Mock).mockImplementation((callback) => callback(tx));

    await createTypeAction({ ...baseInput, collectionIds: ['col-1', 'col-2'] });

    expect(tx.item.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          collections: { connect: [{ id: 'col-1' }, { id: 'col-2' }] },
        }),
      }),
    );
  });

  it('skips tag.createMany when every tag already exists', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    const tx = makeTx({
      tag: {
        findMany: vi.fn().mockResolvedValue([
          { id: 'tag-react', name: 'react' },
          { id: 'tag-hooks', name: 'hooks' },
        ]),
        createMany: vi.fn(),
      },
    });
    (prisma.$transaction as Mock).mockImplementation((callback) => callback(tx));

    await createTypeAction(baseInput);

    expect(tx.tag.createMany).not.toHaveBeenCalled();
  });

  it('returns a generic error message when the transaction throws', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    (prisma.$transaction as Mock).mockRejectedValue(new Error('DB exploded'));

    const result = await createTypeAction(baseInput);

    expect(result).toEqual({
      success: false,
      data: null,
      message: 'DB exploded',
    });
  });
});