import { VscPinned } from 'react-icons/vsc';
import { Card } from '@/components/ui/card';
import { CURRENT_USER_ID } from '@/lib/constants/app';
import { prisma } from '@/lib/db';
import ItemRow from './item-row';

const PinnedItems = async () => {
  const pinnedItems = await prisma.item.findMany({
    where: { userId: CURRENT_USER_ID, isPinned: true },
    orderBy: { updatedAt: 'desc' },
    include: {
      type: { select: { name: true, color: true } },
      tags: { include: { tag: { select: { name: true } } } },
    },
  });

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
