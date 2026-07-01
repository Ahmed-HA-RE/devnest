'use server';

import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { FILE_UPLOAD_TYPES } from '@/lib/constants/type';
import { createTypeSchema, type CreateTypeSchema } from '@/schema/dashboard';

export const createTypeAction = async (data: CreateTypeSchema) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return { success: false, data: null, message: 'Unauthorized' };
    }

    const parsed = createTypeSchema.safeParse(data);

    if (!parsed.success) {
      const message = parsed.error.issues
        .map((issue) => issue.message)
        .join(', ');
      throw new Error(message);
    }

    const {
      type,
      title,
      description,
      content,
      url,
      language,
      fileUrl,
      fileName,
      fileSize,
      tags,
      collectionIds,
    } = parsed.data;
    const userId = session.user.id;
    const isFileType = FILE_UPLOAD_TYPES.includes(type);

    const result = await prisma.$transaction(async (tx) => {
      const itemType = await tx.itemType.findFirst({
        where: { name: type, OR: [{ isSystem: true }, { userId }] },
      });

      if (!itemType) {
        return null;
      }

      const existingTags = await tx.tag.findMany({
        where: { userId, name: { in: tags } },
      });
      const tagIdByName = new Map(
        existingTags.map((tag) => [tag.name, tag.id]),
      );
      const newTags = tags
        .filter((name) => !tagIdByName.has(name))
        .map((name) => ({ id: randomUUID(), name, userId }));

      if (newTags.length > 0) {
        await tx.tag.createMany({ data: newTags });
        newTags.forEach((tag) => tagIdByName.set(tag.name, tag.id));
      }

      const createdItem = await tx.item.create({
        data: {
          title,
          description: description ?? null,
          content: isFileType ? null : (content ?? null),
          url: url ?? null,
          language: language ?? null,
          fileUrl: isFileType ? (fileUrl ?? null) : null,
          fileName: isFileType ? (fileName ?? null) : null,
          fileSize: isFileType ? (fileSize ?? null) : null,
          contentType: isFileType ? 'file' : 'text',
          collections: {
            connect: collectionIds.map((id) => ({ id })),
          },
          userId,
          typeId: itemType.id,
          tags: {
            create: tags.map((name) => ({ tagId: tagIdByName.get(name)! })),
          },
        },
        include: {
          type: { select: { name: true, color: true } },
          tags: { include: { tag: { select: { name: true } } } },
          collections: { select: { id: true, name: true } },
        },
      });

      return createdItem;
    });

    if (!result) {
      return { success: false, data: null, message: 'Item type not found' };
    }

    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/items/${type}`);

    return {
      success: true,
      data: result,
      message: 'Item created successfully',
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to create item';
    return { success: false, data: null, message };
  }
};