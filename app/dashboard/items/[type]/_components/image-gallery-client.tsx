'use client';

import { useState } from 'react';

import ItemDrawer from '@/components/shared/item-drawer';
import ImageGalleryCard, { type ImageGalleryCardData } from './image-gallery-card';

const ImageGalleryClient = ({ items }: { items: ImageGalleryCardData[] }) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  return (
    <>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {items.map((item) => (
          <ImageGalleryCard
            key={item.id}
            item={item}
            onSelect={setSelectedItemId}
          />
        ))}
      </div>
      <ItemDrawer
        itemId={selectedItemId}
        open={!!selectedItemId}
        onOpenChange={(open) => {
          if (!open) setSelectedItemId(null);
        }}
      />
    </>
  );
};

export default ImageGalleryClient;