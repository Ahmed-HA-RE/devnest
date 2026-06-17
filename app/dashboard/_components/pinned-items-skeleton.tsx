import { VscPinned } from 'react-icons/vsc';

import { Card } from '@/components/ui/card';
import ItemRowSkeleton from './item-row-skeleton';

const PinnedItemsSkeleton = () => (
  <section>
    <h3 className='mb-3 flex items-center gap-1.5 text-sm font-medium text-muted-foreground'>
      <VscPinned className='size-4' />
      Pinned
    </h3>
    <Card className='py-0'>
      {Array.from({ length: 4 }).map((_, i) => (
        <ItemRowSkeleton key={i} />
      ))}
    </Card>
  </section>
);

export default PinnedItemsSkeleton;
