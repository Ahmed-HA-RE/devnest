import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { deleteCloudinaryFile, extractPublicId } from '@/lib/cloudinary';
import { prisma } from '@/lib/db';
import { deleteItemAction } from './delete-item-action';

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: vi.fn() } },
}));

vi.mock('@/lib/db', () => ({
  prisma: { item: { findFirst: vi.fn(), delete: vi.fn() } },
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
      select: { type: { select: { name: true } }, fileUrl: true },
    });
    expect(result).toEqual({
      success: false,
      data: null,
      message: 'Item not found',
    });
    expect(prisma.item.delete).not.toHaveBeenCalled();
  });

  it('deletes a text item, revalidates its type page, and skips Cloudinary', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    (prisma.item.findFirst as Mock).mockResolvedValue({
      type: { name: 'snippet' },
      fileUrl: null,
    });
    (prisma.item.delete as Mock).mockResolvedValue({ id: 'item-1' });

    const result = await deleteItemAction('item-1');

    expect(prisma.item.delete).toHaveBeenCalledWith({ where: { id: 'item-1' } });
    expect(deleteCloudinaryFile).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/items/snippet');
    expect(result).toEqual({
      success: true,
      data: null,
      message: 'Item deleted successfully',
    });
  });

  it('deletes a file item from DB and then from Cloudinary (raw)', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    (prisma.item.findFirst as Mock).mockResolvedValue({
      type: { name: 'file' },
      fileUrl: 'https://res.cloudinary.com/test/raw/upload/v1/devnest/files/uuid.pdf',
    });
    (prisma.item.delete as Mock).mockResolvedValue({ id: 'item-1' });

    const result = await deleteItemAction('item-1');

    expect(prisma.item.delete).toHaveBeenCalledWith({ where: { id: 'item-1' } });
    expect(extractPublicId).toHaveBeenCalledWith(
      'https://res.cloudinary.com/test/raw/upload/v1/devnest/files/uuid.pdf',
    );
    expect(deleteCloudinaryFile).toHaveBeenCalledWith(
      'extracted:https://res.cloudinary.com/test/raw/upload/v1/devnest/files/uuid.pdf',
      'raw',
    );
    expect(result).toEqual({
      success: true,
      data: null,
      message: 'Item deleted successfully',
    });
  });

  it('deletes an image item from DB and then from Cloudinary (image)', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    (prisma.item.findFirst as Mock).mockResolvedValue({
      type: { name: 'image' },
      fileUrl: 'https://res.cloudinary.com/test/image/upload/v1/devnest/uuid.jpg',
    });
    (prisma.item.delete as Mock).mockResolvedValue({ id: 'item-1' });

    await deleteItemAction('item-1');

    expect(deleteCloudinaryFile).toHaveBeenCalledWith(
      expect.any(String),
      'image',
    );
  });

  it('succeeds even when Cloudinary deletion fails (non-fatal)', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    (prisma.item.findFirst as Mock).mockResolvedValue({
      type: { name: 'file' },
      fileUrl: 'https://res.cloudinary.com/test/raw/upload/v1/devnest/files/uuid.pdf',
    });
    (prisma.item.delete as Mock).mockResolvedValue({ id: 'item-1' });
    (deleteCloudinaryFile as Mock).mockRejectedValue(new Error('Cloudinary down'));

    const result = await deleteItemAction('item-1');

    expect(result).toEqual({
      success: true,
      data: null,
      message: 'Item deleted successfully',
    });
  });

  it('returns a generic error message when the DB delete throws', async () => {
    (auth.api.getSession as unknown as Mock).mockResolvedValue(mockSession);
    (prisma.item.findFirst as Mock).mockResolvedValue({
      type: { name: 'snippet' },
      fileUrl: null,
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