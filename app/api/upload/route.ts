import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { getClientIp } from 'next-request-ip';

import { auth } from '@/lib/auth';
import {
  deleteCloudinaryFile,
  extractPublicId,
  uploadFile,
  type CloudinaryResourceType,
} from '@/lib/cloudinary';
import { rateLimit } from '@/lib/rate-limit';

const FILE_CONFIG = {
  file: {
    extensions: ['.pdf', '.docx', '.xlsx', '.txt'],
    mimeTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
    ],
    maxBytes: 5 * 1024 * 1024,
    resourceType: 'raw' as CloudinaryResourceType,
  },
  image: {
    extensions: ['.jpg', '.jpeg', '.png', '.webp'],
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxBytes: 10 * 1024 * 1024,
    resourceType: 'image' as CloudinaryResourceType,
  },
} as const;

export const POST = async (request: NextRequest) => {
  try {
    const ip = getClientIp(request.headers) ?? 'unknown';
    const { success } = await rateLimit({ prefix: 'upload:post', identifier: ip, requests: 10, window: '60 s' });
    if (!success) {
      return NextResponse.json({ message: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const itemType = formData.get('itemType') as 'file' | 'image' | null;

    if (!file || !itemType || !(itemType in FILE_CONFIG)) {
      return NextResponse.json(
        { message: 'Missing file or invalid item type' },
        { status: 400 },
      );
    }

    const config = FILE_CONFIG[itemType];

    if (file.size === 0) {
      return NextResponse.json(
        { message: 'File is empty. Please upload a non-empty file.' },
        { status: 400 },
      );
    }

    const normalizedMime = file.type.split(';')[0].trim();
    if (!config.mimeTypes.includes(normalizedMime as never)) {
      return NextResponse.json(
        {
          message: `Invalid file type. Allowed: ${config.extensions.join(', ')}`,
        },
        { status: 400 },
      );
    }

    if (file.size > config.maxBytes) {
      const maxMb = config.maxBytes / 1024 / 1024;
      return NextResponse.json(
        { message: `File too large. Maximum size is ${maxMb}MB` },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, publicId } = await uploadFile(buffer, {
      resourceType: config.resourceType,
    });

    return NextResponse.json({
      url,
      publicId,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to upload file';
    return NextResponse.json({ message }, { status: 500 });
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const ip = getClientIp(request.headers) ?? 'unknown';
    const { success } = await rateLimit({ prefix: 'upload:delete', identifier: ip, requests: 20, window: '60 s' });
    if (!success) {
      return NextResponse.json({ message: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { fileUrl, itemType } = (await request.json()) as {
      fileUrl: string;
      itemType: 'file' | 'image';
    };

    if (!fileUrl || !itemType || !(itemType in FILE_CONFIG)) {
      return NextResponse.json(
        { message: 'Missing fileUrl or invalid item type' },
        { status: 400 },
      );
    }

    const publicId = extractPublicId(fileUrl);
    const resourceType = FILE_CONFIG[itemType].resourceType;
    await deleteCloudinaryFile(publicId, resourceType);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: 'Failed to delete file' },
      { status: 500 },
    );
  }
};
