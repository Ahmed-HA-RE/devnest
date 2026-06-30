'use client';

import { useState } from 'react';

import ItemDrawer from '@/components/shared/item-drawer';
import FileListCard, { type FileListCardData } from './file-list-card';

const FileListClient = ({ items }: { items: FileListCardData[] }) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  return (
    <>
      <div className='flex flex-col gap-3'>
        {items.map((item) => (
          <FileListCard key={item.id} item={item} onSelect={setSelectedItemId} />
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

export default FileListClient;