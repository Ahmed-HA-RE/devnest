'use client';

import { useState } from 'react';

import ItemDrawer from '@/components/shared/item-drawer';
import { Card } from '@/components/ui/card';
import ItemRow, { type ItemWithRelations } from './item-row';

const ItemsListClient = ({ items }: { items: ItemWithRelations[] }) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  return (
    <>
      <Card className='py-0 gap-0'>
        {items.map((item) => (
          <ItemRow key={item.id} item={item} onSelect={setSelectedItemId} />
        ))}
      </Card>
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

export default ItemsListClient;
