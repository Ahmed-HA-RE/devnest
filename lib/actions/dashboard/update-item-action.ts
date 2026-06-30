'use server';

import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import {
  deleteCloudinaryFile,
  extractPublicId,
  type CloudinaryResourceType,
} from '@/lib/cloudinary';
import { FILE_UPLOAD_TYPES } from '@/lib/constants/type';
import { prisma } from '@/lib/db';
import { editTypeSchema, type EditTypeSchema } from '@/schema/dashboard';

export const updateItemAction = async (
  itemId: string,
  data: EditTypeSchema,
) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return { success: false, data: null, message: 'Unauthorized' };
    }

    const parsed = editTypeSchema.safeParse(data);

    if (!parsed.success) {
      const message = parsed.error.issues
        .map((issue) => issue.message)
        .join(', ');
      throw new Error(message);
    }

    const {
      title,
      description,
      content,
      url,
      language,
      fileUrl,
      fileName,
      fileSize,
      tags,
    } = parsed.data;

    const result = await prisma.$transaction(async (tx) => {
      const existingItem = await tx.item.findFirst({
        where: { id: itemId, userId: session.user.id },
        select: {
          type: { select: { name: true } },
          fileUrl: true,
        },
      });

      if (!existingItem) {
        return null;
      }

      const isFileType = FILE_UPLOAD_TYPES.includes(existingItem.type.name);

      const existingTags = await tx.tag.findMany({
        where: { userId: session.user.id, name: { in: tags } },
      });
      const tagIdByName = new Map(
        existingTags.map((tag) => [tag.name, tag.id]),
      );
      const newTags = tags
        .filter((name) => !tagIdByName.has(name))
        .map((name) => ({ id: randomUUID(), name, userId: session.user.id }));

      if (newTags.length > 0) {
        await tx.tag.createMany({ data: newTags });
        newTags.forEach((tag) => tagIdByName.set(tag.name, tag.id));
      }

      await tx.itemTag.deleteMany({ where: { itemId } });

      const updatedItem = await tx.item.update({
        where: { id: itemId },
        data: {
          title,
          description: description ?? null,
          content: isFileType ? null : (content ?? null),
          url: url ?? null,
          language: language ?? null,
          fileUrl: isFileType ? (fileUrl ?? null) : null,
          fileName: isFileType ? (fileName ?? null) : null,
          fileSize: isFileType ? (fileSize ?? null) : null,
          tags: {
            create: tags.map((name) => ({ tagId: tagIdByName.get(name)! })),
          },
        },
        include: {
          type: { select: { name: true, color: true } },
          tags: { include: { tag: { select: { name: true } } } },
          collection: { select: { name: true } },
        },
      });

      return {
        typeName: existingItem.type.name,
        oldFileUrl: existingItem.fileUrl,
        updatedItem,
      };
    });

    if (!result) {
      return { success: false, data: null, message: 'Item not found' };
    }

    // Delete old Cloudinary file after successful DB update if file was replaced
    const { oldFileUrl, updatedItem, typeName } = result;
    if (
      FILE_UPLOAD_TYPES.includes(typeName) &&
      oldFileUrl &&
      fileUrl &&
      oldFileUrl !== fileUrl
    ) {
      const resourceType: CloudinaryResourceType =
        typeName === 'image' ? 'image' : 'raw';
      await deleteCloudinaryFile(extractPublicId(oldFileUrl), resourceType).catch(
        () => {/* non-fatal — old file stays in Cloudinary but DB is correct */},
      );
    }

    revalidatePath(`/dashboard/items/${result.typeName}`);

    return {
      success: true,
      data: updatedItem,
      message: 'Item updated successfully',
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to update item';
    return { success: false, data: null, message };
  }
};
