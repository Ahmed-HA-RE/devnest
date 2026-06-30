import { randomUUID } from 'crypto';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER!;

export type CloudinaryResourceType = 'image' | 'raw';

export const uploadFile = async (
  buffer: Buffer,
  options: {
    resourceType: CloudinaryResourceType;
  },
): Promise<{ url: string; publicId: string }> => {
  const result = await new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: CLOUDINARY_FOLDER,
            public_id: randomUUID(),
            resource_type: options.resourceType,
            use_filename: false,
            unique_filename: false,
          },
          (error, result) => {
            if (error || !result)
              return reject(error ?? new Error('Upload failed'));
            resolve(result);
          },
        )
        .end(buffer);
    },
  );

  return { url: result.secure_url, publicId: result.public_id };
};

export const deleteCloudinaryFile = async (
  publicId: string,
  resourceType: CloudinaryResourceType,
): Promise<void> => {
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

export const extractPublicId = (url: string): string =>
  url
    .replace(
      /^https:\/\/res\.cloudinary\.com\/[^/]+\/(raw|image)\/upload\/v\d+\//,
      '',
    )
    .replace(/\.[^.]+$/, '');
