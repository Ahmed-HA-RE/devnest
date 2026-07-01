import { FaRegFolderOpen } from 'react-icons/fa6';

import FileListClient from '@/app/dashboard/items/[type]/_components/file-list-client';
import ImageGalleryClient from '@/app/dashboard/items/[type]/_components/image-gallery-client';
import ItemsGridClient from '@/app/dashboard/items/[type]/_components/items-grid-client';
import EmptyState from '@/components/shared/empty-state';
import { prisma } from '@/lib/db';

const CollectionItems = async ({
  userId,
  collectionId,
}: {
  userId: string;
  collectionId: string;
}) => {
  const items = await prisma.item.findMany({
    where: {
      userId,
      collections: { some: { id: collectionId } },
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      fileUrl: true,
      fileName: true,
      fileSize: true,
      isPinned: true,
      isFavorite: true,
      createdAt: true,
      type: { select: { name: true, color: true } },
      tags: { select: { tag: { select: { name: true } } } },
    },
  });

  if (items.length === 0) {
    return (
      <EmptyState
        icon={FaRegFolderOpen}
        title='No items in this collection'
        description='Add items to this collection when creating or editing them.'
      />
    );
  }

  const images = items.filter((item) => item.type.name === 'image');
  const files = items.filter((item) => item.type.name === 'file');
  const others = items.filter(
    (item) => item.type.name !== 'image' && item.type.name !== 'file',
  );

  return (
    <div className='flex flex-col gap-8'>
      {images.length > 0 && (
        <section>
          <h3 className='mb-3 text-base font-semibold'>Images</h3>
          <ImageGalleryClient items={images} />
        </section>
      )}
      {files.length > 0 && (
        <section>
          <h3 className='mb-3 text-base font-semibold'>Files</h3>
          <FileListClient items={files} />
        </section>
      )}
      {others.length > 0 && (
        <section>
          <ItemsGridClient items={others} />
        </section>
      )}
    </div>
  );
};

export default CollectionItems;
