import { VscPinned } from 'react-icons/vsc';

import { Card } from '@/components/ui/card';
import { items } from '@/lib/mock-data';
import ItemRow from './item-row';

const pinnedItems = items.filter((item) => item.isPinned);

const PinnedItems = () => {
  if (pinnedItems.length === 0) return null;

  return (
    <section>
      <h3 className='mb-3 flex items-center gap-1.5 text-sm font-medium text-muted-foreground'>
        <VscPinned className='size-4' />
        Pinned
      </h3>
      <Card className='py-0'>
        {pinnedItems.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </Card>
    </section>
  );
};

export default PinnedItems;
