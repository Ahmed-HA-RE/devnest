import { Card } from '@/components/ui/card';
import { CURRENT_USER_ID } from '@/lib/constants/app';
import { prisma } from '@/lib/db';
import ItemRow from './item-row';

const RECENT_ITEMS_COUNT = 10;

const RecentItems = async () => {
  const recentItems = await prisma.item.findMany({
    where: { userId: CURRENT_USER_ID },
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
      <Card className='py-0'>
        {recentItems.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </Card>
    </section>
  );
};

export default RecentItems;
