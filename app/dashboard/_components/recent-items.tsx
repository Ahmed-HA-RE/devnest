import { Card } from '@/components/ui/card';
import { items } from '@/lib/mock-data';
import ItemRow from './item-row';

const RECENT_ITEMS_COUNT = 10;

const recentItems = [...items]
  .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  .slice(0, RECENT_ITEMS_COUNT);

const RecentItems = () => {
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
