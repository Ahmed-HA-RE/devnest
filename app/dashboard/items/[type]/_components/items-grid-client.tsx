'use client';

import { useState } from 'react';

import ItemCard, { type ItemCardData } from './item-card';
import ItemDrawer from './item-drawer';

const ItemsGridClient = ({ items }: { items: ItemCardData[] }) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  return (
    <>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {items.map((item) => (
          <ItemCard key={item.id} item={item} onSelect={setSelectedItemId} />
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

export default ItemsGridClient;