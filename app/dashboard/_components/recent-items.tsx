import { FiPackage } from 'react-icons/fi';

import { Card } from '@/components/ui/card';
import EmptyState from '@/components/shared/empty-state';
import { prisma } from '@/lib/db';
import ItemRow from './item-row';

const RECENT_ITEMS_COUNT = 10;

const RecentItems = async ({ userId }: { userId: string }) => {
  const recentItems = await prisma.item.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: RECENT_ITEMS_COUNT,
    include: {
      type: { select: { name: true, color: true } },
      tags: { include: { tag: { select: { name: true } } } },
    },
  });

  return (
    <section>
      <h3 className='mb-3 text-sm font-medium text-muted-foreground'>
        Recent Items
      </h3>
      {recentItems.length === 0 ? (
        <EmptyState
          icon={FiPackage}
          title='No items yet'
          description='Items you create will show up here.'
        />
      ) : (
        <Card className='py-0'>
          {recentItems.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </Card>
      )}
    </section>
  );
};

export default RecentItems;
