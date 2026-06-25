import { VscPinned } from 'react-icons/vsc';
import { Card } from '@/components/ui/card';
import EmptyState from '@/components/shared/empty-state';
import { prisma } from '@/lib/db';
import ItemRow from './item-row';

const PinnedItems = async ({ userId }: { userId: string }) => {
  const pinnedItems = await prisma.item.findMany({
    where: { userId, isPinned: true },
    orderBy: { updatedAt: 'desc' },
    include: {
      type: { select: { name: true, color: true } },
      tags: { include: { tag: { select: { name: true } } } },
    },
  });

  return (
    <section>
      <h3 className='mb-3 flex items-center gap-1.5 text-sm font-medium text-muted-foreground'>
        <VscPinned className='size-4' />
        Pinned
      </h3>
      {pinnedItems.length === 0 ? (
        <EmptyState
          icon={VscPinned}
          title='No pinned items'
          description='Pin items you use often to find them here quickly.'
        />
      ) : (
        <Card className='py-0'>
          {pinnedItems.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </Card>
      )}
    </section>
  );
};

export default PinnedItems;
